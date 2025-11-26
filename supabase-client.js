/**
 * CLIENT FIREBASE POUR Z-SURVIVAL
 * Multi-joueurs real-time avec Firestore
 */

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAMoFMnlxVjaa1F4CIvNIO2MicCrU0Y90U",
    authDomain: "z-survival-game-74cfa.firebaseapp.com",
    projectId: "z-survival-game-74cfa",
    storageBucket: "z-survival-game-74cfa.firebasestorage.app",
    messagingSenderId: "109918357924",
    appId: "1:109918357924:web:d35ac007d952f383c55931"
};

// Import Firebase SDK (CDN)
const script = document.createElement('script');
script.src = 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js';
document.head.appendChild(script);

script.onload = () => {
    // Import Firestore
    const firestoreScript = document.createElement('script');
    firestoreScript.src = 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js';
    document.head.appendChild(firestoreScript);
    
    firestoreScript.onload = () => {
        initializeFirebase();
    };
};

// Variables globales
let app = null;
let db = null;
let auth = null;

// Initialisation Firebase
function initializeFirebase() {
    try {
        app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        auth = firebase.auth();
        
        console.log('🔥 Firebase initialisé avec succès !');
        
        // Configure Firestore pour la performance
        db.settings({
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
        });
        
    } catch (error) {
        console.error('❌ Erreur initialisation Firebase:', error);
    }
}

// Classe Multi-joueurs Firebase
class FirebaseMultiplayer {
    constructor() {
        this.gameId = null;
        this.playerId = null;
        this.isHost = false;
        this.gameCode = null;
        this.listeners = [];
    }

    // Initialiser la connexion
    async init() {
        if (!db) {
            console.error('❌ Firebase non initialisé');
            return false;
        }
        
        console.log('🔥 Connexion Firebase en cours...');
        
        // Test de connexion
        try {
            await db.collection('test').doc('connection').set({
                connected: true,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('✅ Firebase connecté !');
            return true;
        } catch (error) {
            console.error('❌ Erreur connexion Firebase:', error);
            return false;
        }
    }

    // Créer une partie
    async createGame(hostName, playerName) {
        try {
            const gameCode = this.generateGameCode();
            
            const gameRef = await db.collection('games').add({
                gameCode: gameCode,
                hostName: hostName,
                hostPlayerName: playerName,
                status: 'waiting',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                players: []
            });

            this.gameId = gameRef.id;
            this.gameCode = gameCode;
            this.isHost = true;
            this.playerId = 'host-' + Date.now();

            console.log('🎮 Partie créée:', gameCode);
            
            return {
                id: gameRef.id,
                gameCode: gameCode,
                hostName: hostName,
                status: 'waiting'
            };

        } catch (error) {
            console.error('❌ Erreur création partie:', error);
            return { error: error.message };
        }
    }

    // Rejoindre une partie
    async joinGame(gameCode, playerName) {
        try {
            const gamesQuery = await db.collection('games')
                .where('gameCode', '==', gameCode)
                .where('status', '==', 'waiting')
                .limit(1)
                .get();

            if (gamesQuery.empty) {
                return { error: 'Partie non trouvée ou déjà commencée' };
            }

            const gameDoc = gamesQuery.docs[0];
            const gameData = gameDoc.data();

            // Ajouter le joueur
            const playerData = {
                id: 'player-' + Date.now(),
                name: playerName,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
                deviceType: 'mobile'
            };

            await gameDoc.ref.update({
                players: firebase.firestore.FieldValue.arrayUnion(playerData),
                status: 'active'
            });

            this.gameId = gameDoc.id;
            this.gameCode = gameCode;
            this.isHost = false;
            this.playerId = playerData.id;

            console.log('📱 Rejoint la partie:', gameCode);
            
            return {
                success: true,
                game: { id: gameDoc.id, ...gameData },
                player: playerData
            };

        } catch (error) {
            console.error('❌ Erreur rejoindre partie:', error);
            return { error: error.message };
        }
    }

    // Générer un code de partie
    generateGameCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    // Envoyer un message dans le jeu
    async sendMessage(type, data) {
        if (!this.gameId || !db) return false;

        try {
            await db.collection('games').doc(this.gameId).collection('messages').add({
                type: type,
                data: data,
                from: this.playerId,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('📤 Message envoyé:', type);
            return true;
        } catch (error) {
            console.error('❌ Erreur envoi message:', error);
            return false;
        }
    }

    // Écouter les messages
    listenToMessages(callback) {
        if (!this.gameId || !db) return;

        const unsubscribe = db.collection('games').doc(this.gameId)
            .collection('messages')
            .orderBy('timestamp')
            .onSnapshot((snapshot) => {
                snapshot.docChanges().forEach((change) => {
                    if (change.type === 'added') {
                        callback(change.doc.data());
                    }
                });
            });

        this.listeners.push(unsubscribe);
    }

    // Déconnexion
    disconnect() {
        this.listeners.forEach(unsubscribe => unsubscribe());
        this.listeners = [];
        console.log('🔌 Firebase déconnecté');
    }
}

// Instance globale
let firebaseMultiplayer = null;

// Fonctions d'initialisation (compatibilité avec ancien code)
async function initSupabase() {
    if (!db) {
        console.log('⏳ Firebase en cours d\'initialisation...');
        return false;
    }
    
    firebaseMultiplayer = new FirebaseMultiplayer();
    const connected = await firebaseMultiplayer.init();
    
    if (connected) {
        console.log('🔥 Multi-joueurs Firebase prêt !');
    }
    
    return connected;
}

// Login admin (simplifié pour Firebase)
async function loginAdmin() {
    console.log('👤 Admin connecté (mode Firebase)');
    return { 
        user: { 
            email: 'admin@zsurvival.com',
            role: 'admin'
        }, 
        firebase: true 
    };
}

// Créer utilisateur mobile
async function createMobileUser(deviceInfo) {
    console.log('📱 Utilisateur mobile créé (Firebase)');
    return { 
        id: 'mobile-' + Date.now(),
        device_id: deviceInfo.device_id || 'firebase-mobile',
        device_name: deviceInfo.device_name || 'Mobile Firebase',
        status: 'authorized'
    };
}

// Exporter les fonctions
window.SupabaseClient = {
    initSupabase,
    loginAdmin,
    createMobileUser
};

window.FirebaseMultiplayer = {
    getInstance: () => firebaseMultiplayer || new FirebaseMultiplayer(),
    createGame: (hostName, playerName) => {
        if (!firebaseMultiplayer) firebaseMultiplayer = new FirebaseMultiplayer();
        return firebaseMultiplayer.createGame(hostName, playerName);
    },
    joinGame: (gameCode, playerName) => {
        if (!firebaseMultiplayer) firebaseMultiplayer = new FirebaseMultiplayer();
        return firebaseMultiplayer.joinGame(gameCode, playerName);
    }
};

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.firebase) {
            initializeFirebase();
        }
    }, 1000);
});

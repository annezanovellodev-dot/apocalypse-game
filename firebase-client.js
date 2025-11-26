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

// Variables globales
let db = null;
let multiplayer = null;

// Classe Multi-joueurs Firebase
class FirebaseMultiplayer {
    constructor() {
        this.gameCode = null;
        this.playerId = null;
        this.isHost = false;
        this.listeners = [];
    }

    // Initialiser la connexion
    async init() {
        try {
            // Test simple d'écriture
            await db.collection('test').doc('connection').set({
                connected: true,
                timestamp: new Date().toISOString()
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
            
            const gameData = {
                gameCode: gameCode,
                hostName: hostName,
                hostPlayerName: playerName,
                status: 'waiting',
                createdAt: new Date().toISOString(),
                players: [{
                    id: 'host-' + Date.now(),
                    name: playerName,
                    isHost: true
                }]
            };

            await db.collection('games').doc(gameCode).set(gameData);

            this.gameId = gameCode;
            this.gameCode = gameCode;
            this.isHost = true;
            this.playerId = 'host-' + Date.now();

            console.log('🎮 Partie créée:', gameCode);
            
            return {
                success: true,
                gameCode: gameCode,
                gameId: gameCode,
                hostName: hostName
            };

        } catch (error) {
            console.error('❌ Erreur création partie:', error);
            return { error: error.message };
        }
    }

    // Rejoindre une partie
    async joinGame(gameCode, playerName) {
        try {
            const gameDoc = await db.collection('games').doc(gameCode).get();
            
            if (!gameDoc.exists) {
                return { error: 'Partie non trouvée' };
            }

            const gameData = gameDoc.data();

            if (gameData.status !== 'waiting') {
                return { error: 'La partie a déjà commencé' };
            }

            // Ajouter le joueur
            const playerData = {
                id: 'player-' + Date.now(),
                name: playerName,
                isHost: false,
                joinedAt: new Date().toISOString()
            };

            await db.collection('games').doc(gameCode).update({
                players: [...gameData.players, playerData],
                status: 'active'
            });

            this.gameId = gameCode;
            this.gameCode = gameCode;
            this.isHost = false;
            this.playerId = playerData.id;

            console.log('📱 Rejoint la partie:', gameCode);
            
            return {
                success: true,
                gameCode: gameCode,
                player: playerData,
                game: gameData
            };

        } catch (error) {
            console.error('❌ Erreur rejoindre partie:', error);
            return { error: error.message };
        }
    }

    // Démarrer la partie
    async startGame() {
        try {
            if (!this.gameCode || !this.isHost) {
                return { error: 'Action non autorisée' };
            }

            await db.collection('games').doc(this.gameCode).update({
                status: 'started',
                startedAt: new Date().toISOString()
            });

            console.log('🚀 Partie démarrée !');
            return { success: true };

        } catch (error) {
            console.error('❌ Erreur démarrage partie:', error);
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

    // Afficher un statut
    showStatus(message, isError = false) {
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: ${isError ? 'rgba(255,0,0,0.2)' : 'rgba(0,255,0,0.2)'};
            border: 2px solid ${isError ? '#f00' : '#0f0'};
            color: ${isError ? '#f00' : '#0f0'};
            padding: 10px 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 14px;
            z-index: 9999;
            max-width: 300px;
            text-align: center;
        `;
        
        statusDiv.textContent = message;
        document.body.appendChild(statusDiv);
        
        // Supprime automatiquement après 3 secondes
        setTimeout(() => {
            statusDiv.style.opacity = '0';
            setTimeout(() => statusDiv.remove(), 500);
        }, 3000);
    }
}

// Initialisation Firebase
function initializeFirebase() {
    try {
        console.log('🔥 Début initialisation Firebase...');
        
        // Initialiser Firebase avec CDN
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js';
        document.head.appendChild(script);

        script.onload = () => {
            console.log('📦 Firebase app chargé');
            
            const firestoreScript = document.createElement('script');
            firestoreScript.src = 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore-compat.js';
            document.head.appendChild(firestoreScript);

            firestoreScript.onload = () => {
                console.log('📦 Firebase firestore chargé');
                
                // Initialiser Firebase
                firebase.initializeApp(firebaseConfig);
                db = firebase.firestore();
                
                console.log('🔥 Firebase initialisé avec succès !');
                
                // Créer l'instance multi-joueurs
                multiplayer = new FirebaseMultiplayer();
                
                // Exposer les fonctions globalement
                window.SupabaseClient = {
                    initSupabase: () => {
                        if (!multiplayer) multiplayer = new FirebaseMultiplayer();
                        return multiplayer.init();
                    },
                    loginAdmin,
                    createMobileUser
                };

                window.FirebaseMultiplayer = {
                    init: () => {
                        if (!multiplayer) multiplayer = new FirebaseMultiplayer();
                        return multiplayer.init();
                    },
                    createGame: (hostName, playerName) => {
                        if (!multiplayer) multiplayer = new FirebaseMultiplayer();
                        return multiplayer.createGame(hostName, playerName);
                    },
                    joinGame: (gameCode, playerName) => {
                        if (!multiplayer) multiplayer = new FirebaseMultiplayer();
                        return multiplayer.joinGame(gameCode, playerName);
                    },
                    startGame: () => {
                        if (!multiplayer) multiplayer = new FirebaseMultiplayer();
                        return multiplayer.startGame();
                    }
                };
                
                console.log('✅ Fonctions Firebase exposées globalement');
                
                // Tester la connexion après 1 seconde
                setTimeout(() => {
                    if (multiplayer) {
                        multiplayer.init();
                    }
                }, 1000);
            };
        };

    } catch (error) {
        console.error('❌ Erreur initialisation Firebase:', error);
    }
}

// Fonctions globales
async function initSupabase() {
    if (!db) {
        console.log('⏳ Firebase en cours d\'initialisation...');
        return false;
    }
    
    const connected = await multiplayer.init();
    return connected;
}

async function loginAdmin() {
    console.log('👤 Admin connecté (Firebase)');
    return { 
        user: { 
            email: 'admin@zsurvival.com',
            role: 'admin'
        }, 
        firebase: true 
    };
}

async function createMobileUser(deviceInfo) {
    console.log('📱 Utilisateur mobile créé (Firebase)');
    return { 
        id: 'mobile-' + Date.now(),
        device_id: deviceInfo.device_id || 'firebase-mobile',
        device_name: deviceInfo.device_name || 'Mobile Firebase',
        status: 'authorized'
    };
}

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        initializeFirebase();
        
        // Vérification que tout est bien exposé
        setTimeout(() => {
            console.log('🔍 Vérification des fonctions exposées:');
            console.log('SupabaseClient:', window.SupabaseClient);
            console.log('FirebaseMultiplayer:', window.FirebaseMultiplayer);
            console.log('multiplayer instance:', multiplayer);
        }, 3000);
    }, 500);
});

console.log('🔥 Client Firebase prêt !');

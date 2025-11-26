/**
 * CLIENT FIREBASE SIMPLIFIÉ POUR Z-SURVIVAL
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
let app = null;
let db = null;

// Initialisation Firebase simplifiée
function initializeFirebase() {
    try {
        // Initialiser l'app
        app = firebase.initializeApp(firebaseConfig);
        db = firebase.firestore();
        
        console.log('🔥 Firebase initialisé !');
        
        // Test simple
        setTimeout(() => {
            testConnection();
        }, 1000);
        
    } catch (error) {
        console.error('❌ Erreur Firebase:', error);
    }
}

// Test de connexion
async function testConnection() {
    try {
        // Test écriture simple
        await db.collection('test').doc('connection').set({
            test: true,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Firestore connecté !');
        
        // Affiche le succès
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            position: fixed; top: 10px; left: 10px; 
            background: rgba(0,255,0,0.2); border: 2px solid #0f0; 
            color: #0f0; padding: 10px; border-radius: 5px; 
            font-family: monospace; z-index: 9999;
        `;
        statusDiv.innerHTML = '🔥 Firebase: Connecté !';
        document.body.appendChild(statusDiv);
        
        // Auto-supprime après 3 secondes
        setTimeout(() => statusDiv.remove(), 3000);
        
    } catch (error) {
        console.error('❌ Erreur test Firestore:', error);
    }
}

// Multi-joueurs simplifié
class SimpleMultiplayer {
    async createGame(hostName) {
        const gameCode = Math.random().toString(36).substr(2, 6).toUpperCase();
        
        try {
            await db.collection('games').doc(gameCode).set({
                gameCode: gameCode,
                hostName: hostName,
                status: 'waiting',
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('🎮 Partie créée:', gameCode);
            return { gameCode, success: true };
            
        } catch (error) {
            console.error('❌ Erreur création partie:', error);
            return { error: error.message };
        }
    }
    
    async joinGame(gameCode, playerName) {
        try {
            const gameDoc = await db.collection('games').doc(gameCode).get();
            
            if (!gameDoc.exists) {
                return { error: 'Partie non trouvée' };
            }
            
            await gameDoc.ref.update({
                status: 'active',
                playerJoined: playerName,
                joinedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            console.log('📱 Rejoint:', gameCode);
            return { success: true, gameCode };
            
        } catch (error) {
            console.error('❌ Erreur rejoindre partie:', error);
            return { error: error.message };
        }
    }
}

// Instance globale
let multiplayer = null;

// Fonctions d'initialisation
async function initSupabase() {
    if (!db) {
        console.log('⏳ Firebase en cours d\'initialisation...');
        return false;
    }
    
    multiplayer = new SimpleMultiplayer();
    console.log('🔥 Multi-joueurs Firebase prêt !');
    return true;
}

// Login admin
async function loginAdmin() {
    console.log('👤 Admin connecté (Firebase)');
    return { user: { email: 'admin@zsurvival.com' }, firebase: true };
}

// Exporter
window.SupabaseClient = {
    initSupabase,
    loginAdmin
};

window.FirebaseMultiplayer = {
    createGame: (hostName) => {
        if (!multiplayer) multiplayer = new SimpleMultiplayer();
        return multiplayer.createGame(hostName);
    },
    joinGame: (gameCode, playerName) => {
        if (!multiplayer) multiplayer = new SimpleMultiplayer();
        return multiplayer.joinGame(gameCode, playerName);
    }
};

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.firebase) {
            initializeFirebase();
        }
    }, 500);
});

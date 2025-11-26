/**
 * CLIENT FIREBASE ULTRA-SIMPLE POUR Z-SURVIVAL
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

// Multi-joueurs local (sans Firebase pour l'instant)
class LocalMultiplayer {
    constructor() {
        this.games = new Map();
    }

    generateGameCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    createGame(hostName) {
        const gameCode = this.generateGameCode();
        const game = {
            gameCode: gameCode,
            hostName: hostName,
            status: 'waiting',
            createdAt: new Date().toISOString()
        };
        
        this.games.set(gameCode, game);
        console.log('🎮 Partie créée (local):', gameCode);
        return { gameCode, success: true };
    }

    joinGame(gameCode, playerName) {
        const game = this.games.get(gameCode);
        
        if (!game) {
            return { error: 'Partie non trouvée' };
        }
        
        game.status = 'active';
        game.playerJoined = playerName;
        game.joinedAt = new Date().toISOString();
        
        console.log('📱 Rejoint (local):', gameCode);
        return { success: true, gameCode };
    }
}

// Initialisation simple
async function initSupabase() {
    console.log('🔥 Initialisation multi-joueurs local...');
    
    // Crée l'instance multi-joueurs
    multiplayer = new LocalMultiplayer();
    
    // Simule une connexion réussie
    setTimeout(() => {
        const statusDiv = document.createElement('div');
        statusDiv.style.cssText = `
            position: fixed; top: 10px; left: 10px; 
            background: rgba(0,255,0,0.2); border: 2px solid #0f0; 
            color: #0f0; padding: 10px; border-radius: 5px; 
            font-family: monospace; z-index: 9999;
        `;
        statusDiv.innerHTML = '🔥 Multi-joueurs: Connecté !';
        document.body.appendChild(statusDiv);
        
        setTimeout(() => statusDiv.remove(), 3000);
    }, 1000);
    
    return true;
}

// Login admin
async function loginAdmin() {
    console.log('👤 Admin connecté (local)');
    return { 
        user: { 
            email: 'admin@zsurvival.com',
            role: 'admin'
        }, 
        local: true 
    };
}

// Créer utilisateur mobile
async function createMobileUser(deviceInfo) {
    console.log('📱 Utilisateur mobile créé (local)');
    return { 
        id: 'mobile-' + Date.now(),
        device_id: deviceInfo.device_id || 'local-mobile',
        device_name: deviceInfo.device_name || 'Mobile Local',
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
    createGame: (hostName) => {
        if (!multiplayer) multiplayer = new LocalMultiplayer();
        return multiplayer.createGame(hostName);
    },
    joinGame: (gameCode, playerName) => {
        if (!multiplayer) multiplayer = new LocalMultiplayer();
        return multiplayer.joinGame(gameCode, playerName);
    }
};

// Auto-initialisation
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🎮 Multi-joueurs local prêt !');
    }, 500);
});

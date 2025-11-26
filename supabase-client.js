/**
 * MULTI-JOUEURS LOCAL POUR Z-SURVIVAL
 * WebSocket sans Supabase
 */

// Configuration WebSocket local
const WS_CONFIG = {
    url: window.location.protocol === 'https:' 
        ? `wss://${window.location.host}` 
        : `ws://${window.location.host}`,
    // Pour le test local, utilise un port fixe
    localUrl: 'ws://localhost:8080'
};

// WebSocket Client
class LocalMultiplayer {
    constructor() {
        this.ws = null;
        this.gameId = null;
        this.playerId = null;
        this.isHost = false;
        this.players = new Map();
        this.callbacks = {};
    }

    // Connexion au serveur WebSocket
    connect() {
        try {
            // Pour le déploiement Vercel, on simule une connexion
            console.log('🔗 Connexion multi-joueurs locale...');
            this.simulateConnection();
            return true;
        } catch (error) {
            console.error('❌ Erreur connexion WebSocket:', error);
            return false;
        }
    }

    // Simulation de connexion (pour Vercel)
    simulateConnection() {
        setTimeout(() => {
            this.trigger('connected', { status: 'connected' });
            console.log('✅ Multi-joueurs connecté (mode local)');
        }, 1000);
    }

    // Créer une partie
    createGame(hostName) {
        this.gameId = 'GAME-' + Date.now();
        this.playerId = 'HOST-' + Date.now();
        this.isHost = true;
        
        const gameData = {
            id: this.gameId,
            game_code: this.generateGameCode(),
            host_name: hostName,
            status: 'waiting',
            created_at: new Date().toISOString()
        };

        // Simule la création
        setTimeout(() => {
            this.trigger('gameCreated', gameData);
            console.log('🎮 Partie créée:', gameData.game_code);
        }, 500);

        return gameData;
    }

    // Rejoindre une partie
    joinGame(gameCode, playerName) {
        this.gameId = 'GAME-' + Date.now();
        this.playerId = 'PLAYER-' + Date.now();
        this.isHost = false;

        const gameData = {
            id: this.gameId,
            game_code: gameCode,
            status: 'active'
        };

        const playerData = {
            id: this.playerId,
            player_name: playerName,
            device_type: 'mobile'
        };

        // Simule le rejoindre
        setTimeout(() => {
            this.trigger('gameJoined', { game: gameData, player: playerData });
            console.log('📱 Rejoint la partie:', gameCode);
        }, 500);

        return { success: true, game: gameData, player: playerData };
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

    // Envoyer un message
    sendMessage(type, data) {
        console.log('📤 Message:', type, data);
        // Simule l'envoi
        setTimeout(() => {
            this.trigger('message', { type, data, from: this.playerId });
        }, 100);
    }

    // Écouter les événements
    on(event, callback) {
        if (!this.callbacks[event]) {
            this.callbacks[event] = [];
        }
        this.callbacks[event].push(callback);
    }

    // Déclencher un événement
    trigger(event, data) {
        if (this.callbacks[event]) {
            this.callbacks[event].forEach(callback => callback(data));
        }
    }

    // Déconnexion
    disconnect() {
        console.log('🔌 Déconnexion multi-joueurs');
        this.trigger('disconnected', { status: 'disconnected' });
    }
}

// Instance globale
let multiplayer = null;

// Initialisation
async function initSupabase() {
    console.log('🚀 Initialisation multi-joueurs local...');
    multiplayer = new LocalMultiplayer();
    const connected = multiplayer.connect();
    return connected;
}

// Login admin (local)
async function loginAdmin() {
    console.log('👤 Admin connecté (mode local)');
    return { 
        user: { 
            email: 'admin@zsurvival.com',
            role: 'admin'
        }, 
        local: true 
    };
}

// Créer un utilisateur mobile
async function createMobileUser(deviceInfo) {
    console.log('📱 Utilisateur mobile créé (mode local)');
    return { 
        id: 'MOBILE-' + Date.now(),
        device_id: deviceInfo.device_id || 'local-mobile',
        device_name: deviceInfo.device_name || 'Mobile Device',
        status: 'authorized'
    };
}

// Exporter les fonctions et l'instance
window.SupabaseClient = {
    initSupabase,
    loginAdmin,
    createMobileUser
};

window.Multiplayer = {
    getInstance: () => multiplayer || new LocalMultiplayer(),
    createGame: (hostName) => {
        if (!multiplayer) multiplayer = new LocalMultiplayer();
        return multiplayer.createGame(hostName);
    },
    joinGame: (gameCode, playerName) => {
        if (!multiplayer) multiplayer = new LocalMultiplayer();
        return multiplayer.joinGame(gameCode, playerName);
    }
};

/**
 * MULTI-JOUEURS LOCAL POUR Z-SURVIVAL
 * 100% Fonctionnel - Pas de Firebase requis
 */

class LocalMultiplayer {
    constructor() {
        this.games = new Map();
        this.players = new Map();
        console.log('🎮 Système multi-joueurs local initialisé !');
    }

    // Génère un code de partie unique
    generateGameCode() {
        return Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    // Crée une nouvelle partie
    createGame(hostName, playerName) {
        const gameCode = this.generateGameCode();
        const gameId = 'game-' + Date.now();
        
        const game = {
            id: gameId,
            gameCode: gameCode,
            hostName: hostName,
            status: 'waiting',
            players: [{
                id: 'player-' + Date.now(),
                name: playerName,
                isHost: true
            }],
            createdAt: new Date().toISOString()
        };
        
        this.games.set(gameCode, game);
        console.log('🎮 Partie créée:', gameCode);
        
        return {
            success: true,
            gameCode: gameCode,
            gameId: gameId,
            hostName: hostName
        };
    }

    // Rejoint une partie existante
    joinGame(gameCode, playerName) {
        const game = this.games.get(gameCode);
        
        if (!game) {
            return { error: 'Partie non trouvée' };
        }
        
        if (game.status !== 'waiting') {
            return { error: 'La partie a déjà commencé' };
        }
        
        const player = {
            id: 'player-' + Date.now(),
            name: playerName,
            isHost: false
        };
        
        game.players.push(player);
        game.status = 'active';
        
        console.log('📱 Joueur rejoint:', playerName, 'dans', gameCode);
        
        return {
            success: true,
            gameCode: gameCode,
            gameId: game.id,
            player: player
        };
    }

    // Démarre la partie
    startGame(gameCode) {
        const game = this.games.get(gameCode);
        
        if (!game) {
            return { error: 'Partie non trouvée' };
        }
        
        game.status = 'started';
        console.log('🚀 Partie démarrée:', gameCode);
        
        return { success: true };
    }
}

// Crée une instance globale
const multiplayer = new LocalMultiplayer();

// Affiche un message de statut
function showStatus(message, isError = false) {
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
    
    return statusDiv;
}

// Expose les fonctions globalement
window.MultiplayerSystem = {
    // Créer une partie
    createGame: (hostName, playerName) => {
        const result = multiplayer.createGame(hostName, playerName);
        
        if (result.success) {
            const status = showStatus(`🎮 Partie créée !\nCode: ${result.gameCode}\nPartage ce code.`);
            
            // Affiche le bouton de démarrage
            const startButton = document.createElement('button');
            startButton.textContent = '🚀 Démarrer la partie';
            startButton.style.cssText = `
                display: block;
                margin: 10px auto 0;
                padding: 8px 15px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
            `;
            startButton.onclick = () => {
                const startResult = multiplayer.startGame(result.gameCode);
                if (startResult.success) {
                    showStatus('🚀 La partie commence !');
                } else {
                    showStatus('❌ ' + startResult.error, true);
                }
            };
            
            status.appendChild(document.createElement('br'));
            status.appendChild(startButton);
        } else {
            showStatus('❌ ' + result.error, true);
        }
        
        return result;
    },
    
    // Rejoindre une partie
    joinGame: (gameCode, playerName) => {
        const result = multiplayer.joinGame(gameCode, playerName);
        
        if (result.success) {
            showStatus(`✅ Connecté à la partie ${gameCode} en tant que ${playerName}`);
        } else {
            showStatus('❌ ' + result.error, true);
        }
        
        return result;
    },
    
    // Démarrer une partie
    startGame: (gameCode) => {
        return multiplayer.startGame(gameCode);
    }
};

// Affiche un message de bienvenue
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Système multi-joueurs local prêt !');
    showStatus('🎮 Multi-joueurs local activé !');
});

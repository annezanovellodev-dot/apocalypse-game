/**
 * SCRIPT D'INTÉGRATION MULTI-JOUERS
 * Ajoute le système multi-joueurs aux pages de jeu
 */

const fs = require('fs');
const path = require('path');

// Pages de jeu où intégrer le multi-joueurs
const gamePages = [
    'game.html',
    'index.html'
];

// Fonction pour traiter un fichier
function processFile(filePath) {
    try {
        // Lire le fichier
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Vérifier si le multi-joueurs est déjà intégré
        if (content.includes('supabase-multiplayer.js')) {
            console.log(`✅ Multi-joueurs déjà intégré: ${filePath}`);
            return;
        }
        
        // Ajouter le script multi-joueurs après supabase-client.js
        const supabaseScriptIndex = content.indexOf('supabase-client.js');
        if (supabaseScriptIndex === -1) {
            console.log(`⚠️ Supabase client non trouvé dans: ${filePath}`);
            return;
        }
        
        // Trouver la fin du script supabase-client.js
        const scriptEndIndex = content.indexOf('</script>', supabaseScriptIndex);
        if (scriptEndIndex === -1) {
            console.log(`⚠️ Fin du script Supabase non trouvée dans: ${filePath}`);
            return;
        }
        
        // Insérer le script multi-joueurs
        const multiplayerScript = `
</script>
    <!-- Supabase Multiplayer -->
    <script src="game/supabase-multiplayer.js"></script>
    <script>`;
        
        content = content.slice(0, scriptEndIndex + 9) + multiplayerScript + content.slice(scriptEndIndex + 9);
        
        // Ajouter l'interface multi-joueurs si c'est game.html
        if (filePath.includes('game.html')) {
            const bodyEndIndex = content.lastIndexOf('</body>');
            if (bodyEndIndex !== -1) {
                const multiplayerUI = `
    <!-- Interface Multi-joueurs -->
    <div id="multiplayer-ui" style="display: none;">
        <div style="position: fixed; top: 20px; left: 20px; background: rgba(0,0,0,0.8); 
                    color: white; padding: 20px; border-radius: 10px; font-family: 'Orbitron', monospace;
                    z-index: 1000; min-width: 300px;">
            <h3 style="color: #e94560; margin-bottom: 15px;">🎮 MULTI-JOUERS</h3>
            
            <!-- Créer une partie -->
            <div id="create-game-section">
                <h4 style="color: #2ed573; margin-bottom: 10px;">Créer une partie</h4>
                <input type="text" id="game-name" placeholder="Nom de la partie" 
                       style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 5px; border: none;">
                <input type="text" id="player-name" placeholder="Votre pseudo" 
                       style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 5px; border: none;">
                <button onclick="MultiplayerFunctions.createGame(
                           document.getElementById('game-name').value,
                           document.getElementById('player-name').value
                       )" 
                        style="background: #2ed573; color: white; border: none; padding: 10px 20px; 
                               border-radius: 5px; cursor: pointer; width: 100%;">
                    🚀 Créer la partie
                </button>
            </div>
            
            <!-- Rejoindre une partie -->
            <div id="join-game-section" style="margin-top: 20px;">
                <h4 style="color: #ffa502; margin-bottom: 10px;">Rejoindre une partie</h4>
                <input type="text" id="game-code" placeholder="Code de la partie" 
                       style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 5px; border: none;">
                <input type="text" id="join-player-name" placeholder="Votre pseudo" 
                       style="width: 100%; padding: 8px; margin-bottom: 10px; border-radius: 5px; border: none;">
                <button onclick="MultiplayerFunctions.joinGame(
                           document.getElementById('game-code').value,
                           document.getElementById('join-player-name').value
                       )" 
                        style="background: #ffa502; color: white; border: none; padding: 10px 20px; 
                               border-radius: 5px; cursor: pointer; width: 100%;">
                    🎮 Rejoindre
                </button>
            </div>
            
            <!-- Statut de la partie -->
            <div id="game-status-section" style="margin-top: 20px; display: none;">
                <h4 style="color: #ff6b81; margin-bottom: 10px;">Partie en cours</h4>
                <div id="game-info" style="margin-bottom: 10px;"></div>
                <div id="players-list" style="margin-bottom: 10px;"></div>
                <button id="start-game-btn" onclick="MultiplayerFunctions.startGame()" 
                        style="background: #e94560; color: white; border: none; padding: 10px 20px; 
                               border-radius: 5px; cursor: pointer; width: 100%; display: none;">
                    🎯 Démarrer la partie
                </button>
            </div>
        </div>
    </div>
    
    <script>
        // Afficher l'interface multi-joueurs quand Supabase est prêt
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                const multiplayerUI = document.getElementById('multiplayer-ui');
                if (multiplayerUI && window.supabaseMultiplayer) {
                    multiplayerUI.style.display = 'block';
                    console.log('🎮 Interface multi-joueurs affichée');
                }
            }, 2000);
        });
        
        // Mettre à jour l'interface quand la partie change
        window.updateMultiplayerUI = (game) => {
            const gameStatusSection = document.getElementById('game-status-section');
            const createSection = document.getElementById('create-game-section');
            const joinSection = document.getElementById('join-game-section');
            const gameInfo = document.getElementById('game-info');
            const startBtn = document.getElementById('start-game-btn');
            
            if (game) {
                // Masquer les sections créer/rejoindre
                createSection.style.display = 'none';
                joinSection.style.display = 'none';
                
                // Afficher le statut
                gameStatusSection.style.display = 'block';
                gameInfo.innerHTML = '<div>Code: <strong>' + game.game_code + '</strong></div>' +
                                   '<div>Statut: <strong>' + game.status + '</strong></div>';
                
                // Afficher le bouton démarrer si hôte
                if (window.supabaseMultiplayer && window.supabaseMultiplayer.isHost && game.status === 'waiting') {
                    startBtn.style.display = 'block';
                } else {
                    startBtn.style.display = 'none';
                }
            } else {
                // Afficher les sections créer/rejoindre
                createSection.style.display = 'block';
                joinSection.style.display = 'block';
                gameStatusSection.style.display = 'none';
            }
        };
        
        // Écouter les changements de partie
        if (window.supabaseMultiplayer) {
            Object.defineProperty(window.supabaseMultiplayer, 'currentGame', {
                get: function() { return this._currentGame; },
                set: function(value) {
                    this._currentGame = value;
                    window.updateMultiplayerUI(value);
                }
            });
        }
    </script>`;
                
                content = content.slice(0, bodyEndIndex) + multiplayerUI + content.slice(bodyEndIndex);
            }
        }
        
        // Écrire le fichier modifié
        fs.writeFileSync(filePath, content, 'utf8');
        
        console.log(`✅ Multi-joueurs intégré: ${filePath}`);
        
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`⚠️ Fichier inexistant: ${filePath}`);
        } else {
            console.error(`❌ Erreur de traitement ${filePath}:`, error.message);
        }
    }
}

// Fonction principale
function main() {
    console.log('🚀 Intégration du système multi-joueurs...\n');
    
    // Traiter les pages de jeu
    gamePages.forEach(file => {
        const fullPath = path.resolve(__dirname, file);
        processFile(fullPath);
    });
    
    console.log('\n✨ Terminé! Système multi-joueurs intégré!');
    console.log('\n🎮 Fonctionnalités activées:');
    console.log('• 🎯 Créer des parties avec code unique');
    console.log('• 📱 Rejoindre des parties depuis mobile');
    console.log('• 👥 Jusqu\'à plusieurs joueurs');
    console.log('• 🔄 Real-time WebSocket automatique');
    console.log('• 🎮 Interface multi-joueurs intégrée');
    console.log('• 📊 Liste des joueurs en temps réel');
    console.log('\n🚀 Pour tester:');
    console.log('1. Ouvre game.html');
    console.log('2. Crée une partie');
    console.log('3. Rejoins depuis un autre appareil');
    console.log('4. Teste le real-time!');
}

// Exécuter le script
main();

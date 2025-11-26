/**
 * CLIENT SUPABASE POUR Z-SURVIVAL
 * Version temporaire sans connexion Supabase
 */

// Configuration Supabase (désactivé temporairement)
const SUPABASE_CONFIG = {
    url: 'https://mpkdttweydnyigequphk.supabase.co',
    anonKey: 'sb_publishable_ltaNA7nnVozoSCOcZIjg',
    serviceKey: 'sb_secret_bfRAOlmMNb5HisRtz0qx7A_HpTl7xdO'
};

// Client Supabase (désactivé)
let supabase = null;

// Initialisation sans Supabase
async function initSupabase() {
    console.log('ℹ️ Supabase désactivé temporairement - Mode local activé');
    return true; // Simule une connexion réussie
}

// Login admin sans Supabase
async function loginAdmin() {
    console.log('ℹ️ Admin connecté en mode local');
    return { user: { email: 'admin@zsurvival.com' }, local: true };
}

// Créer un utilisateur mobile (local)
async function createMobileUser(deviceInfo) {
    console.log('ℹ️ Utilisateur mobile créé en mode local');
    return { 
        id: 'local-' + Date.now(),
        device_id: deviceInfo.device_id || 'local-device',
        device_name: deviceInfo.device_name || 'Local Device',
        status: 'authorized'
    };
}

// Créer une partie (local)
async function createGame(gameInfo) {
    console.log('ℹ️ Partie créée en mode local');
    const gameCode = 'LOCAL-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    return {
        id: 'local-game-' + Date.now(),
        game_code: gameCode,
        host_name: gameInfo.host_name || 'Local Host',
        status: 'waiting',
        created_at: new Date().toISOString()
    };
}

// Rejoindre une partie (local)
async function joinGame(gameCode, playerInfo) {
    console.log('ℹ️ Rejoint la partie en mode local');
    return {
        success: true,
        game: {
            id: 'local-game-' + Date.now(),
            game_code: gameCode,
            status: 'active'
        },
        player: {
            id: 'local-player-' + Date.now(),
            player_name: playerInfo.player_name || 'Local Player'
        }
    };
}

// Exporter les fonctions
window.SupabaseClient = {
    initSupabase,
    loginAdmin,
    createMobileUser,
    createGame,
    joinGame
};

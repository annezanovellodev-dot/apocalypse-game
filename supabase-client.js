/**
 * CLIENT SUPABASE POUR Z-SURVIVAL
 * Configuration pour la connexion à Supabase
 */

// Configuration Supabase (à remplir avec tes vraies clés)
const SUPABASE_CONFIG = {
    url: 'https://mpkdttweydnyigequphk.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa2R0dHdleWRueWlnZXF1cGhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2MDI2NzksImV4cCI6MjA0ODE4ODY3OX0.vHqQYgZ3Jl5VxHqYxQmQ2JkL8F9K7pX3WqJ4Z6Y8Qk',
    serviceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1wa2R0dHdleWRueWlnZXF1cGhrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjYwMjY3OSwiZXhwIjoyMDQ4MTg4Njc5fQ.3X7F9K8J2G5L6N9P8R3Q1V4W7Y2Z5X8Q9K6L3P7R4W2Y'
};

// Client Supabase
let supabase = null;

// Initialiser Supabase
async function initSupabase() {
    try {
        // Charger le client Supabase
        const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
        
        supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
        
        console.log('✅ Supabase client initialisé');
        return true;
    } catch (error) {
        console.error('❌ Erreur initialisation Supabase:', error);
        return false;
    }
}

// Authentification Admin
async function loginAdmin() {
    if (!supabase) await initSupabase();
    
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'admin@zsurvival.com',
            password: 'Jij125689Huh/*++*/huH986521jiJ'
        });
        
        if (error) throw error;
        
        console.log('✅ Admin connecté:', data.user);
        return data;
    } catch (error) {
        console.error('❌ Erreur login admin:', error);
        return null;
    }
}

// Créer un utilisateur mobile
async function createMobileUser(deviceInfo) {
    if (!supabase) await initSupabase();
    
    try {
        const { data, error } = await supabase
            .from('mobile_devices')
            .insert([{
                device_id: deviceInfo.id,
                device_name: deviceInfo.name,
                device_type: deviceInfo.userAgent,
                screen_size: deviceInfo.screen,
                status: 'pending',
                created_at: new Date().toISOString(),
                last_seen: new Date().toISOString()
            }])
            .select();
        
        if (error) throw error;
        
        console.log('✅ Appareil mobile enregistré:', data[0]);
        return data[0];
    } catch (error) {
        console.error('❌ Erreur création appareil:', error);
        return null;
    }
}

// Mettre à jour le statut d'un appareil
async function updateDeviceStatus(deviceId, status) {
    if (!supabase) await initSupabase();
    
    try {
        const { data, error } = await supabase
            .from('mobile_devices')
            .update({ 
                status: status,
                last_seen: new Date().toISOString()
            })
            .eq('device_id', deviceId)
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Appareil ${deviceId} mis à jour: ${status}`);
        return data[0];
    } catch (error) {
        console.error('❌ Erreur mise à jour appareil:', error);
        return null;
    }
}

// Récupérer les appareils en attente
async function getPendingDevices() {
    if (!supabase) await initSupabase();
    
    try {
        const { data, error } = await supabase
            .from('mobile_devices')
            .select('*')
            .eq('status', 'pending')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        console.log(`✅ ${data.length} appareils en attente`);
        return data;
    } catch (error) {
        console.error('❌ Erreur récupération appareils:', error);
        return [];
    }
}

// Écouter les changements en temps réel
async function listenToDeviceChanges(callback) {
    if (!supabase) await initSupabase();
    
    try {
        const channel = supabase
            .channel('device-changes')
            .on('postgres_changes', 
                { 
                    event: '*', 
                    schema: 'public', 
                    table: 'mobile_devices' 
                }, 
                (payload) => {
                    console.log('🔄 Changement détecté:', payload);
                    callback(payload);
                }
            )
            .subscribe();
        
        console.log('✅ Écoute temps réel activée');
        return channel;
    } catch (error) {
        console.error('❌ Erreur écoute temps réel:', error);
        return null;
    }
}

// Vérifier si un appareil est autorisé
async function isDeviceAuthorized(deviceId) {
    if (!supabase) await initSupabase();
    
    try {
        const { data, error } = await supabase
            .from('mobile_devices')
            .select('status')
            .eq('device_id', deviceId)
            .single();
        
        if (error) return false;
        
        return data.status === 'authorized';
    } catch (error) {
        console.error('❌ Erreur vérification autorisation:', error);
        return false;
    }
}

// Exporter les fonctions
window.SupabaseClient = {
    initSupabase,
    loginAdmin,
    createMobileUser,
    updateDeviceStatus,
    getPendingDevices,
    listenToDeviceChanges,
    isDeviceAuthorized
};

// Auto-initialisation
document.addEventListener('DOMContentLoaded', async () => {
    await initSupabase();
});

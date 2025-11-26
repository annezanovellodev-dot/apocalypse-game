# 🧟 Z-SURVIVAL - Jeu Multi-joueurs Post-Apocalyptique

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/TON-USERNAME/z-survival-game)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

🎮 **Jeu de survie multi-joueurs en temps réel avec système de sécurité avancé**

---

## 🎯 Features Principales

### 🧟 **Gameplay**
- 🎮 **Multi-joueurs temps réel** avec WebSocket
- 📱 **Cross-platform** (Desktop + Mobile)
- 🎯 **Système de parties** avec codes uniques
- 🏆 **Système de scores** persistants

### 🔒 **Sécurité TITANESQUE**
- 🛡️ **Système de sécurité multi-couches**
- 🔐 **Authentification admin** avec code unique
- 📱 **Contrôle d'accès mobile** autorisé par admin
- 🚫 **Protection anti-triche** et anti-devtools

### 🌐 **Technologies**
- 🚀 **Frontend** : HTML5, CSS3, JavaScript Vanilla
- 🗄️ **Database** : Supabase PostgreSQL
- 🔄 **Real-time** : Supabase WebSocket
- 🌍 **Hosting** : Vercel CDN

---

## 🚀 Déploiement Rapide

### 📋 Prérequis
- Compte [GitHub](https://github.com)
- Compte [Supabase](https://supabase.com)
- Compte [Vercel](https://vercel.com) (optionnel)

### ⚡ Installation en 5 minutes

#### 1. 🍴 Fork le projet
```bash
git clone https://github.com/TON-USERNAME/z-survival-game.git
cd z-survival-game
```

#### 2. 🔧 Configure Supabase
1. Crée un projet sur [Supabase](https://supabase.com)
2. Copie les clés dans `game/supabase-client.js`
3. Exécute le SQL depuis `CREATE-SUPABASE-TABLES.sql`

#### 3. 🚀 Déploie sur Vercel
1. Connecte ton GitHub à [Vercel](https://vercel.com)
2. Importe le repository `z-survival-game`
3. Déploie automatiquement

---

## 📁 Structure du Projet

```
📁 z-survival-game/
├── 📁 game/                    # Dossier principal du jeu
│   ├── 📄 index.html          # Page d'accueil du jeu
│   ├── 📄 game.html           # Interface hôte
│   ├── 📄 controller.html     # Contrôleur mobile
│   ├── 📄 test-runner.html    # Tests de sécurité
│   ├── 📄 security-system.js  # Système de sécurité
│   ├── 📄 supabase-client.js  # Client Supabase
│   └── 📄 supabase-multiplayer.js # Multi-joueurs
├── 📄 index.html              # Page d'accueil principale
├── 📄 section*.html           # Pages de contenu
├── 📁 css/                    # Styles
├── 📁 images/                 # Assets du jeu
├── 📄 CREATE-SUPABASE-TABLES.sql
├── 📄 vercel.json             # Configuration Vercel
└── 📄 README.md               # Ce fichier
```

---

## 🎮 Comment Jouer

### 🏠 Pour l'Hôte (Desktop)
1. 🌐 Ouvre `game/game.html`
2. 📝 Crée une partie avec nom + pseudo
3. 📋 Note le code de partie (ex: ABC123)
4. 🎯 Partage le code aux joueurs

### 📱 Pour les Joueurs (Mobile)
1. 🌐 Ouvre `game/game.html` sur mobile
2. 📋 Entre le code de partie
3. 👤 Choisis ton pseudo
4. ⏳ Attends l'autorisation de l'admin

### 🔐 Sécurité Admin
- **Code admin** : `Jij125689Huh/*++*/huH986521jiJ`
- **URL admin** : `?admin=Jij125689Huh/*++*/huH986521jiJ`
- **Panel admin** : Autorise/bloque les appareils mobiles

---

## ⚙️ Configuration

### 🔑 Clés Supabase
Dans `game/supabase-client.js` :
```javascript
const SUPABASE_CONFIG = {
    url: 'https://TON-PROJECT.supabase.co',
    anonKey: 'TA-CLE-ANONYME',
    serviceKey: 'TA-CLE-SERVICE'
};
```

### 🌐 Personnalisation
- **Thème couleurs** : Modifie les variables CSS dans `:root`
- **Messages** : Édite les textes dans les fichiers JS
- **Règles jeu** : Modifie la logique dans `supabase-multiplayer.js`

---

## 🛠️ Développement

### 🔧 Tests de Sécurité
```bash
# Ouvre le test runner
open game/test-runner.html

# Déverrouille avec le code admin
Jij125689Huh/*++*/huH986521jiJ
```

### 📊 Monitoring
- **Console** : Logs en temps réel
- **Supabase Dashboard** : Statistiques base de données
- **Vercel Analytics** : Performance site

---

## 🌍 Déploiement

### 🚀 Vercel (Recommandé)
```bash
# Connecte GitHub à Vercel
# Importe le repository
# Déploie automatiquement
```

### 🗄️ Supabase
```bash
# Crée les tables
# Configure le real-time
# Active le hosting
```

### 📱 URLs disponibles
- **Site principal** : `https://z-survival.vercel.app`
- **API Supabase** : `https://TON-PROJECT.supabase.co`
- **Custom domain** : `https://z-survival.com`

---

## 🤝 Contribution

### 🐛 Rapports de bugs
1. 📍 Utilise les [Issues GitHub](https://github.com/TON-USERNAME/z-survival-game/issues)
2. 📝 Décris le problème avec screenshots
3. 🔧 Mentionne ton navigateur et appareil

### 💡 Idées d'amélioration
- 🎮 Nouveaux modes de jeu
- 🏆 Système de classement
- 💬 Chat intégré
- 🎨 Thèmes personnalisables

---

## 📄 License

Ce projet est sous license **MIT** - voir le fichier [LICENSE](LICENSE) pour les détails.

---

## 🙏 Crédits

- 🚀 **Supabase** - Base de données et real-time
- ⚡ **Vercel** - Hosting et CDN
- 🎨 **Font Awesome** - Icônes
- 🎮 **Z-Survival Team** - Développement

---

## 📞 Contact

- 📧 **Email** : contact@z-survival.com
- 🐦 **Twitter** : @zsurvival_game
- 💬 **Discord** : [Serveur Discord](https://discord.gg/zsurvival)

---

🧟 **Prêt à survivre ensemble ?** 🎮✨

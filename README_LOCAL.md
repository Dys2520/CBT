# CBT - Installation Locale

## 🚀 Installation rapide

1. **Créer la base de données PostgreSQL locale :**
```bash
# Créer la base
createdb cbt_database

# Ou avec psql
psql -c "CREATE DATABASE cbt_database;"
```

2. **Configurer les variables d'environnement :**
```bash
# Copier le fichier d'exemple
cp .env.local .env

# Ou créer .env avec :
echo "DATABASE_URL=postgresql://postgres:admin123@localhost:5432/cbt_database" > .env
echo "SESSION_SECRET=cbt_local_secret_123456" >> .env
```

3. **Installer et démarrer :**
```bash
npm install
npm run dev
```

## 🌐 Accès
- **Site web :** http://localhost:5000
- **Interface admin :** http://localhost:5000/admin
- **Base de données :** localhost:5432/cbt_database

## 📊 Features
✅ E-commerce complet avec panier
✅ Interface admin avec statistiques  
✅ Gestion produits/services/commandes
✅ Système SAV intégré
✅ Authentification locale
✅ Base PostgreSQL locale
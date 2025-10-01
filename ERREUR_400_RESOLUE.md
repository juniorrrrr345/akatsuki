# ✅ Erreur 400 Bad Request Résolue

## 🔍 Problème initial

```
❌ Erreur PUT settings SCM: Error: D1 Error: 400 Bad Request
```

Cette erreur se produisait lors de la tentative de mise à jour des paramètres via l'API `/api/cloudflare/settings/route.ts`.

---

## 🎯 Cause du problème

La table `settings` dans la base de données Cloudflare D1 ne contenait pas toutes les colonnes requises par le code de l'API.

Le code tentait d'insérer/mettre à jour des colonnes qui n'existaient pas :
- `shop_title`
- `info_content`
- `contact_content`
- `telegram_livraison`
- `telegram_envoi`
- `telegram_meetup`
- `livraison_schedules`
- `meetup_schedules`
- `envoi_schedules`

---

## ✅ Solution appliquée

### 1. Ajout des colonnes manquantes

Un script `add-settings-columns.js` a été créé et exécuté pour ajouter les 9 colonnes manquantes à la table `settings`.

**Résultat :**
```
✅ Colonne shop_title - OK
✅ Colonne info_content - OK
✅ Colonne contact_content - OK
✅ Colonne telegram_livraison - OK
✅ Colonne telegram_envoi - OK
✅ Colonne telegram_meetup - OK
✅ Colonne livraison_schedules - OK
✅ Colonne meetup_schedules - OK
✅ Colonne envoi_schedules - OK
```

### 2. Mise à jour des schémas

Les fichiers suivants ont été mis à jour pour inclure les nouvelles colonnes :

#### `database/schema.sql`
```sql
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    shop_name TEXT DEFAULT 'Ma Boutique',
    shop_title TEXT DEFAULT 'Ma Boutique',
    admin_password TEXT DEFAULT 'admin123',
    background_image TEXT DEFAULT '',
    background_opacity INTEGER DEFAULT 20,
    background_blur INTEGER DEFAULT 5,
    theme_color TEXT DEFAULT '#000000',
    contact_info TEXT DEFAULT '',
    info_content TEXT DEFAULT '',
    contact_content TEXT DEFAULT '',
    shop_description TEXT DEFAULT '',
    loading_enabled BOOLEAN DEFAULT true,
    loading_duration INTEGER DEFAULT 3000,
    whatsapp_link TEXT DEFAULT '',
    whatsapp_number TEXT DEFAULT '',
    scrolling_text TEXT DEFAULT '',
    telegram_livraison TEXT DEFAULT '',
    telegram_envoi TEXT DEFAULT '',
    telegram_meetup TEXT DEFAULT '',
    livraison_schedules TEXT DEFAULT '["Matin (9h-12h)", "Après-midi (14h-17h)", "Soirée (17h-20h)", "Flexible (à convenir)"]',
    meetup_schedules TEXT DEFAULT '["Lundi au Vendredi (9h-18h)", "Weekend (10h-17h)", "Soirée en semaine (18h-21h)", "Flexible (à convenir)"]',
    envoi_schedules TEXT DEFAULT '["Envoi sous 24h", "Envoi sous 48h", "Envoi express", "Délai à convenir"]',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### `init-database.js`
Mise à jour du script d'initialisation pour créer la table avec toutes les colonnes nécessaires dès le départ.

---

## 📊 Structure complète de la table settings

| Colonne | Type | Défaut | Description |
|---------|------|--------|-------------|
| `id` | INTEGER | AUTO | Identifiant unique |
| `shop_name` | TEXT | 'Ma Boutique' | Nom de la boutique |
| `shop_title` | TEXT | 'Ma Boutique' | Titre de la boutique |
| `admin_password` | TEXT | 'admin123' | Mot de passe admin |
| `background_image` | TEXT | '' | URL image de fond |
| `background_opacity` | INTEGER | 20 | Opacité du fond (0-100) |
| `background_blur` | INTEGER | 5 | Flou du fond |
| `theme_color` | TEXT | '#000000' | Couleur du thème |
| `contact_info` | TEXT | '' | Informations de contact |
| `info_content` | TEXT | '' | Contenu page info |
| `contact_content` | TEXT | '' | Contenu page contact |
| `shop_description` | TEXT | '' | Description boutique |
| `loading_enabled` | BOOLEAN | true | Activation loading screen |
| `loading_duration` | INTEGER | 3000 | Durée loading (ms) |
| `whatsapp_link` | TEXT | '' | Lien WhatsApp |
| `whatsapp_number` | TEXT | '' | Numéro WhatsApp |
| `scrolling_text` | TEXT | '' | Texte défilant |
| `telegram_livraison` | TEXT | '' | Lien Telegram livraison |
| `telegram_envoi` | TEXT | '' | Lien Telegram envoi |
| `telegram_meetup` | TEXT | '' | Lien Telegram meetup |
| `livraison_schedules` | TEXT | JSON Array | Horaires de livraison |
| `meetup_schedules` | TEXT | JSON Array | Horaires de meetup |
| `envoi_schedules` | TEXT | JSON Array | Options d'envoi |
| `created_at` | DATETIME | CURRENT | Date de création |
| `updated_at` | DATETIME | CURRENT | Date de mise à jour |

---

## 🔧 Fonctionnalités ajoutées

Ces nouvelles colonnes permettent de gérer :

### 1. **Liens Telegram par service**
- `telegram_livraison` : Lien Telegram pour les livraisons
- `telegram_envoi` : Lien Telegram pour les envois
- `telegram_meetup` : Lien Telegram pour les meetups

### 2. **Horaires personnalisés**
- `livraison_schedules` : Créneaux horaires de livraison configurables
- `meetup_schedules` : Créneaux horaires de meetup configurables
- `envoi_schedules` : Options d'envoi configurables

### 3. **Contenu des pages**
- `info_content` : Contenu de la page "Informations"
- `contact_content` : Contenu de la page "Contact"
- `shop_title` : Titre personnalisable de la boutique

---

## 🚀 Déploiement

### Pour les nouvelles installations

Le script `init-database.js` créera automatiquement la table avec toutes les colonnes nécessaires.

```bash
node init-database.js
```

### Pour les installations existantes

Exécutez le script de mise à jour :

```bash
node add-settings-columns.js
```

---

## ✅ Vérification

Pour vérifier que la table est correctement configurée, utilisez l'API Cloudflare D1 ou exécutez :

```bash
# Tester l'API settings
curl http://localhost:3000/api/cloudflare/settings
```

La réponse devrait inclure tous les champs sans erreur 400.

---

## 📝 Fichiers modifiés

1. ✅ `database/schema.sql` - Schéma SQL mis à jour
2. ✅ `init-database.js` - Script d'initialisation corrigé
3. ✅ `add-settings-columns.js` - Nouveau script de migration (créé)
4. ✅ Changements synchronisés sur GitHub

---

## 🎉 Résultat

L'erreur **400 Bad Request** est maintenant résolue. L'API `/api/cloudflare/settings` fonctionne correctement et peut :

- ✅ Récupérer les paramètres (GET)
- ✅ Mettre à jour les paramètres (PUT)
- ✅ Créer de nouveaux paramètres (POST)
- ✅ Gérer tous les nouveaux champs ajoutés

---

## 🔄 Actions de maintenance

Si vous rencontrez à nouveau cette erreur :

1. Vérifiez que toutes les colonnes existent dans la table
2. Exécutez `node add-settings-columns.js` pour ajouter les colonnes manquantes
3. Consultez les logs Vercel pour identifier les colonnes spécifiques causant problème
4. Ajoutez les colonnes nécessaires via ALTER TABLE

---

**Date de résolution** : Octobre 2025  
**Commit** : e7446f3 - "Correction: ajout des colonnes manquantes à la table settings pour résoudre l'erreur 400"

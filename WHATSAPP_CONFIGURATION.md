# 📱 Configuration WhatsApp - Envoi Automatique des Commandes

## ✅ Migration Complète vers WhatsApp

La boutique utilise maintenant **WhatsApp** au lieu de Signal/Telegram pour l'envoi automatique des commandes.

---

## 🎯 Fonctionnalités

### Envoi Automatique
- ✅ WhatsApp s'ouvre automatiquement avec le message pré-rempli
- ✅ Message formaté avec tous les détails de la commande
- ✅ Support de plusieurs services (Livraison, Envoi, Meetup)
- ✅ Numéros WhatsApp différents par service
- ✅ Panier vidé automatiquement après envoi

### Format du Message
Le message WhatsApp est formaté avec:
- Nom du service (🚚 Livraison, 📦 Envoi, 📍 Meetup)
- Liste des produits avec quantités
- Prix unitaires et totaux
- Horaires demandés
- Total général
- Texte en **gras** et _italique_ pour meilleure lisibilité

---

## 🔧 Configuration dans l'Admin

### 1. Numéro WhatsApp Principal
**Paramètre** : `whatsapp_number`
- Format : Numéro international (avec ou sans +)
- Exemples valides :
  - `+33612345678`
  - `33612345678`
  - `0612345678` (sera converti)

### 2. Numéros WhatsApp par Service

#### 📱 WhatsApp Livraison
**Paramètre** : `whatsapp_livraison`
- Numéro dédié pour les livraisons à domicile
- Si non configuré, utilise le numéro principal

#### 📱 WhatsApp Envoi  
**Paramètre** : `whatsapp_envoi`
- Numéro dédié pour les envois postaux
- Si non configuré, utilise le numéro principal

#### 📱 WhatsApp Meetup
**Paramètre** : `whatsapp_meetup`
- Numéro dédié pour les points de rencontre
- Si non configuré, utilise le numéro principal

---

## 📊 Structure Base de Données

### Colonnes Ajoutées
```sql
whatsapp_livraison TEXT DEFAULT ''
whatsapp_envoi TEXT DEFAULT ''
whatsapp_meetup TEXT DEFAULT ''
```

### Colonnes Existantes
```sql
whatsapp_number TEXT DEFAULT ''  -- Numéro principal
whatsapp_link TEXT DEFAULT ''    -- Ancien format (compatibilité)
```

---

## 🛠️ Configuration Étape par Étape

### Étape 1 : Accéder au Panel Admin
```
https://votre-domaine.com/admin
```

### Étape 2 : Onglet "Paramètres"
1. Scrollez jusqu'à la section **WhatsApp**
2. Configurez le numéro principal
3. (Optionnel) Configurez des numéros spécifiques par service

### Étape 3 : Format des Numéros

#### ✅ Formats Acceptés
```
+33612345678    ← Recommandé (format international)
33612345678     ← OK (sera préfixé avec +)
0612345678      ← OK (sera converti en +33)
```

#### ❌ Formats NON Acceptés
```
06 12 34 56 78  ← Espaces (seront supprimés)
06-12-34-56-78  ← Tirets (seront supprimés)
06.12.34.56.78  ← Points (seront supprimés)
```

> **Note** : Les espaces, tirets et points sont automatiquement supprimés

---

## 💡 Exemples d'Utilisation

### Exemple 1 : Un seul service

**Configuration** :
- `whatsapp_number` : `+33612345678`

**Résultat** :
- Bouton unique "📱 Envoyer via WhatsApp"
- Ouvre WhatsApp avec le message complet

### Exemple 2 : Services multiples

**Configuration** :
- `whatsapp_livraison` : `+33612345678`
- `whatsapp_envoi` : `+33698765432`
- `whatsapp_meetup` : `+33687654321`

**Résultat** :
- 3 boutons séparés par service
- 1 bouton "Envoyer TOUT" (utilise le numéro principal)
- Chaque service ouvre le bon numéro WhatsApp

### Exemple 3 : Service partiel

**Configuration** :
- `whatsapp_number` : `+33612345678` (principal)
- `whatsapp_livraison` : `+33698765432` (spécifique)

**Résultat** :
- Livraison → `+33698765432`
- Envoi → `+33612345678` (fallback)
- Meetup → `+33612345678` (fallback)

---

## 🔄 Processus de Commande

### 1. Client ajoute des produits au panier
```
Panier → Choisir service → Choisir horaires → Récapitulatif
```

### 2. Clic sur "Commander"
```javascript
// Le système génère automatiquement :
const message = `
🚚 *COMMANDE SCM - LIVRAISON À DOMICILE*

1. *Produit 1*
   • Quantité: 2x 500g
   • Prix unitaire: 10€
   • Total: *20€*
   • Horaire: Matin (9h-12h)

💰 *TOTAL LIVRAISON: 20€*

📍 Service: 🚚 Livraison à domicile

_Commande depuis le site SCM_
Merci de confirmer ma commande !
`;
```

### 3. WhatsApp s'ouvre automatiquement
```javascript
// URL générée
https://wa.me/33612345678?text=MESSAGE_ENCODÉ
```

### 4. Client envoie le message
- Le message est déjà pré-rempli
- Client clique juste sur "Envoyer"
- Panier vidé automatiquement

---

## 🎨 Personnalisation du Message

### Format WhatsApp Supporté
```
*Texte en gras*
_Texte en italique_
~Texte barré~
```monospace```

### Emojis Utilisés
- 🛒 Commande complète
- 🚚 Livraison
- 📦 Envoi
- 📍 Meetup
- 💰 Prix
- 📱 WhatsApp

---

## 🐛 Dépannage

### Problème : WhatsApp ne s'ouvre pas

**Causes possibles** :
1. Numéro WhatsApp non configuré
2. Format de numéro invalide
3. Bloqueur de popup activé

**Solutions** :
```javascript
// Vérifier dans la console
console.log('Numéro WhatsApp:', whatsappNumber);

// Vérifier le lien généré
console.log('Lien WhatsApp:', whatsappLink);
```

### Problème : Mauvais numéro utilisé

**Vérification** :
1. Admin → Paramètres → Section WhatsApp
2. Vérifier `whatsapp_livraison`, `whatsapp_envoi`, `whatsapp_meetup`
3. Vérifier fallback sur `whatsapp_number`

### Problème : Message vide

**Causes** :
- Panier vide
- Service non sélectionné
- Horaires manquants

**Solution** :
Le système affiche des erreurs claires :
```
❌ Aucun article sélectionné
❌ Veuillez choisir un service
❌ Veuillez choisir des options
```

---

## 📱 API Endpoints

### GET /api/cloudflare/settings
Récupère tous les paramètres incluant WhatsApp:
```json
{
  "whatsapp_number": "+33612345678",
  "whatsapp_livraison": "+33698765432",
  "whatsapp_envoi": "",
  "whatsapp_meetup": ""
}
```

### PUT /api/cloudflare/settings
Met à jour les paramètres WhatsApp:
```json
{
  "whatsapp_number": "+33612345678",
  "whatsapp_livraison": "+33698765432",
  "whatsapp_envoi": "+33687654321",
  "whatsapp_meetup": "+33676543210"
}
```

---

## 🔐 Sécurité

### Nettoyage des Numéros
```javascript
// Automatique avant envoi
const cleanNumber = whatsappNumber.replace(/[^0-9+]/g, '');
```

### Encodage du Message
```javascript
// Encodage URL automatique
const encodedMessage = encodeURIComponent(message);
```

### Validation
- Vérification du numéro non vide
- Format international requis
- Caractères spéciaux supprimés

---

## 🚀 Avantages WhatsApp

✅ **Universalité** : WhatsApp installé partout  
✅ **Simplicité** : Message pré-rempli, juste à envoyer  
✅ **Traçabilité** : Historique des commandes dans WhatsApp  
✅ **Rapidité** : Pas de copier-coller nécessaire  
✅ **Multi-service** : Numéros différents par service  
✅ **Mobile-first** : Optimisé pour smartphone  

---

## 📋 Checklist Configuration

- [ ] Configurer `whatsapp_number` (numéro principal)
- [ ] (Optionnel) Configurer `whatsapp_livraison`
- [ ] (Optionnel) Configurer `whatsapp_envoi`
- [ ] (Optionnel) Configurer `whatsapp_meetup`
- [ ] Tester avec une commande test
- [ ] Vérifier que WhatsApp s'ouvre automatiquement
- [ ] Vérifier le message pré-rempli
- [ ] Confirmer que le panier se vide après envoi

---

## 🆕 Nouveautés vs Signal/Telegram

| Fonctionnalité | Signal/Telegram | WhatsApp |
|----------------|-----------------|----------|
| Envoi automatique | ❌ Copier-coller | ✅ Automatique |
| Message formaté | ✅ Oui | ✅ Gras/Italique |
| Multi-services | ⚠️ Partiel | ✅ Complet |
| Mobile-friendly | ⚠️ Moyen | ✅ Excellent |
| Popularité | ⚠️ Limitée | ✅ Universelle |

---

## 📞 Support

Pour toute question sur la configuration WhatsApp :
1. Consultez cette documentation
2. Vérifiez les logs console du navigateur
3. Testez avec un numéro de test
4. Vérifiez le format des numéros

---

**Date de migration** : Octobre 2025  
**Version** : 2.0 - WhatsApp Integration  
**Commit** : 62abb97 - "Migration vers WhatsApp avec envoi automatique"

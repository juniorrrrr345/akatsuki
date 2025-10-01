#!/usr/bin/env node

/**
 * Script pour ajouter les colonnes manquantes à la table settings
 */

const ACCOUNT_ID = '7979421604bd07b3bd34d3ed96222512';
const DATABASE_ID = '4451101b-0e14-4aab-8e25-e702b41a40c4';
const API_TOKEN = 'ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW';

const BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`;

async function executeSQL(sql, description) {
  console.log(`📝 ${description}...`);
  
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql })
    });

    const data = await response.json();

    if (data.success) {
      console.log(`✅ ${description} - OK`);
      return true;
    } else {
      console.log(`⚠️  ${description} - ${data.errors?.[0]?.message || 'Colonne existe déjà ou autre avertissement'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} - ERREUR: ${error.message}`);
    return false;
  }
}

async function addMissingColumns() {
  console.log('🔧 Ajout des colonnes manquantes à la table settings...\n');

  // Colonnes à ajouter
  const columns = [
    { name: 'shop_title', type: 'TEXT DEFAULT "Ma Boutique"', description: 'Colonne shop_title' },
    { name: 'info_content', type: 'TEXT DEFAULT ""', description: 'Colonne info_content' },
    { name: 'contact_content', type: 'TEXT DEFAULT ""', description: 'Colonne contact_content' },
    { name: 'telegram_livraison', type: 'TEXT DEFAULT ""', description: 'Colonne telegram_livraison' },
    { name: 'telegram_envoi', type: 'TEXT DEFAULT ""', description: 'Colonne telegram_envoi' },
    { name: 'telegram_meetup', type: 'TEXT DEFAULT ""', description: 'Colonne telegram_meetup' },
    { name: 'livraison_schedules', type: 'TEXT DEFAULT \'["Matin (9h-12h)", "Après-midi (14h-17h)", "Soirée (17h-20h)", "Flexible (à convenir)"]\'', description: 'Colonne livraison_schedules' },
    { name: 'meetup_schedules', type: 'TEXT DEFAULT \'["Lundi au Vendredi (9h-18h)", "Weekend (10h-17h)", "Soirée en semaine (18h-21h)", "Flexible (à convenir)"]\'', description: 'Colonne meetup_schedules' },
    { name: 'envoi_schedules', type: 'TEXT DEFAULT \'["Envoi sous 24h", "Envoi sous 48h", "Envoi express", "Délai à convenir"]\'', description: 'Colonne envoi_schedules' }
  ];

  for (const column of columns) {
    await executeSQL(
      `ALTER TABLE settings ADD COLUMN ${column.name} ${column.type}`,
      column.description
    );
  }

  console.log('\n🎉 Mise à jour de la table settings terminée !');
  console.log('✅ Les colonnes manquantes ont été ajoutées\n');
}

// Exécuter
addMissingColumns().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});

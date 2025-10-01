#!/usr/bin/env node

/**
 * Migration de Telegram/Signal vers WhatsApp
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
      console.log(`⚠️  ${description} - ${data.errors?.[0]?.message || 'Avertissement'}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} - ERREUR: ${error.message}`);
    return false;
  }
}

async function migrateToWhatsApp() {
  console.log('📱 Migration vers WhatsApp...\n');

  // Ajouter les colonnes WhatsApp
  const columns = [
    { name: 'whatsapp_livraison', type: 'TEXT DEFAULT ""', description: 'Colonne whatsapp_livraison' },
    { name: 'whatsapp_envoi', type: 'TEXT DEFAULT ""', description: 'Colonne whatsapp_envoi' },
    { name: 'whatsapp_meetup', type: 'TEXT DEFAULT ""', description: 'Colonne whatsapp_meetup' }
  ];

  console.log('➕ Ajout des colonnes WhatsApp...\n');
  
  for (const column of columns) {
    await executeSQL(
      `ALTER TABLE settings ADD COLUMN ${column.name} ${column.type}`,
      column.description
    );
  }

  console.log('\n🎉 Migration vers WhatsApp terminée !');
  console.log('✅ Les colonnes WhatsApp ont été ajoutées\n');
  console.log('💡 Format des numéros WhatsApp:');
  console.log('   • +33612345678 (avec indicatif pays)');
  console.log('   • 33612345678 (sans le +)');
  console.log('   • Format international requis\n');
}

// Exécuter
migrateToWhatsApp().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});

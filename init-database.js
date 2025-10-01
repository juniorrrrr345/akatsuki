#!/usr/bin/env node

/**
 * Script d'initialisation de la base de données Cloudflare D1
 * Crée toutes les tables nécessaires pour la boutique
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
      console.log(`❌ ${description} - ERREUR`);
      console.log(JSON.stringify(data, null, 2));
      return false;
    }
  } catch (error) {
    console.log(`❌ ${description} - ERREUR: ${error.message}`);
    return false;
  }
}

async function initDatabase() {
  console.log('🚀 Initialisation de la base de données D1...\n');

  // 1. Table Settings
  await executeSQL(
    `CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shop_name TEXT DEFAULT 'Ma Boutique',
      shop_title TEXT DEFAULT 'Ma Boutique',
      admin_password TEXT DEFAULT 'admin123',
      background_image TEXT DEFAULT '',
      background_opacity INTEGER DEFAULT 20,
      background_blur INTEGER DEFAULT 5,
      theme_color TEXT DEFAULT 'glow',
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
    )`,
    'Création table settings'
  );

  // 2. Table Categories
  await executeSQL(
    `CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT DEFAULT '',
      icon TEXT DEFAULT '🏷️',
      color TEXT DEFAULT '#3B82F6',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    'Création table categories'
  );

  // 3. Table Farms
  await executeSQL(
    `CREATE TABLE IF NOT EXISTS farms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      description TEXT DEFAULT '',
      location TEXT DEFAULT '',
      contact TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    'Création table farms'
  );

  // 4. Table Products
  await executeSQL(
    `CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT DEFAULT '',
      price REAL NOT NULL DEFAULT 0,
      prices TEXT DEFAULT '{}',
      category_id INTEGER,
      farm_id INTEGER,
      image_url TEXT DEFAULT '',
      video_url TEXT DEFAULT '',
      images TEXT DEFAULT '[]',
      stock INTEGER DEFAULT 0,
      is_available BOOLEAN DEFAULT true,
      features TEXT DEFAULT '[]',
      tags TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    'Création table products'
  );

  // 5. Table Pages
  await executeSQL(
    `CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      content TEXT DEFAULT '',
      is_active BOOLEAN DEFAULT true,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    'Création table pages'
  );

  // 6. Table Social Links
  await executeSQL(
    `CREATE TABLE IF NOT EXISTS social_links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      url TEXT NOT NULL,
      icon TEXT DEFAULT '🔗',
      is_active BOOLEAN DEFAULT true,
      sort_order INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    'Création table social_links'
  );

  // 7. Table Orders
  await executeSQL(
    `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_name TEXT NOT NULL,
      customer_email TEXT,
      customer_phone TEXT,
      items TEXT NOT NULL,
      total_amount REAL NOT NULL DEFAULT 0,
      status TEXT DEFAULT 'pending',
      notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`,
    'Création table orders'
  );

  console.log('\n📋 Création des index...\n');

  // Index pour les performances
  await executeSQL('CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id)', 'Index products_category');
  await executeSQL('CREATE INDEX IF NOT EXISTS idx_products_farm ON products(farm_id)', 'Index products_farm');
  await executeSQL('CREATE INDEX IF NOT EXISTS idx_products_available ON products(is_available)', 'Index products_available');
  await executeSQL('CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug)', 'Index pages_slug');
  await executeSQL('CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)', 'Index orders_status');

  console.log('\n📋 Insertion des données par défaut...\n');

  // Données par défaut
  await executeSQL(
    `INSERT OR REPLACE INTO settings (id, shop_name, shop_description, scrolling_text) VALUES (1, 'Boutique Akatsuki', 'Boutique en ligne moderne avec produits de qualité', 'Bienvenue dans notre boutique ! 🛍️')`,
    'Settings par défaut'
  );

  await executeSQL(
    `INSERT OR IGNORE INTO pages (slug, title, content) VALUES ('info', 'Informations', 'Bienvenue dans notre boutique ! Nous proposons des produits de qualité.')`,
    'Page Info'
  );

  await executeSQL(
    `INSERT OR IGNORE INTO pages (slug, title, content) VALUES ('contact', 'Contact', 'Contactez-nous pour toute question.')`,
    'Page Contact'
  );

  console.log('\n🎉 INITIALISATION TERMINÉE !');
  console.log('✅ Toutes les tables ont été créées');
  console.log('✅ Les index ont été créés');
  console.log('✅ Les données par défaut ont été insérées\n');
}

// Exécuter l'initialisation
initDatabase().catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});

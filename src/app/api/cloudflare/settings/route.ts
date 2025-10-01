import { NextRequest, NextResponse } from 'next/server';

// Configuration Cloudflare D1 hardcodée
const CLOUDFLARE_CONFIG = {
  accountId: '7979421604bd07b3bd34d3ed96222512',
  databaseId: '4451101b-0e14-4aab-8e25-e702b41a40c4',
  apiToken: 'ijkVhaXCw6LSddIMIMxwPL5CDAWznxip5x9I1bNW'
};

async function executeSqlOnD1(sql: string, params: any[] = []) {
  const url = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_CONFIG.accountId}/d1/database/${CLOUDFLARE_CONFIG.databaseId}/query`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${CLOUDFLARE_CONFIG.apiToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql, params })
  });
  
  if (!response.ok) {
    throw new Error(`D1 Error: ${response.status} ${response.statusText}`);
  }
  
  return await response.json();
}

// GET - Récupérer les paramètres
export async function GET() {
  try {
    console.log('🔍 GET settings AKATSUKI COFFEE...');
    
    const result = await executeSqlOnD1('SELECT * FROM settings WHERE id = 1');
    
    if (result.result?.[0]?.results?.length) {
      const settings = result.result[0].results[0];
      console.log('✅ Settings AKATSUKI COFFEE récupérés:', settings);
      
      // Mapper les champs D1 vers le format attendu par le frontend
      const mappedSettings = {
        ...settings,
        backgroundImage: settings.background_image,
        backgroundOpacity: settings.background_opacity || 20,
        backgroundBlur: settings.background_blur || 5,
        shopTitle: settings.shop_title || 'AKATSUKI COFFEE',
        shopName: settings.shop_title || 'AKATSUKI COFFEE',
        infoContent: settings.info_content,
        contactContent: settings.contact_content,
        whatsappLink: settings.whatsapp_link || '',
        whatsappNumber: settings.whatsapp_number || '',
        scrollingText: settings.scrolling_text || '',
        titleStyle: settings.theme_color || 'glow',
        // Nouveaux champs pour les numéros WhatsApp par service
        whatsapp_livraison: settings.whatsapp_livraison || '',
        whatsapp_envoi: settings.whatsapp_envoi || '',
        whatsapp_meetup: settings.whatsapp_meetup || '',
        // Nouveaux champs pour les horaires personnalisés (parse JSON si string)
        livraison_schedules: settings.livraison_schedules ? 
          (typeof settings.livraison_schedules === 'string' ? 
            JSON.parse(settings.livraison_schedules) : settings.livraison_schedules) : 
          ['Matin (9h-12h)', 'Après-midi (14h-17h)', 'Soirée (17h-20h)', 'Flexible (à convenir)'],
        meetup_schedules: settings.meetup_schedules ? 
          (typeof settings.meetup_schedules === 'string' ? 
            JSON.parse(settings.meetup_schedules) : settings.meetup_schedules) : 
          ['Lundi au Vendredi (9h-18h)', 'Weekend (10h-17h)', 'Soirée en semaine (18h-21h)', 'Flexible (à convenir)'],
        envoi_schedules: settings.envoi_schedules ? 
          (typeof settings.envoi_schedules === 'string' ? 
            JSON.parse(settings.envoi_schedules) : settings.envoi_schedules) : 
          ['Envoi sous 24h', 'Envoi sous 48h', 'Envoi express', 'Délai à convenir']
      };
      
      return NextResponse.json(mappedSettings);
    } else {
      // Retourner des paramètres par défaut AKATSUKI COFFEE
      const defaultSettings = {
        id: 1,
        shop_name: 'AKATSUKI COFFEE',
        background_image: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/background-oglegacy.jpeg',
        background_opacity: 20,
        background_blur: 5,
        info_content: 'Bienvenue chez AKATSUKI COFFEE - Votre boutique premium',
        contact_content: 'Contactez AKATSUKI COFFEE pour toute question',
        backgroundImage: 'https://pub-b38679a01a274648827751df94818418.r2.dev/images/background-oglegacy.jpeg',
        backgroundOpacity: 20,
        backgroundBlur: 5,
        shopTitle: 'AKATSUKI COFFEE',
        shopName: 'AKATSUKI COFFEE',
        // Valeurs par défaut pour les numéros WhatsApp
        whatsapp_livraison: '',
        whatsapp_envoi: '',
        whatsapp_meetup: '',
        livraison_schedules: ['Matin (9h-12h)', 'Après-midi (14h-17h)', 'Soirée (17h-20h)', 'Flexible (à convenir)'],
        meetup_schedules: ['Lundi au Vendredi (9h-18h)', 'Weekend (10h-17h)', 'Soirée en semaine (18h-21h)', 'Flexible (à convenir)'],
        envoi_schedules: ['Envoi sous 24h', 'Envoi sous 48h', 'Envoi express', 'Délai à convenir']
      };
      
      return NextResponse.json(defaultSettings);
    }
  } catch (error) {
    console.error('❌ Erreur GET settings AKATSUKI COFFEE:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

// POST - Créer ou mettre à jour les paramètres (pour compatibilité)
export async function POST(request: NextRequest) {
  return PUT(request);
}

// PUT - Mettre à jour les paramètres
export async function PUT(request: NextRequest) {
  try {
    console.log('🔧 PUT settings AKATSUKI COFFEE...');
    const body = await request.json();
    
    const {
      background_image,
      backgroundImage,
      background_opacity,
      backgroundOpacity,
      background_blur,
      backgroundBlur,
      info_content,
      infoContent,
      contact_content,
      contactContent,
      shop_title,
      shopTitle,
      whatsapp_link,
      whatsappLink,
      whatsapp_number,
      whatsappNumber,
      scrolling_text,
      scrollingText,
      theme_color,
      titleStyle,
      // Nouveaux champs pour les numéros WhatsApp par service
      whatsapp_livraison,
      whatsapp_envoi,
      whatsapp_meetup,
      // Nouveaux champs pour les horaires personnalisés
      livraison_schedules,
      meetup_schedules,
      envoi_schedules
    } = body;

    // Utiliser les champs avec priorité aux versions snake_case
    const finalBackgroundImage = background_image || backgroundImage;
    const finalBackgroundOpacity = background_opacity ?? backgroundOpacity ?? 20;
    const finalBackgroundBlur = background_blur ?? backgroundBlur ?? 5;
    const finalInfoContent = info_content || infoContent || 'Bienvenue chez AKATSUKI COFFEE';
    const finalContactContent = contact_content || contactContent || 'Contactez AKATSUKI COFFEE';
    const finalShopTitle = shop_title || shopTitle || 'AKATSUKI COFFEE';
    const finalWhatsappLink = whatsapp_link || whatsappLink || '';
    const finalWhatsappNumber = whatsapp_number || whatsappNumber || '';
    const finalScrollingText = scrolling_text || scrollingText || '';
    const finalThemeColor = theme_color || titleStyle || 'glow';
    
    // Nouveaux champs pour les numéros WhatsApp par service
    const finalWhatsappLivraison = whatsapp_livraison || '';
    const finalWhatsappEnvoi = whatsapp_envoi || '';
    const finalWhatsappMeetup = whatsapp_meetup || '';
    
    // Nouveaux champs pour les horaires personnalisés (stringifier les arrays)
    const finalLivraisonSchedules = livraison_schedules ? JSON.stringify(livraison_schedules) : JSON.stringify(['Matin (9h-12h)', 'Après-midi (14h-17h)', 'Soirée (17h-20h)', 'Flexible (à convenir)']);
    const finalMeetupSchedules = meetup_schedules ? JSON.stringify(meetup_schedules) : JSON.stringify(['Lundi au Vendredi (9h-18h)', 'Weekend (10h-17h)', 'Soirée en semaine (18h-21h)', 'Flexible (à convenir)']);
    const finalEnvoiSchedules = envoi_schedules ? JSON.stringify(envoi_schedules) : JSON.stringify(['Envoi sous 24h', 'Envoi sous 48h', 'Envoi express', 'Délai à convenir']);
    
    console.log('📱 Sauvegarde des numéros WhatsApp:', {
      whatsapp_livraison: finalWhatsappLivraison,
      whatsapp_envoi: finalWhatsappEnvoi,
      whatsapp_meetup: finalWhatsappMeetup,
      livraison_schedules: finalLivraisonSchedules,
      meetup_schedules: finalMeetupSchedules,
      envoi_schedules: finalEnvoiSchedules
    });

    // Vérifier si un enregistrement existe
    const checkResult = await executeSqlOnD1('SELECT id FROM settings WHERE id = 1');
    
    if (checkResult.result?.[0]?.results?.length) {
      // UPDATE
      await executeSqlOnD1(`
        UPDATE settings SET 
          background_image = ?, 
          background_opacity = ?, 
          background_blur = ?,
          info_content = ?,
          contact_content = ?,
          shop_title = ?,
          whatsapp_link = ?,
          whatsapp_number = ?,
          scrolling_text = ?,
          theme_color = ?,
          whatsapp_livraison = ?,
          whatsapp_envoi = ?,
          whatsapp_meetup = ?,
          livraison_schedules = ?,
          meetup_schedules = ?,
          envoi_schedules = ?
        WHERE id = 1
      `, [
        finalBackgroundImage,
        finalBackgroundOpacity,
        finalBackgroundBlur,
        finalInfoContent,
        finalContactContent,
        finalShopTitle,
        finalWhatsappLink,
        finalWhatsappNumber,
        finalScrollingText,
        finalThemeColor,
        finalWhatsappLivraison,
        finalWhatsappEnvoi,
        finalWhatsappMeetup,
        finalLivraisonSchedules,
        finalMeetupSchedules,
        finalEnvoiSchedules
      ]);
    } else {
      // INSERT
      await executeSqlOnD1(`
        INSERT INTO settings (
          id, background_image, background_opacity, background_blur, 
          info_content, contact_content, shop_title, whatsapp_link,
          whatsapp_number, scrolling_text, theme_color,
          whatsapp_livraison, whatsapp_envoi, whatsapp_meetup,
          livraison_schedules, meetup_schedules, envoi_schedules
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        1,
        finalBackgroundImage,
        finalBackgroundOpacity,
        finalBackgroundBlur,
        finalInfoContent,
        finalContactContent,
        finalShopTitle,
        finalWhatsappLink,
        finalWhatsappNumber,
        finalScrollingText,
        finalThemeColor,
        finalWhatsappLivraison,
        finalWhatsappEnvoi,
        finalWhatsappMeetup,
        finalLivraisonSchedules,
        finalMeetupSchedules,
        finalEnvoiSchedules
      ]);
    }

    // Récupérer les paramètres mis à jour
    const result = await executeSqlOnD1('SELECT * FROM settings WHERE id = 1');
    const settings = result.result[0].results[0];
    
    console.log('✅ Settings AKATSUKI COFFEE mis à jour:', settings);

    const mappedSettings = {
      ...settings,
      backgroundImage: settings.background_image,
      backgroundOpacity: settings.background_opacity,
      backgroundBlur: settings.background_blur,
      shopTitle: 'AKATSUKI COFFEE',
      shopName: 'AKATSUKI COFFEE',
      // Inclure les numéros WhatsApp dans la réponse
      whatsapp_livraison: settings.whatsapp_livraison || '',
      whatsapp_envoi: settings.whatsapp_envoi || '',
      whatsapp_meetup: settings.whatsapp_meetup || '',
      livraison_schedules: settings.livraison_schedules ? 
        (typeof settings.livraison_schedules === 'string' ? 
          JSON.parse(settings.livraison_schedules) : settings.livraison_schedules) : 
        ['Matin (9h-12h)', 'Après-midi (14h-17h)', 'Soirée (17h-20h)', 'Flexible (à convenir)'],
        meetup_schedules: settings.meetup_schedules ? 
          (typeof settings.meetup_schedules === 'string' ? 
            JSON.parse(settings.meetup_schedules) : settings.meetup_schedules) : 
          ['Lundi au Vendredi (9h-18h)', 'Weekend (10h-17h)', 'Soirée en semaine (18h-21h)', 'Flexible (à convenir)'],
        envoi_schedules: settings.envoi_schedules ? 
          (typeof settings.envoi_schedules === 'string' ? 
            JSON.parse(settings.envoi_schedules) : settings.envoi_schedules) : 
          ['Envoi sous 24h', 'Envoi sous 48h', 'Envoi express', 'Délai à convenir']
    };

    return NextResponse.json(mappedSettings);
  } catch (error) {
    console.error('❌ Erreur PUT settings AKATSUKI COFFEE:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
}
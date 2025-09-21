const express = require('express');
const router = express.Router();

// Service proxy pour Zoho Mail via Resend (gratuit jusqu'à 3,000 emails/mois)
const sendEmailViaZohoProxy = async (emailData) => {
    try {
        const resendApiKey = process.env.RESEND_API_KEY;
        
        if (!resendApiKey) {
            throw new Error('RESEND_API_KEY non configurée');
        }

        // Configuration pour envoyer depuis Zoho vers Zoho via Resend
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Sorbo-Ingénierie <contact@sorbo-ingenierie.ci>',
                to: [emailData.to],
                subject: emailData.subject,
                html: emailData.html,
                text: emailData.text,
                reply_to: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci',
                // Headers personnalisés pour identifier l'origine
                headers: {
                    'X-Zoho-Proxy': 'true',
                    'X-Source': 'sorbo-ingenierie-website'
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Resend API Error: ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('❌ Erreur Zoho Proxy:', error);
        throw error;
    }
};

// @route   POST /api/zoho-proxy/send
// @desc    Envoyer un email via proxy Zoho
// @access  Public
router.post('/send', async (req, res) => {
    try {
        console.log('📧 Zoho Proxy - Réception demande:', req.body);
        
        const {
            to,
            subject,
            html,
            text,
            type = 'general',
            formData = {}
        } = req.body;

        // Validation
        if (!to || !subject || (!html && !text)) {
            return res.status(400).json({
                success: false,
                message: 'Données manquantes: to, subject, et html/text requis'
            });
        }

        // Générer le contenu HTML basé sur le type
        let contentHtml = '';
        
        if (type === 'contact' && formData) {
            contentHtml = `
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #2c3e50; margin-bottom: 20px;">📧 Nouveau message de contact</h2>
                    <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #e74c3c;">
                        <p style="margin: 10px 0;"><strong>Nom:</strong> ${formData.nom || 'Non renseigné'}</p>
                        <p style="margin: 10px 0;"><strong>Email:</strong> ${formData.email || 'Non renseigné'}</p>
                        <p style="margin: 10px 0;"><strong>Téléphone:</strong> ${formData.telephone || 'Non renseigné'}</p>
                        <p style="margin: 10px 0;"><strong>Sujet:</strong> ${formData.sujet || 'Non renseigné'}</p>
                        <div style="margin: 15px 0;">
                            <strong>Message:</strong>
                            <div style="background: #f8f9fa; padding: 10px; margin-top: 5px; border-radius: 3px; white-space: pre-wrap;">${formData.message || 'Aucun message'}</div>
                        </div>
                    </div>
                    <p style="font-size: 12px; color: #666; margin-top: 15px;">
                        <small>Envoyé depuis: ${formData.page || 'Page inconnue'}</small>
                    </p>
                </div>
            `;
        } else if (type === 'newsletter' && formData) {
            contentHtml = `
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h2 style="color: #2c3e50; margin-bottom: 20px;">📬 Nouvelle inscription newsletter</h2>
                    <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #e74c3c;">
                        <p style="margin: 10px 0;"><strong>Email:</strong> ${formData.email}</p>
                        <p style="margin: 10px 0;"><strong>Date d'inscription:</strong> ${new Date(formData.date || new Date()).toLocaleString('fr-FR')}</p>
                    </div>
                    <p style="font-size: 12px; color: #666; margin-top: 15px;">
                        <small>Envoyé depuis: ${formData.page || 'Page inconnue'}</small>
                    </p>
                </div>
            `;
        } else {
            // Fallback pour les autres types
            contentHtml = html || `<p>${text}</p>`;
        }

        // Enrichir le contenu HTML avec les informations Zoho
        const enrichedHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
                <div style="background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                    <h1 style="margin: 0; font-size: 24px;">🏢 Sorbo-Ingénierie</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Excellence et Innovation en Génie civil</p>
                </div>
                <div style="padding: 20px;">
                    ${contentHtml}
                </div>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 0 0 8px 8px; border-top: 1px solid #eee;">
                    <div style="text-align: center; margin-bottom: 15px;">
                        <p style="margin: 0; font-size: 14px; color: #666;">📧 Email envoyé via Sorbo-Ingénierie</p>
                    </div>
                    <div style="text-align: center; font-size: 12px; color: #666;">
                        <p style="margin: 5px 0;">🏢 <strong>Sorbo-Ingénierie</strong> - Ingénierie & Formation</p>
                        <p style="margin: 5px 0;">📞 +225 XX XX XX XX | 🌐 <a href="https://sorbo-ingenierie.ci" style="color: #e74c3c;">www.sorbo-ingenierie.ci</a></p>
                        <p style="margin: 5px 0;">📧 <a href="mailto:contact@sorbo-ingenierie.ci" style="color: #e74c3c;">contact@sorbo-ingenierie.ci</a></p>
                    </div>
                </div>
            </div>
        `;

        // Préparer les données email
        const emailData = {
            to: to,
            subject: `[Sorbo-Ingénierie] ${subject}`,
            html: enrichedHtml,
            text: text + `\n\n---\nEmail envoyé via Sorbo-Ingénierie\nContact: contact@sorbo-ingenierie.ci`
        };

        // Envoyer via le proxy
        const result = await sendEmailViaZohoProxy(emailData);
        
        console.log('✅ Email envoyé via Zoho Proxy:', result);
        
        // Log de l'email envoyé
        console.log('📝 Log email:', {
            to,
            subject,
            type,
            formData,
            timestamp: new Date().toISOString(),
            proxy: 'Resend -> Zoho'
        });
        
        res.json({
            success: true,
            message: 'Email envoyé avec succès via proxy Zoho',
            emailId: result.message_id || 'sent',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erreur Zoho Proxy:', error);
        
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi de l\'email via proxy Zoho',
            error: error.message
        });
    }
});

// @route   POST /api/zoho-proxy/test
// @desc    Tester le proxy Zoho
// @access  Public
router.post('/test', async (req, res) => {
    try {
        console.log('🧪 Test du proxy Zoho...');
        
        const testEmail = {
            to: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci',
            subject: 'Test Proxy Zoho - Sorbo-Ingénierie',
            html: `
                <h2>🎉 Test Proxy Zoho Réussi !</h2>
                <p>Le service proxy Zoho fonctionne correctement.</p>
                <p><strong>Heure du test :</strong> ${new Date().toLocaleString('fr-FR')}</p>
                <p><strong>Service :</strong> Resend → Zoho Mail</p>
                <p><strong>Email de destination :</strong> ${process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci'}</p>
                <hr>
                <p><em>Message automatique - Sorbo-Ingénierie Proxy</em></p>
            `,
            text: `Test Proxy Zoho réussi ! ${new Date().toLocaleString('fr-FR')}`
        };
        
        const result = await sendEmailViaZohoProxy(testEmail);
        
        console.log('✅ Email de test envoyé via Zoho Proxy:', result);
        
        res.json({
            success: true,
            message: 'Test proxy Zoho réussi',
            emailId: result.message_id || 'sent',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erreur test Zoho Proxy:', error);
        
        res.status(500).json({
            success: false,
            message: 'Erreur test proxy Zoho',
            error: error.message
        });
    }
});

// @route   GET /api/zoho-proxy/status
// @desc    Vérifier le statut du proxy Zoho
// @access  Public
router.get('/status', (req, res) => {
    const status = {
        proxy: 'Resend → Zoho Mail',
        zohoEmail: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci',
        resendConfigured: !!process.env.RESEND_API_KEY,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    res.json({
        success: true,
        status
    });
});

module.exports = router;

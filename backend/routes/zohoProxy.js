const express = require('express');
const router = express.Router();

// Service proxy pour Zoho Mail via SendGrid (gratuit jusqu'à 100 emails/jour)
const sendEmailViaZohoProxy = async (emailData) => {
    try {
        const sendgridApiKey = process.env.SENDGRID_API_KEY;
        
        if (!sendgridApiKey) {
            throw new Error('SENDGRID_API_KEY non configurée');
        }

        // Configuration pour envoyer depuis Zoho vers Zoho
        const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${sendgridApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                personalizations: [{
                    to: [{ email: emailData.to }],
                    subject: emailData.subject
                }],
                from: {
                    email: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci',
                    name: 'Sorbo-Ingénierie'
                },
                reply_to: {
                    email: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci',
                    name: 'Sorbo-Ingénierie'
                },
                content: [
                    {
                        type: 'text/html',
                        value: emailData.html
                    },
                    {
                        type: 'text/plain',
                        value: emailData.text
                    }
                ],
                // Headers personnalisés pour identifier l'origine
                headers: {
                    'X-Zoho-Proxy': 'true',
                    'X-Source': 'sorbo-ingenierie-website'
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`SendGrid API Error: ${errorData.message || response.statusText}`);
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

        // Enrichir le contenu HTML avec les informations Zoho
        const enrichedHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                ${html}
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
                <div style="font-size: 12px; color: #666; text-align: center;">
                    <p>📧 Email envoyé via Sorbo-Ingénierie</p>
                    <p>🏢 <strong>Sorbo-Ingénierie</strong> - Ingénierie & Formation</p>
                    <p>📞 +225 XX XX XX XX | 🌐 www.sorbo-ingenierie.ci</p>
                    <p>📧 <a href="mailto:contact@sorbo-ingenierie.ci">contact@sorbo-ingenierie.ci</a></p>
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
            proxy: 'SendGrid -> Zoho'
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
                <p><strong>Service :</strong> SendGrid → Zoho Mail</p>
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
        proxy: 'SendGrid → Zoho Mail',
        zohoEmail: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci',
        sendgridConfigured: !!process.env.SENDGRID_API_KEY,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    res.json({
        success: true,
        status
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configuration du proxy SMTP
const createSMTPProxy = () => {
    // Configuration Zoho via un service proxy externe
    const proxyConfig = {
        host: 'smtp.zoho.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci',
            pass: process.env.ZOHO_PASSWORD || 'votre-mot-de-passe-zoho'
        },
        tls: {
            rejectUnauthorized: false,
            ciphers: 'TLSv1.2'
        },
        // Configuration pour contourner les restrictions Railway
        connectionTimeout: 15000,
        greetingTimeout: 10000,
        socketTimeout: 15000,
        pool: true,
        maxConnections: 1,
        maxMessages: 3,
        rateDelta: 20000,
        rateLimit: 5
    };

    return nodemailer.createTransport(proxyConfig);
};

// @route   POST /api/smtp-proxy/send
// @desc    Envoyer un email via le proxy SMTP
// @access  Public
router.post('/send', async (req, res) => {
    try {
        console.log('📧 Proxy SMTP - Réception demande:', req.body);
        
        const {
            to,
            subject,
            html,
            text,
            from,
            replyTo
        } = req.body;

        // Validation
        if (!to || !subject || (!html && !text)) {
            return res.status(400).json({
                success: false,
                message: 'Données manquantes: to, subject, et html/text requis'
            });
        }

        // Créer le transporteur proxy
        const transporter = createSMTPProxy();
        
        // Vérifier la connexion avec retry
        let connected = false;
        let retryCount = 0;
        const maxRetries = 3;

        while (!connected && retryCount < maxRetries) {
            try {
                await transporter.verify();
                connected = true;
                console.log('✅ Proxy SMTP connecté (tentative', retryCount + 1, ')');
            } catch (error) {
                retryCount++;
                console.log(`❌ Tentative ${retryCount} échouée:`, error.message);
                
                if (retryCount < maxRetries) {
                    await new Promise(resolve => setTimeout(resolve, 2000 * retryCount));
                }
            }
        }

        if (!connected) {
            throw new Error('Impossible de se connecter au serveur SMTP après 3 tentatives');
        }

        // Options de l'email
        const mailOptions = {
            from: from || {
                name: 'Sorbo-Ingénierie',
                address: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci'
            },
            to: to,
            subject: subject,
            html: html,
            text: text,
            replyTo: replyTo || process.env.ZOHO_EMAIL,
            headers: {
                'X-Mailer': 'Sorbo-Ingenierie-Proxy',
                'X-Proxy-Version': '1.0',
                'X-Source': 'smtp-proxy'
            }
        };

        // Envoyer l'email
        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email envoyé via proxy:', info.messageId);
        
        res.json({
            success: true,
            message: 'Email envoyé avec succès via proxy SMTP',
            messageId: info.messageId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erreur proxy SMTP:', error);
        
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi via proxy SMTP',
            error: error.message
        });
    }
});

// @route   POST /api/smtp-proxy/test
// @desc    Tester le proxy SMTP
// @access  Public
router.post('/test', async (req, res) => {
    try {
        console.log('🧪 Test du proxy SMTP...');
        
        const transporter = createSMTPProxy();
        
        // Test de connexion
        await transporter.verify();
        console.log('✅ Proxy SMTP opérationnel');
        
        // Envoyer un email de test
        const testMail = {
            from: {
                name: 'Sorbo-Ingénierie Proxy',
                address: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci'
            },
            to: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci',
            subject: 'Test Proxy SMTP - Sorbo-Ingénierie',
            html: `
                <h2>🎉 Test Proxy SMTP Réussi !</h2>
                <p>Le service proxy SMTP fonctionne correctement.</p>
                <p><strong>Heure du test :</strong> ${new Date().toLocaleString('fr-FR')}</p>
                <p><strong>Proxy :</strong> smtp.zoho.com:587</p>
                <hr>
                <p><em>Message automatique - Sorbo-Ingénierie Proxy</em></p>
            `,
            text: `Test Proxy SMTP réussi ! ${new Date().toLocaleString('fr-FR')}`
        };
        
        const info = await transporter.sendMail(testMail);
        
        console.log('✅ Email de test envoyé via proxy:', info.messageId);
        
        res.json({
            success: true,
            message: 'Test proxy SMTP réussi',
            messageId: info.messageId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erreur test proxy:', error);
        
        res.status(500).json({
            success: false,
            message: 'Erreur test proxy SMTP',
            error: error.message
        });
    }
});

// @route   GET /api/smtp-proxy/status
// @desc    Vérifier le statut du proxy
// @access  Public
router.get('/status', (req, res) => {
    const status = {
        proxy: 'smtp.zoho.com:587',
        email: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci',
        configured: !!(process.env.ZOHO_EMAIL && process.env.ZOHO_PASSWORD),
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    res.json({
        success: true,
        status
    });
});

module.exports = router;

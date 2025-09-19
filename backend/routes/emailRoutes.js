const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configuration Email (Zoho ou Gmail)
const createEmailTransporter = () => {
    // Essayer d'abord Zoho, puis Gmail en fallback
    const zohoConfig = {
        host: 'smtp.zoho.com',
        port: 587,
        secure: false, // STARTTLS
        auth: {
            user: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci',
            pass: process.env.ZOHO_PASSWORD || 'votre-mot-de-passe-zoho'
        },
        tls: {
            rejectUnauthorized: false,
            ciphers: 'SSLv3'
        },
        connectionTimeout: 60000,
        greetingTimeout: 30000,
        socketTimeout: 60000,
        debug: true,
        logger: true
    };
    
    // Configuration Gmail en fallback
    const gmailConfig = {
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_EMAIL || 'contact@sorbo-ingenierie.ci',
            pass: process.env.GMAIL_PASSWORD || process.env.ZOHO_PASSWORD
        }
    };
    
    // Utiliser Zoho avec paramètres optimisés
    return nodemailer.createTransport(zohoConfig);
};

// @route   POST /api/email/contact
// @desc    Envoyer un email via Zoho Mail
// @access  Public
router.post('/contact', async (req, res) => {
    try {
        console.log('📧 Réception demande envoi email:', req.body);
        
        const {
            to,
            subject,
            html,
            text,
            formData,
            type
        } = req.body;

        // Validation des données requises
        if (!to || !subject || (!html && !text)) {
            return res.status(400).json({
                success: false,
                message: 'Données manquantes: to, subject, et html/text requis'
            });
        }

        // Créer le transporteur Email
        const transporter = createEmailTransporter();
        
        // Vérifier la connexion
        await transporter.verify();
        console.log('✅ Connexion Zoho Mail établie');

        // Options de l'email
        const mailOptions = {
            from: {
                name: 'Sorbo-Ingénierie',
                address: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci'
            },
            to: to,
            subject: subject,
            html: html,
            text: text,
            // Headers personnalisés
            headers: {
                'X-Mailer': 'Sorbo-Ingenierie-Website',
                'X-Form-Type': type || 'general',
                'X-Source': formData?.source || 'website'
            }
        };

        // Envoyer l'email
        const info = await transporter.sendMail(mailOptions);
        
        console.log('✅ Email envoyé:', info.messageId);
        
        // Sauvegarder en base de données (optionnel)
        await saveEmailLog({
            to,
            subject,
            type,
            formData,
            messageId: info.messageId,
            status: 'sent',
            sentAt: new Date()
        });

        res.json({
            success: true,
            message: 'Email envoyé avec succès',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('❌ Erreur envoi email:', error);
        
        // Sauvegarder l'erreur en base
        await saveEmailLog({
            to: req.body.to,
            subject: req.body.subject,
            type: req.body.type,
            formData: req.body.formData,
            status: 'failed',
            error: error.message,
            sentAt: new Date()
        });

        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi de l\'email',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
        });
    }
});

// @route   POST /api/email/test
// @desc    Tester la configuration Zoho
// @access  Public (à sécuriser en production)
router.post('/test', async (req, res) => {
    try {
        console.log('🧪 Test de la configuration Zoho Mail...');
        
        const transporter = createEmailTransporter();
        
        // Vérifier la connexion
        await transporter.verify();
        
        // Envoyer un email de test
        const testMail = {
            from: {
                name: 'Sorbo-Ingénierie Test',
                address: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci'
            },
            to: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci',
            subject: 'Test configuration Zoho Mail - Sorbo-Ingénierie',
            html: `
                <h2>Test réussi !</h2>
                <p>La configuration Zoho Mail fonctionne correctement.</p>
                <p><strong>Heure du test :</strong> ${new Date().toLocaleString('fr-FR')}</p>
                <hr>
                <p><em>Message automatique - Sorbo-Ingénierie</em></p>
            `,
            text: 'Test configuration Zoho Mail réussi ! ' + new Date().toLocaleString('fr-FR')
        };
        
        const info = await transporter.sendMail(testMail);
        
        console.log('✅ Email de test envoyé:', info.messageId);
        
        res.json({
            success: true,
            message: 'Test Zoho Mail réussi',
            messageId: info.messageId,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erreur test Zoho:', error);
        
        res.status(500).json({
            success: false,
            message: 'Erreur test Zoho Mail',
            error: error.message
        });
    }
});

// Fonction pour sauvegarder les logs d'emails
async function saveEmailLog(logData) {
    try {
        // TODO: Implémenter la sauvegarde en base de données
        // const EmailLog = require('../models/EmailLog');
        // await EmailLog.create(logData);
        
        console.log('📝 Log email:', logData);
        
    } catch (error) {
        console.error('❌ Erreur sauvegarde log email:', error);
    }
}

// @route   GET /api/email/config
// @desc    Vérifier la configuration email
// @access  Public
router.get('/config', (req, res) => {
    const config = {
        host: 'smtp.zoho.com',
        port: 465,
        email: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci',
        configured: !!(process.env.ZOHO_EMAIL && process.env.ZOHO_PASSWORD),
        timestamp: new Date().toISOString()
    };
    
    res.json({
        success: true,
        config
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();

// Service d'email via Resend (gratuit jusqu'à 3,000 emails/mois)
const sendEmailViaResend = async (emailData) => {
    try {
        const resendApiKey = process.env.RESEND_API_KEY;
        
        if (!resendApiKey) {
            throw new Error('RESEND_API_KEY non configurée');
        }

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Sorbo-Ingénierie <onboarding@resend.dev>',
                to: emailData.to,
                subject: emailData.subject,
                html: emailData.html,
                text: emailData.text
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Resend API Error: ${errorData.message || response.statusText}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('❌ Erreur Resend:', error);
        throw error;
    }
};

// @route   POST /api/email-service/send
// @desc    Envoyer un email via Resend
// @access  Public
router.post('/send', async (req, res) => {
    try {
        console.log('📧 Service Email - Réception demande:', req.body);
        
        const {
            to,
            subject,
            html,
            text,
            type = 'general'
        } = req.body;

        // Validation
        if (!to || !subject || (!html && !text)) {
            return res.status(400).json({
                success: false,
                message: 'Données manquantes: to, subject, et html/text requis'
            });
        }

        // Préparer les données email
        const emailData = {
            to: Array.isArray(to) ? to : [to],
            subject: subject,
            html: html,
            text: text
        };

        // Envoyer via Resend
        const result = await sendEmailViaResend(emailData);
        
        console.log('✅ Email envoyé via Resend:', result.id);
        
        res.json({
            success: true,
            message: 'Email envoyé avec succès via Resend',
            emailId: result.id,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erreur service email:', error);
        
        res.status(500).json({
            success: false,
            message: 'Erreur lors de l\'envoi de l\'email',
            error: error.message
        });
    }
});

// @route   POST /api/email-service/test
// @desc    Tester le service Resend
// @access  Public
router.post('/test', async (req, res) => {
    try {
        console.log('🧪 Test du service Resend...');
        
        const testEmail = {
            to: [process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci'],
            subject: 'Test Service Resend - Sorbo-Ingénierie',
            html: `
                <h2>🎉 Test Resend Réussi !</h2>
                <p>Le service Resend fonctionne correctement.</p>
                <p><strong>Heure du test :</strong> ${new Date().toLocaleString('fr-FR')}</p>
                <p><strong>Service :</strong> Resend API</p>
                <hr>
                <p><em>Message automatique - Sorbo-Ingénierie</em></p>
            `,
            text: `Test Resend réussi ! ${new Date().toLocaleString('fr-FR')}`
        };
        
        const result = await sendEmailViaResend(testEmail);
        
        console.log('✅ Email de test envoyé via Resend:', result.id);
        
        res.json({
            success: true,
            message: 'Test Resend réussi',
            emailId: result.id,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erreur test Resend:', error);
        
        res.status(500).json({
            success: false,
            message: 'Erreur test Resend',
            error: error.message
        });
    }
});

// @route   GET /api/email-service/status
// @desc    Vérifier le statut du service
// @access  Public
router.get('/status', (req, res) => {
    const status = {
        service: 'Resend',
        email: process.env.ZOHO_EMAIL || 'contact@sorbo-ingenierie.ci',
        configured: !!process.env.RESEND_API_KEY,
        timestamp: new Date().toISOString(),
        version: '1.0'
    };
    
    res.json({
        success: true,
        status
    });
});

module.exports = router;

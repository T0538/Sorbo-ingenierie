// Gestionnaire des newsletters - Système de stockage et envoi manuel
class NewsletterManager {
    constructor() {
        this.storageKey = 'newsletterEmails';
        this.init();
    }

    init() {
        // Ajouter un bouton d'administration si on est en mode développement
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.addAdminButton();
        }
    }

    // Ajouter un bouton d'administration pour gérer les newsletters
    addAdminButton() {
        const adminBtn = document.createElement('button');
        adminBtn.textContent = '📧 Admin Newsletter';
        adminBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 9999;
            background: #007bff;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
        `;
        
        adminBtn.onclick = () => this.showAdminPanel();
        document.body.appendChild(adminBtn);
    }

    // Afficher le panneau d'administration
    showAdminPanel() {
        const emails = this.getStoredEmails();
        const panel = document.createElement('div');
        panel.style.cssText = `
            position: fixed;
            top: 50px;
            right: 10px;
            width: 400px;
            max-height: 500px;
            background: white;
            border: 2px solid #007bff;
            border-radius: 8px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            overflow-y: auto;
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #007bff;">📧 Gestion Newsletter</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">✕</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <strong>Emails stockés: ${emails.length}</strong>
            </div>
            
            <div style="margin-bottom: 15px;">
                <button onclick="newsletterManager.exportEmails()" style="background: #28a745; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-right: 10px;">📥 Exporter</button>
                <button onclick="newsletterManager.clearEmails()" style="background: #dc3545; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">🗑️ Vider</button>
            </div>
            
            <div style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 4px;">
                ${emails.length === 0 ? '<p style="color: #666; font-style: italic;">Aucun email stocké</p>' : 
                  emails.map((item, index) => `
                    <div style="padding: 8px; border-bottom: 1px solid #eee; font-size: 12px;">
                        <strong>${item.email}</strong><br>
                        <span style="color: #666;">
                            ${new Date(item.date).toLocaleString('fr-FR')}<br>
                            Page: ${item.page}
                        </span>
                    </div>
                  `).join('')
                }
            </div>
        `;

        document.body.appendChild(panel);
    }

    // Récupérer les emails stockés
    getStoredEmails() {
        try {
            return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        } catch (error) {
            console.error('Erreur lecture emails newsletter:', error);
            return [];
        }
    }

    // Exporter les emails vers un fichier CSV
    exportEmails() {
        const emails = this.getStoredEmails();
        if (emails.length === 0) {
            alert('Aucun email à exporter');
            return;
        }

        const csvContent = [
            'Email,Date,Page',
            ...emails.map(item => `"${item.email}","${item.date}","${item.page}"`)
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `newsletter-emails-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Vider le stockage des emails
    clearEmails() {
        if (confirm('Êtes-vous sûr de vouloir supprimer tous les emails stockés ?')) {
            localStorage.removeItem(this.storageKey);
            alert('Emails supprimés');
            // Fermer le panneau et le rouvrir pour actualiser
            document.querySelector('div[style*="position: fixed"][style*="top: 50px"]')?.remove();
            setTimeout(() => this.showAdminPanel(), 100);
        }
    }

    // Envoyer tous les emails stockés vers Zoho Mail
    sendAllToZoho() {
        const emails = this.getStoredEmails();
        if (emails.length === 0) {
            alert('Aucun email à envoyer');
            return;
        }

        const subject = `📧 Export Newsletter - ${emails.length} emails`;
        const body = this.formatBulkEmailBody(emails);
        
        const mailtoLink = `mailto:newsletter@sorbo-ingenierie.ci?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    }

    // Formater le corps d'email pour l'envoi groupé
    formatBulkEmailBody(emails) {
        let body = `📧 EXPORT NEWSLETTER - ${emails.length} EMAILS\n\n`;
        body += `Date d'export: ${new Date().toLocaleString('fr-FR')}\n\n`;
        
        body += `--- LISTE DES EMAILS ---\n`;
        emails.forEach((item, index) => {
            body += `${index + 1}. ${item.email}\n`;
            body += `   Date: ${new Date(item.date).toLocaleString('fr-FR')}\n`;
            body += `   Page: ${item.page}\n\n`;
        });
        
        body += `--- FORMAT CSV ---\n`;
        body += `Email,Date,Page\n`;
        emails.forEach(item => {
            body += `"${item.email}","${item.date}","${item.page}"\n`;
        });
        
        return body;
    }
}

// Initialiser le gestionnaire de newsletter
const newsletterManager = new NewsletterManager();

// Exposer globalement pour l'administration
window.newsletterManager = newsletterManager;
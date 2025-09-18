/**
 * Système de base de données locale pour la gestion des abonnés newsletter
 * Inclut stockage, export, statistiques et gestion RGPD
 */

class NewsletterDatabase {
    constructor() {
        this.dbName = 'NewsletterDB';
        this.version = 1;
        this.db = null;
        this.subscribers = [];
        this.statistics = {
            totalSubscribers: 0,
            subscriptionsByCategory: {},
            subscriptionsByMonth: {},
            bounceRate: 0,
            openRate: 0
        };
        this.init();
    }

    // Initialisation de la base de données IndexedDB
    async init() {
        try {
            await this.openDatabase();
            await this.loadSubscribers();
            this.updateStatistics();
            console.log('📊 Newsletter Database initialisée');
        } catch (error) {
            console.error('Erreur initialisation database:', error);
            // Fallback vers localStorage
            this.initLocalStorageFallback();
        }
    }

    // Ouverture de la base IndexedDB
    openDatabase() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Store des abonnés
                if (!db.objectStoreNames.contains('subscribers')) {
                    const subscriberStore = db.createObjectStore('subscribers', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    subscriberStore.createIndex('email', 'email', { unique: true });
                    subscriberStore.createIndex('status', 'status', { unique: false });
                    subscriberStore.createIndex('createdAt', 'createdAt', { unique: false });
                }

                // Store des statistiques
                if (!db.objectStoreNames.contains('statistics')) {
                    db.createObjectStore('statistics', { keyPath: 'id' });
                }

                // Store des campagnes
                if (!db.objectStoreNames.contains('campaigns')) {
                    const campaignStore = db.createObjectStore('campaigns', { 
                        keyPath: 'id', 
                        autoIncrement: true 
                    });
                    campaignStore.createIndex('sentAt', 'sentAt', { unique: false });
                    campaignStore.createIndex('category', 'category', { unique: false });
                }
            };
        });
    }

    // Fallback vers localStorage si IndexedDB n'est pas disponible
    initLocalStorageFallback() {
        console.warn('IndexedDB non disponible, utilisation de localStorage');
        this.loadFromLocalStorage();
    }

    // Ajouter un nouvel abonné
    async addSubscriber(subscriberData) {
        const subscriber = {
            ...subscriberData,
            id: this.generateId(),
            status: 'pending', // pending, confirmed, unsubscribed, bounced
            createdAt: new Date().toISOString(),
            confirmedAt: null,
            lastEmailSent: null,
            emailsSent: 0,
            emailsOpened: 0,
            clickCount: 0,
            source: subscriberData.source || 'website',
            ipAddress: await this.getUserIP(),
            userAgent: navigator.userAgent,
            gdprConsent: true,
            doubleOptInToken: this.generateToken()
        };

        try {
            if (this.db) {
                await this.saveToIndexedDB('subscribers', subscriber);
            } else {
                this.saveToLocalStorage('subscribers', subscriber);
            }
            
            this.subscribers.push(subscriber);
            this.updateStatistics();
            
            console.log('✅ Nouvel abonné ajouté:', subscriber.email);
            return subscriber;
        } catch (error) {
            console.error('Erreur ajout abonné:', error);
            throw error;
        }
    }

    // Confirmer un abonné (double opt-in)
    async confirmSubscriber(token) {
        const subscriber = this.subscribers.find(s => s.doubleOptInToken === token);
        
        if (!subscriber) {
            throw new Error('Token de confirmation invalide');
        }

        subscriber.status = 'confirmed';
        subscriber.confirmedAt = new Date().toISOString();

        await this.updateSubscriber(subscriber);
        return subscriber;
    }

    // Mettre à jour un abonné
    async updateSubscriber(subscriberData) {
        const index = this.subscribers.findIndex(s => s.id === subscriberData.id);
        
        if (index === -1) {
            throw new Error('Abonné non trouvé');
        }

        this.subscribers[index] = { ...this.subscribers[index], ...subscriberData };

        try {
            if (this.db) {
                await this.saveToIndexedDB('subscribers', this.subscribers[index]);
            } else {
                this.saveToLocalStorage('subscribers', this.subscribers[index]);
            }
            
            this.updateStatistics();
            return this.subscribers[index];
        } catch (error) {
            console.error('Erreur mise à jour abonné:', error);
            throw error;
        }
    }

    // Désabonner un utilisateur
    async unsubscribeUser(email, reason = 'user_request') {
        const subscriber = this.subscribers.find(s => s.email === email);
        
        if (!subscriber) {
            throw new Error('Abonné non trouvé');
        }

        subscriber.status = 'unsubscribed';
        subscriber.unsubscribedAt = new Date().toISOString();
        subscriber.unsubscribeReason = reason;

        await this.updateSubscriber(subscriber);
        console.log('❌ Utilisateur désabonné:', email);
        return subscriber;
    }

    // Obtenir tous les abonnés actifs
    getActiveSubscribers(category = null) {
        let active = this.subscribers.filter(s => s.status === 'confirmed');
        
        if (category) {
            active = active.filter(s => s.categories && s.categories.includes(category));
        }
        
        return active;
    }

    // Rechercher des abonnés
    searchSubscribers(query, filters = {}) {
        let results = this.subscribers;

        // Recherche textuelle
        if (query) {
            const searchTerm = query.toLowerCase();
            results = results.filter(s => 
                s.email.toLowerCase().includes(searchTerm) ||
                (s.firstName && s.firstName.toLowerCase().includes(searchTerm)) ||
                (s.lastName && s.lastName.toLowerCase().includes(searchTerm))
            );
        }

        // Filtres
        if (filters.status) {
            results = results.filter(s => s.status === filters.status);
        }

        if (filters.category) {
            results = results.filter(s => s.categories && s.categories.includes(filters.category));
        }

        if (filters.dateFrom) {
            results = results.filter(s => new Date(s.createdAt) >= new Date(filters.dateFrom));
        }

        if (filters.dateTo) {
            results = results.filter(s => new Date(s.createdAt) <= new Date(filters.dateTo));
        }

        return results;
    }

    // Exporter les données
    exportData(format = 'json', filters = {}) {
        const data = this.searchSubscribers('', filters);
        
        switch (format) {
            case 'csv':
                return this.exportToCSV(data);
            case 'json':
                return this.exportToJSON(data);
            case 'xlsx':
                return this.exportToExcel(data);
            default:
                throw new Error('Format d\'export non supporté');
        }
    }

    // Export CSV
    exportToCSV(data) {
        const headers = [
            'Email', 'Statut', 'Catégories', 'Date inscription', 
            'Date confirmation', 'Source', 'Emails envoyés', 'Emails ouverts'
        ];

        const rows = data.map(subscriber => [
            subscriber.email,
            subscriber.status,
            subscriber.categories ? subscriber.categories.join(';') : '',
            subscriber.createdAt,
            subscriber.confirmedAt || '',
            subscriber.source,
            subscriber.emailsSent,
            subscriber.emailsOpened
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(field => `"${field}"`).join(','))
            .join('\n');

        this.downloadFile(csvContent, 'newsletters-subscribers.csv', 'text/csv');
        return csvContent;
    }

    // Export JSON
    exportToJSON(data) {
        const jsonContent = JSON.stringify({
            exportDate: new Date().toISOString(),
            totalRecords: data.length,
            data: data
        }, null, 2);

        this.downloadFile(jsonContent, 'newsletters-subscribers.json', 'application/json');
        return jsonContent;
    }

    // Télécharger un fichier
    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Mettre à jour les statistiques
    updateStatistics() {
        const now = new Date();
        const stats = {
            totalSubscribers: this.subscribers.length,
            activeSubscribers: this.subscribers.filter(s => s.status === 'confirmed').length,
            pendingSubscribers: this.subscribers.filter(s => s.status === 'pending').length,
            unsubscribed: this.subscribers.filter(s => s.status === 'unsubscribed').length,
            subscriptionsByCategory: {},
            subscriptionsByMonth: {},
            lastUpdated: now.toISOString()
        };

        // Statistiques par catégorie
        this.subscribers.forEach(subscriber => {
            if (subscriber.categories) {
                subscriber.categories.forEach(category => {
                    stats.subscriptionsByCategory[category] = 
                        (stats.subscriptionsByCategory[category] || 0) + 1;
                });
            }
        });

        // Statistiques par mois
        this.subscribers.forEach(subscriber => {
            const month = new Date(subscriber.createdAt).toISOString().substring(0, 7);
            stats.subscriptionsByMonth[month] = 
                (stats.subscriptionsByMonth[month] || 0) + 1;
        });

        // Calcul des taux
        const activeSubscribers = this.subscribers.filter(s => s.status === 'confirmed');
        if (activeSubscribers.length > 0) {
            const totalEmailsSent = activeSubscribers.reduce((sum, s) => sum + s.emailsSent, 0);
            const totalEmailsOpened = activeSubscribers.reduce((sum, s) => sum + s.emailsOpened, 0);
            
            stats.openRate = totalEmailsSent > 0 ? (totalEmailsOpened / totalEmailsSent * 100).toFixed(2) : 0;
        }

        this.statistics = stats;
        
        // Sauvegarder les stats
        if (this.db) {
            this.saveToIndexedDB('statistics', { id: 'current', ...stats });
        } else {
            localStorage.setItem('newsletter_statistics', JSON.stringify(stats));
        }

        return stats;
    }

    // Obtenir les statistiques
    getStatistics() {
        return this.statistics;
    }

    // Sauvegarder dans IndexedDB
    saveToIndexedDB(storeName, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Charger depuis IndexedDB
    loadSubscribers() {
        return new Promise((resolve, reject) => {
            if (!this.db) {
                this.loadFromLocalStorage();
                resolve();
                return;
            }

            const transaction = this.db.transaction(['subscribers'], 'readonly');
            const store = transaction.objectStore('subscribers');
            const request = store.getAll();
            
            request.onsuccess = () => {
                this.subscribers = request.result || [];
                resolve();
            };
            request.onerror = () => reject(request.error);
        });
    }

    // Sauvegarder dans localStorage (fallback)
    saveToLocalStorage(type, data) {
        const key = `newsletter_${type}`;
        let existing = JSON.parse(localStorage.getItem(key) || '[]');
        
        if (Array.isArray(existing)) {
            const index = existing.findIndex(item => item.id === data.id);
            if (index >= 0) {
                existing[index] = data;
            } else {
                existing.push(data);
            }
        } else {
            existing = [data];
        }
        
        localStorage.setItem(key, JSON.stringify(existing));
    }

    // Charger depuis localStorage
    loadFromLocalStorage() {
        const saved = localStorage.getItem('newsletter_subscribers');
        if (saved) {
            try {
                this.subscribers = JSON.parse(saved);
            } catch (e) {
                console.error('Erreur chargement localStorage:', e);
                this.subscribers = [];
            }
        }
    }

    // Générer un ID unique
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Générer un token sécurisé
    generateToken() {
        return Array.from(crypto.getRandomValues(new Uint8Array(32)))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    // Obtenir l'IP de l'utilisateur (approximatif)
    async getUserIP() {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch (error) {
            return 'unknown';
        }
    }

    // Nettoyage RGPD - supprimer les données expirées
    cleanupExpiredData(daysToKeep = 365) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        const beforeCount = this.subscribers.length;
        this.subscribers = this.subscribers.filter(subscriber => {
            // Garder les abonnés actifs
            if (subscriber.status === 'confirmed') return true;
            
            // Supprimer les anciens non-confirmés
            return new Date(subscriber.createdAt) > cutoffDate;
        });

        const deletedCount = beforeCount - this.subscribers.length;
        console.log(`🧹 Nettoyage RGPD: ${deletedCount} enregistrements supprimés`);
        
        this.updateStatistics();
        return deletedCount;
    }

    // Vérifier la conformité RGPD
    checkGDPRCompliance() {
        const issues = [];
        
        // Vérifier les consentements
        const noConsent = this.subscribers.filter(s => !s.gdprConsent);
        if (noConsent.length > 0) {
            issues.push(`${noConsent.length} abonnés sans consentement RGPD`);
        }

        // Vérifier les anciennes données non confirmées
        const oldPending = this.subscribers.filter(s => {
            if (s.status !== 'pending') return false;
            const daysSinceCreation = (Date.now() - new Date(s.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceCreation > 30;
        });
        
        if (oldPending.length > 0) {
            issues.push(`${oldPending.length} abonnements non confirmés de plus de 30 jours`);
        }

        return {
            isCompliant: issues.length === 0,
            issues: issues,
            checkedAt: new Date().toISOString()
        };
    }
}

// Exporter la classe
window.NewsletterDatabase = NewsletterDatabase;

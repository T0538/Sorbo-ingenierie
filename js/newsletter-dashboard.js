/**
 * Dashboard d'administration pour la gestion des newsletters
 * Interface complète pour gérer les abonnés, statistiques et campagnes
 */

class NewsletterDashboard {
    constructor() {
        this.isVisible = false;
        this.currentView = 'overview';
        this.database = null;
        this.charts = {};
        this.init();
    }

    // Initialisation
    async init() {
        await this.waitForDatabase();
        this.createDashboard();
        this.setupKeyboardShortcuts();
        console.log('📊 Dashboard Newsletter initialisé');
    }

    // Attendre que la base de données soit disponible
    waitForDatabase() {
        return new Promise((resolve) => {
            const checkDatabase = () => {
                if (window.newsletterDB || window.NewsletterDatabase) {
                    this.database = window.newsletterDB || new window.NewsletterDatabase();
                    resolve();
                } else {
                    setTimeout(checkDatabase, 100);
                }
            };
            checkDatabase();
        });
    }

    // Créer l'interface du dashboard
    createDashboard() {
        const dashboardHTML = `
            <div id="newsletter-dashboard" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: none;
                overflow: hidden;
            ">
                <div class="dashboard-container" style="
                    width: 100%;
                    height: 100%;
                    display: flex;
                    background: #f8f9fa;
                ">
                    <!-- Sidebar -->
                    <div class="dashboard-sidebar" style="
                        width: 280px;
                        background: #2c3e50;
                        color: white;
                        padding: 0;
                        overflow-y: auto;
                    ">
                        <div class="sidebar-header" style="
                            padding: 30px 25px;
                            border-bottom: 1px solid #34495e;
                            background: #34495e;
                        ">
                            <div style="display: flex; align-items: center; gap: 15px;">
                                <div style="
                                    width: 50px;
                                    height: 50px;
                                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                    border-radius: 12px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 24px;
                                ">
                                    📧
                                </div>
                                <div>
                                    <h2 style="margin: 0; font-size: 18px; font-weight: 600;">Newsletter</h2>
                                    <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.7;">Administration</p>
                                </div>
                            </div>
                        </div>

                        <nav class="sidebar-nav" style="padding: 20px 0;">
                            ${this.createSidebarMenu()}
                        </nav>
                    </div>

                    <!-- Main Content -->
                    <div class="dashboard-main" style="
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        overflow: hidden;
                    ">
                        <!-- Header -->
                        <div class="dashboard-header" style="
                            background: white;
                            padding: 20px 30px;
                            border-bottom: 1px solid #e9ecef;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        ">
                            <div>
                                <h1 id="dashboard-title" style="margin: 0; font-size: 24px; color: #2c3e50;">Vue d'ensemble</h1>
                                <p id="dashboard-subtitle" style="margin: 5px 0 0 0; color: #6c757d;">Gestion de vos newsletters</p>
                            </div>
                            <div style="display: flex; gap: 15px; align-items: center;">
                                <button id="refresh-dashboard" style="
                                    background: #007bff;
                                    color: white;
                                    border: none;
                                    padding: 10px 15px;
                                    border-radius: 6px;
                                    cursor: pointer;
                                    display: flex;
                                    align-items: center;
                                    gap: 8px;
                                ">
                                    <i class="fas fa-sync-alt"></i> Actualiser
                                </button>
                                <button id="close-dashboard" style="
                                    background: #6c757d;
                                    color: white;
                                    border: none;
                                    padding: 10px 15px;
                                    border-radius: 6px;
                                    cursor: pointer;
                                ">
                                    <i class="fas fa-times"></i> Fermer
                                </button>
                            </div>
                        </div>

                        <!-- Content Area -->
                        <div class="dashboard-content" style="
                            flex: 1;
                            padding: 30px;
                            overflow-y: auto;
                            background: #f8f9fa;
                        ">
                            <div id="dashboard-view">
                                ${this.createOverviewView()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', dashboardHTML);
        this.setupEventListeners();
        this.addDashboardStyles();
    }

    // Créer le menu de la sidebar
    createSidebarMenu() {
        const menuItems = [
            { id: 'overview', icon: 'fas fa-chart-line', label: 'Vue d\'ensemble', badge: '' },
            { id: 'subscribers', icon: 'fas fa-users', label: 'Abonnés', badge: this.database ? this.database.subscribers.length : '0' },
            { id: 'categories', icon: 'fas fa-tags', label: 'Catégories', badge: '' },
            { id: 'campaigns', icon: 'fas fa-paper-plane', label: 'Campagnes', badge: '' },
            { id: 'analytics', icon: 'fas fa-analytics', label: 'Statistiques', badge: '' },
            { id: 'settings', icon: 'fas fa-cog', label: 'Configuration', badge: '' },
            { id: 'export', icon: 'fas fa-download', label: 'Export', badge: '' }
        ];

        return menuItems.map(item => `
            <a href="#" class="sidebar-menu-item" data-view="${item.id}" style="
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px 25px;
                color: #bdc3c7;
                text-decoration: none;
                transition: all 0.3s ease;
                border-left: 3px solid transparent;
            ">
                <i class="${item.icon}" style="width: 20px; text-align: center;"></i>
                <span style="flex: 1;">${item.label}</span>
                ${item.badge ? `<span class="badge" style="
                    background: #3498db;
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                ">${item.badge}</span>` : ''}
            </a>
        `).join('');
    }

    // Vue d'ensemble
    createOverviewView() {
        const stats = this.database ? this.database.getStatistics() : {};
        
        return `
            <div class="overview-grid" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                gap: 25px;
                margin-bottom: 30px;
            ">
                <!-- Cartes de statistiques -->
                <div class="stat-card" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="margin: 0; font-size: 14px; opacity: 0.9; font-weight: 500;">Total Abonnés</h3>
                            <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: 700;">${stats.totalSubscribers || 0}</p>
                        </div>
                        <div style="font-size: 40px; opacity: 0.3;">
                            <i class="fas fa-users"></i>
                        </div>
                    </div>
                </div>

                <div class="stat-card" style="
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(245, 87, 108, 0.4);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="margin: 0; font-size: 14px; opacity: 0.9; font-weight: 500;">Abonnés Actifs</h3>
                            <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: 700;">${stats.activeSubscribers || 0}</p>
                        </div>
                        <div style="font-size: 40px; opacity: 0.3;">
                            <i class="fas fa-user-check"></i>
                        </div>
                    </div>
                </div>

                <div class="stat-card" style="
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(79, 172, 254, 0.4);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="margin: 0; font-size: 14px; opacity: 0.9; font-weight: 500;">Taux d'Ouverture</h3>
                            <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: 700;">${stats.openRate || 0}%</p>
                        </div>
                        <div style="font-size: 40px; opacity: 0.3;">
                            <i class="fas fa-envelope-open"></i>
                        </div>
                    </div>
                </div>

                <div class="stat-card" style="
                    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
                    color: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(250, 112, 154, 0.4);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="margin: 0; font-size: 14px; opacity: 0.9; font-weight: 500;">En Attente</h3>
                            <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: 700;">${stats.pendingSubscribers || 0}</p>
                        </div>
                        <div style="font-size: 40px; opacity: 0.3;">
                            <i class="fas fa-clock"></i>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Graphiques -->
            <div class="charts-grid" style="
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 25px;
                margin-bottom: 30px;
            ">
                <div class="chart-container" style="
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin: 0 0 20px 0; color: #2c3e50;">Évolution des abonnements</h3>
                    <canvas id="subscriptions-chart" width="400" height="200"></canvas>
                </div>

                <div class="chart-container" style="
                    background: white;
                    padding: 25px;
                    border-radius: 12px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                ">
                    <h3 style="margin: 0 0 20px 0; color: #2c3e50;">Répartition par catégorie</h3>
                    <canvas id="categories-chart" width="300" height="200"></canvas>
                </div>
            </div>

            <!-- Actions rapides -->
            <div class="quick-actions" style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
            ">
                <button class="action-button" onclick="newsletterDashboard.exportData()" style="
                    background: white;
                    border: 2px solid #007bff;
                    color: #007bff;
                    padding: 20px;
                    border-radius: 12px;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.3s ease;
                ">
                    <div style="font-size: 24px; margin-bottom: 10px;">
                        <i class="fas fa-download"></i>
                    </div>
                    <div style="font-weight: 600; margin-bottom: 5px;">Exporter les données</div>
                    <div style="font-size: 14px; opacity: 0.7;">CSV, JSON, Excel</div>
                </button>

                <button class="action-button" onclick="newsletterDashboard.showView('settings')" style="
                    background: white;
                    border: 2px solid #28a745;
                    color: #28a745;
                    padding: 20px;
                    border-radius: 12px;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.3s ease;
                ">
                    <div style="font-size: 24px; margin-bottom: 10px;">
                        <i class="fas fa-cog"></i>
                    </div>
                    <div style="font-weight: 600; margin-bottom: 5px;">Configuration</div>
                    <div style="font-size: 14px; opacity: 0.7;">EmailJS, RGPD</div>
                </button>

                <button class="action-button" onclick="newsletterDashboard.cleanupData()" style="
                    background: white;
                    border: 2px solid #ffc107;
                    color: #ffc107;
                    padding: 20px;
                    border-radius: 12px;
                    cursor: pointer;
                    text-align: center;
                    transition: all 0.3s ease;
                ">
                    <div style="font-size: 24px; margin-bottom: 10px;">
                        <i class="fas fa-broom"></i>
                    </div>
                    <div style="font-weight: 600; margin-bottom: 5px;">Nettoyage RGPD</div>
                    <div style="font-size: 14px; opacity: 0.7;">Supprimer anciennes données</div>
                </button>
            </div>
        `;
    }

    // Vue des abonnés
    createSubscribersView() {
        const subscribers = this.database ? this.database.subscribers : [];
        
        return `
            <div class="subscribers-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
            ">
                <div>
                    <h2 style="margin: 0; color: #2c3e50;">Gestion des abonnés</h2>
                    <p style="margin: 5px 0 0 0; color: #6c757d;">${subscribers.length} abonné(s) au total</p>
                </div>
                
                <div style="display: flex; gap: 15px;">
                    <input type="text" id="search-subscribers" placeholder="Rechercher..." style="
                        padding: 10px 15px;
                        border: 2px solid #e9ecef;
                        border-radius: 6px;
                        width: 300px;
                    ">
                    <select id="filter-status" style="
                        padding: 10px 15px;
                        border: 2px solid #e9ecef;
                        border-radius: 6px;
                    ">
                        <option value="">Tous les statuts</option>
                        <option value="confirmed">Confirmés</option>
                        <option value="pending">En attente</option>
                        <option value="unsubscribed">Désabonnés</option>
                    </select>
                </div>
            </div>

            <div class="subscribers-table" style="
                background: white;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            ">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="background: #f8f9fa;">
                        <tr>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #2c3e50;">Email</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #2c3e50;">Statut</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #2c3e50;">Catégories</th>
                            <th style="padding: 15px; text-align: left; font-weight: 600; color: #2c3e50;">Date</th>
                            <th style="padding: 15px; text-align: center; font-weight: 600; color: #2c3e50;">Actions</th>
                        </tr>
                    </thead>
                    <tbody id="subscribers-list">
                        ${this.renderSubscribersList(subscribers)}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Rendu de la liste des abonnés
    renderSubscribersList(subscribers) {
        if (!subscribers || subscribers.length === 0) {
            return `
                <tr>
                    <td colspan="5" style="padding: 40px; text-align: center; color: #6c757d;">
                        <div style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;">
                            <i class="fas fa-inbox"></i>
                        </div>
                        <div>Aucun abonné pour le moment</div>
                    </td>
                </tr>
            `;
        }

        return subscribers.map(subscriber => {
            const statusColors = {
                confirmed: '#28a745',
                pending: '#ffc107',
                unsubscribed: '#6c757d',
                bounced: '#dc3545'
            };

            const statusLabels = {
                confirmed: 'Confirmé',
                pending: 'En attente',
                unsubscribed: 'Désabonné',
                bounced: 'Bounced'
            };

            return `
                <tr style="border-bottom: 1px solid #e9ecef;">
                    <td style="padding: 15px;">
                        <div style="font-weight: 500;">${subscriber.email}</div>
                        ${subscriber.firstName ? `<div style="font-size: 12px; color: #6c757d;">${subscriber.firstName}</div>` : ''}
                    </td>
                    <td style="padding: 15px;">
                        <span style="
                            background: ${statusColors[subscriber.status] || '#6c757d'};
                            color: white;
                            padding: 4px 12px;
                            border-radius: 20px;
                            font-size: 12px;
                            font-weight: 500;
                        ">
                            ${statusLabels[subscriber.status] || subscriber.status}
                        </span>
                    </td>
                    <td style="padding: 15px;">
                        <div style="font-size: 12px;">
                            ${subscriber.categories ? subscriber.categories.join(', ') : 'Aucune'}
                        </div>
                    </td>
                    <td style="padding: 15px;">
                        <div style="font-size: 12px; color: #6c757d;">
                            ${new Date(subscriber.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                    </td>
                    <td style="padding: 15px; text-align: center;">
                        <div style="display: flex; gap: 5px; justify-content: center;">
                            <button onclick="newsletterDashboard.editSubscriber('${subscriber.id}')" style="
                                background: #007bff;
                                color: white;
                                border: none;
                                padding: 5px 10px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            ">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button onclick="newsletterDashboard.deleteSubscriber('${subscriber.id}')" style="
                                background: #dc3545;
                                color: white;
                                border: none;
                                padding: 5px 10px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 12px;
                            ">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Configuration des écouteurs d'événements
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.sidebar-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const view = e.currentTarget.dataset.view;
                this.showView(view);
            });
        });

        // Fermeture
        document.getElementById('close-dashboard').addEventListener('click', () => {
            this.hide();
        });

        // Actualisation
        document.getElementById('refresh-dashboard').addEventListener('click', () => {
            this.refresh();
        });
    }

    // Configurer les raccourcis clavier
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+Alt+D pour ouvrir/fermer le dashboard
            if (e.ctrlKey && e.altKey && e.key === 'd') {
                e.preventDefault();
                this.toggle();
            }

            // ESC pour fermer
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }

    // Afficher une vue spécifique
    showView(viewName) {
        this.currentView = viewName;
        
        // Mettre à jour la navigation
        document.querySelectorAll('.sidebar-menu-item').forEach(item => {
            item.style.background = '';
            item.style.borderLeftColor = 'transparent';
            item.style.color = '#bdc3c7';
        });

        const activeItem = document.querySelector(`[data-view="${viewName}"]`);
        if (activeItem) {
            activeItem.style.background = 'rgba(52, 73, 94, 0.8)';
            activeItem.style.borderLeftColor = '#3498db';
            activeItem.style.color = 'white';
        }

        // Mettre à jour le contenu
        const content = document.getElementById('dashboard-view');
        const title = document.getElementById('dashboard-title');
        const subtitle = document.getElementById('dashboard-subtitle');

        switch (viewName) {
            case 'overview':
                title.textContent = 'Vue d\'ensemble';
                subtitle.textContent = 'Statistiques générales de vos newsletters';
                content.innerHTML = this.createOverviewView();
                this.initCharts();
                break;
                
            case 'subscribers':
                title.textContent = 'Gestion des abonnés';
                subtitle.textContent = 'Liste et gestion de tous vos abonnés';
                content.innerHTML = this.createSubscribersView();
                this.setupSubscribersFilters();
                break;
                
            case 'categories':
                title.textContent = 'Catégories';
                subtitle.textContent = 'Gestion des catégories de newsletter';
                content.innerHTML = this.createCategoriesView();
                break;
                
            case 'settings':
                title.textContent = 'Configuration';
                subtitle.textContent = 'Paramètres système et EmailJS';
                content.innerHTML = this.createSettingsView();
                break;
                
            default:
                title.textContent = 'En cours de développement';
                subtitle.textContent = 'Cette section sera bientôt disponible';
                content.innerHTML = '<div style="text-align: center; padding: 50px; color: #6c757d;">🚧 Section en développement</div>';
        }
    }

    // Afficher le dashboard
    show() {
        const dashboard = document.getElementById('newsletter-dashboard');
        if (dashboard) {
            dashboard.style.display = 'block';
            this.isVisible = true;
            this.refresh();
        }
    }

    // Masquer le dashboard
    hide() {
        const dashboard = document.getElementById('newsletter-dashboard');
        if (dashboard) {
            dashboard.style.display = 'none';
            this.isVisible = false;
        }
    }

    // Basculer l'affichage
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    // Actualiser les données
    refresh() {
        if (this.database) {
            this.database.updateStatistics();
        }
        this.showView(this.currentView);
    }

    // Initialiser les graphiques (placeholder)
    initCharts() {
        // Ici vous pourriez intégrer Chart.js ou une autre librairie
        console.log('📊 Graphiques initialisés (placeholder)');
    }

    // Exporter les données
    exportData() {
        if (this.database) {
            this.database.exportData('csv');
        }
    }

    // Nettoyage RGPD
    cleanupData() {
        if (confirm('Voulez-vous supprimer les données expirées ? (non-confirmées > 30 jours)')) {
            if (this.database) {
                const deleted = this.database.cleanupExpiredData(30);
                alert(`${deleted} enregistrement(s) supprimé(s)`);
                this.refresh();
            }
        }
    }

    // Ajouter les styles CSS
    addDashboardStyles() {
        if (document.getElementById('newsletter-dashboard-styles')) return;

        const styles = `
            .action-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
            }

            .sidebar-menu-item:hover {
                background: rgba(52, 73, 94, 0.6) !important;
                color: white !important;
            }

            #newsletter-dashboard * {
                box-sizing: border-box;
            }

            .dashboard-content::-webkit-scrollbar {
                width: 8px;
            }

            .dashboard-content::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            .dashboard-content::-webkit-scrollbar-thumb {
                background: #c1c1c1;
                border-radius: 4px;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'newsletter-dashboard-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Vue des catégories (placeholder)
    createCategoriesView() {
        return '<div style="text-align: center; padding: 50px;">🏷️ Gestion des catégories (en développement)</div>';
    }

    // Vue des paramètres (placeholder)
    createSettingsView() {
        return `
            <div style="max-width: 600px;">
                <div style="background: white; padding: 30px; border-radius: 12px; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 20px 0;">Configuration EmailJS</h3>
                    <p style="color: #6c757d; margin-bottom: 20px;">
                        Configurez votre service d'envoi d'emails avec EmailJS.
                    </p>
                    <button onclick="window.newsletterEmailJS?.showConfigInterface()" style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 12px 25px;
                        border-radius: 6px;
                        cursor: pointer;
                    ">
                        Ouvrir la configuration EmailJS
                    </button>
                </div>

                <div style="background: white; padding: 30px; border-radius: 12px;">
                    <h3 style="margin: 0 0 20px 0;">Conformité RGPD</h3>
                    <div style="color: #6c757d; margin-bottom: 20px;">
                        <p>✅ Double opt-in activé</p>
                        <p>✅ Liens de désinscription inclus</p>
                        <p>✅ Consentement utilisateur enregistré</p>
                        <p>✅ Suppression automatique des données expirées</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', () => {
    window.newsletterDashboard = new NewsletterDashboard();
});

// Export
window.NewsletterDashboard = NewsletterDashboard;

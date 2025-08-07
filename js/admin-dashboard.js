// Dashboard d'administration unifié
console.log('🎛️ Démarrage du dashboard d\'administration...');
const API_BASE_URL = 'https://sorbo-api-production.up.railway.app'; // Production Railway
// const API_BASE_URL = 'http://localhost:5000'; // Développement local
const ADMIN_TOKEN = 'admin123';
let currentSection = 'stats';
let editingItem = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    setupNavigation();
});

// Navigation
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
            
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showSection(section) {
    document.querySelectorAll('.admin-content').forEach(content => {
        content.classList.add('hidden');
    });

    document.getElementById(section + '-section').classList.remove('hidden');
    currentSection = section;

    switch(section) {
        case 'stats':
            loadStats();
            break;
        case 'actualites':
            loadActualites();
            break;
        case 'logiciels':
            loadLogiciels();
            break;
        case 'emplois':
            loadEmplois();
            break;
        case 'formations':
            loadFormations();
            break;
        case 'contacts':
            loadContacts();
            break;
    }
}

// Fonctions API
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${ADMIN_TOKEN}`
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Erreur API');
        }

        return result;
    } catch (error) {
        console.error('Erreur API:', error);
        showAlert('Erreur: ' + error.message, 'error');
        throw error;
    }
}

// Statistiques
async function loadStats() {
    try {
        const stats = await apiCall('/admin/stats');
        displayStats(stats.data);
    } catch (error) {
        document.getElementById('stats-grid').innerHTML = '<div class="alert alert-error">Erreur lors du chargement des statistiques</div>';
    }
}

function displayStats(stats) {
    const statsGrid = document.getElementById('stats-grid');
    statsGrid.innerHTML = `
        <div class="stat-card">
            <h3>${stats.contacts}</h3>
            <p>Contacts</p>
        </div>
        <div class="stat-card">
            <h3>${stats.formations}</h3>
            <p>Formations</p>
        </div>
        <div class="stat-card">
            <h3>${stats.actualites}</h3>
            <p>Actualités</p>
        </div>
        <div class="stat-card">
            <h3>${stats.logiciels}</h3>
            <p>Logiciels</p>
        </div>
        <div class="stat-card">
            <h3>${stats.emplois}</h3>
            <p>Emplois</p>
        </div>
        <div class="stat-card">
            <h3>${stats.actualitesPubliees}</h3>
            <p>Actualités Publiées</p>
        </div>
    `;
}

// Actualités
async function loadActualites() {
    try {
        const actualites = await apiCall('/admin/actualites');
        displayActualites(actualites.data);
    } catch (error) {
        document.getElementById('actualites-table').innerHTML = '<div class="alert alert-error">Erreur lors du chargement des actualités</div>';
    }
}

function displayActualites(actualites) {
    const table = document.getElementById('actualites-table');
    if (actualites.length === 0) {
        table.innerHTML = '<div class="alert alert-error">Aucune actualité trouvée</div>';
        return;
    }

    table.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Catégorie</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${actualites.map(actualite => `
                    <tr>
                        <td>${actualite.titre}</td>
                        <td>${actualite.categorie}</td>
                        <td><span style="color: ${actualite.statut === 'publie' ? 'green' : 'orange'}">${actualite.statut}</span></td>
                        <td>${new Date(actualite.datePublication).toLocaleDateString()}</td>
                        <td class="action-buttons">
                            <button class="btn btn-secondary" onclick="editItem('actualite', '${actualite._id}')">✏️</button>
                            <button class="btn btn-danger" onclick="deleteItem('actualite', '${actualite._id}')">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Logiciels
async function loadLogiciels() {
    try {
        const logiciels = await apiCall('/admin/logiciels');
        displayLogiciels(logiciels.data);
    } catch (error) {
        document.getElementById('logiciels-table').innerHTML = '<div class="alert alert-error">Erreur lors du chargement des logiciels</div>';
    }
}

function displayLogiciels(logiciels) {
    const table = document.getElementById('logiciels-table');
    if (logiciels.length === 0) {
        table.innerHTML = '<div class="alert alert-error">Aucun logiciel trouvé</div>';
        return;
    }

    table.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Catégorie</th>
                    <th>Prix</th>
                    <th>Disponible</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${logiciels.map(logiciel => `
                    <tr>
                        <td>${logiciel.nom}</td>
                        <td>${logiciel.categorie}</td>
                        <td>${logiciel.prix} FCFA</td>
                        <td><span style="color: ${logiciel.disponible ? 'green' : 'red'}">${logiciel.disponible ? 'Oui' : 'Non'}</span></td>
                        <td class="action-buttons">
                            <button class="btn btn-secondary" onclick="editItem('logiciel', '${logiciel._id}')">✏️</button>
                            <button class="btn btn-danger" onclick="deleteItem('logiciel', '${logiciel._id}')">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Emplois
async function loadEmplois() {
    try {
        const emplois = await apiCall('/admin/emplois');
        displayEmplois(emplois.data);
    } catch (error) {
        document.getElementById('emplois-table').innerHTML = '<div class="alert alert-error">Erreur lors du chargement des emplois</div>';
    }
}

function displayEmplois(emplois) {
    const table = document.getElementById('emplois-table');
    if (emplois.length === 0) {
        table.innerHTML = '<div class="alert alert-error">Aucun emploi trouvé</div>';
        return;
    }

    table.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Entreprise</th>
                    <th>Lieu</th>
                    <th>Type</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${emplois.map(emploi => `
                    <tr>
                        <td>${emploi.titre}</td>
                        <td>${emploi.entreprise}</td>
                        <td>${emploi.lieu?.ville || 'N/A'}</td>
                        <td>${emploi.typeContrat}</td>
                        <td><span style="color: ${emploi.statut === 'actif' ? 'green' : 'red'}">${emploi.statut}</span></td>
                        <td class="action-buttons">
                            <button class="btn btn-secondary" onclick="editItem('emploi', '${emploi._id}')">✏️</button>
                            <button class="btn btn-danger" onclick="deleteItem('emploi', '${emploi._id}')">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Formations
async function loadFormations() {
    try {
        const formations = await apiCall('/admin/formations');
        displayFormations(formations.data);
    } catch (error) {
        document.getElementById('formations-table').innerHTML = '<div class="alert alert-error">Erreur lors du chargement des formations</div>';
    }
}

function displayFormations(formations) {
    const table = document.getElementById('formations-table');
    if (formations.length === 0) {
        table.innerHTML = '<div class="alert alert-error">Aucune formation trouvée</div>';
        return;
    }

    table.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Catégorie</th>
                    <th>Prix</th>
                    <th>Durée</th>
                    <th>Disponible</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${formations.map(formation => `
                    <tr>
                        <td>${formation.titre}</td>
                        <td>${formation.categorie}</td>
                        <td>${formation.prix} FCFA</td>
                        <td>${formation.duree}</td>
                        <td><span style="color: ${formation.disponible ? 'green' : 'red'}">${formation.disponible ? 'Oui' : 'Non'}</span></td>
                        <td class="action-buttons">
                            <button class="btn btn-secondary" onclick="editItem('formation', '${formation._id}')">✏️</button>
                            <button class="btn btn-danger" onclick="deleteItem('formation', '${formation._id}')">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Contacts
async function loadContacts() {
    try {
        const contacts = await apiCall('/admin/contacts');
        displayContacts(contacts.data);
    } catch (error) {
        document.getElementById('contacts-table').innerHTML = '<div class="alert alert-error">Erreur lors du chargement des contacts</div>';
    }
}

function displayContacts(contacts) {
    const table = document.getElementById('contacts-table');
    if (contacts.length === 0) {
        table.innerHTML = '<div class="alert alert-error">Aucun contact trouvé</div>';
        return;
    }

    table.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Sujet</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${contacts.map(contact => `
                    <tr>
                        <td>${contact.name}</td>
                        <td>${contact.email}</td>
                        <td>${contact.phone || 'N/A'}</td>
                        <td>${contact.subject}</td>
                        <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
                        <td class="action-buttons">
                            <button class="btn btn-secondary" onclick="viewContact('${contact._id}')">👁️</button>
                            <button class="btn btn-danger" onclick="deleteItem('contact', '${contact._id}')">🗑️</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Modal
function openModal(type, itemId = null) {
    editingItem = itemId;
    const modal = document.getElementById('modal');
    const title = document.getElementById('modal-title');
    const fields = document.getElementById('modal-fields');

    title.textContent = itemId ? `Modifier ${getTypeName(type)}` : `Ajouter ${getTypeName(type)}`;
    fields.innerHTML = generateFields(type, itemId);
    modal.style.display = 'block';

    if (itemId) {
        loadItemData(type, itemId);
    }
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    editingItem = null;
    document.getElementById('modal-form').reset();
}

function getTypeName(type) {
    const names = {
        'actualite': 'une actualité',
        'logiciel': 'un logiciel',
        'emploi': 'un emploi',
        'formation': 'une formation'
    };
    return names[type] || 'un élément';
}

function generateFields(type, itemId) {
    const fields = {
        actualite: `
            <div class="form-group">
                <label for="titre">Titre *</label>
                <input type="text" id="titre" name="titre" required>
            </div>
            <div class="form-group">
                <label for="resume">Résumé *</label>
                <textarea id="resume" name="resume" rows="3" required></textarea>
            </div>
            <div class="form-group">
                <label for="contenu">Contenu *</label>
                <textarea id="contenu" name="contenu" rows="6" required></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="categorie">Catégorie</label>
                    <select id="categorie" name="categorie">
                        <option value="ingenierie">Ingénierie</option>
                        <option value="formation">Formation</option>
                        <option value="technologie">Technologie</option>
                        <option value="entreprise">Entreprise</option>
                        <option value="autre">Autre</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="statut">Statut</label>
                    <select id="statut" name="statut">
                        <option value="brouillon">Brouillon</option>
                        <option value="publie">Publié</option>
                        <option value="archive">Archivé</option>
                    </select>
                </div>
            </div>
        `,
        logiciel: `
            <div class="form-group">
                <label for="nom">Nom *</label>
                <input type="text" id="nom" name="nom" required>
            </div>
            <div class="form-group">
                <label for="description">Description *</label>
                <textarea id="description" name="description" rows="4" required></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="categorie">Catégorie</label>
                    <select id="categorie" name="categorie">
                        <option value="autocad">AutoCAD</option>
                        <option value="covadis">Covadis</option>
                        <option value="robot">Robot</option>
                        <option value="revit">Revit</option>
                        <option value="civil3d">Civil 3D</option>
                        <option value="sketchup">SketchUp</option>
                        <option value="autre">Autre</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="prix">Prix (FCFA)</label>
                    <input type="number" id="prix" name="prix" min="0">
                </div>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="disponible" name="disponible" checked>
                    Disponible
                </label>
            </div>
        `,
        emploi: `
            <div class="form-group">
                <label for="titre">Titre du poste *</label>
                <input type="text" id="titre" name="titre" required>
            </div>
            <div class="form-group">
                <label for="entreprise">Entreprise *</label>
                <input type="text" id="entreprise" name="entreprise" required>
            </div>
            <div class="form-group">
                <label for="description">Description *</label>
                <textarea id="description" name="description" rows="4" required></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="formation">Formation requise</label>
                    <input type="text" id="formation" name="formation">
                </div>
                <div class="form-group">
                    <label for="experience">Expérience</label>
                    <input type="text" id="experience" name="experience">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="ville">Ville</label>
                    <input type="text" id="ville" name="ville">
                </div>
                <div class="form-group">
                    <label for="typeContrat">Type de contrat</label>
                    <select id="typeContrat" name="typeContrat">
                        <option value="cdi">CDI</option>
                        <option value="cdd">CDD</option>
                        <option value="stage">Stage</option>
                        <option value="freelance">Freelance</option>
                        <option value="autre">Autre</option>
                    </select>
                </div>
            </div>
            <div class="form-group">
                <label for="dateLimite">Date limite</label>
                <input type="date" id="dateLimite" name="dateLimite">
            </div>
        `,
        formation: `
            <div class="form-group">
                <label for="titre">Titre *</label>
                <input type="text" id="titre" name="titre" required>
            </div>
            <div class="form-group">
                <label for="description">Description *</label>
                <textarea id="description" name="description" rows="4" required></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="categorie">Catégorie</label>
                    <select id="categorie" name="categorie">
                        <option value="autocad">AutoCAD</option>
                        <option value="covadis">Covadis</option>
                        <option value="robot">Robot</option>
                        <option value="revit">Revit</option>
                        <option value="genie-civil">Génie Civil</option>
                        <option value="hydraulique">Hydraulique</option>
                        <option value="autre">Autre</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="niveau">Niveau</label>
                    <select id="niveau" name="niveau">
                        <option value="debutant">Débutant</option>
                        <option value="intermediaire">Intermédiaire</option>
                        <option value="avance">Avancé</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="prix">Prix (FCFA)</label>
                    <input type="number" id="prix" name="prix" min="0">
                </div>
                <div class="form-group">
                    <label for="duree">Durée</label>
                    <input type="text" id="duree" name="duree" placeholder="ex: 5 jours">
                </div>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="disponible" name="disponible" checked>
                    Disponible
                </label>
            </div>
        `
    };

    return fields[type] || '<p>Type non supporté</p>';
}

// Gestion du formulaire
document.getElementById('modal-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (key === 'disponible') {
            data[key] = value === 'on';
        } else if (key === 'dateLimite') {
            data[key] = new Date(value);
        } else if (key === 'lieu' && key === 'ville') {
            data.lieu = { ville: value };
        } else {
            data[key] = value;
        }
    }

    try {
        if (editingItem) {
            await apiCall(`/admin/${currentSection}/${editingItem}`, 'PUT', data);
            showAlert(`${getTypeName(currentSection)} modifié avec succès !`, 'success');
        } else {
            await apiCall(`/admin/${currentSection}`, 'POST', data);
            showAlert(`${getTypeName(currentSection)} ajouté avec succès !`, 'success');
        }
        
        closeModal();
        showSection(currentSection);
    } catch (error) {
        showAlert('Erreur lors de la sauvegarde', 'error');
    }
});

// Édition
async function editItem(type, itemId) {
    openModal(type, itemId);
}

async function loadItemData(type, itemId) {
    try {
        const item = await apiCall(`/admin/${type}/${itemId}`);
        fillFormWithData(item.data);
    } catch (error) {
        showAlert('Erreur lors du chargement des données', 'error');
    }
}

function fillFormWithData(data) {
    Object.keys(data).forEach(key => {
        const field = document.getElementById(key);
        if (field) {
            if (field.type === 'checkbox') {
                field.checked = data[key];
            } else {
                field.value = data[key];
            }
        }
    });
}

// Suppression
async function deleteItem(type, itemId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet élément ?')) {
        return;
    }

    try {
        await apiCall(`/admin/${type}/${itemId}`, 'DELETE');
        showAlert('Élément supprimé avec succès !', 'success');
        showSection(currentSection);
    } catch (error) {
        showAlert('Erreur lors de la suppression', 'error');
    }
}

// Affichage des alertes
function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    
    alertContainer.appendChild(alert);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Fermer le modal en cliquant à l'extérieur
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
} 
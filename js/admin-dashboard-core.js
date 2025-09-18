// Dashboard Admin - Fonctions principales
let currentData = [];
let editingArticleId = null;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    loadData();
    setupForm();
    refreshAll();
});

// Gestion des onglets
function initTabs() {
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.onclick = () => switchTab(tab.dataset.tab);
    });
}

window.switchTab = function(tabId) {
    document.querySelectorAll('.admin-tab, .admin-section').forEach(el => el.classList.remove('active'));
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
    if (tabId === 'add-article') resetForm();
};

// Données
function loadData() {
    const saved = localStorage.getItem('sorbo_actualites_data');
    currentData = saved ? JSON.parse(saved) : getDefaultData();
    saveData();
}

function saveData() {
    localStorage.setItem('sorbo_actualites_data', JSON.stringify(currentData));
}

function getDefaultData() {
    return [
        {
            id: 'formation-autocad-2025',
            title: 'Nouvelle formation AutoCAD 2025 disponible',
            resume: 'Formation AutoCAD 2025 avec nouvelles fonctionnalités.',
            content: 'Formation complète AutoCAD 2025.',
            date: '2024-12-20',
            author: 'Équipe Sorbo',
            category: 'formation',
            tags: ['AutoCAD', 'Formation'],
            published: true
        },
        {
            id: 'prix-excellence-2024',
            title: 'Renouvellement habilitation FDFP',
            resume: 'Habilitation FDFP renouvelée avec succès.',
            content: 'Reconnaissance qualité formations.',
            date: '2025-04-03',
            author: 'Direction',
            category: 'actualite',
            tags: ['FDFP', 'Habilitation'],
            published: true
        }
    ];
}

// Dashboard
function refreshAll() {
    refreshDashboard();
    refreshArticlesList();
}

function refreshDashboard() {
    document.getElementById('total-articles').textContent = currentData.length;
    document.getElementById('total-views').textContent = '1,247';
    document.getElementById('draft-articles').textContent = '0';
    document.getElementById('this-month').textContent = currentData.length;
    
    document.getElementById('recent-activity').innerHTML = `
        <div style="padding:1rem;">
            <p><i class="fas fa-check"></i> Articles synchronisés: ${currentData.length}</p>
            <p><i class="fas fa-clock"></i> Dernière mise à jour: ${new Date().toLocaleString('fr-FR')}</p>
        </div>
    `;
}

// Liste articles
window.refreshArticlesList = function() {
    const container = document.getElementById('articles-list');
    
    if (currentData.length === 0) {
        container.innerHTML = `
            <div class="text-center" style="padding:2rem;">
                <h3>Aucune actualité</h3>
                <button class="btn btn-primary" onclick="switchTab('add-article')">Créer</button>
            </div>
        `;
        return;
    }

    container.innerHTML = currentData.map(article => `
        <div class="article-item">
            <div class="article-item-header">
                <div>
                    <div class="article-item-title">${article.title}</div>
                    <div class="article-item-meta">
                        ${article.date} • ${article.author} • ${article.category}
                    </div>
                </div>
                <div class="article-item-actions">
                    <button class="btn btn-secondary btn-small" onclick="editArticle('${article.id}')">Modifier</button>
                    <button class="btn btn-success btn-small" onclick="previewArticle('${article.id}')">Voir</button>
                    <button class="btn btn-danger btn-small" onclick="deleteArticle('${article.id}')">Supprimer</button>
                </div>
            </div>
            <p style="color:#666;margin-top:0.5rem;">${article.resume}</p>
        </div>
    `).join('');
};

// CRUD
window.editArticle = function(id) {
    const article = currentData.find(a => a.id === id);
    if (!article) return;
    
    editingArticleId = id;
    document.getElementById('article-title').value = article.title;
    document.getElementById('article-date').value = article.date;
    document.getElementById('article-resume').value = article.resume;
    document.getElementById('article-content').value = article.content || '';
    document.getElementById('article-author').value = article.author;
    document.getElementById('article-category').value = article.category;
    document.getElementById('article-tags').value = article.tags ? article.tags.join(', ') : '';
    
    document.getElementById('form-title').textContent = 'Modifier l\'actualité';
    switchTab('add-article');
    showToast('Article chargé', 'info');
};

window.deleteArticle = function(id) {
    const article = currentData.find(a => a.id === id);
    if (!article || !confirm(`Supprimer "${article.title}" ?`)) return;
    
    currentData = currentData.filter(a => a.id !== id);
    saveData();
    refreshAll();
    showToast('Article supprimé', 'success');
};

window.previewArticle = function(id) {
    window.open(`article-template.html?id=${id}`, '_blank');
};

// Formulaire
function setupForm() {
    document.getElementById('article-form').onsubmit = function(e) {
        e.preventDefault();
        saveArticle();
    };
}

function saveArticle() {
    const form = document.getElementById('article-form');
    const formData = new FormData(form);
    
    const articleData = {
        id: editingArticleId || generateId(formData.get('title')),
        title: formData.get('title').trim(),
        resume: formData.get('resume').trim(),
        content: formData.get('content').trim(),
        date: formData.get('date'),
        author: formData.get('author').trim(),
        category: formData.get('category'),
        tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()).filter(t => t) : [],
        published: true,
        updatedAt: new Date().toISOString()
    };

    if (!articleData.title || !articleData.resume || !articleData.date) {
        showToast('Champs obligatoires manquants', 'error');
        return;
    }

    if (editingArticleId) {
        const index = currentData.findIndex(a => a.id === editingArticleId);
        if (index !== -1) {
            currentData[index] = { ...currentData[index], ...articleData };
            showToast('Article mis à jour', 'success');
        }
    } else {
        articleData.createdAt = new Date().toISOString();
        currentData.unshift(articleData);
        showToast('Article créé', 'success');
    }

    saveData();
    refreshAll();
    resetForm();
    switchTab('articles');
}

window.resetForm = function() {
    document.getElementById('article-form').reset();
    document.getElementById('form-title').textContent = 'Nouvelle actualité';
    editingArticleId = null;
    document.getElementById('article-date').value = new Date().toISOString().split('T')[0];
};

// Utilitaires
function generateId(title) {
    return title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').substring(0, 50);
}

function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${message}</span><span onclick="this.parentElement.remove()" style="cursor:pointer;margin-left:1rem;">&times;</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => toast.remove(), 4000);
}

// Export/Import
window.exportData = function() {
    const data = { version: '1.0', articles: currentData, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sorbo-actualites-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Données exportées', 'success');
};

window.importData = function() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = JSON.parse(e.target.result);
                if (data.articles && confirm('Remplacer toutes les données ?')) {
                    currentData = data.articles;
                    saveData();
                    refreshAll();
                    showToast('Données importées', 'success');
                }
            } catch (error) {
                showToast('Erreur import', 'error');
            }
        };
        reader.readAsText(file);
    };
    input.click();
};

console.log('✅ Dashboard Admin chargé');


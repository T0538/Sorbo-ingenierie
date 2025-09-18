// Test de la structure des données MongoDB pour les actualités
console.log('🧪 Test de la structure des données MongoDB...');

const API_BASE_URL = 'https://sorbo-api-production.up.railway.app';

async function testStructureActualites() {
    try {
        console.log('📡 Connexion à l\'API...');
        
        const response = await fetch(`${API_BASE_URL}/api/actualites`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ Données reçues:', data);
        
        if (data.success && data.data && data.data.length > 0) {
            console.log(`📰 ${data.data.length} actualités trouvées`);
            
            // Analyser la structure de la première actualité
            const premiereActualite = data.data[0];
            console.log('\n🔍 Structure de la première actualité:');
            console.log('Champs disponibles:', Object.keys(premiereActualite));
            
            console.log('\n📋 Détails des champs:');
            Object.entries(premiereActualite).forEach(([key, value]) => {
                const type = typeof value;
                const preview = type === 'string' && value.length > 50 ? 
                    value.substring(0, 50) + '...' : 
                    JSON.stringify(value);
                console.log(`   ${key}: ${type} = ${preview}`);
            });
            
            // Vérifier les champs critiques
            console.log('\n✅ Champs critiques vérifiés:');
            console.log(`   - titre: ${premiereActualite.titre ? '✅' : '❌'}`);
            console.log(`   - resume: ${premiereActualite.resume ? '✅' : '❌'}`);
            console.log(`   - description: ${premiereActualite.description ? '✅' : '❌'}`);
            console.log(`   - datePublication: ${premiereActualite.datePublication ? '✅' : '❌'}`);
            console.log(`   - date: ${premiereActualite.date ? '✅' : '❌'}`);
            console.log(`   - createdAt: ${premiereActualite.createdAt ? '✅' : '❌'}`);
            console.log(`   - categorie: ${premiereActualite.categorie ? '✅' : '❌'}`);
            console.log(`   - auteur: ${premiereActualite.auteur ? '✅' : '❌'}`);
            console.log(`   - image: ${premiereActualite.image ? '✅' : '❌'}`);
            console.log(`   - tags: ${Array.isArray(premiereActualite.tags) ? '✅' : '❌'}`);
            
            // Test de création d'une carte
            console.log('\n🧪 Test de création d\'une carte...');
            try {
                const testCard = createTestCard(premiereActualite);
                console.log('✅ Carte créée avec succès');
                console.log('📝 HTML généré:', testCard.substring(0, 200) + '...');
            } catch (error) {
                console.error('❌ Erreur lors de la création de la carte:', error.message);
            }
            
        } else {
            console.log('⚠️ Aucune actualité trouvée dans la base de données');
        }
        
    } catch (error) {
        console.error('❌ Erreur lors du test:', error);
        
        if (error.message.includes('Failed to fetch')) {
            console.log('💡 Assurez-vous que le serveur local est démarré:');
            console.log('   node server-railway.js');
        }
    }
}

// Fonction de test pour créer une carte
function createTestCard(actualite) {
    // Formater la date (MongoDB utilise datePublication)
    const date = new Date(actualite.datePublication || actualite.date || actualite.createdAt);
    const formattedDate = date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Calculer le temps de lecture (estimation basée sur le résumé)
    const wordCount = (actualite.resume || actualite.description || '').split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 225) + 2;
    
    // Gérer les tags (s'assurer qu'ils existent)
    const tags = Array.isArray(actualite.tags) ? actualite.tags : [];
    
    const card = `
        <div class="blog-post" data-category="${(actualite.categorie || 'actualite').toLowerCase().replace(/\s+/g, '-')}">
            <div class="blog-image">
                <img src="${actualite.image || 'images/default-news.jpg'}" alt="${actualite.titre}" 
                     onerror="this.src='images/default-news.jpg'" class="lazy-image">
                <div class="blog-category-tag">${actualite.categorie || 'Actualité'}</div>
            </div>
            <div class="blog-content">
                <h3 class="blog-title">${actualite.titre}</h3>
                <div class="blog-author">
                    <i class="fas fa-user"></i> ${actualite.auteur || 'Sorbo-Ingénierie'}
                </div>
                <div class="reading-time">
                    <i class="far fa-clock"></i> <span class="time-value">${readingTime} min de lecture</span>
                </div>
                <p class="blog-excerpt">${actualite.resume || actualite.description || 'Aucun résumé disponible'}</p>
                <div class="blog-meta">
                    <div class="blog-date">${formattedDate}</div>
                    <a href="#" class="read-more" onclick="showActualiteDetails('${actualite._id || actualite.id}')">
                        Lire la suite
                    </a>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Exécuter le test
testStructureActualites();

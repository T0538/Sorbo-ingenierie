// Gestion des boutons d'inscription aux formations
document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour ouvrir la page d'inscription
    window.openInscriptionForm = function(formationName, duration, price, id) {
        const params = new URLSearchParams({
            name: encodeURIComponent(formationName),
            duration: encodeURIComponent(duration),
            price: encodeURIComponent(price),
            id: encodeURIComponent(id)
        });
        
        // Ouvrir dans un nouvel onglet
        window.open(`inscription-formation.html?${params.toString()}`, '_blank');
    };

    // Ajouter des boutons d'inscription à toutes les formations existantes
    addInscriptionButtons();
});

// Fonction pour ajouter des boutons d'inscription
function addInscriptionButtons() {
    // Chercher tous les éléments de formation
    const formationCards = document.querySelectorAll('.formation-card, .formation-item, .formation');
    
    formationCards.forEach((card, index) => {
        // Vérifier si le bouton n'existe pas déjà
        if (!card.querySelector('.inscription-btn')) {
            // Créer le bouton d'inscription
            const inscriptionBtn = document.createElement('button');
            inscriptionBtn.className = 'inscription-btn';
            inscriptionBtn.innerHTML = '<i class="fas fa-graduation-cap"></i> S\'inscrire';
            inscriptionBtn.style.cssText = `
                background: var(--primary-color);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: 600;
                margin-top: 15px;
                transition: all 0.3s ease;
            `;
            
            // Ajouter l'effet hover
            inscriptionBtn.addEventListener('mouseenter', function() {
                this.style.background = '#b30000';
                this.style.transform = 'translateY(-2px)';
            });
            
            inscriptionBtn.addEventListener('mouseleave', function() {
                this.style.background = 'var(--primary-color)';
                this.style.transform = 'translateY(0)';
            });
            
            // Ajouter l'événement de clic
            inscriptionBtn.addEventListener('click', function() {
                // Récupérer les informations de la formation
                const formationName = card.querySelector('h3, h4, .formation-title')?.textContent || `Formation ${index + 1}`;
                const duration = card.querySelector('.duration, .formation-duration')?.textContent || 'Durée non spécifiée';
                const price = card.querySelector('.price, .formation-price')?.textContent || 'Prix non spécifié';
                
                // Ouvrir la page d'inscription
                openInscriptionForm(formationName, duration, price, index);
            });
            
            // Ajouter le bouton à la carte
            card.appendChild(inscriptionBtn);
        }
    });
}

// Fonction pour créer un bouton d'inscription personnalisé
function createInscriptionButton(formationData) {
    const button = document.createElement('button');
    button.className = 'inscription-btn custom';
    button.innerHTML = '<i class="fas fa-graduation-cap"></i> S\'inscrire à cette formation';
    button.style.cssText = `
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        margin: 20px 0;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(209, 0, 0, 0.2);
    `;
    
    // Effet hover
    button.addEventListener('mouseenter', function() {
        this.style.background = '#b30000';
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 6px 20px rgba(209, 0, 0, 0.3)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.background = 'var(--primary-color)';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 4px 15px rgba(209, 0, 0, 0.2)';
    });
    
    // Événement de clic
    button.addEventListener('click', function() {
        openInscriptionForm(
            formationData.name,
            formationData.duration,
            formationData.price,
            formationData.id
        );
    });
    
    return button;
}

// Exemple d'utilisation pour une formation spécifique
function addInscriptionToFormation(formationId, formationData) {
    const formationElement = document.getElementById(formationId);
    if (formationElement) {
        const button = createInscriptionButton(formationData);
        formationElement.appendChild(button);
    }
}

// Ajouter des boutons d'inscription après le chargement de la page
window.addEventListener('load', function() {
    // Attendre un peu pour que le contenu soit chargé
    setTimeout(addInscriptionButtons, 1000);
});












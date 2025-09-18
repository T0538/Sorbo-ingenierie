/**
 * Script pour supprimer les boutons rouges ajoutés par erreur
 * et rétablir les boutons originaux
 */

(function() {
    'use strict';
    
    function removeRedButtons() {
        console.log('🧹 Nettoyage des boutons rouges ajoutés...');
        
        // Supprimer tous les boutons rouges créés par les scripts
        const redButtons = document.querySelectorAll('.forced-link, .btn-read-more, a[style*="background: #d10000"], a[style*="background:#d10000"]');
        
        redButtons.forEach(button => {
            console.log('🗑️ Suppression du bouton rouge:', button);
            button.remove();
        });
        
        // Supprimer les attributs de style ajoutés
        const styledLinks = document.querySelectorAll('a[data-blog-forced], a[data-blog-processed]');
        styledLinks.forEach(link => {
            // Retirer les styles ajoutés
            link.style.removeProperty('border-bottom');
            link.style.removeProperty('color');
            link.style.removeProperty('background');
            link.style.removeProperty('padding');
            link.style.removeProperty('border-radius');
            link.style.removeProperty('display');
            link.style.removeProperty('margin-top');
            
            // Garder seulement le href modifié
            if (link.href && link.href.includes('article-template.html')) {
                console.log('✅ Lien gardé sans style:', link.href);
            }
        });
        
        // Supprimer les bordures ajoutées aux cartes
        const styledCards = document.querySelectorAll('[data-blog-card-forced], [data-blog-enhanced]');
        styledCards.forEach(card => {
            card.style.removeProperty('border');
            card.style.removeProperty('border-radius');
        });
        
        console.log('✅ Nettoyage terminé');
    }
    
    // Exécuter le nettoyage
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeRedButtons);
    } else {
        removeRedButtons();
    }
    
    // Aussi après 1 seconde
    setTimeout(removeRedButtons, 1000);
    
    // Export pour utilisation manuelle
    window.removeRedButtons = removeRedButtons;
    
    console.log('🧹 Script de nettoyage chargé. Utilisez window.removeRedButtons() si besoin.');
    
})();

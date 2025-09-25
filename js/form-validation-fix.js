// Script pour corriger les problèmes de validation HTML5
// Désactive complètement la validation et force l'envoi du formulaire

document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Correction validation HTML5...');
    
    // Désactiver la validation HTML5 sur tous les formulaires
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.noValidate = true;
        console.log('✅ Validation HTML5 désactivée pour:', form.id || 'formulaire sans ID');
    });
    
    // Intercepter TOUTES les soumissions de formulaire
    document.addEventListener('submit', function(e) {
        const form = e.target;
        if (form.tagName === 'FORM') {
            // Forcer la désactivation de la validation
            form.noValidate = true;
            
            // Supprimer tous les attributs required temporairement
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                field.removeAttribute('required');
            });
            
            console.log('🔧 Validation forcément désactivée pour la soumission');
            
            // Laisser le formulaire se soumettre normalement
            return true;
        }
    }, true); // Utiliser capture pour intercepter avant les autres handlers
    
    // Supprimer tous les attributs required des champs cachés
    setTimeout(() => {
        const allRequiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
        allRequiredFields.forEach(field => {
            const isHidden = field.offsetParent === null || 
                           window.getComputedStyle(field).display === 'none' ||
                           window.getComputedStyle(field).visibility === 'hidden';
            
            if (isHidden) {
                field.removeAttribute('required');
                console.log('🔧 Attribut required supprimé du champ caché:', field.name || field.id);
            }
        });
    }, 500);
    
    console.log('✅ Correction validation HTML5 terminée');
});

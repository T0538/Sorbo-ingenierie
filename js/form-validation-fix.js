// ======================================
// CORRECTION DES ERREURS DE VALIDATION - SORBO-INGÉNIERIE
// ======================================

// Script pour corriger les erreurs de validation HTML5 sur les champs cachés
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Initialisation de la correction des erreurs de validation...');
    
    // Fonction pour désactiver la validation des champs cachés
    function disableHiddenFieldValidation() {
        const allDynamicFields = document.querySelectorAll('.dynamic-fields');
        
        allDynamicFields.forEach(field => {
            if (field.style.display === 'none' || field.offsetParent === null) {
                const inputs = field.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    // Sauvegarder l'état required original
                    if (input.hasAttribute('required')) {
                        input.setAttribute('data-was-required', 'true');
                        input.removeAttribute('required');
                    }
                    // Désactiver le champ
                    input.disabled = true;
                });
            }
        });
    }

    // Fonction pour réactiver la validation des champs visibles
    function enableVisibleFieldValidation() {
        const visibleDynamicFields = document.querySelectorAll('.dynamic-fields[style*="block"]');
        
        visibleDynamicFields.forEach(field => {
            const inputs = field.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                // Réactiver le champ
                input.disabled = false;
                // Restaurer l'attribut required si nécessaire
                if (input.hasAttribute('data-was-required')) {
                    input.setAttribute('required', '');
                }
            });
        });
    }

    // Observer les changements de visibilité des champs dynamiques
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                const target = mutation.target;
                if (target.classList.contains('dynamic-fields')) {
                    if (target.style.display === 'none') {
                        // Champs cachés - désactiver la validation
                        const inputs = target.querySelectorAll('input, select, textarea');
                        inputs.forEach(input => {
                            if (input.hasAttribute('required')) {
                                input.setAttribute('data-was-required', 'true');
                                input.removeAttribute('required');
                            }
                            input.disabled = true;
                        });
                    } else if (target.style.display === 'block') {
                        // Champs visibles - réactiver la validation
                        const inputs = target.querySelectorAll('input, select, textarea');
                        inputs.forEach(input => {
                            input.disabled = false;
                            if (input.hasAttribute('data-was-required')) {
                                input.setAttribute('required', '');
                            }
                        });
                    }
                }
            }
        });
    });

    // Observer tous les champs dynamiques
    const dynamicFields = document.querySelectorAll('.dynamic-fields');
    dynamicFields.forEach(field => {
        observer.observe(field, { attributes: true, attributeFilter: ['style'] });
    });

    // Initialisation
    disableHiddenFieldValidation();
    
    // Réactiver la validation des champs visibles après un court délai
    setTimeout(() => {
        enableVisibleFieldValidation();
    }, 100);

    console.log('✅ Correction des erreurs de validation initialisée');
});

// Fonction globale pour forcer la correction des erreurs
window.fixFormValidation = function() {
    const allDynamicFields = document.querySelectorAll('.dynamic-fields');
    
    allDynamicFields.forEach(field => {
        const inputs = field.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            // Si le champ est caché, désactiver la validation
            if (field.style.display === 'none' || field.offsetParent === null) {
                if (input.hasAttribute('required')) {
                    input.setAttribute('data-was-required', 'true');
                    input.removeAttribute('required');
                }
                input.disabled = true;
            } else {
                // Si le champ est visible, réactiver la validation
                input.disabled = false;
                if (input.hasAttribute('data-was-required')) {
                    input.setAttribute('required', '');
                }
            }
        });
    });
    
    console.log('🔧 Validation des formulaires corrigée manuellement');
};

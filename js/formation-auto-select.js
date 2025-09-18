// ======================================
// SÉLECTION AUTOMATIQUE DU SUJET FORMATION - SORBO-INGÉNIERIE
// ======================================

// Script pour sélectionner automatiquement le sujet "Formation" quand on vient d'une formation
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Initialisation de la sélection automatique du sujet Formation...');
    
    // Fonction pour sélectionner automatiquement le sujet Formation
    function autoSelectFormationSubject() {
        const urlParams = new URLSearchParams(window.location.search);
        const subject = urlParams.get('subject');
        
        if (subject === 'formation') {
            console.log('📚 Paramètre subject=formation détecté, sélection automatique...');
            
            // Fonction récursive pour attendre que l'élément soit disponible
            function waitForSubjectElement(attempts = 0) {
                const maxAttempts = 30; // 3 secondes maximum
                const subjectSelect = document.getElementById('subject');
                
                if (subjectSelect) {
                    console.log('✅ Élément subject trouvé, sélection de "formation"...');
                    
                    // Sélectionner la formation
                    subjectSelect.value = 'formation';
                    
                    // Déclencher l'événement change pour afficher les champs dynamiques
                    const changeEvent = new Event('change', { bubbles: true });
                    subjectSelect.dispatchEvent(changeEvent);
                    
                    // Afficher le message informatif
                    showFormationInfo(urlParams);
                    
                    console.log('✅ Sujet "Formation" sélectionné avec succès !');
                } else if (attempts < maxAttempts) {
                    console.log(`⏳ Tentative ${attempts + 1}/${maxAttempts} - Élément subject pas encore disponible...`);
                    setTimeout(() => {
                        waitForSubjectElement(attempts + 1);
                    }, 100);
                } else {
                    console.log('❌ Élément subject non trouvé après', maxAttempts, 'tentatives');
                }
            }
            
            // Démarrer la vérification
            waitForSubjectElement();
        } else {
            console.log('ℹ️ Pas de paramètre subject=formation dans l\'URL');
        }
    }
    
    // Fonction pour afficher les informations de la formation
    function showFormationInfo(urlParams) {
        const formation = urlParams.get('formation');
        const prix = urlParams.get('prix');
        
        if (formation) {
            // Vérifier si le message n'existe pas déjà
            if (!document.querySelector('.formation-info-banner')) {
                // Créer le message informatif
                const messageDiv = document.createElement('div');
                messageDiv.className = 'formation-info-banner';
                messageDiv.style.cssText = `
                    background: linear-gradient(135deg, #e3f2fd, #bbdefb);
                    border: 2px solid #2196f3;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 25px;
                    color: #1565c0;
                    box-shadow: 0 4px 15px rgba(33, 150, 243, 0.2);
                `;
                messageDiv.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="background: #2196f3; color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <div>
                            <h3 style="margin: 0 0 8px 0; color: #1565c0; font-size: 18px;">
                                Formation sélectionnée : ${decodeURIComponent(formation)}
                            </h3>
                            ${prix ? `<p style="margin: 0; color: #d10000; font-weight: bold; font-size: 16px;">Coût : ${decodeURIComponent(prix)}</p>` : ''}
                        </div>
                    </div>
                `;
                
                // Insérer le message au début du formulaire
                const form = document.getElementById('contact-form');
                if (form) {
                    form.insertBefore(messageDiv, form.firstChild);
                    console.log('✅ Message informatif de formation affiché');
                }
            }
        }
    }
    
    // Démarrer la sélection automatique
    autoSelectFormationSubject();
    
    // Fonction globale pour forcer la sélection (utile pour le débogage)
    window.forceSelectFormation = function() {
        const subjectSelect = document.getElementById('subject');
        if (subjectSelect) {
            subjectSelect.value = 'formation';
            const changeEvent = new Event('change', { bubbles: true });
            subjectSelect.dispatchEvent(changeEvent);
            console.log('🔧 Sélection forcée du sujet "Formation"');
        } else {
            console.log('❌ Élément subject non trouvé pour la sélection forcée');
        }
    };
    
    console.log('✅ Script de sélection automatique du sujet Formation initialisé');
});

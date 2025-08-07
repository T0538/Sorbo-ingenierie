document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        // Gestion de la soumission du formulaire
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Récupérer le formulaire
            const form = this;
            const formData = new FormData(form);
            const subject = formData.get('subject');
            
            // Convertir FormData en objet JSON
            const jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });
            
            // Afficher un indicateur de chargement
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            try {
                // Utiliser l'intégration backend si disponible
                let data;
                if (window.backendIntegration && window.backendIntegration.isBackendAvailable) {
                    data = await window.backendIntegration.sendContact(jsonData);
                } else {
                    // Fallback vers l'API directe
                    const response = await fetch('https://sorbo-api-production.up.railway.app/api/contact', {
                        method: 'POST',
                        body: JSON.stringify(jsonData),
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    });
                    
                    data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.message || 'Erreur lors de l\'envoi du formulaire');
                    }
                }
                
                // Fonction pour obtenir le texte du sujet sélectionné
                const getSubjectText = (value) => {
                    const option = document.querySelector(`#subject option[value="${value}"]`);
                    return option ? option.textContent : value;
                };
                
                // Afficher un message de succès
                form.innerHTML = `
                    <div class="success-message" style="text-align: center;">
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: #2ecc71; margin-bottom: 20px;"></i>
                        <h3>Merci pour votre message!</h3>
                        <p>Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.</p>
                        
                        <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; text-align: left;">
                            <h4 style="margin-bottom: 10px;">Récapitulatif de votre demande:</h4>
                            <p><strong>Sujet:</strong> ${getSubjectText(subject)}</p>
                            <p><strong>Nom:</strong> ${jsonData.name}</p>
                            <p><strong>Email:</strong> ${jsonData.email}</p>
                            ${jsonData.phone ? `<p><strong>Téléphone:</strong> ${jsonData.phone}</p>` : ''}
                            <p><strong>Message:</strong> ${jsonData.message}</p>
                        </div>
                    </div>
                `;
                
                // Réinitialiser le formulaire (caché)
                form.reset();
            } catch (error) {
                console.error('Erreur:', error);
                
                // Afficher un message d'erreur
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.style.color = '#e74c3c';
                errorMessage.style.padding = '15px';
                errorMessage.style.marginBottom = '20px';
                errorMessage.style.backgroundColor = '#ffeaea';
                errorMessage.style.borderRadius = '5px';
                errorMessage.style.borderLeft = '4px solid #e74c3c';
                
                errorMessage.innerHTML = `
                    <i class="fas fa-exclamation-circle"></i>
                    Désolé, une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer.
                `;
                
                form.insertBefore(errorMessage, form.firstChild);
                
                // Supprimer le message d'erreur après 5 secondes
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            }
        });
    }
}); 
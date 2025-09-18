document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const apiUrl = 'https://sorbo-api-production.up.railway.app/api/contact';

    if (contactForm) {
        // Fonction pour gérer les champs dynamiques en fonction du sujet sélectionné
        function toggleDynamicFields() {
            const selectedValue = document.getElementById('subject').value;
            const dynamicFields = document.querySelectorAll('.dynamic-fields');
            
            // Cacher tous les champs dynamiques d'abord
            dynamicFields.forEach(fields => {
                fields.style.display = 'none';
            });
            
            // Afficher les champs correspondant au sujet sélectionné
            if (selectedValue) {
                const fieldsToShow = document.getElementById(selectedValue + '-fields');
                if (fieldsToShow) {
                    fieldsToShow.style.display = 'block';
                }
            }
        }

        // Écouter les changements sur le select du sujet
        document.getElementById('subject').addEventListener('change', toggleDynamicFields);

        // Fonction pour formater les dates
        function formatDate(dateStr) {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            return new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'long', 
                year: 'numeric'
            }).format(date);
        }

        // Fonction pour générer le récapitulatif des informations saisies
        function generateSummary(formData, subject) {
            let summary = '';
            
            // Informations communes
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const message = formData.get('message');
            
            summary += `<p><strong>Nom:</strong> ${name}</p>`;
            summary += `<p><strong>Email:</strong> ${email}</p>`;
            if (phone) summary += `<p><strong>Téléphone:</strong> ${phone}</p>`;
            
            // Informations spécifiques selon le sujet
            switch (subject) {
                case 'ingenierie':
                    const projectType = document.getElementById('project-type');
                    const projectDesc = formData.get('project-description');
                    const projectLoc = formData.get('project-location');
                    const projectBudget = document.getElementById('project-budget');
                    const projectDeadline = formData.get('project-deadline');
                    
                    if (projectType.selectedIndex > 0) {
                        summary += `<p><strong>Type de projet:</strong> ${projectType.options[projectType.selectedIndex].text}</p>`;
                    }
                    if (projectDesc) summary += `<p><strong>Description:</strong> ${projectDesc}</p>`;
                    if (projectLoc) summary += `<p><strong>Localisation:</strong> ${projectLoc}</p>`;
                    if (projectBudget.selectedIndex > 0) {
                        summary += `<p><strong>Budget:</strong> ${projectBudget.options[projectBudget.selectedIndex].text}</p>`;
                    }
                    if (projectDeadline) summary += `<p><strong>Délai souhaité:</strong> ${formatDate(projectDeadline)}</p>`;
                    break;
                    
                case 'formation':
                    const formationType = document.getElementById('formation-type');
                    const formationPart = formData.get('formation-participants');
                    const formationStart = formData.get('formation-start');
                    const formationDuration = document.getElementById('formation-duration');
                    const formationLocation = document.getElementById('formation-location');
                    
                    if (formationType.selectedIndex > 0) {
                        summary += `<p><strong>Type de formation:</strong> ${formationType.options[formationType.selectedIndex].text}</p>`;
                    }
                    if (formationPart) summary += `<p><strong>Participants:</strong> ${formationPart}</p>`;
                    if (formationStart) summary += `<p><strong>Date souhaitée:</strong> ${formatDate(formationStart)}</p>`;
                    if (formationDuration.selectedIndex > 0) {
                        summary += `<p><strong>Durée:</strong> ${formationDuration.options[formationDuration.selectedIndex].text}</p>`;
                    }
                    if (formationLocation.selectedIndex > 0) {
                        summary += `<p><strong>Lieu:</strong> ${formationLocation.options[formationLocation.selectedIndex].text}</p>`;
                    }
                    break;
                    
                case 'logiciel':
                    const softwareName = document.getElementById('software-name');
                    const softwareLicense = document.getElementById('software-license');
                    const softwareUsers = formData.get('software-users');
                    const softwareOS = document.getElementById('software-os');
                    
                    // Récupérer les cases cochées
                    const checkedServices = [];
                    document.querySelectorAll('input[name="software-services[]"]:checked').forEach(checkbox => {
                        checkedServices.push(checkbox.parentElement.textContent.trim());
                    });
                    
                    if (softwareName.selectedIndex > 0) {
                        summary += `<p><strong>Logiciel:</strong> ${softwareName.options[softwareName.selectedIndex].text}</p>`;
                    }
                    if (softwareLicense.selectedIndex > 0) {
                        summary += `<p><strong>Type de licence:</strong> ${softwareLicense.options[softwareLicense.selectedIndex].text}</p>`;
                    }
                    if (softwareUsers) summary += `<p><strong>Nombre d'utilisateurs:</strong> ${softwareUsers}</p>`;
                    if (checkedServices.length > 0) summary += `<p><strong>Services requis:</strong> ${checkedServices.join(', ')}</p>`;
                    if (softwareOS.selectedIndex > 0) {
                        summary += `<p><strong>Système d'exploitation:</strong> ${softwareOS.options[softwareOS.selectedIndex].text}</p>`;
                    }
                    break;
                    
                case 'carriere':
                    const position = formData.get('career-position');
                    const experience = document.getElementById('career-experience');
                    const availability = formData.get('career-availability');
                    
                    if (position) summary += `<p><strong>Poste recherché:</strong> ${position}</p>`;
                    if (experience.selectedIndex > 0) {
                        summary += `<p><strong>Expérience:</strong> ${experience.options[experience.selectedIndex].text}</p>`;
                    }
                    if (availability) summary += `<p><strong>Disponibilité:</strong> ${formatDate(availability)}</p>`;
                    summary += `<p><strong>CV joint:</strong> ${document.getElementById('career-cv').files.length > 0 ? 'Oui' : 'Non'}</p>`;
                    break;
            }
            
            // Ajouter le message
            if (message) summary += `<p><strong>Message:</strong> ${message}</p>`;
            
            return summary;
        }

        // Fonction pour obtenir le texte du sujet sélectionné
        function getSubjectText(value) {
            const subjectSelect = document.getElementById('subject');
            const option = subjectSelect.querySelector(`option[value="${value}"]`);
            return option ? option.textContent : value;
        }

        // Fonction pour soumettre le formulaire via l'API
        async function submitFormToAPI(formData) {
            try {
                const response = await fetch(apiUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.message || 'Erreur lors de l\'envoi du formulaire');
                }
                
                return data;
            } catch (error) {
                console.error('Erreur:', error);
                throw error;
            }
        }

        // Gestion de la soumission du formulaire
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Récupérer le formulaire
            const form = this;
            const formData = new FormData(form);
            const subject = formData.get('subject');
            
            // Afficher un indicateur de chargement
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.disabled = true;
            
            try {
                // Envoyer les données à l'API
                const result = await submitFormToAPI(formData);
                
                // Afficher un message de succès
                form.innerHTML = `
                    <div class="success-message" style="text-align: center;">
                        <i class="fas fa-check-circle" style="font-size: 3rem; color: #2ecc71; margin-bottom: 20px;"></i>
                        <h3>Merci pour votre message!</h3>
                        <p>Nous avons bien reçu votre demande et nous vous répondrons dans les plus brefs délais.</p>
                        
                        <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; text-align: left;">
                            <h4 style="margin-bottom: 10px;">Récapitulatif de votre demande:</h4>
                            <p><strong>Sujet:</strong> ${getSubjectText(subject)}</p>
                            ${generateSummary(formData, subject)}
                        </div>
                    </div>
                `;
                
                // Réinitialiser le formulaire (caché)
                form.reset();
            } catch (error) {
                // Afficher un message d'erreur
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                
                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
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
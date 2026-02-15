// Script pour corriger l'affichage du footer
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si le footer existe et est visible
    const footer = document.querySelector('footer');
    
    if (footer) {
        // S'assurer que le footer est visible
        footer.style.display = 'block';
        footer.style.visibility = 'visible';
        footer.style.opacity = '1';
        
        // Ajouter des styles de base si nécessaire
        if (!footer.style.background) {
            footer.style.background = '#2c3e50';
        }
        if (!footer.style.color) {
            footer.style.color = 'white';
        }
        if (!footer.style.padding) {
            footer.style.padding = '40px 0 20px';
        }
        if (!footer.style.marginTop) {
            footer.style.marginTop = '60px';
        }
        
        console.log('Footer corrigé et visible !');
    } else {
        console.log('Aucun footer trouvé, création d\'un footer de base...');
        createBasicFooter();
    }
});

// Fonction pour créer un footer de base si aucun n'existe
function createBasicFooter() {
    const footerHTML = `
        <footer style="background: #2c3e50; color: white; padding: 40px 0 20px; margin-top: 60px;">
            <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px;">
                <div class="footer-content" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-bottom: 30px;">
                    
                    <!-- Colonne Brand -->
                    <div class="footer-column" style="text-align: center;">
                        <img src="images/logo.png" alt="Sorbo-Ingénierie Logo" style="width: 80px; height: auto; margin-bottom: 15px;">
                        <h3 style="color: #d10000; margin-bottom: 10px; font-size: 1.5rem;">Sorbo-Ingénierie</h3>
                        <p style="color: #bdc3c7; line-height: 1.6;">Excellence et Innovation en Génie civil</p>
                    </div>

                    <!-- Colonne Informations légales -->
                    <div class="footer-column">
                        <h3 style="color: #d10000; margin-bottom: 15px; font-size: 1.2rem;">Informations légales</h3>
                        <ul style="list-style: none; padding: 0; color: #bdc3c7;">
                            <li style="margin-bottom: 8px;"><strong>Nom légal :</strong> Sorbo-Ingénierie</li>
                            <li style="margin-bottom: 8px;"><strong>N° Compte contribuable :</strong> 2242797T</li>
                            <li style="margin-bottom: 8px;"><strong>Forme juridique :</strong> SARL</li>
                            <li style="margin-bottom: 8px;"><strong>Registre de commerce :</strong> CI-ABJ-03-2022-B12-03946</li>
                            <li style="margin-bottom: 8px;"><strong>Capital social :</strong> 1 000 000 F CFA</li>
                        </ul>
                    </div>

                    <!-- Colonne Contacts -->
                    <div class="footer-column">
                        <h3 style="color: #d10000; margin-bottom: 15px; font-size: 1.2rem;">Nos contacts</h3>
                        <ul style="list-style: none; padding: 0; color: #bdc3c7;">
                            <li style="margin-bottom: 8px;">
                                <i class="fas fa-envelope" style="color: #d10000; margin-right: 8px;"></i>
                                <a href="mailto:contact@sorbo.ingenierie.ci" style="color: #bdc3c7; text-decoration: none;">contact@sorbo.ingenierie.ci</a>
                            </li>
                            <li style="margin-bottom: 8px;">
                                <i class="fas fa-envelope" style="color: #d10000; margin-right: 8px;"></i>
                                <a href="mailto:logiciels@sorbo-ingenierie.ci" style="color: #bdc3c7; text-decoration: none;">logiciels@sorbo-ingenierie.ci</a>
                            </li>
                            <li style="margin-bottom: 8px;">
                                <i class="fas fa-phone" style="color: #d10000; margin-right: 8px;"></i>
                                <a href="tel:+2250150123050" style="color: #bdc3c7; text-decoration: none;">(+225) 01 50 12 30 50</a>
                            </li>
                            <li style="margin-bottom: 8px;">
                                <i class="fas fa-phone" style="color: #d10000; margin-right: 8px;"></i>
                                <a href="tel:+2252121802126" style="color: #bdc3c7; text-decoration: none;">(+225) 21 21 80 21 26</a>
                            </li>
                        </ul>
                    </div>

                    <!-- Colonne Newsletter -->
                    <div class="footer-column">
                        <h3 style="color: #d10000; margin-bottom: 15px; font-size: 1.2rem;">Newsletter</h3>
                        <p style="color: #bdc3c7; margin-bottom: 15px;">Restez informé de nos dernières actualités</p>
                        <form class="footer-newsletter-form" style="margin-bottom: 20px;">
                            <div style="display: flex; gap: 10px;">
                                <input type="email" placeholder="Votre email" required style="flex: 1; padding: 10px; border: none; border-radius: 5px; background: #34495e; color: white;">
                                <button type="submit" style="padding: 10px 15px; background: #d10000; color: white; border: none; border-radius: 5px; cursor: pointer;">
                                    <i class="fas fa-paper-plane"></i>
                                </button>
                            </div>
                        </form>
                        <div class="social-links" style="display: flex; gap: 15px; justify-content: center;">
                            <a href="#" class="social-link" style="color: #bdc3c7; font-size: 1.2rem; transition: color 0.3s ease;">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" class="social-link" style="color: #bdc3c7; font-size: 1.2rem; transition: color 0.3s ease;">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                            <a href="#" class="social-link" style="color: #bdc3c7; font-size: 1.2rem; transition: color 0.3s ease;">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Footer bottom -->
                <div class="footer-bottom" style="border-top: 1px solid #34495e; padding-top: 20px; text-align: center;">
                    <p style="color: #95a5a6; margin: 0;">Copyright © 2024 Sorbo-Ingénierie. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    `;
    
    // Insérer le footer à la fin du body
    document.body.insertAdjacentHTML('beforeend', footerHTML);
    console.log('Footer de base créé !');
}

// Fonction pour forcer l'affichage du footer
function forceShowFooter() {
    const footer = document.querySelector('footer');
    if (footer) {
        footer.style.cssText = `
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            background: #2c3e50 !important;
            color: white !important;
            padding: 40px 0 20px !important;
            margin-top: 60px !important;
            position: relative !important;
            z-index: 100 !important;
        `;
        console.log('Footer forcé à s\'afficher !');
    }
}

// Exécuter la correction immédiatement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(forceShowFooter, 1000);
    });
} else {
    setTimeout(forceShowFooter, 1000);
}

# Script pour corriger les footers des pages HTML
# Remplace les footers problématiques par le footer standardisé

$footerStandard = @"
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-column footer-brand slide-up">
                    <img src="images/logo.png" alt="Sorbo-Ingénierie Logo" class="footer-logo">
                    <h3>Sorbo-Ingénierie</h3>
                    <p class="footer-description">Excellence et Innovation en Génie civil</p>
                </div>

                <div class="footer-column slide-up">
                    <h3>Informations légales</h3>
                    <ul class="company-info">
                        <li><strong>Nom légal :</strong> Sorbo-Ingénierie</li>
                        <li><strong>N° Compte contribuable :</strong> 2242797T</li>
                        <li><strong>Forme juridique :</strong> SARL</li>
                        <li><strong>Registre de commerce :</strong> CI-ABJ-03-2022-B12-03946</li>
                        <li><strong>Capital social :</strong> 1 000 000 F CFA</li>
                    </ul>
                </div>

                <div class="footer-column slide-up">
                    <h3>Nos contacts</h3>
                    <ul class="contact-info">
                        <li><i class="fas fa-envelope"></i> <a href="mailto:contact@sorbo.ingenierie.ci">contact@sorbo.ingenierie.ci</a></li>
                        <li><i class="fas fa-envelope"></i> <a href="mailto:logiciels@sorbo-ingenierie.ci">logiciels@sorbo-ingenierie.ci</a></li>
                        <li><i class="fas fa-phone"></i> <a href="tel:+2250150123050">(+225) 01 50 12 30 50</a></li>
                        <li><i class="fas fa-phone"></i> <a href="tel:+2252121802126">(+225) 21 21 80 21 26</a></li>
                    </ul>
                </div>

                <div class="footer-column footer-newsletter fade-in">
                    <h3>Newsletter</h3>
                    <p>Restez informé de nos dernières actualités</p>
                    <form class="footer-newsletter-form">
                        <input type="email" placeholder="Votre email" required>
                        <button type="submit"><i class="fas fa-paper-plane"></i></button>
                    </form>
                    <div class="social-links">
                        <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
                        <a href="#" class="social-link"><i class="fab fa-linkedin-in"></i></a>
                        <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <p>Copyright © 2024 Sorbo-Ingénierie. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
"@

# Pages à corriger
$pages = @("notre-entreprise.html", "nos-formations.html")

Write-Host "Correction des footers problematiques..." -ForegroundColor Yellow

foreach ($page in $pages) {
    if (Test-Path $page) {
        Write-Host "Correction de $page..." -ForegroundColor Cyan
        
        try {
            # Lire le contenu
            $content = Get-Content $page -Raw -Encoding UTF8
            
            # Remplacer le footer complet
            $pattern = '(?s)<footer>.*?</footer>'
            
            if ($content -match $pattern) {
                $content = $content -replace $pattern, $footerStandard
                
                # Sauvegarder
                $content | Out-File $page -Encoding UTF8
                Write-Host "Footer corrigé pour $page" -ForegroundColor Green
            } else {
                Write-Host "Aucun footer trouvé dans $page" -ForegroundColor Yellow
            }
        }
        catch {
            Write-Host "Erreur lors de la correction de $page : $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "Page non trouvée : $page" -ForegroundColor Red
    }
}

Write-Host "Correction des footers terminee !" -ForegroundColor Green

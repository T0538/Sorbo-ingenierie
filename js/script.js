document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');

    console.log('📱 Éléments menu mobile trouvés:', { mobileMenuBtn: !!mobileMenuBtn, mainNav: !!mainNav });

    if (mobileMenuBtn && mainNav) {
        console.log('✅ Configuration du menu mobile...');
        
        // Debug: Vérifier l'état initial du menu
        console.log('📱 État initial du menu:', {
            mainNavClasses: mainNav.className,
            mainNavStyle: mainNav.style.cssText,
            mainNavComputedStyle: window.getComputedStyle(mainNav).display,
            mainNavComputedVisibility: window.getComputedStyle(mainNav).visibility,
            mainNavComputedOpacity: window.getComputedStyle(mainNav).opacity
        });
        
        mobileMenuBtn.addEventListener('click', function(e) {
            console.log('🖱️ Clic sur le bouton menu mobile');
            e.preventDefault();
            
            // Debug: Vérifier l'état avant
            console.log('📱 État AVANT toggle:', {
                mainNavActive: mainNav.classList.contains('active'),
                mainNavClasses: mainNav.className,
                mainNavStyle: mainNav.style.cssText
            });
            
            mainNav.classList.toggle('active');
            this.classList.toggle('active');
            
            // Debug: Vérifier l'état après
            console.log('📱 État APRÈS toggle:', {
                mainNavActive: mainNav.classList.contains('active'),
                mainNavClasses: mainNav.className,
                mainNavStyle: mainNav.style.cssText
            });
            
            // Mise à jour de l'attribut aria-expanded
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            console.log('📱 Menu mobile état:', mainNav.classList.contains('active') ? 'OUVERT' : 'FERMÉ');
        });

        // Fermer le menu quand on clique sur un lien
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    mobileMenuBtn.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // Dropdown menus on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach(dropdown => {
        const dropdownToggle = dropdown.querySelector('a');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');
        
        if (dropdownToggle && dropdownMenu) {
            dropdownToggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    dropdownMenu.classList.toggle('show');
                    const isExpanded = this.getAttribute('aria-expanded') === 'true';
                    this.setAttribute('aria-expanded', !isExpanded);
                }
            });
        }
    });

    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                // Here you would normally send the email to your server
                // For now, we'll just show a success message
                const formContainer = this.parentNode;
                const successMessage = document.createElement('p');
                successMessage.textContent = 'Merci pour votre inscription!';
                successMessage.className = 'success-message';
                
                this.style.display = 'none';
                formContainer.appendChild(successMessage);
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href').length > 1) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Animation on scroll
    const animateElements = document.querySelectorAll('.service-card, .news-card, .director-message');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;
        
        animateElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;
            
            if ((elementBottomPosition >= windowTopPosition) && (elementTopPosition <= windowBottomPosition)) {
                element.classList.add('animated');
            }
        });
    }
    
    window.addEventListener('scroll', checkIfInView);
    window.addEventListener('resize', checkIfInView);
    checkIfInView();
}); 
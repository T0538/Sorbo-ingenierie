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

    if (mobileMenuBtn && mainNav) {
        const closeMobileMenu = () => {
            mainNav.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => menu.classList.remove('show'));
            document.querySelectorAll('.dropdown > a[aria-expanded="true"]').forEach(toggle => toggle.setAttribute('aria-expanded', 'false'));
        };

        const openMobileMenu = () => {
            mainNav.classList.add('active');
            mobileMenuBtn.classList.add('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'true');
        };

        mobileMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();

            const isOpen = mainNav.classList.contains('active');
            if (isOpen) closeMobileMenu();
            else openMobileMenu();
        });

        // Fermer le menu quand on clique sur un lien
        const navLinks = document.querySelectorAll('.main-nav a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    closeMobileMenu();
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (window.innerWidth > 992) return;
            if (!mainNav.classList.contains('active')) return;

            const header = document.querySelector('header');
            if (header && !header.contains(e.target)) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key !== 'Escape') return;
            if (mainNav.classList.contains('active')) closeMobileMenu();
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 992) closeMobileMenu();
        });
    }

    // Dropdown menus on mobile
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdowns.forEach((dropdown, index) => {
        const dropdownToggle = dropdown.querySelector('a');
        const dropdownMenu = dropdown.querySelector('.dropdown-menu');

        if (dropdownToggle && dropdownMenu) {
            dropdownToggle.addEventListener('click', function(e) {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    
                    // Fermer tous les autres dropdowns d'abord
                    dropdowns.forEach(otherDropdown => {
                        if (otherDropdown !== dropdown) {
                            const otherMenu = otherDropdown.querySelector('.dropdown-menu');
                            if (otherMenu) {
                                otherMenu.classList.remove('show');
                                const otherToggle = otherDropdown.querySelector('a');
                                if (otherToggle) {
                                    otherToggle.setAttribute('aria-expanded', 'false');
                                }
                            }
                        }
                    });
                    
                    // Toggle du dropdown actuel
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

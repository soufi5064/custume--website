document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Page Entry Blur Animation - Handled directly in HTML for instant trigger
    const mainContent = document.querySelector('.page-transition');

    // Navbar Scroll Effect
    const nav = document.querySelector('nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('py-2', 'bg-rebel-darker/90');
                nav.classList.remove('py-4', 'bg-rebel-darker/70');
            } else {
                nav.classList.add('py-4', 'bg-rebel-darker/70');
                nav.classList.remove('py-2', 'bg-rebel-darker/90');
            }
        });
    }

    // Smooth Page Transition for internal links
    document.querySelectorAll('a').forEach(link => {
        if (link.hostname === window.location.hostname && !link.hash && link.target !== '_blank') {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetUrl = link.href;
                if (mainContent) {
                    mainContent.style.transition = 'all 1s cubic-bezier(0.22, 1, 0.36, 1)';
                    mainContent.style.filter = 'blur(30px)';
                    mainContent.style.opacity = '0';
                }
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 1000);
            });
        }
    });

    // Mobile Menu Logic
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Update Mobile Menu Translations
    const updateMobileMenu = (lang) => {
        if (mobileMenu) {
            const links = mobileMenu.querySelectorAll('a');
            const translations = {
                en: ['Home', 'About', 'Join', 'Rules', 'Careers', 'Lore', 'Store'],
                ar: ['الرئيسية', 'من نحن', 'انضم الآن', 'القوانين', 'الوظائف', 'القصة', 'المتجر']
            };
            
            links.forEach((link, index) => {
                if (translations[lang] && translations[lang][index]) {
                    link.textContent = translations[lang][index];
                }
            });
        }
    };

    // Intersection Observer for scroll reveal animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements with reveal classes
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // Language Dropdown & Persistence Logic
    const langContainer = document.querySelector('.lang-dropdown-container');
    const currentLangDisplay = document.querySelector('.lang-current');

    const updateLanguage = (lang) => {
        const dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', dir);
        localStorage.setItem('rebel_lang', lang);
        updateMobileMenu(lang);

        // Update the main display in the dropdown
        if (currentLangDisplay) {
            const flagImg = currentLangDisplay.querySelector('.flag-icon');
            const langText = currentLangDisplay.querySelector('span');
            
            if (lang === 'ar') {
                flagImg.src = "https://flagcdn.com/w20/sa.png";
                langText.textContent = "Arabic";
            } else {
                flagImg.src = "https://flagcdn.com/w20/us.png";
                langText.textContent = "English";
            }
        }
    };

    // Initialize language from localStorage on page load
    const savedLang = localStorage.getItem('rebel_lang') || 'en';
    updateLanguage(savedLang);

    // Dropdown option click listeners
    const langOptions = document.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const selectedLang = option.getAttribute('data-lang');
            
            // Trigger exit blur
            if (mainContent) {
                mainContent.style.filter = 'blur(30px)';
                mainContent.style.opacity = '0';
            }

            setTimeout(() => {
                updateLanguage(selectedLang);
                
                // Reset blur
                if (mainContent) {
                    mainContent.style.filter = 'blur(0)';
                    mainContent.style.opacity = '1';
                }
            }, 500);
        });
    });
});

const PARALLAX_SPEED = 0.5;
const SCROLL_THRESHOLD = 0.1;
const TYPING_SPEED = 100;
const TYPING_DELAY = 2000;
const MAIN_MASCOT_IMAGE_URL = "https://imgur.com/XuW5Q1E.png";
const BUG_MASCOT_IMAGE_URL = "https://imgur.com/TdnsSp9.png";
const POPUP_TITLE = "Nossa IDE está em desenvolvimento!";
const POPUP_MESSAGE = "Estamos trabalhando duro para criar uma experiência incrível. Por enquanto, você pode acompanhar todas as novidades e atualizações pelo nosso Instagram.";
const POPUP_SIGNATURE = "- Esthevan, Co-Founder";
const POPUP_TRIGGER_SELECTORS = [
    '#about-welcome-btn',
    '#header-start-free-btn',
    '#mobile-start-free-btn'
];
const CTA_REPO_URL = "https://github.com/sl4apdev/grace";
const CTA_TEXT = "Em desenvolvimento ativo!";
const FOOTER_LINKS = [
    { text: 'Documentação', href: 'https://github.com/sl4apdev/grace', id: 'footer-doc-link', target: '_blank', rel: 'noopener noreferrer' },
    { text: 'GitHub', href: 'https://github.com/sl4apdev/grace', id: 'footer-github-link', target: '_blank', rel: 'noopener noreferrer' }
];
const TEAM_MEMBERS = [
    {
        avatar: "https://i.imgur.com/i60laGk.png",
        name: "Esthevan C. Tombini",
        role: "Co-founder",
        bio: "18 anos, estudante de ciência da computação. Autodidata, explorando machine learning e unix.",
        socials: [
            { icon: "github", url: "https://github.com/sl4apdev" },
            { icon: "instagram", url: "https://www.instagram.com/esthevan.dev" }
        ]
    },
    {
        avatar: "https://i.imgur.com/YnWJkjS.png",
        name: "Rodolfo A. S. de Oliveira",
        role: "Co-founder",
        bio: "Um estudante da Ciências da Computação aficionado em IA, banco de dados, mercado financeiro e emulação.",
        socials: [
            { icon: "github", url: "https://github.com/sl4apdev/grace" },
            { icon: "instagram", url: "https://www.instagram.com/or00ga/" }
        ]
    }
];
const terminalMessages = [
    'Sou a BUG!',
    'Analisando código...',
    'Encontrando oportunidades de melhoria...',
    'Sugerindo otimizações...',
    'Pronto para ajudar! 🤖'
];
const DEV_PROGRESS_TITLE = "Acompanhe Nosso Desenvolvimento";
const DEV_PROGRESS_P1 = "O desenvolvimento do Grace IDE é um processo contínuo e transparente. Convidamos você a acompanhar de perto o nosso progresso através do nosso perfil no Instagram.";
const DEV_PROGRESS_P2 = "Lá, compartilharemos atualizações regulares sobre o desenvolvimento da IDE, os desafios que enfrentamos e as novas funcionalidades que estão sendo implementadas. Este é um projeto de paixão, desenvolvido inteiramente por dois estudantes, e estamos comprometidos em construir uma ferramenta de alta qualidade que reflete nosso tempo e dedicação.";
const DEV_PROGRESS_SIGNATURE = "— Esthevan, co-founder";
const INSTAGRAM_URL = "https://www.instagram.com/grace.ide.ai/?__pwa=1";
const INSTAGRAM_BUTTON_TEXT = "Siga no Instagram";

const heroSection = document.querySelector('.hero-section');
const heroBg = document.querySelector('.hero-bg');
const terminalText = document.getElementById('terminal-text');
const header = document.getElementById('header');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mainHeroBtn = document.getElementById('main-hero-btn');

let isScrolling = false;
let openDevPopup;

function preloadCriticalImages() {
    const criticalImages = [
        'https://i.imgur.com/jLLSVvb.png',
        MAIN_MASCOT_IMAGE_URL,
        BUG_MASCOT_IMAGE_URL
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function handleHeroParallax(e) {
    if (window.innerWidth < 768) return;
    
    const rect = heroSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
    
    heroBg.style.transform = `translate(${x * PARALLAX_SPEED}px, ${y * PARALLAX_SPEED}px) scale(1.1)`;
}

function startTerminalAnimation() {
    if (!terminalText) return;
    
    let messageIndex = 0;
    
    function typeMessage() {
        const message = terminalMessages[messageIndex];
        let charIndex = 0;
        terminalText.textContent = '';
        
        function typeChar() {
            if (charIndex < message.length) {
                terminalText.textContent += message.charAt(charIndex++);
                setTimeout(typeChar, TYPING_SPEED);
            } else {
                setTimeout(() => {
                    messageIndex = (messageIndex + 1) % terminalMessages.length;
                    typeMessage();
                }, TYPING_DELAY);
            }
        }
        typeChar();
    }
    
    setTimeout(typeMessage, 1000);
}

function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.mascot, .team-card'); 
    animatedElements.forEach(el => el.classList.add('fade-in'));
    initializeVantaFog();
}

function initializeVantaFog() {
    const sobreSection = document.getElementById('sobre');
    if (sobreSection && window.VANTA) {
        window.VANTA.FOG({
            el: sobreSection,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: 0x0,
            midtoneColor: 0x61639,
            lowlightColor: 0x1111a7,
            baseColor: 0x121116,
            blurFactor: 0.90,
            speed: 2.50,
            zoom: 0.40
        });
    }
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: SCROLL_THRESHOLD,
        rootMargin: '0px 0px -10% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function handleScroll() {
    if (isScrolling) return;
    isScrolling = true;
    requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        isScrolling = false;
    });
}

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
}

function handleMainHeroClick() {
    const button = mainHeroBtn;
    button.style.transform = 'scale(1.1) translateY(-12px)';
    
    setTimeout(() => {
        button.style.transform = '';
    }, 200);
    
    const sobreSection = document.getElementById('sobre');
    if (sobreSection) {
        sobreSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function setupEventListeners(openPopupFn) {
    openDevPopup = openPopupFn;
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (mainHeroBtn) {
        mainHeroBtn.addEventListener('click', handleMainHeroClick);
    }
    
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
    
    if (heroSection) {
        heroSection.addEventListener('mousemove', handleHeroParallax);
    }

    POPUP_TRIGGER_SELECTORS.forEach(selector => {
        document.querySelectorAll(selector).forEach(button => {
            if (button) {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (openDevPopup) openDevPopup();
                });
            }
        });
    });
}

function setupSmoothNavigation() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
}

function setupDevPopup() {
    const devPopup = document.getElementById('dev-popup');
    const devPopupContent = document.getElementById('dev-popup-content');
    const closePopupBtn = document.getElementById('close-popup-btn');
    const popupTitle = document.getElementById('popup-title');
    const popupMessage = document.getElementById('popup-message');
    const popupSignature = document.getElementById('popup-signature');

    if (!devPopup || !devPopupContent || !closePopupBtn) {
        console.warn('Development popup elements not found.');
        return () => {};
    }

    if (popupTitle) popupTitle.textContent = POPUP_TITLE;
    if (popupMessage) popupMessage.textContent = POPUP_MESSAGE;
    if (popupSignature) popupSignature.textContent = POPUP_SIGNATURE;

    const openPopup = () => {
        devPopup.classList.remove('opacity-0', 'pointer-events-none');
        devPopupContent.classList.remove('scale-95');
        lucide.createIcons(); 
    };

    const closePopup = () => {
        devPopup.classList.add('opacity-0');
        devPopupContent.classList.add('scale-95');
        setTimeout(() => devPopup.classList.add('pointer-events-none'), 300);
    };

    closePopupBtn.addEventListener('click', closePopup);
    devPopup.addEventListener('click', (e) => e.target === devPopup && closePopup());

    return openPopup;
}

function applyImageUrls() {
    const mainMascotImg = document.querySelector('.mascot-large.floating');
    if (mainMascotImg) {
        mainMascotImg.src = MAIN_MASCOT_IMAGE_URL;
    }

    document.documentElement.style.setProperty('--main-mascot-image-url', `url(${MAIN_MASCOT_IMAGE_URL})`);

    const bugMascotImg = document.querySelector('.bug-mascot');
    if (bugMascotImg) {
        bugMascotImg.src = "https://imgur.com/TdnsSp9.png"; 
    }
}

function generateFooterLinks() {
    const footerList = document.getElementById('footer-links-list');
    if (!footerList) return;

    footerList.innerHTML = ''; 

    FOOTER_LINKS.forEach(linkData => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        
        a.textContent = linkData.text;
        a.href = linkData.href;
        
        if (linkData.id) a.id = linkData.id;
        if (linkData.target) a.target = linkData.target;
        if (linkData.rel) a.rel = linkData.rel;

        li.appendChild(a);
        footerList.appendChild(li);
    });
}

function setupDevProgressSection() {
    const title = document.getElementById('dev-progress-title');
    const p1 = document.getElementById('dev-progress-p1');
    const p2 = document.getElementById('dev-progress-p2');
    const signature = document.getElementById('dev-progress-signature');
    const instaBtn = document.getElementById('dev-progress-instagram-btn');
    const instaBtnText = document.getElementById('dev-progress-instagram-btn-text');

    if (title) title.textContent = DEV_PROGRESS_TITLE;
    if (p1) p1.textContent = DEV_PROGRESS_P1;
    if (p2) p2.textContent = DEV_PROGRESS_P2;
    if (signature) signature.textContent = DEV_PROGRESS_SIGNATURE;
    if (instaBtn) instaBtn.href = INSTAGRAM_URL;
    if (instaBtnText) instaBtnText.textContent = INSTAGRAM_BUTTON_TEXT;
}

function generateTeamCards() {
    const teamContainer = document.getElementById('team-container');
    if (!teamContainer) return;

    teamContainer.innerHTML = '';

    TEAM_MEMBERS.forEach(member => {
        const socialLinksHTML = member.socials.map(social => `
            <a href="${social.url}" target="_blank" rel="noopener noreferrer" class="team-social-link"><i data-lucide="${social.icon}"></i></a>
        `).join('');

        const cardHTML = `
            <div class="team-card">
                <img src="${member.avatar}" alt="${member.name}" class="team-avatar">
                <h3 class="team-name">${member.name}</h3>
                <p class="team-role">${member.role}</p>
                <p class="team-bio">
                    ${member.bio}
                </p>
                <div class="team-social">
                    ${socialLinksHTML}
                </div>
            </div>
        `;
        teamContainer.innerHTML += cardHTML;
    });

    lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    
    const openDevPopup = setupDevPopup();

    setupEventListeners(openDevPopup);
    setupSmoothNavigation();
    
    initializeAnimations();
    
    startTerminalAnimation();
    
    setupScrollAnimations();

    generateFooterLinks();

    generateTeamCards();

    setupDevProgressSection();

    applyImageUrls();
    preloadCriticalImages();

    const ctaRepoLink = document.getElementById('cta-repo-link');
    if (ctaRepoLink) {
        ctaRepoLink.href = CTA_REPO_URL;
    }

    const ctaSection = document.getElementById('contato');
    if (ctaSection) {
        const ctaTextElement = ctaSection.querySelector('p');
        if (ctaTextElement) {
            ctaTextElement.textContent = CTA_TEXT;
        }
    }
});

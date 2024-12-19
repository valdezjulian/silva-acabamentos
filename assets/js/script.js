// Inicialização principal
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Objeto principal da aplicação
const App = {
    // Inicialização
    init() {
        this.initEmailJS();
        this.initHeader();
        this.initMobileMenu();
        this.initSmoothScroll();
        this.initScrollEffects();
        this.initPortfolio();
        this.initContactForm();
        this.initBackToTop();
    },

    // EmailJS
    initEmailJS() {
        emailjs.init("a8-1Gcvpszt0kXjkh");
    },

    // Header
    initHeader() {
        const header = document.querySelector('header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    },

    // Menu Mobile
    initMobileMenu() {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const menu = document.querySelector('.mobile-menu');
        const links = document.querySelectorAll('.mobile-nav a');

        if (!menuBtn || !menu) return;

        const toggleMenu = () => {
            menuBtn.classList.toggle('active');
            menu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        };

        menuBtn.addEventListener('click', toggleMenu);
        links.forEach(link => link.addEventListener('click', toggleMenu));

        // Fecha menu ao redimensionar
        window.addEventListener('resize', () => {
            if (window.innerWidth > 767 && menu.classList.contains('active')) {
                toggleMenu();
            }
        });

        // Fecha menu com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('active')) {
                toggleMenu();
            }
        });
    },

    // Scroll Suave
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', e => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                
                if (!target) return;

                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            });
        });
    },

    // Efeitos de Scroll
    initScrollEffects() {
        // Animação de entrada
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('.service-card, .portfolio-item, .about-content, .contact-form-card')
            .forEach(el => observer.observe(el));

        // Menu ativo no scroll
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY + 90;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    const currentId = section.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
                    });
                }
            });
        }, { passive: true });
    },

    // Portfólio
    initPortfolio() {
        const buttons = document.querySelectorAll('.portfolio-categories button');
        const items = document.querySelectorAll('.portfolio-item');

        if (!buttons.length || !items.length) return;

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const category = button.textContent.toLowerCase();
                items.forEach(item => {
                    item.style.display = category === 'todos' || 
                                       item.dataset.category === category ? 'block' : 'none';
                });
            });
        });
    },

    // Formulário de Contato
    initContactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = form.querySelector('button');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            try {
                await emailjs.send('service_olmuoq4', 'template_yvq4ezq', {
                    from_name: document.getElementById('from_name').value,
                    from_email: document.getElementById('from_email').value,
                    message: document.getElementById('message').value
                });
                alert('Mensagem enviada com sucesso!');
                form.reset();
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao enviar mensagem. Tente novamente.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensagem';
            }
        });
    },

    // Botão Back to Top
    initBackToTop() {
        const backToTop = document.querySelector('.back-to-top');
        if (!backToTop) return;

        const checkScroll = () => {
            const scrolled = window.scrollY || document.documentElement.scrollTop;
            backToTop.classList.toggle('visible', scrolled > 300);
        };

        const scrollToTop = () => {
            if ('scrollBehavior' in document.documentElement.style) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                let currentPosition = window.pageYOffset;
                const scroll = () => {
                    currentPosition = currentPosition - (currentPosition / 8);
                    if (currentPosition < 1) {
                        window.scrollTo(0, 0);
                    } else {
                        window.scrollTo(0, currentPosition);
                        requestAnimationFrame(scroll);
                    }
                };
                scroll();
            }
        };

        window.addEventListener('scroll', checkScroll, { passive: true });
        backToTop.addEventListener('click', (e) => {
            e.preventDefault();
            backToTop.classList.add('spinning');
            scrollToTop();
            setTimeout(() => backToTop.classList.remove('spinning'), 1000);
        });

        checkScroll();
    }
};
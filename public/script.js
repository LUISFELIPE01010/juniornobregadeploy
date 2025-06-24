// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const header = document.getElementById('header');
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Animate hamburger
        const spans = menuToggle.querySelectorAll('span');
        if (menuToggle.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });
    
    // Close mobile menu when clicking on links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Initialize components
    initCountUp();
    initTestimonials();
    initQuiz();
    initScrollAnimations();
});

// CountUp Animation
function initCountUp() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const highlight = entry.target.querySelector('.highlight');
                if (highlight && !highlight.classList.contains('counted')) {
                    highlight.classList.add('counted');
                    animateCount(highlight, 100, 2500);
                }
            }
        });
    });
    
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        observer.observe(heroSection);
    }
}

function animateCount(element, target, duration) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCount() {
        start += increment;
        if (start < target) {
            element.innerHTML = `+${Math.floor(start)} alunos já`;
            requestAnimationFrame(updateCount);
        } else {
            element.innerHTML = `+${target} alunos já`;
        }
    }
    
    updateCount();
}

// Testimonials Carousel
function initTestimonials() {
    const wrapper = document.getElementById('testimonialsWrapper');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.getElementById('dotsContainer');
    
    if (!wrapper) return;
    
    const cards = wrapper.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let cardsToShow = getCardsToShow();
    
    // Create dots
    createDots();
    
    // Event listeners
    if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));
    
    // Touch events for mobile
    let startX = 0;
    let endX = 0;
    
    wrapper.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });
    
    wrapper.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });
    
    // Resize handler
    window.addEventListener('resize', () => {
        cardsToShow = getCardsToShow();
        updateCarousel();
        createDots();
    });
    
    function getCardsToShow() {
        if (window.innerWidth >= 1024) return 3;
        if (window.innerWidth >= 768) return 2;
        return 1;
    }
    
    function createDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = '';
        const maxIndex = Math.max(0, cards.length - cardsToShow);
        
        for (let i = 0; i <= maxIndex; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }
    
    function navigate(direction) {
        const maxIndex = Math.max(0, cards.length - cardsToShow);
        currentIndex = Math.max(0, Math.min(currentIndex + direction, maxIndex));
        updateCarousel();
    }
    
    function goToSlide(index) {
        const maxIndex = Math.max(0, cards.length - cardsToShow);
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        updateCarousel();
    }
    
    function updateCarousel() {
        const cardWidth = cards[0].offsetWidth + 30; // card width + gap
        const translateX = -currentIndex * cardWidth;
        wrapper.style.transform = `translateX(${translateX}px)`;
        
        // Update dots
        const dots = dotsContainer?.querySelectorAll('.dot');
        if (dots) {
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
        
        // Update buttons
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) {
            const maxIndex = Math.max(0, cards.length - cardsToShow);
            nextBtn.disabled = currentIndex >= maxIndex;
        }
    }
    
    function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                navigate(1); // Swipe left - next
            } else {
                navigate(-1); // Swipe right - prev
            }
        }
    }
    
    // Initial setup
    updateCarousel();
}

// Quiz Functionality
function initQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    if (!quizContainer) return;
    
    const questions = [
        {
            question: "Qual seu principal objetivo?",
            options: [
                { text: "Emagrecimento", value: "emagrecimento" },
                { text: "Hipertrofia", value: "hipertrofia" },
                { text: "Performance esportiva", value: "performance" },
                { text: "Condicionamento geral", value: "condicionamento" }
            ]
        },
        {
            question: "Qual seu nível de experiência?",
            options: [
                { text: "Iniciante", value: "iniciante" },
                { text: "Intermediário", value: "intermediario" },
                { text: "Avançado", value: "avancado" }
            ]
        },
        {
            question: "Onde prefere treinar?",
            options: [
                { text: "Academia", value: "academia" },
                { text: "Condomínio", value: "condominio" },
                { text: "Ao ar livre", value: "ar_livre" }
            ]
        },
        {
            question: "Qual formato prefere?",
            options: [
                { text: "Individual", value: "individual" },
                { text: "Em dupla", value: "dupla" },
                { text: "Grupo pequeno", value: "grupo" }
            ]
        }
    ];
    
    let currentQuestion = 0;
    let answers = {};
    
    function renderQuiz() {
        if (currentQuestion < questions.length) {
            renderQuestion();
        } else {
            renderResult();
        }
    }
    
    function renderQuestion() {
        const question = questions[currentQuestion];
        
        quizContainer.innerHTML = `
            <div class="quiz-progress">
                ${questions.map((_, index) => 
                    `<div class="progress-dot ${index <= currentQuestion ? 'active' : ''}"></div>`
                ).join('')}
            </div>
            
            <div class="quiz-question">
                <h3>Pergunta ${currentQuestion + 1} de ${questions.length}</h3>
                <p>${question.question}</p>
            </div>
            
            <div class="quiz-options">
                ${question.options.map((option, index) => 
                    `<div class="quiz-option" data-value="${option.value}" data-index="${index}">
                        ${option.text}
                    </div>`
                ).join('')}
            </div>
            
            <div class="quiz-nav">
                <button class="quiz-btn secondary" onclick="previousQuestion()" ${currentQuestion === 0 ? 'disabled' : ''}>
                    Anterior
                </button>
                <button class="quiz-btn primary" id="nextBtn" disabled onclick="nextQuestion()">
                    ${currentQuestion === questions.length - 1 ? 'Ver Resultado' : 'Próxima'}
                </button>
            </div>
        `;
        
        // Add event listeners to options
        const options = quizContainer.querySelectorAll('.quiz-option');
        const nextBtn = document.getElementById('nextBtn');
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                // Remove previous selection
                options.forEach(opt => opt.classList.remove('selected'));
                
                // Add selection to clicked option
                option.classList.add('selected');
                
                // Store answer
                answers[currentQuestion] = option.dataset.value;
                
                // Enable next button
                nextBtn.disabled = false;
            });
        });
    }
    
    function renderResult() {
        const recommendation = getRecommendation();
        
        quizContainer.innerHTML = `
            <div class="quiz-result">
                <h3>Sua recomendação personalizada</h3>
                <div class="recommendation-card">
                    <p>${recommendation.text}</p>
                </div>
                
                <div class="recommendation-card">
                    <h4>Formato recomendado:</h4>
                    <p>${recommendation.format}</p>
                </div>
                
                <div class="recommendation-card">
                    <h4>Local ideal:</h4>
                    <p>${recommendation.local}</p>
                </div>
                
                <div style="display: flex; gap: 20px; justify-content: center; margin-top: 30px; flex-wrap: wrap;">
                    <a href="https://wa.me/5513997676164?text=${encodeURIComponent(recommendation.whatsappMessage)}" 
                       class="btn-primary" target="_blank" style="text-decoration: none;">
                        <i class="fab fa-whatsapp"></i>
                        Falar com Junior
                    </a>
                    <button class="quiz-btn secondary" onclick="restartQuiz()">
                        Refazer Quiz
                    </button>
                </div>
            </div>
        `;
    }
    
    function getRecommendation() {
        const objetivo = answers[0];
        const nivel = answers[1];
        const local = answers[2];
        const formato = answers[3];
        
        let text = "";
        let whatsappMessage = "Olá! Fiz o quiz no seu site e gostaria de saber mais sobre ";
        
        if (objetivo === "emagrecimento") {
            text = "Baseado em suas respostas, você se beneficiaria de um treino focado em queima de gordura com exercícios funcionais e cardiovasculares.";
            whatsappMessage += "treinos para emagrecimento";
        } else if (objetivo === "hipertrofia") {
            text = "Perfeito! Você tem o perfil ideal para treinos de hipertrofia com foco em ganho de massa muscular através de exercícios de força.";
            whatsappMessage += "treinos para ganho de massa muscular";
        } else if (objetivo === "performance") {
            text = "Excelente! Você precisa de treinos específicos para performance esportiva, com foco em explosão, agilidade e condicionamento.";
            whatsappMessage += "treinos para performance esportiva";
        } else {
            text = "Ideal! Um treino de condicionamento geral vai melhorar sua saúde, disposição e qualidade de vida de forma completa.";
            whatsappMessage += "treinos de condicionamento geral";
        }
        
        let formatText = "";
        if (formato === "individual") {
            formatText = "Aulas individuais (atenção 100% focada)";
        } else if (formato === "dupla") {
            formatText = "Aulas em dupla (motivação e economia)";
        } else {
            formatText = "Grupo pequeno (ambiente colaborativo)";
        }
        
        let localText = "";
        if (local === "academia") {
            localText = "Ironberg Alphaville";
        } else if (local === "condominio") {
            localText = "No seu condomínio";
        } else {
            localText = "Treinos ao ar livre";
        }
        
        whatsappMessage += ` no formato ${formatText.toLowerCase()}.`;
        
        return {
            text,
            format: formatText,
            local: localText,
            whatsappMessage
        };
    }
    
    // Global functions for navigation
    window.nextQuestion = function() {
        currentQuestion++;
        renderQuiz();
    };
    
    window.previousQuestion = function() {
        currentQuestion--;
        renderQuiz();
    };
    
    window.restartQuiz = function() {
        currentQuestion = 0;
        answers = {};
        renderQuiz();
    };
    
    // Start quiz
    renderQuiz();
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Different animation types based on element
                if (element.classList.contains('formato-card')) {
                    element.classList.add('scale-in');
                } else if (element.classList.contains('local-card')) {
                    if (element.dataset.direction === 'left') {
                        element.classList.add('fade-in-left');
                    } else {
                        element.classList.add('fade-in-right');
                    }
                } else if (element.classList.contains('diferencial-card')) {
                    element.classList.add('fade-in-up');
                } else {
                    element.classList.add('fade-in-up');
                }
                
                observer.unobserve(element);
            }
        });
    }, observerOptions);
    
    // Set up animation directions for local cards
    const localCards = document.querySelectorAll('.local-card');
    localCards.forEach((card, index) => {
        card.dataset.direction = index % 2 === 0 ? 'left' : 'right';
    });
    
    // Add stagger delays to formato cards
    const formatoCards = document.querySelectorAll('.formato-card');
    formatoCards.forEach((card, index) => {
        card.classList.add(`stagger-${index + 1}`);
    });
    
    // Add stagger delays to diferencial cards
    const diferencialCards = document.querySelectorAll('.diferencial-card');
    diferencialCards.forEach((card, index) => {
        card.classList.add(`stagger-${(index % 4) + 1}`);
    });
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll([
        '.formato-card',
        '.local-card',
        '.diferencial-card',
        '.testimonial-card',
        '.sobre-content',
        '.section-header',
        '.quiz-container'
    ].join(','));
    
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Utility Functions
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

// Performance optimizations
window.addEventListener('resize', debounce(() => {
    // Recalculate layouts if needed
    const testimonialsWrapper = document.getElementById('testimonialsWrapper');
    if (testimonialsWrapper) {
        // Trigger testimonials update
        testimonialsWrapper.dispatchEvent(new Event('resize'));
    }
}, 250));

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
    });
}
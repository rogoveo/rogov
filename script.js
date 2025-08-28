document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка для навигации
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = 100; // Отступ для удобства
                const elementPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: elementPosition,
                    behavior: 'smooth'
                });
                
                // Удаляем активный класс у всех ссылок
                navLinks.forEach(navLink => navLink.classList.remove('active'));
                // Добавляем активный класс текущей ссылке
                this.classList.add('active');
            }
        });
    });
    
    // Подсветка активной секции при прокрутке
    const sections = document.querySelectorAll('.section');
    
    function highlightCurrentSection() {
        const scrollPosition = window.pageYOffset + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    // Слушатель прокрутки с оптимизацией
    let ticking = false;
    
    function updateOnScroll() {
        highlightCurrentSection();
        animateOnScroll();
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    // Копирование номера телефона в буфер обмена
    const phoneElement = document.querySelector('.phone');
    
    if (phoneElement) {
        phoneElement.addEventListener('click', function() {
            const phoneNumber = this.getAttribute('data-phone');
            
            // Копируем в буфер обмена
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(phoneNumber).then(() => {
                    showNotification('Номер телефона скопирован в буфер обмена');
                }).catch(() => {
                    // Fallback для старых браузеров
                    copyToClipboardFallback(phoneNumber);
                });
            } else {
                copyToClipboardFallback(phoneNumber);
            }
        });
    }
    
    // Fallback для копирования в старых браузерах
    function copyToClipboardFallback(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('Номер телефона скопирован в буфер обмена');
        } catch (err) {
            console.error('Ошибка копирования:', err);
        }
        
        document.body.removeChild(textArea);
    }
    
    // Показ уведомлений
    function showNotification(message) {
        // Удаляем существующие уведомления
        const existingNotification = document.querySelector('.copy-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Удаление через 3 секунды
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Анимация элементов при прокрутке
    function animateOnScroll() {
        const elements = document.querySelectorAll('.timeline-item, .portfolio-item, .service-card');
        
        elements.forEach(element => {
            if (element.classList.contains('visible')) return;
            
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            const windowHeight = window.innerHeight;
            const scrollTop = window.pageYOffset;
            
            if (scrollTop + windowHeight > elementTop + elementHeight / 4) {
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    element.classList.add('visible');
                }, delay);
            }
        });
    }
    
    // Инициализация активной секции при загрузке
    highlightCurrentSection();
    
    // Запуск анимации при загрузке
    animateOnScroll();
    
    // Взаимодействие с портфолио
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        // Показываем уведомление только для элементов без обработчика
        if (!item.hasAttribute('onclick')) {
            item.addEventListener('click', function() {
                const projectTitle = this.querySelector('.portfolio-title').textContent;
                showNotification(`Подробности проекта "${projectTitle}" скоро будут доступны`);
            });
        }
    });
    
    // Обработка внешних ссылок
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Добавляем небольшую задержку для лучшего UX
            const linkText = this.textContent.trim();
            if (linkText.includes('портфолио') || linkText.includes('Behance')) {
                showNotification('Открываем портфолио в новой вкладке...');
            }
        });
    });
    
    // Обработка кликов по услугам
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('click', function() {
            const serviceTitle = this.querySelector('.service-title').textContent;
            showNotification(`Подробности об услуге "${serviceTitle}" можно узнать по телефону или email`);
        });
    });
    
    // Плавное появление статистики
    const stats = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        stats.forEach(stat => {
            const targetNumber = parseInt(stat.textContent.replace('+', ''));
            const isPercent = stat.textContent.includes('%');
            const hasPlus = stat.textContent.includes('+');
            
            let currentNumber = 0;
            const increment = targetNumber / 50;
            
            const timer = setInterval(() => {
                currentNumber += increment;
                
                if (currentNumber >= targetNumber) {
                    currentNumber = targetNumber;
                    clearInterval(timer);
                }
                
                let displayNumber = Math.floor(currentNumber);
                if (hasPlus) displayNumber += '+';
                if (isPercent) displayNumber += '%';
                
                stat.textContent = displayNumber;
            }, 30);
        });
    }
    
    // Запуск анимации статистики при скролле до секции "О себе"
    const aboutSection = document.querySelector('#about');
    let statsAnimated = false;
    
    function checkStatsAnimation() {
        if (statsAnimated) return;
        
        const aboutTop = aboutSection.offsetTop;
        const aboutHeight = aboutSection.offsetHeight;
        const scrollTop = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        if (scrollTop + windowHeight > aboutTop + aboutHeight / 2) {
            animateStats();
            statsAnimated = true;
        }
    }
    
    window.addEventListener('scroll', checkStatsAnimation);
    
    // Проверяем сразу при загрузке
    checkStatsAnimation();
    
    // Обработка контактных форм и email
    const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
    
    emailLinks.forEach(link => {
        link.addEventListener('click', function() {
            showNotification('Открываем почтовый клиент...');
        });
    });
    
    // Добавляем обработчик для ESC (закрытие уведомлений)
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const notifications = document.querySelectorAll('.copy-notification');
            notifications.forEach(notification => {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            });
        }
    });
    
    // Добавляем плавный скролл для всех внутренних якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Улучшенная обработка resize для оптимизации
    let resizeTimeout;
    
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Пересчитываем позиции при изменении размера окна
            highlightCurrentSection();
            animateOnScroll();
        }, 250);
    });
    
    // Preload для улучшения производительности
    const preloadImages = () => {
        const images = ['favicon.svg'];
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    };
    
    preloadImages();
    
    // Accessibility improvements
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });
    
    document.addEventListener('mousedown', function() {
        document.body.classList.remove('keyboard-navigation');
    });
    
    // Добавляем стили для keyboard navigation
    const style = document.createElement('style');
    style.textContent = `
        .keyboard-navigation *:focus {
            outline: 2px solid #1a1a1a;
            outline-offset: 2px;
        }
        
        .keyboard-navigation .nav-link:focus,
        .keyboard-navigation .contact-link:focus,
        .keyboard-navigation .portfolio-link:focus {
            outline: 2px solid #1a1a1a;
            outline-offset: 4px;
        }
    `;
    document.head.appendChild(style);
    
    console.log('Сайт-визитка Роговой Кристины загружен успешно!');
});

// Mobile Menu Functions
function toggleMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const overlay = document.getElementById('nav-overlay');
    
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
    overlay.classList.toggle('active');
    
    // Prevent body scroll when menu is open
    if (navLinks.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function closeMobileMenu() {
    const navLinks = document.getElementById('nav-links');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const overlay = document.getElementById('nav-overlay');
    
    navLinks.classList.remove('active');
    menuToggle.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Project Modal Functions
function showProjectDetails(projectName, year) {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalYear = document.getElementById('modal-year');
    
    modalTitle.textContent = projectName;
    modalYear.textContent = `Год завершения: ${year}`;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Close modal on background click
    modal.onclick = function(e) {
        if (e.target === modal) {
            closeProjectModal();
        }
    };
}

function closeProjectModal() {
    const modal = document.getElementById('project-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Enhanced touch interactions for mobile
if ('ontouchstart' in window) {
    // Add touch-friendly classes
    document.body.classList.add('touch-device');
    
    // Enhanced portfolio item interactions
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        let touchStartY = 0;
        
        item.addEventListener('touchstart', function(e) {
            touchStartY = e.touches[0].clientY;
            this.style.transform = 'translateY(-2px)';
        });
        
        item.addEventListener('touchend', function(e) {
            this.style.transform = '';
            
            // Check if it was a tap (not a scroll)
            const touchEndY = e.changedTouches[0].clientY;
            if (Math.abs(touchEndY - touchStartY) < 10) {
                // Trigger click event
                this.click();
            }
        });
    });
}

// Close mobile menu when clicking on links
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('nav-link')) {
        setTimeout(closeMobileMenu, 100);
    }
});

// Close mobile menu on escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeMobileMenu();
        closeProjectModal();
    }
});

// Improved scroll behavior for mobile
let lastScrollY = window.scrollY;
const header = document.querySelector('.header');

window.addEventListener('scroll', function() {
    const currentScrollY = window.scrollY;
    
    // Auto-close mobile menu on scroll
    if (Math.abs(currentScrollY - lastScrollY) > 50) {
        closeMobileMenu();
    }
    
    lastScrollY = currentScrollY;
});

// Add haptic feedback for supported devices
function addHapticFeedback(element) {
    if (navigator.vibrate && 'ontouchstart' in window) {
        element.addEventListener('touchstart', function() {
            navigator.vibrate(10); // Very light haptic feedback
        });
    }
}

// Apply haptic feedback to interactive elements
const interactiveElements = document.querySelectorAll('.portfolio-item, .service-card, .nav-link, .btn');
interactiveElements.forEach(addHapticFeedback); 
if (typeof module !== "undefined") {
    module.exports = { toggleMobileMenu, closeMobileMenu };
}

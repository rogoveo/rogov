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
        ticking = false;
    }
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    });
    
    // Копирование контактов в буфер обмена
    const contactLinks = document.querySelectorAll('.contact-link');
    
    contactLinks.forEach(link => {
        // Для телефонных номеров добавляем возможность копирования
        if (link.href.startsWith('tel:')) {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const phoneNumber = this.textContent;
                
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
    });
    
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
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--black);
            color: var(--white);
            padding: 1rem 1.5rem;
            border-radius: 4px;
            font-size: 0.9rem;
            z-index: 1000;
            opacity: 0;
            transform: translateY(-20px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Анимация появления
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 100);
        
        // Удаление через 3 секунды
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Инициализация активной секции при загрузке
    highlightCurrentSection();
    
    // Взаимодействие с портфолио
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        item.addEventListener('click', function() {
            const projectTitle = this.querySelector('h3').textContent;
            showNotification(`Подробности проекта "${projectTitle}" скоро будут доступны`);
        });
    });
    
    // Добавляем стили для активной навигации
    const style = document.createElement('style');
    style.textContent = `
        .nav-link.active {
            color: var(--black);
        }
        
        .nav-link.active::after {
            width: 100%;
        }
        
        .notification {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        @media (max-width: 768px) {
            .notification {
                right: 10px;
                left: 10px;
                text-align: center;
            }
        }
        
        /* Анимация для таймлайна */
        .timeline-item {
            opacity: 0;
            transform: translateX(-20px);
            animation: fadeInLeft 0.6s ease forwards;
        }
        
        .timeline-item:nth-child(1) { animation-delay: 0.1s; }
        .timeline-item:nth-child(2) { animation-delay: 0.2s; }
        .timeline-item:nth-child(3) { animation-delay: 0.3s; }
        .timeline-item:nth-child(4) { animation-delay: 0.4s; }
        
        @keyframes fadeInLeft {
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        /* Анимация для портфолио */
        .portfolio-item {
            opacity: 0;
            transform: translateY(20px);
            animation: fadeInUp 0.6s ease forwards;
        }
        
        .portfolio-item:nth-child(1) { animation-delay: 0.1s; }
        .portfolio-item:nth-child(2) { animation-delay: 0.2s; }
        .portfolio-item:nth-child(3) { animation-delay: 0.3s; }
        .portfolio-item:nth-child(4) { animation-delay: 0.4s; }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (prefers-reduced-motion: reduce) {
            .timeline-item,
            .portfolio-item {
                animation: none;
                opacity: 1;
                transform: none;
            }
        }
    `;
    document.head.appendChild(style);
}); 
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Navigation functionality
    const navLinks = document.querySelectorAll('.navbar a');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all sections and links
            sections.forEach(section => section.classList.remove('active'));
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            
            // Add active class to clicked link and corresponding section
            this.classList.add('active');
            const targetSection = document.querySelector(this.getAttribute('href'));
            targetSection.classList.add('active');
            
            // Scroll to top of section
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    });
    
    // Default to showing home section
    document.querySelector('.navbar a[href="#about"]').classList.add('active');
    document.getElementById('about').classList.add('active');
    
    // Form submission handlers
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Form submitted successfully! (This is a demo)');
            if(form.id !== 'booking-form') {
                this.reset();
            }
        });
    });
    
    // Initialize date picker with current date
    const dateInput = document.getElementById('date');
    if(dateInput) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        dateInput.value = `${yyyy}-${mm}-${dd}`;
    }
    
    // Initialize time pickers
    const timeStart = document.getElementById('time-start');
    const timeEnd = document.getElementById('time-end');
    if(timeStart && timeEnd) {
        timeStart.value = '09:00';
        timeEnd.value = '17:00';
    }
});

////////////////////////////////////////////////
//menu
////////////////////////////////////////////////
//menu
////////////////////////////////////////////////
//menu
////////////////////////////////////////////////
//menu
////////////////////////////////////////////////
//menu

const toggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');
const body = document.body;

toggle.addEventListener('click', () => {
  // Toggle menu and overlay
  toggle.classList.toggle('active');
  navMenu.classList.toggle('active');
  body.classList.toggle('menu-open');
});

navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    
    // Close menu immediately
    toggle.classList.remove('active');
    navMenu.classList.remove('active');
    body.classList.remove('menu-open');
    
    // Scroll to target after a small delay
    setTimeout(() => {
      document.querySelector(targetId).scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navMenu.contains(e.target) && !toggle.contains(e.target)) {
    toggle.classList.remove('active');
    navMenu.classList.remove('active');
    body.classList.remove('menu-open');
  }
});


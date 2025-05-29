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
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link (for mobile)
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  });

////////////////////////////////////////////////
const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending...';

  try {
    // Use MODE parameter to bypass CORS in development
    const scriptUrl = 'https://script.google.com/macros/s/AKfycby1JFmkeVLF3eicJSL7fmi8RHKEIjzcx_0UClPj1Ky_KWPnyg6rOumxmjcOmxJe_uwu/exec' + '?mode=cors';
    
    const response = await fetch(scriptUrl, {
      method: 'POST',
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value
      }),
      headers: { 
        'Content-Type': 'application/json'
      },
      mode: 'cors'
    });

    if (!response.ok) throw new Error('Network response was not ok');
    
    const result = await response.json();
    
    if (result.success) {
      alert('Submission successful!');
      form.reset();
    } else {
      throw new Error(result.error || 'Unknown error');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error: ' + error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});
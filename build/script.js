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
    const sheetBestUrl = 'https://api.sheetbest.com/sheets/b2d6ae54-ba92-4b77-8e72-00bab938d36c';

    const response = await fetch(sheetBestUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value
      }),
    });

    if (!response.ok) throw new Error('Network response was not ok');

    alert('Submission successful!');
    form.reset();

  } catch (error) {
    console.error('Error:', error);
    alert('Error: ' + error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});
///////////////////////////////
document.querySelector('.booking-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  // Get checkbox values as comma-separated string
  const cleanItems = Array.from(document.querySelectorAll('input[name="clean-item"]:checked'))
    .map(checkbox => checkbox.value)
    .join(', ');
  
  // Prepare form data
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('country-code').value + document.getElementById('phone').value,
    postcode: document.getElementById('postcode').value,
    parking: document.querySelector('input[name="parking"]:checked')?.value,
    floor: document.querySelector('input[name="floor"]:checked')?.value,
    rooms: document.getElementById('rooms').value,
    fabric: document.querySelector('input[name="fabric"]:checked')?.value,
    photos: document.getElementById('photos').files.length > 0 ? 'Yes' : 'No',
    staircase: document.querySelector('input[name="staircase"]:checked')?.value,
    hallway: document.querySelector('input[name="hallway"]:checked')?.value,
    spots: document.querySelector('input[name="spots"]:checked')?.value,
    date: document.getElementById('date').value,
    time_start: document.getElementById('time-start').value,
    time_end: document.getElementById('time-end').value,
    clean_items: cleanItems,
    comments: document.getElementById('comments').value
  };
  
  try {
    const response = await fetch('https://api.sheetbest.com/sheets/ad78c122-5604-4825-857d-6a29d99dac37', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    if (response.ok) {
      alert('Booking submitted successfully! We will contact you shortly.');
      this.reset();
    } else {
      throw new Error('Failed to submit booking');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('There was an error submitting your booking. Please try again or contact us directly.');
  }
});
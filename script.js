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

////////////////////////////////////////////////
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
    phone: document.getElementById('phone').value,
    postcode: document.getElementById('postcode').value,
    parking: document.querySelector('input[name="parking"]:checked')?.value,
    floor: document.querySelector('input[name="floor"]:checked')?.value,
    rooms: document.getElementById('rooms').value,
    fabric: document.querySelector('input[name="fabric"]:checked')?.value,
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

///////////////////
///////PAYMENT/////////////////
///////////////////
///////PAYMENT/////////////////
///////////////////
///////PAYMENT/////////////////
///////////////////
///////PAYMENT/////////////////
///////////////////
///////PAYMENT/////////////////
///////////////////
///////PAYMENT/////////////////
///////////////////
///////PAYMENT/////////////////

const paymentConfig = {
  currency: 'USD',
  amount: 10.00,
  stripePublicKey: 'pk_test_your_stripe_key',
  paypalClientId: 'your_paypal_client_id'
};

// DOM Elements
let stripe, card, cardExpiry, cardCvc;

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
  // Set up tab switching
  setupTabs();
  
  // Initialize payment methods
  initPayPal();
  initStripe();
});

function setupTabs() {
  const tabs = document.querySelectorAll('.tab-button');
  tabs.forEach(tab => {
      tab.addEventListener('click', () => {
          // Remove active class from all tabs and contents
          document.querySelectorAll('.tab-button').forEach(t => t.classList.remove('active'));
          document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          
          // Add active class to clicked tab
          tab.classList.add('active');
          const tabId = tab.getAttribute('data-tab') + '-tab';
          document.getElementById(tabId).classList.add('active');
      });
  });
}

// PayPal Integration
function initPayPal() {
  const script = document.createElement('script');
  script.src = `https://www.paypal.com/sdk/js?client-id=${paymentConfig.paypalClientId}&currency=${paymentConfig.currency}`;
  script.onload = function() {
      paypal.Buttons({
          style: {
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'paypal',
              height: 40
          },
          createOrder: function(data, actions) {
              return actions.order.create({
                  purchase_units: [{
                      amount: {
                          value: paymentConfig.amount.toFixed(2),
                          breakdown: {
                              item_total: {
                                  value: paymentConfig.amount.toFixed(2),
                                  currency_code: paymentConfig.currency
                              }
                          }
                      },
                      items: [{
                          name: "Your Product",
                          unit_amount: {
                              value: paymentConfig.amount.toFixed(2),
                              currency_code: paymentConfig.currency
                          },
                          quantity: "1"
                      }]
                  }]
              });
          },
          onApprove: function(data, actions) {
              return actions.order.capture().then(function(details) {
                  showPaymentSuccess({
                      method: 'PayPal',
                      id: details.id,
                      email: details.payer.email_address,
                      amount: paymentConfig.amount
                  });
              });
          },
          onError: function(err) {
              showPaymentError(err);
          }
      }).render('#paypal-button-container');
  };
  document.body.appendChild(script);
}

// Stripe Integration (simulated)
function initStripe() {
  const script = document.createElement('script');
  script.src = 'https://js.stripe.com/v3/';
  script.onload = function() {
      stripe = Stripe(paymentConfig.stripePublicKey);
      const elements = stripe.elements();
      
      // Custom styling for elements
      const style = {
          base: {
              color: '#32325d',
              fontFamily: '"Roboto", sans-serif',
              fontSmoothing: 'antialiased',
              fontSize: '16px',
              '::placeholder': {
                  color: '#aab7c4'
              }
          },
          invalid: {
              color: '#e74c3c',
              iconColor: '#e74c3c'
          }
      };
      
      // Create card elements
      card = elements.create('cardNumber', { style: style });
      card.mount('#card-element');
      
      cardExpiry = elements.create('cardExpiry', { style: style });
      cardExpiry.mount('#card-expiry');
      
      cardCvc = elements.create('cardCvc', { style: style });
      cardCvc.mount('#card-cvc');
      
      // Handle real-time validation errors
      card.addEventListener('change', showCardError);
      cardExpiry.addEventListener('change', showCardError);
      cardCvc.addEventListener('change', showCardError);
      
      // Handle form submission
      const form = document.getElementById('payment-form');
      form.addEventListener('submit', handleStripeSubmit);
  };
  document.body.appendChild(script);
}

function showCardError(event) {
  const displayError = document.getElementById('card-errors');
  if (event.error) {
      displayError.textContent = event.error.message;
  } else {
      displayError.textContent = '';
  }
}

async function handleStripeSubmit(event) {
  event.preventDefault();
  
  const submitButton = document.getElementById('submit-button');
  const buttonText = submitButton.querySelector('.button-text');
  const buttonLoader = submitButton.querySelector('.button-loader');
  
  // Show loading state
  buttonText.style.display = 'none';
  buttonLoader.style.display = 'block';
  submitButton.disabled = true;
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Create fake payment method (in real app, this would be stripe.createPaymentMethod)
  const fakePaymentMethod = {
      id: 'pm_' + Math.random().toString(36).substr(2, 10),
      card: {
          brand: 'visa',
          last4: '4242'
      }
  };
  
  // Simulate 20% chance of failure for demo purposes
  if (Math.random() < 0.2) {
      showPaymentError({
          message: "Your card was declined. Please try another payment method."
      });
  } else {
      showPaymentSuccess({
          method: 'Card',
          id: fakePaymentMethod.id,
          last4: fakePaymentMethod.card.last4,
          brand: fakePaymentMethod.card.brand,
          amount: paymentConfig.amount
      });
  }
  
  // Reset button state
  buttonText.style.display = 'block';
  buttonLoader.style.display = 'none';
  submitButton.disabled = false;
}

function showPaymentSuccess(data) {
  // In a real app, you would redirect to a thank you page or show a success message
  console.log('Payment successful:', data);
  
  // Create success display
  const successHTML = `
      <div class="payment-success">
          <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12S6.5 22 12 22 22 17.5 22 12 17.5 2 12 2M10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" />
          </svg>
          <h2>Payment Successful!</h2>
          <p>Thank you for your purchase of $${data.amount.toFixed(2)}</p>
          <p>Transaction ID: ${data.id}</p>
          <button class="payment-button" onclick="window.location.href='/'">Continue Shopping</button>
      </div>
  `;
  
  // Replace payment form with success message
  const container = document.querySelector('.checkout-container');
  container.innerHTML = successHTML;
}

function showPaymentError(error) {
  const errorElement = document.getElementById('card-errors');
  errorElement.textContent = error.message;
  errorElement.style.display = 'block';
  
  // Scroll to error
  errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  
  // Shake animation for error
  errorElement.style.animation = 'shake 0.5s';
  setTimeout(() => {
      errorElement.style.animation = '';
  }, 500);
}

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-5px); }
      40%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);
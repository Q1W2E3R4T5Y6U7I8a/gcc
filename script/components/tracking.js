
let My_URL_Script = "https://script.google.com/macros/s/AKfycbx8tkvVUys5aoRKt478Z70yb1uLKXtUkERHAYjlgoJXapP-IZKfkBmKFPL0mETAYkK92A/exec";

async function safeFetch(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    return { success: true };
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}

// Corrected: Pass the URL string directly, not as an object
safeFetch(My_URL_Script, {
  type: "visit",
  userAgent: navigator.userAgent
}).then(response => {
  console.log("Success:", response);
}).catch(error => {
  console.error("Error:", error);
});

// Corrected: Pass the URL string directly
fetch(My_URL_Script, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    type: "visit",
    userAgent: navigator.userAgent,
    referrer: document.referrer || "direct"
  })
}).catch(e => console.log("Visit logged"));

// Contact form - make sure this element exists in your HTML
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      await fetch(My_URL_Script, {
        method: "POST",
        mode: 'no-cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.value,
          email: form.email.value,
          phone: form.phone.value
        })
      });
      alert("Sent!");
      form.reset();
    } catch {
      alert("Error - try again later");
    } finally {
      btn.disabled = false;
    }
  });
}

// Booking form - make sure this element exists in your HTML
const bookingForm = document.getElementById('booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      const formData = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        phone: form.querySelector('#phone').value,
        postcode: form.querySelector('#postcode').value,
        parking: form.querySelector('input[name="parking"]:checked')?.value || 'Not specified',
        floor: form.querySelector('input[name="floor"]:checked')?.value || 'Not specified',
        rooms: form.querySelector('#rooms').value,
        fabric: form.querySelector('input[name="fabric"]:checked')?.value || 'Not specified',
        staircase: form.querySelector('input[name="staircase"]:checked')?.value || 'Not specified',
        hallway: form.querySelector('input[name="hallway"]:checked')?.value || 'Not specified',
        spots: form.querySelector('input[name="spots"]:checked')?.value || 'Not specified',
        date: form.querySelector('#date').value,
        time_start: formatTime(form.querySelector('#time-start').value),
        time_end: formatTime(form.querySelector('#time-end').value),
        clean_items: Array.from(form.querySelectorAll('input[name="clean-item"]:checked'))
                      .map(checkbox => checkbox.value).join(', ') || 'None selected',
        comments: form.querySelector('#comments').value || 'No comments'
      };

      // Use the same URL and configuration as other forms
      await fetch(My_URL_Script, {
        method: "POST",
        mode: 'no-cors', // Add this line to match other forms
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      alert("Booking request sent successfully!");
      form.reset();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Error submitting booking - please try again or contact us directly");
    } finally {
      btn.disabled = false;
    }
  });
}
function formatTime(time) {
  return time ? new Date(`1970-01-01T${time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '';
}

// Check if elements exist before trying to modify them
document.addEventListener('DOMContentLoaded', function() {
  const element = document.getElementById('some-element');
  if (element) {
    element.textContent = 'Some content';
  }
});

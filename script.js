//1 before-after
document.addEventListener('DOMContentLoaded', function() {
  class ImageComparator {
    constructor(container) {
      this.container = container;
      this.beforeImage = container.querySelector('.before');
      this.afterImage = container.querySelector('.after');
      this.divider = container.querySelector('.divider');
      this.dragging = false;
      this.animationFrame = null;
      this.resizeObserver = null;
      
      this.init();
    }
    
    init() {
      this.setInitialPosition();
      this.divider.addEventListener('mousedown', this.startDrag.bind(this));
      document.addEventListener('mousemove', this.handleDrag.bind(this));
      document.addEventListener('mouseup', this.stopDrag.bind(this));
      this.divider.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
      document.addEventListener('touchmove', this.handleTouchDrag.bind(this), { passive: false });
      document.addEventListener('touchend', this.stopDrag.bind(this));
      window.addEventListener('resize', this.handleResize.bind(this));
      this.setupResizeObserver();
      
      this.divider.style.transition = 'left 0.1s ease-out';
      this.afterImage.style.transition = 'clip-path 0.1s ease-out';
      
      this.container.setAttribute('tabindex', '0');
      this.container.addEventListener('keydown', this.handleKeyPress.bind(this));
    }
    
    setInitialPosition() {
      const containerWidth = this.container.offsetWidth;
      const initialPosition = containerWidth / 2;
      this.updateDividerPosition(initialPosition);
    }
    
    startDrag(e) {
      e.preventDefault();
      this.dragging = true;
      this.divider.style.transition = 'none';
      this.afterImage.style.transition = 'none';
      this.container.classList.add('dragging');
    }
    
    handleDrag(e) {
      if (!this.dragging) return;
      this.cancelAnimation();
      
      this.animationFrame = requestAnimationFrame(() => {
        const containerRect = this.container.getBoundingClientRect();
        const posX = e.clientX - containerRect.left;
        this.updateDividerPosition(posX);
      });
    }
    
    handleTouchDrag(e) {
      if (!this.dragging || !e.touches || e.touches.length === 0) return;
      e.preventDefault();
      this.cancelAnimation();
      
      this.animationFrame = requestAnimationFrame(() => {
        const containerRect = this.container.getBoundingClientRect();
        const touch = e.touches[0];
        const posX = touch.clientX - containerRect.left;
        this.updateDividerPosition(posX);
      });
    }
    
    stopDrag() {
      if (!this.dragging) return;
      this.dragging = false;
      this.divider.style.transition = 'left 0.2s ease-out';
      this.afterImage.style.transition = 'clip-path 0.2s ease-out';
      this.container.classList.remove('dragging');
      this.cancelAnimation();
    }
    
    updateDividerPosition(posX) {
      const containerWidth = this.container.offsetWidth;
      const constrainedX = Math.max(0, Math.min(posX, containerWidth));
      const percentage = (constrainedX / containerWidth) * 100;
      
      this.divider.style.left = `${percentage}%`;
      this.afterImage.style.clipPath = `inset(0 0 0 ${percentage}%)`;
      this.divider.setAttribute('aria-valuenow', Math.round(percentage));
      this.divider.setAttribute('aria-valuetext', `${Math.round(percentage)}% comparison`);
    }
    
    handleResize() {
      this.cancelAnimation();
      this.animationFrame = requestAnimationFrame(() => {
        const currentPercentage = parseFloat(this.divider.style.left) || 50;
        const containerWidth = this.container.offsetWidth;
        const newPosition = (containerWidth * currentPercentage) / 100;
        this.updateDividerPosition(newPosition);
      });
    }
    
    setupResizeObserver() {
      this.resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          if (entry.target === this.container) {
            this.handleResize();
          }
        }
      });
      
      this.resizeObserver.observe(this.container);
    }
    
    handleKeyPress(e) {
      const currentPosition = parseFloat(this.divider.style.left) || 50;
      const containerWidth = this.container.offsetWidth;
      const step = containerWidth / 20; // 5% steps
      
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          this.updateDividerPosition(currentPosition - step);
          break;
        case 'ArrowRight':
          e.preventDefault();
          this.updateDividerPosition(currentPosition + step);
          break;
        case 'Home':
          e.preventDefault();
          this.updateDividerPosition(0);
          break;
        case 'End':
          e.preventDefault();
          this.updateDividerPosition(containerWidth);
          break;
      }
    }
    
    cancelAnimation() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
        this.animationFrame = null;
      }
    }
    
    destroy() {
      this.divider.removeEventListener('mousedown', this.startDrag);
      document.removeEventListener('mousemove', this.handleDrag);
      document.removeEventListener('mouseup', this.stopDrag);
      this.divider.removeEventListener('touchstart', this.startDrag);
      document.removeEventListener('touchmove', this.handleTouchDrag);
      document.removeEventListener('touchend', this.stopDrag);
      window.removeEventListener('resize', this.handleResize);
      this.container.removeEventListener('keydown', this.handleKeyPress);
      
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    }
  }
  
  const comparisonBoxes = document.querySelectorAll('.comparison-box');
  const comparators = [];
  
  comparisonBoxes.forEach(box => {

    box.setAttribute('role', 'figure');
    box.setAttribute('aria-label', 'Image comparison slider');
    
    const divider = box.querySelector('.divider');
    divider.setAttribute('role', 'slider');
    divider.setAttribute('aria-valuemin', '0');
    divider.setAttribute('aria-valuemax', '100');
    divider.setAttribute('aria-valuenow', '50');
    divider.setAttribute('aria-label', 'Image comparison slider handle');
    divider.setAttribute('tabindex', '0');
    
    comparators.push(new ImageComparator(box));
  });

  window.addEventListener('beforeunload', () => {
    comparators.forEach(comparator => comparator.destroy());
  });
});

 // 2. menu
  document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');
  const body = document.body;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    body.classList.toggle('menu-open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');

      if (!targetId.startsWith('#')) {
        return; 
      }

      e.preventDefault();
      toggle.classList.remove('active');
      navMenu.classList.remove('active');
      body.classList.remove('menu-open');

      setTimeout(() => {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    });
  });


  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggle.contains(e.target)) {
      toggle.classList.remove('active');
      navMenu.classList.remove('active');
      body.classList.remove('menu-open');
    }
  });
});

// 3. analytics

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

//
//4. analytics
//
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Simple Tracker] Initializing...');

  // Configuration
  const config = {
    endpoint: 'https://script.google.com/macros/s/AKfycbyCFbNgVwMoZoGaxX9DEcioVIrU1-ZF2lzF8oB9VMo1u2wz5hbUPCNuBKIm58eGSyyayw/exec',
    sessionTimeout: 1800000, // 30 minutes
    debug: true
  };

  // State management
  const state = {
    sessionStart: Date.now(),
    lastActivity: Date.now(),
    sessionEnded: false,
    clickCount: 0,
    maxScrollDepth: 0,
    ip: 'unknown'
  };

  if (config.debug) {
    console.log('[Simple Tracker] Session started at:', new Date(state.sessionStart).toISOString());
  }

  // Get IP address
  fetch('https://api.ipify.org?format=json')
    .then(res => res.json())
    .then(json => {
      state.ip = json.ip;
      if (config.debug) console.log('[Simple Tracker] IP fetched:', state.ip);
    })
    .catch(() => {
      if (config.debug) console.warn('[Simple Tracker] Failed to fetch IP');
    });

  // Collect essential data
  const getSessionData = () => ({
    timestamp: new Date().toISOString(),
    pageUrl: window.location.href,
    screen: `${window.screen.width}x${window.screen.height}`,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    duration: Math.round((Date.now() - state.sessionStart) / 1000),
    userAgent: navigator.userAgent,
    clickCount: state.clickCount,
    scrollDepth: Math.round(state.maxScrollDepth),
    ip: state.ip
  });

  // Activity tracking
  const updateActivity = () => {
    state.lastActivity = Date.now();
  };

  // Click counter
  document.addEventListener('click', () => {
    state.clickCount++;
    if (config.debug) {
      console.log(`[Simple Tracker] Click detected, total: ${state.clickCount}`);
    }
  });

  // Scroll depth tracker
  const trackScrollDepth = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;
    
    const percentage = (window.scrollY / scrollHeight) * 100;
    if (percentage > state.maxScrollDepth) {
      state.maxScrollDepth = percentage;
      if (config.debug) {
        console.log(`[Simple Tracker] New max scroll depth: ${Math.round(percentage)}%`);
      }
    }
  };

  // Setup activity listeners
  ['mousemove', 'keydown', 'scroll', 'click'].forEach(event => {
    window.addEventListener(event, updateActivity, { passive: true });
  });

  // Add scroll listener
  window.addEventListener('scroll', trackScrollDepth, { passive: true });

  if (config.debug) {
    console.log('[Simple Tracker] Activity listeners registered');
  }

  // End session handler
const endSession = () => {
  if (state.sessionEnded) return;
  state.sessionEnded = true;

  const data = getSessionData();
  const payload = JSON.stringify(data);

  try {
    const sent = navigator.sendBeacon(config.endpoint, payload);
    if (config.debug) {
      console.log(sent ? '[Simple Tracker] Data sent with sendBeacon' : '[Simple Tracker] sendBeacon failed');
    }
  } catch (e) {
    if (config.debug) console.warn('[Simple Tracker] Data send failed:', e);
  }
};


  // Check for session timeout
  const checkSession = () => {
    const inactiveTime = Date.now() - state.lastActivity;
    if (config.debug) {
      console.log('[Simple Tracker] Inactive for', Math.round(inactiveTime/1000), 'seconds');
    }
    
    if (inactiveTime > config.sessionTimeout && !state.sessionEnded) {
      if (config.debug) console.log('[Simple Tracker] Session timeout reached');
      endSession();
    }
  };
  
  // Send session data function
  window.sendSessionData = async () => {
    const data = getSessionData();
    
    try {
      // Try JSONP method
      await new Promise((resolve, reject) => {
        const callbackName = `jsonp_${Math.random().toString(36).slice(2, 11)}`;
        const script = document.createElement('script');
        
        window[callbackName] = (response) => {
          delete window[callbackName];
          document.body.removeChild(script);
          response.status === 'success' ? resolve() : reject(new Error(response.message || 'JSONP failed'));
        };

        const params = new URLSearchParams({
          data: JSON.stringify(data),
          callback: callbackName
        });
        
        script.src = `${config.endpoint}?${params}`;
        script.onerror = () => {
          delete window[callbackName];
          document.body.removeChild(script);
          reject(new Error('JSONP request failed'));
        };
        
        document.body.appendChild(script);
      });
      if (config.debug) console.log('[Simple Tracker] Data sent via JSONP');
    } catch (jsonpError) {
     if (config.debug) console.warn('[Simple Tracker] JSONP failed, no fallback due to CORS');
    }
  };

  // Check session periodically
  const checkInterval = setInterval(checkSession, 60000);
  
  // Handle page exit
  const handlePageExit = () => {
    if (config.debug) console.log('[Simple Tracker] Page exit detected');
    clearInterval(checkInterval);
    endSession();
  };

  window.addEventListener('beforeunload', handlePageExit);
  window.addEventListener('pagehide', handlePageExit);

  // Initial session check
  setTimeout(checkSession, config.sessionTimeout);

  if (config.debug) {
    console.log('[Simple Tracker] Initialization complete');
  }
});
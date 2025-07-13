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
      // Set initial positions
      this.setInitialPosition();
      
      // Mouse events
      this.divider.addEventListener('mousedown', this.startDrag.bind(this));
      document.addEventListener('mousemove', this.handleDrag.bind(this));
      document.addEventListener('mouseup', this.stopDrag.bind(this));
      
      // Touch events
      this.divider.addEventListener('touchstart', this.startDrag.bind(this), { passive: false });
      document.addEventListener('touchmove', this.handleTouchDrag.bind(this), { passive: false });
      document.addEventListener('touchend', this.stopDrag.bind(this));
      
      // Handle window resize
      window.addEventListener('resize', this.handleResize.bind(this));
      
      // Set up ResizeObserver for container changes
      this.setupResizeObserver();
      
      // Add transition for smooth movement
      this.divider.style.transition = 'left 0.1s ease-out';
      this.afterImage.style.transition = 'clip-path 0.1s ease-out';
      
      // Add keyboard support
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
      
      // Update ARIA values for accessibility
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
      // Clean up event listeners
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
  
  // Initialize all comparison boxes on the page
  const comparisonBoxes = document.querySelectorAll('.comparison-box');
  const comparators = [];
  
  comparisonBoxes.forEach(box => {
    // Set up accessibility attributes
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
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    comparators.forEach(comparator => comparator.destroy());
  });
});
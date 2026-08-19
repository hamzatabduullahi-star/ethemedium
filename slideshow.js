/* ============================================
   ETHMEDIUM — SLIDESHOW
   ============================================ */

// ===== VARIABLES =====
let slideIndex = 1;
let slideTimer;
let isPaused = false;

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', function() {
    // Show first slide
    showSlides(slideIndex);
    
    // Start auto-slide
    startAutoSlide();
    
    // Add event listeners for pause on hover
    const container = document.querySelector('.slideshow-container');
    if (container) {
        container.addEventListener('mouseenter', pauseAutoSlide);
        container.addEventListener('mouseleave', resumeAutoSlide);
        
        // Touch support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        container.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        container.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    changeSlide(1); // Swipe left -> next
                } else {
                    changeSlide(-1); // Swipe right -> previous
                }
            }
        }
    }
});

// ===== CORE FUNCTIONS =====

/**
 * Change slide by n (next/previous)
 */
function changeSlide(n) {
    clearTimeout(slideTimer);
    showSlides(slideIndex += n);
    if (!isPaused) {
        startAutoSlide();
    }
}

/**
 * Go to specific slide number
 */
function currentSlide(n) {
    clearTimeout(slideTimer);
    showSlides(slideIndex = n);
    if (!isPaused) {
        startAutoSlide();
    }
}

/**
 * Show the slide at index n
 */
function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    const dots = document.getElementsByClassName("dot");
    
    // Handle boundary conditions
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
        slides[i].style.opacity = "0";
    }
    
    // Remove active class from all dots
    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    
    // Show current slide with fade effect
    const currentSlide = slides[slideIndex - 1];
    if (currentSlide) {
        currentSlide.style.display = "flex";
        // Small delay for fade effect
        setTimeout(() => {
            currentSlide.style.opacity = "1";
        }, 50);
    }
    
    // Activate current dot
    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].className += " active";
    }
}

/**
 * Start auto-sliding every 5 seconds
 */
function startAutoSlide() {
    clearTimeout(slideTimer);
    slideTimer = setTimeout(() => {
        if (!isPaused) {
            changeSlide(1);
        } else {
            // If paused, check again in 1 second
            slideTimer = setTimeout(() => {
                if (!isPaused) {
                    changeSlide(1);
                }
            }, 1000);
        }
    }, 5000);
}

/**
 * Pause auto-slide (on hover/touch)
 */
function pauseAutoSlide() {
    isPaused = true;
    clearTimeout(slideTimer);
}

/**
 * Resume auto-slide (on hover/touch end)
 */
function resumeAutoSlide() {
    isPaused = false;
    clearTimeout(slideTimer);
    startAutoSlide();
}

// ===== KEYBOARD SUPPORT =====
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
        changeSlide(-1);
        e.preventDefault();
    } else if (e.key === 'ArrowRight') {
        changeSlide(1);
        e.preventDefault();
    }
});

// ===== CONSOLE LOG =====
console.log('🔮 Ethemedium Slideshow — Active, love! ❤️');
console.log('✨ Auto-sliding every 5 seconds');
console.log('🖱️ Hover to pause, swipe or click arrows to navigate');

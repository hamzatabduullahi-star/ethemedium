/* ============================================
   ETHMEDIUM — COMPLETE BOOKING FUNCTIONALITY
   ============================================ */

// ============================================
// DATA — All 12 Reading Types
// ============================================

const READINGS = [
    { 
        id: 'love', 
        icon: '💖', 
        name: 'Love Reading', 
        desc: 'Soulmate, twin flame, relationship blocks, heart healing',
        basePrice: 45 
    },
    { 
        id: 'general', 
        icon: '🔮', 
        name: 'General Reading', 
        desc: 'Whatever Spirit wants you to know right now',
        basePrice: 40 
    },
    { 
        id: 'relationship', 
        icon: '💑', 
        name: 'Relationship Reading', 
        desc: 'Deep dive into current partnership, communication, healing',
        basePrice: 55 
    },
    { 
        id: 'aura', 
        icon: '🌈', 
        name: 'Aura Reading', 
        desc: 'See your energy colors, blockages & chakra alignment',
        basePrice: 60 
    },
    { 
        id: 'career', 
        icon: '💼', 
        name: 'Career Reading', 
        desc: 'Career path, promotions, business decisions, purpose',
        basePrice: 55 
    },
    { 
        id: 'job', 
        icon: '🏢', 
        name: 'Job Reading', 
        desc: 'Job search, interviews, workplace challenges, next steps',
        basePrice: 50 
    },
    { 
        id: 'finance', 
        icon: '💰', 
        name: 'Finance Reading', 
        desc: 'Money flow, abundance, investments, financial blocks',
        basePrice: 55 
    },
    { 
        id: 'future', 
        icon: '🌅', 
        name: 'Future Reading', 
        desc: "What's coming in 3-6 months and how to prepare",
        basePrice: 60 
    },
    { 
        id: 'healing', 
        icon: '🕊️', 
        name: 'Healing Reading', 
        desc: 'Depression, anxiety, emotional trauma, inner peace',
        basePrice: 70 
    },
    { 
        id: 'intuitive', 
        icon: '✨', 
        name: 'Intuitive Guidance', 
        desc: 'General life guidance, decision making, spiritual clarity',
        basePrice: 50 
    },
    { 
        id: 'protection', 
        icon: '🛡️', 
        name: 'Protection Reading', 
        desc: 'Energy protection, negative entity removal, spiritual safety',
        basePrice: 65 
    },
    { 
        id: 'spiritual', 
        icon: '🙏', 
        name: 'Spiritual Reading', 
        desc: 'Spiritual awakening, purpose, connection with guides',
        basePrice: 60 
    }
];

const DURATIONS = [
    { minutes: 15, label: 'Quick', priceMultiplier: 0.6 },
    { minutes: 30, label: 'Deep', priceMultiplier: 1.0 },
    { minutes: 60, label: 'Full', priceMultiplier: 1.6 }
];

const CRYSTALS = [
    { 
        id: 'protection', 
        icon: '🛐', 
        name: 'Protection Bracelet', 
        desc: 'Black Tourmaline + Obsidian', 
        price: 22 
    },
    { 
        id: 'guidance', 
        icon: '🧿', 
        name: 'Guidance Crystal', 
        desc: 'Amethyst + Clear Quartz', 
        price: 28 
    },
    { 
        id: 'healing', 
        icon: '🔮', 
        name: 'Healing Bracelet', 
        desc: 'Rose Quartz + Green Aventurine', 
        price: 25 
    },
    { 
        id: 'peace', 
        icon: '☮️', 
        name: 'Peace Bundle', 
        desc: 'Selenite + Lapis Lazuli', 
        price: 35 
    },
    { 
        id: 'fullset', 
        icon: '🌅', 
        name: 'Full Protection Set', 
        desc: 'All 4 bracelets + crystal (Save $25!)', 
        price: 85 
    }
];

// ============================================
// STATE
// ============================================

let state = {
    selectedReading: null,
    selectedDuration: 30,
    questions: '',
    cart: []
};

// ============================================
// DOM REFERENCES
// ============================================

const readingsGrid = document.getElementById('readingsGrid');
const durationSelector = document.getElementById('durationSelector');
const questionsInput = document.getElementById('questionsInput');
const crystalsGrid = document.getElementById('crystalsGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartCountBadge = document.getElementById('cartCountBadge');
const totalAmount = document.getElementById('totalAmount');

// ============================================
// RENDER FUNCTIONS
// ============================================

/**
 * Render all reading cards
 */
function renderReadings() {
    if (!readingsGrid) return;
    
    readingsGrid.innerHTML = READINGS.map(r => `
        <div class="reading-card ${state.selectedReading === r.id ? 'selected' : ''}" 
             onclick="selectReading('${r.id}')" 
             data-id="${r.id}">
            <span class="icon">${r.icon}</span>
            <h4>${r.name}</h4>
            <span class="desc">${r.desc}</span>
            <span class="price">$${r.basePrice}</span>
            <span class="check-mark">✅</span>
        </div>
    `).join('');
}

/**
 * Render duration options
 */
function renderDurations() {
    if (!durationSelector) return;
    
    const reading = READINGS.find(r => r.id === state.selectedReading);
    const basePrice = reading ? reading.basePrice : 45;

    durationSelector.innerHTML = DURATIONS.map(d => {
        const price = Math.round(basePrice * d.priceMultiplier);
        const active = state.selectedDuration === d.minutes ? 'active' : '';
        return `
            <div class="duration-btn ${active}" onclick="selectDuration(${d.minutes})">
                <div class="time">${d.minutes} min</div>
                <div class="label">${d.label}</div>
                <div class="price-display">$${price}</div>
            </div>
        `;
    }).join('');
}

/**
 * Render crystal shop items
 */
function renderCrystals() {
    if (!crystalsGrid) return;
    
    crystalsGrid.innerHTML = CRYSTALS.map(c => {
        const inCart = state.cart.find(item => item.id === c.id);
        const qty = inCart ? inCart.quantity : 0;
        const btnText = qty > 0 ? `✅ In Cart (${qty})` : '🛒 Add to Cart';
        const btnClass = qty > 0 ? 'add-to-cart-btn in-cart' : 'add-to-cart-btn';
        
        return `
            <div class="crystal-item" data-id="${c.id}">
                <span class="crystal-icon">${c.icon}</span>
                <div class="crystal-name">${c.name}</div>
                <span class="crystal-desc">${c.desc}</span>
                <span class="crystal-price">$${c.price}</span>
                <button class="${btnClass}" onclick="toggleCart('${c.id}')">
                    ${btnText}
                </button>
                ${qty > 0 ? `<span class="qty-badge">${qty}</span>` : ''}
            </div>
        `;
    }).join('');
}

/**
 * Render shopping cart
 */
function renderCart() {
    const items = state.cart;
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

    // Update cart count
    if (cartCount) cartCount.textContent = totalQty;
    if (cartCountBadge) cartCountBadge.textContent = `${totalQty} item${totalQty !== 1 ? 's' : ''}`;

    // Update cart items
    if (!cartItems) return;
    
    if (items.length === 0) {
        cartItems.innerHTML = `<div class="empty-cart-msg">✨ Your cart is empty, love</div>`;
    } else {
        cartItems.innerHTML = items.map(item => `
            <div class="cart-item">
                <span class="item-name">
                    ${item.icon} ${item.name} x${item.quantity}
                </span>
                <span>
                    $${(item.price * item.quantity).toFixed(2)}
                    <span class="remove-item" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-times-circle"></i>
                    </span>
                </span>
            </div>
        `).join('');
    }

    // Update total
    if (totalAmount) totalAmount.textContent = `$${total.toFixed(2)}`;
}

// ============================================
// ACTION FUNCTIONS
// ============================================

/**
 * Select a reading type
 */
function selectReading(id) {
    state.selectedReading = id;
    renderReadings();
    renderDurations();
    const reading = READINGS.find(r => r.id === id);
    showToast(`✨ Selected ${reading.icon} ${reading.name}`);
}

/**
 * Select a duration
 */
function selectDuration(minutes) {
    state.selectedDuration = minutes;
    renderDurations();
}

/**
 * Add or remove crystal from cart
 */
function toggleCart(crystalId) {
    const crystal = CRYSTALS.find(c => c.id === crystalId);
    const existing = state.cart.find(item => item.id === crystalId);

    if (existing) {
        state.cart = state.cart.filter(item => item.id !== crystalId);
        showToast(`❌ Removed ${crystal.name} from cart`);
    } else {
        state.cart.push({
            id: crystal.id,
            name: crystal.name,
            price: crystal.price,
            icon: crystal.icon,
            quantity: 1
        });
        showToast(`✨ Added ${crystal.name} to cart, love! ❤️`);
    }

    renderCrystals();
    renderCart();
}

/**
 * Remove item from cart
 */
function removeFromCart(crystalId) {
    const crystal = CRYSTALS.find(c => c.id === crystalId);
    state.cart = state.cart.filter(item => item.id !== crystalId);
    showToast(`❌ Removed ${crystal.name} from cart`);
    renderCrystals();
    renderCart();
}

// ============================================
// BOOKING FUNCTION
// ============================================

/**
 * Book now via WhatsApp or Telegram
 */
function bookNow(platform) {
    // Validate: Reading selected
    if (!state.selectedReading) {
        showToast('⚠️ Please select a reading type first, love! ❤️');
        document.querySelector('.readings-grid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // Validate: Duration selected
    if (!state.selectedDuration) {
        showToast('⚠️ Please select a duration, love! ❤️');
        document.querySelector('.duration-selector')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    // Get reading and duration details
    const reading = READINGS.find(r => r.id === state.selectedReading);
    const duration = DURATIONS.find(d => d.minutes === state.selectedDuration);
    const readingPrice = Math.round(reading.basePrice * duration.priceMultiplier);

    // Get questions
    const questions = questionsInput ? questionsInput.value.trim() : '';
    const finalQuestions = questions || 'No specific questions — read what Spirit brings through';

    // Build cart summary
    let cartSummary = '';
    let cartTotal = 0;
    
    if (state.cart.length > 0) {
        cartSummary = state.cart.map(item => 
            `  • ${item.icon} ${item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n');
        cartTotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    } else {
        cartSummary = '  • No crystals added';
    }

    // Grand total
    const grandTotal = readingPrice + cartTotal;

    // Build the complete message
    const message = `
🔮 ETHMEDIUM BOOKING 🔮
━━━━━━━━━━━━━━━━━━━━━

📖 Reading Type: ${reading.icon} ${reading.name}
⏰ Duration: ${duration.minutes} minutes (${duration.label})
💰 Reading Price: $${readingPrice}

💭 Your Questions:
${finalQuestions}

━━━━━━━━━━━━━━━━━━━━━
🛒 Crystals & Beads Order:
${cartSummary}
━━━━━━━━━━━━━━━━━━━━━

💎 Crystals Total: $${cartTotal.toFixed(2)}
💵 Grand Total: $${grandTotal.toFixed(2)}

━━━━━━━━━━━━━━━━━━━━━
✨ Ready to book, love! Please confirm:
📅 Preferred Date & Time: ___________
📱 Your Phone: ___________
💌 Your Email: ___________

"Sending positive energy to you! ❤️🛐🧿🔮☮️🌅"
    `.trim();

    // Encode for URL
    const encoded = encodeURIComponent(message);

    // Build URL based on platform
    let url = '';
    if (platform === 'whatsapp') {
        // 🔴 CHANGE THIS TO YOUR WHATSAPP NUMBER
        // Include country code, no + sign
        const phone = '2348000000000'; // Change this!
        url = `https://wa.me/${phone}?text=${encoded}`;
    } else if (platform === 'telegram') {
        // 🔴 CHANGE THIS TO YOUR TELEGRAM USERNAME
        // Without the @ symbol
        const username = 'YourUsername'; // Change this!
        url = `https://t.me/${username}?text=${encoded}`;
    }

    // Open in new tab/window
    window.open(url, '_blank');

    // Show confirmation
    const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
    showToast(`✨ Opening ${platformName}... Sending love! ❤️`);
}

// ============================================
// TOAST NOTIFICATION
// ============================================

let toastTimeout;

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.classList.add('show');
    
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ============================================
// AUTO-SAVE QUESTIONS
// ============================================

if (questionsInput) {
    questionsInput.addEventListener('input', function() {
        state.questions = this.value;
    });
}

// ============================================
// INITIALIZE
// ============================================

function init() {
    // Set default reading (first one)
    state.selectedReading = READINGS[0].id;
    
    // Render everything
    renderReadings();
    renderDurations();
    renderCrystals();
    renderCart();
    
    console.log('🔮 Ethemedium is ready, love! ❤️🛐🧿🔮☮️🌅');
    console.log('📖 Total Readings:', READINGS.length);
    console.log('📋 Reading Types:', READINGS.map(r => r.name).join(', '));
    console.log('💎 Crystals:', CRYSTALS.length);
    console.log('⏰ Durations:', DURATIONS.map(d => d.minutes + 'min').join(', '));
    console.log('✨ Remember to update your WhatsApp number and Telegram username!');
}

// Run when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============================================
// EXPOSE FUNCTIONS TO GLOBAL SCOPE
// ============================================

window.selectReading = selectReading;
window.selectDuration = selectDuration;
window.toggleCart = toggleCart;
window.removeFromCart = removeFromCart;
window.bookNow = bookNow;
window.showToast = showToast;

console.log('✨ All 12 readings loaded, love! Ready for bookings! ❤️');

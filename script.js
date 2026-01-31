// ===================================
// DYNAMIC REVIEWS SYSTEM WITH DETAILED RATINGS
// ===================================

let allReviews = [];

// Load reviews from JSON file
async function loadReviewsData() {
    try {
        const response = await fetch('reviews.json');
        const data = await response.json();
        allReviews = data.reviews;
        return allReviews;
    } catch (error) {
        console.error('Error loading reviews:', error);
        return [];
    }
}

// Generate star rating HTML (out of 10)
function getStarRating(rating) {
    return '★'.repeat(rating) + '☆'.repeat(10 - rating);
}

// Generate rating bar HTML
function getRatingBar(rating, label) {
    const percentage = (rating / 10) * 100;
    return `
        <div class="rating-row">
            <span class="rating-label">${label}</span>
            <div class="rating-bar-container">
                <div class="rating-bar" style="width: ${percentage}%"></div>
            </div>
            <span class="rating-value">${rating}/10</span>
        </div>
    `;
}

// Load reviews on homepage
async function loadHomePageReviews() {
    const reviewsGrid = document.querySelector('.reviews-grid');
    if (!reviewsGrid) return;
    
    const reviews = await loadReviewsData();
    reviewsGrid.innerHTML = '';
    
    // Show first 3 reviews
    reviews.slice(0, 3).forEach(review => {
        const mainImage = review.images && review.images.length > 0 ? review.images[0] : 'images/placeholder.jpg';
        
        const card = document.createElement('article');
        card.className = 'review-card';
        card.innerHTML = `
            <div class="card-image">
                <img src="${mainImage}" alt="${review.name}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'600\\' height=\\'400\\'%3E%3Cdefs%3E%3ClinearGradient id=\\'g${review.id}\\' x1=\\'0%25\\' y1=\\'0%25\\' x2=\\'100%25\\' y2=\\'100%25\\'%3E%3Cstop offset=\\'0%25\\' style=\\'stop-color:%23E94B3C%3Bstop-opacity:1\\' /%3E%3Cstop offset=\\'100%25\\' style=\\'stop-color:%23FFB347%3Bstop-opacity:1\\' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=\\'url(%23g${review.id})\\' width=\\'600\\' height=\\'400\\'/%3E%3Ctext fill=\\'white\\' font-family=\\'Arial\\' font-size=\\'24\\' font-weight=\\'bold\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3E${review.name}%3C/text%3E%3C/svg%3E'">
                <div class="card-badge">${review.category}</div>
            </div>
            <div class="card-content">
                <div class="card-rating">${getStarRating(review.ratings.overall)}</div>
                <h3 class="card-title">${review.name}</h3>
                <p class="card-excerpt">${review.review}</p>
                <a href="reviews.html#review-${review.id}" class="card-link">Read Full Review →</a>
            </div>
        `;
        reviewsGrid.appendChild(card);
    });
}

// Load all reviews on reviews page
async function loadReviewsPage() {
    const reviewsContainer = document.getElementById('reviewsContainer');
    if (!reviewsContainer) return;
    
    const reviews = await loadReviewsData();
    reviewsContainer.innerHTML = '';
    
    reviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-detail-card';
        reviewItem.id = `review-${review.id}`;
        
        // Create image gallery HTML
        let imageGalleryHTML = '';
        if (review.images && review.images.length > 0) {
            imageGalleryHTML = `
                <div class="review-images">
                    ${review.images.map(img => `
                        <img src="${img}" alt="${review.name}" onerror="this.style.display='none'">
                    `).join('')}
                </div>
            `;
        }
        
        reviewItem.innerHTML = `
            <div class="review-detail-header">
                <div>
                    <h3>${review.name}</h3>
                    <p class="review-location">${review.location} | ${review.category}</p>
                </div>
                <div class="review-overall">
                    <div class="overall-score">${review.ratings.overall}</div>
                    <div class="overall-label">Overall</div>
                </div>
            </div>
            
            ${imageGalleryHTML}
            
            <div class="review-ratings">
                <h4>Detailed Ratings</h4>
                ${getRatingBar(review.ratings.foodQuality, 'Food Quality')}
                ${getRatingBar(review.ratings.value, 'Value')}
                ${getRatingBar(review.ratings.service, 'Service')}
                ${getRatingBar(review.ratings.portionSize, 'Portion Size')}
            </div>
            
            <div class="review-text">
                <p><strong>Review:</strong> ${review.review}</p>
            </div>
            
            <div class="review-footer">
                <span class="would-return ${review.wouldReturn.toLowerCase() === 'yes' ? 'yes' : 'no'}">
                    ${review.wouldReturn === 'Yes' ? '✓ Would Return' : '✗ Would Not Return'}
                </span>
                <span class="review-date">${new Date(review.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
        `;
        
        reviewsContainer.appendChild(reviewItem);
    });
}

// Load gallery images from reviews
async function loadGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;
    
    const reviews = await loadReviewsData();
    galleryGrid.innerHTML = '';
    
    reviews.forEach(review => {
        if (review.images && review.images.length > 0) {
            review.images.forEach(img => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item';
                galleryItem.innerHTML = `
                    <img src="${img}" alt="${review.name}" onerror="this.style.display='none'; this.parentElement.innerHTML='<p>Photo coming soon</p>'">
                `;
                galleryGrid.appendChild(galleryItem);
            });
        }
    });
}

// ===================================
// FORM HANDLING
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Load dynamic content based on page
    const path = window.location.pathname;
    
    if (path.includes('index.html') || path.endsWith('/')) {
        loadHomePageReviews();
    } else if (path.includes('reviews.html')) {
        loadReviewsPage();
    } else if (path.includes('gallery.html')) {
        loadGallery();
    }
    
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formMessage = document.getElementById('formMessage');
            const name = document.getElementById('name').value;
            
            formMessage.style.color = 'var(--primary-color)';
            formMessage.textContent = `Thanks ${name}! Your message has been received. I'll get back to you soon!`;
            
            contactForm.reset();
            
            setTimeout(() => {
                formMessage.textContent = '';
            }, 5000);
        });
    }
    
    // Active Navigation Highlighting
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
});
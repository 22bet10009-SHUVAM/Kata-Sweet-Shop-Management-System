import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GiCupcake, GiChocolateBar, GiCookie, GiIceCreamCone } from 'react-icons/gi';
import { FiArrowRight, FiShield, FiTruck, FiHeart, FiPhone, FiMail, FiMapPin, FiClock, FiStar, FiAward, FiUsers } from 'react-icons/fi';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          {/* Left Content */}
          <div className="hero-content">
            <p style={{ 
              color: 'var(--royal-gold)', 
              fontSize: '0.875rem', 
              letterSpacing: '0.2em', 
              textTransform: 'uppercase',
              marginBottom: '1rem',
              fontWeight: 500
            }}>
              Est. 2024 — Premium Confectionery
            </p>
            <h1>
              Welcome to the{' '}
              <span className="text-gradient">Kata</span>
            </h1>
            <p>
              Indulge in our handcrafted collection of exquisite sweets.
              From rich artisan chocolates to traditional Indian favorites, 
              every creation is a masterpiece of flavor.
            </p>
            <div className="hero-buttons">
              <Link to="/shop" className="btn btn-primary">
                Explore Collection <FiArrowRight />
              </Link>
              {!user && (
                <Link to="/register" className="btn btn-secondary">
                  Join Us Today
                </Link>
              )}
            </div>
          </div>

          {/* Right Content - Floating Icons */}
          <div className="hero-graphics">
            <div className="floating-icon"><GiCupcake style={{ color: 'var(--royal-gold)' }} /></div>
            <div className="floating-icon"><GiChocolateBar style={{ color: 'var(--royal-bronze)' }} /></div>
            <div className="floating-icon"><GiCookie style={{ color: 'var(--royal-gold-light)' }} /></div>
            <div className="floating-icon"><GiIceCreamCone style={{ color: 'var(--royal-cream)' }} /></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon pink">
              <FiHeart />
            </div>
            <h3>Handcrafted Excellence</h3>
            <p>
              Every sweet is meticulously handcrafted by master confectioners 
              using time-honored techniques and the finest ingredients.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon green">
              <FiShield />
            </div>
            <h3>Premium Quality</h3>
            <p>
              We source only the finest ingredients — pure ghee, organic sugars, 
              and fresh dairy. No artificial preservatives.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon blue">
              <FiTruck />
            </div>
            <h3>Express Delivery</h3>
            <p>
              Enjoy doorstep delivery with temperature-controlled packaging 
              to ensure your sweets arrive in perfect condition.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="section stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <FiUsers className="stat-icon" />
            <span className="stat-number">10,000+</span>
            <span className="stat-label">Happy Customers</span>
          </div>
          <div className="stat-item">
            <GiCupcake className="stat-icon" />
            <span className="stat-number">50+</span>
            <span className="stat-label">Varieties of Sweets</span>
          </div>
          <div className="stat-item">
            <FiAward className="stat-icon" />
            <span className="stat-number">15+</span>
            <span className="stat-label">Years Experience</span>
          </div>
          <div className="stat-item">
            <FiStar className="stat-icon" />
            <span className="stat-number">4.9</span>
            <span className="stat-label">Customer Rating</span>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="section">
        <h2 className="section-title">Our Categories</h2>
        <div className="categories-grid">
          {[
            { name: 'Chocolate', desc: 'Velvety rich delights' },
            { name: 'Candy', desc: 'Sweet confections' },
            { name: 'Cakes', desc: 'Celebration masterpieces' },
            { name: 'Cookies', desc: 'Fresh baked daily' },
            { name: 'Pastries', desc: 'Flaky & delicate' },
            { name: 'Ice Cream', desc: 'Cool indulgence' },
            { name: 'Traditional', desc: 'Heritage recipes' },
            { name: 'Others', desc: 'Unique creations' },
          ].map((category) => (
            <Link
              key={category.name}
              to="/shop"
              className="category-card"
            >
              <span className="name">{category.name}</span>
              <span className="category-desc">{category.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="cta-card">
          <h2>Ready to Experience Sweetness Royalty?</h2>
          <p>
            Discover our exquisite collection of handcrafted premium sweets 
            and make every moment a celebration.
          </p>
          <Link to="/shop" className="btn btn-primary" style={{ fontSize: '1.125rem' }}>
            Explore Our Collection <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section">
        <h2 className="section-title">What Our Customers Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-stars">
              <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
            </div>
            <p className="testimonial-text">
              "The best sweets I've ever tasted! The Kaju Katli melts in your mouth. 
              Absolutely premium quality and beautiful packaging."
            </p>
            <div className="testimonial-author">
              <span className="author-name">Priya Sharma</span>
              <span className="author-location">Mumbai, India</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">
              <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
            </div>
            <p className="testimonial-text">
              "Ordered for Diwali and my family was impressed! Fresh, authentic taste 
              that reminds me of homemade sweets. Will order again!"
            </p>
            <div className="testimonial-author">
              <span className="author-name">Rajesh Patel</span>
              <span className="author-location">Delhi, India</span>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-stars">
              <FiStar /><FiStar /><FiStar /><FiStar /><FiStar />
            </div>
            <p className="testimonial-text">
              "The chocolate truffles are divine! Perfect for gifting. 
              The delivery was quick and packaging was excellent."
            </p>
            <div className="testimonial-author">
              <span className="author-name">Ananya Gupta</span>
              <span className="author-location">Bangalore, India</span>
            </div>
          </div>
        </div>
      </section>

      {/* Store Info Section */}
      <section className="section store-info-section">
        <h2 className="section-title">Visit Our Store</h2>
        <div className="store-info-grid">
          <div className="store-info-card">
            <FiMapPin className="store-info-icon" />
            <h3>Our Location</h3>
            <p>123 Sweet Street, Confectionery Lane</p>
            <p>Mumbai, Maharashtra 400001</p>
          </div>
          <div className="store-info-card">
            <FiClock className="store-info-icon" />
            <h3>Store Hours</h3>
            <p>Monday - Saturday: 9:00 AM - 9:00 PM</p>
            <p>Sunday: 10:00 AM - 6:00 PM</p>
          </div>
          <div className="store-info-card">
            <FiPhone className="store-info-icon" />
            <h3>Contact Us</h3>
            <p>Phone: +91 62808 10584</p>
            <p>WhatsApp: +91 62808 10584</p>
          </div>
          <div className="store-info-card">
            <FiMail className="store-info-icon" />
            <h3>Email Us</h3>
            <p>orders@sweetshop.com</p>
            <p>support@sweetshop.com</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section faq-section">
        <h2 className="section-title">Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h3>How fresh are your sweets?</h3>
            <p>All our sweets are made fresh daily. We prepare them in small batches to ensure maximum freshness and quality. Most items have a shelf life of 7-15 days when stored properly.</p>
          </div>
          <div className="faq-item">
            <h3>Do you offer bulk orders for events?</h3>
            <p>Yes! We offer special pricing for bulk orders for weddings, festivals, and corporate events. Contact us at least 3 days in advance for large orders.</p>
          </div>
          <div className="faq-item">
            <h3>What are your delivery options?</h3>
            <p>We offer same-day delivery within Mumbai for orders placed before 2 PM. For other cities, we use temperature-controlled packaging with 2-3 day delivery.</p>
          </div>
          <div className="faq-item">
            <h3>Are your sweets suitable for diabetics?</h3>
            <p>We offer a special sugar-free range made with natural sweeteners. Look for items marked "Sugar-Free" in our Traditional category.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="footer-logo">Kata</span>
            <span className="footer-tagline">Premium Confectionery Since 2024</span>
            <p className="footer-description">
              Crafting moments of sweetness with authentic recipes 
              passed down through generations.
            </p>
          </div>
          
          <div className="footer-links">
            <div className="footer-column">
              <h4>Quick Links</h4>
              <Link to="/shop">Browse Sweets</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Create Account</Link>
            </div>
            <div className="footer-column">
              <h4>Categories</h4>
              <Link to="/shop">Chocolates</Link>
              <Link to="/shop">Traditional</Link>
              <Link to="/shop">Cakes & Pastries</Link>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <span>orders@sweetshop.com</span>
              <span>+91 98765 43210</span>
              <span>Mumbai, India</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            Crafted with <FiHeart style={{ color: 'var(--royal-gold)' }} /> by Kata Artisans
          </p>
          <p style={{ fontSize: '0.8125rem', marginTop: '0.5rem', opacity: 0.6 }}>
            © 2024 Kata. All rights reserved. | Made in India
          </p>
        </div>
      </footer>
    </div>
  );
}

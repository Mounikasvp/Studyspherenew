import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Row, Col } from 'rsuite';
import '../styles/landing-page.scss';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
      delay: 50,
      offset: 50
    });

    // Handle navbar scroll behavior
    const handleScroll = () => {
      const header = document.querySelector('.landing-header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
    };

    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      const nav = document.querySelector('.landing-nav');
      const hamburger = document.querySelector('.hamburger-menu');

      if (mobileMenuOpen && nav && !nav.contains(event.target) && hamburger && !hamburger.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    // Close mobile menu when pressing escape key
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    // Prevent body scrolling when mobile menu is open
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);

    // Initial call to set the correct state
    handleScroll();

    // Clean up event listeners
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <div className="landing-page">
      {/* Header/Navigation */}
      <header className="landing-header glass-morphism">
        <div className="logo">
          <div className="logo-icon"></div>
          <h1>StudySphere</h1>
        </div>
        <button
          className="hamburger-menu"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav"
        >
          <div className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}></div>
        </button>
        <nav id="mobile-nav" className={`landing-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul>
            <li>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
              >
                Testimonials
              </a>
            </li>
            <li>
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button appearance="primary" className="gradient-btn">Sign In</Button>
              </Link>
            </li>
          </ul>
        </nav>
        {mobileMenuOpen && <div className="menu-backdrop" onClick={() => setMobileMenuOpen(false)}></div>}
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="animated-gradient"></div>
          <div className="geometric-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        <Container>
          <Grid>
            <Row className="align-items-center">
              <Col xs={24} md={12} data-aos="fade-right">
                <div className="hero-content">
                  <h1>
                    Connect, Collaborate,
                    <span className="gradient-text"> and Learn</span> Together
                  </h1>
                  <p className="hero-subtitle">
                    Experience the future of collaborative learning with our real-time
                    platform designed for modern students and educators.
                  </p>
                  <div className="hero-buttons">
                    <Link to="/signin">
                      <Button appearance="primary" className="gradient-btn pulse-animation">
                        Get Started Free
                      </Button>
                    </Link>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={12} data-aos="fade-left">
                <div className="hero-image-container">
                  <div className="floating-elements">
                    <div className="float-card card-1">
                      <i className="fa-solid fa-message"></i>
                      <span>Live Chat</span>
                    </div>
                    <div className="float-card card-2">
                      <i className="fa-light fa-note"></i>
                      <span>Sharing Notes</span>
                    </div>
                    <div className="float-card card-3">
                      <i className="fa-solid fa-file-alt"></i>
                      <span>Documents</span>
                    </div>
                  </div>
                  <div className="main-image">
                    <div className="placeholder-content">
                      <div className="placeholder-icon">
                        <i className="fa-solid fa-graduation-cap"></i>
                      </div>
                      <h3>StudySphere</h3>
                      <p>Connect, collaborate, and learn together</p>
                      <div className="placeholder-stats">
                        <div className="stat-item">
                          <i className="fa-solid fa-users"></i>
                          <span>500+ Study Groups</span>
                        </div>
                        <div className="stat-item">
                          <i className="fa-solid fa-message"></i>
                          <span>Real-time Messaging</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Grid>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <Container>
          <div className="section-title">
            <div className="badge">FEATURES</div>
            <h2>Everything you need to succeed</h2>
            <p>Powerful tools designed to enhance your learning experience</p>
          </div>

          <div className="features-grid">
            <Grid>
              <Row>
                <Col xs={24} md={8}>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fa-solid fa-comments"></i>
                    </div>
                    <h3>Real-time Messaging</h3>
                    <p>
                      Experience seamless communication with instant messaging.
                    </p>
                  </div>
                </Col>

                <Col xs={24} md={8}>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fa-solid fa-users"></i>
                    </div>
                    <h3>Study Groups</h3>
                    <p>
                      Create dedicated spaces for different subjects, projects, or study groups.
                    </p>

                  </div>
                </Col>

                <Col xs={24} md={8}>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fa-solid fa-file-arrow-up"></i>
                    </div>
                    <h3>File Sharing</h3>
                    <p>
                      Share notes, assignments, and study materials directly in your conversations.
                    </p>

                  </div>
                </Col>
              </Row>
            </Grid>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <Container>
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create an Account</h3>
              <p>Sign up with your email and password to get started.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Create or Join Study Rooms</h3>
              <p>Start a new study group or join existing ones.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Collaborate in Real-time</h3>
              <p>Chat, share files, and work together seamlessly.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Track Progress</h3>
              <p>Keep all your study materials and discussions organized.</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <Container>
          <h2 className="section-title">What Students Say</h2>
          <Grid>
            <Row>
              <Col xs={24} md={8}>
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <p>"StudySphere has transformed how our study group collaborates. We can share notes and discuss concepts in real-time!"</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah J." />
                    </div>
                    <div className="author-info">
                      <h4>Sarah J.</h4>
                      <p>Computer Science Student</p>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <p>"As a teaching assistant, StudySphere helps me stay connected with students and answer their questions efficiently."</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Michael T." />
                    </div>
                    <div className="author-info">
                      <h4>Michael T.</h4>
                      <p>Graduate Teaching Assistant</p>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="testimonial-card">
                  <div className="testimonial-content">
                    <p>"The voice message feature is perfect for explaining complex math problems that are hard to type out."</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Priya K." />
                    </div>
                    <div className="author-info">
                      <h4>Priya K.</h4>
                      <p>Mathematics Major</p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container>
          <div className="cta-content">
            <h2>Ready to Transform Your Study Experience?</h2>
            <p>Join thousands of students who are already using StudySphere to collaborate and learn together.</p>
            <Link to="/signin">
              <Button appearance="primary" color="green" size="lg">
                Get Started Now
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <Container>
          <Grid>
            <Row>
              <Col xs={24} md={8}>
                <div className="footer-logo">
                  <h2>StudySphere</h2>
                  <p>Connect, collaborate, and learn together</p>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="footer-links">
                  <h3>Quick Links</h3>
                  <ul>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#how-it-works">How It Works</a></li>
                    <li><a href="#testimonials">Testimonials</a></li>
                    <li><Link to="/signin">Sign In</Link></li>
                  </ul>
                </div>
              </Col>
              <Col xs={24} md={8}>
                <div className="footer-social">
                  <h3>Connect With Us</h3>
                  <div className="social-icons">
                    <button className="social-btn"><i className="fa-brands fa-facebook"></i></button>
                    <button className="social-btn"><i className="fa-brands fa-twitter"></i></button>
                    <button className="social-btn"><i className="fa-brands fa-instagram"></i></button>
                    <button className="social-btn"><i className="fa-brands fa-linkedin"></i></button>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col xs={24}>
                <div className="copyright">
                  <p>&copy; {new Date().getFullYear()} StudySphere. All rights reserved.</p>
                </div>
              </Col>
            </Row>
          </Grid>
        </Container>
      </footer>
    </div>
  );
};



export default LandingPage;





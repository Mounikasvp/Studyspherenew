import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Grid, Row, Col } from 'rsuite';
import '../styles/landing-page.scss';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    // We don't need to check screen size anymore since we're using CSS media queries
    // But we'll keep the state for future use if needed
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth <= 320);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-cubic',
      delay: 50,
      offset: 50
    });

    // Add a style element to remove all outlines
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      * {
        outline: none !important;
      }

      #mobile-nav, #mobile-nav:hover, #mobile-nav:focus, #mobile-nav:active,
      .menu-backdrop, .menu-backdrop:hover, .menu-backdrop:focus, .menu-backdrop:active {
        outline: none !important;
        border: none !important;
        box-shadow: none !important;
        -webkit-tap-highlight-color: transparent !important;
        -webkit-appearance: none !important;
        -moz-appearance: none !important;
        appearance: none !important;
        border-style: none !important;
        outline-style: none !important;
        outline-width: 0 !important;
        outline-color: transparent !important;
      }
    `;
    document.head.appendChild(styleElement);

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
      // Add styles to prevent dotted lines
      document.body.style.WebkitTapHighlightColor = 'transparent';
      document.body.style.outline = 'none';
      document.body.style.border = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.WebkitTapHighlightColor = '';
      document.body.style.outline = '';
      document.body.style.border = '';
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

      // Remove the style element
      const styleElements = document.querySelectorAll('style');
      styleElements.forEach(element => {
        if (element.textContent.includes('#mobile-nav')) {
          element.remove();
        }
      });
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
          style={{
            border: 'none',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent',
            WebkitAppearance: 'none',
            MozAppearance: 'none',
            appearance: 'none',
            borderStyle: 'none',
            boxShadow: 'none'
          }}
        >
          <div
            className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}
            style={{
              border: 'none',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              borderStyle: 'none',
              boxShadow: 'none',
              textDecoration: 'none'
            }}
          ></div>
          <div
            className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}
            style={{
              border: 'none',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              borderStyle: 'none',
              boxShadow: 'none',
              textDecoration: 'none'
            }}
          ></div>
          <div
            className={`hamburger-line ${mobileMenuOpen ? 'open' : ''}`}
            style={{
              border: 'none',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              appearance: 'none',
              borderStyle: 'none',
              boxShadow: 'none',
              textDecoration: 'none'
            }}
          ></div>
        </button>
        <nav
          id="mobile-nav"
          className={`landing-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}
          style={{
            border: 'none !important',
            outline: 'none !important',
            WebkitTapHighlightColor: 'transparent !important',
            WebkitAppearance: 'none !important',
            MozAppearance: 'none !important',
            appearance: 'none !important',
            borderStyle: 'none !important',
            boxShadow: 'none !important',
            textDecoration: 'none !important',
            outlineStyle: 'none !important',
            outlineWidth: '0 !important',
            outlineColor: 'transparent !important'
          }}
          tabIndex="-1"
        >
          <ul style={{
            border: 'none',
            outline: 'none',
            WebkitTapHighlightColor: 'transparent'
          }}>
            <li style={{
              border: 'none',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  border: 'none',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  borderStyle: 'none'
                }}
              >
                Features
              </a>
            </li>
            <li style={{
              border: 'none',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  border: 'none',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  borderStyle: 'none'
                }}
              >
                How It Works
              </a>
            </li>
            <li style={{
              border: 'none',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}>
              <a
                href="#testimonials"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  border: 'none',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  borderStyle: 'none'
                }}
              >
                Testimonials
              </a>
            </li>
            <li style={{
              border: 'none',
              outline: 'none',
              WebkitTapHighlightColor: 'transparent'
            }}>
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  border: 'none',
                  outline: 'none',
                  WebkitTapHighlightColor: 'transparent',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  appearance: 'none',
                  borderStyle: 'none'
                }}
              >
                <Button
                  appearance="primary"
                  className="gradient-btn"
                  style={{
                    border: 'none',
                    outline: 'none',
                    WebkitTapHighlightColor: 'transparent',
                    WebkitAppearance: 'none',
                    MozAppearance: 'none',
                    appearance: 'none',
                    borderStyle: 'none'
                  }}
                >
                  Sign In
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
        {mobileMenuOpen &&
          <div
            className="menu-backdrop"
            onClick={() => setMobileMenuOpen(false)}
            style={{
              border: 'none !important',
              outline: 'none !important',
              WebkitTapHighlightColor: 'transparent !important',
              WebkitAppearance: 'none !important',
              MozAppearance: 'none !important',
              appearance: 'none !important',
              borderStyle: 'none !important',
              boxShadow: 'none !important',
              textDecoration: 'none !important',
              outlineStyle: 'none !important',
              outlineWidth: '0 !important',
              outlineColor: 'transparent !important'
            }}
            tabIndex="-1"
          ></div>
        }
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
                    <span className="white-text"> & Learn</span>
                  </h1>
                  <p className="hero-subtitle">
                    Experience collaborative learning with our real-time
                    platform for students and educators.
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
                      <i className="fa-solid fa-book"></i>
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
                      <p>Connect, collaborate, and <span className="white-text">learn</span> together</p>
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
            <h2>Tools for success</h2>
            <p>Enhance your learning experience</p>
          </div>

          <div className="features-grid">
            <Grid>
              <Row>
                <Col xs={24} md={8}>
                  <div className="feature-card">
                    <div className="feature-icon">
                      <i className="fa-solid fa-comments"></i>
                    </div>
                    <h3>Messaging</h3>
                    <p>
                      Seamless real-time communication.
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
                      Create spaces for subjects and projects.
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
                      Share notes and materials in chats.
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
                    <p>"StudySphere transformed our study group. We share notes and discuss in real-time!"</p>
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
                    <p>"As a TA, StudySphere helps me connect with students and answer questions quickly."</p>
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
                    <p>"Voice messages help me explain math problems that are hard to type."</p>
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
            <h2>Ready to Transform Your Studies?</h2>
            <p>Join students using StudySphere to learn together.</p>
            <Link to="/signin">
              <Button appearance="primary" color="green" size="lg">
                Get Started Now
              </Button>
            </Link>
          </div>
        </Container>
      </section>
{/* footer */}
<footer className="landing-footer">
        <Container className="footer-container">
          <Grid>
            <Row className="footer-main-row">
              <Col xs={24} md={6} className="footer-col">
                <div className="footer-logo">
                  <h2 className="footer-title">StudySphere</h2>
                  <p>Connect, collaborate, and learn together</p>
                </div>
              </Col>
              <Col xs={24} md={6} className="footer-col">
                <div className="footer-links">
                  <h3>Quick Links</h3>
                  <ul>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#how-it-works">How It Works</a></li>
                    <li><a href="#testimonials">Testimonials</a></li>
                    <li><button className="footer-link-button" onClick={() => window.location.href = '/contact'}>Contact Us</button></li>
                  </ul>
                </div>
              </Col>
            </Row>
            <Row className="footer-copyright-row">
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





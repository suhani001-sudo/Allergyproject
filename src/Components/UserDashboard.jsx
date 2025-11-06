import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import './PremiumFeedback.css';
import Footer from './Footer';

function UserDashboard(props) {
    // STEP 1: Get the onLogout function from props
    const onLogout = props.onLogout;

    // STEP 2: Initialize navigation and cart hooks
    const navigate = useNavigate();


    // STEP 3: Set up state variables
    const [activeNavItem, setActiveNavItem] = useState('Restaurants');
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // STEP 3.1: Feedbacks state (will be fetched from backend)
    const [feedbacks, setFeedbacks] = useState([]);
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);


    // STEP 3.2: Feedback form state
    const [newFeedbackName, setNewFeedbackName] = useState('');
    const [newFeedbackMessage, setNewFeedbackMessage] = useState('');
    const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);


    // STEP 3.3: FAQs state
    const [faqs, setFaqs] = useState([
        {
            id: 1,
            question: 'How does SafeBytes determine allergens in dishes?',
            answer: 'Restaurants provide ingredients. We cross-check common allergen keywords to highlight potential allergens.',
            open: false
        },
        {
            id: 2,
            question: 'Can I trust the allergen information completely?',
            answer: 'We aim for accuracy, but always confirm with the restaurant if you have severe allergies.',
            open: false
        },
        {
            id: 3,
            question: 'How can I request a new feature or report an issue?',
            answer: 'Use the feedback form below. Your message is saved locally and shown instantly in the list.',
            open: false
        }
    ]);

    // STEP 4: Quotes list
    const quotes = [
        'Let food be thy medicine and medicine be thy food',
        'Eat safe, live strong',
        'Good food, good health, good life',
        'Your health is your wealth - choose wisely',
        'Safe dining starts with awareness'
    ];

  // STEP 5: Create array of navigation items
  const navItems = [
    { id: 'Dashboard',  label: 'Dashboard' },
    { id: 'My Allergies', label: 'Allergies' },
    { id: 'Contact', label: 'Contact' },
    { id: 'About',  label: 'About us' },
    { id: 'Profile', icon: '👤', label: 'Profile' }

  ];

    // Fetch feedbacks from backend on component mount
    useEffect(() => {
        fetchFeedbacks();
    }, []);

    // Rotate quotes every 5s
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [quotes.length]);

    // Function to fetch feedbacks from backend
    async function fetchFeedbacks() {
        try {
            setLoadingFeedbacks(true);
            const response = await fetch('http://localhost:5000/api/feedback');
            const data = await response.json();
            
            if (data.success && data.data) {
                // Transform backend data to match component structure
                const transformedFeedbacks = data.data.map(feedback => ({
                    id: feedback._id,
                    name: feedback.name,
                    message: feedback.message
                }));
                setFeedbacks(transformedFeedbacks);
            }
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
            // Keep empty array on error
        } finally {
            setLoadingFeedbacks(false);
        }
    }

  // STEP 7: Function to handle navigation clicks
  function handleNavClick(itemId) {
    setActiveNavItem(itemId);
    if (itemId === 'Dashboard') {
      navigate('/Dashboard');
    } else if (itemId === 'My Allergies') {
      navigate('/allergy-info');
    } else if (itemId === 'Contact') {
      navigate('/contact');
    } else if (itemId === 'About') {
      navigate('/about-us');
    } else if (itemId === 'Profile') {
      navigate('/profile');
    }
  }

    // STEP 7.1: Handle feedback form submission
    async function handleFeedbackSubmit(e) {
        e.preventDefault();
        
        // Validate form fields
        if (!newFeedbackName.trim() || !newFeedbackMessage.trim()) {
            alert('Please fill in both name and message fields');
            return;
        }

        try {
            // Send feedback to backend
            const response = await fetch('http://localhost:5000/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: newFeedbackName.trim(),
                    message: newFeedbackMessage.trim()
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Add new feedback to local state
                const newFeedback = {
                    id: data.data._id,
                    name: data.data.name,
                    message: data.data.message
                };
                setFeedbacks(prev => [newFeedback, ...prev]);
                
                // Clear form
                setNewFeedbackName('');
                setNewFeedbackMessage('');
                
                // Show success animation
                setShowSuccessAnimation(true);
                setTimeout(() => {
                    setShowSuccessAnimation(false);
                }, 4000);
            } else {
                // Show error message from backend
                alert(data.message || 'Failed to submit feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Network error. Please check your connection and try again.');
        }
    }

    // STEP 7.2: Toggle FAQ open/closed
    function toggleFaq(faqId) {
        setFaqs(prev => prev.map(item => item.id === faqId ? { ...item, open: !item.open } : item));
    }

    return (
        <div className="home-container">


            <nav className="navbar">
                <div className="nav-container">
                    <div className="nav-logo">
                        <img
                            src="/images/green_logo.jpg"
                            alt="SafeBytes Logo"
                            className="logo-image"
                        />
                        <span className="logo-text">SafeBytes</span>
                    </div>

                    {/* Hamburger Menu Button */}
                    <button 
                        className="hamburger-menu"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                        <span className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></span>
                    </button>

                    <div className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
                        {navItems.map(function (item) {
                            return (
                                <button
                                    key={item.id}
                                    className={`nav-link ${activeNavItem === item.id ? 'active' : ''}`}
                                    onClick={function () { 
                                        handleNavClick(item.id);
                                        setIsMobileMenuOpen(false);
                                    }}
                                >
                                    <span className="nav-label">{item.label}</span>
                                    {activeNavItem === item.id && (
                                        <div className="active-indicator" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        className="logout-button"
                        onClick={() => {
                            onLogout();
                            setIsMobileMenuOpen(false);
                        }}
                    >
                        <span className="logout-text">Logout</span>
                    </button>
                </div>
            </nav>

            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-text">
                        <h1 className="hero-title">
                            Safe Dining,
                            <span className="highlight"> Everywhere</span>
                        </h1>

                        <p className="home-hero-subtitle">
                            Your trusted companion for allergy-safe dining experiences.
                        </p>

                        <div className="quote-container">
                            <div className="quote-text">"{quotes[currentQuoteIndex]}"</div>
                        </div>

            <div className="cta-buttons">
              <button className="cta-button primary" onClick={function() { navigate('/restaurants'); }}>
                Explore Restaurants
              </button>
              
              <button className="cta-button secondary" onClick={function() { navigate('/allergy-info'); }}>
                Check My Allergies
              </button>
            </div>
          </div>

                    <div className="hero-image">
                        <div className="hero-image-container">
                            <img
                                src="/images/homepic2.jpg"
                                alt="Healthy Food"
                                className="hero-food-image"
                            />
                            <div className="image-overlay">
                                <span className="overlay-icon"></span>
                                <p>Fresh & Healthy</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="stats-section">
                <div className="stats-container">
                    <div className="stat-card">
                        <div className="stat-number">50+</div>
                        <div className="stat-label">Allergy-Safe Restaurants</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-number">10K+</div>
                        <div className="stat-label">Happy Users</div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-number">99.9%</div>
                        <div className="stat-label">Safety Rate</div>
                    </div>
                </div>
            </section>

            {/* User Feedbacks & Questions Section */}
            <section className="feedback-section">
                <h2 className="section-title">User Feedbacks & Questions</h2>
                <div className="feedback-list">
                    {loadingFeedbacks ? (
                        <div className="feedback-card" style={{ textAlign: 'center', color: '#666' }}>
                            <p>Loading feedbacks...</p>
                        </div>
                    ) : feedbacks.length === 0 ? (
                        <div className="feedback-card" style={{ textAlign: 'center', color: '#666' }}>
                            <p>No feedbacks yet. Be the first to share your thoughts!</p>
                        </div>
                    ) : (
                        feedbacks.map(function (item) {
                            return (
                                <div key={item.id} className="feedback-card">
                                    <div className="feedback-name">{item.name}</div>
                                    <div className="feedback-message">{item.message}</div>
                                </div>
                            );
                        })
                    )}
                </div>
                {/* Premium Cinematic Feedback Form */}
                <div className="premium-feedback-container">
                    <h3 className="premium-feedback-title">
                        <span className="sparkle">✨</span> Share Your Experience <span className="sparkle">✨</span>
                    </h3>
                    <p className="premium-feedback-subtitle">Your feedback helps us create a safer dining experience for everyone</p>
                    
                    {showSuccessAnimation && (
                        <div className="success-animation-overlay">
                            <div className="success-animation-content">
                                <div className="success-checkmark">
                                    <svg className="checkmark-svg" viewBox="0 0 52 52">
                                        <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                                        <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                    </svg>
                                </div>
                                <h3 className="success-title">Thank You!</h3>
                                <p className="success-message">Your feedback has been received 🎉</p>
                            </div>
                        </div>
                    )}
                    
                    <form className="premium-feedback-form" onSubmit={handleFeedbackSubmit}>
                        <div className="premium-form-group">
                            <label className="premium-label" htmlFor="fb-name">
                                <span className="label-icon">👤</span> Your Name
                            </label>
                            <div className="premium-input-wrapper">
                                <input
                                    id="fb-name"
                                    className="premium-input"
                                    type="text"
                                    placeholder="Enter your name"
                                    value={newFeedbackName}
                                    onChange={function (e) { setNewFeedbackName(e.target.value); }}
                                    required
                                />
                                <div className="input-glow"></div>
                            </div>
                        </div>
                        
                        <div className="premium-form-group">
                            <label className="premium-label" htmlFor="fb-message">
                                <span className="label-icon">💬</span> Your Feedback
                            </label>
                            <div className="premium-input-wrapper">
                                <textarea
                                    id="fb-message"
                                    className="premium-textarea"
                                    placeholder="Share your thoughts, suggestions, or questions..."
                                    value={newFeedbackMessage}
                                    onChange={function (e) { setNewFeedbackMessage(e.target.value); }}
                                    rows="5"
                                    required
                                />
                                <div className="input-glow"></div>
                            </div>
                        </div>
                        
                        <div className="premium-form-actions">
                            <button type="submit" className="premium-submit-button">
                                <span className="button-text">Submit Feedback</span>
                                <span className="button-icon">🚀</span>
                                <div className="button-ripple"></div>
                            </button>
                        </div>
                    </form>
                </div>
            </section>

            {/* Mostly Asked Questions (FAQ) Section */}
            <section className="faq-section">
                <h2 className="section-title">Mostly Asked Questions</h2>
                <div className="faq-list">
                    {faqs.map(function (item) {
                        return (
                            <div key={item.id} className="faq-item">
                                <div className="faq-question-row">
                                    <div className="faq-question">{item.question}</div>
                                    <button
                                        type="button"
                                        className="faq-toggle"
                                        onClick={function () { toggleFaq(item.id); }}
                                    >
                                        {item.open ? 'Hide Answer' : 'Show Answer'}
                                    </button>
                                </div>
                                {item.open && (
                                    <div className="faq-answer">{item.answer}</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default UserDashboard;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import Footer from './Footer';

function UserDashboard(props) {
    // STEP 1: Get the onLogout function from props
    const onLogout = props.onLogout;

    // STEP 2: Initialize navigation and cart hooks
    const navigate = useNavigate();


    // STEP 3: Set up state variables
    const [activeNavItem, setActiveNavItem] = useState('Restaurants');
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

    // STEP 3.1: Feedbacks state
    const [feedbacks, setFeedbacks] = useState([
        { id: 1, name: 'Aisha', message: 'Great experience finding allergy-safe meals!' },
        { id: 2, name: 'Rahul', message: 'Could you add more details on ingredients?' },
        { id: 3, name: 'Meera', message: 'Love the clean UI. Thanks!' }
    ]);

<<<<<<< HEAD
    // STEP 3.2: Feedback form state
    const [newFeedbackName, setNewFeedbackName] = useState('');
    const [newFeedbackMessage, setNewFeedbackMessage] = useState('');
=======
  // STEP 5: Create array of navigation items
  const navItems = [
    { id: 'Restaurants',  label: 'Restaurants' },
    { id: 'My Allergies', label: 'Allergies' },
    { id: 'Contact', label: 'Contact' },
    { id: 'About',  label: 'About us' },
    { id: 'Profile', icon: '👤', label: 'Profile' }

  ];
>>>>>>> 4b5364f79e8738aee11df30ef8dc6705a20a5a9a

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
        { id: 'Restaurants', label: 'Restaurants' },
        { id: 'My Allergies', label: 'Allergies' },
        { id: 'Contact', label: 'Contact' },
        { id: 'About', label: 'About us' },
        { id: 'Profile', label: 'Profile' }
    ];

    // Rotate quotes every 5s
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentQuoteIndex(prev => (prev + 1) % quotes.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [quotes.length]);

    // STEP 7: Function to handle navigation clicks
    function handleNavClick(itemId) {
        setActiveNavItem(itemId);
        if (itemId === 'Restaurants') {
            // Navigate to restaurant page
            navigate('/restaurants');
        } else if (itemId === 'About') {
            // Navigate to About Us page
            navigate('/about-us');
        } else if (itemId === 'Contact') {
            navigate('/contact');
        } else if (itemId === 'Profile') {
            navigate('/profile');
        }
        // Add other navigation logic as needed
    }

    // STEP 7.1: Handle feedback form submission
    function handleFeedbackSubmit(e) {
        e.preventDefault();
        if (!newFeedbackName.trim() || !newFeedbackMessage.trim()) {
            return;
        }
        const newFeedback = {
            id: Date.now(),
            name: newFeedbackName.trim(),
            message: newFeedbackMessage.trim()
        };
        setFeedbacks(prev => [newFeedback, ...prev]);
        setNewFeedbackName('');
        setNewFeedbackMessage('');
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

                    <div className="nav-links">
                        {navItems.map(function (item) {
                            return (
                                <button
                                    key={item.id}
                                    className={`nav-link ${activeNavItem === item.id ? 'active' : ''}`}
                                    onClick={function () { handleNavClick(item.id); }}
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
                        onClick={onLogout}
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
                            <button className="cta-button primary" onClick={function () { navigate('/restaurants'); }}>
                                Explore Restaurants
                            </button>

                            <button className="cta-button secondary">
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
                    {feedbacks.map(function (item) {
                        return (
                            <div key={item.id} className="feedback-card">
                                <div className="feedback-name">{item.name}</div>
                                <div className="feedback-message">{item.message}</div>
                            </div>
                        );
                    })}
                </div>
                <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
                    <div className="form-row">
                        <label className="form-label" htmlFor="fb-name">Your Name</label>
                        <input
                            id="fb-name"
                            className="form-input"
                            type="text"
                            placeholder="Enter your name"
                            value={newFeedbackName}
                            onChange={function (e) { setNewFeedbackName(e.target.value); }}
                        />
                    </div>
                    <div className="form-row">
                        <label className="form-label" htmlFor="fb-message">Your Feedback / Question</label>
                        <textarea
                            id="fb-message"
                            className="form-textarea"
                            placeholder="Type your feedback or question here"
                            value={newFeedbackMessage}
                            onChange={function (e) { setNewFeedbackMessage(e.target.value); }}
                        />
                    </div>
                    <div className="form-actions">
                        <button type="submit" className="form-button">Submit</button>
                    </div>
                </form>
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

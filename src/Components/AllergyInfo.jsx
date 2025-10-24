import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AllergyInfo.css';
import Footer from './Footer';

function AllergyInfo() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAllergen, setSelectedAllergen] = useState(null);
  const [currentTip, setCurrentTip] = useState(0);
  const [activeNavItem, setActiveNavItem] = useState('My Allergies');

  const safetyTips = [
    "Always read labels before eating!",
    "Consult your doctor if symptoms persist.",
    "Carry an epinephrine auto-injector if prescribed.",
    "Inform restaurant staff about your allergies.",
    "Check ingredients in processed foods carefully."
  ];

  const allergens = [
    {
      id: 1,
      name: "Peanut Allergy",
      icon: "🥜",
      preview: "One of the most common and severe food allergies.",
      description: "Peanut allergy is one of the most common food allergies, especially in children. It can cause severe reactions including anaphylaxis.",
      ingredients: ["Peanuts", "Peanut oil", "Ground nuts", "Mixed nuts", "Peanut butter", "Peanut flour"],
      symptoms: ["Hives", "Swelling", "Difficulty breathing", "Nausea", "Vomiting", "Anaphylaxis"],
      precautions: ["Always read food labels", "Avoid foods with 'may contain peanuts'", "Carry epinephrine auto-injector", "Inform restaurants about your allergy"],
      alternatives: ["Sunflower seeds", "Pumpkin seeds", "Soy nuts", "Tree nuts (if not allergic)"]
    },
    {
      id: 2,
      name: "Milk Allergy",
      icon: "🥛",
      preview: "Reaction to proteins found in cow's milk and dairy products.",
      description: "Milk allergy is common in infants and young children. It involves an immune system reaction to proteins in cow's milk.",
      ingredients: ["Milk", "Cheese", "Butter", "Cream", "Yogurt", "Ice cream", "Whey", "Casein"],
      symptoms: ["Digestive issues", "Skin reactions", "Respiratory problems", "Anaphylaxis in severe cases"],
      precautions: ["Read all food labels carefully", "Avoid dairy-containing products", "Check for hidden milk ingredients", "Inform caregivers about the allergy"],
      alternatives: ["Almond milk", "Soy milk", "Oat milk", "Coconut milk", "Rice milk"]
    },
    {
      id: 3,
      name: "Egg Allergy",
      icon: "🥚",
      preview: "Immune system reaction to proteins in chicken eggs.",
      description: "Egg allergy is common in children and can cause reactions ranging from mild to severe. Both egg whites and yolks can trigger reactions.",
      ingredients: ["Eggs", "Egg whites", "Egg yolks", "Mayonnaise", "Meringue", "Pasta", "Baked goods"],
      symptoms: ["Skin reactions", "Digestive problems", "Respiratory issues", "Anaphylaxis"],
      precautions: ["Check ingredient lists", "Avoid foods with eggs", "Be cautious with vaccines", "Inform schools and caregivers"],
      alternatives: ["Applesauce", "Banana", "Flax eggs", "Commercial egg replacers", "Aquafaba"]
    },
    {
      id: 4,
      name: "Tree Nut Allergy",
      icon: "🌰",
      preview: "Allergic reaction to nuts that grow on trees.",
      description: "Tree nut allergies are often severe and lifelong. They include allergies to almonds, walnuts, cashews, and other tree nuts.",
      ingredients: ["Almonds", "Walnuts", "Cashews", "Pistachios", "Hazelnuts", "Brazil nuts", "Pecans", "Macadamia nuts"],
      symptoms: ["Severe allergic reactions", "Anaphylaxis", "Skin reactions", "Digestive issues"],
      precautions: ["Avoid all tree nuts", "Read labels carefully", "Be cautious of cross-contamination", "Carry emergency medication"],
      alternatives: ["Seeds (sunflower, pumpkin)", "Soy nuts", "Roasted chickpeas", "Dried fruit"]
    },
    {
      id: 5,
      name: "Soy Allergy",
      icon: "🫘",
      preview: "Allergic reaction to soybeans and soy products.",
      description: "Soy allergy is common in infants and children. Soy is found in many processed foods and can be hidden in various products.",
      ingredients: ["Soybeans", "Soy sauce", "Tofu", "Tempeh", "Soy milk", "Soy oil", "Lecithin", "Miso"],
      symptoms: ["Digestive problems", "Skin reactions", "Respiratory issues", "Anaphylaxis in severe cases"],
      precautions: ["Read food labels", "Avoid soy-containing products", "Check for hidden soy ingredients", "Inform restaurants"],
      alternatives: ["Almond milk", "Oat milk", "Coconut milk", "Rice milk", "Sunflower oil"]
    },
    {
      id: 6,
      name: "Wheat Allergy",
      icon: "🌾",
      preview: "Immune system reaction to proteins found in wheat.",
      description: "Wheat allergy is different from celiac disease. It involves an immune system reaction to wheat proteins and can cause various symptoms.",
      ingredients: ["Wheat flour", "Bread", "Pasta", "Cereal", "Crackers", "Beer", "Soy sauce", "Modified food starch"],
      symptoms: ["Digestive issues", "Skin reactions", "Respiratory problems", "Anaphylaxis"],
      precautions: ["Read all food labels", "Avoid wheat-containing products", "Check for hidden wheat", "Inform food service staff"],
      alternatives: ["Rice flour", "Almond flour", "Coconut flour", "Quinoa", "Gluten-free products"]
    },
    {
      id: 7,
      name: "Fish Allergy",
      icon: "🐟",
      preview: "Allergic reaction to fish proteins, not shellfish.",
      description: "Fish allergy is different from shellfish allergy. It can develop at any age and often persists into adulthood.",
      ingredients: ["Salmon", "Tuna", "Cod", "Halibut", "Sardines", "Anchovies", "Fish sauce", "Worcestershire sauce"],
      symptoms: ["Severe allergic reactions", "Anaphylaxis", "Skin reactions", "Digestive problems"],
      precautions: ["Avoid all fish", "Check restaurant menus", "Be cautious of cross-contamination", "Carry emergency medication"],
      alternatives: ["Plant-based proteins", "Chicken", "Beef", "Pork", "Legumes", "Tofu"]
    },
    {
      id: 8,
      name: "Shellfish Allergy",
      icon: "🦐",
      preview: "Allergic reaction to crustaceans and mollusks.",
      description: "Shellfish allergy is common in adults and can be severe. It includes both crustaceans (shrimp, crab, lobster) and mollusks (clams, mussels, oysters).",
      ingredients: ["Shrimp", "Crab", "Lobster", "Clams", "Mussels", "Oysters", "Scallops", "Squid", "Octopus"],
      symptoms: ["Severe allergic reactions", "Anaphylaxis", "Skin reactions", "Digestive issues"],
      precautions: ["Avoid all shellfish", "Check food labels", "Be cautious of cross-contamination", "Inform restaurants"],
      alternatives: ["Fish (if not allergic)", "Chicken", "Beef", "Pork", "Plant-based proteins", "Tofu"]
    }
  ];

  const filteredAllergens = allergens.filter(allergen =>
    allergen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    allergen.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const tipInterval = setInterval(() => {
      setCurrentTip(prev => (prev + 1) % safetyTips.length);
    }, 3000);
    return () => clearInterval(tipInterval);
  }, []);

  const openModal = (allergen) => {
    setSelectedAllergen(allergen);
  };

  const closeModal = () => {
    setSelectedAllergen(null);
  };

  // Navigation items
  const navItems = [
    { id: 'Restaurants', label: 'Restaurants' },
    { id: 'My Allergies', label: 'My Allergies' },
    { id: 'Contact', label: 'Contact' },
    { id: 'About', label: 'About us' },
    { id: 'Profile', icon: '👤', label: 'Profile' }
  ];

  const handleNavClick = (itemId) => {
    setActiveNavItem(itemId);
    if (itemId === 'Restaurants') {
      navigate('/restaurants');
    } else if (itemId === 'My Allergies') {
      if (window.location.pathname === '/allergy-info') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/allergy-info');
      }
    } else if (itemId === 'Contact') {
      navigate('/contact');
    } else if (itemId === 'About') {
      navigate('/about-us');
    } else if (itemId === 'Profile') {
      navigate('/profile');
    }
  };

  return (
    <div className="allergy-info-container">
      {/* Navigation Bar */}
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
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`nav-link ${activeNavItem === item.id ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                <span className="nav-label">{item.label}</span>
                {activeNavItem === item.id && (
                  <div className="active-indicator" />
                )}
              </button>
            ))}
          </div>

          <button
            className="logout-button"
            onClick={() => navigate('/login')}
          >
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </nav>

      {/* Header Section */}
      <header className="allergy-header">
        <div className="header-content">
          <h1 className="header-title">Food Allergies & Ingredients Guide</h1>
          <p className="header-description">
            Learn about common food allergens, their ingredients, effects, and how to stay safe.
          </p>
        </div>
        <div className="animated-background"></div>
      </header>

      {/* Search Section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for allergens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      </section>

      {/* Allergen Cards Section */}
      <section className="allergens-section">
        <div className="allergens-container">
          {filteredAllergens.map((allergen, index) => (
            <div
              key={allergen.id}
              className="allergen-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-header">
                <div className="card-icon">{allergen.icon}</div>
                <div className="card-title">{allergen.name}</div>
                <div className="card-preview">{allergen.preview}</div>
                <button 
                  className="expand-button"
                  onClick={() => openModal(allergen)}
                >
                  Read More
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Floating Tip Box */}
      <div className="floating-tip">
        <div className="tip-content">
          <span className="tip-icon">💡</span>
          <span className="tip-text">{safetyTips[currentTip]}</span>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedAllergen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <span className="modal-icon">{selectedAllergen.icon}</span>
                <h2>{selectedAllergen.name}</h2>
              </div>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="content-section">
                <h4>Description</h4>
                <p>{selectedAllergen.description}</p>
              </div>
              
              <div className="content-section">
                <h4>Common Ingredients</h4>
                <div className="ingredients-list">
                  {selectedAllergen.ingredients.map((ingredient, idx) => (
                    <span key={idx} className="ingredient-tag">{ingredient}</span>
                  ))}
                </div>
              </div>
              
              <div className="content-section">
                <h4>Symptoms</h4>
                <div className="symptoms-list">
                  {selectedAllergen.symptoms.map((symptom, idx) => (
                    <span key={idx} className="symptom-tag">{symptom}</span>
                  ))}
                </div>
              </div>
              
              <div className="content-section">
                <h4>Precautions</h4>
                <ul className="precautions-list">
                  {selectedAllergen.precautions.map((precaution, idx) => (
                    <li key={idx}>{precaution}</li>
                  ))}
                </ul>
              </div>
              
              <div className="content-section">
                <h4>Safe Alternatives</h4>
                <div className="alternatives-list">
                  {selectedAllergen.alternatives.map((alternative, idx) => (
                    <span key={idx} className="alternative-tag">{alternative}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AllergyInfo;

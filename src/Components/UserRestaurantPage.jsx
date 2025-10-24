import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserRestaurantPage.css';

function UserRestaurantPage(props) {
  // STEP 1: Get the onLogout function from props
  const onLogout = props.onLogout;
  
  // STEP 2: Initialize navigation and cart hooks
  const navigate = useNavigate();
  
  
  // STEP 3: Define state variables for managing data
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedAllergen, setSelectedAllergen] = useState('All');

  // STEP 4: Fetch menu items from comprehensive food API
  useEffect(function() {
    async function fetchItems() {
      try {
        setLoading(true);
        
        // Fetch multiple categories of food items for variety
        const categories = ['chicken', 'beef', 'pasta', 'seafood', 'vegetarian', 'dessert'];
        const allItems = [];
        
        // Fetch items from multiple categories
        for (const category of categories) {
          try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            const data = await response.json();
            
            if (data.meals) {
              // Get detailed info for each meal
              for (const meal of data.meals.slice(0, 2)) { // Limit to 2 per category
                try {
                  const detailResponse = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`);
                  const detailData = await detailResponse.json();
                  
                  if (detailData.meals && detailData.meals[0]) {
                    const item = detailData.meals[0];
                    
                    // Extract ingredients from the meal data
                    const ingredients = [];
                    for (let i = 1; i <= 20; i++) {
                      const ingredient = item[`strIngredient${i}`];
                      if (ingredient && ingredient.trim() !== '') {
                        ingredients.push(ingredient.trim());
                      }
                    }
                    
                    // Determine allergens based on common ingredients
                    const allergens = [];
                    const allergenKeywords = {
                      'nuts': ['nuts', 'almond', 'walnut', 'peanut', 'cashew', 'pistachio', 'hazelnut', 'pecan'],
                      'dairy': ['milk', 'cheese', 'butter', 'cream', 'yogurt', 'dairy', 'milk', 'cheese', 'butter', 'cream'],
                      'gluten': ['flour', 'bread', 'pasta', 'wheat', 'barley', 'rye', 'breadcrumbs', 'croutons'],
                      'soy': ['soy', 'soybean', 'tofu', 'miso', 'soy sauce', 'tamari'],
                      'eggs': ['egg', 'eggs', 'mayonnaise', 'hollandaise'],
                      'shellfish': ['shrimp', 'crab', 'lobster', 'prawn', 'shellfish', 'mussels', 'clams', 'oysters'],
                      'fish': ['salmon', 'tuna', 'cod', 'fish', 'anchovy', 'sardines'],
                      'sesame': ['sesame', 'tahini', 'sesame oil', 'sesame seeds']
                    };
                    
                    ingredients.forEach(ingredient => {
                      Object.keys(allergenKeywords).forEach(allergen => {
                        if (allergenKeywords[allergen].some(keyword => 
                          ingredient.toLowerCase().includes(keyword.toLowerCase())
                        )) {
                          if (!allergens.includes(allergen)) {
                            allergens.push(allergen);
                          }
                        }
                      });
                    });
                    
                    // Map categories to better names
                    const categoryMap = {
                      'chicken': 'Poultry',
                      'beef': 'Meat',
                      'pasta': 'Pasta',
                      'seafood': 'Seafood',
                      'vegetarian': 'Vegetarian',
                      'dessert': 'Dessert',
                      'starter': 'Appetizer',
                      'side': 'Side Dish',
                      'breakfast': 'Breakfast',
                      'lamb': 'Meat',
                      'pork': 'Meat',
                      'goat': 'Meat',
                      'miscellaneous': 'Main Course'
                    };
                    
                    allItems.push({
                      id: item.idMeal || allItems.length + 1,
                      name: item.strMeal,
                      description: item.strInstructions ? item.strInstructions.substring(0, 120) + '...' : 'Delicious meal prepared with fresh ingredients',
                      price: Math.round((Math.random() * 25 + 8) * 100) / 100, // Random price between $8-33
                      image: item.strMealThumb,
                      ingredients: ingredients,
                      allergens: allergens,
                      category: categoryMap[category] || item.strCategory || 'Main Course',
                      area: item.strArea || 'International',
                      tags: item.strTags ? item.strTags.split(',').map(tag => tag.trim()) : []
                    });
                  }
                } catch (detailErr) {
                  console.warn(`Failed to fetch details for ${meal.strMeal}:`, detailErr);
                }
              }
            }
          } catch (categoryErr) {
            console.warn(`Failed to fetch category ${category}:`, categoryErr);
          }
        }
        
        // If we got items, use them; otherwise use fallback
        if (allItems.length > 0) {
          setItems(allItems.slice(0, 15)); // Limit to 15 items
          setError(null);
        } else {
          throw new Error('No items fetched from API');
        }
        
      } catch (err) {
        setError('Failed to load menu items');
        console.error('Error fetching items:', err);
        
        // Enhanced fallback with more variety
        const fallbackItems = [
          {
            id: 1,
            name: 'Grilled Chicken Breast',
            description: 'Tender grilled chicken breast with herbs and spices, served with seasonal vegetables',
            price: 18.99,
            image: '/images/homepic1.jpg',
            ingredients: ['Chicken breast', 'Olive oil', 'Garlic', 'Rosemary', 'Thyme', 'Salt', 'Black pepper', 'Lemon'],
            allergens: ['eggs'],
            category: 'Poultry',
            area: 'Mediterranean',
            tags: ['healthy', 'protein']
          },
          {
            id: 2,
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce with parmesan cheese, croutons, and house-made caesar dressing',
            price: 14.50,
            image: '/images/homepic2.jpg',
            ingredients: ['Romaine lettuce', 'Parmesan cheese', 'Croutons', 'Caesar dressing', 'Lemon', 'Garlic', 'Anchovies', 'Worcestershire sauce'],
            allergens: ['dairy', 'gluten', 'eggs', 'fish'],
            category: 'Salad',
            area: 'Italian',
            tags: ['fresh', 'classic']
          },
          {
            id: 3,
            name: 'Vegetable Stir Fry',
            description: 'Mixed vegetables stir-fried with tofu in light soy sauce, served with jasmine rice',
            price: 16.75,
            image: '/images/homepic3.jpg',
            ingredients: ['Firm tofu', 'Broccoli', 'Carrots', 'Bell peppers', 'Snap peas', 'Soy sauce', 'Ginger', 'Garlic', 'Sesame oil', 'Jasmine rice'],
            allergens: ['soy', 'sesame'],
            category: 'Vegetarian',
            area: 'Asian',
            tags: ['healthy', 'vegan-friendly']
          },
          {
            id: 4,
            name: 'Beef Burger',
            description: 'Juicy beef patty with lettuce, tomato, onion, and special sauce on a brioche bun',
            price: 19.99,
            image: '/images/homepic4.jpg',
            ingredients: ['Beef patty', 'Brioche bun', 'Lettuce', 'Tomato', 'Red onion', 'Pickles', 'Cheddar cheese', 'Special sauce', 'Salt', 'Pepper'],
            allergens: ['gluten', 'eggs', 'dairy'],
            category: 'Meat',
            area: 'American',
            tags: ['comfort', 'classic']
          },
          {
            id: 5,
            name: 'Mediterranean Quinoa Bowl',
            description: 'Quinoa bowl with roasted vegetables, feta cheese, olives, and tahini dressing',
            price: 17.25,
            image: '/images/homepic1.jpg',
            ingredients: ['Quinoa', 'Roasted vegetables', 'Feta cheese', 'Kalamata olives', 'Cucumber', 'Red onion', 'Tahini', 'Lemon juice', 'Olive oil', 'Fresh herbs'],
            allergens: ['dairy', 'sesame'],
            category: 'Healthy',
            area: 'Mediterranean',
            tags: ['healthy', 'vegetarian']
          },
          {
            id: 6,
            name: 'Chocolate Lava Cake',
            description: 'Warm chocolate cake with molten center, served with vanilla ice cream',
            price: 12.99,
            image: '/images/homepic2.jpg',
            ingredients: ['Dark chocolate', 'Butter', 'Eggs', 'Sugar', 'Flour', 'Vanilla extract', 'Vanilla ice cream', 'Powdered sugar'],
            allergens: ['dairy', 'gluten', 'eggs'],
            category: 'Dessert',
            area: 'French',
            tags: ['indulgent', 'chocolate']
          }
        ];
        setItems(fallbackItems);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  // STEP 5: Filter items based on search term, category, and allergens
  const filteredItems = items.filter(function(item) {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.ingredients.some(ingredient => 
                           ingredient.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    const matchesAllergen = selectedAllergen === 'All' || 
                           (selectedAllergen === 'None' && item.allergens.length === 0) ||
                           item.allergens.includes(selectedAllergen.toLowerCase());
    
    return matchesSearch && matchesCategory && matchesAllergen;
  });

  // Get unique categories for filter dropdown
  const categories = ['All', ...new Set(items.map(item => item.category))];
  
  // Get unique allergens for filter dropdown
  const allAllergens = items.reduce((acc, item) => {
    item.allergens.forEach(allergen => {
      if (!acc.includes(allergen)) {
        acc.push(allergen);
      }
    });
    return acc;
  }, []);
  const allergens = ['All', 'None', ...allAllergens];

  return (
    <div className="restaurant-page">
      {/* STEP 6: Render header with original nav bar style */}
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
            <button
              className="nav-link"
              onClick={function() { navigate('/dashboard'); }}
            >
              <span className="nav-label">Dashboard</span>
            </button>
            <button
              className="nav-link active"
              onClick={function() { navigate('/restaurants'); }}
            >
              <span className="nav-label">Restaurants</span>
            </button>
            <button className="nav-link" onClick={function() { navigate('/allergies'); }}>
              <span className="nav-label">Allergies</span>
            </button>
            <button className="nav-link" onClick={function() { navigate('/contact'); }}>
              <span className="nav-label">Contact</span>
            </button>
            <button className="nav-link" onClick={function() { navigate('/about-us'); }}>
              <span className="nav-label">About us</span>
            </button>
            <button className="nav-link" onClick={function() { navigate('/profile'); }}>
              <span className="nav-label">Profile</span>
            </button>
          </div>

          <button className="logout-button" onClick={onLogout}>
            <span className="logout-text">Logout</span>
          </button>
        </div>
      </nav>

      {/* STEP 7: Render search and filter section */}
      <section className="search-section">
        <div className="search-container">
          <div className="search-filters">
            <input
              type="text"
              placeholder="Search menu items, ingredients, or descriptions..."
              value={searchTerm}
              onChange={function(e) { setSearchTerm(e.target.value); }}
              className="search-input"
            />
            
            <div className="filter-dropdowns">
              <select
                value={selectedCategory}
                onChange={function(e) { setSelectedCategory(e.target.value); }}
                className="filter-select"
              >
                {categories.map(function(category) {
                  return (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  );
                })}
              </select>
              
              <select
                value={selectedAllergen}
                onChange={function(e) { setSelectedAllergen(e.target.value); }}
                className="filter-select"
              >
                {allergens.map(function(allergen) {
                  return (
                    <option key={allergen} value={allergen}>
                      {allergen === 'All' ? 'All Allergens' : 
                       allergen === 'None' ? 'No Allergens' : 
                       `Contains ${allergen}`}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          
          <div className="filter-results">
            <span className="results-count">
              {filteredItems.length} items found
            </span>
            {(selectedCategory !== 'All' || selectedAllergen !== 'All' || searchTerm) && (
              <button
                className="clear-filters-btn"
                onClick={function() {
                  setSearchTerm('');
                  setSelectedCategory('All');
                  setSelectedAllergen('All');
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </section>

      {/* STEP 8: Render main content area */}
      <main className="main-content">
        <div className="menu-section">
          <h2 className="menu-title">Our Menu</h2>
          
          {/* STEP 9: Show loading state */}
          {loading && <div className="loading">Loading menu items...</div>}
          
          {/* STEP 10: Show error state */}
          {error && <div className="error">{error}</div>}
          
          {/* STEP 11: Render menu items grid */}
          {!loading && !error && (
            <div className="menu-grid">
              {filteredItems.map(function(item) {
                return (
                  <div key={item.id} className="menu-card">
                    <img src={item.image} alt={item.name} className="item-image" />
                    <div className="card-content">
                      <div className="item-header">
                        <h3 className="item-name">{item.name}</h3>
                        <div className="item-category">{item.category}</div>
                      </div>
                      <p className="item-description">{item.description}</p>
                      
                      {/* Ingredients Section */}
                      <div className="ingredients-section">
                        <h4 className="ingredients-title">Ingredients:</h4>
                        <div className="ingredients-list">
                          {item.ingredients && item.ingredients.slice(0, 5).map(function(ingredient, idx) {
                            return (
                              <span key={idx} className="ingredient-tag">
                                {ingredient}
                              </span>
                            );
                          })}
                          {item.ingredients && item.ingredients.length > 5 && (
                            <span className="ingredient-tag more">
                              +{item.ingredients.length - 5} more
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Allergens Section */}
                      {item.allergens && item.allergens.length > 0 && (
                        <div className="allergens-section">
                          <h4 className="allergens-title">Contains:</h4>
                          <div className="allergens-list">
                            {item.allergens.map(function(allergen, idx) {
                              return (
                                <span key={idx} className="allergen-tag">
                                  {allergen}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Tags Section */}
                      {item.tags && item.tags.length > 0 && (
                        <div className="tags-section">
                          <div className="tags-list">
                            {item.tags.map(function(tag, idx) {
                              return (
                                <span key={idx} className="food-tag">
                                  #{tag}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      
                      <div className="item-footer">
                        <span className="item-price">${item.price}</span>
                        
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        
      </main>
    </div>
  );
}

export default UserRestaurantPage;

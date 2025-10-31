# 🎨 Component Integration Examples

## How to Update Your Components to Use Real Backend Data

---

## 📋 Example 1: UserDashboard - Load Allergies

### **Before (Mock Data)**
```javascript
const [allergies, setAllergies] = useState([
  { id: 1, name: 'Peanuts', severity: 'high' },
  { id: 2, name: 'Shellfish', severity: 'moderate' }
]);
```

### **After (Real API Data)**
```javascript
import { useState, useEffect } from 'react';
import allergyService from '../services/allergyService';

const UserDashboard = ({ onLogout }) => {
  const [allergies, setAllergies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load allergies on component mount
  useEffect(() => {
    loadAllergies();
  }, []);

  const loadAllergies = async () => {
    try {
      setLoading(true);
      const response = await allergyService.getAllergies();
      setAllergies(response.data); // response.data is the array of allergies
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load allergies');
      console.error('Error loading allergies:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new allergy
  const handleAddAllergy = async (allergyData) => {
    try {
      await allergyService.createAllergy(allergyData);
      loadAllergies(); // Refresh the list
    } catch (err) {
      setError(err.message || 'Failed to add allergy');
    }
  };

  // Delete allergy
  const handleDeleteAllergy = async (id) => {
    try {
      await allergyService.deleteAllergy(id);
      loadAllergies(); // Refresh the list
    } catch (err) {
      setError(err.message || 'Failed to delete allergy');
    }
  };

  if (loading) {
    return <div className="loading">Loading allergies...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={loadAllergies}>Retry</button>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <h1>My Allergies ({allergies.length})</h1>
      
      {allergies.map(allergy => (
        <div key={allergy._id} className="allergy-card">
          <h3>{allergy.name}</h3>
          <p>Severity: {allergy.severity}</p>
          <p>Symptoms: {allergy.symptoms?.join(', ')}</p>
          <button onClick={() => handleDeleteAllergy(allergy._id)}>
            Delete
          </button>
        </div>
      ))}
      
      {/* Add allergy form here */}
    </div>
  );
};
```

---

## 📋 Example 2: UserRestaurantPage - Load Restaurants

### **Before (Mock Data)**
```javascript
const [restaurants, setRestaurants] = useState([
  { id: 1, name: 'Safe Eats', location: 'NYC' }
]);
```

### **After (Real API Data)**
```javascript
import { useState, useEffect } from 'react';
import restaurantService from '../services/restaurantService';

const UserRestaurantPage = ({ onLogout }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    allergyFree: ''
  });

  // Load restaurants when component mounts or filters change
  useEffect(() => {
    loadRestaurants();
  }, [filters]);

  const loadRestaurants = async () => {
    try {
      setLoading(true);
      const response = await restaurantService.getAllRestaurants(filters);
      setRestaurants(response.data);
    } catch (err) {
      console.error('Error loading restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationFilter = (location) => {
    setFilters({ ...filters, location });
  };

  const handleAllergyFilter = (allergyFree) => {
    setFilters({ ...filters, allergyFree });
  };

  return (
    <div className="restaurant-page">
      <h1>Allergy-Friendly Restaurants</h1>
      
      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Filter by location"
          value={filters.location}
          onChange={(e) => handleLocationFilter(e.target.value)}
        />
        <select
          value={filters.allergyFree}
          onChange={(e) => handleAllergyFilter(e.target.value)}
        >
          <option value="">All Allergens</option>
          <option value="gluten">Gluten-Free</option>
          <option value="dairy">Dairy-Free</option>
          <option value="nuts">Nut-Free</option>
        </select>
      </div>

      {loading ? (
        <div>Loading restaurants...</div>
      ) : (
        <div className="restaurant-list">
          {restaurants.map(restaurant => (
            <div key={restaurant._id} className="restaurant-card">
              <h3>{restaurant.name}</h3>
              <p>{restaurant.location}</p>
              <p>Rating: {restaurant.allergyRating}/5</p>
              <p>{restaurant.allergyFriendlyMenu?.length || 0} allergy-friendly dishes</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## 📋 Example 3: Profile Component - Get & Update Profile

### **After (Real API Data)**
```javascript
import { useState, useEffect } from 'react';
import userService from '../services/userService';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email
      });
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateProfile(formData);
      setProfile(response.data);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="profile">
      <h1>My Profile</h1>
      
      {editing ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Name"
          />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            placeholder="Email"
          />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p>Name: {profile?.name}</p>
          <p>Email: {profile?.email}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};
```

---

## 📋 Example 4: Add Allergy Form

```javascript
import { useState } from 'react';
import allergyService from '../services/allergyService';

const AddAllergyForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    severity: 'moderate',
    symptoms: '',
    triggers: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Convert comma-separated strings to arrays
      const allergyData = {
        name: formData.name,
        severity: formData.severity,
        symptoms: formData.symptoms.split(',').map(s => s.trim()).filter(Boolean),
        triggers: formData.triggers.split(',').map(t => t.trim()).filter(Boolean),
        notes: formData.notes
      };

      await allergyService.createAllergy(allergyData);
      
      // Reset form
      setFormData({
        name: '',
        severity: 'moderate',
        symptoms: '',
        triggers: '',
        notes: ''
      });

      // Notify parent component
      if (onSuccess) onSuccess();
      
      alert('Allergy added successfully!');
    } catch (err) {
      setError(err.message || 'Failed to add allergy');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-allergy-form">
      <h3>Add New Allergy</h3>
      
      {error && <div className="error">{error}</div>}
      
      <input
        type="text"
        placeholder="Allergy Name (e.g., Peanuts)"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required
      />
      
      <select
        value={formData.severity}
        onChange={(e) => setFormData({...formData, severity: e.target.value})}
      >
        <option value="low">Low</option>
        <option value="moderate">Moderate</option>
        <option value="high">High</option>
        <option value="severe">Severe</option>
      </select>
      
      <input
        type="text"
        placeholder="Symptoms (comma-separated)"
        value={formData.symptoms}
        onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
      />
      
      <input
        type="text"
        placeholder="Triggers (comma-separated)"
        value={formData.triggers}
        onChange={(e) => setFormData({...formData, triggers: e.target.value})}
      />
      
      <textarea
        placeholder="Notes"
        value={formData.notes}
        onChange={(e) => setFormData({...formData, notes: e.target.value})}
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Adding...' : 'Add Allergy'}
      </button>
    </form>
  );
};
```

---

## 📋 Example 5: Dashboard Stats

```javascript
import { useState, useEffect } from 'react';
import userService from '../services/userService';

const DashboardStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await userService.getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading stats...</div>;

  return (
    <div className="dashboard-stats">
      <div className="stat-card">
        <h3>Total Allergies</h3>
        <p className="stat-number">{stats?.totalAllergies || 0}</p>
      </div>
      
      <div className="stat-card">
        <h3>By Severity</h3>
        {stats?.severityCounts?.map(item => (
          <p key={item._id}>
            {item._id}: {item.count}
          </p>
        ))}
      </div>
      
      <div className="stat-card">
        <h3>Recent Allergies</h3>
        {stats?.recentAllergies?.map(allergy => (
          <p key={allergy._id}>{allergy.name}</p>
        ))}
      </div>
    </div>
  );
};
```

---

## 🎯 Common Patterns

### **1. Loading State**
```javascript
const [loading, setLoading] = useState(true);

// In async function
setLoading(true);
try {
  // API call
} finally {
  setLoading(false);
}

// In render
if (loading) return <div>Loading...</div>;
```

### **2. Error Handling**
```javascript
const [error, setError] = useState(null);

try {
  const data = await service.getData();
  setError(null);
} catch (err) {
  setError(err.message || 'Something went wrong');
}

// In render
{error && <div className="error">{error}</div>}
```

### **3. Refresh Data After Mutation**
```javascript
const handleDelete = async (id) => {
  await allergyService.deleteAllergy(id);
  loadData(); // Refresh the list
};

const handleAdd = async (data) => {
  await allergyService.createAllergy(data);
  loadData(); // Refresh the list
};
```

### **4. Form Submission**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    await service.create(formData);
    setFormData(initialState); // Reset form
    onSuccess(); // Callback
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## ✅ Integration Checklist for Each Component

- [ ] Import necessary services
- [ ] Add state for data, loading, error
- [ ] Create `useEffect` to load data on mount
- [ ] Create async functions for API calls
- [ ] Add loading indicators
- [ ] Add error handling
- [ ] Update UI to use real data
- [ ] Test CRUD operations
- [ ] Handle edge cases (empty lists, errors)

---

**🎉 Now you can update all your components to use real backend data!**

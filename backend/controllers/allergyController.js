import Allergy from '../models/Allergy.js';

// Create new allergy record
export const createAllergy = async (req, res) => {
  try {
    const { name, severity, symptoms, triggers, notes, diagnosedDate, lastReaction } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'Allergy name is required' });
    }

    const allergy = await Allergy.create({ 
      user: req.user.id, 
      name, 
      severity, 
      symptoms: symptoms || [],
      triggers: triggers || [],
      notes,
      diagnosedDate,
      lastReaction
    });
    
    res.status(201).json({
      success: true,
      message: 'Allergy record created successfully',
      data: allergy
    });
  } catch (err) {
    console.error('Create allergy error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Get all allergies for logged-in user
export const getAllergies = async (req, res) => {
  try {
    const allergies = await Allergy.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: allergies.length,
      data: allergies
    });
  } catch (err) {
    console.error('Get allergies error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Get single allergy by ID
export const getAllergyById = async (req, res) => {
  try {
    const allergy = await Allergy.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).select('-__v');
    
    if (!allergy) {
      return res.status(404).json({ 
        success: false,
        message: 'Allergy not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      data: allergy
    });
  } catch (err) {
    console.error('Get allergy error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Update allergy record
export const updateAllergy = async (req, res) => {
  try {
    const { name, severity, symptoms, triggers, notes, diagnosedDate, lastReaction } = req.body;
    
    const updated = await Allergy.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { 
        name, 
        severity, 
        symptoms, 
        triggers, 
        notes,
        diagnosedDate,
        lastReaction
      },
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!updated) {
      return res.status(404).json({ 
        success: false,
        message: 'Allergy not found' 
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Allergy updated successfully',
      data: updated
    });
  } catch (err) {
    console.error('Update allergy error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

// Delete allergy record
export const deleteAllergy = async (req, res) => {
  try {
    const removed = await Allergy.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!removed) {
      return res.status(404).json({ 
        success: false,
        message: 'Allergy not found' 
      });
    }
    
    res.status(200).json({ 
      success: true,
      message: 'Allergy deleted successfully' 
    });
  } catch (err) {
    console.error('Delete allergy error:', err);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: err.message 
    });
  }
};

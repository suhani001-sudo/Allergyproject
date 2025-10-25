import Allergy from '../models/Allergy.js';

export const createAllergy = async (req, res) => {
  try {
    const { name, severity, notes } = req.body;
    const allergy = await Allergy.create({ user: req.user.id, name, severity, notes });
    res.status(201).json(allergy);
  } catch (err) {
    console.error('Create allergy error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllergies = async (req, res) => {
  try {
    const allergies = await Allergy.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(allergies);
  } catch (err) {
    console.error('Get allergies error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllergyById = async (req, res) => {
  try {
    const allergy = await Allergy.findOne({ _id: req.params.id, user: req.user.id });
    if (!allergy) return res.status(404).json({ message: 'Allergy not found' });
    res.json(allergy);
  } catch (err) {
    console.error('Get allergy error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateAllergy = async (req, res) => {
  try {
    const { name, severity, notes } = req.body;
    const updated = await Allergy.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { name, severity, notes },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Allergy not found' });
    res.json(updated);
  } catch (err) {
    console.error('Update allergy error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAllergy = async (req, res) => {
  try {
    const removed = await Allergy.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!removed) return res.status(404).json({ message: 'Allergy not found' });
    res.json({ message: 'Allergy deleted' });
  } catch (err) {
    console.error('Delete allergy error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

import Goal from '../models/goal.model.js';


export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 });
    res.json(goals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createGoal = async (req, res) => {
  try {
    const goal = await Goal.create({
      ...req.body,
      createdBy: req.user.id
    });
    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ message: 'Invalid goal data' });
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user.id },
      { currentValue: req.body.currentValue },
      { new: true }
    );
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json(goal);
  } catch (error) {
    res.status(400).json({ message: 'Invalid update' });
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id
    });
    if (!goal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
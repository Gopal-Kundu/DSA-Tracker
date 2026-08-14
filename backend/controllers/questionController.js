const Question = require('../models/Question');
const User = require('../models/User');

const parseTimeTaken = (val) => {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
};

// Get all questions for the logged-in user
const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({ user: req.user._id });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching questions', details: error.message });
  }
};

// Add a new question for the logged-in user
const addQuestion = async (req, res) => {
  try {
    const { topic, name, link, difficulty, youtube, timeTaken, notes, done, revisions } = req.body;

    const newQuestion = new Question({
      topic,
      name,
      link,
      difficulty,
      youtube: youtube || '',
      timeTaken: parseTimeTaken(timeTaken),
      notes: notes || '',
      done: done || false,
      revisions: revisions || 0,
      user: req.user._id
    });

    await newQuestion.save();

    // Add reference to User schema
    await User.findByIdAndUpdate(req.user._id, { $push: { questions: newQuestion._id } });

    res.status(201).json({ success: true, question: newQuestion });
  } catch (error) {
    res.status(400).json({ error: 'Failed to create question', details: error.message });
  }
};

// Update question details or status
const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedQuestion = await Question.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ error: 'Question not found or unauthorized' });
    }

    res.json({ success: true, question: updatedQuestion });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update question', details: error.message });
  }
};

// Delete a question
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deletedQuestion) {
      return res.status(404).json({ error: 'Question not found or unauthorized' });
    }

    // Remove reference from User schema
    await User.findByIdAndUpdate(req.user._id, { $pull: { questions: deletedQuestion._id } });

    res.json({ success: true, message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question', details: error.message });
  }
};

// Reset progress for the logged-in user
const resetProgress = async (req, res) => {
  try {
    await Question.updateMany({ user: req.user._id }, { $set: { done: false } });
    res.json({ success: true, message: 'Progress reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset progress', details: error.message });
  }
};

  
// Bulk add questions for the logged-in user
const bulkAddQuestions = async (req, res) => {
  try {
    const rawQuestions = Array.isArray(req.body) ? req.body : req.body.questions;

    if (!Array.isArray(rawQuestions) || rawQuestions.length === 0) {
      return res.status(400).json({ error: 'Please provide a non-empty array of questions' });
    }

    const formattedQuestions = rawQuestions.map(q => ({
      topic: q.topic,
      name: q.name,
      link: q.link,
      difficulty: q.difficulty || 'Medium',
      youtube: q.youtube || '',
      timeTaken: parseTimeTaken(q.timeTaken),
      notes: q.notes || '',
      done: typeof q.done === 'boolean' ? q.done : false,
      revisions: typeof q.revisions === 'number' ? q.revisions : 0,
      user: req.user._id
    }));

    let insertedQuestions;
    try {
      insertedQuestions = await Question.insertMany(formattedQuestions);
    } catch (insertError) {
      if (insertError.code === 11000 || (insertError.message && insertError.message.includes('E11000'))) {
        await Question.collection.dropIndexes().catch(() => {});
        insertedQuestions = await Question.insertMany(formattedQuestions);
      } else {
        throw insertError;
      }
    }

    const insertedIds = insertedQuestions.map(q => q._id);

    // Add references to User schema
    await User.findByIdAndUpdate(req.user._id, {
      $push: { questions: { $each: insertedIds } }
    });

    res.status(201).json({
      success: true,
      count: insertedQuestions.length,
      questions: insertedQuestions
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to bulk upload questions', details: error.message });
  }
};

module.exports = {
  getAllQuestions,
  addQuestion,
  bulkAddQuestions,
  updateQuestion,
  deleteQuestion,
  resetProgress
};




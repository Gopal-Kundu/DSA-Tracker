const Question = require('../models/Question');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const parseTimeTaken = (val) => {
  const num = parseFloat(val);
  return isNaN(num) ? 0 : Math.round(num * 100) / 100;
};


// Get questions for logged-in user with API pagination, search, filter, and sorting
const getQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const search = req.query.search ? req.query.search.trim() : '';
    const topic = req.query.topic || 'all';
    const difficulty = req.query.difficulty || 'all';
    const status = req.query.status || 'all';
    const sort = req.query.sort || 'none';

    // Base query for logged-in user
    const query = { user: req.user._id };

    // Search by question name or topic
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { topic: searchRegex }
      ];
    }

    // Filter by Topic
    if (topic !== 'all') {
      query.topic = topic;
    }

    // Filter by Difficulty
    if (difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    // Filter by Solved Status
    if (status !== 'all') {
      query.done = status === 'solved';
    }

    // Build aggregation pipeline for accurate sorting & pagination
    const matchStage = { $match: query };

    const addFieldsStage = {
      $addFields: {
        difficultyOrder: {
          $switch: {
            branches: [
              { case: { $eq: ["$difficulty", "Easy"] }, then: 1 },
              { case: { $eq: ["$difficulty", "Medium"] }, then: 2 },
              { case: { $eq: ["$difficulty", "Hard"] }, then: 3 }
            ],
            default: 4
          }
        }
      }
    };

    let sortStage = { $sort: { createdAt: -1, _id: -1 } };
    if (sort === 'time-asc') sortStage = { $sort: { timeTaken: 1, createdAt: -1 } };
    else if (sort === 'time-desc') sortStage = { $sort: { timeTaken: -1, createdAt: -1 } };
    else if (sort === 'rev-asc') sortStage = { $sort: { revisions: 1, createdAt: -1 } };
    else if (sort === 'rev-desc') sortStage = { $sort: { revisions: -1, createdAt: -1 } };
    else if (sort === 'diff-asc') sortStage = { $sort: { difficultyOrder: 1, createdAt: -1 } };
    else if (sort === 'diff-desc') sortStage = { $sort: { difficultyOrder: -1, createdAt: -1 } };
    else if (sort === 'name-asc') sortStage = { $sort: { name: 1, createdAt: -1 } };
    else if (sort === 'name-desc') sortStage = { $sort: { name: -1, createdAt: -1 } };
    else if (sort === 'status-solved') sortStage = { $sort: { done: -1, createdAt: -1 } };
    else if (sort === 'status-unsolved') sortStage = { $sort: { done: 1, createdAt: -1 } };
    else if (sort === 'created-asc') sortStage = { $sort: { createdAt: 1, _id: 1 } };
    else sortStage = { $sort: { createdAt: -1, _id: -1 } };

    // Total count of matching questions
    const totalQuestions = await Question.countDocuments(query);
    const totalPages = Math.ceil(totalQuestions / limit) || 1;
    const safePage = Math.min(Math.max(1, page), totalPages);

    const questions = await Question.aggregate([
      matchStage,
      addFieldsStage,
      sortStage,
      { $skip: (safePage - 1) * limit },
      { $limit: limit }
    ]);

    // Compute stats across all user questions (unfiltered)
    const allUserQuestions = await Question.find({ user: req.user._id }).select('topic done difficulty');
    const topicsSet = new Set(allUserQuestions.map(q => q.topic));

    const stats = {
      total: allUserQuestions.length,
      solved: allUserQuestions.filter(q => q.done).length,
      percentage: allUserQuestions.length > 0 ? Math.round((allUserQuestions.filter(q => q.done).length / allUserQuestions.length) * 100) : 0,
      totalTopics: topicsSet.size,
      difficulty: {
        Easy: { solved: 0, total: 0 },
        Medium: { solved: 0, total: 0 },
        Hard: { solved: 0, total: 0 }
      }
    };

    allUserQuestions.forEach(q => {
      if (stats.difficulty[q.difficulty]) {
        stats.difficulty[q.difficulty].total += 1;
        if (q.done) stats.difficulty[q.difficulty].solved += 1;
      }
    });

    const topicsList = Array.from(topicsSet).sort();

    res.json({
      questions,
      totalQuestions,
      totalPages,
      currentPage: safePage,
      limit,
      stats,
      topicsList
    });
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

// Refine note text using Google Gemini API
const refineNoteWithAI = async (req, res) => {
  try {
    const { notes, name, topic } = req.body;

    if (!notes || !notes.trim()) {
      return res.status(400).json({ error: 'Please write some note text before refining with AI.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(400).json({
        error: 'Gemini API key is not configured. Please add GEMINI_API_KEY in backend .env file.'
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `You are a helpful text refinement assistant.
The user wrote study notes for a DSA problem ("${name || 'DSA Problem'}" - ${topic || 'General'}).

Raw Notes:
"""
${notes.trim()}
"""

Task:
Refine the raw notes above by ONLY fixing grammar, spelling, punctuation, and sentence clarity.
CRITICAL RULES:
1. Do NOT change the original meaning, intent, or core logic of the notes.
2. Do NOT add new sections, template headers, or fake information that was not in the original note.
3. Keep the original structure and formatting style intact while making the text clean, readable, and grammatically correct.
4. Do NOT output any intro/outro or meta commentary (like "Here is the refined note:"). Return ONLY the refined text itself.`;


    const modelNamesToTry = [
      process.env.GEMINI_MODEL || 'gemini-2.0-flash-lite',
      'gemini-2.0-flash-lite',
      'gemini-1.5-flash',
      'gemini-2.0-flash'
    ];

    let refinedText = '';
    let lastError = null;

    for (const modelName of [...new Set(modelNamesToTry)]) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        refinedText = response.text();
        if (refinedText && refinedText.trim()) {
          break;
        }
      } catch (err) {
        console.warn(`Gemini model ${modelName} attempt failed:`, err.message);
        lastError = err;
      }
    }

    if (!refinedText) {
      throw lastError || new Error('Failed to generate response from Gemini API');
    }

    return res.json({
      success: true,
      refinedNotes: refinedText.trim()
    });
  } catch (error) {
    console.error('AI Refine error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to refine note with AI'
    });
  }
};

module.exports = {
  getQuestions,
  addQuestion,
  bulkAddQuestions,
  updateQuestion,
  deleteQuestion,
  resetProgress,
  refineNoteWithAI
};





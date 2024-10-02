const express = require('express');
const {
  createJobPost,
  getAllJobPosts,
  getJobPostById,
  applyForJobPost,
  getApplicantsForJobPost,
  updateJobPost,
  deleteJobPost
} = require('../controllers/JobPostController');

const router = express.Router();

// Create a job post
router.post('/create', createJobPost);

// Get all job posts
router.get('/all', getAllJobPosts);

// Get a job post by ID
router.get('/:id', getJobPostById);

// Apply for a job post
router.post('/apply/:id', applyForJobPost);

// Get applicants for a job post
router.get('/applicants/:id', getApplicantsForJobPost);

// Update a job post
router.put('/update/:id', updateJobPost);

// Delete a job post
router.delete('/delete/:id', deleteJobPost);

module.exports = router;

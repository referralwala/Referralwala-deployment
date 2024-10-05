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

const jwtMiddleware = require('../middleware/jwtMiddleware'); 

const router = express.Router();

// Create a job post
router.post('/create',jwtMiddleware, createJobPost);

// Get all job posts
router.get('/all', jwtMiddleware,getAllJobPosts);

// Get a job post by ID
router.get('/:id',jwtMiddleware, getJobPostById);

// Apply for a job post
router.post('/apply/:id',jwtMiddleware, applyForJobPost);

// Get applicants for a job post
router.get('/applicants/:id', jwtMiddleware,getApplicantsForJobPost);

// Update a job post
router.put('/update/:id',jwtMiddleware, updateJobPost);

// Delete a job post
router.delete('/delete/:id',jwtMiddleware, deleteJobPost);

module.exports = router;

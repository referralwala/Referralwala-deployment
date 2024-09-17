const express = require('express');
const { createProfile, getProfileById, getProfileByEmail, getAllProfiles, updateProfile } = require('../controllers/UserProfileController');
const router = express.Router();

// Create a profile
router.post('/create', createProfile);

// Get a profile by ID
router.get('/id/:id', getProfileById);

// Get a profile by email
router.get('/email/:email', getProfileByEmail);

// Update a profile by ID
router.put('/update/:id', updateProfile);

// Get all profiles
router.get('/all', getAllProfiles);

module.exports = router;

const express = require('express');
const { createProfile, getProfile, updateProfile, uploadResume } = require('../controllers/userProfileController');

const router = express.Router();


router.post('/create', createProfile);
router.get('/:id', getProfile);
router.get('/:email', getProfile);
router.put('/update/:id', updateProfile);
router.post('/upload-resume', uploadResume);

module.exports = router;

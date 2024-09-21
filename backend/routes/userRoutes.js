
const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOTP, forgotPassword, resetPassword, resendOTP , getAllProfiles, getProfileById, getProfileByEmail, updateProfileById} = require('../controllers/UserController');

const jwtMiddleware = require('../middleware/jwtMiddleware'); 

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword); 
router.post('/resend-otp', resendOTP);
router.get('/profile/:id',  jwtMiddleware, getProfileById);
router.get('/profile/email/:email', jwtMiddleware,  getProfileByEmail);
router.get('/profiles', jwtMiddleware,  getAllProfiles);
router.put('/profile/:id', jwtMiddleware,  updateProfileById);

module.exports = router;

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); 
const nodemailer = require('nodemailer');

require('dotenv').config(); 

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendEmail = async (recipient, otp, subject = 'OTP for Registration') => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_EMAIL,
    to: recipient,
    subject,
    text: `Your OTP is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

exports.registerUser = async (req, res) => {
  try {
    const { email, mobileNumber, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email }, { mobileNumber: mobileNumber }],
    });

    if (existingUser) {
      const errorMessage =
        existingUser.email === email
          ? 'User with this email already exists'
          : 'User with this mobile number already exists';
      return res.status(400).json({ error: errorMessage });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate OTP and send it via email
    const otp = generateOTP();
    await sendEmail(email, otp);

    user = new User({
      email,
      mobileNumber,
      password: hashedPassword,
      otp, // Save the OTP to the user document
    });

    await user.save();

    res.json({ message: 'Please verify OTP sent to your email before logging in.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.verifyOTP = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { email, otp } = req.body;
    console.log('Email:', email);
    console.log('OTP:', otp);

    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.isOTPVerified) {
      return res.status(400).json({ error: 'OTP already verified' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    user.isOTPVerified = true;
    user.otp = null; 
    await user.save();

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if the OTP is verified before allowing login
    if (!user.isOTPVerified) {
      return res.status(403).json({ error: 'Please verify OTP first' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const expiresIn = '1h'; 

    // Create and send the JWT token for successful login
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn });
    res.json({ token, isOTPVerified: true, userId: user._id }); 
    console.log(token);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};





exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate OTP and send it via email
    const otp = generateOTP();
    await sendEmail(email, otp, 'OTP for Password Reset');

    // Save the OTP to the user document for password reset verification
    user.otp = otp;
    await user.save();

    res.json({ message: 'Please check your email for the OTP to reset your password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify the OTP
    if (user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Update the user's password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    user.otp = null; // Clear the OTP after password reset
    await user.save();

    res.json({ message: 'Password reset successful. You can now login with the new password.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};



exports.resendOTP = async (req, res) => {
  // Implementation of resendOTP function
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Generate new OTP and send it via email
    const otp = generateOTP();
    await sendEmail(email, otp);

    // Save the new OTP to the user document
    user.otp = otp;
    await user.save();

    res.json({ message: 'New OTP sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get profile by ID
exports.getProfileById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get profile by email
exports.getProfileByEmail = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all profiles
exports.getAllProfiles = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update profile by ID
exports.updateProfileById = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



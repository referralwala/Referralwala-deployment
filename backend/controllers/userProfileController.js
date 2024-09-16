const UserProfile = require('../models/UserProfile');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/resumes'); 
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.pdf') {
      return cb(new Error('Only PDFs are allowed'), false);
    }
    cb(null, true);
  },
});

// @route   POST /profile
// @desc    Create user profile
exports.createProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender, aboutMe, presentCompany, education, experience, skills, achievements, preferences, links } = req.body;

    let profile = await UserProfile.findOne({ email });
    if (profile) {
      return res.status(400).json({ msg: 'Profile already exists' });
    }

    profile = new UserProfile({
      firstName,
      lastName,
      email,
      phone,
      gender,
      aboutMe,
      presentCompany,
      education,
      experience,
      skills,
      achievements,
      preferences,
      links,
      resume: req.file ? req.file.path : null, 
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /profile/:email
// @desc    Get user profile by email
exports.getProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ email: req.params.email });
    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    res.status(200).json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// @route   PUT /profile/:email
// @desc    Update user profile
exports.updateProfile = async (req, res) => {
  const { firstName, lastName, phone, gender, aboutMe, presentCompany, education, experience, skills, achievements, preferences, links } = req.body;

  const profileFields = {
    firstName,
    lastName,
    phone,
    gender,
    aboutMe,
    presentCompany,
    education,
    experience,
    skills,
    achievements,
    preferences,
    links,
    resume: req.file ? req.file.path : null, 
  };

  try {
    let profile = await UserProfile.findOne({ email: req.params.email });

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    profile = await UserProfile.findOneAndUpdate(
      { email: req.params.email },
      { $set: profileFields },
      { new: true }
    );

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.uploadResume = upload.single('resume');

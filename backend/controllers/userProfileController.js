const UserProfile = require('../models/UserProfile');

exports.createProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, gender, aboutMe, presentCompany, education, experience, skills, achievements, preferences, links, resume } = req.body;

    let profile = await UserProfile.findOne({ email });
    if (profile) {
      throw new Error('Profile already exists'); 
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
      resume,
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    
    console.error(err.message);
    if (err.message === 'Profile already exists') {
      return res.status(400).json({ msg: err.message });
    }
    res.status(500).send('Server Error');
  }
};



exports.updateProfile = async (req, res) => {
  const { id } = req.params; 
  const updateData = req.body; 

  try {
   
    const profile = await UserProfile.findById(id);

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        profile[key] = updateData[key];
      }
    });

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


exports.getProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await UserProfile.findById(id);

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error('Error fetching profile by ID:', err.message);
    res.status(500).send('Server Error');
  }
};


exports.getProfileByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const profile = await UserProfile.findOne({ email });

    if (!profile) {
      return res.status(404).json({ msg: 'Profile not found' });
    }

    res.status(200).json(profile);
  } catch (err) {
    console.error('Error fetching profile by email:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getAllProfiles = async (req, res) => {
  try {
    console.log('Fetching all profiles');
    const profiles = await UserProfile.find(); 
    if (profiles.length === 0) {
      return res.status(404).json({ msg: 'No profiles found' }); 
    }
    console.log('Profiles fetched:', profiles);
    res.status(200).json(profiles); 
  } catch (err) {
    console.error('Error fetching profiles:', err.message);
    res.status(500).send('Server Error'); 
  }
};

const JobPost = require('../models/JobPost');
const User = require('../models/User');

// @route   POST /job/create
// @desc    Create a new job referral post
exports.createJobPost = async (req, res) => {
  try {
    const { userId, jobRole, companyName, jobDescription, experienceRequired, location, workMode, employmentType, ctc, noOfReferrals, jobLink } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User  not found' });
    }

    const newJobPost = new JobPost({
      user: userId,
      jobRole,
      companyName,
      jobDescription,
      experienceRequired,
      location,
      workMode,
      employmentType,
      ctc,
      noOfReferrals,
      jobLink,
    });

    await newJobPost.save();
    res.status(201).json(newJobPost);
  } catch (err) {
    console.error('Error creating job post:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /job/all
// @desc    Get all job referral posts
exports.getAllJobPosts = async (req, res) => {
  try {
    const jobPosts = await JobPost.find().populate('user', 'firstName lastName email');
    res.status(200).json(jobPosts);
  } catch (err) {
    console.error('Error fetching job posts:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /job/:id
// @desc    Get a job post by ID
exports.getJobPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const jobPost = await JobPost.findById(id).populate('user', 'firstName lastName email');
    
    if (!jobPost) {
      return res.status(404).json({ msg: 'Job post not found' });
    }

    res.status(200).json(jobPost);
  } catch (err) {
    console.error('Error fetching job post:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   POST /job/apply/:id
// @desc    Apply for a job post
exports.applyForJobPost = async (req, res) => {
  try {
    const { id } = req.params; // Job Post ID
    const { userId } = req.body; // User ID applying for the job

    const jobPost = await JobPost.findById(id);
    if (!jobPost) {
      return res.status(404).json({ msg: 'Job post not found' });
    }

    // Check if the user has already applied
    if (jobPost.applicants.includes(userId)) {
      return res.status(400).json({ msg: 'User already applied for this job' });
    }

    // Add the applicant to the job post
    jobPost.applicants.push(userId);
    await jobPost.save();

    res.status(200).json({ msg: 'Applied successfully', jobPost });
  } catch (err) {
    console.error('Error applying for job:', err.message);
    res.status(500).send('Server Error');
  }
};

// @route   GET /job/applicants/:id
// @desc    Get all applicants for a job post
exports.getApplicantsForJobPost = async (req, res) => {
  try {
    const { id } = req.params; // Job Post ID

    const jobPost = await JobPost.findById(id).populate('applicants', 'firstName lastName email');
    if (!jobPost) {
      return res.status(404).json({ msg: 'Job post not found' });
    }

    res.status(200).json(jobPost.applicants);
  } catch (err) {
    console.error('Error fetching applicants:', err.message);
    res.status(500).send('Server Error');
  }
};


// @route   PUT /job/update/:id
// @desc    Update a job post
exports.updateJobPost = async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      const jobPost = await JobPost.findById(id);
      if (!jobPost) {
        return res.status(404).json({ msg: 'Job post not found' });
      }
  
      // Update the job post with new data
      Object.assign(jobPost, updates);
  
      await jobPost.save();
      res.status(200).json({ msg: 'Job post updated', jobPost });
    } catch (err) {
      console.error('Error updating job post:', err.message);
      res.status(500).send('Server Error');
    }
  };

  
  // @route   DELETE /job/delete/:id
// @desc    Delete a job post
// @route   DELETE /job/delete/:id
// @desc    Delete a job post
exports.deleteJobPost = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log('Deleting job post with ID:', id); // Log the ID for debugging

        const jobPost = await JobPost.findById(id);
        if (!jobPost) {
            return res.status(404).json({ msg: 'Job post not found' });
        }

        await JobPost.deleteOne({ _id: id }); // Use deleteOne instead of remove
        res.status(200).json({ msg: 'Job post deleted successfully' });
    } catch (err) {
        console.error('Error deleting job post:', err.message);
        res.status(500).send('Server Error');
    }
};

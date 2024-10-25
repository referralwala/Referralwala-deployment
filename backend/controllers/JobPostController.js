const JobPost = require('../models/JobPost');
const User = require('../models/User');
const Notification = require('../models/Notification');
const ApplicantStatus = require('../models/ApplicantStatus');
const mongoose = require('mongoose'); 

// @route   POST /job/create
// @desc    Create a new job referral post
exports.createJobPost = async (req, res) => {
    try {
      const { userId, jobRole, jobUniqueId, endDate, companyName, jobDescription, experienceRequired, location, workMode, employmentType, ctc, noOfReferrals, jobLink } = req.body;
  
      // Check if the user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ msg: 'User not found' });
      }
  
      // Create a new job post
      const newJobPost = new JobPost({
        user: userId,
        jobRole,
        companyName,
        jobDescription,
        experienceRequired,
        location,
        workMode,
        jobUniqueId,
        endDate,
        employmentType,
        ctc,
        noOfReferrals,
        jobLink,
        endDate
      });
  
      // Save the job post
      await newJobPost.save();
  
      // Populate followers of the user who created the job post
      const populatedUser = await User.findById(userId).populate('followers');
      
      // Send notifications to each follower
      populatedUser.followers.forEach(follower => {
        const notification = new Notification({
          user: follower._id,
          message: `${user.firstName} ${user.lastName} has posted a new job: ${jobRole} at ${companyName}`, // Changed title to jobRole
          post: newJobPost._id,
        });
        notification.save(); // Save the notification
      });
  
      // Respond with the newly created job post
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
    const currentDate = new Date();

    // Update all expired job posts to inactive
    await JobPost.updateMany(
      { endDate: { $lt: currentDate }, status: 'active' },
      { $set: { status: 'inactive' } }
    );

    // Retrieve all job posts with the updated statuses
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

    // Check and update the status if the endDate has passed
    if (jobPost.endDate < new Date() && jobPost.status === 'active') {
      jobPost.status = 'inactive';
      await jobPost.save();
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

    const jobPost = await JobPost.findById(id).populate('user', 'firstName lastName email');
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

    // Store the applicant status
    await ApplicantStatus.create({
      userId,
      jobPostId: jobPost._id,
      status: 'applied',
    });

    // Update user's applied jobs
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { appliedJobs: jobPost._id } }, // Use $addToSet to avoid duplicates
      { new: true } // Return the updated document
    );

    // Retrieve user info to get the first name
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Create a notification for the job post creator
    const notification = new Notification({
      user: jobPost.user,
      message: `${user.firstName} has applied for your job: ${jobPost.jobRole} at ${jobPost.companyName}`,
      post: jobPost._id,
    });

    await notification.save();

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

    // Find the job post with the given ID
    const jobPost = await JobPost.findById(id);
    if (!jobPost) {
      return res.status(404).json({ msg: 'Job post not found' });
    }

    // Fetch applicants and their statuses
    const applicants = await ApplicantStatus.find({ jobPostId: jobPost._id })
      .populate('userId', 'firstName lastName email'); // Populate user details

    // Return applicants along with their status
    res.status(200).json(applicants);
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

        // Find the job post by ID
        const jobPost = await JobPost.findById(id);
        if (!jobPost) {
            return res.status(404).json({ msg: 'Job post not found' });
        }

        // Save the original userId to fetch followers later
        const userId = jobPost.user; 

        // Update the job post with new data
        Object.assign(jobPost, updates);

        await jobPost.save();

        // Fetch the user who created the job post and populate their followers
        const user = await User.findById(userId).populate('followers');

        // Prepare notifications to be sent to each follower
        const notificationPromises = user.followers.map(follower => {
            const notification = new Notification({
                user: follower._id,
                message: `${user.firstName} ${user.lastName} has updated a job post: ${jobPost.jobRole} at ${jobPost.companyName}`, // Ensure `companyName` is accessible
                post: jobPost._id,
            });
            return notification.save(); // Return the promise for saving the notification
        });

        // Wait for all notifications to be saved
        await Promise.all(notificationPromises);

        res.status(200).json({ msg: 'Job post updated', jobPost });
    } catch (err) {
        console.error('Error updating job post:', err.message);
        res.status(500).send('Server Error');
    }
};

  

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

exports.getUserApplicationStatuses = async (req, res) => {
  try {
    const { userId } = req.params; // Extract user ID from parameters

    // Validate ObjectId format for userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: 'Invalid user ID format' });
    }

    // Find all applicant statuses for the given user
    const applicantStatuses = await ApplicantStatus.find({ userId })
      .populate('jobPostId', 'jobRole companyName jobUniqueId') // Populate job details
      .exec();

    if (applicantStatuses.length === 0) {
      return res.status(404).json({ msg: 'No applications found for this user' });
    }

    // Return applicant statuses along with job details
    res.status(200).json(applicantStatuses);
  } catch (err) {
    console.error('Error fetching user application statuses:', err.message);
    res.status(500).send('Server Error');
  }
};

exports.getApplicationStatusForJobPost = async (req, res) => {
  try {
    const { userId, jobPostId } = req.params; // Extract user ID and job post ID from parameters

    // Validate ObjectId format for userId and jobPostId
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(jobPostId)) {
      return res.status(400).json({ msg: 'Invalid user ID or job post ID format' });
    }

    // Find the applicant status for the specified user and job post
    const applicantStatus = await ApplicantStatus.findOne({ userId, jobPostId })
      .populate('jobPostId', 'jobRole companyName jobUniqueId'); // Populate job details

    if (!applicantStatus) {
      return res.status(404).json({ msg: 'No application found for this job post' });
    }

    // Return the applicant status along with job details
    res.status(200).json(applicantStatus);
  } catch (err) {
    console.error('Error fetching application status for job post:', err.message);
    res.status(500).send('Server Error');
  }
};


exports.getJobsByJobUniqueId = async (req, res) => {
  try {
    const { jobUniqueId } = req.params; // Extract jobUniqueId from parameters

    // Validate jobUniqueId (optional)
    if (!jobUniqueId) {
      return res.status(400).json({ msg: 'Job Unique ID is required' });
    }

    // Find all job posts with the specified jobUniqueId
    const jobs = await JobPost.find({ jobUniqueId }).populate('user', 'firstName lastName email'); // Populate creator's info

    // Check if any jobs were found
    if (jobs.length === 0) {
      return res.status(404).json({ msg: 'No jobs found with this unique ID' });
    }

    // Return the list of jobs with their details
    res.status(200).json(jobs);
  } catch (err) {
    console.error('Error fetching jobs by unique ID:', err.message);
    res.status(500).send('Server Error');
  }
};


// @route   PUT /:jobId/applicant/:applicantId/status
// @desc    Update the status of an applicant for a specific job post


// @route   PUT /:jobId/applicant/:applicantId/status
// @desc    Update the status of an applicant for a specific job post
exports.updateApplicantStatus = async (req, res) => {
  try {
    const { jobId, applicantId } = req.params; // Extract job ID and applicant ID from the parameters
    const { status } = req.body; // New status for the applicant

    // Validate status
    const validStatuses = ['applied', 'selected', 'rejected', 'on hold'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ msg: 'Invalid status' });
    }

    // Validate ObjectId format for jobId and applicantId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(404).json({ msg: 'Job post not found' });
    }

    if (!mongoose.Types.ObjectId.isValid(applicantId)) {
      return res.status(404).json({ msg: 'Applicant not found' });
    }

    // Check if the job post exists
    const jobPost = await JobPost.findById(jobId);
    if (!jobPost) {
      return res.status(404).json({ msg: 'Job post not found' });
    }

    // Check if the applicant has been selected for the same jobUniqueId
    const existingSelection = await ApplicantStatus.findOne({
      userId: applicantId,
      status: 'selected',
      jobPostId: { $ne: jobId } // Exclude the current jobId
    }).populate('jobPostId');

    if (existingSelection && existingSelection.jobPostId.jobUniqueId === jobPost.jobUniqueId) {
      return res.status(400).json({ msg: 'User is already selected for another job with the same unique ID.' });
    }

    // Find the applicant status for the specified job and applicant
    const applicantStatus = await ApplicantStatus.findOne({ userId: applicantId, jobPostId: jobId });
    if (!applicantStatus) {
      return res.status(404).json({ msg: 'Applicant not found' });
    }

    // Update the status
    applicantStatus.status = status;
    await applicantStatus.save();

    // Optionally, create a notification about the status change
    const user = await User.findById(applicantId);
    if (user) {
      const notification = new Notification({
        user: jobPost.user,
        message: `The status of ${user.firstName} ${user.lastName}'s application for ${jobPost.jobRole} at ${jobPost.companyName} has been updated to ${status}.`,
        post: jobPost._id,
      });

      await notification.save();
    }

    res.status(200).json({ msg: 'Applicant status updated successfully', applicantStatus });
  } catch (err) {
    console.error('Error updating applicant status:', err.message);
    res.status(500).send('Server Error');
  }
};


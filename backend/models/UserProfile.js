
const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  level: {
    type: String, 
    required: true,
  },
  schoolName: {
    type: String,
    required: true,
  },
  yearOfPassing: {
    type: Number,
    required: true,
  },
});


const ExperienceSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
});


const PresentCompanySchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  yearsOfExperience: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  currentCTC: {
    type: Number,
    required: true,
  },
});


const PreferencesSchema = new mongoose.Schema({
  preferredCompanyName: {
    type: String,
  },
  preferredPosition: {
    type: String,
  },
  expectedCTCRange: {
    type: String, 
  },
});

const LinksSchema = new mongoose.Schema({
  github: {
    type: String,
  },
  portfolio: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  facebook: {
    type: String,
  },
  instagram: {
    type: String,
  },
  other: {
    type: String,
  },
});

const UserProfileSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  aboutMe: {
    type: String,
  },
  presentCompany: PresentCompanySchema, 
  education: [EducationSchema],
  experience: [ExperienceSchema], 
  skills: {
    type: [String], 
  },
  achievements: {
    type: String, 
  },
  preferences: PreferencesSchema, 
  links: LinksSchema, 
  resume: {
    type: String, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('UserProfile', UserProfileSchema);

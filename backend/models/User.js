const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Education schema
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

// Experience schema
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

// Present Company schema
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

// Preferences schema
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

// Links schema
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

// Combined User schema
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    default: null,
  },
  isOTPVerified: {
    type: Boolean,
    default: false,
  },
  isAdmin: {
    type: Boolean,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },
  aboutMe: {
    type: String,
  },
  profileImg:{
    type: String,
  },
  presentCompany: PresentCompanySchema, 
  education: [EducationSchema],
  experience: [ExperienceSchema], 
  skills: {
    type: [String], 
  },
  achievements: {
    type: [String], 
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

const User = mongoose.model('User', userSchema);

module.exports = User;

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  console.log('test');
  const { name, email, mobile, password } = req.body;

  try {
    
    let user = await User.findOne({ $or: [{ email }, { mobile }] });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      mobile,
      password: await bcrypt.hash(password, 10), 
    });

    await user.save();

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

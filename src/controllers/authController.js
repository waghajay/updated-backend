const bcrypt = require('bcryptjs');
const { User, Provider } = require('../models');
const generateToken = require('../utils/generateToken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken({ id: user.id, role: user.role });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toJSON();

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.signupCustomer = async (req, res) => {
  const { name, email, mobile, address, password } = req.body;

  try {
    if (await User.findOne({ where: { email } })) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      role: 'customer',
    });

    res.status(201).json({ message: 'Customer registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.signupProvider = async (req, res) => {
  const {
    name,
    email,
    mobile,
    password,
    address,
    age,
    gender,
    category,
    experience,
    price,
    salaryRange,
    availabilityType,
    gpsRadius,
    skills,
    overview,
    workType,
    emergencyAvailable,
    idProof,
  } = req.body;

  try {
    if (await User.findOne({ where: { email } })) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      role: 'provider',
    });

    await Provider.create({
      userId: user.id,
      age,
      gender,
      category,
      experience,
      price,
      salaryRange,
      availabilityType,
      gpsRadius,
      skills,
      overview,
      workType,
      emergencyAvailable,
      idProof,
    });

    res.status(201).json({ message: 'Provider registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
};
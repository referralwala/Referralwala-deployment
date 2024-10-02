const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const jobPostRoutes = require('./routes/jobPostRoutes');
dotenv.config();

const app = express();

connectDB();

app.use(express.json());


app.use('/user', userRoutes);
app.use('/job', jobPostRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

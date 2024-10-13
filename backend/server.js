const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const userRoutes = require('./routes/userRoutes');
const jobPostRoutes = require('./routes/jobPostRoutes');
const cron = require('node-cron');
const Notification = require('./models/Notification');
dotenv.config();

const app = express();

connectDB();

app.use(express.json());
cron.schedule('0 0 * * *', async () => {
    try {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      await Notification.deleteMany({ createdAt: { $lt: sevenDaysAgo } });
      console.log('Old notifications deleted successfully.');
    } catch (err) {
      console.error('Error deleting old notifications:', err.message);
    }
  });

  app.get('/', (req, res) => {
    res.send('Server Running Successfully');
});

app.use('/user', userRoutes);
app.use('/job', jobPostRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

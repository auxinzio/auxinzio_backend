const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./src/routes/authRoutes');
const teamRoutes = require('./src/routes/teamRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const solutionRoutes = require('./src/routes/solutionRoutes');
const subscriberRoutes = require('./src/routes/subscriberRoutes');
const careerRoutes = require('./src/routes/careerRoutes');
const applicationRoutes = require('./src/routes/applicationRoutes');
const settingRoutes = require('./src/routes/settingRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const productRoutes = require('./src/routes/productRoutes');
const faqRoutes = require('./src/routes/faqRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
  console.log(`Server running on port ${PORT}`);
  res.send('auxinz Backend Running 🚀');
});

app.use('/api/auth', authRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/solutions', solutionRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/feedbacks', feedbackRoutes);
app.use('/api/products', productRoutes);
app.use('/api/faq', faqRoutes);

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("DB_HOST =", process.env.DB_HOST);
  console.log("DB_USER =", process.env.DB_USER);
  console.log("DB_PASS =", process.env.DB_PASS);
  console.log("DB_NAME =", process.env.DB_NAME);
  console.log("DB_PORT =", process.env.DB_PORT);
  console.log(`Server running on port ${PORT}`);
});

app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err);
  res.status(500).json({ message: err.message });
});
require('dotenv').config();
const express = require('express');
const configureCors = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');

const symptomRoutes = require('./routes/symptoms');
const remedyRoutes = require('./routes/remedies');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(configureCors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'RepertoryAI Backend' });
});

app.use('/api/symptoms', symptomRoutes);
app.use('/api/remedies', remedyRoutes);
app.use('/api', aiRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`RepertoryAI backend running on port ${PORT}`);
});

module.exports = app;

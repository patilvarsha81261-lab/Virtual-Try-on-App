require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const garmentsRouter = require('./routes/garments.routes');
const tryonRouter = require('./routes/tryon.routes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Static garment images (uploaded + seed assets)
app.use('/assets/garments', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/garments', garmentsRouter);
app.use('/api/tryon', tryonRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'virtual-tryon-backend' });
});

app.listen(PORT, () => {
  console.log(`Virtual try-on backend running on http://localhost:${PORT}`);
});

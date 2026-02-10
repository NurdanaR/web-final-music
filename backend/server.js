import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';


import authRoutes from './routes/auth.js';
import musicRoutes from './routes/music.js';
import favoritesRoutes from './routes/favorites.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





connectDB();

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/favorites', favoritesRoutes);


app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Music Platform API is running',
    timestamp: new Date().toISOString()
  });
});


app.use(express.static(path.join(__dirname, '../public')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});



app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API Route not found'
  });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
});
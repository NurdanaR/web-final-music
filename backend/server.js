import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';

// Route Imports
import authRoutes from './routes/auth.js';
import musicRoutes from './routes/music.js';
import favoritesRoutes from './routes/favorites.js';

// Setup __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables


// Connect to database
connectDB();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/favorites', favoritesRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Music Platform API is running',
    timestamp: new Date().toISOString()
  });
});

// --- Frontend Serving ---
// This serves all files in the 'public' folder (HTML, CSS, JS)
// Note: Adjusted path to look for 'public' relative to the project root
app.use(express.static(path.join(__dirname, '../public')));

// SPA support: redirection to index.html for any non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// --- Error Handling ---

// 404 handler (for API routes that don't exist)
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API Route not found'
  });
});

// Global Error handler
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
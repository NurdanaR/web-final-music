import express from 'express';
import { body } from 'express-validator';
import {
  addFavorite,
  removeFavorite,
  getFavorites,
  getRecentSearches,
  clearRecentSearches
} from '../controllers/favoritesController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

const addFavoriteValidation = [
  body('type')
    .isIn(['track', 'artist', 'album'])
    .withMessage('Type must be track, artist, or album'),
  body('name')
    .notEmpty()
    .withMessage('Name is required'),
  body('artist')
    .optional()
    .trim(),
  body('mbid')
    .optional()
    .trim(),
  body('image')
    .optional()
    .trim(),
  body('url')
    .optional()
    .trim()
];

router.get('/', getFavorites);
router.post('/', addFavoriteValidation, validate, addFavorite);
router.delete('/:favoriteId', removeFavorite);

router.get('/searches/recent', getRecentSearches);
router.delete('/searches/recent', clearRecentSearches);

export default router;
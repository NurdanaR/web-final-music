import express from 'express';
import {
  search,
  getTrackInfo,
  getArtistInfo,
  getAlbumInfo,
  getTopTracks,
  getTopArtists,
  getArtistTopTracks,
  getArtistTopAlbums,
  getSimilarArtists,
  getSimilarTracks,
  getTopTags,
  getTopTracksByTag,
  getTopArtistsByTag,
  getTopAlbumsByTag
} from '../controllers/musicController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Search routes
router.get('/search', optionalAuth, search);

// Info routes
router.get('/track/info', getTrackInfo);
router.get('/artist/info', getArtistInfo);
router.get('/album/info', getAlbumInfo);

// Chart routes
router.get('/charts/tracks', getTopTracks);
router.get('/charts/artists', getTopArtists);

// Artist routes
router.get('/artist/top-tracks', getArtistTopTracks);
router.get('/artist/top-albums', getArtistTopAlbums);
router.get('/artist/similar', getSimilarArtists);

// Track routes
router.get('/track/similar', getSimilarTracks);

// Tag routes
router.get('/tags', getTopTags);
router.get('/tags/tracks', getTopTracksByTag);
router.get('/tags/artists', getTopArtistsByTag);
router.get('/tags/albums', getTopAlbumsByTag);

export default router;
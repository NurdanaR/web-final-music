import lastfm from '../utils/lastfm.js';
import User from '../models/user.js';

export const search = async (req, res) => {
  try {
    const { q, type = 'track', limit = 20, page = 1 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    let results;

    switch (type) {
      case 'track':
        results = await lastfm.searchTracks(q, limit, page);
        break;
      case 'artist':
        results = await lastfm.searchArtists(q, limit, page);
        break;
      case 'album':
        results = await lastfm.searchAlbums(q, limit, page);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid search type. Use: track, artist, or album'
        });
    }

    if (req.user) {
      try {
        await User.findByIdAndUpdate(req.user._id, {
          $push: {
            recentSearches: {
              $each: [{
                query: q,
                type: type,
                searchedAt: new Date()
              }],
              $slice: -10
            }
          }
        });
      } catch (saveError) {
        console.error("History Save Error:", saveError.message);
      }
    }

    res.json({
      success: true,
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTrackInfo = async (req, res) => {
  try {
    const { artist, track, mbid } = req.query;

    if (!mbid && (!artist || !track)) {
      return res.status(400).json({
        success: false,
        message: 'Either mbid or both artist and track are required'
      });
    }

    const trackInfo = await lastfm.getTrackInfo(artist, track, mbid);

    res.json({
      success: true,
      data: trackInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getArtistInfo = async (req, res) => {
  try {
    const { artist, mbid } = req.query;

    if (!mbid && !artist) {
      return res.status(400).json({
        success: false,
        message: 'Either mbid or artist is required'
      });
    }

    const artistInfo = await lastfm.getArtistInfo(artist, mbid);

    res.json({
      success: true,
      data: artistInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getAlbumInfo = async (req, res) => {
  try {
    const { artist, album, mbid } = req.query;

    if (!mbid && (!artist || !album)) {
      return res.status(400).json({
        success: false,
        message: 'Either mbid or both artist and album are required'
      });
    }

    const albumInfo = await lastfm.getAlbumInfo(artist, album, mbid);

    res.json({
      success: true,
      data: albumInfo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTopTracks = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const tracks = await lastfm.getTopTracks(limit, page);

    res.json({
      success: true,
      data: tracks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getTopArtists = async (req, res) => {
  try {
    const { limit = 50, page = 1 } = req.query;
    const artists = await lastfm.getTopArtists(limit, page);

    res.json({
      success: true,
      data: artists
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getArtistTopTracks = async (req, res) => {
  try {
    const { artist, mbid, limit = 10 } = req.query;

    if (!mbid && !artist) {
      return res.status(400).json({
        success: false,
        message: 'Either mbid or artist is required'
      });
    }

    const topTracks = await lastfm.getArtistTopTracks(artist, mbid, limit);

    res.json({
      success: true,
      data: topTracks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getArtistTopAlbums = async (req, res) => {
  try {
    const { artist, mbid, limit = 10 } = req.query;

    if (!mbid && !artist) {
      return res.status(400).json({
        success: false,
        message: 'Either mbid or artist is required'
      });
    }

    const topAlbums = await lastfm.getArtistTopAlbums(artist, mbid, limit);

    res.json({
      success: true,
      data: topAlbums
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSimilarArtists = async (req, res) => {
  try {
    const { artist, mbid, limit = 10 } = req.query;

    if (!mbid && !artist) {
      return res.status(400).json({
        success: false,
        message: 'Either mbid or artist is required'
      });
    }

    const similarArtists = await lastfm.getSimilarArtists(artist, mbid, limit);

    res.json({
      success: true,
      data: similarArtists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getSimilarTracks = async (req, res) => {
  try {
    const { artist, track, mbid, limit = 10 } = req.query;

    if (!mbid && (!artist || !track)) {
      return res.status(400).json({
        success: false,
        message: 'Either mbid or both artist and track are required'
      });
    }

    const similarTracks = await lastfm.getSimilarTracks(artist, track, mbid, limit);

    res.json({
      success: true,
      data: similarTracks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTopTags = async (req, res) => {
  try {
    const topTags = await lastfm.getTopTags();

    res.json({
      success: true,
      data: topTags
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTopTracksByTag = async (req, res) => {
  try {
    const { tag, limit = 50, page = 1 } = req.query;

    if (!tag) {
      return res.status(400).json({
        success: false,
        message: 'Tag is required'
      });
    }

    const tracks = await lastfm.getTopTracksByTag(tag, limit, page);

    res.json({
      success: true,
      data: tracks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTopArtistsByTag = async (req, res) => {
  try {
    const { tag, limit = 50, page = 1 } = req.query;

    if (!tag) {
      return res.status(400).json({
        success: false,
        message: 'Tag is required'
      });
    }

    const artists = await lastfm.getTopArtistsByTag(tag, limit, page);

    res.json({
      success: true,
      data: artists
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getTopAlbumsByTag = async (req, res) => {
  try {
    const { tag, limit = 50, page = 1 } = req.query;

    if (!tag) {
      return res.status(400).json({
        success: false,
        message: 'Tag is required'
      });
    }

    const albums = await lastfm.getTopAlbumsByTag(tag, limit, page);

    res.json({
      success: true,
      data: albums
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
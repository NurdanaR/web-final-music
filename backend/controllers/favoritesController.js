import User from '../models/user.js';

// Add to favorites
export const addFavorite = async (req, res) => {
  try {
    const { type, name, artist, mbid, image, url } = req.body;
    
    if (!type || !name) {
      return res.status(400).json({
        success: false,
        message: 'Type and name are required'
      });
    }
    
    if (!['track', 'artist', 'album'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be track, artist, or album'
      });
    }
    
    const user = await User.findById(req.user._id);
    
    // Check if already in favorites
    const existingFavorite = user.favorites.find(
      fav => fav.type === type && fav.name === name && fav.artist === artist
    );
    
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Already in favorites'
      });
    }
    
    // Add to favorites
    user.favorites.push({
      type,
      name,
      artist,
      mbid,
      image,
      url
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Added to favorites',
      data: {
        favorites: user.favorites
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Remove from favorites
export const removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;
    
    const user = await User.findById(req.user._id);
    
    const favoriteIndex = user.favorites.findIndex(
      fav => fav._id.toString() === favoriteId
    );
    
    if (favoriteIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }
    
    user.favorites.splice(favoriteIndex, 1);
    await user.save();
    
    res.json({
      success: true,
      message: 'Removed from favorites',
      data: {
        favorites: user.favorites
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get all favorites
export const getFavorites = async (req, res) => {
  try {
    const { type } = req.query;
    
    const user = await User.findById(req.user._id);
    
    let favorites = user.favorites;
    
    if (type) {
      favorites = favorites.filter(fav => fav.type === type);
    }
    
    res.json({
      success: true,
      data: {
        favorites: favorites.sort((a, b) => b.addedAt - a.addedAt)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get recent searches
export const getRecentSearches = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: {
        recentSearches: user.recentSearches.sort((a, b) => b.searchedAt - a.searchedAt)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Clear recent searches
export const clearRecentSearches = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      recentSearches: []
    });
    
    res.json({
      success: true,
      message: 'Recent searches cleared'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
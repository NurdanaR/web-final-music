import axios from 'axios';

const LASTFM_BASE_URL = 'https://ws.audioscrobbler.com/2.0/';

class LastFMService {
  constructor() {
    this.apiKey = process.env.LASTFM_API_KEY;
    this.apiSecret = process.env.LASTFM_API_SECRET;
  }

  async makeRequest(params) {
  try {
    const config = {
      params: {
        ...params,
        api_key: this.apiKey,
        format: 'json'
      }
    };
    
    // DEBUG LOG: Copy this URL from your terminal into a browser to test it
    console.log(`Last.fm Request: ${LASTFM_BASE_URL}?method=${params.method}&track=${encodeURIComponent(params.track || '')}&api_key=${this.apiKey}&format=json`);
    const response = await axios.get(LASTFM_BASE_URL, config);
    return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.message || 'Last.fm API error');
    }
  }

  // Search tracks
 async searchTracks(query, limit = 20, page = 1) {
  const data = await this.makeRequest({
    method: 'track.search',
    track: query,
    limit,
    page
  });
  // Last.fm nesting is results -> trackmatches -> track (array)
  return data.results?.trackmatches?.track || [];
}
// Search artists
async searchArtists(query, limit = 20, page = 1) {
  const data = await this.makeRequest({
    method: 'artist.search',
    artist: query,
    limit,
    page
  });
  // Artist nesting: results -> artistmatches -> artist
  return data.results?.artistmatches?.artist || [];
}

// Search albums
async searchAlbums(query, limit = 20, page = 1) {
  const data = await this.makeRequest({
    method: 'album.search',
    album: query,
    limit,
    page
  });
  // Album nesting: results -> albummatches -> album
  return data.results?.albummatches?.album || [];
}
  // Get track info
  async getTrackInfo(artist, track, mbid = null) {
    const params = {
      method: 'track.getInfo'
    };
    
    if (mbid) {
      params.mbid = mbid;
    } else {
      params.artist = artist;
      params.track = track;
    }
    
    const data = await this.makeRequest(params);
    return data.track;
  }

  // Get artist info
  async getArtistInfo(artist, mbid = null) {
    const params = {
      method: 'artist.getInfo'
    };
    
    if (mbid) {
      params.mbid = mbid;
    } else {
      params.artist = artist;
    }
    
    const data = await this.makeRequest(params);
    return data.artist;
  }

  // Get album info
  async getAlbumInfo(artist, album, mbid = null) {
    const params = {
      method: 'album.getInfo'
    };
    
    if (mbid) {
      params.mbid = mbid;
    } else {
      params.artist = artist;
      params.album = album;
    }
    
    const data = await this.makeRequest(params);
    return data.album;
  }

  // Get top tracks
  // In LastFMService.js

  // Get top tracks
  async getTopTracks(limit = 50, page = 1) {
    const data = await this.makeRequest({
      method: 'chart.getTopTracks',
      limit,
      page
    });
    // FIX: Return the array directly
    return data.tracks?.track || [];
  }

  // Get top artists
  async getTopArtists(limit = 50, page = 1) {
    const data = await this.makeRequest({
      method: 'chart.getTopArtists',
      limit,
      page
    });
    // FIX: Return the array directly
    return data.artists?.artist || [];
  }

  // Get artist top tracks
  async getArtistTopTracks(artist, mbid = null, limit = 10) {
    const params = {
      method: 'artist.getTopTracks',
      limit
    };
    
    if (mbid) {
      params.mbid = mbid;
    } else {
      params.artist = artist;
    }
    
    const data = await this.makeRequest(params);
    return data.toptracks;
  }

  // Get artist top albums
  async getArtistTopAlbums(artist, mbid = null, limit = 10) {
    const params = {
      method: 'artist.getTopAlbums',
      limit
    };
    
    if (mbid) {
      params.mbid = mbid;
    } else {
      params.artist = artist;
    }
    
    const data = await this.makeRequest(params);
    return data.topalbums;
  }

  // Get similar artists
  async getSimilarArtists(artist, mbid = null, limit = 10) {
    const params = {
      method: 'artist.getSimilar',
      limit
    };
    
    if (mbid) {
      params.mbid = mbid;
    } else {
      params.artist = artist;
    }
    
    const data = await this.makeRequest(params);
    return data.similarartists;
  }

  // Get similar tracks
  async getSimilarTracks(artist, track, mbid = null, limit = 10) {
    const params = {
      method: 'track.getSimilar',
      limit
    };
    
    if (mbid) {
      params.mbid = mbid;
    } else {
      params.artist = artist;
      params.track = track;
    }
    
    const data = await this.makeRequest(params);
    return data.similartracks;
  }

  // Get album tracks
  async getAlbumTracks(artist, album, mbid = null) {
    const albumInfo = await this.getAlbumInfo(artist, album, mbid);
    return albumInfo.tracks;
  }

  // Search by tag
  async getTopTracksByTag(tag, limit = 50, page = 1) {
    const data = await this.makeRequest({
      method: 'tag.getTopTracks',
      tag,
      limit,
      page
    });
    return data.tracks;
  }

  async getTopArtistsByTag(tag, limit = 50, page = 1) {
    const data = await this.makeRequest({
      method: 'tag.getTopArtists',
      tag,
      limit,
      page
    });
    return data.topartists;
  }

  async getTopAlbumsByTag(tag, limit = 50, page = 1) {
    const data = await this.makeRequest({
      method: 'tag.getTopAlbums',
      tag,
      limit,
      page
    });
    return data.albums;
  }

  // Get top tags
  async getTopTags() {
    const data = await this.makeRequest({
      method: 'tag.getTopTags'
    });
    return data.toptags;
  }
}

export default new LastFMService();
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
      
      const response = await axios.get(LASTFM_BASE_URL, config);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Last.fm API error');
    }
  }

  async searchTracks(query, limit = 20, page = 1) {
    const data = await this.makeRequest({
      method: 'track.search',
      track: query,
      limit,
      page
    });
    
    return data.results?.trackmatches?.track || [];
  }

  async searchArtists(query, limit = 20, page = 1) {
    const data = await this.makeRequest({
      method: 'artist.search',
      artist: query,
      limit,
      page
    });

    return data.results?.artistmatches?.artist || [];
  }

  async searchAlbums(query, limit = 20, page = 1) {
    const data = await this.makeRequest({
      method: 'album.search',
      album: query,
      limit,
      page
    });
    return data.results?.albummatches?.album || [];
  }

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

  async getTopTracks(limit = 50, page = 1) {
    const data = await this.makeRequest({
      method: 'chart.getTopTracks',
      limit,
      page
    });
    return data.tracks?.track || [];
  }

  async getTopArtists(limit = 50, page = 1) {
    const data = await this.makeRequest({
      method: 'chart.getTopArtists',
      limit,
      page
    });
    return data.artists?.artist || [];
  }

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

  async getAlbumTracks(artist, album, mbid = null) {
    const albumInfo = await this.getAlbumInfo(artist, album, mbid);
    return albumInfo.tracks;
  }

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

  async getTopTags() {
    const data = await this.makeRequest({
      method: 'tag.getTopTags'
    });
    return data.toptags;
  }
}

export default new LastFMService();
# API Testing Examples

This file contains example requests you can use to test the Music Platform API.

## Prerequisites

1. Start the server: `npm start`
2. Have MongoDB running
3. Server should be running on http://localhost:3000

## Testing Tools

You can use any of these tools:
- **Postman** - GUI-based API testing
- **cURL** - Command line
- **Thunder Client** - VS Code extension
- **Insomnia** - API client
- **Built-in Web Interface** - http://localhost:3000

---

## 1. Health Check

### cURL
```bash
curl http://localhost:3000/api/health
```

### Expected Response
```json
{
  "success": true,
  "message": "Music Platform API is running",
  "timestamp": "2024-02-10T12:00:00.000Z"
}
```

---

## 2. User Registration

### cURL
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "musicfan",
    "email": "musicfan@example.com",
    "password": "password123"
  }'
```

### Expected Response
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "musicfan",
      "email": "musicfan@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Save the token for authenticated requests!**

---

## 3. User Login

### cURL
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "musicfan@example.com",
    "password": "password123"
  }'
```

### Expected Response
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "username": "musicfan",
      "email": "musicfan@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

## 4. Get Current User

### cURL
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with the token from login/register.

---

## 5. Search for Tracks

### cURL
```bash
curl "http://localhost:3000/api/music/search?q=bohemian%20rhapsody&type=track&limit=5"
```

### Try These Searches
```bash

curl "http://localhost:3000/api/music/search?q=queen&type=artist"


curl "http://localhost:3000/api/music/search?q=abbey%20road&type=album"


curl "http://localhost:3000/api/music/search?q=rock&type=track&limit=10&page=2"
```

---

## 6. Get Track Information

### cURL
```bash
curl "http://localhost:3000/api/music/track/info?artist=Queen&track=Bohemian%20Rhapsody"
```

### More Examples
```bash

curl "http://localhost:3000/api/music/track/info?artist=John%20Lennon&track=Imagine"


curl "http://localhost:3000/api/music/track/info?artist=Led%20Zeppelin&track=Stairway%20to%20Heaven"
```

---

## 7. Get Artist Information

### cURL
```bash
curl "http://localhost:3000/api/music/artist/info?artist=The%20Beatles"
```

### More Examples
```bash

curl "http://localhost:3000/api/music/artist/info?artist=Pink%20Floyd"


curl "http://localhost:3000/api/music/artist/info?artist=Radiohead"
```

---

## 8. Get Album Information

### cURL
```bash
curl "http://localhost:3000/api/music/album/info?artist=Queen&album=A%20Night%20at%20the%20Opera"
```

---

## 9. Get Top Charts

### Top Tracks
```bash
curl "http://localhost:3000/api/music/charts/tracks?limit=20"
```

### Top Artists
```bash
curl "http://localhost:3000/api/music/charts/artists?limit=20"
```

---

## 10. Get Artist Top Tracks

### cURL
```bash
curl "http://localhost:3000/api/music/artist/top-tracks?artist=The%20Beatles&limit=10"
```

### More Examples
```bash
# Get Metallica's top tracks
curl "http://localhost:3000/api/music/artist/top-tracks?artist=Metallica&limit=15"

# Get Taylor Swift's top tracks
curl "http://localhost:3000/api/music/artist/top-tracks?artist=Taylor%20Swift"
```

---

## 11. Get Artist Top Albums

### cURL
```bash
curl "http://localhost:3000/api/music/artist/top-albums?artist=Pink%20Floyd&limit=10"
```

---

## 12. Get Similar Artists

### cURL
```bash
curl "http://localhost:3000/api/music/artist/similar?artist=Radiohead&limit=10"
```

---

## 13. Get Similar Tracks

### cURL
```bash
curl "http://localhost:3000/api/music/track/similar?artist=The%20Beatles&track=Yesterday&limit=10"
```

---

## 14. Get All Tags

### cURL
```bash
curl http://localhost:3000/api/music/tags
```

---

## 15. Get Music by Tag

### Top Tracks by Tag
```bash
curl "http://localhost:3000/api/music/tags/tracks?tag=rock&limit=20"
```

### Top Artists by Tag
```bash
curl "http://localhost:3000/api/music/tags/artists?tag=jazz&limit=20"
```

### Top Albums by Tag
```bash
curl "http://localhost:3000/api/music/tags/albums?tag=electronic&limit=20"
```

### Popular Tags to Try
- rock
- pop
- jazz
- electronic
- metal
- hip-hop
- indie
- classical
- alternative

---

## 16. Add to Favorites (Requires Authentication)

### cURL
```bash
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "type": "track",
    "name": "Bohemian Rhapsody",
    "artist": "Queen",
    "image": "https://lastfm.freetls.fastly.net/i/u/300x300/example.jpg",
    "url": "https://www.last.fm/music/Queen/_/Bohemian+Rhapsody"
  }'
```

### Add Different Types
```bash
# Add an artist
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "type": "artist",
    "name": "The Beatles"
  }'

# Add an album
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "type": "album",
    "name": "Dark Side of the Moon",
    "artist": "Pink Floyd"
  }'
```

---

## 17. Get Favorites (Requires Authentication)

### All Favorites
```bash
curl http://localhost:3000/api/favorites \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Filter by Type
```bash
# Get only track favorites
curl "http://localhost:3000/api/favorites?type=track" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get only artist favorites
curl "http://localhost:3000/api/favorites?type=artist" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get only album favorites
curl "http://localhost:3000/api/favorites?type=album" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 18. Remove from Favorites (Requires Authentication)

### cURL
```bash
curl -X DELETE http://localhost:3000/api/favorites/FAVORITE_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

Replace `FAVORITE_ID_HERE` with the actual ID from your favorites list.

---

## 19. Get Recent Searches (Requires Authentication)

### cURL
```bash
curl http://localhost:3000/api/favorites/searches/recent \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 20. Clear Recent Searches (Requires Authentication)

### cURL
```bash
curl -X DELETE http://localhost:3000/api/favorites/searches/recent \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Complete Workflow Example

Here's a complete workflow testing all major features:

```bash

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'


TOKEN="your_token_here"


curl "http://localhost:3000/api/music/search?q=radiohead&type=artist"


curl "http://localhost:3000/api/music/artist/info?artist=Radiohead"


curl "http://localhost:3000/api/music/artist/top-tracks?artist=Radiohead&limit=5"

curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"type":"artist","name":"Radiohead"}'


curl http://localhost:3000/api/favorites \
  -H "Authorization: Bearer $TOKEN"


curl "http://localhost:3000/api/music/charts/tracks?limit=10"


curl "http://localhost:3000/api/music/tags/tracks?tag=rock&limit=10"
```

---

## Using Postman

### Import Collection

Create a new collection in Postman with these requests:

1. **Set up Environment Variable**
   - Create variable `baseUrl` = `http://localhost:3000/api`
   - Create variable `token` = (set after login)

2. **Example Request Setup**
   - URL: `{{baseUrl}}/music/search`
   - Params: `q=beatles`, `type=artist`
   - Headers: `Authorization: Bearer {{token}}` (for protected routes)

### Postman Collection Structure
```
Music Platform API
├── Health Check
├── Auth
│   ├── Register
│   ├── Login
│   └── Get Me
├── Search
│   ├── Search Tracks
│   ├── Search Artists
│   └── Search Albums
├── Info
│   ├── Track Info
│   ├── Artist Info
│   └── Album Info
├── Charts
│   ├── Top Tracks
│   └── Top Artists
├── Artist
│   ├── Top Tracks
│   ├── Top Albums
│   └── Similar Artists
├── Tags
│   ├── Get All Tags
│   ├── Tracks by Tag
│   ├── Artists by Tag
│   └── Albums by Tag
└── Favorites
    ├── Get Favorites
    ├── Add Favorite
    └── Remove Favorite
```

---

## Troubleshooting

### Common Issues

**401 Unauthorized**
- Check if you're including the Bearer token
- Verify token hasn't expired
- Make sure you're logged in

**400 Bad Request**
- Check request body format
- Verify all required fields are included
- Check parameter names

**404 Not Found**
- Verify the URL is correct
- Check if the resource exists

**500 Internal Server Error**
- Check server logs
- Verify MongoDB is running
- Check Last.fm API status

---


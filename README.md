# Backend Assignment 2 - Random User Information Hub

A comprehensive web application that integrates multiple APIs to display random user information, country details, exchange rates, and news headlines.

## Features

### 1. Random User Generator
- Fetches random user data from RandomUser.me API
- Displays:
  - First name and last name
  - Gender and age
  - Date of birth
  - Profile picture
  - City, country, and full address
- Clean card-based UI with structured sections

### 2. Multiple API Integration
- **REST Countries API**: Retrieves country information including:
  - Country name and capital
  - Official languages
  - Currency details
  - National flag
  - Region and population
  
- **Exchange Rate API**: Shows currency conversions:
  - User's currency to USD
  - User's currency to KZT
  
- **News API**: Fetches 5 latest headlines:
  - Related to the user's country
  - In English language
  - Displays title, image, description, and source link

### 3. Project Organization and Design
- Clean, well-documented code
- Organized project structure
- Responsive and visually appealing UI
- Server-side API logic (not in HTML)
- Professional gradient design with modern cards

## Project Structure

```
ass2/
├── index.js              # Core backend server file (main logic)
├── package.json          # Dependencies and scripts
├── .env                  # Environment variables (API keys)
├── .gitignore           # Git ignore file
├── public/              # Frontend files
│   ├── index.html       # HTML structure
│   ├── style.css        # Responsive CSS styling
│   └── script.js        # Client-side JavaScript
└── README.md            # This file
```

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web server framework
- `axios` - HTTP client for API calls
- `dotenv` - Environment variable management
- `cors` - Cross-origin resource sharing

### 2. Configure API Keys

Got free API keys from:
- **News API**: https://newsapi.org/
- **Exchange Rate API**: https://www.exchangerate-api.com/

Edited the `.env` file and added API keys:

```env
NEWS_API_KEY
EXCHANGE_RATE_API_KEY
```

### 3. Runned the Server

```bash
npm start
```

The server will start on **http://localhost:3000**

### 4. Access the Application

Opened browser and navigated to:
```
http://localhost:3000
```

## Usage

1. Click the "Generate Random User" button
2. The application will:
   - Fetch a random user from the RandomUser API
   - Get country information based on the user's country
   - Retrieve exchange rates for the country's currency
   - Fetch 5 news headlines about the country
3. All data is displayed in organized, visually appealing cards

## API Endpoints

### Backend Server Endpoints

- `GET /api/random-user` - Fetch random user data
- `GET /api/country/:countryName` - Get country information
- `GET /api/exchange-rate/:currency` - Get exchange rates
- `GET /api/news/:country` - Fetch news headlines
- `GET /api/health` - Server health check

## Technical Requirements Met

Server runs on port 3000  
All API logic implemented in index.js (core file)  
Server-side API calls only  
Environment variables for API keys  
Clean code with comments  
Organized project structure  
Responsive design  
Error handling  
package.json with all dependencies  

## Error Handling

- Gracefully handles missing data
- Shows user-friendly error messages
- Validates API responses
- Logs errors to console for debugging
- Displays fallback content when data unavailable


## Development Notes

- All business logic is in `index.js` (backend)
- Frontend only handles UI updates and display
- API keys stored securely in environment variables
- CORS enabled for local development
- Clean separation of concerns

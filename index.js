require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// API Keys from environment variables
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY;

// Debug: Log API keys (first/last 4 chars only for security)
console.log('Loaded API Keys:');
console.log('- NEWS_API_KEY:', NEWS_API_KEY ? `${NEWS_API_KEY.substring(0, 4)}...${NEWS_API_KEY.substring(NEWS_API_KEY.length - 4)}` : 'NOT LOADED');
console.log('- EXCHANGE_RATE_API_KEY:', EXCHANGE_RATE_API_KEY ? `${EXCHANGE_RATE_API_KEY.substring(0, 4)}...${EXCHANGE_RATE_API_KEY.substring(EXCHANGE_RATE_API_KEY.length - 4)}` : 'NOT LOADED');


app.get('/api/random-user', async (req, res) => {
  try {
    const response = await axios.get('https://randomuser.me/api/');
    const user = response.data.results[0];

    // Extract required user information
    const userData = {
      firstName: user.name.first,
      lastName: user.name.last,
      gender: user.gender,
      profilePicture: user.picture.large,
      age: user.dob.age,
      dateOfBirth: user.dob.date,
      city: user.location.city,
      country: user.location.country,
      fullAddress: `${user.location.street.number} ${user.location.street.name}`,
      state: user.location.state,
      postcode: user.location.postcode
    };

    res.json({ success: true, data: userData });
  } catch (error) {
    console.error('Error fetching random user:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch random user data' 
    });
  }
});


app.get('/api/country/:countryName', async (req, res) => {
  try {
    const countryName = req.params.countryName;
    const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
    
    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Country not found' 
      });
    }

    const country = response.data[0];

    // Extract and clean country data
    const countryData = {
      name: country.name.common,
      officialName: country.name.official,
      capital: country.capital ? country.capital[0] : 'N/A',
      languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A',
      currency: country.currencies ? Object.keys(country.currencies)[0] : null,
      currencyName: country.currencies ? Object.values(country.currencies)[0].name : 'N/A',
      currencySymbol: country.currencies ? Object.values(country.currencies)[0].symbol : 'N/A',
      flag: country.flags.svg || country.flags.png,
      region: country.region || 'N/A',
      population: country.population ? country.population.toLocaleString() : 'N/A'
    };

    res.json({ success: true, data: countryData });
  } catch (error) {
    console.error('Error fetching country data:', error.message);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch country data',
      message: error.response?.data?.message || error.message
    });
  }
});


app.get('/api/exchange-rate/:currency', async (req, res) => {
  try {
    const baseCurrency = req.params.currency.toUpperCase();
    
    if (!EXCHANGE_RATE_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'Exchange Rate API key not configured' 
      });
    }

    const response = await axios.get(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/${baseCurrency}`
    );

    if (response.data.result !== 'success') {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid currency code' 
      });
    }

    const rates = response.data.conversion_rates;

    // Extract USD and KZT exchange rates
    const exchangeData = {
      baseCurrency: baseCurrency,
      rates: {
        USD: rates.USD ? rates.USD.toFixed(2) : 'N/A',
        KZT: rates.KZT ? rates.KZT.toFixed(2) : 'N/A'
      },
      lastUpdated: response.data.time_last_update_utc
    };

    res.json({ success: true, data: exchangeData });
  } catch (error) {
    console.error('Error fetching exchange rates:', error.message);
    console.error('Exchange API URL:', `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/...`);
    console.error('Status Code:', error.response?.status);
    console.error('Response Data:', error.response?.data);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch exchange rates',
      message: error.response?.data?.message || error.message
    });
  }
});


app.get('/api/news/:country', async (req, res) => {
  try {
    const country = req.params.country;
    
    if (!NEWS_API_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'News API key not configured' 
      });
    }

    // Search for news containing the country name in English
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: country,
        language: 'en',
        pageSize: 5,
        sortBy: 'publishedAt',
        apiKey: NEWS_API_KEY
      }
    });

    if (!response.data.articles || response.data.articles.length === 0) {
      return res.json({ 
        success: true, 
        data: { articles: [], message: 'No news articles found' }
      });
    }

    // Extract relevant news data
    const articles = response.data.articles.map(article => ({
      title: article.title || 'No title',
      description: article.description || 'No description available',
      image: article.urlToImage || null,
      sourceUrl: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt
    }));

    res.json({ 
      success: true, 
      data: { 
        articles: articles,
        totalResults: response.data.totalResults 
      } 
    });
  } catch (error) {
    console.error('Error fetching news:', error.message);
    console.error('News API Status:', error.response?.status);
    console.error('News API Response:', error.response?.data);
    
    // Return empty articles instead of error so app still works
    res.json({ 
      success: true, 
      data: { 
        articles: [],
        message: `Unable to fetch news: ${error.response?.data?.message || error.message}`
      }
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    apiKeys: {
      newsApi: !!NEWS_API_KEY,
      exchangeRateApi: !!EXCHANGE_RATE_API_KEY
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('API Keys status:');
  console.log('- News API:', NEWS_API_KEY ? 'Configured ✓' : 'Missing ✗');
  console.log('- Exchange Rate API:', EXCHANGE_RATE_API_KEY ? 'Configured ✓' : 'Missing ✗');
});

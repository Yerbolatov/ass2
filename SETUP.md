# Quick Setup Guide

## Step 1: Get Your API Keys

### News API
1. Go to https://newsapi.org/register
2. Sign up for a free account
3. Copy your API key

### Exchange Rate API
1. Go to https://www.exchangerate-api.com/
2. Enter your email and get a free key
3. Copy your API key

## Step 2: Add API Keys to .env File

Open the `.env` file and replace the placeholders:

```
NEWS_API_KEY=paste_your_news_api_key_here
EXCHANGE_RATE_API_KEY=paste_your_exchange_rate_api_key_here
```

## Step 3: Run the Application

```bash
npm start
```

## Step 4: Open in Browser

Navigate to: http://localhost:3000

## That's it! 🎉

Click "Generate Random User" to see the application in action.

---

## Troubleshooting

### Issue: "Cannot connect to server"
- Make sure you ran `npm install`
- Make sure the server is running with `npm start`
- Check that port 3000 is not being used by another application

### Issue: "Exchange Rate API key not configured"
- Make sure you added your API keys to the `.env` file
- Restart the server after adding API keys

### Issue: No news articles showing
- Some countries may not have recent English news articles
- The News API free tier has request limits
- Check that your News API key is valid

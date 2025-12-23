const API_BASE_URL = 'http://localhost:3000/api';

// DOM Elements
const generateBtn = document.getElementById('generateBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const mainContent = document.getElementById('mainContent');

// User Profile Elements
const profilePicture = document.getElementById('profilePicture');
const userName = document.getElementById('userName');
const gender = document.getElementById('gender');
const age = document.getElementById('age');
const dateOfBirth = document.getElementById('dateOfBirth');
const city = document.getElementById('city');
const country = document.getElementById('country');
const fullAddress = document.getElementById('fullAddress');

// Country Elements
const countryFlag = document.getElementById('countryFlag');
const countryName = document.getElementById('countryName');
const capital = document.getElementById('capital');
const languages = document.getElementById('languages');
const currency = document.getElementById('currency');
const region = document.getElementById('region');
const population = document.getElementById('population');

// Exchange Rate Elements
const rateUSD = document.getElementById('rateUSD');
const rateKZT = document.getElementById('rateKZT');

// News Elements
const newsContainer = document.getElementById('newsContainer');

// Event Listeners
generateBtn.addEventListener('click', handleGenerateUser);

/**
 * Main function to generate and display random user data
 */
async function handleGenerateUser() {
    try {
        // Show loading state
        showLoading();
        hideError();
        hideMainContent();

        // Step 1: Fetch random user data
        const userData = await fetchRandomUser();
        displayUserData(userData);

        // Step 2: Fetch country information
        const countryData = await fetchCountryData(userData.country);
        displayCountryData(countryData);

        // Step 3: Fetch exchange rates
        if (countryData.currency) {
            const exchangeData = await fetchExchangeRates(countryData.currency);
            displayExchangeRates(exchangeData, countryData.currency);
        }

        // Step 4: Fetch news articles
        const newsData = await fetchNews(userData.country);
        displayNews(newsData);

        // Show main content
        showMainContent();
        hideLoading();
    } catch (error) {
        console.error('Error:', error);
        showError(error.message || 'An error occurred while fetching data');
        hideLoading();
    }
}

/**
 * Fetch random user from backend
 */
async function fetchRandomUser() {
    const response = await fetch(`${API_BASE_URL}/random-user`);
    const data = await response.json();
    
    if (!data.success) {
        throw new Error(data.error || 'Failed to fetch user data');
    }
    
    return data.data;
}

/**
 * Fetch country data from backend
 */
async function fetchCountryData(countryName) {
    const response = await fetch(`${API_BASE_URL}/country/${encodeURIComponent(countryName)}`);
    const data = await response.json();
    
    if (!data.success) {
        throw new Error(data.error || 'Failed to fetch country data');
    }
    
    return data.data;
}

/**
 * Fetch exchange rates from backend
 */
async function fetchExchangeRates(currencyCode) {
    const response = await fetch(`${API_BASE_URL}/exchange-rate/${currencyCode}`);
    const data = await response.json();
    
    if (!data.success) {
        console.warn('Exchange rate fetch failed:', data.error);
        return null;
    }
    
    return data.data;
}

/**
 * Fetch news articles from backend
 */
async function fetchNews(countryName) {
    const response = await fetch(`${API_BASE_URL}/news/${encodeURIComponent(countryName)}`);
    const data = await response.json();
    
    if (!data.success) {
        console.warn('News fetch failed:', data.error);
        return { articles: [] };
    }
    
    return data.data;
}

/**
 * Display user data on the page
 */
function displayUserData(data) {
    profilePicture.src = data.profilePicture;
    profilePicture.alt = `${data.firstName} ${data.lastName}`;
    userName.textContent = `${data.firstName} ${data.lastName}`;
    gender.textContent = capitalizeFirst(data.gender);
    age.textContent = `${data.age} years old`;
    dateOfBirth.textContent = formatDate(data.dateOfBirth);
    city.textContent = data.city;
    country.textContent = data.country;
    fullAddress.textContent = data.fullAddress;
}

/**
 * Display country data on the page
 */
function displayCountryData(data) {
    countryFlag.src = data.flag;
    countryFlag.alt = `Flag of ${data.name}`;
    countryName.textContent = data.name;
    capital.textContent = data.capital;
    languages.textContent = data.languages;
    currency.textContent = `${data.currencyName} (${data.currency}) ${data.currencySymbol}`;
    region.textContent = data.region;
    population.textContent = data.population;
}

/**
 * Display exchange rates on the page
 */
function displayExchangeRates(data, baseCurrency) {
    if (!data || !data.rates) {
        rateUSD.textContent = 'N/A';
        rateKZT.textContent = 'N/A';
        return;
    }

    rateUSD.textContent = `1 ${baseCurrency} = ${data.rates.USD} USD`;
    rateKZT.textContent = `1 ${baseCurrency} = ${data.rates.KZT} KZT`;
}

/**
 * Display news articles on the page
 */
function displayNews(data) {
    newsContainer.innerHTML = '';

    if (!data.articles || data.articles.length === 0) {
        newsContainer.innerHTML = `
            <div class="no-news">
                <p>📰 No recent news articles found for this country.</p>
            </div>
        `;
        return;
    }

    data.articles.forEach(article => {
        const articleElement = createNewsArticle(article);
        newsContainer.appendChild(articleElement);
    });
}

/**
 * Create a news article element
 */
function createNewsArticle(article) {
    const articleDiv = document.createElement('div');
    articleDiv.className = 'news-article';

    const imageContainer = document.createElement('div');
    imageContainer.className = 'news-image-container';

    if (article.image) {
        const img = document.createElement('img');
        img.src = article.image;
        img.alt = article.title;
        img.className = 'news-image';
        img.onerror = () => {
            imageContainer.innerHTML = '<div class="news-image placeholder">📰</div>';
        };
        imageContainer.appendChild(img);
    } else {
        imageContainer.innerHTML = '<div class="news-image placeholder">📰</div>';
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'news-content';

    const title = document.createElement('h3');
    title.className = 'news-title';
    title.textContent = article.title;

    const description = document.createElement('p');
    description.className = 'news-description';
    description.textContent = article.description;

    const meta = document.createElement('div');
    meta.className = 'news-meta';

    const source = document.createElement('span');
    source.className = 'news-source';
    source.textContent = article.source;

    const link = document.createElement('a');
    link.href = article.sourceUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'news-link';
    link.textContent = 'Read Full Article →';

    meta.appendChild(source);
    contentDiv.appendChild(title);
    contentDiv.appendChild(description);
    contentDiv.appendChild(meta);
    contentDiv.appendChild(link);

    articleDiv.appendChild(imageContainer);
    articleDiv.appendChild(contentDiv);

    return articleDiv;
}

/**
 * Utility Functions
 */

function showLoading() {
    loadingIndicator.classList.remove('hidden');
    generateBtn.disabled = true;
}

function hideLoading() {
    loadingIndicator.classList.add('hidden');
    generateBtn.disabled = false;
}

function showError(message) {
    errorMessage.textContent = `❌ Error: ${message}`;
    errorMessage.classList.remove('hidden');
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function showMainContent() {
    mainContent.classList.remove('hidden');
}

function hideMainContent() {
    mainContent.classList.add('hidden');
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Initialize - Check server health
async function checkServerHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        
        if (!data.success) {
            console.warn('Server health check failed');
        } else {
            console.log('Server is running');
            if (!data.apiKeys.newsApi || !data.apiKeys.exchangeRateApi) {
                console.warn('⚠️ Some API keys are not configured. Please check your .env file.');
            }
        }
    } catch (error) {
        console.error('Could not connect to server:', error);
        showError('Cannot connect to server. Please make sure the server is running on port 3000.');
    }
}

// Run health check on page load
checkServerHealth();

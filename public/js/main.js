// /public/js/main.js

// Global variable to hold the chart instance
let priceChart = null;

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('register-form')) {
    setupAuthListeners();
  } else if (document.getElementById('transaction-form')) {
    setupDashboardListeners();
    setupMarketListeners(); // <-- ADDED: Setup listener for market data
    loadUserTrades();
  }
});


// ======== AUTH PAGE (index.html) LOGIC ========
// (This section is unchanged... scroll past it)
function setupAuthListeners() {
  const registerForm = document.getElementById('register-form');
  const registerMsg = document.getElementById('register-msg');

  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const passwordConfirm = document.getElementById('reg-password-confirm').value;

    if (!username || !email || !password) {
      showMessage(registerMsg, 'Please fill in all fields.', 'danger');
      return;
    }
    if (password !== passwordConfirm) {
      showMessage(registerMsg, 'Passwords do not match!', 'danger');
      return;
    }
    if (password.length < 6) {
      showMessage(registerMsg, 'Password must be at least 6 characters.', 'warning');
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || 'Registration failed');
      }
      showMessage(registerMsg, 'Registration successful! Redirecting...', 'success');
      localStorage.setItem('userId', data.userId);
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 2000);
    } catch (err) {
      showMessage(registerMsg, err.message, 'danger');
    }
  });
}


// ======== DASHBOARD PAGE (dashboard.html) LOGIC ========

// UPDATED to use 'transaction-form'
function setupDashboardListeners() {
  const transactionForm = document.getElementById('transaction-form');
  const tradeMsg = document.getElementById('trade-msg');

  transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const symbol = document.getElementById('trade-symbol').value.toUpperCase();
    const quantity = document.getElementById('trade-quantity').value;
    const price = document.getElementById('trade-price').value;
    const tradeType = document.getElementById('trade-type').value;
    const userId = localStorage.getItem('userId');

    if (!symbol || !quantity || !price || !tradeType) {
      showMessage(tradeMsg, 'Please fill in all transaction details.', 'danger');
      return;
    }
    if (!userId) {
      showMessage(tradeMsg, 'Error: No user logged in. Please log in again.', 'danger');
      return;
    }

    try {
      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, symbol, quantity, price, tradeType }),
      });
      const newTrade = await res.json();
      if (!res.ok) {
        throw new Error(newTrade.msg || 'Failed to save transaction');
      }
      
      showMessage(tradeMsg, 'Transaction submitted successfully!', 'success');
      transactionForm.reset();
      addTradeToDOM(newTrade); 
      
    } catch (err) {
      showMessage(tradeMsg, err.message, 'danger');
    }
  });

  document.getElementById('logout-btn').addEventListener('click', () => {
    localStorage.removeItem('userId');
    window.location.href = '/index.html';
  });
}

// --- Fetch all trades from DB and display them ---
async function loadUserTrades() {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  try {
    const res = await fetch(`/api/trades/${userId}`);
    const trades = await res.json();
    if (res.ok) {
      const tradeListContainer = document.getElementById('trade-list-container');
      tradeListContainer.innerHTML = ''; 
      trades.forEach(trade => addTradeToDOM(trade));
    }
  } catch (err) {
    console.error('Error loading trades:', err);
  }
}

// --- DOM Manipulation Function ---
function addTradeToDOM(trade) {
  const tradeListContainer = document.getElementById('trade-list-container');
  const tradeElement = document.createElement('div');
  tradeElement.classList.add('list-group-item', 'list-group-item-action');
  const isBuy = trade.tradeType === 'BUY';
  const titleColor = isBuy ? 'text-success' : 'text-danger';

  const tradeHTML = `
    <div class="d-flex w-100 justify-content-between">
      <h5 class="mb-1 ${titleColor}">${trade.tradeType}: ${trade.symbol}</h5>
      <small>${new Date(trade.timestamp).toLocaleString()}</small>
    </div>
    <p class="mb-1">${trade.quantity} shares at $${Number(trade.price).toFixed(2)} each</p>
  `;
  tradeElement.innerHTML = tradeHTML;
  tradeListContainer.prepend(tradeElement);
}


// ======== NEW: ALPHA VANTAGE / CHART.JS FUNCTIONS ========

/**
 * Sets up listener for the market data form
 */
function setupMarketListeners() {
  const marketForm = document.getElementById('market-data-form');
  const marketMsg = document.getElementById('market-msg');

  marketForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const symbol = document.getElementById('market-symbol').value.toUpperCase();
    
    if (!symbol) {
      showMessage(marketMsg, 'Please enter a symbol.', 'danger');
      return;
    }

    try {
      showMessage(marketMsg, 'Loading data...', 'info');
      
      // 1. Call OUR backend, not Alpha Vantage directly
      const res = await fetch(`/api/marketdata/${symbol}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Could not fetch data');
      }

      // 2. Process and display the data
      showMessage(marketMsg, `Displaying data for ${symbol}`, 'success');
      processMarketData(data);

    } catch (err) {
      showMessage(marketMsg, err.message, 'danger');
    }
  });
}
// /public/js/main.js

// ======== AUTH PAGE (index.html) LOGIC ========

function setupAuthListeners() {
  const registerForm = document.getElementById('register-form');
  const registerMsg = document.getElementById('register-msg');
  
  // === ADD THIS NEW CODE ===
  const loginForm = document.getElementById('login-form');
  // We can re-use the register-msg div for login messages
  const loginMsg = document.getElementById('register-msg'); 
  // === END OF NEW CODE ===


  // --- REGISTER FORM LISTENER ---
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    // ... all your existing register listener code ...
  });


  // === ADD THIS ENTIRE NEW LISTENER FOR THE LOGIN FORM ===
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // --- JS Validation ---
    if (!email || !password) {
      showMessage(loginMsg, 'Please fill in all fields.', 'danger');
      return;
    }

    try {
      // --- Send Data to Backend API ---
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Login failed');
      }

      // --- Handle Success ---
      showMessage(loginMsg, 'Login successful! Redirecting...', 'success');
      
      // Save user ID to local storage
      localStorage.setItem('userId', data.userId);

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = '/dashboard.html';
      }, 1500); // 1.5 second redirect

    } catch (err) {
      showMessage(loginMsg, err.message, 'danger');
    }
  });
  // === END OF NEW LISTENER ===

}

// ... rest of your main.js file ...
/**
 * Processes data from Alpha Vantage and calls display functions
 */
function processMarketData(data) {
  // Extract the time series data
  const timeSeries = data['Time Series (Daily)'];
  if (!timeSeries) {
    console.error('Data format incorrect:', data);
    return;
  }

  // Get all the dates (keys) from the time series object
  const dates = Object.keys(timeSeries);

  // We want the most recent data, so we'll reverse the dates
  // and take the last 30 days for the chart.
  const labels = dates.slice(0, 30).reverse();
  
  // Extract the "4. close" price for each of those 30 days
  const chartData = labels.map(date => {
    return timeSeries[date]['4. close'];
  });

  const symbol = data['Meta Data']['2. Symbol'];

  // 1. Display simple stats
  displayStats(timeSeries[dates[0]]); // Pass today's data

  // 2. Display the chart
  displayChart(labels, chartData, symbol);
}

/**
 * Uses Chart.js to render the price chart
 */
function displayChart(labels, data, symbol) {
  const ctx = document.getElementById('price-chart').getContext('2d');

  // If a chart already exists, destroy it before drawing a new one
  if (priceChart) {
    priceChart.destroy();
  }

  priceChart = new Chart(ctx, {
    type: 'line', // Line graph
    data: {
      labels: labels, // X-axis (dates)
      datasets: [{
        label: `${symbol} Closing Price`,
        data: data, // Y-axis (prices)
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

/**
 * Displays stats (open, high, low, close) in the market data card
 */
function displayStats(todayData) {
  const statsContainer = document.getElementById('market-stats');

  const open = Number(todayData['1. open']).toFixed(2);
  const high = Number(todayData['2. high']).toFixed(2);
  const low = Number(todayData['3. low']).toFixed(2);
  const close = Number(todayData['4. close']).toFixed(2);

  statsContainer.innerHTML = `
    <h6 class="mt-3">Today's Data</h6>
    <ul class="list-group">
      <li class="list-group-item d-flex justify-content-between">
        <strong>Open:</strong> $${open}
      </li>
      <li class="list-group-item d-flex justify-content-between">
        <strong>High:</strong> $${high}
      </li>
      <li class="list-group-item d-flex justify-content-between">
        <strong>Low:</strong> $${low}
      </li>
      <li class="list-group-item d-flex justify-content-between">
        <strong>Close:</strong> $${close}
      </li>
    </ul>
  `;
}


// --- Helper function to show messages ---
function showMessage(element, message, type) {
  element.innerHTML = `<div class="alert alert-${type}" role="alert">${message}</div>`;
  if (type !== 'info') {
    setTimeout(() => {
      element.innerHTML = '';
    }, 3000);
  }
}
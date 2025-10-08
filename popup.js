// Function to update a DOM element with value or error/loading
function updateElement(id, value, isError = false) {
  const el = document.getElementById(id);
  if (isError) {
    el.textContent = 'Error fetching';
    el.className = 'value error';
  } else if (value === null || value === undefined) {
    el.textContent = 'Loading...';
    el.className = 'value loading';
  } else {
    el.textContent = `$${value.toFixed(2)}`; // Format as currency (stocks/BTC/ETH)
    el.className = 'value';
  }
}

// Fetch JPY to HKD rate
async function fetchJPYtoHKD() {
  try {
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/JPY');
    const data = await response.json();
    const rate = data.rates.HKD;
    updateElement('jpyhkd', rate, false);
    return rate;
  } catch (error) {
    console.error('JPY/HKD error:', error);
    updateElement('jpyhkd', null, true);
  }
}

// Fetch stock price (generic function for TQQQ, SOXL, NET)
async function fetchStockPrice(symbol) {
  try {
    const response = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}`);
    const data = await response.json();
    const price = data.chart.result[0].meta.regularMarketPrice;
    return price;
  } catch (error) {
    console.error(`${symbol} error:`, error);
    return null;
  }
}

// Fetch crypto prices (BTC and ETH)
async function fetchCryptoPrices() {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    const data = await response.json();
    updateElement('btc', data.bitcoin.usd, false);
    updateElement('eth', data.ethereum.usd, false);
  } catch (error) {
    console.error('Crypto error:', error);
    updateElement('btc', null, true);
    updateElement('eth', null, true);
  }
}

// Main update function
async function updateAllData() {
  // Forex
  await fetchJPYtoHKD();
  
  // Stocks
  const tqqqPrice = await fetchStockPrice('TQQQ');
  updateElement('tqqq', tqqqPrice);
  
  const soxlPrice = await fetchStockPrice('SOXL');
  updateElement('soxl', soxlPrice);
  
  const netPrice = await fetchStockPrice('NET');
  updateElement('net', netPrice);
  
  // Crypto
  await fetchCryptoPrices();
  
  // Update timestamp
  document.getElementById('lastUpdate').textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
}

// Initial load and periodic updates
document.addEventListener('DOMContentLoaded', () => {
  updateAllData();
  setInterval(updateAllData, 30000); // Update every 30 seconds
});

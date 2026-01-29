document.addEventListener('DOMContentLoaded', () => {
  console.log('main.js loaded');
  const path = window.location.pathname;

  // Check auth status for protected routes
  if (path.includes('dashboard.html')) {
    checkAuth();
  }

  // Update navigation based on login status
  updateNav();

  // Event Listeners for forms
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    console.log('Login form found');
    loginForm.addEventListener('submit', handleLogin);
  }

  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    console.log('Signup form found');
    signupForm.addEventListener('submit', handleSignup);
  }

  const tripForm = document.getElementById('tripForm');
  if (tripForm) {
    console.log('Trip form found');
    tripForm.addEventListener('submit', handleGenerateItinerary);
  }

  // Logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }

  // Start Planning button on home page
  const startPlanningBtn = document.getElementById('startPlanningBtn');
  if (startPlanningBtn) {
    console.log('Start planning button found');
    startPlanningBtn.addEventListener('click', handleStartPlanning);
  }

  // Feature cards that require login
  const featureCards = document.querySelectorAll('.feature-card');
  featureCards.forEach(card => {
    card.addEventListener('click', handleFeatureClick);
  });

  // Destination card clicks
  const destinationCards = document.querySelectorAll('.destination-card');
  destinationCards.forEach(card => {
    card.addEventListener('click', () => {
      const lat = card.dataset.lat;
      const lon = card.dataset.lon;
      const name = card.dataset.name;
      if (lat && lon) {
        updateHomeMap(parseFloat(lat), parseFloat(lon), name);
      }
    });
  });
});

// Helper function to get auth token
function getAuthToken() {
  return localStorage.getItem('authToken');
}

// Helper function for authenticated fetch requests
async function authFetch(url, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(url, {
    ...options,
    headers
  });
}

function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true' && getAuthToken();
}

function checkAuth() {
  console.log('Checking auth status...');
  if (!isLoggedIn()) {
    console.log('Not logged in, redirecting to login');
    window.location.href = '/login.html';
    return;
  }
  
  // Display user name from localStorage
  const userName = localStorage.getItem('userName');
  const userNameEl = document.getElementById('userName');
  if (userNameEl && userName) {
    userNameEl.textContent = userName;
  }
}

function updateNav() {
  const navLinks = document.getElementById('navLinks');
  if (!navLinks) return;

  if (isLoggedIn()) {
    const userName = localStorage.getItem('userName') || 'User';
    navLinks.innerHTML = `
      <a href="/dashboard.html">Dashboard</a>
      <a href="#" id="logoutBtn">Logout</a>
    `;
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  }
}

async function handleLogin(e) {
  e.preventDefault();
  console.log('Login form submitted');
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const alertEl = document.getElementById('alert');

  if (!email || !password) {
    showAlert(alertEl, 'Please fill in all fields', 'error');
    return;
  }

  try {
    console.log('Sending login request...');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    console.log('Login response:', data);
    
    if (res.ok) {
      // Save login status and token to localStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('authToken', data.token);
      
      console.log('Login successful, token saved, redirecting to dashboard');
      window.location.href = '/dashboard.html';
    } else {
      showAlert(alertEl, data.message || 'Login failed', 'error');
    }
  } catch (err) {
    console.error('Login error:', err);
    showAlert(alertEl, 'An error occurred. Please try again.', 'error');
  }
}

async function handleSignup(e) {
  e.preventDefault();
  console.log('Signup form submitted');
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const alertEl = document.getElementById('alert');

  // Validation
  if (!name || !email || !password) {
    showAlert(alertEl, 'Please fill in all fields', 'error');
    return;
  }

  if (password.length < 3) {
    showAlert(alertEl, 'Password must be at least 3 characters', 'error');
    return;
  }

  if (!email.includes('@')) {
    showAlert(alertEl, 'Please enter a valid email', 'error');
    return;
  }

  try {
    console.log('Sending signup request...');
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    console.log('Signup response:', data);
    
    if (res.ok) {
      showAlert(alertEl, 'Account created successfully! Redirecting to login...', 'success');
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1500);
    } else {
      showAlert(alertEl, data.message || 'Signup failed', 'error');
    }
  } catch (err) {
    console.error('Signup error:', err);
    showAlert(alertEl, 'An error occurred. Please try again.', 'error');
  }
}

function handleLogout(e) {
  e.preventDefault();
  console.log('Logging out...');
  
  const token = getAuthToken();
  
  // Call backend logout with token
  authFetch('/api/logout', { method: 'POST' })
    .finally(() => {
      // Clear localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      localStorage.removeItem('authToken');
      
      window.location.href = '/index.html';
    });
}

function handleStartPlanning(e) {
  e.preventDefault();
  console.log('Start planning clicked');
  
  if (!isLoggedIn()) {
    alert('Please login to start planning your trip');
    window.location.href = '/login.html';
  } else {
    window.location.href = '/dashboard.html';
  }
}

function handleFeatureClick(e) {
  if (!isLoggedIn()) {
    e.preventDefault();
    alert('Login required to use this feature');
    window.location.href = '/login.html';
  }
}

async function handleGenerateItinerary(e) {
  e.preventDefault();
  console.log('Generate itinerary form submitted');
  
  if (!isLoggedIn()) {
    alert('Please login to generate an itinerary');
    window.location.href = '/login.html';
    return;
  }

  const submitBtn = e.target.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Generating...';

  const formData = {
    destination: document.getElementById('destination').value,
    startDate: document.getElementById('startDate').value,
    endDate: document.getElementById('endDate').value,
    budget: document.getElementById('budget').value,
    travellers: document.getElementById('travellers').value
  };

  console.log('Sending itinerary request with token:', formData);

  try {
    // Use authFetch to include Authorization header
    const res = await authFetch('/api/generate-itinerary', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    console.log('Itinerary response:', data);
    
    if (res.ok) {
      displayItinerary(data);
    } else {
      if (res.status === 401) {
        alert('Session expired. Please login again.');
        localStorage.clear();
        window.location.href = '/login.html';
      } else {
        alert(data.message || 'Failed to generate itinerary');
      }
    }
  } catch (err) {
    console.error('Itinerary error:', err);
    alert('Failed to generate itinerary. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Generate AI Itinerary';
  }
}

function displayItinerary(data) {
  const resultDiv = document.getElementById('itineraryResult');
  const contentDiv = document.getElementById('itineraryContent');
  
  resultDiv.style.display = 'block';
  
  let html = `
    <div class="itinerary-header">
      <h3>Trip to ${data.destination}</h3>
      <p>Duration: ${data.duration} | Budget: ${data.budget} | Travellers: ${data.travellers}</p>
    </div>
    <hr style="margin: 1rem 0">
  `;
  
  // Day-wise plan
  html += `<h3>Day-wise Itinerary</h3>`;
  data.plan.forEach(day => {
    html += `
      <div class="day-plan">
        <h4>Day ${day.day}: ${day.title}</h4>
        <ul>
          ${day.activities.map(act => `<li>${act}</li>`).join('')}
        </ul>
      </div>
    `;
  });

  // Hotels
  html += `<h3>Recommended Hotels</h3><div class="grid" style="margin-bottom: 2rem">`;
  data.hotels.forEach(hotel => {
    html += `
      <div class="card">
        <img src="${hotel.image}" alt="${hotel.name}">
        <div class="card-content">
          <h4>${hotel.name}</h4>
          <p>Rating: ${hotel.rating}</p>
          <p>Price: ${hotel.price}</p>
        </div>
      </div>
    `;
  });
  html += `</div>`;

  // Flights
  html += `<h3>Flight Options</h3><div class="grid" style="margin-bottom: 2rem">`;
  data.flights.forEach(flight => {
    html += `
      <div class="card">
        <div class="card-content">
          <h4>${flight.airline}</h4>
          <p>Duration: ${flight.duration}</p>
          <p>Price: ${flight.price}</p>
        </div>
      </div>
    `;
  });
  html += `</div>`;

  // Railways
  html += `<h3>Train Options</h3><div class="grid" style="margin-bottom: 2rem">`;
  data.railways.forEach(train => {
    html += `
      <div class="card">
        <div class="card-content">
          <h4>${train.train}</h4>
          <p>Duration: ${train.duration}</p>
          <p>Price: ${train.price}</p>
        </div>
      </div>
    `;
  });
  html += `</div>`;

  contentDiv.innerHTML = html;
  
  // Initialize Map with destination coordinates
  initMap(data.destination, data.coordinates.lat, data.coordinates.lon);
  resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function initMap(destination, lat, lon) {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;
  
  // Clear existing map if any
  if (mapContainer._leaflet_id) {
    mapContainer._leaflet_id = null;
    mapContainer.innerHTML = '';
  }
  
  const map = L.map('map').setView([lat, lon], 12);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  L.marker([lat, lon]).addTo(map)
    .bindPopup(`<b>${destination}</b><br>Your Destination`)
    .openPopup();
    
  setTimeout(() => { map.invalidateSize(); }, 100);
}

// Initialize home page map
function initHomeMap() {
  const mapContainer = document.getElementById('homeMap');
  if (!mapContainer || mapContainer._leaflet_id) return;
  
  const map = L.map('homeMap').setView([30, 0], 2);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Add markers for all destinations
  const destinations = [
    { name: "Paris", lat: 48.8566, lon: 2.3522 },
    { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
    { name: "New York", lat: 40.7128, lon: -74.0060 },
    { name: "London", lat: 51.5074, lon: -0.1278 },
    { name: "Dubai", lat: 25.2048, lon: 55.2708 },
    { name: "Goa", lat: 15.2993, lon: 74.1240 },
    { name: "Manali", lat: 32.2396, lon: 77.1887 }
  ];

  destinations.forEach(dest => {
    L.marker([dest.lat, dest.lon]).addTo(map)
      .bindPopup(`<b>${dest.name}</b>`);
  });
  
  window.homeMap = map;
  setTimeout(() => { map.invalidateSize(); }, 100);
}

function updateHomeMap(lat, lon, name) {
  if (window.homeMap) {
    window.homeMap.setView([lat, lon], 10);
    L.popup()
      .setLatLng([lat, lon])
      .setContent(`<b>${name}</b>`)
      .openOn(window.homeMap);
  }
}

// Initialize home map when on index page
if (window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
  window.addEventListener('load', initHomeMap);
}

function showAlert(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type}`;
  el.style.display = 'block';
}

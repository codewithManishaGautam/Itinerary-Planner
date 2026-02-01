document.addEventListener('DOMContentLoaded', () => {
  console.log('TripPlanner AI loaded');
  const path = window.location.pathname;

  if (path.includes('dashboard.html')) {
    checkAuth();
  }

  if (path.includes('admin.html')) {
    initAdminPanel();
  }

  updateNav();
  initEventListeners();

  if (path === '/' || path.includes('index.html')) {
    renderDestinations();
    initHomeMap();
  }
});

const defaultDestinations = [
  {
    id: 1,
    name: "Goa",
    location: "India",
    category: "beach",
    description: "India's beach paradise with stunning coastline, vibrant nightlife, Portuguese heritage, and water sports. Famous for Baga, Calangute, and Anjuna beaches.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop",
    lat: 15.2993,
    lon: 74.1240,
    mapQuery: "Goa+India"
  },
  {
    id: 2,
    name: "Manali",
    location: "Himachal Pradesh, India",
    category: "hill-station",
    description: "A stunning hill station in the Himalayas known for snow-capped peaks, adventure sports, ancient temples, and the famous Rohtang Pass.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=400&fit=crop",
    lat: 32.2396,
    lon: 77.1887,
    mapQuery: "Manali+Himachal+Pradesh"
  },
  {
    id: 3,
    name: "Jaipur",
    location: "Rajasthan, India",
    category: "historical",
    description: "The Pink City with magnificent forts, palaces, and vibrant bazaars. Home to Amber Fort, Hawa Mahal, and City Palace.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=400&fit=crop",
    lat: 26.9124,
    lon: 75.7873,
    mapQuery: "Jaipur+Rajasthan"
  },
  {
    id: 4,
    name: "Rishikesh",
    location: "Uttarakhand, India",
    category: "adventure",
    description: "The yoga capital of the world and adventure hub for white water rafting, bungee jumping, and trekking along the Ganges.",
    image: "https://images.unsplash.com/photo-1600100397608-e1f2c9f4b8a7?w=600&h=400&fit=crop",
    lat: 30.0869,
    lon: 78.2676,
    mapQuery: "Rishikesh+Uttarakhand"
  },
  {
    id: 5,
    name: "Andaman Islands",
    location: "India",
    category: "beach",
    description: "Pristine tropical islands with crystal-clear waters, coral reefs, and exotic marine life. Perfect for snorkeling and scuba diving.",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600&h=400&fit=crop",
    lat: 11.7401,
    lon: 92.6586,
    mapQuery: "Andaman+Islands+India"
  },
  {
    id: 6,
    name: "Shimla",
    location: "Himachal Pradesh, India",
    category: "hill-station",
    description: "Queen of Hills with colonial architecture, Mall Road, scenic toy train ride, and panoramic Himalayan views.",
    image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600&h=400&fit=crop",
    lat: 31.1048,
    lon: 77.1734,
    mapQuery: "Shimla+Himachal+Pradesh"
  },
  {
    id: 7,
    name: "Agra",
    location: "Uttar Pradesh, India",
    category: "historical",
    description: "Home to the iconic Taj Mahal, one of the Seven Wonders of the World. Also features Agra Fort and Fatehpur Sikri.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop",
    lat: 27.1767,
    lon: 78.0081,
    mapQuery: "Taj+Mahal+Agra"
  },
  {
    id: 8,
    name: "Ladakh",
    location: "India",
    category: "adventure",
    description: "Land of high passes with stunning landscapes, Buddhist monasteries, Pangong Lake, and thrilling mountain roads.",
    image: "https://images.unsplash.com/photo-1614159102234-09b79a8ed929?w=600&h=400&fit=crop",
    lat: 34.1526,
    lon: 77.5771,
    mapQuery: "Ladakh+India"
  },
  {
    id: 9,
    name: "Kerala Backwaters",
    location: "Kerala, India",
    category: "beach",
    description: "Serene network of lagoons, lakes, and canals. Experience houseboat cruises through palm-fringed waterways.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&h=400&fit=crop",
    lat: 9.4981,
    lon: 76.3388,
    mapQuery: "Kerala+Backwaters"
  },
  {
    id: 10,
    name: "Darjeeling",
    location: "West Bengal, India",
    category: "hill-station",
    description: "Famous for tea gardens, the Darjeeling Himalayan Railway, stunning sunrise views, and colonial charm.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600&h=400&fit=crop",
    lat: 27.0410,
    lon: 88.2663,
    mapQuery: "Darjeeling+West+Bengal"
  },
  {
    id: 11,
    name: "Varanasi",
    location: "Uttar Pradesh, India",
    category: "historical",
    description: "One of the world's oldest living cities. Spiritual capital of India with ancient ghats, temples, and Ganga Aarti.",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&h=400&fit=crop",
    lat: 25.3176,
    lon: 82.9739,
    mapQuery: "Varanasi+Ghats"
  },
  {
    id: 12,
    name: "Spiti Valley",
    location: "Himachal Pradesh, India",
    category: "adventure",
    description: "A cold desert mountain valley with ancient monasteries, dramatic landscapes, and stargazing opportunities.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop",
    lat: 32.2464,
    lon: 78.0349,
    mapQuery: "Spiti+Valley"
  },
  {
    id: 13,
    name: "Puducherry",
    location: "India",
    category: "beach",
    description: "Former French colony with charming colonial architecture, pristine beaches, and the spiritual Auroville township.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop",
    lat: 11.9416,
    lon: 79.8083,
    mapQuery: "Pondicherry+India"
  },
  {
    id: 14,
    name: "Ooty",
    location: "Tamil Nadu, India",
    category: "hill-station",
    description: "Queen of Nilgiris with botanical gardens, tea estates, and the famous Nilgiri Mountain Railway.",
    image: "https://images.unsplash.com/photo-1585136917228-04accf859fc4?w=600&h=400&fit=crop",
    lat: 11.4102,
    lon: 76.6950,
    mapQuery: "Ooty+Tamil+Nadu"
  },
  {
    id: 15,
    name: "Hampi",
    location: "Karnataka, India",
    category: "historical",
    description: "UNESCO World Heritage Site with stunning ruins of the Vijayanagara Empire, boulder-strewn landscape, and ancient temples.",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&h=400&fit=crop",
    lat: 15.3350,
    lon: 76.4600,
    mapQuery: "Hampi+Karnataka"
  },
  {
    id: 16,
    name: "Jim Corbett",
    location: "Uttarakhand, India",
    category: "adventure",
    description: "India's oldest national park, home to Bengal tigers, elephants, and diverse wildlife. Perfect for jungle safaris.",
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?w=600&h=400&fit=crop",
    lat: 29.5300,
    lon: 78.7747,
    mapQuery: "Jim+Corbett+National+Park"
  }
];

function getDestinations() {
  const stored = localStorage.getItem('destinations');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('destinations', JSON.stringify(defaultDestinations));
  return defaultDestinations;
}

function saveDestinations(destinations) {
  localStorage.setItem('destinations', JSON.stringify(destinations));
}

let destinations = getDestinations();
let currentFilter = 'all';
let searchQuery = '';
let homeMap = null;
let markers = [];

function initEventListeners() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  const signupForm = document.getElementById('signupForm');
  if (signupForm) signupForm.addEventListener('submit', handleSignup);

  const tripForm = document.getElementById('tripForm');
  if (tripForm) tripForm.addEventListener('submit', handleGenerateItinerary);

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

  const startPlanningBtn = document.getElementById('startPlanningBtn');
  if (startPlanningBtn) startPlanningBtn.addEventListener('click', handleStartPlanning);

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.category;
      renderDestinations();
    });
  });

  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase();
      renderDestinations();
    });
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') renderDestinations();
    });
  }
  
  if (searchBtn) {
    searchBtn.addEventListener('click', () => renderDestinations());
  }

  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('destinationModal');
  
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  const modalPlanBtn = document.getElementById('modalPlanBtn');
  if (modalPlanBtn) {
    modalPlanBtn.addEventListener('click', () => {
      closeModal();
      handleStartPlanning();
    });
  }
}

function renderDestinations() {
  const grid = document.getElementById('destinationsGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  destinations = getDestinations();
  let filtered = destinations;

  if (currentFilter !== 'all') {
    filtered = filtered.filter(d => d.category === currentFilter);
  }

  if (searchQuery) {
    filtered = filtered.filter(d => 
      d.name.toLowerCase().includes(searchQuery) ||
      d.location.toLowerCase().includes(searchQuery) ||
      d.description.toLowerCase().includes(searchQuery)
    );
  }

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
    return;
  }

  if (noResults) noResults.style.display = 'none';

  grid.innerHTML = filtered.map(dest => `
    <div class="card destination-card slide-up" data-id="${dest.id}" onclick="openDestinationModal(${dest.id})">
      <div class="card-image">
        <img src="${dest.image}" alt="${dest.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop'">
        <span class="card-category ${dest.category}">${formatCategory(dest.category)}</span>
      </div>
      <div class="card-content">
        <h3 class="card-title">${dest.name}</h3>
        <div class="card-location">
          <span>📍</span>
          <span>${dest.location}</span>
        </div>
        <p class="card-description">${dest.description}</p>
        <div class="card-actions">
          <button class="btn btn-small" onclick="event.stopPropagation(); openDestinationModal(${dest.id})">View Details</button>
          <a href="https://www.google.com/maps/search/?api=1&query=${dest.mapQuery}" target="_blank" class="btn btn-small map-btn" onclick="event.stopPropagation()">📍 Map</a>
        </div>
      </div>
    </div>
  `).join('');

  updateMapMarkers(filtered);
}

function formatCategory(category) {
  const labels = {
    'beach': 'Beach',
    'hill-station': 'Hill Station',
    'historical': 'Historical',
    'adventure': 'Adventure'
  };
  return labels[category] || category;
}

function openDestinationModal(id) {
  destinations = getDestinations();
  const dest = destinations.find(d => d.id === id);
  if (!dest) return;

  document.getElementById('modalImage').src = dest.image;
  document.getElementById('modalImage').onerror = function() {
    this.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop';
  };
  document.getElementById('modalTitle').textContent = dest.name;
  document.getElementById('modalCategory').textContent = formatCategory(dest.category);
  document.getElementById('modalCategory').className = `card-category ${dest.category}`;
  document.getElementById('modalLocationText').textContent = dest.location;
  document.getElementById('modalDescription').textContent = dest.description;
  document.getElementById('modalMap').src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${dest.mapQuery}&zoom=12`;
  document.getElementById('modalMapLink').href = `https://www.google.com/maps/search/?api=1&query=${dest.mapQuery}`;

  document.getElementById('destinationModal').classList.add('active');
  document.body.style.overflow = 'hidden';

  if (homeMap) {
    homeMap.setView([dest.lat, dest.lon], 10);
  }
}

function closeModal() {
  document.getElementById('destinationModal').classList.remove('active');
  document.body.style.overflow = '';
}

function initHomeMap() {
  const mapContainer = document.getElementById('homeMap');
  if (!mapContainer || mapContainer._leaflet_id) return;
  
  homeMap = L.map('homeMap').setView([22.5937, 78.9629], 5);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(homeMap);

  updateMapMarkers(destinations);
  
  setTimeout(() => homeMap.invalidateSize(), 100);
}

function updateMapMarkers(filteredDestinations) {
  if (!homeMap) return;

  markers.forEach(m => homeMap.removeLayer(m));
  markers = [];

  filteredDestinations.forEach(dest => {
    const marker = L.marker([dest.lat, dest.lon])
      .addTo(homeMap)
      .bindPopup(`
        <div style="text-align: center; min-width: 160px;">
          <img src="${dest.image}" style="width: 100%; height: 85px; object-fit: cover; border-radius: 6px; margin-bottom: 8px;" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop'">
          <strong style="font-size: 14px; color: #1a237e;">${dest.name}</strong><br>
          <small style="color: #607d8b;">${dest.location}</small><br>
          <a href="https://www.google.com/maps/search/?api=1&query=${dest.mapQuery}" target="_blank" style="color: #1e88e5; font-size: 12px; font-weight: 500;">Open in Google Maps</a>
        </div>
      `);
    
    marker.on('click', () => {
      homeMap.setView([dest.lat, dest.lon], 10);
    });
    
    markers.push(marker);
  });
}

function getAuthToken() {
  return localStorage.getItem('authToken');
}

async function authFetch(url, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return fetch(url, { ...options, headers });
}

function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true' && getAuthToken();
}

function isAdmin() {
  return localStorage.getItem('isAdmin') === 'true';
}

function checkAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/login.html';
    return;
  }
  
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
    let adminLink = isAdmin() ? '<a href="/admin.html">Admin Panel</a>' : '';
    navLinks.innerHTML = `
      <a href="#destinations">Destinations</a>
      <a href="/dashboard.html">Dashboard</a>
      ${adminLink}
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
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const alertEl = document.getElementById('alert');

  if (!email || !password) {
    showAlert(alertEl, 'Please fill in all fields', 'error');
    return;
  }

  if (email === 'admin@travel.com' && password === 'admin123') {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userName', 'Admin');
    localStorage.setItem('userId', '0');
    localStorage.setItem('authToken', 'admin-token-' + Date.now());
    localStorage.setItem('isAdmin', 'true');
    showAlert(alertEl, 'Welcome Admin! Redirecting...', 'success');
    setTimeout(() => window.location.href = '/admin.html', 1000);
    return;
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    
    if (res.ok) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('authToken', data.token);
      localStorage.removeItem('isAdmin');
      window.location.href = '/dashboard.html';
    } else {
      showAlert(alertEl, data.message || 'Login failed', 'error');
    }
  } catch (err) {
    showAlert(alertEl, 'An error occurred. Please try again.', 'error');
  }
}

async function handleSignup(e) {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const alertEl = document.getElementById('alert');

  if (!name || !email || !password) {
    showAlert(alertEl, 'Please fill in all fields', 'error');
    return;
  }

  if (password.length < 3) {
    showAlert(alertEl, 'Password must be at least 3 characters', 'error');
    return;
  }

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    
    if (res.ok) {
      showAlert(alertEl, 'Account created! Redirecting to login...', 'success');
      setTimeout(() => window.location.href = '/login.html', 1500);
    } else {
      showAlert(alertEl, data.message || 'Signup failed', 'error');
    }
  } catch (err) {
    showAlert(alertEl, 'An error occurred. Please try again.', 'error');
  }
}

function handleLogout(e) {
  e.preventDefault();
  
  authFetch('/api/logout', { method: 'POST' })
    .finally(() => {
      localStorage.clear();
      window.location.href = '/index.html';
    });
}

function handleStartPlanning(e) {
  if (e) e.preventDefault();
  
  if (!isLoggedIn()) {
    alert('Please login to start planning your trip');
    window.location.href = '/login.html';
  } else {
    window.location.href = '/dashboard.html';
  }
}

async function handleGenerateItinerary(e) {
  e.preventDefault();
  
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

  try {
    const res = await authFetch('/api/generate-itinerary', {
      method: 'POST',
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    
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
    alert('Failed to generate itinerary. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = '🤖 Generate AI Itinerary';
  }
}

function displayItinerary(data) {
  const resultDiv = document.getElementById('itineraryResult');
  const contentDiv = document.getElementById('itineraryContent');
  
  resultDiv.style.display = 'block';
  
  let html = `
    <div class="itinerary-header">
      <h3>✈️ Trip to ${data.destination}</h3>
      <p>📅 ${data.duration} | 💰 ${data.budget} | 👥 ${data.travellers} travelers</p>
    </div>
  `;
  
  html += `<h3 style="margin: 2rem 0 1rem; color: var(--text-dark);">📋 Day-wise Itinerary</h3>`;
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

  html += `<h3 style="margin: 2rem 0 1rem; color: var(--text-dark);">🏨 Recommended Hotels</h3><div class="grid">`;
  data.hotels.forEach(hotel => {
    html += `
      <div class="card">
        <img src="${hotel.image}" alt="${hotel.name}" style="height: 180px; width: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'">
        <div class="card-content">
          <h4 style="color: var(--text-dark);">${hotel.name}</h4>
          <p style="color: var(--golden-yellow);">⭐ ${hotel.rating}</p>
          <p style="font-weight: 600; color: var(--primary-blue);"><strong>${hotel.price}</strong></p>
        </div>
      </div>
    `;
  });
  html += `</div>`;

  html += `<h3 style="margin: 2rem 0 1rem; color: var(--text-dark);">✈️ Flight Options</h3><div class="grid">`;
  data.flights.forEach(flight => {
    html += `
      <div class="card">
        <div class="card-content" style="text-align: center; padding: 2rem;">
          <h4 style="color: var(--text-dark);">${flight.airline}</h4>
          <p style="color: var(--text-secondary);">⏱️ ${flight.duration}</p>
          <p style="font-size: 1.5rem; color: var(--primary-blue); font-weight: 700;">${flight.price}</p>
        </div>
      </div>
    `;
  });
  html += `</div>`;

  html += `<h3 style="margin: 2rem 0 1rem; color: var(--text-dark);">🚂 Train Options</h3><div class="grid">`;
  data.railways.forEach(train => {
    html += `
      <div class="card">
        <div class="card-content" style="text-align: center; padding: 2rem;">
          <h4 style="color: var(--text-dark);">${train.train}</h4>
          <p style="color: var(--text-secondary);">⏱️ ${train.duration}</p>
          <p style="font-size: 1.5rem; color: var(--fresh-green); font-weight: 700;">${train.price}</p>
        </div>
      </div>
    `;
  });
  html += `</div>`;

  contentDiv.innerHTML = html;
  initMap(data.destination, data.coordinates.lat, data.coordinates.lon);
  resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function initMap(destination, lat, lon) {
  const mapContainer = document.getElementById('map');
  if (!mapContainer) return;
  
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
    
  setTimeout(() => map.invalidateSize(), 100);
}

function showAlert(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className = `alert alert-${type}`;
  el.style.display = 'block';
}

function initAdminPanel() {
  if (!isLoggedIn() || !isAdmin()) {
    window.location.href = '/login.html';
    return;
  }

  renderAdminDestinations();

  const addForm = document.getElementById('addDestinationForm');
  if (addForm) {
    addForm.addEventListener('submit', handleAddDestination);
  }

  const imageInput = document.getElementById('destImage');
  if (imageInput) {
    imageInput.addEventListener('input', (e) => {
      const preview = document.getElementById('imagePreview');
      if (preview && e.target.value) {
        preview.innerHTML = `<img src="${e.target.value}" onerror="this.parentElement.innerHTML='Invalid image URL'">`;
      }
    });
  }
}

function renderAdminDestinations() {
  const list = document.getElementById('destinationList');
  if (!list) return;

  destinations = getDestinations();

  list.innerHTML = destinations.map(dest => `
    <div class="destination-list-item">
      <img src="${dest.image}" alt="${dest.name}" onerror="this.src='https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=150&fit=crop'">
      <div class="info">
        <h4>${dest.name}</h4>
        <p>${dest.location} - ${formatCategory(dest.category)}</p>
      </div>
      <div class="actions">
        <button class="btn btn-small btn-delete" onclick="deleteDestination(${dest.id})">🗑️</button>
      </div>
    </div>
  `).join('');
}

function handleAddDestination(e) {
  e.preventDefault();
  
  const name = document.getElementById('destName').value.trim();
  const location = document.getElementById('destLocation').value.trim();
  const category = document.getElementById('destCategory').value;
  const description = document.getElementById('destDescription').value.trim();
  const image = document.getElementById('destImage').value.trim();
  const lat = parseFloat(document.getElementById('destLat').value) || 20.5937;
  const lon = parseFloat(document.getElementById('destLon').value) || 78.9629;

  if (!name || !location || !category || !description) {
    alert('Please fill in all required fields');
    return;
  }

  destinations = getDestinations();
  const newId = Math.max(...destinations.map(d => d.id), 0) + 1;
  
  const newDest = {
    id: newId,
    name,
    location,
    category,
    description,
    image: image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&h=400&fit=crop',
    lat,
    lon,
    mapQuery: encodeURIComponent(`${name}+${location}`)
  };

  destinations.push(newDest);
  saveDestinations(destinations);

  alert('Destination added successfully!');
  e.target.reset();
  document.getElementById('imagePreview').innerHTML = 'Image preview will appear here';
  renderAdminDestinations();
}

function deleteDestination(id) {
  if (!confirm('Are you sure you want to delete this destination?')) return;
  
  destinations = getDestinations();
  destinations = destinations.filter(d => d.id !== id);
  saveDestinations(destinations);
  renderAdminDestinations();
}

window.openDestinationModal = openDestinationModal;
window.deleteDestination = deleteDestination;

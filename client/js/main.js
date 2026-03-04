document.addEventListener('DOMContentLoaded', () => {
  console.log('TripPlanner AI loaded');
  const path = window.location.pathname;

  if (path.includes('dashboard.html')) {
    checkAuth();
  }

  updateNav();
  initEventListeners();

  if (path === '/' || path.includes('index.html')) {
    renderDestinations();
    initHomeMap();
  }
});

const destinations = [
  // HILL STATIONS
  {
    id: 1,
    name: "Manali",
    location: "Himachal Pradesh, India",
    category: "hill-station",
    description: "A stunning hill station in the Himalayas known for snow-capped peaks, adventure sports, ancient temples, and the famous Rohtang Pass.",
    image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600",
    lat: 32.2396,
    lon: 77.1887,
    mapQuery: "Manali+Himachal+Pradesh"
  },
  {
    id: 2,
    name: "Shimla",
    location: "Himachal Pradesh, India",
    category: "hill-station",
    description: "Queen of Hills with colonial architecture, Mall Road, scenic toy train ride, and panoramic Himalayan views.",
    image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?w=600",
    lat: 31.1048,
    lon: 77.1734,
    mapQuery: "Shimla+Himachal+Pradesh"
  },
  {
    id: 3,
    name: "Darjeeling",
    location: "West Bengal, India",
    category: "hill-station",
    description: "Famous for tea gardens, the Darjeeling Himalayan Railway, stunning sunrise views, and colonial charm.",
    image: "https://images.unsplash.com/photo-1622308644420-b20142d38e1c?w=600",
    lat: 27.0410,
    lon: 88.2663,
    mapQuery: "Darjeeling+West+Bengal"
  },
  {
    id: 4,
    name: "Ooty",
    location: "Tamil Nadu, India",
    category: "hill-station",
    description: "Queen of Nilgiris with botanical gardens, tea estates, and the famous Nilgiri Mountain Railway.",
    image: "https://images.unsplash.com/photo-1574480344303-e9c97f5ee665?w=600",
    lat: 11.4102,
    lon: 76.6950,
    mapQuery: "Ooty+Tamil+Nadu"
  },
  {
    id: 5,
    name: "Munnar",
    location: "Kerala, India",
    category: "hill-station",
    description: "Lush green tea plantations, misty mountains, and serene atmosphere in the Western Ghats.",
    image: "https://images.unsplash.com/photo-1595815771614-ade9d652a65d?w=600",
    lat: 10.0889,
    lon: 77.0595,
    mapQuery: "Munnar+Kerala"
  },
  {
    id: 6,
    name: "Nainital",
    location: "Uttarakhand, India",
    category: "hill-station",
    description: "Picturesque lake town surrounded by mountains, famous for Naini Lake and cable car rides.",
    image: "https://images.unsplash.com/photo-1626714100232-c4c6bbf5e9bc?w=600",
    lat: 29.3803,
    lon: 79.4636,
    mapQuery: "Nainital+Uttarakhand"
  },

  // BEACHES
  {
    id: 7,
    name: "Goa",
    location: "India",
    category: "beach",
    description: "India's beach paradise with stunning coastline, vibrant nightlife, Portuguese heritage, and water sports. Famous for Baga, Calangute, and Anjuna beaches.",
    image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600",
    lat: 15.2993,
    lon: 74.1240,
    mapQuery: "Goa+India"
  },
  {
    id: 8,
    name: "Andaman Islands",
    location: "India",
    category: "beach",
    description: "Pristine tropical islands with crystal-clear waters, coral reefs, and exotic marine life. Perfect for snorkeling and scuba diving.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
    lat: 11.7401,
    lon: 92.6586,
    mapQuery: "Andaman+Islands+India"
  },
  {
    id: 9,
    name: "Kerala Backwaters",
    location: "Kerala, India",
    category: "beach",
    description: "Serene network of lagoons, lakes, and canals. Experience houseboat cruises through palm-fringed waterways.",
    image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600",
    lat: 9.4981,
    lon: 76.3388,
    mapQuery: "Kerala+Backwaters"
  },
  {
    id: 10,
    name: "Puducherry",
    location: "India",
    category: "beach",
    description: "Former French colony with charming colonial architecture, pristine beaches, and the spiritual Auroville township.",
    image: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600",
    lat: 11.9416,
    lon: 79.8083,
    mapQuery: "Pondicherry+India"
  },
  {
    id: 11,
    name: "Gokarna",
    location: "Karnataka, India",
    category: "beach",
    description: "Peaceful beach town known for pristine Om Beach, temple town vibes, and scenic cliff walks.",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=600",
    lat: 14.5479,
    lon: 74.3188,
    mapQuery: "Gokarna+Karnataka"
  },

  // HERITAGE & CULTURAL
  {
    id: 12,
    name: "Jaipur",
    location: "Rajasthan, India",
    category: "heritage",
    description: "The Pink City with magnificent forts, palaces, and vibrant bazaars. Home to Amber Fort, Hawa Mahal, and City Palace.",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600",
    lat: 26.9124,
    lon: 75.7873,
    mapQuery: "Jaipur+Rajasthan"
  },
  {
    id: 13,
    name: "Agra",
    location: "Uttar Pradesh, India",
    category: "heritage",
    description: "Home to the iconic Taj Mahal, one of the Seven Wonders of the World. Also features Agra Fort and Fatehpur Sikri.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
    lat: 27.1767,
    lon: 78.0081,
    mapQuery: "Taj+Mahal+Agra"
  },
  {
    id: 14,
    name: "Varanasi",
    location: "Uttar Pradesh, India",
    category: "heritage",
    description: "One of the world's oldest living cities. Spiritual capital of India with ancient ghats, temples, and Ganga Aarti.",
    image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600",
    lat: 25.3176,
    lon: 82.9739,
    mapQuery: "Varanasi+Ghats"
  },
  {
    id: 15,
    name: "Hampi",
    location: "Karnataka, India",
    category: "heritage",
    description: "UNESCO World Heritage Site with stunning ruins of the Vijayanagara Empire, boulder-strewn landscape, and ancient temples.",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600",
    lat: 15.3350,
    lon: 76.4600,
    mapQuery: "Hampi+Karnataka"
  },
  {
    id: 16,
    name: "Udaipur",
    location: "Rajasthan, India",
    category: "heritage",
    description: "City of Lakes with stunning palaces, romantic boat rides on Lake Pichola, and rich Rajasthani culture.",
    image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600",
    lat: 24.5854,
    lon: 73.7125,
    mapQuery: "Udaipur+Rajasthan"
  },
  {
    id: 17,
    name: "Khajuraho",
    location: "Madhya Pradesh, India",
    category: "heritage",
    description: "UNESCO site famous for its stunning medieval Hindu and Jain temples with intricate sculptures.",
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600",
    lat: 24.8318,
    lon: 79.9199,
    mapQuery: "Khajuraho+Temples"
  },

  // ADVENTURE
  {
    id: 18,
    name: "Rishikesh",
    location: "Uttarakhand, India",
    category: "adventure",
    description: "The yoga capital of the world and adventure hub for white water rafting, bungee jumping, and trekking along the Ganges.",
    image: "https://images.unsplash.com/photo-1545389332-131d6a903994?w=600",
    lat: 30.0869,
    lon: 78.2676,
    mapQuery: "Rishikesh+Uttarakhand"
  },
  {
    id: 19,
    name: "Ladakh",
    location: "India",
    category: "adventure",
    description: "Land of high passes with stunning landscapes, Buddhist monasteries, Pangong Lake, and thrilling mountain roads.",
    image: "https://images.unsplash.com/photo-1614159102234-09b79a8ed929?w=600",
    lat: 34.1526,
    lon: 77.5771,
    mapQuery: "Ladakh+India"
  },
  {
    id: 20,
    name: "Spiti Valley",
    location: "Himachal Pradesh, India",
    category: "adventure",
    description: "A cold desert mountain valley with ancient monasteries, dramatic landscapes, and stargazing opportunities.",
    image: "https://images.unsplash.com/photo-1626015365107-aa76c7f8d9ab?w=600",
    lat: 32.2464,
    lon: 78.0349,
    mapQuery: "Spiti+Valley"
  },
  {
    id: 21,
    name: "Jim Corbett",
    location: "Uttarakhand, India",
    category: "adventure",
    description: "India's oldest national park, home to Bengal tigers, elephants, and diverse wildlife. Perfect for jungle safaris.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=600",
    lat: 29.5300,
    lon: 78.7747,
    mapQuery: "Jim+Corbett+National+Park"
  },
  {
    id: 22,
    name: "Coorg",
    location: "Karnataka, India",
    category: "adventure",
    description: "Scotland of India with coffee plantations, misty hills, trekking trails, and river rafting at Barapole.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    lat: 12.3375,
    lon: 75.8069,
    mapQuery: "Coorg+Karnataka"
  },

  // HONEYMOON / ROMANTIC
  {
    id: 23,
    name: "Maldives",
    location: "South Asia",
    category: "honeymoon",
    description: "Paradise on Earth with overwater villas, crystal-clear turquoise waters, pristine white beaches, and world-class resorts.",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600",
    lat: 3.2028,
    lon: 73.2207,
    mapQuery: "Maldives"
  },
  {
    id: 24,
    name: "Santorini",
    location: "Greece",
    category: "honeymoon",
    description: "Iconic white-washed buildings with blue domes, stunning sunsets, romantic cliffside dining, and volcanic beaches.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=600",
    lat: 36.3932,
    lon: 25.4615,
    mapQuery: "Santorini+Greece"
  },
  {
    id: 25,
    name: "Alleppey",
    location: "Kerala, India",
    category: "honeymoon",
    description: "Venice of the East with romantic houseboat stays on serene backwaters, coconut groves, and tranquil sunsets.",
    image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=600",
    lat: 9.4981,
    lon: 76.3388,
    mapQuery: "Alleppey+Kerala"
  },
  {
    id: 26,
    name: "Andaman & Nicobar",
    location: "India",
    category: "honeymoon",
    description: "Secluded tropical paradise with pristine beaches, romantic sunsets, underwater adventures, and luxury beach resorts.",
    image: "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=600",
    lat: 11.7401,
    lon: 92.6586,
    mapQuery: "Havelock+Island+Andaman"
  },
  {
    id: 27,
    name: "Bali",
    location: "Indonesia",
    category: "honeymoon",
    description: "Island of Gods with romantic rice terraces, ancient temples, luxury villas, and breathtaking sunset beaches.",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600",
    lat: -8.3405,
    lon: 115.0920,
    mapQuery: "Bali+Indonesia"
  },

  // INTERNATIONAL
  {
    id: 28,
    name: "Paris",
    location: "France",
    category: "international",
    description: "The City of Love with the iconic Eiffel Tower, Louvre Museum, charming cafes, and world-class cuisine.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600",
    lat: 48.8566,
    lon: 2.3522,
    mapQuery: "Paris+France"
  },
  {
    id: 29,
    name: "Dubai",
    location: "UAE",
    category: "international",
    description: "Futuristic city with the world's tallest building, luxury shopping, desert safaris, and stunning architecture.",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600",
    lat: 25.2048,
    lon: 55.2708,
    mapQuery: "Dubai+UAE"
  },
  {
    id: 30,
    name: "Switzerland",
    location: "Europe",
    category: "international",
    description: "Alpine paradise with snow-capped mountains, scenic train rides, pristine lakes, and charming villages.",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=600",
    lat: 46.8182,
    lon: 8.2275,
    mapQuery: "Switzerland"
  },
  {
    id: 31,
    name: "Singapore",
    location: "Southeast Asia",
    category: "international",
    description: "Modern city-state with futuristic Gardens by the Bay, Marina Bay Sands, amazing street food, and vibrant nightlife.",
    image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600",
    lat: 1.3521,
    lon: 103.8198,
    mapQuery: "Singapore"
  },
  {
    id: 32,
    name: "Bangkok",
    location: "Thailand",
    category: "international",
    description: "Vibrant Thai capital with ornate temples, floating markets, delicious street food, and exciting nightlife.",
    image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600",
    lat: 13.7563,
    lon: 100.5018,
    mapQuery: "Bangkok+Thailand"
  },
  {
    id: 33,
    name: "Tokyo",
    location: "Japan",
    category: "international",
    description: "Ultra-modern meets traditional with neon-lit streets, ancient temples, cutting-edge technology, and world-famous cuisine.",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600",
    lat: 35.6762,
    lon: 139.6503,
    mapQuery: "Tokyo+Japan"
  },
  {
    id: 34,
    name: "London",
    location: "United Kingdom",
    category: "international",
    description: "Historic capital with Big Ben, Tower Bridge, Buckingham Palace, world-class museums, and iconic red buses.",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600",
    lat: 51.5074,
    lon: -0.1278,
    mapQuery: "London+UK"
  },
  {
    id: 35,
    name: "New York",
    location: "USA",
    category: "international",
    description: "The city that never sleeps with Times Square, Statue of Liberty, Central Park, Broadway shows, and iconic skyline.",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600",
    lat: 40.7128,
    lon: -74.0060,
    mapQuery: "New+York+City"
  },
  {
    id: 36,
    name: "Sydney",
    location: "Australia",
    category: "international",
    description: "Harbour city famous for the Opera House, Harbour Bridge, beautiful beaches, and vibrant culture.",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600",
    lat: -33.8688,
    lon: 151.2093,
    mapQuery: "Sydney+Australia"
  },
  {
    id: 37,
    name: "Rome",
    location: "Italy",
    category: "international",
    description: "Eternal City with the Colosseum, Vatican City, Trevi Fountain, ancient ruins, and authentic Italian cuisine.",
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600",
    lat: 41.9028,
    lon: 12.4964,
    mapQuery: "Rome+Italy"
  },
  {
    id: 38,
    name: "Amsterdam",
    location: "Netherlands",
    category: "international",
    description: "Picturesque canal city with world-class museums, tulip gardens, cycling culture, and vibrant nightlife.",
    image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=600",
    lat: 52.3676,
    lon: 4.9041,
    mapQuery: "Amsterdam+Netherlands"
  }
];

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
        <img src="${dest.image}" alt="${dest.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600'">
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
    'heritage': 'Heritage',
    'adventure': 'Adventure',
    'honeymoon': 'Romantic',
    'international': 'International'
  };
  return labels[category] || category;
}

function openDestinationModal(id) {
  const dest = destinations.find(d => d.id === id);
  if (!dest) return;

  document.getElementById('modalImage').src = dest.image;
  document.getElementById('modalImage').onerror = function() {
    this.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600';
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
  
  homeMap = L.map('homeMap').setView([20, 78], 4);
  
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
        <div style="text-align: center; min-width: 150px;">
          <img src="${dest.image}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 4px; margin-bottom: 8px;" onerror="this.src='https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=300'">
          <strong style="font-size: 14px;">${dest.name}</strong><br>
          <small style="color: #666;">${dest.location}</small><br>
          <a href="https://www.google.com/maps/search/?api=1&query=${dest.mapQuery}" target="_blank" style="color: #2563eb; font-size: 12px;">Open in Google Maps</a>
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
    navLinks.innerHTML = `
      <a href="#destinations">Destinations</a>
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
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const alertEl = document.getElementById('alert');

  if (!email || !password) {
    showAlert(alertEl, 'Please fill in all fields', 'error');
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
      <p>${data.duration} | ${data.budget} | ${data.travellers} travelers</p>
    </div>
  `;
  
  html += `<h3 style="margin: 2rem 0 1rem;">Day-wise Itinerary</h3>`;
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

  html += `<h3 style="margin: 2rem 0 1rem;">Recommended Hotels</h3><div class="grid">`;
  data.hotels.forEach(hotel => {
    html += `
      <div class="card">
        <img src="${hotel.image}" alt="${hotel.name}" style="height: 180px;" onerror="this.src='https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500'">
        <div class="card-content">
          <h4>${hotel.name}</h4>
          <p>${hotel.rating}</p>
          <p><strong>${hotel.price}</strong></p>
        </div>
      </div>
    `;
  });
  html += `</div>`;

  html += `<h3 style="margin: 2rem 0 1rem;">Flight Options</h3><div class="grid">`;
  data.flights.forEach(flight => {
    html += `
      <div class="card">
        <div class="card-content" style="text-align: center; padding: 2rem;">
          <h4>${flight.airline}</h4>
          <p>${flight.duration}</p>
          <p style="font-size: 1.5rem; color: var(--primary-color);"><strong>${flight.price}</strong></p>
        </div>
      </div>
    `;
  });
  html += `</div>`;

  html += `<h3 style="margin: 2rem 0 1rem;">Train Options</h3><div class="grid">`;
  data.railways.forEach(train => {
    html += `
      <div class="card">
        <div class="card-content" style="text-align: center; padding: 2rem;">
          <h4>${train.train}</h4>
          <p>${train.duration}</p>
          <p style="font-size: 1.5rem; color: var(--primary-color);"><strong>${train.price}</strong></p>
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

window.openDestinationModal = openDestinationModal;

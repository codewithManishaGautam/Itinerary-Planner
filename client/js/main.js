document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  // Check auth status for protected routes
  if (path.includes('dashboard.html')) {
    checkAuth();
  } else {
    // Check if user is logged in to update nav
    updateNav();
  }

  // Event Listeners
  const loginForm = document.getElementById('loginForm');
  if (loginForm) loginForm.addEventListener('submit', handleLogin);

  const signupForm = document.getElementById('signupForm');
  if (signupForm) signupForm.addEventListener('submit', handleSignup);

  const tripForm = document.getElementById('tripForm');
  if (tripForm) tripForm.addEventListener('submit', handleGenerateItinerary);
  
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
});

async function checkAuth() {
  try {
    const res = await fetch('/api/user');
    if (!res.ok) {
      window.location.href = '/login.html';
    } else {
      const user = await res.json();
      const userNameEl = document.getElementById('userName');
      if (userNameEl) userNameEl.textContent = user.name;
    }
  } catch (err) {
    window.location.href = '/login.html';
  }
}

async function updateNav() {
  try {
    const res = await fetch('/api/user');
    const navLinks = document.getElementById('navLinks');
    if (res.ok) {
      navLinks.innerHTML = `
        <a href="/dashboard.html">Dashboard</a>
        <a href="#" id="logoutBtn">Logout</a>
      `;
      document.getElementById('logoutBtn').addEventListener('click', handleLogout);
    }
  } catch (err) {
    // Not logged in, keep default links
  }
}

async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const alert = document.getElementById('alert');

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    
    if (res.ok) {
      window.location.href = '/dashboard.html';
    } else {
      showAlert(alert, data.message, 'error');
    }
  } catch (err) {
    showAlert(alert, 'An error occurred', 'error');
  }
}

async function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const alert = document.getElementById('alert');

  try {
    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    
    if (res.ok) {
      showAlert(alert, 'Signup successful! Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1500);
    } else {
      showAlert(alert, data.message, 'error');
    }
  } catch (err) {
    showAlert(alert, 'An error occurred', 'error');
  }
}

async function handleLogout(e) {
  e.preventDefault();
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/index.html';
}

async function handleGenerateItinerary(e) {
  e.preventDefault();
  
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
    const res = await fetch('/api/generate-itinerary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await res.json();
    
    if (res.ok) {
      displayItinerary(data);
    } else {
      alert(data.message);
    }
  } catch (err) {
    alert('Failed to generate itinerary');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Generate AI Itinerary';
  }
}

function displayItinerary(data) {
  const resultDiv = document.getElementById('itineraryResult');
  const contentDiv = document.getElementById('itineraryContent');
  
  resultDiv.style.display = 'block';
  
  // Render Days
  let html = `<h3>Trip to ${data.destination}</h3>
              <p>Duration: ${data.duration} | Travellers: ${data.travellers}</p>
              <hr style="margin: 1rem 0">`;
              
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

  // Render Hotels
  html += `<h3>Suggested Hotels</h3><div class="grid" style="margin-bottom: 2rem">`;
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

  contentDiv.innerHTML = html;
  
  // Initialize Map
  initMap(data.destination);
  
  // Scroll to results
  resultDiv.scrollIntoView({ behavior: 'smooth' });
}

function initMap(destination) {
  // Simple map init centered on arbitrary point for mock
  // In real app, geocode the destination
  const mapContainer = document.getElementById('map');
  if (mapContainer && !mapContainer._leaflet_id) {
    // Default to Paris coords for mock if geocoding not implemented
    // In a real app, use OpenStreetMap Nominatim to search 'destination'
    
    // Attempting to use a simple hash of string to pick a "random" location for demo
    // or just default to London/Paris/NY based on input
    
    const lat = 48.8566; // Paris
    const lon = 2.3522;
    
    const map = L.map('map').setView([lat, lon], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([lat, lon]).addTo(map)
      .bindPopup(`<b>${destination}</b><br>Your Destination`)
      .openPopup();
      
    // Fix map sizing issues
    setTimeout(() => { map.invalidateSize(); }, 100);
  }
}

function showAlert(el, msg, type) {
  el.textContent = msg;
  el.className = `alert alert-${type}`;
  el.style.display = 'block';
}

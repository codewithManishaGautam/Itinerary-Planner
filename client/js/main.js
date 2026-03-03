
  
  function initDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    const body = document.body;
    if (localStorage.getItem('darkMode') === 'enabled') {
      body.classList.add('dark');
    }
    if (toggle) {
      toggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        localStorage.setItem('darkMode', body.classList.contains('dark') ? 'enabled' : 'disabled');
      });
    }
  }

  function checkAdminAccess() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    if (isAdmin) {
      const nav = document.getElementById('navLinks');
      if (nav && !document.getElementById('adminLink')) {
        const adminLink = document.createElement('a');
        adminLink.href = '#admin-panel';
        adminLink.id = 'adminLink';
        adminLink.textContent = 'Admin Panel';
        adminLink.style.color = '#ef4444';
        adminLink.style.fontWeight = 'bold';
        adminLink.style.marginRight = '1rem';
        nav.insertBefore(adminLink, nav.firstChild);
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    checkAdminAccess();
  });
  
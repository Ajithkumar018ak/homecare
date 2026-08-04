/**
 * AuraCare Admin Dashboard Interactions & Mocks (Phase 4)
 * Senior Healthcare Dashboard Architect
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Layout and Sidebar Controllers
  initAdminLayout();

  // 2. Initialize Clinician Roster Interactions
  initClinicianDirectory();

  // 3. Initialize Inventory & Alerts Checks
  initInventoryManagement();

  // 4. Initialize Queue approvals checks
  initApprovalQueue();

  // 5. Initialize Vitals Growth & Revenue Charts
  initAdminCharts();

  // Intercept header icons and other placeholder actions
  const adminPlaceholders = [
    '.theme-switch-btn',
    '.message-badge',
    '#notification-bell-btn',
    '.settings-shortcut-btn',
    'button[onclick*="Review Chart"]',
    'button[onclick*="spreadsheet"]',
    'button[onclick*="approval"]',
    'button[onclick*="selected"]',
    'button[onclick*="Report"]',
    'button[onclick*="Download"]'
  ];

  adminPlaceholders.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      el.removeAttribute('onclick');
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '404.html?from=admin';
      });
    });
  });

  // Catch any other onclick containing showToast that isn't an input/select
  document.querySelectorAll('[onclick*="showToast"]').forEach(el => {
    const tagName = el.tagName.toLowerCase();
    if (tagName !== 'input' && tagName !== 'select') {
      el.removeAttribute('onclick');
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '404.html?from=admin';
      });
    }
  });
});

/* ==========================================================================
   LAYOUT & SIDEBAR CONTROLLERS
   ========================================================================== */
function initAdminLayout() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const mainContent = document.querySelector('.dashboard-main');
  const topbar = document.querySelector('.dashboard-topbar');
  const overlay = document.getElementById('sidebar-overlay');

  if (!hamburgerBtn || !sidebar) return;

  // Inject Admin Profile Menu if missing
  const topbarActions = document.querySelector('.topbar-actions');
  if (topbarActions && !document.querySelector('.user-profile-menu')) {
    const profileMenu = document.createElement('div');
    profileMenu.className = 'user-profile-menu';
    profileMenu.onclick = () => {
      window.location.href = '404.html?from=admin';
    };
    profileMenu.innerHTML = `
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="border-radius: 50%; background: #e2e8f0; padding: 4px; color: var(--color-secondary); display: inline-block; vertical-align: middle;">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span style="font-weight: 600; font-size: 0.9rem; color: var(--text-dark);">Jane Smith (Admin)</span>
    `;
    topbarActions.appendChild(profileMenu);

    function toggleSidebar() {
      if (window.innerWidth <= 1024) {
        sidebar.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
        if (overlay) overlay.classList.toggle('active');

        if (sidebar.classList.contains('active')) {
          document.body.style.overflow = 'hidden';
          document.body.classList.add('sidebar-open');
        } else {
          document.body.style.overflow = '';
          document.body.classList.remove('sidebar-open');
        }
      } else {
        sidebar.classList.toggle('collapsed');
        if (mainContent) mainContent.classList.toggle('collapsed');
        if (topbar) topbar.classList.toggle('collapsed');
        hamburgerBtn.classList.toggle('active');
      }
    }

    function closeMobileSidebar() {
      sidebar.classList.remove('active');
      hamburgerBtn.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
      document.body.style.overflow = '';
      document.body.classList.remove('sidebar-open');
    }

    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSidebar();
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        closeMobileSidebar();
        closeAdminModals();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileSidebar();
        closeAdminModals();
      }
    });

    // Auto close menu drawer on click items on mobile
    const menuItems = sidebar.querySelectorAll('.sidebar-menu .sidebar-item');
    menuItems.forEach(item => {
      item.addEventListener('click', () => {
        const pageTitle = item.querySelector('span').textContent;
        const breadcrumbActive = document.getElementById('current-page-breadcrumb');
        if (breadcrumbActive) {
          breadcrumbActive.textContent = pageTitle;
        }
        if (window.innerWidth <= 1024) {
          closeMobileSidebar();
        }
      });
    });

    // Render Live Clock Date
    const dateDisplay = document.getElementById('live-date');
    if (dateDisplay) {
      const options = { month: 'long', day: 'numeric', year: 'numeric' };
      const todayStr = new Date().toLocaleDateString('en-US', options);
      dateDisplay.textContent = todayStr;
    }
  }
}

  function closeAdminModals() {
    const addDocModal = document.getElementById('add-doctor-modal-overlay');
    if (addDocModal) addDocModal.classList.remove('active');
  }

  /* ==========================================================================
     CLINICIAN DIRECTORY & ADD CLINICIAN MOCK
     ========================================================================== */
  function initClinicianDirectory() {
    const addDocClose = document.getElementById('add-doctor-close-btn');
    const addDocModal = document.getElementById('add-doctor-modal-overlay');
    const addDocForm = document.getElementById('add-doctor-form-inner');

    if (addDocClose && addDocModal) {
      addDocClose.addEventListener('click', closeAdminModals);
    }

    if (addDocForm) {
      addDocForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const docName = document.getElementById('new-doc-name').value;
        const docSpecialty = document.getElementById('new-doc-specialty').value;
        const docExp = document.getElementById('new-doc-experience').value;
        const docAvail = document.getElementById('new-doc-availability').value;

        if (!docName || !docExp) return;

        // Add to doctor roster table visually
        const tableBody = document.querySelector('#admin-doctors-table-list tbody');
        if (tableBody) {
          const row = document.createElement('tr');
          row.innerHTML = `
          <td><strong>${docName}</strong></td>
          <td>${docSpecialty} Department</td>
          <td>0 Patients</td>
          <td>${docExp} Yrs &bull; ⭐ 5.0</td>
          <td><span class="status-badge ${docAvail === 'Available' ? 'status-completed' : 'status-cancelled'}">${docAvail}</span></td>
          <td><button class="btn btn-outline-dark btn-sm duty-toggle">${docAvail === 'Available' ? 'Go Off Duty' : 'Go On Call'}</button></td>
        `;

          tableBody.appendChild(row);

          // Re-bind duty toggles for new elements
          bindDutyToggle(row.querySelector('.duty-toggle'));
        }

        showToast(`Registered clinician: ${docName}. Saved successfully.`);
        addDocForm.reset();
        closeAdminModals();
      });
    }
  }

  function bindDutyToggle(button) {
    if (!button) return;
    button.addEventListener('click', () => {
      const badge = button.closest('tr').querySelector('.status-badge');
      if (badge.textContent.trim() === 'Available' || badge.textContent.trim() === 'On Duty') {
        badge.textContent = 'Off Duty';
        badge.className = 'status-badge status-cancelled';
        button.textContent = 'Go On Call';
        showToast('Clinician set to Off Duty.');
      } else {
        badge.textContent = 'Available';
        badge.className = 'status-badge status-completed';
        button.textContent = 'Go Off Duty';
        showToast('Clinician activated.');
      }
    });
  }

  /* ==========================================================================
     INVENTORY & STOCK MANAGEMENT
     ========================================================================== */
  function initInventoryManagement() {
    const qtyInputs = document.querySelectorAll('.inventory-qty');
    qtyInputs.forEach(input => {
      input.addEventListener('change', () => {
        const row = input.closest('tr');
        const name = row.cells[0].querySelector('strong').textContent.trim();
        const newVal = input.value;

        // Update progress bar level visually based on random calculations
        const progressFill = row.querySelector('.progress-bar-fill-premium');
        if (progressFill) {
          const pct = Math.min(Math.max(Math.round((parseInt(newVal) / 100) * 100), 5), 100);
          progressFill.style.width = `${pct}%`;
          if (pct < 20) {
            progressFill.className = 'progress-bar-fill-premium progress-bar-fill-warning';
          } else {
            progressFill.className = 'progress-bar-fill-premium progress-bar-fill-emerald';
          }
        }

        showToast(`Console Updated: ${name} fleet levels are set to ${newVal} units.`);
      });
    });
  }

  /* ==========================================================================
     BULK APPROVALS QUEUE SYSTEM
     ========================================================================== */
  function initApprovalQueue() {
    const bulkCheckbox = document.getElementById('bulk-select-approve-checkbox');
    const itemsCheckboxes = document.querySelectorAll('.bulk-item-check');

    if (bulkCheckbox) {
      bulkCheckbox.addEventListener('change', () => {
        itemsCheckboxes.forEach(cb => {
          cb.checked = bulkCheckbox.checked;
        });
      });
    }
  }

  /* ==========================================================================
     ADMIN STATISTICS CHARTS ANIMATIONS
     ========================================================================== */
  function initAdminCharts() {
    const chartRow = document.querySelector('.billing-chart-bars-row');
    if (chartRow) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateAdminBillingChart();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      observer.observe(chartRow);
    }
  }

  function animateAdminBillingChart() {
    const bars = document.querySelectorAll('.billing-chart-bar-fill');
    bars.forEach(bar => {
      const val = bar.getAttribute('data-height');
      bar.style.height = '0';
      setTimeout(() => {
        bar.style.height = `${val}px`;
      }, 150);
    });
  }

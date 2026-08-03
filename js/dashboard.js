document.addEventListener('DOMContentLoaded', () => {
  // Check if we are on a dashboard page
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  if (sidebarItems.length === 0) return;

  initSidebarNavigation();
  initDashboardCharts();
  
  // Initialize Page-Specific Logic
  if (document.getElementById('user-dashboard-root')) {
    initUserDashboard();
  } else if (document.getElementById('admin-dashboard-root')) {
    initAdminDashboard();
  }
});

/* ==========================================================================
   SIDEBAR VIEW SWITCHER
   ========================================================================== */
function initSidebarNavigation() {
  const sidebarItems = document.querySelectorAll('.sidebar-item');
  const sections = document.querySelectorAll('.dashboard-section');

  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetSectionId = item.getAttribute('data-section');
      if (!targetSectionId) return;

      // Update Sidebar Items active state
      sidebarItems.forEach(si => si.classList.remove('active'));
      item.classList.add('active');

      // Hide all sections, show active section
      sections.forEach(sec => {
        sec.style.display = 'none';
      });
      
      const targetSec = document.getElementById(targetSectionId);
      if (targetSec) {
        targetSec.style.display = 'block';
        
        // Re-trigger chart animation if analytics section becomes visible
        if (targetSectionId === 'sec-analytics' || targetSectionId === 'sec-reports') {
          animateCharts();
        }
      }
    });
  });
}

/* ==========================================================================
   ANALYTICS CHART ANIMATION
   ========================================================================== */
function initDashboardCharts() {
  // Set random mock heights initially, then animate
  animateCharts();
}

function animateCharts() {
  const bars = document.querySelectorAll('.chart-bar');
  bars.forEach(bar => {
    const val = bar.getAttribute('data-value');
    bar.style.height = '0';
    setTimeout(() => {
      bar.style.height = `${val}%`;
    }, 150);
  });
}

/* ==========================================================================
   USER DASHBOARD INTERACTION MOCKS
   ========================================================================== */
function initUserDashboard() {
  // Appointment booking simulator
  const bookForm = document.getElementById('dash-book-form');
  const aptTable = document.getElementById('dash-appointments-table');

  if (bookForm && aptTable) {
    bookForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const doctor = document.getElementById('dash-book-doctor').value;
      const date = document.getElementById('dash-book-date').value;
      const time = document.getElementById('dash-book-time').value;
      const careType = document.getElementById('dash-book-care-type').value;

      if (!doctor || !date || !time) return;

      const newRow = document.createElement('tr');
      newRow.innerHTML = `
        <td><strong>${doctor}</strong><br><small style="color: var(--text-muted-dark);">${careType}</small></td>
        <td>${date}</td>
        <td>${time}</td>
        <td><span class="status-badge status-scheduled">Scheduled</span></td>
        <td>
          <button class="btn btn-outline-dark btn-sm cancel-apt-btn" style="padding: 0.4rem 0.8rem; font-size: 0.75rem;">Cancel</button>
        </td>
      `;

      // Prepend to show at the top of the table
      const tbody = aptTable.querySelector('tbody');
      if (tbody.querySelector('.empty-row')) {
        tbody.querySelector('.empty-row').remove();
      }
      tbody.insertBefore(newRow, tbody.firstChild);

      showToast('Appointment successfully scheduled!');
      bookForm.reset();
      
      // Navigate back to overview section
      document.querySelector('[data-section="sec-appointments"]').click();
    });
  }

  // Cancel Appointment handler
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('cancel-apt-btn')) {
      const row = e.target.closest('tr');
      const badge = row.querySelector('.status-badge');
      
      if (badge && !badge.classList.contains('status-cancelled')) {
        badge.textContent = 'Cancelled';
        badge.className = 'status-badge status-cancelled';
        e.target.disabled = true;
        e.target.textContent = 'Removed';
        showToast('Appointment cancelled.');
      }
    }
  });

  // Simulated Medical Reports Download
  const reportBtns = document.querySelectorAll('.download-report-btn');
  reportBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const reportName = btn.getAttribute('data-report');
      showToast(`Decrypting medical records... Dispatched ${reportName} download.`);
    });
  });

  // Patient Chat Widget
  const chatInput = document.getElementById('patient-chat-input');
  const chatSubmit = document.getElementById('patient-chat-submit');
  const chatHistory = document.getElementById('patient-chat-history');

  if (chatSubmit && chatInput && chatHistory) {
    const sendMessage = () => {
      const msgText = chatInput.value.trim();
      if (!msgText) return;

      // Add user message
      const userMsg = document.createElement('div');
      userMsg.style.alignSelf = 'flex-end';
      userMsg.style.backgroundColor = 'var(--color-primary)';
      userMsg.style.color = 'white';
      userMsg.style.padding = '0.8rem 1.2rem';
      userMsg.style.borderRadius = '16px 16px 2px 16px';
      userMsg.style.maxWidth = '75%';
      userMsg.style.fontSize = '0.9rem';
      userMsg.style.boxShadow = 'var(--shadow-sm)';
      userMsg.innerHTML = `<p>${msgText}</p><small style="display:block; text-align:right; margin-top:0.3rem; opacity:0.7; font-size:0.7rem;">Just now</small>`;
      chatHistory.appendChild(userMsg);
      chatHistory.scrollTop = chatHistory.scrollHeight;

      chatInput.value = '';

      // Simulate doctor auto response
      setTimeout(() => {
        const docMsg = document.createElement('div');
        docMsg.style.alignSelf = 'flex-start';
        docMsg.style.backgroundColor = '#f1f5f9';
        docMsg.style.color = 'var(--text-dark)';
        docMsg.style.padding = '0.8rem 1.2rem';
        docMsg.style.borderRadius = '16px 16px 16px 2px';
        docMsg.style.maxWidth = '75%';
        docMsg.style.fontSize = '0.9rem';
        docMsg.style.border = '1px solid #e2e8f0';
        docMsg.innerHTML = `<p>Received your update. Dr. Mercer has been notified, and we are updating your care plan dashboard shortly.</p><small style="display:block; margin-top:0.3rem; color: var(--text-muted-dark); font-size:0.7rem;">AuraCare Dispatcher • Just now</small>`;
        chatHistory.appendChild(docMsg);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        showToast('New message from care coordinator!');
      }, 1500);
    };

    chatSubmit.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }

  // Invoice Checkout Simulation
  const payBtns = document.querySelectorAll('.pay-invoice-btn');
  payBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      const invoiceId = row.cells[0].textContent;
      const statusBadge = row.querySelector('.status-badge');
      
      btn.disabled = true;
      btn.textContent = 'Processing...';
      
      setTimeout(() => {
        statusBadge.textContent = 'Paid';
        statusBadge.className = 'status-badge status-completed';
        btn.style.display = 'none';
        showToast(`Billing Transaction Cleared. Invoice ${invoiceId} Settled.`);
      }, 1200);
    });
  });
}

/* ==========================================================================
   ADMIN DASHBOARD INTERACTION MOCKS
   ========================================================================== */
function initAdminDashboard() {
  // Nurse & Doctor status triggers
  const dutyToggles = document.querySelectorAll('.duty-toggle');
  dutyToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const badge = toggle.closest('tr').querySelector('.status-badge');
      if (badge.textContent.trim() === 'On Duty' || badge.textContent.trim() === 'Available') {
        badge.textContent = 'Off Duty';
        badge.className = 'status-badge status-cancelled';
        toggle.textContent = 'Go On Call';
        showToast('Clinician set to Off Duty.');
      } else {
        badge.textContent = 'Available';
        badge.className = 'status-badge status-completed';
        toggle.textContent = 'Go Off Duty';
        showToast('Clinician activated.');
      }
    });
  });

  // Appointment Queue Approvals
  const approveBtns = document.querySelectorAll('.approve-apt-btn');
  const denyBtns = document.querySelectorAll('.deny-apt-btn');

  approveBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      const patient = row.cells[0].textContent.split('\n')[0].trim();
      const statusBadge = row.querySelector('.status-badge');

      statusBadge.textContent = 'Approved';
      statusBadge.className = 'status-badge status-completed';
      row.style.opacity = '0.6';
      btn.disabled = true;
      row.querySelector('.deny-apt-btn').disabled = true;
      
      showToast(`Appointment confirmed for ${patient}. Dispatch notice queued.`);
    });
  });

  denyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      const patient = row.cells[0].textContent.split('\n')[0].trim();
      const statusBadge = row.querySelector('.status-badge');

      statusBadge.textContent = 'Denied';
      statusBadge.className = 'status-badge status-cancelled';
      row.style.opacity = '0.6';
      btn.disabled = true;
      row.querySelector('.approve-apt-btn').disabled = true;
      
      showToast(`Appointment for ${patient} declined.`);
    });
  });

  // Inventory Stock Simulator
  const qtyInputs = document.querySelectorAll('.inventory-qty');
  qtyInputs.forEach(input => {
    input.addEventListener('change', () => {
      const name = input.closest('tr').cells[0].textContent.trim();
      const newVal = input.value;
      showToast(`Inventory updated: ${name} is now ${newVal} units.`);
    });
  });
}

/**
 * AuraCare Premium Dashboard Interactions & Mocks (Phase 2)
 * Senior Frontend Engineer & UI/UX Dashboard Architect
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Layout and Sidebar Controllers
  initLayoutControllers();

  // 2. Initialize Calendar and Appointments Widget
  initAppointmentsCalendar();

  // 3. Initialize Medical Reports Features
  initReportsSection();

  // 4. Initialize Medication Tracker Features
  initMedicationTracker();

  // 5. Initialize Clinical Chat & Calls
  initClinicalChat();

  // 6. Initialize Billing & Payments
  initBillingSystem();

  // 7. General Micro-interactions, FAQs & Search
  initGeneralInteractions();
});

/* ==========================================================================
   LAYOUT, SIDEBAR TOGGLES & FLOATING OVERLAYS
   ========================================================================== */
function initLayoutControllers() {
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const mainContent = document.querySelector('.dashboard-main');
  const topbar = document.querySelector('.dashboard-topbar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (!hamburgerBtn || !sidebar) return;

  function toggleSidebar() {
    if (window.innerWidth <= 1024) {
      // Mobile Drawer Toggle
      sidebar.classList.toggle('active');
      hamburgerBtn.classList.toggle('active');
      if (overlay) overlay.classList.toggle('active');
      
      // Disable scrolling behind drawer
      if (sidebar.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    } else {
      // Desktop Collapsed Sidebar Toggle
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
  }

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleSidebar();
  });

  if (overlay) {
    overlay.addEventListener('click', closeMobileSidebar);
  }

  // Close sidebar on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileSidebar();
      closeAllModals();
    }
  });

  // Close mobile sidebar on sidebar menu item clicks
  const menuItems = sidebar.querySelectorAll('.sidebar-menu .sidebar-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      // Sync Breadcrumb text
      const pageTitle = item.querySelector('span').textContent;
      const breadcrumbActive = document.getElementById('current-page-breadcrumb');
      if (breadcrumbActive) {
        breadcrumbActive.textContent = pageTitle;
      }
      
      // Auto close drawer on mobile
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

  // Handle Notifications Dropdown Click Toggle
  const notificationBadge = document.getElementById('notification-bell-btn');
  if (notificationBadge) {
    notificationBadge.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationBadge.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!notificationBadge.contains(e.target)) {
        notificationBadge.classList.remove('active');
      }
    });
  }
}

function closeAllModals() {
  const checkoutModal = document.getElementById('checkout-modal-overlay');
  if (checkoutModal) checkoutModal.classList.remove('active');
  
  const videoCall = document.getElementById('video-call-overlay');
  if (videoCall) stopCall(videoCall);
  
  const voiceCall = document.getElementById('voice-call-overlay');
  if (voiceCall) stopCall(voiceCall);
}

/* ==========================================================================
   APPOINTMENTS CALENDAR RENDER & BOOKING ENGINE
   ========================================================================== */
let activeMonth = new Date().getMonth();
let activeYear = new Date().getFullYear();

function initAppointmentsCalendar() {
  const calGrid = document.getElementById('calendar-days-grid');
  if (!calGrid) return;

  renderCalendar(activeMonth, activeYear);

  const prevBtn = document.getElementById('calendar-prev-month');
  const nextBtn = document.getElementById('calendar-next-month');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      activeMonth--;
      if (activeMonth < 0) {
        activeMonth = 11;
        activeYear--;
      }
      renderCalendar(activeMonth, activeYear);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      activeMonth++;
      if (activeMonth > 11) {
        activeMonth = 0;
        activeYear++;
      }
      renderCalendar(activeMonth, activeYear);
    });
  }
}

function renderCalendar(month, year) {
  const calGrid = document.getElementById('calendar-days-grid');
  const monthLabel = document.getElementById('calendar-month-year');
  if (!calGrid || !monthLabel) return;

  calGrid.innerHTML = '';
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  monthLabel.textContent = `${monthNames[month]} ${year}`;

  // Calendar Head labels
  const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  daysOfWeek.forEach(day => {
    const lbl = document.createElement('div');
    lbl.className = 'calendar-day-label';
    lbl.textContent = day;
    calGrid.appendChild(lbl);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Prev month padding cells
  for (let i = firstDay - 1; i >= 0; i--) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell muted';
    cell.textContent = prevMonthDays - i;
    calGrid.appendChild(cell);
  }

  // Active month cells
  const today = new Date();
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.textContent = d;

    // Check if cell is today
    if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
      cell.classList.add('active-today');
    }

    // Add mock schedules to cell dates
    if (d === 5 || d === 10 || d === 15) {
      cell.classList.add('has-appointment');
      if (d < today.getDate() && month <= today.getMonth()) {
        cell.classList.add('completed');
      }
    }

    cell.addEventListener('click', () => {
      document.querySelectorAll('.calendar-cell').forEach(c => c.classList.remove('selected'));
      cell.classList.add('selected');
      
      // Update form desired date if form exists
      const formDateInput = document.getElementById('dash-book-date');
      if (formDateInput) {
        const monthNum = String(month + 1).padStart(2, '0');
        const dayNum = String(d).padStart(2, '0');
        formDateInput.value = `${year}-${monthNum}-${dayNum}`;
        
        // Open appointment book panel smoothly
        const bookingPanel = document.getElementById('dash-book-panel');
        if (bookingPanel && bookingPanel.style.display === 'none') {
          bookingPanel.style.display = 'block';
          const triggerBtn = document.querySelector('[onclick*="dash-book-panel"]');
          if (triggerBtn) triggerBtn.style.display = 'none';
        }
      }
    });

    calGrid.appendChild(cell);
  }

  // Next month padding cells
  const totalCellsSoFar = firstDay + daysInMonth;
  const remainingCells = 42 - totalCellsSoFar; // 6 rows grid
  for (let n = 1; n <= remainingCells; n++) {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell muted';
    cell.textContent = n;
    calGrid.appendChild(cell);
  }
}

/* ==========================================================================
   MEDICAL DIAGNOSTIC REPORTS ENGINE
   ========================================================================== */
function initReportsSection() {
  const dropzone = document.getElementById('reports-drag-zone');
  const fileInput = document.getElementById('reports-file-picker');
  
  if (!dropzone) return;

  dropzone.addEventListener('click', () => {
    if (fileInput) fileInput.click();
  });

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--color-primary)';
    dropzone.style.backgroundColor = 'rgba(0, 102, 255, 0.04)';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = '#cbd5e1';
    dropzone.style.backgroundColor = '#f8fafc';
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = '#cbd5e1';
    dropzone.style.backgroundColor = '#f8fafc';
    
    if (e.dataTransfer.files.length > 0) {
      handleReportUploadSimulation(e.dataTransfer.files[0].name);
    }
  });

  if (fileInput) {
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        handleReportUploadSimulation(fileInput.files[0].name);
      }
    });
  }

  // Report Category Filter triggers
  const badges = document.querySelectorAll('.category-filter-badge');
  badges.forEach(badge => {
    badge.addEventListener('click', () => {
      badges.forEach(b => b.classList.remove('active'));
      badge.classList.add('active');
      const filterVal = badge.getAttribute('data-category');
      showToast(`Filter records by: ${badge.textContent}`);
      filterReportsTable(filterVal);
    });
  });
}

function handleReportUploadSimulation(fileName) {
  showToast(`Uploading diagnostic file: ${fileName}...`);
  setTimeout(() => {
    showToast(`Verification checked. Enqueued ${fileName} for clinical team sign-off.`);
    
    // Add to recent downloads/uploads list visually
    const downloadLogsBody = document.getElementById('recent-downloads-tbody');
    if (downloadLogsBody) {
      const row = document.createElement('tr');
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      row.innerHTML = `
        <td><strong>${fileName}</strong></td>
        <td>Upload Sync</td>
        <td>Today, ${timeStr}</td>
        <td><span class="status-badge status-scheduled">Pending Sign</span></td>
      `;
      downloadLogsBody.insertBefore(row, downloadLogsBody.firstChild);
    }
  }, 1200);
}

function filterReportsTable(category) {
  const table = document.getElementById('medical-reports-table-body');
  if (!table) return;

  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    if (category === 'all') {
      row.style.display = '';
      return;
    }
    const title = row.cells[0].textContent.toLowerCase();
    if (title.includes(category.toLowerCase())) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

/* ==========================================================================
   MEDICATION COMPLIANCE & CHECKBOX INTAKES
   ========================================================================== */
function initMedicationTracker() {
  const checkboxes = document.querySelectorAll('.med-custom-checkbox');
  const adherenceProgress = document.getElementById('med-adherence-progress');
  const adherenceNum = document.getElementById('med-adherence-percent');

  if (checkboxes.length === 0) return;

  // Set initial adherence percentage
  updateMedicationAdherence();

  checkboxes.forEach(box => {
    box.addEventListener('click', () => {
      const itemRow = box.closest('.med-schedule-item');
      itemRow.classList.toggle('taken');
      
      // Toast notification status alert
      const medName = itemRow.querySelector('h5').textContent;
      if (itemRow.classList.contains('taken')) {
        showToast(`Intake validated: Administered ${medName}.`);
      } else {
        showToast(`Intake status reset for ${medName}.`);
      }

      updateMedicationAdherence();
    });
  });
}

function updateMedicationAdherence() {
  const items = document.querySelectorAll('.med-schedule-item');
  const takenItems = document.querySelectorAll('.med-schedule-item.taken');
  const adherenceProgress = document.getElementById('med-adherence-progress');
  const adherenceNum = document.getElementById('med-adherence-percent');
  
  if (items.length === 0 || !adherenceProgress) return;

  const percentage = Math.round((takenItems.length / items.length) * 100);
  adherenceProgress.style.width = `${percentage}%`;
  
  if (adherenceNum) {
    adherenceNum.textContent = `${percentage}% Compliance`;
  }

  // Update compliance indicators elsewhere if exist
  const dashboardGoalBar = document.getElementById('overview-adherence-progress-bar');
  if (dashboardGoalBar) {
    dashboardGoalBar.style.width = `${percentage}%`;
    const textLabel = dashboardGoalBar.closest('.goal-progress-item').querySelector('.goal-progress-header span:last-child');
    if (textLabel) textLabel.textContent = `${percentage}%`;
  }
}

/* ==========================================================================
   CLINICAL MESSAGES & VOICE/VIDEO CONSULTATION OVERLAYS
   ========================================================================== */
let activeCallInterval = null;

function initClinicalChat() {
  const userItems = document.querySelectorAll('.chat-user-item');
  const activeName = document.getElementById('chat-active-name');
  const activeSpecialty = document.getElementById('chat-active-specialty');
  const chatAvatar = document.getElementById('chat-active-avatar-initials');
  
  if (userItems.length === 0) return;

  userItems.forEach(item => {
    item.addEventListener('click', () => {
      userItems.forEach(ui => ui.classList.remove('active'));
      item.classList.add('active');

      const name = item.querySelector('h5').textContent;
      const specialty = item.querySelector('p').textContent;
      
      if (activeName) activeName.textContent = name;
      if (activeSpecialty) activeSpecialty.textContent = specialty;

      // Extract Initials
      if (chatAvatar) {
        const initials = name.split(' ').map(n => n[0]).join('');
        chatAvatar.textContent = initials.substring(0, 2);
      }

      // Reset Unread Badge
      const badge = item.querySelector('.chat-unread-badge');
      if (badge) badge.remove();

      showToast(`Loading conversation records for ${name}`);

      // Toggle conversation active state on mobile viewports
      const chatGrid = document.querySelector('.chat-workspace-grid');
      if (chatGrid) {
        chatGrid.classList.add('conversation-active');
      }
    });
  });

  // Mobile Back Button logic
  const chatMobileBackBtn = document.getElementById('chat-mobile-back-btn');
  const chatGrid = document.querySelector('.chat-workspace-grid');
  if (chatMobileBackBtn && chatGrid) {
    chatMobileBackBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chatGrid.classList.remove('conversation-active');
    });
  }

  // Quick Replies Click Chip logic
  const quickPills = document.querySelectorAll('.chat-quick-reply-pill');
  const chatInput = document.getElementById('patient-chat-input');
  if (quickPills.length > 0 && chatInput) {
    quickPills.forEach(pill => {
      pill.addEventListener('click', () => {
        chatInput.value = pill.textContent;
        chatInput.focus();
        showToast('Pre-filled reply. Tap Transmit to send.');
      });
    });
  }

  // Call Button Triggers
  const audioBtn = document.getElementById('chat-call-audio-btn');
  const videoBtn = document.getElementById('chat-call-video-btn');
  
  const voiceOverlay = document.getElementById('voice-call-overlay');
  const videoOverlay = document.getElementById('video-call-overlay');

  if (audioBtn && voiceOverlay) {
    audioBtn.addEventListener('click', () => {
      const pName = activeName ? activeName.textContent : 'Sarah Jenkins, RN';
      const practitionerHeader = document.getElementById('voice-call-practitioner');
      if (practitionerHeader) practitionerHeader.textContent = pName;
      launchCall(voiceOverlay, 'Voice Call Connection initiated...');
    });
  }

  if (videoBtn && videoOverlay) {
    videoBtn.addEventListener('click', () => {
      const pName = activeName ? activeName.textContent : 'Dr. Adrian Mercer';
      const practitionerHeader = document.getElementById('video-call-practitioner');
      if (practitionerHeader) practitionerHeader.textContent = pName;
      launchCall(videoOverlay, 'Video Consultation link secure...');
    });
  }

  // End Call Hooks
  document.querySelectorAll('.call-ctrl-btn.end').forEach(btn => {
    btn.addEventListener('click', () => {
      const parentOverlay = btn.closest('.call-simulation-overlay');
      if (parentOverlay) stopCall(parentOverlay);
    });
  });

  // Mute buttons in call simulator
  document.querySelectorAll('.call-ctrl-btn.mute').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      if (btn.classList.contains('active')) {
        showToast('Microphone input muted.');
      } else {
        showToast('Microphone input active.');
      }
    });
  });
}

function launchCall(overlayElement, message) {
  showToast(message);
  overlayElement.classList.add('active');
  document.body.style.overflow = 'hidden';

  const timerText = overlayElement.querySelector('.call-timer');
  if (timerText) {
    let secs = 0;
    timerText.textContent = '00:00';
    activeCallInterval = setInterval(() => {
      secs++;
      const mins = Math.floor(secs / 60);
      const remSecs = secs % 60;
      timerText.textContent = `${String(mins).padStart(2, '0')}:${String(remSecs).padStart(2, '0')}`;
    }, 1000);
  }
}

function stopCall(overlayElement) {
  overlayElement.classList.remove('active');
  document.body.style.overflow = '';
  if (activeCallInterval) {
    clearInterval(activeCallInterval);
    activeCallInterval = null;
  }
  showToast('Consultation link closed.');
}

/* ==========================================================================
   BILLING SYSTEM & OUTSTANDING INVOICES CHECKOUT
   ========================================================================== */
let activePaymentInvoiceId = null;
let activePaymentRow = null;

function initBillingSystem() {
  const quickPayBtn = document.getElementById('billing-quick-pay-btn');
  const checkoutModal = document.getElementById('checkout-modal-overlay');
  
  if (quickPayBtn && checkoutModal) {
    quickPayBtn.addEventListener('click', () => {
      openCheckout('INV-2026-004', null);
    });
  }

  // Table pay button delegates
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('pay-invoice-btn')) {
      const row = e.target.closest('tr');
      const invoiceId = row.cells[0].textContent.trim();
      openCheckout(invoiceId, row);
    }
  });

  // Selectors in Checkout popup
  const paySelectors = document.querySelectorAll('.pay-selector');
  paySelectors.forEach(sel => {
    sel.addEventListener('click', () => {
      paySelectors.forEach(s => s.classList.remove('selected'));
      sel.classList.add('selected');
    });
  });

  // Form Submission
  const checkoutForm = document.getElementById('checkout-form-inner');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = checkoutForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Verifying with bank portal...';

      setTimeout(() => {
        showToast(`Transaction approved! Payment cleared for invoice: ${activePaymentInvoiceId}.`);
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Update table row if exist
        if (activePaymentRow) {
          const badge = activePaymentRow.querySelector('.status-badge');
          if (badge) {
            badge.textContent = 'Paid';
            badge.className = 'status-badge status-completed';
          }
          const actionBtn = activePaymentRow.querySelector('.pay-invoice-btn');
          if (actionBtn) {
            actionBtn.style.display = 'none';
          }
        } else {
          // General balance checkout, update overview metrics
          const outstandingText = document.getElementById('billing-outstanding-balance-text');
          if (outstandingText) outstandingText.textContent = '$0.00';
          
          const outstandingBadge = document.getElementById('overview-outstanding-badge-top');
          if (outstandingBadge) outstandingBadge.remove();
        }

        closeAllModals();
      }, 1500);
    });
  }

  // Cancel checkout
  const cancelBtn = document.getElementById('checkout-cancel-btn');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeAllModals);
  }
}

function openCheckout(invoiceId, rowElement) {
  const checkoutModal = document.getElementById('checkout-modal-overlay');
  const modalInvoiceSpan = document.getElementById('checkout-invoice-id-span');
  
  activePaymentInvoiceId = invoiceId;
  activePaymentRow = rowElement;

  if (modalInvoiceSpan) modalInvoiceSpan.textContent = invoiceId;
  if (checkoutModal) checkoutModal.classList.add('active');
}

/* ==========================================================================
   GENERAL UTILITIES: SEARCH ROUTING, FAQS & BREADCRUMBS
   ========================================================================== */
function initGeneralInteractions() {
  const searchInput = document.getElementById('global-dashboard-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      if (!term) return;

      // Direct search simulation depending on current active tab
      const activeSidebarItem = document.querySelector('.sidebar-item.active');
      if (!activeSidebarItem) return;

      const sectionId = activeSidebarItem.getAttribute('data-section');
      showToast(`Searching for "${term}" in current section...`);
      
      // Quick search logic
      const activeSection = document.getElementById(sectionId);
      if (!activeSection) return;

      const rows = activeSection.querySelectorAll('table tbody tr');
      rows.forEach(row => {
        let match = false;
        Array.from(row.cells).forEach(cell => {
          if (cell.textContent.toLowerCase().includes(term)) {
            match = true;
          }
        });
        if (match) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // Initialize FAQ accordion triggers
  const faqHeaders = document.querySelectorAll('.faq-accordion-header');
  if (faqHeaders.length > 0) {
    faqHeaders.forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.faq-accordion-item');
        const content = item.querySelector('.faq-accordion-content');
        
        // Toggle active state
        item.classList.toggle('active');
        
        if (item.classList.contains('active')) {
          content.style.maxHeight = content.scrollHeight + 'px';
        } else {
          content.style.maxHeight = '0';
        }
      });
    });
  }

  // Animate Billing Stats Chart Bars on visible
  const billingStatsChart = document.querySelector('.billing-chart-bars-row');
  if (billingStatsChart) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateBillingChart();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(billingStatsChart);
  }
}

function animateBillingChart() {
  const bars = document.querySelectorAll('.billing-chart-bar-fill');
  bars.forEach(bar => {
    const val = bar.getAttribute('data-height');
    bar.style.height = '0';
    setTimeout(() => {
      bar.style.height = `${val}px`;
    }, 150);
  });
}

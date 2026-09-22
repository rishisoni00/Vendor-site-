// Initialize Charts and Sync on Load
document.addEventListener('DOMContentLoaded', () => {
  loadLiveCustomerRequests();
  initCharts();
  
  // Real-time synchronization whenever customer makes a booking on customer tab
  window.addEventListener('storage', (event) => {
    if (event.key === 'customer_bookings') {
      loadLiveCustomerRequests();
    }
  });
});

// Sync function to pull data sent by customer site
function loadLiveCustomerRequests() {
  const tableBody = document.getElementById('vendorRequestsTable');
  const storedBookings = JSON.parse(localStorage.getItem('customer_bookings')) || [];

  document.getElementById('pendingCountBadge').innerText = storedBookings.length;
  document.getElementById('statPendingCount').innerText = storedBookings.length;

  if (storedBookings.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; color:#777;">No pending customer booking requests</td></tr>`;
    return;
  }

  tableBody.innerHTML = storedBookings.map((req, index) => `
    <tr>
      <td>${req.memberId}</td>
      <td>${req.customerName}</td>
      <td>${req.productName}</td>
      <td>₹${req.price.toLocaleString()}</td>
      <td>${req.mudraReward} Gold</td>
      <td><span style="color: #ffaa00;">${req.status || 'Pending'}</span></td>
      <td>
        ${req.status === 'Approved' ? '<span style="color:#00ff66">Approved</span>' : 
          req.status === 'Rejected' ? '<span style="color:#ff3333">Rejected</span>' : `
          <button class="btn-action btn-approve" onclick="updateStatus(${index}, 'Approved')">Approve</button>
          <button class="btn-action btn-reject" onclick="updateStatus(${index}, 'Rejected')">Reject</button>
        `}
      </td>
    </tr>
  `).join('');
}

// Update Request Status (Approve/Reject)
function updateStatus(index, newStatus) {
  let storedBookings = JSON.parse(localStorage.getItem('customer_bookings')) || [];
  if (storedBookings[index]) {
    storedBookings[index].status = newStatus;
    localStorage.setItem('customer_bookings', JSON.stringify(storedBookings));
    loadLiveCustomerRequests();
  }
}

function clearAllRequests() {
  localStorage.removeItem('customer_bookings');
  loadLiveCustomerRequests();
}

// Chart initialization matching vendor dashboard design
function initCharts() {
  // Pie Chart
  const pieCtx = document.getElementById('ordersPieChart').getContext('2d');
  new Chart(pieCtx, {
    type: 'doughnut',
    data: {
      labels: ['Pending', 'Confirmed', 'Processing', 'Delivered'],
      datasets: [{
        data: [12, 48, 15, 38],
        backgroundColor: ['#ffaa00', '#D4AF37', '#00bcd4', '#2e7d32']
      }]
    },
    options: { plugins: { legend: { labels: { color: '#fff' } } } }
  });

  // Line Chart
  const lineCtx = document.getElementById('revenueLineChart').getContext('2d');
  new Chart(lineCtx, {
    type: 'line',
    data: {
      labels: ['01 May', '08 May', '15 May', '22 May', '29 May'],
      datasets: [{
        label: 'Total Revenue (₹)',
        data: [120000, 190000, 150000, 280000, 345000],
        borderColor: '#D4AF37',
        tension: 0.3,
        fill: false
      }]
    },
    options: { plugins: { legend: { labels: { color: '#fff' } } } }
  });
}

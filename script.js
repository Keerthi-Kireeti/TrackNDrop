document.addEventListener('DOMContentLoaded', () => {
// QR Scanner Implementation
let html5QrCode;

document.addEventListener('DOMContentLoaded', () => {
  const startScannerBtn = document.getElementById('startScanner');
  const scannerResultDiv = document.getElementById('scannerResult');
  const closeScannerBtn = document.getElementById('closeScanner');
  const reader = document.getElementById('reader');

  if (startScannerBtn) {
    startScannerBtn.addEventListener('click', () => {
      startScannerBtn.disabled = true;
      startScannerBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Starting Scanner...';
      
      html5QrCode = new Html5Qrcode("reader");
      html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: 250
        },
        (decodedText) => {
          // Handle successful scan
          processScannedData(decodedText);
          scannerResultDiv.classList.remove('hidden');
          startScannerBtn.classList.add('hidden');
          html5QrCode.stop();
        },
        (errorMessage) => {
          console.warn(`QR Code scan error: ${errorMessage}`);
          startScannerBtn.disabled = false;
          startScannerBtn.innerHTML = '<i class="fas fa-camera mr-2"></i> Start Scanner';
        }
      ).catch(err => {
        console.error(`Unable to start scanning: ${err}`);
        startScannerBtn.disabled = false;
        startScannerBtn.innerHTML = '<i class="fas fa-camera mr-2"></i> Start Scanner';
        alert("Failed to access camera. Please ensure camera permissions are granted.");
      });
    });

    if (closeScannerBtn) {
      closeScannerBtn.addEventListener('click', () => {
        scannerResultDiv.classList.add('hidden');
        startScannerBtn.classList.remove('hidden');
        startScannerBtn.disabled = false;
        startScannerBtn.innerHTML = '<i class="fas fa-camera mr-2"></i> Start Scanner';
        if (html5QrCode && html5QrCode.isScanning) {
          html5QrCode.stop();
        }
      });
    }
  }
});

function processScannedData(decodedText) {
  // Parse the QR code data (format: BOX_ID|TYPE|CYCLE_COUNT|LOCATION|LAST_USED|MFG_DATE)
  const data = decodedText.split('|');
  
  // Set the box details
  document.getElementById('boxId').textContent = data[0] || 'N/A';
  document.getElementById('boxType').textContent = data[1] || 'N/A';
  document.getElementById('cycleCount').textContent = data[2] || '0';
  document.getElementById('currentLocation').textContent = data[3] || 'Unknown';
  document.getElementById('lastUsed').textContent = data[4] || 'N/A';
  document.getElementById('manufactureDate').textContent = data[5] || 'N/A';
  
  // Calculate and display health status
  updateHealthStatus(data[2]);
}

function updateHealthStatus(cycleCount) {
  const count = parseInt(cycleCount) || 0;
  const maxCycles = 150; // Assuming maximum lifecycle is 150 cycles
  const healthPercent = Math.max(0, 100 - Math.floor((count / maxCycles) * 100));
  
  const healthBar = document.getElementById('healthBar');
  const healthStatus = document.getElementById('healthStatus');
  const inspectionStatus = document.getElementById('inspectionStatus');
  
  // Update health bar
  healthBar.style.width = `${healthPercent}%`;
  
  // Update colors based on health
  if (healthPercent > 70) {
    healthBar.className = 'bg-green-500 h-2.5 rounded-full';
    healthStatus.textContent = 'Excellent condition';
    healthStatus.className = 'text-sm text-green-500 mt-1';
  } else if (healthPercent > 30) {
    healthBar.className = 'bg-yellow-500 h-2.5 rounded-full';
    healthStatus.textContent = 'Good condition';
    healthStatus.className = 'text-sm text-yellow-500 mt-1';
  } else {
    healthBar.className = 'bg-red-500 h-2.5 rounded-full';
    healthStatus.textContent = 'Needs replacement soon';
    healthStatus.className = 'text-sm text-red-500 mt-1';
  }
  
  // Update inspection status
  if (count > 100) {
    inspectionStatus.textContent = 'Needs Inspection';
    inspectionStatus.className = 'px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800';
  } else if (count > 50) {
    inspectionStatus.textContent = 'Monitor Condition';
    inspectionStatus.className = 'px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800';
  } else {
    inspectionStatus.textContent = 'Good Condition';
    inspectionStatus.className = 'px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800';
  }
}
    // --- Common Navigation Logic ---
    const mobileMenuButton = document.querySelector('nav button.md\\:hidden');
    const navLinksContainer = document.querySelector('nav .hidden.md\\:flex');

    if (mobileMenuButton && navLinksContainer) {
        mobileMenuButton.addEventListener('click', () => {
            navLinksContainer.classList.toggle('hidden');
            navLinksContainer.classList.toggle('flex');
            navLinksContainer.classList.toggle('flex-col');
            navLinksContainer.classList.toggle('absolute');
            navLinksContainer.classList.toggle('top-full');
            navLinksContainer.classList.toggle('left-0');
            navLinksContainer.classList.toggle('w-full');
            navLinksContainer.classList.toggle('bg-blue-800');
            navLinksContainer.classList.toggle('py-2');
            navLinksContainer.classList.toggle('space-y-2');
            navLinksContainer.classList.toggle('md:space-y-0');
        });
    }

    // --- Dashboard Page Specific Logic ---
    const usageChartElement = document.getElementById('usageChart');
    const turnoverChartElement = document.getElementById('turnoverChart');

    if (usageChartElement && turnoverChartElement) {
        // Chart.js initialization for usageChart
        const usageCtx = usageChartElement.getContext('2d');
        new Chart(usageCtx, {
            type: 'doughnut',
            data: {
                labels: ['Active', 'Needs Inspection', 'End of Life'],
                datasets: [{
                    data: [982, 87, 179],
                    backgroundColor: ['#3B82F6', '#FBBF24', '#EF4444'],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: 'Box Usage Distribution'
                    }
                }
            }
        });

        // Chart.js initialization for turnoverChart
        const turnoverCtx = turnoverChartElement.getContext('2d');
        new Chart(turnoverCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Boxes Checked In',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: '#3B82F6',
                    tension: 0.1
                }, {
                    label: 'Boxes Checked Out',
                    data: [28, 48, 40, 19, 86, 27],
                    borderColor: '#FBBF24',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false,
                        text: 'Monthly Box Turnover'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // --- Box Management Page Specific Logic ---
    const boxModal = document.getElementById('boxModal');
    if (boxModal) {
        const closeModalBtn = document.getElementById('closeModal');
        const viewDetailsButtons = document.querySelectorAll('.box-card button.text-blue-600');

        viewDetailsButtons.forEach(button => {
            button.addEventListener('click', () => {
                boxModal.classList.remove('hidden');
            });
        });

        closeModalBtn.addEventListener('click', () => {
            boxModal.classList.add('hidden');
        });

        boxModal.addEventListener('click', (e) => {
            if (e.target === boxModal) {
                boxModal.classList.add('hidden');
            }
        });
    }

    // --- QR Scanner Page Specific Logic ---
    const startScannerBtn = document.getElementById('startScanner');
    const scannerResultDiv = document.getElementById('scannerResult');
    const closeScannerBtn = document.getElementById('closeScanner');
    const reader = document.getElementById('reader');

    if (startScannerBtn) {
        startScannerBtn.addEventListener('click', () => {
            const html5QrCode = new Html5Qrcode("reader");
            html5QrCode.start(
                { facingMode: "environment" }, // Use the environment camera
                {
                    fps: 10,    // Set the frames per second
                    qrbox: 250  // Set the size of the scanning box
                },
                (decodedText, decodedResult) => {
                    // Handle the scanned QR code
                    document.getElementById('boxId').innerText = decodedText; // Display scanned QR code
                    document.getElementById('boxType').innerText = "Plastic Container"; // Example data
                    document.getElementById('cycleCount').innerText = "147/150"; // Example data
                    document.getElementById('currentLocation').innerText = "Warehouse A"; // Example data
                    document.getElementById('lastUsed').innerText = "2 days ago"; // Example data
                    document.getElementById('manufactureDate').innerText = "March 15, 2022"; // Example data
                    document.getElementById('inspectionStatus').innerText = "Needs Inspection"; // Example data
                    scannerResultDiv.classList.remove('hidden');
                    startScannerBtn.classList.add('hidden');
                    html5QrCode.stop(); // Stop scanning after successful scan
                },
                (errorMessage) => {
                    // Handle scan error
                    console.warn(`QR Code scan error: ${errorMessage}`);
                }
            ).catch(err => {
                console.error(`Unable to start scanning: ${err}`);
            });
        });

        if (closeScannerBtn) {
            closeScannerBtn.addEventListener('click', () => {
                scannerResultDiv.classList.add('hidden');
                startScannerBtn.classList.remove('hidden');
            });
        }
    }

    // --- Alerts Page Specific Logic ---
    const alertTabs = document.querySelectorAll('.alert-tab');
    if (alertTabs.length > 0) {
        const alertContents = document.querySelectorAll('.alert-content');

        alertTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Deactivate all tabs and hide all content
                alertTabs.forEach(t => {
                    t.classList.remove('border-blue-500', 'text-blue-600');
                    t.classList.add('text-gray-500', 'hover:text-gray-700');
                });
                alertContents.forEach(content => content.classList.add('hidden'));

                // Activate clicked tab and show corresponding content
                tab.classList.add('border-blue-500', 'text-blue-600');
                tab.classList.remove('text-gray-500', 'hover:text-gray-700');
                const targetContentId = `${tab.dataset.tab}-alerts`;
                const targetContent = document.getElementById(targetContentId);
                if (targetContent) {
                    targetContent.classList.remove('hidden');
                }
            });
        });
    }

    // --- Login Page Specific Logic ---
    const loginForm = document.querySelector('form[action="dashboard.html"]');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default form submission

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const userType = document.querySelector('input[name="user_type"]:checked').value;

            if (username && password) {
                alert(`Logging in as ${userType} with username: ${username}`);
                // In a real application, you would send this data to a server
                // and redirect based on the server's response.
                window.location.href = 'dashboard.html'; // Redirect to dashboard
            } else {
                alert('Please enter both username and password.');
            }
        });
    }
});

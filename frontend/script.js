// Point this at wherever the Flask backend is reachable from the browser.
// By default we assume it's on the same host, port 5000.
const API_URL = `http://${window.location.hostname}:5000/api/stats`;

const POLL_INTERVAL_MS = 3000;

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true }
  }
};

const cpuChart = new Chart(document.getElementById("cpuChart"), {
  type: "doughnut",
  data: {
    labels: ["Used", "Idle"],
    datasets: [{
      data: [0, 100],
      backgroundColor: ["#4f8cff", "#262a33"],
      borderWidth: 0
    }]
  },
  options: chartOptions
});

const memChart = new Chart(document.getElementById("memChart"), {
  type: "doughnut",
  data: {
    labels: ["Used", "Free"],
    datasets: [{
      data: [0, 100],
      backgroundColor: ["#ff6b6b", "#262a33"],
      borderWidth: 0
    }]
  },
  options: chartOptions
});

const statusEl = document.getElementById("status");
const cpuLabel = document.getElementById("cpuLabel");
const memLabel = document.getElementById("memLabel");
const memDetail = document.getElementById("memDetail");

async function fetchStats() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    cpuChart.data.datasets[0].data = [data.cpu.used, data.cpu.idle];
    cpuChart.update();
    cpuLabel.textContent = `${data.cpu.used}%`;

    memChart.data.datasets[0].data = [data.memory.used, data.memory.free];
    memChart.update();
    memLabel.textContent = `${data.memory.used}%`;
    memDetail.textContent = `${data.memory.used_gb} GB / ${data.memory.total_gb} GB`;

    statusEl.textContent = `Live · updated ${new Date().toLocaleTimeString()}`;
  } catch (err) {
    statusEl.textContent = "Unable to reach backend — retrying…";
    console.error("Failed to fetch stats:", err);
  }
}

fetchStats();
setInterval(fetchStats, POLL_INTERVAL_MS);

/**
 * Pie Chart Component
 * Menampilkan visualisasi distribusi pengeluaran menggunakan Chart.js
 */

const PieChart = (() => {
  let chartInstance = null;
  let $canvas = null;
  let isInitialized = false;

  /**
   * Initialize Chart.js instance
   * @param {string} canvasId - ID dari canvas element
   * @returns {boolean} true jika berhasil
   */
  const initialize = (canvasId = 'expenseChart') => {
    try {
      $canvas = document.getElementById(canvasId);
      
      if (!$canvas) {
        console.error(`Canvas dengan ID ${canvasId} tidak ditemukan di DOM`);
        return false;
      }

      if (typeof Chart === 'undefined') {
        console.error('Chart.js library tidak ditemukan');
        return false;
      }

      // Initialize dengan data kosong
      const chartData = getChartData([]);
      
      chartInstance = new Chart($canvas, {
        type: 'pie',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              data: chartData.data,
              backgroundColor: chartData.colors,
              borderColor: '#ffffff',
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                padding: 15,
                font: {
                  size: 14,
                  family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                },
                color: '#333333',
                boxWidth: 15,
                boxHeight: 15
              }
            },
            tooltip: {
              padding: 10,
              displayColors: true,
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = Formatters.formatCurrency(context.parsed);
                  const percentage = Formatters.formatPercentage((context.parsed / getTotalAmount(chartInstance.data.datasets[0].data)) * 100);
                  return `${label}: ${value} (${percentage})`;
                }
              }
            }
          }
        }
      });

      isInitialized = true;
      return true;

    } catch (error) {
      console.error('Error initializing Chart.js:', error);
      return false;
    }
  };

  /**
   * Update chart dengan data transaksi
   * @param {Array} transactions - Array transaksi
   */
  const update = (transactions) => {
    if (!isInitialized || !chartInstance) {
      // Jika belum initialized, coba initialize
      if (!initialize()) return;
    }

    try {
      const chartData = getChartData(transactions);
      
      chartInstance.data.labels = chartData.labels;
      chartInstance.data.datasets[0].data = chartData.data;
      chartInstance.data.datasets[0].backgroundColor = chartData.colors;
      chartInstance.data.datasets[0].borderColor = '#ffffff';
      chartInstance.data.datasets[0].borderWidth = 2;

      chartInstance.update();

    } catch (error) {
      console.error('Error updating chart:', error);
    }
  };

  /**
   * Prepare chart data dari transactions
   * @param {Array} transactions - Array transaksi
   * @returns {Object} Chart data object dengan labels, data, colors
   */
  const getChartData = (transactions) => {
    const breakdown = {};
    const categories = Validators.VALID_CATEGORIES;

    // Initialize breakdown dengan semua kategori
    categories.forEach(category => {
      breakdown[category] = 0;
    });

    // Aggregate transaksi berdasarkan kategori
    if (Array.isArray(transactions)) {
      transactions.forEach(tx => {
        if (breakdown.hasOwnProperty(tx.category)) {
          breakdown[tx.category] += tx.amount;
        }
      });
    }

    // Filter kategori yang punya nilai > 0
    const labels = [];
    const data = [];
    const colors = [];

    categories.forEach(category => {
      if (breakdown[category] > 0) {
        labels.push(category);
        data.push(breakdown[category]);
        colors.push(Formatters.formatCategoryToColor(category));
      }
    });

    return {
      labels: labels.length > 0 ? labels : ['Belum ada data'],
      data: data.length > 0 ? data : [1],
      colors: colors.length > 0 ? colors : ['#cccccc']
    };
  };

  /**
   * Get total amount dari chart data
   * @param {Array} data - Chart data array
   * @returns {number} Total amount
   */
  const getTotalAmount = (data) => {
    if (!Array.isArray(data)) return 0;
    return data.reduce((sum, value) => sum + value, 0);
  };

  /**
   * Destroy chart instance
   */
  const destroy = () => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
      isInitialized = false;
    }
  };

  /**
   * Get chart instance (untuk advanced usage)
   * @returns {Object} Chart.js instance
   */
  const getChartInstance = () => {
    return chartInstance;
  };

  /**
   * Check if chart is initialized
   * @returns {boolean}
   */
  const isInitializedChart = () => {
    return isInitialized && chartInstance !== null;
  };

  // Public API
  return {
    initialize,
    update,
    getChartData,
    destroy,
    getChartInstance,
    isInitializedChart
  };
})();

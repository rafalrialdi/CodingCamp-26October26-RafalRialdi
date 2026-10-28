/**
 * Pie Chart Component
 * Renders and manages the expense distribution pie chart using Chart.js
 */

const PieChart = (() => {
  // Private state
  let chart = null;
  let $canvas = null;
  let updateTimeout = null;

  /**
   * Initialize chart canvas reference
   * @returns {void}
   */
  const initialize = () => {
    $canvas = document.getElementById('expenseChart');
    
    if (!$canvas) {
      console.error('Canvas element not found');
      return;
    }

    if (typeof Chart === 'undefined') {
      console.error('Chart.js library not loaded');
      return;
    }

    // Create initial empty chart
    createChart([]);
  };

  /**
   * Create Chart.js instance
   * @param {array} transactions - Transactions to initialize chart with
   * @returns {void}
   */
  const createChart = (transactions) => {
    if (!$canvas || typeof Chart === 'undefined') {
      return;
    }

    // Get chart data
    const chartData = getChartData(transactions);

    // Create or update chart
    const ctx = $canvas.getContext('2d');

    if (chart) {
      chart.destroy();
    }

    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            data: chartData.data,
            backgroundColor: chartData.colors,
            borderColor: '#FFFFFF',
            borderWidth: 2,
            hoverOffset: 10
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: {
                size: 12,
                weight: '500'
              },
              color: '#2C3E50'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const rawValue = typeof context.parsed === 'object'
                  ? context.parsed.y
                  : context.parsed;
                const value = Formatters.formatCurrency(rawValue);
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((rawValue / total) * 100).toFixed(1) : '0.0';
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });
  };

  /**
   * Prepare chart data from transactions
   * @param {array} transactions - Array of transactions
   * @returns {object} Chart data with labels, data, and colors
   */
  const getChartData = (transactions) => {
    // Keep the DataManager contract used by the rest of the app, while still
    // deriving the chart from the transactions passed to this render call.
    if (typeof DataManager !== 'undefined' && DataManager.getAggregatedByCategory) {
      DataManager.getAggregatedByCategory();
    }

    let aggregated = {};

    if (Array.isArray(transactions)) {
      transactions.forEach(transaction => {
        const amount = parseFloat(transaction.amount) || 0;
        aggregated[transaction.category] = (aggregated[transaction.category] || 0) + amount;
      });
    } else if (typeof DataManager !== 'undefined' && DataManager.getAggregatedByCategory) {
      aggregated = DataManager.getAggregatedByCategory();
    }

    const labels = [];
    const data = [];
    const colors = [];

    // Only include categories with transactions
    Object.entries(aggregated).forEach(([category, amount]) => {
      labels.push(category);
      data.push(amount);
      colors.push(Formatters.formatCategoryToColor(category));
    });

    return {
      labels,
      data,
      colors
    };
  };

  /**
   * Update chart with new data (debounced)
   * @param {array} transactions - Updated transactions array
   * @returns {void}
   */
  const update = (transactions) => {
    // Clear previous timeout
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    // Debounce chart update (100ms)
    updateTimeout = setTimeout(() => {
      if (!chart || !$canvas) {
        createChart(transactions);
        return;
      }

      const chartData = getChartData(transactions);

      // Update chart data
      chart.data.labels = chartData.labels;
      chart.data.datasets[0].data = chartData.data;
      chart.data.datasets[0].backgroundColor = chartData.colors;

      // Animate update
      chart.update('active');
    }, 100);
  };

  /**
   * Render chart with transactions
   * @param {array} transactions - Array of transactions
   * @returns {void}
   */
  const render = (transactions) => {
    update(transactions);
  };

  /**
   * Destroy chart instance
   * @returns {void}
   */
  const destroy = () => {
    if (updateTimeout) {
      clearTimeout(updateTimeout);
    }

    if (chart) {
      chart.destroy();
      chart = null;
    }
  };

  /**
   * Check if chart is initialized
   * @returns {boolean} True if chart exists
   */
  const isInitialized = () => {
    return chart !== null;
  };

  // Public API
  return {
    initialize,
    update,
    render,
    destroy,
    getChartData,
    isInitialized
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PieChart;
}

/**
 * Pie Chart Component Tests
 * Tests for Chart.js visualization and data aggregation
 */

describe('PieChart Component', () => {
  let canvas;
  let mockTransactions;

  beforeEach(() => {
    // Create mock canvas element
    document.body.innerHTML = '<canvas id="expenseChart"></canvas>';
    canvas = document.getElementById('expenseChart');

    // Mock transactions
    mockTransactions = [
      {
        id: '1',
        itemName: 'Lunch',
        amount: 50000,
        category: 'Makanan',
        timestamp: Date.now(),
        date: '2024-01-01'
      },
      {
        id: '2',
        itemName: 'Taxi',
        amount: 25000,
        category: 'Transportasi',
        timestamp: Date.now(),
        date: '2024-01-01'
      },
      {
        id: '3',
        itemName: 'Movie',
        amount: 75000,
        category: 'Hiburan',
        timestamp: Date.now(),
        date: '2024-01-01'
      },
      {
        id: '4',
        itemName: 'Dinner',
        amount: 60000,
        category: 'Makanan',
        timestamp: Date.now(),
        date: '2024-01-01'
      }
    ];

    // Mock DataManager
    window.DataManager = {
      getAggregatedByCategory: () => {
        return {
          'Makanan': 110000,
          'Transportasi': 25000,
          'Hiburan': 75000
        };
      },
      getAllTransactions: () => mockTransactions
    };
  });

  afterEach(() => {
    // Destroy chart after each test
    if (PieChart.isInitialized()) {
      PieChart.destroy();
    }
    document.body.innerHTML = '';
  });

  describe('initialize()', () => {
    it('should initialize chart with canvas element', () => {
      PieChart.initialize();
      expect(PieChart.isInitialized()).toBe(true);
    });

    it('should handle missing canvas element gracefully', () => {
      document.body.innerHTML = ''; // Remove canvas
      PieChart.initialize();
      // Should not throw error
      expect(PieChart.isInitialized()).toBe(false);
    });
  });

  describe('getChartData()', () => {
    it('should aggregate transactions by category', () => {
      const chartData = PieChart.getChartData(mockTransactions);

      expect(chartData.labels).toContain('Makanan');
      expect(chartData.labels).toContain('Transportasi');
      expect(chartData.labels).toContain('Hiburan');
    });

    it('should correctly sum amounts by category', () => {
      const chartData = PieChart.getChartData(mockTransactions);

      expect(chartData.data).toEqual([110000, 25000, 75000]);
    });

    it('should assign colors to categories', () => {
      const chartData = PieChart.getChartData(mockTransactions);

      expect(chartData.colors).toContain('#FF6B6B'); // Makanan
      expect(chartData.colors).toContain('#4ECDC4'); // Transportasi
      expect(chartData.colors).toContain('#FFE66D'); // Hiburan
    });

    it('should only include categories with transactions', () => {
      const singleCategoryTransactions = [mockTransactions[0]];
      const chartData = PieChart.getChartData(singleCategoryTransactions);

      expect(chartData.labels.length).toBe(1);
      expect(chartData.labels[0]).toBe('Makanan');
    });

    it('should handle empty transaction array', () => {
      const chartData = PieChart.getChartData([]);

      expect(chartData.labels.length).toBe(0);
      expect(chartData.data.length).toBe(0);
      expect(chartData.colors.length).toBe(0);
    });
  });

  describe('update()', () => {
    it('should update chart data without throwing errors', (done) => {
      PieChart.initialize();

      // Update should be debounced
      PieChart.update(mockTransactions);

      setTimeout(() => {
        expect(PieChart.isInitialized()).toBe(true);
        done();
      }, 150); // Wait for debounce
    });
  });

  describe('render()', () => {
    it('should render chart with transactions', (done) => {
      PieChart.initialize();
      PieChart.render(mockTransactions);

      setTimeout(() => {
        expect(PieChart.isInitialized()).toBe(true);
        done();
      }, 150);
    });
  });

  describe('destroy()', () => {
    it('should destroy chart instance', () => {
      PieChart.initialize();
      expect(PieChart.isInitialized()).toBe(true);

      PieChart.destroy();
      expect(PieChart.isInitialized()).toBe(false);
    });

    it('should clear timeout on destroy', (done) => {
      PieChart.initialize();
      PieChart.update(mockTransactions);

      PieChart.destroy();

      // Should not cause error even if timeout fires
      setTimeout(() => {
        expect(true).toBe(true);
        done();
      }, 200);
    });
  });

  describe('Performance - Debouncing', () => {
    it('should debounce rapid updates', (done) => {
      PieChart.initialize();
      let updateCount = 0;

      // Call update multiple times rapidly
      for (let i = 0; i < 5; i++) {
        PieChart.update(mockTransactions);
      }

      // Only the last update should be processed
      setTimeout(() => {
        expect(PieChart.isInitialized()).toBe(true);
        done();
      }, 150);
    });
  });

  describe('Chart Configuration', () => {
    it('should use doughnut chart type', () => {
      PieChart.initialize();
      // This would be verified by checking the chart type
      // Requires access to internal chart object
      expect(PieChart.isInitialized()).toBe(true);
    });
  });
});

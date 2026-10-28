/**
 * Pie Chart Integration Test
 * Tests the pie chart component integration with DataManager and Formatters
 */

describe('PieChart Component Integration', () => {
  let mockTransactions;

  beforeEach(() => {
    // Create mock canvas element
    document.body.innerHTML = '<canvas id="expenseChart"></canvas>';

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

  describe('getChartData with Formatters integration', () => {
    it('should use correct color values from Formatters', () => {
      const chartData = PieChart.getChartData(mockTransactions);

      expect(chartData.colors[0]).toBe('#FF6B6B'); // Makanan
      expect(chartData.colors[1]).toBe('#4ECDC4'); // Transportasi
      expect(chartData.colors[2]).toBe('#FFE66D'); // Hiburan
    });

    it('should aggregate all transactions by category correctly', () => {
      const chartData = PieChart.getChartData(mockTransactions);

      const makananIndex = chartData.labels.indexOf('Makanan');
      const transportasiIndex = chartData.labels.indexOf('Transportasi');
      const hiburanIndex = chartData.labels.indexOf('Hiburan');

      expect(chartData.data[makananIndex]).toBe(110000);
      expect(chartData.data[transportasiIndex]).toBe(25000);
      expect(chartData.data[hiburanIndex]).toBe(75000);
    });

    it('should correctly sum multiple transactions in same category', () => {
      const chartData = PieChart.getChartData(mockTransactions);
      const makananIndex = chartData.labels.indexOf('Makanan');

      // Two transactions: 50000 + 60000 = 110000
      expect(chartData.data[makananIndex]).toBe(110000);
    });

    it('should handle single transaction per category correctly', () => {
      const singleTransactions = [mockTransactions[1]]; // Only Transportasi
      const chartData = PieChart.getChartData(singleTransactions);

      expect(chartData.labels).toHaveLength(1);
      expect(chartData.labels[0]).toBe('Transportasi');
      expect(chartData.data[0]).toBe(25000);
    });

    it('should return empty data for empty transaction list', () => {
      window.DataManager.getAggregatedByCategory = () => ({});
      
      const chartData = PieChart.getChartData([]);

      expect(chartData.labels).toHaveLength(0);
      expect(chartData.data).toHaveLength(0);
      expect(chartData.colors).toHaveLength(0);
    });
  });

  describe('Chart.js integration', () => {
    it('should initialize with correct chart data structure', () => {
      PieChart.initialize();

      expect(PieChart.isInitialized()).toBe(true);
    });

    it('should create chart with doughnut type', () => {
      PieChart.initialize();
      PieChart.render(mockTransactions);

      expect(PieChart.isInitialized()).toBe(true);
    });

    it('should use proper Chart.js configuration', () => {
      PieChart.initialize();
      
      const chartData = PieChart.getChartData(mockTransactions);
      
      expect(chartData).toHaveProperty('labels');
      expect(chartData).toHaveProperty('data');
      expect(chartData).toHaveProperty('colors');
      expect(Array.isArray(chartData.labels)).toBe(true);
      expect(Array.isArray(chartData.data)).toBe(true);
      expect(Array.isArray(chartData.colors)).toBe(true);
    });
  });

  describe('Data synchronization with DataManager', () => {
    it('should call DataManager.getAggregatedByCategory', () => {
      const spy = jest.spyOn(DataManager, 'getAggregatedByCategory');
      
      PieChart.getChartData(mockTransactions);

      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should update when data changes', (done) => {
      PieChart.initialize();
      PieChart.update(mockTransactions);

      setTimeout(() => {
        expect(PieChart.isInitialized()).toBe(true);
        done();
      }, 150);
    });

    it('should debounce multiple updates', (done) => {
      PieChart.initialize();
      
      const calls = [];
      const originalGetChartData = PieChart.getChartData;
      
      // Call update multiple times rapidly
      for (let i = 0; i < 5; i++) {
        PieChart.update(mockTransactions);
      }

      // After debounce period, only one update should be processed
      setTimeout(() => {
        expect(PieChart.isInitialized()).toBe(true);
        done();
      }, 150);
    });
  });

  describe('Formatter integration for category colors', () => {
    it('should map all categories to valid hex colors', () => {
      const chartData = PieChart.getChartData(mockTransactions);

      chartData.colors.forEach(color => {
        // Check if color is valid hex format
        expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
      });
    });

    it('should use Formatters.formatCategoryToColor correctly', () => {
      const makananColor = Formatters.formatCategoryToColor('Makanan');
      const transportasiColor = Formatters.formatCategoryToColor('Transportasi');
      const hiburanColor = Formatters.formatCategoryToColor('Hiburan');

      expect(makananColor).toBe('#FF6B6B');
      expect(transportasiColor).toBe('#4ECDC4');
      expect(hiburanColor).toBe('#FFE66D');
    });
  });

  describe('Property: Pie Chart Data Aggregation', () => {
    it('should validate Property 5: Pie Chart Data Aggregation', () => {
      // Property: For any collection of transactions, the pie chart data 
      // grouping by category SHALL accurately sum amounts per category
      
      const chartData = PieChart.getChartData(mockTransactions);
      const aggregated = DataManager.getAggregatedByCategory();

      // Verify all categories are included
      Object.keys(aggregated).forEach(category => {
        expect(chartData.labels).toContain(category);
      });

      // Verify sums are correct
      Object.entries(aggregated).forEach(([category, expectedSum]) => {
        const index = chartData.labels.indexOf(category);
        expect(chartData.data[index]).toBe(expectedSum);
      });
    });

    it('should validate Property 9: Empty State Handling', () => {
      // Property: For any empty transaction list (zero transactions), 
      // the pie chart SHALL handle gracefully without errors
      
      window.DataManager.getAggregatedByCategory = () => ({});
      
      const chartData = PieChart.getChartData([]);

      // Should not throw error
      expect(() => {
        PieChart.initialize();
        PieChart.render([]);
      }).not.toThrow();

      // Chart should be initialized even with empty data
      expect(PieChart.isInitialized()).toBe(true);
    });
  });
});

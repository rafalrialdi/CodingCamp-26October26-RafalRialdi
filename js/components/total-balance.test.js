/**
 * Total Balance Component Tests
 * Tests for calculating and displaying total amount of all transactions
 */

describe('TotalBalance Component', () => {
  let $totalAmount;
  let mockTransactions;

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = '<p id="totalAmount">Rp 0</p>';
    $totalAmount = document.getElementById('totalAmount');

    // Mock Formatters if not already loaded
    if (!window.Formatters) {
      window.Formatters = {
        formatCurrency: (amount) => {
          const num = parseFloat(amount) || 0;
          return `Rp ${Math.floor(num).toLocaleString()}`;
        }
      };
    }

    // Initialize component
    TotalBalance.initialize();

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
      }
    ];
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('initialize()', () => {
    it('should initialize with totalAmount element reference', () => {
      expect($totalAmount).toBeTruthy();
    });

    it('should handle missing element gracefully', () => {
      document.body.innerHTML = '';
      TotalBalance.initialize();
      // Should not throw error
      expect(true).toBe(true);
    });

    it('should return void on initialization', () => {
      document.body.innerHTML = '<p id="totalAmount">Rp 0</p>';
      TotalBalance.initialize();
      const result = TotalBalance.initialize();
      expect(result).toBeUndefined();
    });
  });

  describe('calculateTotal()', () => {
    it('should calculate total from valid transactions', () => {
      const total = TotalBalance.calculateTotal(mockTransactions);
      expect(total).toBe(150000); // 50000 + 25000 + 75000
    });

    it('should return 0 for empty transaction array', () => {
      const total = TotalBalance.calculateTotal([]);
      expect(total).toBe(0);
    });

    it('should return 0 for null input', () => {
      const total = TotalBalance.calculateTotal(null);
      expect(total).toBe(0);
    });

    it('should return 0 for undefined input', () => {
      const total = TotalBalance.calculateTotal(undefined);
      expect(total).toBe(0);
    });

    it('should return 0 for non-array input', () => {
      const total = TotalBalance.calculateTotal('not an array');
      expect(total).toBe(0);
    });

    it('should handle transactions with string amounts', () => {
      const transactions = [
        { amount: '50000' },
        { amount: '25000' }
      ];
      const total = TotalBalance.calculateTotal(transactions);
      expect(total).toBe(75000);
    });

    it('should handle transactions with missing amounts as 0', () => {
      const transactions = [
        { amount: 50000 },
        { amount: undefined },
        { amount: 25000 }
      ];
      const total = TotalBalance.calculateTotal(transactions);
      expect(total).toBe(75000);
    });

    it('should handle decimal amounts', () => {
      const transactions = [
        { amount: 50000.50 },
        { amount: 25000.50 }
      ];
      const total = TotalBalance.calculateTotal(transactions);
      expect(total).toBeCloseTo(75001, 0);
    });

    it('should ignore invalid amount values', () => {
      const transactions = [
        { amount: 50000 },
        { amount: 'invalid' },
        { amount: 25000 },
        { amount: null }
      ];
      const total = TotalBalance.calculateTotal(transactions);
      expect(total).toBe(75000);
    });

    it('should handle single transaction', () => {
      const transactions = [{ amount: 50000 }];
      const total = TotalBalance.calculateTotal(transactions);
      expect(total).toBe(50000);
    });

    it('should handle very large amounts', () => {
      const transactions = [
        { amount: 999999999 },
        { amount: 1 }
      ];
      const total = TotalBalance.calculateTotal(transactions);
      expect(total).toBe(1000000000);
    });

    it('should be accurate with many transactions', () => {
      const transactions = Array.from({ length: 100 }, (_, i) => ({
        amount: 1000 * (i + 1)
      }));
      const expectedTotal = 1000 * (100 * 101 / 2); // Sum of 1000 to 100000
      const total = TotalBalance.calculateTotal(transactions);
      expect(total).toBe(expectedTotal);
    });
  });

  describe('update()', () => {
    it('should update display with formatted currency', () => {
      TotalBalance.update(mockTransactions);
      expect($totalAmount.textContent).toContain('Rp');
      expect($totalAmount.textContent).toContain('150');
    });

    it('should update display to 0 for empty transactions', () => {
      TotalBalance.update([]);
      expect($totalAmount.textContent).toContain('Rp');
      expect($totalAmount.textContent).toContain('0');
    });

    it('should not throw error when container is null', () => {
      document.body.innerHTML = '';
      TotalBalance.initialize();
      expect(() => TotalBalance.update(mockTransactions)).not.toThrow();
    });

    it('should apply scaling animation', (done) => {
      TotalBalance.update(mockTransactions);

      // Check initial scale
      expect($totalAmount.style.transform).toBe('scale(0.95)');

      // Check scale returns to normal after animation
      setTimeout(() => {
        expect($totalAmount.style.transform).toBe('scale(1)');
        done();
      }, 10);
    });

    it('should handle rapid consecutive updates', () => {
      expect(() => {
        TotalBalance.update(mockTransactions);
        TotalBalance.update([]);
        TotalBalance.update(mockTransactions);
      }).not.toThrow();
    });

    it('should update on transaction addition', () => {
      TotalBalance.update([mockTransactions[0]]);
      const firstDisplay = $totalAmount.textContent;

      TotalBalance.update(mockTransactions);
      const secondDisplay = $totalAmount.textContent;

      expect(firstDisplay).not.toBe(secondDisplay);
    });

    it('should update display with new total', () => {
      TotalBalance.update([{ amount: 50000 }]);
      expect($totalAmount.textContent).toContain('50');

      TotalBalance.update(mockTransactions);
      expect($totalAmount.textContent).toContain('150');
    });
  });

  describe('getTotal()', () => {
    it('should return numeric total for transactions', () => {
      const total = TotalBalance.getTotal(mockTransactions);
      expect(total).toBe(150000);
      expect(typeof total).toBe('number');
    });

    it('should return 0 for empty transactions', () => {
      const total = TotalBalance.getTotal([]);
      expect(total).toBe(0);
    });

    it('should return 0 for null input', () => {
      const total = TotalBalance.getTotal(null);
      expect(total).toBe(0);
    });

    it('should return numeric value, not formatted string', () => {
      const total = TotalBalance.getTotal(mockTransactions);
      expect(typeof total).toBe('number');
      expect(total).not.toContain('Rp');
    });

    it('should be consistent with calculateTotal', () => {
      const calculated = TotalBalance.calculateTotal(mockTransactions);
      const retrieved = TotalBalance.getTotal(mockTransactions);
      expect(retrieved).toBe(calculated);
    });
  });

  describe('render()', () => {
    it('should render total balance with transactions', () => {
      TotalBalance.render(mockTransactions);
      expect($totalAmount.textContent).toContain('Rp');
      expect($totalAmount.textContent).toContain('150');
    });

    it('should render 0 for empty transactions', () => {
      TotalBalance.render([]);
      expect($totalAmount.textContent).toContain('Rp');
      expect($totalAmount.textContent).toContain('0');
    });

    it('should call update internally', () => {
      // Verify by checking display is updated
      const initialText = $totalAmount.textContent;
      TotalBalance.render(mockTransactions);
      const newText = $totalAmount.textContent;

      expect(initialText).not.toBe(newText);
      expect(newText).toContain('150');
    });

    it('should not throw error with null transactions', () => {
      expect(() => TotalBalance.render(null)).not.toThrow();
    });

    it('should handle render called multiple times', () => {
      expect(() => {
        TotalBalance.render(mockTransactions);
        TotalBalance.render([]);
        TotalBalance.render(mockTransactions);
      }).not.toThrow();
    });
  });

  describe('Public API', () => {
    it('should expose all required methods', () => {
      expect(typeof TotalBalance.initialize).toBe('function');
      expect(typeof TotalBalance.render).toBe('function');
      expect(typeof TotalBalance.update).toBe('function');
      expect(typeof TotalBalance.getTotal).toBe('function');
      expect(typeof TotalBalance.calculateTotal).toBe('function');
    });

    it('should only expose public methods', () => {
      const publicMethods = Object.keys(TotalBalance);
      expect(publicMethods).toContain('initialize');
      expect(publicMethods).toContain('render');
      expect(publicMethods).toContain('update');
      expect(publicMethods).toContain('getTotal');
      expect(publicMethods).toContain('calculateTotal');
    });
  });

  describe('Integration Scenarios', () => {
    it('should work with typical single transaction', () => {
      const transaction = [{
        id: '1',
        itemName: 'Lunch',
        amount: 50000,
        category: 'Makanan'
      }];

      TotalBalance.render(transaction);
      const total = TotalBalance.getTotal(transaction);

      expect(total).toBe(50000);
      expect($totalAmount.textContent).toContain('50');
    });

    it('should work with multiple categories', () => {
      TotalBalance.render(mockTransactions);
      const total = TotalBalance.getTotal(mockTransactions);

      expect(total).toBe(150000);
      expect($totalAmount.textContent).toContain('150');
    });

    it('should update correctly when transactions change', () => {
      // Start with 1 transaction
      TotalBalance.update([mockTransactions[0]]);
      const afterFirst = $totalAmount.textContent;

      // Add more transactions
      TotalBalance.update(mockTransactions);
      const afterAll = $totalAmount.textContent;

      expect(afterFirst).not.toBe(afterAll);
    });

    it('should handle transaction deletion scenario', () => {
      // Start with all
      TotalBalance.update(mockTransactions);
      const withAll = TotalBalance.getTotal(mockTransactions);

      // Remove one
      const remaining = mockTransactions.slice(1);
      TotalBalance.update(remaining);
      const withoutFirst = TotalBalance.getTotal(remaining);

      expect(withAll).toBe(150000);
      expect(withoutFirst).toBe(100000);
    });

    it('should show 0 when all transactions deleted', () => {
      TotalBalance.update(mockTransactions);
      TotalBalance.update([]);

      const total = TotalBalance.getTotal([]);
      expect(total).toBe(0);
      expect($totalAmount.textContent).toContain('Rp');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large transaction lists', () => {
      const largeList = Array.from({ length: 10000 }, (_, i) => ({
        id: String(i),
        amount: 1000,
        category: 'Makanan'
      }));

      const total = TotalBalance.calculateTotal(largeList);
      expect(total).toBe(10000000);
    });

    it('should handle floating point precision correctly', () => {
      const transactions = [
        { amount: 0.1 },
        { amount: 0.2 },
        { amount: 0.3 }
      ];

      const total = TotalBalance.calculateTotal(transactions);
      expect(total).toBeCloseTo(0.6, 10);
    });

    it('should handle negative amounts gracefully', () => {
      const transactions = [
        { amount: 50000 },
        { amount: -25000 },
        { amount: 75000 }
      ];

      const total = TotalBalance.calculateTotal(transactions);
      expect(total).toBe(100000);
    });

    it('should handle zero amount transactions', () => {
      const transactions = [
        { amount: 0 },
        { amount: 50000 },
        { amount: 0 }
      ];

      const total = TotalBalance.calculateTotal(transactions);
      expect(total).toBe(50000);
    });

    it('should maintain accuracy with many decimal amounts', () => {
      const transactions = Array.from({ length: 100 }, () => ({
        amount: 123.456
      }));

      const total = TotalBalance.calculateTotal(transactions);
      expect(total).toBeCloseTo(12345.6, 1);
    });
  });

  describe('Requirement Validation - 4.1, 4.2, 4.3, 4.4', () => {
    it('should display cumulative total at top (Req 4.1)', () => {
      TotalBalance.render(mockTransactions);
      expect($totalAmount.textContent).toContain('Rp');
      expect($totalAmount.textContent).toContain('150');
    });

    it('should update total instantly on new transaction (Req 4.2)', () => {
      const singleTx = [mockTransactions[0]];
      TotalBalance.update(singleTx);
      const firstTotal = TotalBalance.getTotal(singleTx);

      TotalBalance.update(mockTransactions);
      const secondTotal = TotalBalance.getTotal(mockTransactions);

      expect(firstTotal).toBe(50000);
      expect(secondTotal).toBe(150000);
      expect(secondTotal).toBeGreaterThan(firstTotal);
    });

    it('should update total on deletion (Req 4.3)', () => {
      TotalBalance.update(mockTransactions);
      const beforeDelete = TotalBalance.getTotal(mockTransactions);

      const remaining = mockTransactions.slice(1);
      TotalBalance.update(remaining);
      const afterDelete = TotalBalance.getTotal(remaining);

      expect(beforeDelete).toBe(150000);
      expect(afterDelete).toBe(100000);
      expect(afterDelete).toBeLessThan(beforeDelete);
    });

    it('should display 0 with no transactions (Req 4.4)', () => {
      TotalBalance.update([]);
      const total = TotalBalance.getTotal([]);

      expect(total).toBe(0);
      expect($totalAmount.textContent).toContain('Rp');
      expect($totalAmount.textContent).toContain('0');
    });
  });
});

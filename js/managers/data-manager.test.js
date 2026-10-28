/**
 * Unit Tests for DataManager
 * Tests CRUD operations, observer pattern, and data validation
 */

// Mock setup for Formatters
const Formatters = (() => {
  const formatDateISO = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return {
    formatDateISO
  };
})();

// Mock setup for Validators
const Validators = (() => {
  const VALID_CATEGORIES = ['Makanan', 'Transportasi', 'Hiburan'];

  const validateTransaction = (transaction) => {
    if (!transaction || typeof transaction !== 'object') {
      return { valid: false, error: 'Invalid transaction object' };
    }

    // Validate item name
    if (typeof transaction.itemName !== 'string' || transaction.itemName.trim().length === 0) {
      return { valid: false, error: 'Item name is required' };
    }

    // Validate amount
    const amount = parseFloat(transaction.amount);
    if (isNaN(amount) || amount <= 0) {
      return { valid: false, error: 'Amount must be positive' };
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(transaction.category)) {
      return { valid: false, error: 'Invalid category' };
    }

    return { valid: true, error: null };
  };

  return {
    validateTransaction
  };
})();

// DataManager implementation (from data-manager.js)
const DataManager = (() => {
  let transactions = [];
  let observers = [];

  const generateId = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const initialize = (data = []) => {
    if (Array.isArray(data)) {
      transactions = data.map(transaction => ({ ...transaction }));
    }
  };

  const addTransaction = (transactionData) => {
    const validation = Validators.validateTransaction(transactionData);
    if (!validation.valid) {
      console.warn('Transaction validation failed:', validation.error);
      return null;
    }

    const transaction = {
      id: generateId(),
      itemName: transactionData.itemName.trim(),
      amount: parseFloat(transactionData.amount),
      category: transactionData.category,
      timestamp: Date.now(),
      date: Formatters.formatDateISO(new Date())
    };

    transactions.push(transaction);
    notifyObservers();
    return transaction;
  };

  const deleteTransaction = (transactionId) => {
    const index = transactions.findIndex(t => t.id === transactionId);

    if (index === -1) {
      console.warn('Transaction not found:', transactionId);
      return false;
    }

    transactions.splice(index, 1);
    notifyObservers();
    return true;
  };

  const getAllTransactions = () => {
    return [...transactions];
  };

  const getTransactionsByCategory = (category) => {
    return transactions.filter(t => t.category === category);
  };

  const calculateTotal = () => {
    return transactions.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);
  };

  const calculateCategoryTotal = (category) => {
    return getTransactionsByCategory(category).reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);
  };

  const getTransactionCount = () => {
    return transactions.length;
  };

  const getCategories = () => {
    return [...new Set(transactions.map(t => t.category))];
  };

  const clearAll = () => {
    transactions = [];
    notifyObservers();
  };

  const subscribe = (callback) => {
    if (typeof callback === 'function') {
      observers.push(callback);
    }
  };

  const unsubscribe = (callback) => {
    observers = observers.filter(obs => obs !== callback);
  };

  const notifyObservers = () => {
    observers.forEach(callback => {
      try {
        callback(getAllTransactions());
      } catch (error) {
        console.error('Observer callback error:', error);
      }
    });
  };

  const getAggregatedByCategory = () => {
    const aggregated = {};

    transactions.forEach(transaction => {
      if (!aggregated[transaction.category]) {
        aggregated[transaction.category] = 0;
      }
      aggregated[transaction.category] += transaction.amount;
    });

    return aggregated;
  };

  const getStatistics = () => {
    return {
      total: calculateTotal(),
      count: getTransactionCount(),
      average: transactions.length > 0 ? calculateTotal() / transactions.length : 0,
      categories: getCategories(),
      byCategory: getAggregatedByCategory()
    };
  };

  // Expose private state for testing only
  const _reset = () => {
    transactions = [];
    observers = [];
  };

  return {
    initialize,
    addTransaction,
    deleteTransaction,
    getAllTransactions,
    getTransactionsByCategory,
    calculateTotal,
    calculateCategoryTotal,
    getTransactionCount,
    getCategories,
    clearAll,
    subscribe,
    unsubscribe,
    notifyObservers,
    getAggregatedByCategory,
    getStatistics,
    _reset
  };
})();

// ============================================================================
// TEST SUITE
// ============================================================================

describe('DataManager - CRUD Operations', () => {
  beforeEach(() => {
    DataManager._reset();
  });

  test('should initialize with empty transactions', () => {
    expect(DataManager.getAllTransactions()).toEqual([]);
    expect(DataManager.getTransactionCount()).toBe(0);
  });

  test('should add a valid transaction', () => {
    const transaction = {
      itemName: 'Makan Siang',
      amount: 50000,
      category: 'Makanan'
    };

    const result = DataManager.addTransaction(transaction);

    expect(result).not.toBeNull();
    expect(result.id).toBeDefined();
    expect(result.itemName).toBe('Makan Siang');
    expect(result.amount).toBe(50000);
    expect(result.category).toBe('Makanan');
    expect(result.timestamp).toBeDefined();
    expect(result.date).toBeDefined();
  });

  test('should trim whitespace from item name', () => {
    const transaction = {
      itemName: '  Makan Siang  ',
      amount: 50000,
      category: 'Makanan'
    };

    const result = DataManager.addTransaction(transaction);
    expect(result.itemName).toBe('Makan Siang');
  });

  test('should reject transaction with invalid item name', () => {
    const result = DataManager.addTransaction({
      itemName: '',
      amount: 50000,
      category: 'Makanan'
    });

    expect(result).toBeNull();
    expect(DataManager.getTransactionCount()).toBe(0);
  });

  test('should reject transaction with invalid amount', () => {
    const result = DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: -50000,
      category: 'Makanan'
    });

    expect(result).toBeNull();
  });

  test('should reject transaction with invalid category', () => {
    const result = DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: 50000,
      category: 'Lainnya'
    });

    expect(result).toBeNull();
  });

  test('should delete an existing transaction', () => {
    const tx1 = DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: 50000,
      category: 'Makanan'
    });

    expect(DataManager.getTransactionCount()).toBe(1);

    const deleted = DataManager.deleteTransaction(tx1.id);
    expect(deleted).toBe(true);
    expect(DataManager.getTransactionCount()).toBe(0);
  });

  test('should return false when deleting non-existent transaction', () => {
    const deleted = DataManager.deleteTransaction('non-existent-id');
    expect(deleted).toBe(false);
  });

  test('should get all transactions', () => {
    DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: 50000,
      category: 'Makanan'
    });

    DataManager.addTransaction({
      itemName: 'Bensin',
      amount: 100000,
      category: 'Transportasi'
    });

    const transactions = DataManager.getAllTransactions();
    expect(transactions.length).toBe(2);
    expect(transactions[0].itemName).toBe('Makan Siang');
    expect(transactions[1].itemName).toBe('Bensin');
  });

  test('should return a copy of transactions array', () => {
    DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: 50000,
      category: 'Makanan'
    });

    const transactions1 = DataManager.getAllTransactions();
    const transactions2 = DataManager.getAllTransactions();

    expect(transactions1).toEqual(transactions2);
    expect(transactions1).not.toBe(transactions2);
  });
});

describe('DataManager - Filtering and Aggregation', () => {
  beforeEach(() => {
    DataManager._reset();
    DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: 50000,
      category: 'Makanan'
    });
    DataManager.addTransaction({
      itemName: 'Bensin',
      amount: 100000,
      category: 'Transportasi'
    });
    DataManager.addTransaction({
      itemName: 'Makan Malam',
      amount: 75000,
      category: 'Makanan'
    });
    DataManager.addTransaction({
      itemName: 'Film',
      amount: 50000,
      category: 'Hiburan'
    });
  });

  test('should get transactions by category', () => {
    const foodTransactions = DataManager.getTransactionsByCategory('Makanan');
    expect(foodTransactions.length).toBe(2);
    expect(foodTransactions.every(t => t.category === 'Makanan')).toBe(true);
  });

  test('should return empty array for category with no transactions', () => {
    const result = DataManager.getTransactionsByCategory('Lainnya');
    expect(result).toEqual([]);
  });

  test('should calculate total correctly', () => {
    const total = DataManager.calculateTotal();
    expect(total).toBe(50000 + 100000 + 75000 + 50000);
  });

  test('should calculate category total correctly', () => {
    const foodTotal = DataManager.calculateCategoryTotal('Makanan');
    expect(foodTotal).toBe(50000 + 75000);

    const transportTotal = DataManager.calculateCategoryTotal('Transportasi');
    expect(transportTotal).toBe(100000);
  });

  test('should get all categories', () => {
    const categories = DataManager.getCategories();
    expect(categories.length).toBe(3);
    expect(categories.includes('Makanan')).toBe(true);
    expect(categories.includes('Transportasi')).toBe(true);
    expect(categories.includes('Hiburan')).toBe(true);
  });

  test('should aggregate by category correctly', () => {
    const aggregated = DataManager.getAggregatedByCategory();

    expect(aggregated['Makanan']).toBe(50000 + 75000);
    expect(aggregated['Transportasi']).toBe(100000);
    expect(aggregated['Hiburan']).toBe(50000);
  });

  test('should get statistics correctly', () => {
    const stats = DataManager.getStatistics();

    expect(stats.total).toBe(275000);
    expect(stats.count).toBe(4);
    expect(stats.average).toBe(275000 / 4);
    expect(stats.categories.length).toBe(3);
    expect(stats.byCategory['Makanan']).toBe(125000);
  });

  test('should get transaction count correctly', () => {
    expect(DataManager.getTransactionCount()).toBe(4);
  });
});

describe('DataManager - Observer Pattern', () => {
  beforeEach(() => {
    DataManager._reset();
  });

  test('should notify observers when transaction is added', () => {
    const callback = jest.fn();
    DataManager.subscribe(callback);

    DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: 50000,
      category: 'Makanan'
    });

    expect(callback).toHaveBeenCalledTimes(1);
    const transactions = callback.mock.calls[0][0];
    expect(transactions.length).toBe(1);
  });

  test('should notify observers when transaction is deleted', () => {
    const tx = DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: 50000,
      category: 'Makanan'
    });

    const callback = jest.fn();
    DataManager.subscribe(callback);

    DataManager.deleteTransaction(tx.id);

    expect(callback).toHaveBeenCalledTimes(1);
    const transactions = callback.mock.calls[0][0];
    expect(transactions.length).toBe(0);
  });

  test('should notify all observers', () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    DataManager.subscribe(callback1);
    DataManager.subscribe(callback2);

    DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: 50000,
      category: 'Makanan'
    });

    expect(callback1).toHaveBeenCalledTimes(1);
    expect(callback2).toHaveBeenCalledTimes(1);
  });

  test('should unsubscribe observer', () => {
    const callback = jest.fn();

    DataManager.subscribe(callback);
    DataManager.unsubscribe(callback);

    DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: 50000,
      category: 'Makanan'
    });

    expect(callback).not.toHaveBeenCalled();
  });

  test('should handle observer errors gracefully', () => {
    const errorCallback = () => {
      throw new Error('Observer error');
    };

    const normalCallback = jest.fn();

    DataManager.subscribe(errorCallback);
    DataManager.subscribe(normalCallback);

    // Should not throw
    expect(() => {
      DataManager.addTransaction({
        itemName: 'Makan Siang',
        amount: 50000,
        category: 'Makanan'
      });
    }).not.toThrow();

    expect(normalCallback).toHaveBeenCalled();
  });
});

describe('DataManager - Data Initialization and Clear', () => {
  beforeEach(() => {
    DataManager._reset();
  });

  test('should initialize with existing data', () => {
    const mockData = [
      {
        id: '123',
        itemName: 'Makan Siang',
        amount: 50000,
        category: 'Makanan',
        timestamp: Date.now(),
        date: '2024-01-01'
      },
      {
        id: '456',
        itemName: 'Bensin',
        amount: 100000,
        category: 'Transportasi',
        timestamp: Date.now(),
        date: '2024-01-01'
      }
    ];

    DataManager.initialize(mockData);

    expect(DataManager.getTransactionCount()).toBe(2);
    expect(DataManager.getAllTransactions()).toEqual(mockData);
  });

  test('should deep copy data during initialization', () => {
    const mockData = [
      {
        id: '123',
        itemName: 'Makan Siang',
        amount: 50000,
        category: 'Makanan',
        timestamp: Date.now(),
        date: '2024-01-01'
      }
    ];

    DataManager.initialize(mockData);
    mockData[0].amount = 999999;

    const transactions = DataManager.getAllTransactions();
    expect(transactions[0].amount).toBe(50000);
  });

  test('should clear all transactions', () => {
    DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: 50000,
      category: 'Makanan'
    });

    DataManager.addTransaction({
      itemName: 'Bensin',
      amount: 100000,
      category: 'Transportasi'
    });

    expect(DataManager.getTransactionCount()).toBe(2);

    DataManager.clearAll();

    expect(DataManager.getTransactionCount()).toBe(0);
    expect(DataManager.getAllTransactions()).toEqual([]);
  });

  test('should notify observers when clearing all', () => {
    const callback = jest.fn();

    DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: 50000,
      category: 'Makanan'
    });

    DataManager.subscribe(callback);

    DataManager.clearAll();

    expect(callback).toHaveBeenCalled();
    const transactions = callback.mock.calls[0][0];
    expect(transactions).toEqual([]);
  });
});

describe('DataManager - Edge Cases', () => {
  beforeEach(() => {
    DataManager._reset();
  });

  test('should handle very large amounts', () => {
    const result = DataManager.addTransaction({
      itemName: 'Beli Rumah',
      amount: 999999999,
      category: 'Makanan'
    });

    expect(result).not.toBeNull();
    expect(result.amount).toBe(999999999);
  });

  test('should handle decimal amounts', () => {
    const result = DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: '50000.50',
      category: 'Makanan'
    });

    expect(result).not.toBeNull();
    expect(result.amount).toBe(50000.5);
  });

  test('should generate unique IDs', () => {
    const tx1 = DataManager.addTransaction({
      itemName: 'Makan Siang',
      amount: 50000,
      category: 'Makanan'
    });

    const tx2 = DataManager.addTransaction({
      itemName: 'Bensin',
      amount: 100000,
      category: 'Transportasi'
    });

    expect(tx1.id).not.toBe(tx2.id);
  });

  test('should handle empty categories result', () => {
    const categories = DataManager.getCategories();
    expect(categories).toEqual([]);
  });

  test('should calculate zero total for empty transactions', () => {
    expect(DataManager.calculateTotal()).toBe(0);
  });

  test('should calculate zero average for empty transactions', () => {
    const stats = DataManager.getStatistics();
    expect(stats.average).toBe(0);
  });
});

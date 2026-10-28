/**
 * Data Manager - Manages in-memory transaction state
 * Handles CRUD operations and observer pattern for data changes
 */

const DataManager = (() => {
  // Private state
  let transactions = [];
  let observers = [];

  /**
   * Generate unique transaction ID (timestamp-based)
   * @returns {string} Unique ID
   */
  const generateId = () => {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  /**
   * Initialize data from array (used during load)
   * @param {array} data - Array of transactions to initialize
   */
  const initialize = (data = []) => {
    if (Array.isArray(data)) {
      transactions = data.map(transaction => ({ ...transaction }));
    }
  };

  /**
   * Add new transaction
   * @param {object} transaction - Transaction object with itemName, amount, category
   * @returns {object|null} Created transaction object or null if validation fails
   */
  const addTransaction = (transactionData) => {
    // Validate transaction
    const validation = Validators.validateTransaction(transactionData);
    if (!validation.valid) {
      console.warn('Transaction validation failed:', validation.error);
      return null;
    }

    // Create transaction object with metadata
    const transaction = {
      id: generateId(),
      itemName: transactionData.itemName.trim(),
      amount: parseFloat(transactionData.amount),
      category: transactionData.category,
      timestamp: Date.now(),
      date: Formatters.formatDateISO(new Date())
    };

    // Add to array
    transactions.push(transaction);

    // Notify observers
    notifyObservers();

    return transaction;
  };

  /**
   * Delete transaction by ID
   * @param {string} transactionId - ID of transaction to delete
   * @returns {boolean} True if deleted, false if not found
   */
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

  /**
   * Get all transactions
   * @returns {array} Copy of transactions array
   */
  const getAllTransactions = () => {
    return [...transactions];
  };

  /**
   * Get transactions by category
   * @param {string} category - Category to filter by
   * @returns {array} Array of transactions in category
   */
  const getTransactionsByCategory = (category) => {
    return transactions.filter(t => t.category === category);
  };

  /**
   * Calculate total amount from all transactions
   * @returns {number} Total amount
   */
  const calculateTotal = () => {
    return transactions.reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);
  };

  /**
   * Calculate total for specific category
   * @param {string} category - Category to calculate total for
   * @returns {number} Total for category
   */
  const calculateCategoryTotal = (category) => {
    return getTransactionsByCategory(category).reduce((sum, transaction) => {
      return sum + transaction.amount;
    }, 0);
  };

  /**
   * Get transactions count
   * @returns {number} Number of transactions
   */
  const getTransactionCount = () => {
    return transactions.length;
  };

  /**
   * Get all categories that have transactions
   * @returns {array} Array of unique category names
   */
  const getCategories = () => {
    return [...new Set(transactions.map(t => t.category))];
  };

  /**
   * Clear all transactions
   * @returns {void}
   */
  const clearAll = () => {
    transactions = [];
    notifyObservers();
  };

  /**
   * Subscribe to data changes
   * @param {function} callback - Function to call when data changes
   * @returns {void}
   */
  const subscribe = (callback) => {
    if (typeof callback === 'function') {
      observers.push(callback);
    }
  };

  /**
   * Unsubscribe from data changes
   * @param {function} callback - Function to remove from observers
   * @returns {void}
   */
  const unsubscribe = (callback) => {
    observers = observers.filter(obs => obs !== callback);
  };

  /**
   * Notify all observers of data change
   * @returns {void}
   */
  const notifyObservers = () => {
    observers.forEach(callback => {
      try {
        callback(getAllTransactions());
      } catch (error) {
        console.error('Observer callback error:', error);
      }
    });
  };

  /**
   * Get aggregated data by category
   * @returns {object} Object with categories as keys and totals as values
   */
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

  /**
   * Get transaction statistics
   * @returns {object} Statistics object
   */
  const getStatistics = () => {
    return {
      total: calculateTotal(),
      count: getTransactionCount(),
      average: transactions.length > 0 ? calculateTotal() / transactions.length : 0,
      categories: getCategories(),
      byCategory: getAggregatedByCategory()
    };
  };

  // Public API
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
    getStatistics
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DataManager;
}

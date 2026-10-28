/**
 * Data Manager Module
 * Mengelola in-memory state transaksi dan business logic
 */

const DataManager = (() => {
  let transactions = [];
  let observers = [];

  /**
   * Generate unique ID untuk transaksi
   * @returns {string} Unique ID based on timestamp
   */
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  /**
   * Create transaksi object dengan properties lengkap
   * @param {Object} data - Object dengan itemName, amount, category
   * @returns {Object} Complete transaction object
   */
  const createTransaction = (data) => {
    const now = new Date();
    return {
      id: generateId(),
      itemName: data.itemName,
      amount: parseFloat(data.amount),
      category: data.category,
      timestamp: now.getTime(),
      date: Formatters.formatDateISO(now)
    };
  };

  /**
   * Tambah transaksi ke dalam list
   * @param {Object} transaction - Transaction object
   * @returns {boolean} true jika berhasil, false jika gagal
   */
  const addTransaction = (transaction) => {
    try {
      // Validasi transaksi
      const validation = Validators.validateTransaction(transaction);
      if (!validation.isValid) {
        console.error('Validasi transaksi gagal:', validation.error);
        return false;
      }

      const newTransaction = createTransaction(transaction);
      transactions.push(newTransaction);
      notify();

      return true;

    } catch (error) {
      console.error('Error menambah transaksi:', error);
      return false;
    }
  };

  /**
   * Hapus transaksi berdasarkan ID
   * @param {string} transactionId - ID transaksi yang akan dihapus
   * @returns {boolean} true jika berhasil, false jika gagal
   */
  const deleteTransaction = (transactionId) => {
    try {
      const initialLength = transactions.length;
      transactions = transactions.filter(tx => tx.id !== transactionId);

      if (transactions.length < initialLength) {
        notify();
        return true;
      }

      return false;

    } catch (error) {
      console.error('Error menghapus transaksi:', error);
      return false;
    }
  };

  /**
   * Get semua transaksi
   * @returns {Array} Copy dari transactions array
   */
  const getAllTransactions = () => {
    return [...transactions];
  };

  /**
   * Get transaksi berdasarkan kategori
   * @param {string} category - Kategori yang dicari
   * @returns {Array} Array transaksi dengan kategori tersebut
   */
  const getTransactionsByCategory = (category) => {
    return transactions.filter(tx => tx.category === category);
  };

  /**
   * Hitung total pengeluaran
   * @returns {number} Total amount dari semua transaksi
   */
  const calculateTotal = () => {
    return transactions.reduce((sum, tx) => sum + tx.amount, 0);
  };

  /**
   * Hitung breakdown pengeluaran per kategori
   * @returns {Object} Object dengan kategori sebagai key dan total sebagai value
   */
  const calculateByCategory = () => {
    const breakdown = {};
    transactions.forEach(tx => {
      if (!breakdown[tx.category]) {
        breakdown[tx.category] = 0;
      }
      breakdown[tx.category] += tx.amount;
    });
    return breakdown;
  };

  /**
   * Load transaksi dari external source (biasanya storage)
   * @param {Array} data - Array transaksi yang akan di-load
   */
  const loadTransactions = (data) => {
    try {
      if (Array.isArray(data)) {
        transactions = [...data];
        notify();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading transactions:', error);
      return false;
    }
  };

  /**
   * Clear semua transaksi
   */
  const clearAll = () => {
    transactions = [];
    notify();
  };

  /**
   * Subscribe ke perubahan data
   * @param {Function} observer - Callback function yang akan dipanggil saat ada perubahan
   */
  const subscribe = (observer) => {
    if (typeof observer === 'function') {
      observers.push(observer);
    }
  };

  /**
   * Unsubscribe dari perubahan data
   * @param {Function} observer - Observer yang akan dihapus
   */
  const unsubscribe = (observer) => {
    observers = observers.filter(obs => obs !== observer);
  };

  /**
   * Notify semua observers tentang perubahan data
   */
  const notify = () => {
    observers.forEach(observer => {
      try {
        observer(getAllTransactions());
      } catch (error) {
        console.error('Error in observer:', error);
      }
    });
  };

  /**
   * Initialize dengan data dari storage
   * @param {Array} storedData - Data dari storage
   */
  const initialize = (storedData) => {
    loadTransactions(storedData);
  };

  // Public API
  return {
    addTransaction,
    deleteTransaction,
    getAllTransactions,
    getTransactionsByCategory,
    calculateTotal,
    calculateByCategory,
    loadTransactions,
    clearAll,
    subscribe,
    unsubscribe,
    initialize
  };
})();

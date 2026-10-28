/**
 * Storage Manager - Handles LocalStorage persistence
 * Manages save, load, and recovery of transactions
 */

const StorageManager = (() => {
  const STORAGE_KEY = 'expenseTrackerTransactions';
  const VERSION_KEY = 'expenseTrackerVersion';
  const CURRENT_VERSION = '1.0';

  /**
   * Check if localStorage is available
   * @returns {boolean} True if localStorage is available
   */
  const isAvailable = () => {
    try {
      if (typeof localStorage === 'undefined' || localStorage === null) {
        return false;
      }

      // Reading is non-destructive: if writing is blocked (private mode,
      // quota) save() can still report the specific storage error.
      localStorage.getItem('__expense_tracker_test__');
      return true;
    } catch (error) {
      console.warn('LocalStorage not available:', error.message);
      return false;
    }
  };

  /**
   * Save transactions to localStorage
   * @param {array} transactions - Array of transactions to save
   * @returns {object} {success: boolean, error: string|null}
   */
  const save = (transactions) => {
    try {
      if (!api.isAvailable()) {
        return {
          success: false,
          error: 'LocalStorage tidak tersedia'
        };
      }

      if (!Array.isArray(transactions)) {
        return {
          success: false,
          error: 'Data transactions harus berupa array'
        };
      }

      // Create storage object
      const storageData = {
        version: CURRENT_VERSION,
        transactions: transactions,
        lastSaved: new Date().toISOString()
      };

      // Convert to JSON
      const jsonString = JSON.stringify(storageData);

      // Save to localStorage
      localStorage.setItem(STORAGE_KEY, jsonString);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);

      return {
        success: true,
        error: null
      };
    } catch (error) {
      // Handle specific storage errors
      let errorMessage = 'Gagal menyimpan data';

      if (error.name === 'QuotaExceededError') {
        errorMessage = 'Penyimpanan penuh. Silakan hapus beberapa transaksi.';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Storage tidak tersedia di mode private browsing';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'Kesalahan state storage';
      }

      console.error('Storage error:', error);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  /**
   * Load transactions from localStorage
   * @returns {object} {success: boolean, data: array, error: string|null}
   */
  const load = () => {
    try {
      if (!api.isAvailable()) {
        return {
          success: false,
          data: [],
          error: null  // Not an error, just empty storage
        };
      }

      const jsonString = localStorage.getItem(STORAGE_KEY);

      // If no data, return empty array
      if (!jsonString) {
        return {
          success: true,
          data: [],
          error: null
        };
      }

      // Parse JSON
      const storageData = JSON.parse(jsonString);

      // Validate structure
      if (!storageData.transactions || !Array.isArray(storageData.transactions)) {
        throw new Error('Invalid storage structure');
      }

      // Validate each transaction
      const validTransactions = storageData.transactions.filter(transaction => {
        return transaction.id && 
               transaction.itemName && 
               typeof transaction.amount === 'number' &&
               transaction.category &&
               transaction.timestamp;
      });

      return {
        success: true,
        data: validTransactions,
        error: null
      };
    } catch (error) {
      console.error('Load error:', error);
      return {
        success: false,
        data: [],
        error: 'Gagal memuat data dari storage'
      };
    }
  };

  /**
   * Clear all stored data
   * @returns {object} {success: boolean, error: string|null}
   */
  const clear = () => {
    try {
      if (!api.isAvailable()) {
        return {
          success: false,
          error: 'LocalStorage tidak tersedia'
        };
      }

      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VERSION_KEY);

      return {
        success: true,
        error: null
      };
    } catch (error) {
      console.error('Clear error:', error);
      return {
        success: false,
        error: 'Gagal menghapus data'
      };
    }
  };

  /**
   * Get current version from storage
   * @returns {string} Version string
   */
  const getVersion = () => {
    try {
      if (!api.isAvailable()) {
        return null;
      }
      return localStorage.getItem(VERSION_KEY);
    } catch (error) {
      return null;
    }
  };

  /**
   * Check if storage needs migration
   * @returns {boolean} True if migration needed
   */
  const needsMigration = () => {
    const storedVersion = getVersion();
    return !!(storedVersion && storedVersion !== CURRENT_VERSION);
  };

  const api = {};

  /**
   * Get storage info (debugging)
   * @returns {object} Storage information
   */
  const getInfo = () => {
    try {
      if (!api.isAvailable()) {
        return {
          available: false,
          dataSize: 0,
          version: null
        };
      }

      const jsonString = localStorage.getItem(STORAGE_KEY);
      const dataSize = jsonString ? jsonString.length : 0;

      return {
        available: true,
        dataSize: dataSize,
        version: getVersion(),
        lastModified: null
      };
    } catch (error) {
      return {
        available: false,
        dataSize: 0,
        version: null,
        error: error.message
      };
    }
  };

  // Public API
  Object.assign(api, {
    save,
    load,
    clear,
    isAvailable,
    getVersion,
    needsMigration,
    getInfo
  });

  return api;
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
}

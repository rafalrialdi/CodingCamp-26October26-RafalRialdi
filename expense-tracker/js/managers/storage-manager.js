/**
 * Storage Manager Module
 * Mengelola persistensi data menggunakan LocalStorage browser
 */

const StorageManager = (() => {
  const STORAGE_KEY = 'expenseTrackerTransactions';
  const VERSION_KEY = 'expenseTrackerVersion';
  const CURRENT_VERSION = '1.0';

  /**
   * Check apakah LocalStorage tersedia
   * @returns {boolean} true jika LocalStorage tersedia
   */
  const isAvailable = () => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (error) {
      console.warn('LocalStorage tidak tersedia:', error.message);
      return false;
    }
  };

  /**
   * Simpan transaksi ke LocalStorage
   * @param {Array} transactions - Array transaksi yang akan disimpan
   * @returns {boolean} true jika berhasil, false jika gagal
   */
  const save = (transactions) => {
    try {
      if (!isAvailable()) {
        console.error('LocalStorage tidak tersedia');
        return false;
      }

      if (!Array.isArray(transactions)) {
        console.error('Transaksi harus berupa array');
        return false;
      }

      const data = {
        version: CURRENT_VERSION,
        transactions: transactions,
        lastSaved: new Date().toISOString()
      };

      const jsonString = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, jsonString);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);

      return true;

    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.error('LocalStorage quota terlampaui. Hapus beberapa transaksi.');
      } else if (error.name === 'SecurityError') {
        console.error('LocalStorage access denied (mungkin private browsing mode)');
      } else {
        console.error('Gagal menyimpan ke LocalStorage:', error.message);
      }
      return false;
    }
  };

  /**
   * Load transaksi dari LocalStorage
   * @returns {Array} Array transaksi atau empty array jika tidak ada
   */
  const load = () => {
    try {
      if (!isAvailable()) {
        console.warn('LocalStorage tidak tersedia, mengembalikan array kosong');
        return [];
      }

      const storedData = localStorage.getItem(STORAGE_KEY);

      if (!storedData) {
        return [];
      }

      const data = JSON.parse(storedData);

      if (!data.transactions || !Array.isArray(data.transactions)) {
        console.warn('Format data LocalStorage tidak valid');
        return [];
      }

      return data.transactions;

    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error('Data LocalStorage corrupt atau tidak valid JSON:', error.message);
      } else {
        console.error('Gagal load dari LocalStorage:', error.message);
      }
      return [];
    }
  };

  /**
   * Hapus semua transaksi dari LocalStorage
   * @returns {boolean} true jika berhasil, false jika gagal
   */
  const clear = () => {
    try {
      if (!isAvailable()) {
        return false;
      }

      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(VERSION_KEY);

      return true;

    } catch (error) {
      console.error('Gagal clear LocalStorage:', error.message);
      return false;
    }
  };

  /**
   * Get version data yang tersimpan
   * @returns {string} Version string
   */
  const getVersion = () => {
    try {
      return localStorage.getItem(VERSION_KEY) || '1.0';
    } catch (error) {
      return '1.0';
    }
  };

  /**
   * Get informasi storage usage (untuk debug)
   * @returns {Object} Informasi tentang storage
   */
  const getStorageInfo = () => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      const sizeInBytes = storedData ? new Blob([storedData]).size : 0;

      return {
        available: isAvailable(),
        storageSizeBytes: sizeInBytes,
        storageSizeKB: (sizeInBytes / 1024).toFixed(2),
        itemCount: storedData ? JSON.parse(storedData).transactions.length : 0
      };
    } catch (error) {
      return {
        available: false,
        error: error.message
      };
    }
  };

  // Public API
  return {
    save,
    load,
    clear,
    isAvailable,
    getVersion,
    getStorageInfo,
    STORAGE_KEY
  };
})();

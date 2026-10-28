/**
 * Main Application File
 * Mengelola inisialisasi aplikasi dan orchestration dari semua components
 */

const App = (() => {
  let isInitialized = false;

  /**
   * Initialize aplikasi saat DOM ready
   */
  const initialize = () => {
    if (isInitialized) {
      return;
    }
    isInitialized = true;

    console.log('Initializing Expense & Budget Visualizer...');

    try {
      // 1. Initialize components
      const formOk = InputForm.initialize();
      const listOk = TransactionList.initialize();
      const balanceOk = TotalBalance.initialize();
      const chartOk = PieChart.initialize('expenseChart');

      if (!formOk || !listOk || !balanceOk) {
        console.error('Gagal initialize beberapa components');
        return;
      }

      if (!chartOk) {
        console.warn('Chart tidak dapat diinisialisasi, aplikasi tetap berjalan tanpa chart');
      }

      // 2. Load data dari storage
      const storedData = StorageManager.load();
      DataManager.initialize(storedData);

      // 3. Render initial state
      updateAllComponents();

      // 4. Setup event listeners
      setupEventListeners();

      // 5. Subscribe ke data changes
      DataManager.subscribe(updateAllComponents);

      console.log('Aplikasi berhasil diinisialisasi');

    } catch (error) {
      console.error('Error saat inisialisasi aplikasi:', error);
    }
  };

  /**
   * Setup event listeners untuk form dan delete actions
   */
  const setupEventListeners = () => {
    // Form submission
    InputForm.onSubmit((values) => {
      handleAddTransaction(values);
    });

    // Delete transaction
    TransactionList.onDelete((transactionId) => {
      handleDeleteTransaction(transactionId);
    });
  };

  /**
   * Handle penambahan transaksi
   * @param {Object} values - Form values {itemName, amount, category}
   */
  const handleAddTransaction = (values) => {
    try {
      // Add to data manager
      const success = DataManager.addTransaction(values);

      if (success) {
        // Save to storage
        const transactions = DataManager.getAllTransactions();
        const saveOk = StorageManager.save(transactions);

        if (!saveOk) {
          console.warn('Gagal menyimpan ke storage, tapi data sudah ditambahkan di memory');
        }

        // Update components dilakukan via observer
      }

    } catch (error) {
      console.error('Error menambah transaksi:', error);
      InputForm.showError('Gagal menambah transaksi. Silakan coba lagi.');
    }
  };

  /**
   * Handle penghapusan transaksi
   * @param {string} transactionId - ID transaksi yang akan dihapus
   */
  const handleDeleteTransaction = (transactionId) => {
    try {
      // Delete from data manager
      const success = DataManager.deleteTransaction(transactionId);

      if (success) {
        // Save to storage
        const transactions = DataManager.getAllTransactions();
        const saveOk = StorageManager.save(transactions);

        if (!saveOk) {
          console.warn('Gagal menyimpan ke storage, tapi data sudah dihapus dari memory');
        }

        // Update components dilakukan via observer
      }

    } catch (error) {
      console.error('Error menghapus transaksi:', error);
    }
  };

  /**
   * Update semua UI components dengan current data
   */
  const updateAllComponents = () => {
    try {
      const transactions = DataManager.getAllTransactions();

      // Update transaction list
      TransactionList.render(transactions);

      // Update total balance
      TotalBalance.update(transactions);

      // Update pie chart
      PieChart.update(transactions);

    } catch (error) {
      console.error('Error updating components:', error);
    }
  };

  /**
   * Get application info (untuk debugging)
   * @returns {Object} App info
   */
  const getAppInfo = () => {
    return {
      name: 'Expense & Budget Visualizer',
      version: '1.0.0',
      storage: StorageManager.getStorageInfo(),
      transactionCount: DataManager.getAllTransactions().length,
      totalExpense: TotalBalance.calculateTotal(DataManager.getAllTransactions())
    };
  };

  // Public API
  return {
    initialize,
    updateAllComponents,
    getAppInfo
  };
})();

/**
 * Start aplikasi saat DOM ready
 */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    App.initialize();
  });
} else {
  // DOM sudah ready
  App.initialize();
}

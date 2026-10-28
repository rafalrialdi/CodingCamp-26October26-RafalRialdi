/**
 * Main Application File
 * Orchestrates component initialization and event handling
 */

const App = (() => {
  let isInitialized = false;

  /**
   * Initialize all components
   * @returns {void}
   */
  const initializeComponents = () => {
    InputForm.initialize();
    TransactionList.initialize();
    TotalBalance.initialize();
    PieChart.initialize();
  };

  /**
   * Load data from storage and initialize state
   * @returns {void}
   */
  const loadInitialData = () => {
    const loadResult = StorageManager.load();

    if (!loadResult.success && loadResult.error) {
      console.error('Failed to load data:', loadResult.error);
      InputForm.showError(loadResult.error);
      return;
    }

    // Initialize data manager with loaded transactions
    DataManager.initialize(loadResult.data);

    // Render all components with initial data
    renderAllComponents();
  };

  /**
   * Render all components
   * @returns {void}
   */
  const renderAllComponents = () => {
    const transactions = DataManager.getAllTransactions();

    TotalBalance.render(transactions);
    TransactionList.render(transactions);
    PieChart.render(transactions);
  };

  /**
   * Setup data change observer
   * @returns {void}
   */
  const setupDataObserver = () => {
    DataManager.subscribe((transactions) => {
      // Update all UI components when data changes
      TotalBalance.update(transactions);
      TransactionList.render(transactions);
      PieChart.update(transactions);

      // Save to storage
      const saveResult = StorageManager.save(transactions);
      if (!saveResult.success) {
        console.error('Failed to save data:', saveResult.error);
        InputForm.showError(saveResult.error);
      }
    });
  };

  /**
   * Setup form submission handler
   * InputForm already validates and clears the form, so the app only needs
   * to register a callback for valid submissions.
   * @returns {void}
   */
  const setupFormSubmission = () => {
    InputForm.onSubmit((values) => {
      const transaction = DataManager.addTransaction({
        itemName: values.itemName,
        amount: values.amount,
        category: values.category
      });

      if (!transaction) {
        InputForm.showError('Failed to add transaction');
        return;
      }

      // Persistence and UI rendering are handled by the DataManager observer
      InputForm.showSuccess('Transaction added successfully!');
      InputForm.focusFirstInput();
    });
  };

  /**
   * Setup delete button handlers
   * @returns {void}
   */
  const setupDeleteHandlers = () => {
    TransactionList.onDelete((transactionId) => {
      const success = DataManager.deleteTransaction(transactionId);

      if (!success) {
        InputForm.showError('Failed to delete transaction');
        return;
      }

      InputForm.showSuccess('Transaction deleted successfully!');
    });
  };

  /**
   * Setup event listeners
   * @returns {void}
   */
  const setupEventListeners = () => {
    setupFormSubmission();
    setupDeleteHandlers();
  };

  /**
   * Initialize application
   * @returns {void}
   */
  const initialize = () => {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', start);
    } else {
      start();
    }
  };

  /**
   * Start application
   * @returns {void}
   */
  const start = () => {
    if (isInitialized) {
      return;
    }
    isInitialized = true;

    console.log('Initializing Expense Tracker...');

    try {
      // Initialize components
      initializeComponents();

      // Load initial data from storage
      loadInitialData();

      // Setup data observer for reactive updates
      setupDataObserver();

      // Setup event listeners
      setupEventListeners();

      console.log('✓ Expense Tracker initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      InputForm.showError('Failed to initialize application');
    }
  };

  // Public API (minimal)
  return {
    initialize
  };
})();

// Initialize app when this script loads
App.initialize();

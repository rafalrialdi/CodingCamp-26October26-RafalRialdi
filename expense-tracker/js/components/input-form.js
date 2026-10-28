/**
 * Input Form Component
 * Mengelola form untuk input pengeluaran baru
 */

const InputForm = (() => {
  let $form = null;
  let $itemNameInput = null;
  let $amountInput = null;
  let $categorySelect = null;
  let $errorMessage = null;
  let submitCallback = null;

  /**
   * Initialize component dan attach DOM references
   */
  const initialize = () => {
    $form = document.getElementById('transactionForm');
    $itemNameInput = document.getElementById('itemName');
    $amountInput = document.getElementById('amount');
    $categorySelect = document.getElementById('category');
    $errorMessage = document.getElementById('errorMessage');

    if (!$form || !$itemNameInput || !$amountInput || !$categorySelect) {
      console.error('Form elements tidak ditemukan di DOM');
      return false;
    }

    attachListeners();
    return true;
  };

  /**
   * Attach event listeners
   */
  const attachListeners = () => {
    $form.addEventListener('submit', handleSubmit);
  };

  /**
   * Handle form submission
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    const values = getValues();

    // Validasi
    const validation = Validators.validateTransaction(values);
    if (!validation.isValid) {
      showError(validation.error);
      return;
    }

    // Clear error dan submit
    hideError();

    if (submitCallback) {
      submitCallback(values);
    }

    clear();
  };

  /**
   * Get form values
   * @returns {Object} Object dengan itemName, amount, category
   */
  const getValues = () => {
    return {
      itemName: Validators.sanitizeString($itemNameInput.value),
      amount: $amountInput.value,
      category: $categorySelect.value
    };
  };

  /**
   * Clear form dan reset ke state awal
   */
  const clear = () => {
    $form.reset();
    hideError();
  };

  /**
   * Show error message
   * @param {string} message - Error message
   */
  const showError = (message) => {
    if ($errorMessage) {
      $errorMessage.textContent = message;
      $errorMessage.style.display = 'block';
    }
  };

  /**
   * Hide error message
   */
  const hideError = () => {
    if ($errorMessage) {
      $errorMessage.style.display = 'none';
      $errorMessage.textContent = '';
    }
  };

  /**
   * Set callback untuk form submission
   * @param {Function} callback - Callback function
   */
  const onSubmit = (callback) => {
    if (typeof callback === 'function') {
      submitCallback = callback;
    }
  };

  /**
   * Focus ke item name input
   */
  const focus = () => {
    if ($itemNameInput) {
      $itemNameInput.focus();
    }
  };

  // Public API
  return {
    initialize,
    getValues,
    clear,
    showError,
    hideError,
    onSubmit,
    focus
  };
})();

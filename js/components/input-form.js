/**
 * Input Form Component
 * Handles form rendering, validation, and user input for adding transactions
 * 
 * Requirements: 1.1, 1.2, 1.3, 1.5, 10.1, 10.2
 * 
 * Responsibilities:
 * - Manage form inputs (Item Name, Amount, Category)
 * - Validate input using Validators module
 * - Display error/success messages
 * - Clear form after successful submission
 * - Trigger callbacks on form submission
 */

const InputForm = (() => {
  // Private state
  let $form = null;
  let $itemNameInput = null;
  let $amountInput = null;
  let $categorySelect = null;
  let $submitButton = null;
  let $errorElement = null;
  let $successElement = null;
  let submitCallback = null;

  /**
   * Initialize form references and attach listeners
   * Called once during application startup
   * 
   * @returns {boolean} True if initialization successful, false otherwise
   */
  const initialize = () => {
    // Get DOM references
    $form = document.getElementById('transactionForm');
    $itemNameInput = document.getElementById('itemName');
    $amountInput = document.getElementById('amount');
    $categorySelect = document.getElementById('category');
    $submitButton = $form?.querySelector('button[type="submit"]');
    $errorElement = document.getElementById('error-message');
    $successElement = document.getElementById('success-message');

    // Validate that all required elements exist
    if (!$form || !$itemNameInput || !$amountInput || !$categorySelect) {
      console.error('InputForm: Required form elements not found in DOM');
      return false;
    }

    // Attach form submit listener
    attachListeners();
    
    console.log('InputForm: Initialized successfully');
    return true;
  };

  /**
   * Attach event listeners to form elements
   * Private function called during initialization
   * 
   * @returns {void}
   */
  const attachListeners = () => {
    if ($form) {
      $form.addEventListener('submit', handleFormSubmit);
    }

    // Optional: Clear error on input (improve UX)
    if ($itemNameInput) {
      $itemNameInput.addEventListener('focus', hideError);
    }
    if ($amountInput) {
      $amountInput.addEventListener('focus', hideError);
    }
    if ($categorySelect) {
      $categorySelect.addEventListener('change', hideError);
    }
  };

  /**
   * Handle form submission event
   * Validates input and triggers callback if validation passes
   * 
   * @param {Event} event - Form submit event
   * @returns {void}
   */
  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Get form values
    const values = getValues();

    // Validate using Validators module
    const validation = Validators.validateTransaction(values);
    
    if (!validation.valid) {
      showError(validation.error);
      return;
    }

    // Validation passed - reset the form before notifying the app so
    // success messages shown by the callback are not immediately hidden.
    hideError();
    clear();

    // Call submit callback if provided
    if (submitCallback && typeof submitCallback === 'function') {
      submitCallback(values);
    }
  };

  /**
   * Get form values
   * Returns raw values from form inputs
   * 
   * @returns {object} Object with itemName, amount, category properties
   */
  const getValues = () => {
    return {
      itemName: $itemNameInput?.value || '',
      amount: $amountInput?.value || '',
      category: $categorySelect?.value || ''
    };
  };

  /**
   * Clear form inputs and reset to initial state
   * 
   * @returns {void}
   */
  const clear = () => {
    if ($form) {
      $form.reset();
    }
    hideError();
    hideSuccess();
  };

  /**
   * Show error message to user
   * Displays error in the error message container with visual indication
   * 
   * @param {string} message - Error message to display
   * @returns {void}
   */
  const showError = (message) => {
    if ($errorElement) {
      $errorElement.textContent = message;
      $errorElement.style.display = 'block';
      $errorElement.classList.add('show');
    }
  };

  /**
   * Hide error message from user
   * 
   * @returns {void}
   */
  const hideError = () => {
    if ($errorElement) {
      $errorElement.textContent = '';
      $errorElement.style.display = 'none';
      $errorElement.classList.remove('show');
    }
  };

  /**
   * Show success message to user
   * Displays success message and auto-hides after 3 seconds
   * 
   * @param {string} message - Success message to display
   * @returns {void}
   */
  const showSuccess = (message) => {
    if ($successElement) {
      $successElement.textContent = message;
      $successElement.style.display = 'block';
      $successElement.classList.add('show');

      // Auto-hide after 3 seconds
      setTimeout(() => {
        hideSuccess();
      }, 3000);
    }
  };

  /**
   * Hide success message from user
   * 
   * @returns {void}
   */
  const hideSuccess = () => {
    if ($successElement) {
      $successElement.textContent = '';
      $successElement.style.display = 'none';
      $successElement.classList.remove('show');
    }
  };

  /**
   * Set form disabled/enabled state
   * Disables or enables all form inputs and submit button
   * 
   * @param {boolean} disabled - True to disable form, false to enable
   * @returns {void}
   */
  const setDisabled = (disabled) => {
    if ($submitButton) {
      $submitButton.disabled = disabled;
    }
    if ($itemNameInput) {
      $itemNameInput.disabled = disabled;
    }
    if ($amountInput) {
      $amountInput.disabled = disabled;
    }
    if ($categorySelect) {
      $categorySelect.disabled = disabled;
    }
  };

  /**
   * Focus first input field
   * Useful for improving UX after page load
   * 
   * @returns {void}
   */
  const focusFirstInput = () => {
    if ($itemNameInput) {
      $itemNameInput.focus();
    }
  };

  /**
   * Register callback for form submission
   * The callback will be called with form values after successful validation
   * 
   * @param {function} callback - Function to call on successful submission
   * @returns {void}
   */
  const onSubmit = (callback) => {
    if (typeof callback === 'function') {
      submitCallback = callback;
    }
  };

  /**
   * Validate form without submission
   * Useful for testing or validating before external processing
   * 
   * @returns {object} Validation result: { valid: boolean, error: string|null }
   */
  const validate = () => {
    const values = getValues();
    return Validators.validateTransaction(values);
  };

  // Public API
  return {
    initialize,
    getValues,
    clear,
    showError,
    hideError,
    showSuccess,
    hideSuccess,
    setDisabled,
    focusFirstInput,
    onSubmit,
    validate
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = InputForm;
}

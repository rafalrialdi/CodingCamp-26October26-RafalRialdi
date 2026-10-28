/**
 * Transaction List Component
 * Renders and manages the list of transactions
 */

const TransactionList = (() => {
  // Private state
  let $container = null;
  let deleteCallback = null;

  /**
   * Initialize transaction list references
   * @returns {void}
   */
  const initialize = () => {
    $container = document.getElementById('transactionList');
    attachListeners();
  };

  /**
   * Attach event listeners (event delegation for delete buttons)
   * @returns {void}
   */
  const attachListeners = () => {
    if ($container) {
      $container.addEventListener('click', handleDeleteClick);
    }
  };

  /**
   * Handle delete button click (event delegation)
   * @param {Event} event - Click event
   * @returns {void}
   */
  const handleDeleteClick = (event) => {
    const $deleteButton = event.target.closest('.transaction-delete');
    if ($deleteButton) {
      const transactionId = $deleteButton.getAttribute('data-id');
      if (deleteCallback && transactionId) {
        deleteCallback(transactionId);
      }
    }
  };

  /**
   * Register delete callback
   * @param {function} callback - Callback function(transactionId)
   * @returns {void}
   */
  const onDelete = (callback) => {
    if (typeof callback === 'function') {
      deleteCallback = callback;
    }
  };

  /**
   * Create transaction item element
   * @param {object} transaction - Transaction object
   * @returns {HTMLElement} Transaction list item
   */
  const createTransactionItem = (transaction) => {
    const $li = document.createElement('li');
    $li.className = 'transaction-item';
    $li.setAttribute('data-id', transaction.id);

    const categoryClass = Formatters.formatCategoryToClass(transaction.category);
    const formattedAmount = Formatters.formatCurrency(transaction.amount);
    const formattedDate = Formatters.formatDate(transaction.date);

    $li.innerHTML = `
      <div class="transaction-info">
        <div class="transaction-name">${escapeHTML(transaction.itemName)}</div>
        <div class="transaction-meta">
          <span class="transaction-category ${categoryClass}">${transaction.category}</span>
          <span>${formattedDate}</span>
        </div>
      </div>
      <span class="transaction-amount">${formattedAmount}</span>
      <button class="transaction-delete" data-id="${transaction.id}" title="Delete">
        Delete
      </button>
    `;

    return $li;
  };

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped HTML
   */
  const escapeHTML = (text) => {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  };

  /**
   * Render transaction list
   * @param {array} transactions - Array of transaction objects
   * @returns {void}
   */
  const render = (transactions) => {
    if (!$container) {
      return;
    }

    // Clear container
    $container.innerHTML = '';

    // Show empty state if no transactions
    if (!transactions || transactions.length === 0) {
      const $emptyState = document.createElement('li');
      $emptyState.className = 'empty-state';
      $emptyState.textContent = 'No transactions yet. Add your first expense!';
      $container.appendChild($emptyState);
      return;
    }

    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();

    // Create list items in reverse order (newest first)
    transactions.slice().reverse().forEach(transaction => {
      const $item = createTransactionItem(transaction);
      fragment.appendChild($item);
    });

    $container.appendChild(fragment);
  };

  /**
   * Add single item to list (prepend)
   * @param {object} transaction - Transaction object to add
   * @returns {void}
   */
  const addItem = (transaction) => {
    if (!$container) {
      return;
    }

    // Remove empty state if exists
    const $emptyState = $container.querySelector('.empty-state');
    if ($emptyState) {
      $emptyState.remove();
    }

    // Create and prepend new item
    const $item = createTransactionItem(transaction);
    $container.insertBefore($item, $container.firstChild);
  };

  /**
   * Remove item from list
   * @param {string} transactionId - ID of transaction to remove
   * @returns {void}
   */
  const removeItem = (transactionId) => {
    if (!$container) {
      return;
    }

    const $item = $container.querySelector(`[data-id="${transactionId}"]`);
    if ($item) {
      $item.remove();

      // Show empty state if no more items
      if ($container.children.length === 0) {
        const $emptyState = document.createElement('li');
        $emptyState.className = 'empty-state';
        $emptyState.textContent = 'No transactions yet. Add your first expense!';
        $container.appendChild($emptyState);
      }
    }
  };

  /**
   * Refresh entire list
   * @param {array} transactions - Updated transactions array
   * @returns {void}
   */
  const refresh = (transactions) => {
    render(transactions);
  };

  // Public API
  return {
    initialize,
    render,
    addItem,
    removeItem,
    refresh,
    onDelete
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TransactionList;
}

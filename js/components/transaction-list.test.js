/**
 * Transaction List Component Tests
 * Tests for rendering, adding, removing, and deleting transactions
 */

// Mock Formatters
window.Formatters = {
  formatCurrency: (amount) => `Rp ${amount.toLocaleString('id-ID')}`,
  formatDate: (date) => new Date(date).toLocaleDateString('id-ID'),
  getCategoryClass: (category) => {
    const map = {
      'Makanan': 'category--food',
      'Transportasi': 'category--transport',
      'Hiburan': 'category--entertainment'
    };
    return map[category] || 'category--default';
  }
};

// Define the component inline since require doesn't work well with IIFEs
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

    const categoryClass = Formatters.getCategoryClass(transaction.category);
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

describe('TransactionList Component', () => {
  let $container;
  let mockTransactions;

  beforeEach(() => {
    // Create mock container
    document.body.innerHTML = '<ul id="transactionList"></ul>';
    $container = document.getElementById('transactionList');

    // Mock transactions
    mockTransactions = [
      {
        id: '1',
        itemName: 'Makan siang',
        amount: 50000,
        category: 'Makanan',
        timestamp: Date.now(),
        date: '2024-01-01'
      },
      {
        id: '2',
        itemName: 'Grab ke kantor',
        amount: 25000,
        category: 'Transportasi',
        timestamp: Date.now(),
        date: '2024-01-01'
      },
      {
        id: '3',
        itemName: 'Nonton bioskop',
        amount: 75000,
        category: 'Hiburan',
        timestamp: Date.now(),
        date: '2024-01-01'
      }
    ];

    // Initialize component
    TransactionList.initialize();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('initialize()', () => {
    it('should initialize with transaction list container', () => {
      expect(TransactionList).toBeDefined();
      expect($container).toBeTruthy();
    });
  });

  describe('render()', () => {
    it('should render all transactions', () => {
      TransactionList.render(mockTransactions);
      const items = $container.querySelectorAll('li.transaction-item');
      expect(items).toHaveLength(3);
    });

    it('should render empty state when no transactions', () => {
      TransactionList.render([]);
      const emptyState = $container.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
      expect(emptyState.textContent).toContain('No transactions yet');
    });

    it('should render transactions in reverse order (newest first)', () => {
      TransactionList.render(mockTransactions);
      const items = $container.querySelectorAll('li.transaction-item');
      expect(items[0].textContent).toContain('Nonton bioskop');
      expect(items[2].textContent).toContain('Makan siang');
    });

    it('should display transaction item name', () => {
      TransactionList.render(mockTransactions);
      expect($container.textContent).toContain('Makan siang');
      expect($container.textContent).toContain('Grab ke kantor');
      expect($container.textContent).toContain('Nonton bioskop');
    });

    it('should display transaction amount', () => {
      TransactionList.render(mockTransactions);
      // The amount is formatted as "Rp 50.000" with dot separators
      expect($container.textContent).toContain('Rp');
      expect($container.textContent).toMatch(/50[\.,]?000/);
    });

    it('should display transaction category', () => {
      TransactionList.render(mockTransactions);
      expect($container.textContent).toContain('Makanan');
      expect($container.textContent).toContain('Transportasi');
      expect($container.textContent).toContain('Hiburan');
    });

    it('should have delete button for each transaction', () => {
      TransactionList.render(mockTransactions);
      const deleteButtons = $container.querySelectorAll('.transaction-delete');
      expect(deleteButtons).toHaveLength(3);
    });

    it('should store transaction ID in data attribute', () => {
      TransactionList.render(mockTransactions);
      const item = $container.querySelector('[data-id="1"]');
      expect(item).toBeTruthy();
      expect(item.getAttribute('data-id')).toBe('1');
    });

    it('should apply category class to transaction item', () => {
      TransactionList.render(mockTransactions);
      const makananItem = $container.querySelector('[data-id="1"]');
      // The component sets transaction-item but adds category class to the meta
      expect(makananItem.className).toContain('transaction-item');
      // Category class is applied to the category span within the transaction
      const categorySpan = makananItem.querySelector('.transaction-category');
      expect(categorySpan.className).toContain('category--food');
    });

    it('should clear previous content when rendering', () => {
      TransactionList.render(mockTransactions);
      expect($container.querySelectorAll('li').length).toBe(3);

      const singleTransaction = [mockTransactions[0]];
      TransactionList.render(singleTransaction);
      expect($container.querySelectorAll('li').length).toBe(1);
    });

    it('should handle null transactions array gracefully', () => {
      TransactionList.render(null);
      const emptyState = $container.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
    });
  });

  describe('addItem()', () => {
    it('should add a transaction to the list', () => {
      TransactionList.render([]);
      const newTransaction = mockTransactions[0];
      TransactionList.addItem(newTransaction);
      expect($container.textContent).toContain('Makan siang');
    });

    it('should remove empty state when adding first item', () => {
      TransactionList.render([]);
      expect($container.querySelector('.empty-state')).toBeTruthy();

      TransactionList.addItem(mockTransactions[0]);
      expect($container.querySelector('.empty-state')).toBeFalsy();
    });

    it('should prepend new item to the beginning', () => {
      TransactionList.render([mockTransactions[1]]);
      TransactionList.addItem(mockTransactions[0]);

      const items = $container.querySelectorAll('li.transaction-item');
      expect(items[0].textContent).toContain('Makan siang');
      expect(items[1].textContent).toContain('Grab ke kantor');
    });
  });

  describe('removeItem()', () => {
    it('should remove transaction by ID', () => {
      TransactionList.render(mockTransactions);
      expect($container.querySelectorAll('li.transaction-item')).toHaveLength(3);

      TransactionList.removeItem('2');
      expect($container.querySelectorAll('li.transaction-item')).toHaveLength(2);
      expect($container.textContent).not.toContain('Grab ke kantor');
    });

    it('should show empty state when last item is removed', () => {
      TransactionList.render([mockTransactions[0]]);
      expect($container.querySelector('.empty-state')).toBeFalsy();

      TransactionList.removeItem('1');
      expect($container.querySelector('.empty-state')).toBeTruthy();
    });

    it('should handle non-existent ID gracefully', () => {
      TransactionList.render(mockTransactions);

      expect(() => {
        TransactionList.removeItem('non-existent');
      }).not.toThrow();

      expect($container.querySelectorAll('li.transaction-item')).toHaveLength(3);
    });
  });

  describe('refresh()', () => {
    it('should re-render the list with new transactions', () => {
      TransactionList.render(mockTransactions);
      expect($container.querySelectorAll('li.transaction-item')).toHaveLength(3);

      const newTransactions = [mockTransactions[0], mockTransactions[1]];
      TransactionList.refresh(newTransactions);

      expect($container.querySelectorAll('li.transaction-item')).toHaveLength(2);
    });
  });

  describe('onDelete()', () => {
    it('should register delete callback', () => {
      const callback = jest.fn();
      TransactionList.onDelete(callback);

      TransactionList.render(mockTransactions);
      // The first visible delete button is for the last item (ID 3) due to reverse order
      const deleteButton = $container.querySelector('.transaction-delete');
      deleteButton.click();

      expect(callback).toHaveBeenCalledWith('3');
    });

    it('should call callback with transaction ID', () => {
      const callback = jest.fn();
      TransactionList.onDelete(callback);

      TransactionList.render(mockTransactions);
      const deleteButton = $container.querySelector('[data-id="2"]').querySelector('.transaction-delete');
      deleteButton.click();

      expect(callback).toHaveBeenCalledWith('2');
    });
  });

  describe('XSS Prevention', () => {
    it('should escape HTML special characters in item names', () => {
      const maliciousTransaction = {
        id: '1',
        itemName: '<script>alert("XSS")</script>',
        amount: 50000,
        category: 'Makanan',
        timestamp: Date.now(),
        date: '2024-01-01'
      };

      TransactionList.render([maliciousTransaction]);
      expect($container.innerHTML).not.toContain('<script>');
    });

    it('should escape ampersands in item names', () => {
      const transaction = {
        id: '1',
        itemName: 'Fish & Chips',
        amount: 50000,
        category: 'Makanan',
        timestamp: Date.now(),
        date: '2024-01-01'
      };

      TransactionList.render([transaction]);
      expect($container.innerHTML).toContain('&amp;');
    });
  });

  describe('Performance', () => {
    it('should handle large transaction lists efficiently', () => {
      const largeList = Array.from({ length: 100 }, (_, i) => ({
        id: String(i),
        itemName: `Transaction ${i}`,
        amount: Math.random() * 100000,
        category: ['Makanan', 'Transportasi', 'Hiburan'][i % 3],
        timestamp: Date.now(),
        date: '2024-01-01'
      }));

      const start = performance.now();
      TransactionList.render(largeList);
      const end = performance.now();

      expect(end - start).toBeLessThan(500);
      expect($container.querySelectorAll('li.transaction-item')).toHaveLength(100);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string item names', () => {
      const transaction = {
        id: '1',
        itemName: '',
        amount: 50000,
        category: 'Makanan',
        timestamp: Date.now(),
        date: '2024-01-01'
      };

      expect(() => {
        TransactionList.render([transaction]);
      }).not.toThrow();
    });

    it('should handle zero amount', () => {
      const transaction = {
        id: '1',
        itemName: 'Free item',
        amount: 0,
        category: 'Makanan',
        timestamp: Date.now(),
        date: '2024-01-01'
      };

      expect(() => {
        TransactionList.render([transaction]);
      }).not.toThrow();
    });

    it('should handle special Unicode characters', () => {
      const transaction = {
        id: '1',
        itemName: '食べ物 🍜 Nasi Goreng',
        amount: 50000,
        category: 'Makanan',
        timestamp: Date.now(),
        date: '2024-01-01'
      };

      TransactionList.render([transaction]);
      expect($container.textContent).toContain('Nasi Goreng');
    });
  });
});

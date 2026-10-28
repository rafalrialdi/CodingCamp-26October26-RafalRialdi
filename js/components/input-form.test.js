/**
 * Input Form Component - Unit Tests
 * Tests for form initialization, validation, and user interaction
 */

describe('InputForm Component', () => {
  // Setup and teardown
  let formHTML;

  beforeEach(() => {
    // Create minimal DOM structure for testing
    formHTML = `
      <div id="error-message" style="display: none;"></div>
      <div id="success-message" style="display: none;"></div>
      <form id="transactionForm">
        <input type="text" id="itemName" value="">
        <input type="number" id="amount" value="">
        <select id="category">
          <option value="">-- Select Category --</option>
          <option value="Makanan">Makanan</option>
          <option value="Transportasi">Transportasi</option>
          <option value="Hiburan">Hiburan</option>
        </select>
        <button type="submit">Add Transaction</button>
      </form>
    `;
    
    document.body.innerHTML = formHTML;

    // Reset InputForm state by reinitializing
    InputForm.initialize();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Initialization', () => {
    it('should initialize successfully with all required elements', () => {
      expect(InputForm.initialize()).toBe(true);
    });

    it('should fail initialization if form element is missing', () => {
      document.body.innerHTML = '<div id="error-message"></div>';
      expect(InputForm.initialize()).toBe(false);
    });

    it('should find all form elements', () => {
      InputForm.initialize();
      const values = InputForm.getValues();
      expect(values).toHaveProperty('itemName');
      expect(values).toHaveProperty('amount');
      expect(values).toHaveProperty('category');
    });
  });

  describe('getValues()', () => {
    beforeEach(() => {
      InputForm.initialize();
    });

    it('should return empty values on initial form', () => {
      const values = InputForm.getValues();
      expect(values.itemName).toBe('');
      expect(values.amount).toBe('');
      expect(values.category).toBe('');
    });

    it('should return current form values', () => {
      document.getElementById('itemName').value = 'Lunch';
      document.getElementById('amount').value = '50000';
      document.getElementById('category').value = 'Makanan';

      const values = InputForm.getValues();
      expect(values.itemName).toBe('Lunch');
      expect(values.amount).toBe('50000');
      expect(values.category).toBe('Makanan');
    });
  });

  describe('clear()', () => {
    beforeEach(() => {
      InputForm.initialize();
    });

    it('should clear all form inputs', () => {
      document.getElementById('itemName').value = 'Lunch';
      document.getElementById('amount').value = '50000';
      document.getElementById('category').value = 'Makanan';

      InputForm.clear();

      const values = InputForm.getValues();
      expect(values.itemName).toBe('');
      expect(values.amount).toBe('');
      expect(values.category).toBe('');
    });

    it('should hide error message when clearing', () => {
      InputForm.showError('Test error');
      InputForm.clear();

      const errorElement = document.getElementById('error-message');
      expect(errorElement.style.display).toBe('none');
    });
  });

  describe('showError() and hideError()', () => {
    beforeEach(() => {
      InputForm.initialize();
    });

    it('should show error message with provided text', () => {
      InputForm.showError('This is an error');

      const errorElement = document.getElementById('error-message');
      expect(errorElement.textContent).toBe('This is an error');
      expect(errorElement.style.display).toBe('block');
      expect(errorElement.classList.contains('show')).toBe(true);
    });

    it('should hide error message', () => {
      InputForm.showError('Test error');
      InputForm.hideError();

      const errorElement = document.getElementById('error-message');
      expect(errorElement.textContent).toBe('');
      expect(errorElement.style.display).toBe('none');
      expect(errorElement.classList.contains('show')).toBe(false);
    });

    it('should handle missing error element gracefully', () => {
      document.getElementById('error-message').remove();
      expect(() => InputForm.showError('Test')).not.toThrow();
      expect(() => InputForm.hideError()).not.toThrow();
    });
  });

  describe('showSuccess() and hideSuccess()', () => {
    beforeEach(() => {
      InputForm.initialize();
    });

    it('should show success message', () => {
      InputForm.showSuccess('Transaction added successfully');

      const successElement = document.getElementById('success-message');
      expect(successElement.textContent).toBe('Transaction added successfully');
      expect(successElement.style.display).toBe('block');
      expect(successElement.classList.contains('show')).toBe(true);
    });

    it('should hide success message', () => {
      InputForm.showSuccess('Test');
      InputForm.hideSuccess();

      const successElement = document.getElementById('success-message');
      expect(successElement.textContent).toBe('');
      expect(successElement.style.display).toBe('none');
      expect(successElement.classList.contains('show')).toBe(false);
    });

    it('should auto-hide success message after 3 seconds', (done) => {
      jest.useFakeTimers();
      
      InputForm.showSuccess('Test');
      const successElement = document.getElementById('success-message');
      expect(successElement.style.display).toBe('block');

      jest.advanceTimersByTime(3000);
      
      expect(successElement.style.display).toBe('none');
      
      jest.useRealTimers();
      done();
    });
  });

  describe('setDisabled()', () => {
    beforeEach(() => {
      InputForm.initialize();
    });

    it('should disable all form elements', () => {
      InputForm.setDisabled(true);

      expect(document.getElementById('itemName').disabled).toBe(true);
      expect(document.getElementById('amount').disabled).toBe(true);
      expect(document.getElementById('category').disabled).toBe(true);
      expect(document.querySelector('button[type="submit"]').disabled).toBe(true);
    });

    it('should enable all form elements', () => {
      InputForm.setDisabled(true);
      InputForm.setDisabled(false);

      expect(document.getElementById('itemName').disabled).toBe(false);
      expect(document.getElementById('amount').disabled).toBe(false);
      expect(document.getElementById('category').disabled).toBe(false);
      expect(document.querySelector('button[type="submit"]').disabled).toBe(false);
    });
  });

  describe('focusFirstInput()', () => {
    beforeEach(() => {
      InputForm.initialize();
    });

    it('should focus on first input (itemName)', () => {
      InputForm.focusFirstInput();
      expect(document.activeElement).toBe(document.getElementById('itemName'));
    });
  });

  describe('validate()', () => {
    beforeEach(() => {
      InputForm.initialize();
    });

    it('should validate valid transaction', () => {
      document.getElementById('itemName').value = 'Lunch';
      document.getElementById('amount').value = '50000';
      document.getElementById('category').value = 'Makanan';

      const result = InputForm.validate();
      expect(result.valid).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should reject empty item name', () => {
      document.getElementById('itemName').value = '';
      document.getElementById('amount').value = '50000';
      document.getElementById('category').value = 'Makanan';

      const result = InputForm.validate();
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should reject invalid amount', () => {
      document.getElementById('itemName').value = 'Lunch';
      document.getElementById('amount').value = '-50000';
      document.getElementById('category').value = 'Makanan';

      const result = InputForm.validate();
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });

    it('should reject invalid category', () => {
      document.getElementById('itemName').value = 'Lunch';
      document.getElementById('amount').value = '50000';
      document.getElementById('category').value = 'InvalidCategory';

      const result = InputForm.validate();
      expect(result.valid).toBe(false);
      expect(result.error).toBeTruthy();
    });
  });

  describe('onSubmit() callback', () => {
    beforeEach(() => {
      InputForm.initialize();
    });

    it('should register submit callback', () => {
      const callback = jest.fn();
      InputForm.onSubmit(callback);

      // Submit form with valid data
      document.getElementById('itemName').value = 'Lunch';
      document.getElementById('amount').value = '50000';
      document.getElementById('category').value = 'Makanan';

      document.getElementById('transactionForm').dispatchEvent(
        new Event('submit', { bubbles: true })
      );

      expect(callback).toHaveBeenCalled();
      expect(callback).toHaveBeenCalledWith({
        itemName: 'Lunch',
        amount: '50000',
        category: 'Makanan'
      });
    });

    it('should not call callback if validation fails', () => {
      const callback = jest.fn();
      InputForm.onSubmit(callback);

      // Submit form with invalid data (empty itemName)
      document.getElementById('itemName').value = '';
      document.getElementById('amount').value = '50000';
      document.getElementById('category').value = 'Makanan';

      document.getElementById('transactionForm').dispatchEvent(
        new Event('submit', { bubbles: true })
      );

      expect(callback).not.toHaveBeenCalled();
    });

    it('should clear form after successful submission', () => {
      const callback = jest.fn();
      InputForm.onSubmit(callback);

      document.getElementById('itemName').value = 'Lunch';
      document.getElementById('amount').value = '50000';
      document.getElementById('category').value = 'Makanan';

      document.getElementById('transactionForm').dispatchEvent(
        new Event('submit', { bubbles: true })
      );

      const values = InputForm.getValues();
      expect(values.itemName).toBe('');
      expect(values.amount).toBe('');
      expect(values.category).toBe('');
    });
  });

  describe('Form submission event handling', () => {
    beforeEach(() => {
      InputForm.initialize();
    });

    it('should prevent default form submission', () => {
      const event = new Event('submit', { bubbles: true });
      event.preventDefault = jest.fn();

      document.getElementById('itemName').value = 'Lunch';
      document.getElementById('amount').value = '50000';
      document.getElementById('category').value = 'Makanan';

      document.getElementById('transactionForm').dispatchEvent(event);

      // Event preventDefault is called in handleFormSubmit
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should show error message on validation failure', () => {
      document.getElementById('itemName').value = ''; // Invalid - empty
      document.getElementById('amount').value = '50000';
      document.getElementById('category').value = 'Makanan';

      document.getElementById('transactionForm').dispatchEvent(
        new Event('submit', { bubbles: true })
      );

      const errorElement = document.getElementById('error-message');
      expect(errorElement.textContent).not.toBe('');
      expect(errorElement.style.display).toBe('block');
    });

    it('should clear error on successful submission', () => {
      // First show an error
      InputForm.showError('Previous error');

      // Then submit valid form
      document.getElementById('itemName').value = 'Lunch';
      document.getElementById('amount').value = '50000';
      document.getElementById('category').value = 'Makanan';

      document.getElementById('transactionForm').dispatchEvent(
        new Event('submit', { bubbles: true })
      );

      const errorElement = document.getElementById('error-message');
      expect(errorElement.textContent).toBe('');
      expect(errorElement.style.display).toBe('none');
    });
  });

  describe('User experience enhancements', () => {
    beforeEach(() => {
      InputForm.initialize();
    });

    it('should clear error on focus to item name input', () => {
      InputForm.showError('Test error');
      
      const itemInput = document.getElementById('itemName');
      itemInput.dispatchEvent(new Event('focus'));

      const errorElement = document.getElementById('error-message');
      expect(errorElement.textContent).toBe('');
      expect(errorElement.style.display).toBe('none');
    });

    it('should clear error on focus to amount input', () => {
      InputForm.showError('Test error');
      
      const amountInput = document.getElementById('amount');
      amountInput.dispatchEvent(new Event('focus'));

      const errorElement = document.getElementById('error-message');
      expect(errorElement.textContent).toBe('');
      expect(errorElement.style.display).toBe('none');
    });

    it('should clear error on category change', () => {
      InputForm.showError('Test error');
      
      const categorySelect = document.getElementById('category');
      categorySelect.dispatchEvent(new Event('change'));

      const errorElement = document.getElementById('error-message');
      expect(errorElement.textContent).toBe('');
      expect(errorElement.style.display).toBe('none');
    });
  });
});

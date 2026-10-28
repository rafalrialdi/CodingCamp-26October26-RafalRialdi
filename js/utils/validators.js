/**
 * Validators - Input Validation Functions
 * Handles validation for all form inputs
 * 
 * Individual validators (validateItemName, validateAmount, validateCategory)
 * return boolean values for simple true/false checks.
 * 
 * validateTransaction returns {isValid, error} for detailed error reporting.
 */

const Validators = (() => {
  // Error messages
  const ERROR_MESSAGES = {
    ITEM_NAME_EMPTY: 'Nama item tidak boleh kosong',
    ITEM_NAME_TOO_LONG: 'Nama item terlalu panjang (maksimal 100 karakter)',
    AMOUNT_INVALID: 'Jumlah harus berupa angka positif',
    AMOUNT_ZERO: 'Jumlah tidak boleh nol atau negatif',
    CATEGORY_INVALID: 'Kategori tidak valid',
    FORM_INCOMPLETE: 'Semua field harus diisi'
  };

  const VALID_CATEGORIES = ['Makanan', 'Transportasi', 'Hiburan'];

  /**
   * Validate item name
   * Returns true if item name is valid, false otherwise
   * @param {string} itemName - Item name to validate
   * @returns {boolean} true if valid, false otherwise
   */
  const validateItemName = (itemName) => {
    if (typeof itemName !== 'string') return false;
    const trimmed = itemName.trim();
    if (trimmed.length === 0) return false;
    if (trimmed.length > 100) return false;
    return true;
  };

  /**
   * Validate amount
   * Returns true if amount is valid, false otherwise
   * @param {string|number} amount - Amount to validate
   * @returns {boolean} true if valid, false otherwise
   */
  const validateAmount = (amount) => {
    let num;

    if (typeof amount === 'number') {
      num = amount;
    } else if (typeof amount === 'string') {
      const trimmed = amount.trim();
      if (!/^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?$/.test(trimmed)) {
        return false;
      }
      num = parseFloat(trimmed);
    } else {
      return false;
    }

    if (!Number.isFinite(num)) return false;
    if (num <= 0) return false;
    if (num > 999999999) return false;
    return true;
  };

  /**
   * Validate category
   * Returns true if category is valid, false otherwise
   * @param {string} category - Category to validate
   * @returns {boolean} true if valid, false otherwise
   */
  const validateCategory = (category) => {
    if (typeof category !== 'string') return false;
    return VALID_CATEGORIES.includes(category);
  };

  /**
   * Validate complete transaction
   * Returns {isValid, error} object with detailed error information
   * @param {object} transaction - Transaction object to validate
   * @returns {object} {isValid: boolean, error: string|null}
   */
  const validateTransaction = (transaction) => {
    if (!transaction) {
      return { isValid: false, valid: false, error: ERROR_MESSAGES.FORM_INCOMPLETE };
    }

    const { itemName, amount, category } = transaction;

    if (!validateItemName(itemName)) {
      const isTooLong = typeof itemName === 'string' && itemName.trim().length > 100;
      return {
        isValid: false,
        valid: false,
        error: isTooLong ? ERROR_MESSAGES.ITEM_NAME_TOO_LONG : ERROR_MESSAGES.ITEM_NAME_EMPTY
      };
    }

    if (!validateAmount(amount)) {
      return { isValid: false, valid: false, error: ERROR_MESSAGES.AMOUNT_INVALID };
    }

    if (!validateCategory(category)) {
      return { isValid: false, valid: false, error: ERROR_MESSAGES.CATEGORY_INVALID };
    }

    return { isValid: true, valid: true, error: null };
  };

  /**
   * Sanitize string by trimming whitespace
   * @param {string} input - String to sanitize
   * @returns {string} trimmed string or empty string if not a string
   */
  const sanitizeString = (input) => {
    if (typeof input !== 'string') return '';
    return input.trim();
  };

  // Public API
  return {
    validateItemName,
    validateAmount,
    validateCategory,
    validateTransaction,
    sanitizeString,
    ERROR_MESSAGES,
    VALID_CATEGORIES
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Validators;
}

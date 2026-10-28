/**
 * Validators Module
 * Berisi fungsi-fungsi untuk validasi input pengguna
 */

const Validators = (() => {
  // Error messages untuk validasi
  const ERROR_MESSAGES = {
    ITEM_NAME_EMPTY: "Nama item tidak boleh kosong",
    ITEM_NAME_TOO_LONG: "Nama item terlalu panjang (maksimal 100 karakter)",
    AMOUNT_INVALID: "Jumlah harus berupa angka positif",
    AMOUNT_ZERO: "Jumlah tidak boleh nol atau negatif",
    CATEGORY_INVALID: "Kategori tidak valid. Pilih: Makanan, Transportasi, atau Hiburan",
    FORM_INCOMPLETE: "Semua field harus diisi"
  };

  const VALID_CATEGORIES = ["Makanan", "Transportasi", "Hiburan"];

  /**
   * Validasi nama item
   * @param {string} itemName - Nama item yang akan divalidasi
   * @returns {boolean} true jika valid, false jika invalid
   */
  const validateItemName = (itemName) => {
    if (typeof itemName !== 'string') return false;
    
    const trimmed = itemName.trim();
    if (trimmed.length === 0) return false;      // Kosong
    if (trimmed.length > 100) return false;      // Terlalu panjang
    
    return true;
  };

  /**
   * Validasi jumlah pengeluaran
   * @param {number|string} amount - Jumlah yang akan divalidasi
   * @returns {boolean} true jika valid, false jika invalid
   */
  const validateAmount = (amount) => {
    const num = parseFloat(amount);
    
    if (isNaN(num)) return false;                // Bukan angka
    if (num <= 0) return false;                  // Nol atau negatif
    if (!Number.isFinite(num)) return false;     // Infinity atau NaN
    if (num > 999999999) return false;           // Terlalu besar
    
    return true;
  };

  /**
   * Validasi kategori
   * @param {string} category - Kategori yang akan divalidasi
   * @returns {boolean} true jika valid, false jika invalid
   */
  const validateCategory = (category) => {
    if (typeof category !== 'string') return false;
    return VALID_CATEGORIES.includes(category);
  };

  /**
   * Validasi transaksi lengkap
   * @param {Object} transaction - Object transaksi dengan properties itemName, amount, category
   * @returns {Object} { isValid: boolean, error: string|null }
   */
  const validateTransaction = (transaction) => {
    if (!transaction) {
      return { isValid: false, error: ERROR_MESSAGES.FORM_INCOMPLETE };
    }

    const { itemName, amount, category } = transaction;

    if (!validateItemName(itemName)) {
      return { isValid: false, error: ERROR_MESSAGES.ITEM_NAME_EMPTY };
    }

    if (!validateAmount(amount)) {
      return { isValid: false, error: ERROR_MESSAGES.AMOUNT_INVALID };
    }

    if (!validateCategory(category)) {
      return { isValid: false, error: ERROR_MESSAGES.CATEGORY_INVALID };
    }

    return { isValid: true, error: null };
  };

  /**
   * Sanitasi input string (trim whitespace)
   * @param {string} input - Input string yang akan disanitasi
   * @returns {string} Input yang telah disanitasi
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

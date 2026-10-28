/**
 * Formatters Module
 * Berisi fungsi-fungsi untuk memformat data untuk tampilan
 */

const Formatters = (() => {
  /**
   * Format angka ke format mata uang IDR
   * Menggunakan Intl API untuk locale-aware formatting
   * @param {number} amount - Jumlah yang akan diformat
   * @returns {string} Formatted currency string (Rp X.XXX,XX)
   */
  const formatCurrency = (amount) => {
    if (typeof amount !== 'number' || !Number.isFinite(amount)) {
      return 'Rp 0';
    }

    try {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (error) {
      // Fallback jika Intl tidak tersedia
      return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
    }
  };

  /**
   * Format tanggal ke format lokal Indonesia
   * @param {Date|number|string} date - Tanggal yang akan diformat
   * @returns {string} Formatted date string (DD/MM/YYYY)
   */
  const formatDate = (date) => {
    try {
      const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
      
      if (!(dateObj instanceof Date) || isNaN(dateObj)) {
        return 'Tanggal tidak valid';
      }

      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(dateObj);
    } catch (error) {
      return 'Tanggal tidak valid';
    }
  };

  /**
   * Format tanggal ke format ISO (YYYY-MM-DD)
   * @param {Date} date - Tanggal yang akan diformat
   * @returns {string} ISO format date string
   */
  const formatDateISO = (date) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  /**
   * Format angka biasa dengan separator ribuan
   * @param {number} num - Angka yang akan diformat
   * @returns {string} Formatted number string
   */
  const formatNumber = (num) => {
    if (typeof num !== 'number' || !Number.isFinite(num)) {
      return '0';
    }

    try {
      return new Intl.NumberFormat('id-ID').format(num);
    } catch (error) {
      return num.toString();
    }
  };

  /**
   * Format persentase
   * @param {number} value - Nilai persentase (0-100)
   * @param {number} decimals - Jumlah desimal (default: 1)
   * @returns {string} Formatted percentage string
   */
  const formatPercentage = (value, decimals = 1) => {
    if (typeof value !== 'number' || !Number.isFinite(value)) {
      return '0%';
    }

    const rounded = Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    return `${rounded.toFixed(decimals)}%`;
  };

  /**
   * Format kategori ke readable format
   * @param {string} category - Kategori yang akan diformat
   * @returns {string} Formatted category string
   */
  const formatCategory = (category) => {
    const categoryMap = {
      'Makanan': '🍽️ Makanan',
      'Transportasi': '🚗 Transportasi',
      'Hiburan': '🎬 Hiburan'
    };

    return categoryMap[category] || category;
  };

  /**
   * Format kategori ke class name untuk CSS
   * @param {string} category - Kategori yang akan diformat
   * @returns {string} CSS class name
   */
  const formatCategoryToClass = (category) => {
    const classMap = {
      'Makanan': 'category-food',
      'Transportasi': 'category-transport',
      'Hiburan': 'category-entertainment'
    };

    return classMap[category] || 'category-other';
  };

  /**
   * Format kategori ke color hex
   * @param {string} category - Kategori yang akan diformat
   * @returns {string} Hex color code
   */
  const formatCategoryToColor = (category) => {
    const colorMap = {
      'Makanan': '#FF6B6B',
      'Transportasi': '#4ECDC4',
      'Hiburan': '#FFE66D'
    };

    return colorMap[category] || '#999999';
  };

  /**
   * Truncate string dengan ellipsis jika terlalu panjang
   * @param {string} str - String yang akan di-truncate
   * @param {number} maxLength - Panjang maksimal
   * @returns {string} Truncated string
   */
  const truncateString = (str, maxLength = 50) => {
    if (typeof str !== 'string') return '';
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  };

  // Public API
  return {
    formatCurrency,
    formatDate,
    formatDateISO,
    formatNumber,
    formatPercentage,
    formatCategory,
    formatCategoryToClass,
    formatCategoryToColor,
    truncateString
  };
})();

/**
 * Formatters - Formatting Functions
 * Handles standardized output formatting for currency, dates, numbers, percentages, and categories
 * Ensures consistent, locale-aware formatting (id-ID for Indonesia) across the application
 */

const Formatters = (() => {
  // Category emoji and label mappings
  const CATEGORY_EMOJI = {
    'Makanan': '🍽️',
    'Transportasi': '🚗',
    'Hiburan': '🎮'
  };

  const CATEGORY_COLORS = {
    'Makanan': '#FF6B6B',
    'Transportasi': '#4ECDC4',
    'Hiburan': '#FFE66D'
  };

  const CATEGORY_CLASSES = {
    'Makanan': 'category--food',
    'Transportasi': 'category--transport',
    'Hiburan': 'category--entertainment'
  };

  /**
   * Format amount as Indonesian Rupiah currency
   * Uses Intl.NumberFormat API for locale-aware formatting
   * 
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string (e.g., "Rp 50.000" or "Rp 50.000,50")
   * 
   * @example
   * formatCurrency(50000) => "Rp 50.000"
   * formatCurrency(1234567) => "Rp 1.234.567"
   */
  const formatCurrency = (amount) => {
    // Ensure amount is a valid number
    const num = parseFloat(amount) || 0;

    try {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(num);
    } catch (error) {
      // Fallback for browsers without Intl support
      console.warn('Intl.NumberFormat not supported, using fallback');
      return `Rp ${Math.floor(num).toLocaleString('id-ID')}`;
    }
  };

  /**
   * Format date to readable local string (e.g., "20 Desember 2024")
   * Uses Intl.DateTimeFormat API for locale-aware formatting (Indonesian locale)
   * 
   * @param {string|Date|number} date - Date to format (ISO string, Date object, or timestamp in ms)
   * @returns {string} Formatted date string or 'Invalid date' if input is invalid
   * 
   * @example
   * formatDate('2024-12-20') => "20 Desember 2024"
   * formatDate(new Date(2024, 11, 20)) => "20 Desember 2024"
   * formatDate(1703011200000) => "20 Desember 2024"
   */
  const formatDate = (date) => {
    try {
      let dateObj;

      // Handle different input types
      if (typeof date === 'string') {
        dateObj = new Date(date);
      } else if (typeof date === 'number') {
        dateObj = new Date(date);
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        return 'Invalid date';
      }

      // Validate the date object
      if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
      }

      // Use Intl API for locale-aware formatting
      return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(dateObj);
    } catch (error) {
      console.warn('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  /**
   * Format date to ISO string format (YYYY-MM-DD)
   * 
   * @param {string|Date|number} date - Date to format
   * @returns {string} ISO date string (YYYY-MM-DD) or empty string if invalid
   * 
   * @example
   * formatDateISO(new Date(2024, 11, 20)) => "2024-12-20"
   * formatDateISO('2024-12-20') => "2024-12-20"
   * formatDateISO(1703011200000) => "2024-12-20"
   */
  const formatDateISO = (date) => {
    try {
      let dateObj;

      if (typeof date === 'string') {
        dateObj = new Date(date);
      } else if (typeof date === 'number') {
        dateObj = new Date(date);
      } else if (date instanceof Date) {
        dateObj = date;
      } else {
        return '';
      }

      // Validate the date object
      if (isNaN(dateObj.getTime())) {
        return '';
      }

      // Manual formatting to ensure consistent YYYY-MM-DD format
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');

      return `${year}-${month}-${day}`;
    } catch (error) {
      console.warn('Error formatting date to ISO:', error);
      return '';
    }
  };

  /**
   * Format number with thousand separators
   * Uses locale-aware number formatting (Indonesian format with dots as separators)
   * 
   * @param {number} num - Number to format
   * @returns {string} Formatted number string (e.g., "1.234.567")
   * 
   * @example
   * formatNumber(1234567) => "1.234.567"
   * formatNumber(50000) => "50.000"
   * formatNumber(999) => "999"
   */
  const formatNumber = (num) => {
    const number = parseFloat(num) || 0;

    try {
      return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(number);
    } catch (error) {
      // Fallback for browsers without Intl support
      console.warn('Intl.NumberFormat not supported, using fallback');
      return Math.floor(number).toString();
    }
  };

  /**
   * Format value as percentage
   * 
   * @param {number} value - The value (numerator)
   * @param {number} decimals - Number of decimal places (default: 1)
   * @returns {string} Formatted percentage string (e.g., "25.5%" or "100%")
   * 
   * @example
   * formatPercentage(25.5) => "25.5%"
   * formatPercentage(100) => "100%"
   * formatPercentage(33.33333, 2) => "33.33%"
   */
  const formatPercentage = (value, decimals = 1) => {
    const num = parseFloat(value) || 0;
    return `${num.toFixed(decimals)}%`;
  };

  /**
   * Format category with emoji prefix
   * Returns category name with associated emoji for visual distinction
   * 
   * @param {string} category - Category name (e.g., "Makanan", "Transportasi", "Hiburan")
   * @returns {string} Formatted category string with emoji (e.g., "🍽️ Makanan")
   * 
   * @example
   * formatCategory('Makanan') => "🍽️ Makanan"
   * formatCategory('Transportasi') => "🚗 Transportasi"
   * formatCategory('Hiburan') => "🎮 Hiburan"
   */
  const formatCategory = (category) => {
    const emoji = CATEGORY_EMOJI[category] || '📌';
    return `${emoji} ${category}`;
  };

  /**
   * Map category name to CSS class name
   * Used for styling elements based on transaction category
   * 
   * @param {string} category - Category name
   * @returns {string} CSS class name (e.g., "category--food", "category--transport")
   * 
   * @example
   * formatCategoryToClass('Makanan') => "category--food"
   * formatCategoryToClass('Transportasi') => "category--transport"
   * formatCategoryToClass('Hiburan') => "category--entertainment"
   */
  const formatCategoryToClass = (category) => {
    return CATEGORY_CLASSES[category] || 'category--default';
  };

  /**
   * Map category name to hex color code
   * Used for chart colors and visual distinction
   * 
   * @param {string} category - Category name
   * @returns {string} Hex color code (e.g., "#FF6B6B", "#4ECDC4", "#FFE66D")
   * 
   * @example
   * formatCategoryToColor('Makanan') => "#FF6B6B"
   * formatCategoryToColor('Transportasi') => "#4ECDC4"
   * formatCategoryToColor('Hiburan') => "#FFE66D"
   */
  const formatCategoryToColor = (category) => {
    return CATEGORY_COLORS[category] || '#95A5A6';
  };

  /**
   * Truncate string with ellipsis if it exceeds max length
   * Useful for displaying long item names in limited space
   * 
   * @param {string} str - String to truncate
   * @param {number} maxLength - Maximum length before truncation
   * @returns {string} Truncated string with ellipsis if needed (e.g., "Makan si...")
   * 
   * @example
   * truncateString('Makan siang di restoran fancy', 20) => "Makan siang di resia..."
   * truncateString('Makan', 20) => "Makan"
   * truncateString('Makan siang di restoran', 10) => "Makan sia..."
   */
  const truncateString = (str, maxLength) => {
    if (typeof str !== 'string') {
      return '';
    }

    if (str.length <= maxLength) {
      return str;
    }

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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Formatters;
}

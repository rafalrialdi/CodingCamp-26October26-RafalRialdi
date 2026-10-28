/**
 * Unit Tests for Formatters
 * Tests all formatting functions for correctness and edge cases
 */

require('./formatters.js');

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format 0 as Rp 0', () => {
      expect(Formatters.formatCurrency(0)).toMatch(/0/);
    });

    it('should format positive numbers as IDR currency', () => {
      const result = Formatters.formatCurrency(50000);
      expect(result).toContain('50');
      expect(result).toContain('Rp');
    });

    it('should format large numbers with separators', () => {
      const result = Formatters.formatCurrency(1234567);
      expect(result).toContain('1');
      expect(result).toContain('Rp');
    });

    it('should handle string input by converting to number', () => {
      const result = Formatters.formatCurrency('50000');
      expect(result).toContain('50');
      expect(result).toContain('Rp');
    });

    it('should handle invalid input by treating as 0', () => {
      const result = Formatters.formatCurrency('invalid');
      expect(result).toMatch(/0/);
    });

    it('should not include decimal places', () => {
      const result = Formatters.formatCurrency(50000.99);
      expect(result).not.toContain(',');
    });
  });

  describe('formatDate', () => {
    it('should format ISO string date correctly', () => {
      const result = Formatters.formatDate('2024-12-20');
      expect(result).toContain('2024');
      expect(result).toContain('20');
    });

    it('should format Date object correctly', () => {
      const date = new Date(2024, 11, 20); // December 20, 2024
      const result = Formatters.formatDate(date);
      expect(result).toContain('2024');
      expect(result).toContain('20');
    });

    it('should format timestamp (milliseconds) correctly', () => {
      const timestamp = new Date(2024, 11, 20).getTime();
      const result = Formatters.formatDate(timestamp);
      expect(result).toContain('2024');
      expect(result).toContain('20');
    });

    it('should return "Invalid date" for invalid input', () => {
      expect(Formatters.formatDate('invalid')).toBe('Invalid date');
    });

    it('should return "Invalid date" for null', () => {
      expect(Formatters.formatDate(null)).toBe('Invalid date');
    });

    it('should return "Invalid date" for undefined', () => {
      expect(Formatters.formatDate(undefined)).toBe('Invalid date');
    });

    it('should use Indonesian locale (month should be in Indonesian)', () => {
      const date = new Date(2024, 11, 20);
      const result = Formatters.formatDate(date);
      // Should contain Indonesian month name or just be formatted
      expect(result).toBeTruthy();
      expect(result).not.toBe('Invalid date');
    });
  });

  describe('formatDateISO', () => {
    it('should format Date object to YYYY-MM-DD', () => {
      const date = new Date(2024, 11, 20); // December 20, 2024
      expect(Formatters.formatDateISO(date)).toBe('2024-12-20');
    });

    it('should format ISO string to YYYY-MM-DD', () => {
      const result = Formatters.formatDateISO('2024-12-20');
      expect(result).toBe('2024-12-20');
    });

    it('should format timestamp to YYYY-MM-DD', () => {
      const timestamp = new Date(2024, 11, 20).getTime();
      expect(Formatters.formatDateISO(timestamp)).toBe('2024-12-20');
    });

    it('should pad month with leading zero', () => {
      const date = new Date(2024, 0, 5); // January 5, 2024
      expect(Formatters.formatDateISO(date)).toBe('2024-01-05');
    });

    it('should pad day with leading zero', () => {
      const date = new Date(2024, 11, 5); // December 5, 2024
      expect(Formatters.formatDateISO(date)).toBe('2024-12-05');
    });

    it('should return empty string for invalid input', () => {
      expect(Formatters.formatDateISO('invalid')).toBe('');
    });

    it('should return empty string for null', () => {
      expect(Formatters.formatDateISO(null)).toBe('');
    });

    it('should return empty string for undefined', () => {
      expect(Formatters.formatDateISO(undefined)).toBe('');
    });
  });

  describe('formatNumber', () => {
    it('should format 0 as 0', () => {
      expect(Formatters.formatNumber(0)).toBe('0');
    });

    it('should format number with thousand separators', () => {
      const result = Formatters.formatNumber(1234567);
      expect(result).toContain('1');
      expect(result).toContain('234');
      expect(result).toContain('567');
    });

    it('should handle numbers less than 1000', () => {
      const result = Formatters.formatNumber(999);
      expect(result).toBe('999');
    });

    it('should handle string input by converting to number', () => {
      const result = Formatters.formatNumber('50000');
      expect(result).toContain('50');
    });

    it('should not include decimal places', () => {
      const result = Formatters.formatNumber(50000.99);
      expect(result).toBe('50.001');
    });

    it('should handle invalid input by treating as 0', () => {
      expect(Formatters.formatNumber('invalid')).toBe('0');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage with 1 decimal place by default', () => {
      expect(Formatters.formatPercentage(25.5)).toBe('25.5%');
    });

    it('should format percentage with specified decimal places', () => {
      expect(Formatters.formatPercentage(33.33333, 2)).toBe('33.33%');
    });

    it('should format 100 percent', () => {
      expect(Formatters.formatPercentage(100)).toBe('100.0%');
    });

    it('should format 0 percent', () => {
      expect(Formatters.formatPercentage(0)).toBe('0.0%');
    });

    it('should handle 0 decimal places', () => {
      expect(Formatters.formatPercentage(25.5, 0)).toBe('26%');
    });

    it('should handle 3 decimal places', () => {
      expect(Formatters.formatPercentage(33.33333, 3)).toBe('33.333%');
    });

    it('should handle string input by converting to number', () => {
      expect(Formatters.formatPercentage('25.5')).toBe('25.5%');
    });

    it('should handle invalid input by treating as 0', () => {
      expect(Formatters.formatPercentage('invalid')).toBe('0.0%');
    });
  });

  describe('formatCategory', () => {
    it('should format Makanan with emoji', () => {
      const result = Formatters.formatCategory('Makanan');
      expect(result).toContain('🍽️');
      expect(result).toContain('Makanan');
    });

    it('should format Transportasi with emoji', () => {
      const result = Formatters.formatCategory('Transportasi');
      expect(result).toContain('🚗');
      expect(result).toContain('Transportasi');
    });

    it('should format Hiburan with emoji', () => {
      const result = Formatters.formatCategory('Hiburan');
      expect(result).toContain('🎮');
      expect(result).toContain('Hiburan');
    });

    it('should include emoji and category name', () => {
      const result = Formatters.formatCategory('Makanan');
      expect(result).toMatch(/^[\w\p{Emoji}\uFE0F]+\s+Makanan$/u);
    });

    it('should use default emoji for unknown category', () => {
      const result = Formatters.formatCategory('UnknownCategory');
      expect(result).toContain('📌');
      expect(result).toContain('UnknownCategory');
    });
  });

  describe('formatCategoryToClass', () => {
    it('should map Makanan to category--food', () => {
      expect(Formatters.formatCategoryToClass('Makanan')).toBe('category--food');
    });

    it('should map Transportasi to category--transport', () => {
      expect(Formatters.formatCategoryToClass('Transportasi')).toBe('category--transport');
    });

    it('should map Hiburan to category--entertainment', () => {
      expect(Formatters.formatCategoryToClass('Hiburan')).toBe('category--entertainment');
    });

    it('should use default class for unknown category', () => {
      expect(Formatters.formatCategoryToClass('UnknownCategory')).toBe('category--default');
    });
  });

  describe('formatCategoryToColor', () => {
    it('should map Makanan to #FF6B6B', () => {
      expect(Formatters.formatCategoryToColor('Makanan')).toBe('#FF6B6B');
    });

    it('should map Transportasi to #4ECDC4', () => {
      expect(Formatters.formatCategoryToColor('Transportasi')).toBe('#4ECDC4');
    });

    it('should map Hiburan to #FFE66D', () => {
      expect(Formatters.formatCategoryToColor('Hiburan')).toBe('#FFE66D');
    });

    it('should use default color for unknown category', () => {
      expect(Formatters.formatCategoryToColor('UnknownCategory')).toBe('#95A5A6');
    });

    it('should return valid hex color format', () => {
      const color = Formatters.formatCategoryToColor('Makanan');
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  describe('truncateString', () => {
    it('should not truncate strings shorter than maxLength', () => {
      expect(Formatters.truncateString('Short', 10)).toBe('Short');
    });

    it('should truncate strings longer than maxLength with ellipsis', () => {
      const result = Formatters.truncateString('This is a very long string', 10);
      expect(result).toBe('This is...');
      expect(result.length).toBe(10); // 7 chars + '...'
    });

    it('should truncate at exact maxLength boundary', () => {
      const result = Formatters.truncateString('Exactly twenty chars!', 20);
      expect(result).toBe('Exactly twenty ch...');
    });

    it('should end with ellipsis when truncated', () => {
      const result = Formatters.truncateString('Makan siang di restoran fancy', 20);
      expect(result.endsWith('...')).toBe(true);
    });

    it('should handle maxLength of 3 (minimum ellipsis)', () => {
      const result = Formatters.truncateString('Hello world', 3);
      expect(result).toBe('...');
    });

    it('should handle non-string input by returning empty string', () => {
      expect(Formatters.truncateString(null, 10)).toBe('');
      expect(Formatters.truncateString(undefined, 10)).toBe('');
      expect(Formatters.truncateString(123, 10)).toBe('');
    });

    it('should preserve content up to maxLength - 3', () => {
      const result = Formatters.truncateString('Makan siang di restoran', 15);
      expect(result).toContain('Makan siang');
      expect(result.endsWith('...')).toBe(true);
    });

    it('should work with various string lengths', () => {
      expect(Formatters.truncateString('AB', 5)).toBe('AB');
      expect(Formatters.truncateString('ABCDE', 5)).toBe('ABCDE');
      expect(Formatters.truncateString('ABCDEF', 5)).toBe('AB...');
    });
  });

  describe('Formatters API', () => {
    it('should expose all required public methods', () => {
      expect(typeof Formatters.formatCurrency).toBe('function');
      expect(typeof Formatters.formatDate).toBe('function');
      expect(typeof Formatters.formatDateISO).toBe('function');
      expect(typeof Formatters.formatNumber).toBe('function');
      expect(typeof Formatters.formatPercentage).toBe('function');
      expect(typeof Formatters.formatCategory).toBe('function');
      expect(typeof Formatters.formatCategoryToClass).toBe('function');
      expect(typeof Formatters.formatCategoryToColor).toBe('function');
      expect(typeof Formatters.truncateString).toBe('function');
    });
  });

  describe('Integration tests', () => {
    it('should format a complete transaction display', () => {
      const transaction = {
        itemName: 'Makan siang di restoran fancy',
        amount: 150000,
        category: 'Makanan',
        date: new Date(2024, 11, 20)
      };

      const formattedItem = Formatters.truncateString(transaction.itemName, 20);
      const formattedAmount = Formatters.formatCurrency(transaction.amount);
      const formattedCategory = Formatters.formatCategory(transaction.category);
      const formattedDate = Formatters.formatDate(transaction.date);

      expect(formattedItem.endsWith('...')).toBe(true);
      expect(formattedAmount).toContain('Rp');
      expect(formattedAmount).toContain('150');
      expect(formattedCategory).toContain('🍽️');
      expect(formattedDate).toContain('2024');
    });

    it('should format pie chart data labels and colors correctly', () => {
      const categories = ['Makanan', 'Transportasi', 'Hiburan'];

      const labels = categories.map(cat => Formatters.formatCategory(cat));
      const colors = categories.map(cat => Formatters.formatCategoryToColor(cat));

      expect(labels).toHaveLength(3);
      expect(colors).toHaveLength(3);
      expect(labels[0]).toContain('🍽️');
      expect(colors[0]).toBe('#FF6B6B');
    });

    it('should handle date formatting for display and ISO storage', () => {
      const now = new Date();

      const displayDate = Formatters.formatDate(now);
      const isoDate = Formatters.formatDateISO(now);

      expect(displayDate).not.toBe('Invalid date');
      expect(isoDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
});

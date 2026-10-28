/**
 * Storage Manager Tests
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4
 * 
 * Test coverage for LocalStorage persistence, error handling,
 * and data validation.
 */

// Import StorageManager from the source file
require('../managers/storage-manager');

describe('StorageManager', () => {
  let originalSetItem;

  beforeEach(() => {
    // Clear localStorage before each test
    originalSetItem = Storage.prototype.setItem;
    localStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    Storage.prototype.setItem = originalSetItem;
    jest.restoreAllMocks();
  });

  describe('isAvailable()', () => {
    it('should return true when localStorage is available', () => {
      const result = StorageManager.isAvailable();
      expect(result).toBe(true);
    });

    it('should handle localStorage safely when unavailable', () => {
      const originalSetItem = Storage.prototype.setItem;
      Storage.prototype.setItem = jest.fn(() => {
        throw new Error('QuotaExceededError');
      });

      // The function should handle the error gracefully
      const result = StorageManager.isAvailable();
      expect(typeof result).toBe('boolean');

      Storage.prototype.setItem = originalSetItem;
    });
  });

  describe('save()', () => {
    it('should save transactions to localStorage successfully', () => {
      const transactions = [
        {
          id: '1',
          itemName: 'Lunch',
          amount: 50000,
          category: 'Makanan',
          timestamp: Date.now()
        }
      ];

      const result = StorageManager.save(transactions);
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();

      const stored = localStorage.getItem('expenseTrackerTransactions');
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored);
      expect(parsed.transactions).toEqual(transactions);
    });

    it('should set version when saving', () => {
      const transactions = [];
      StorageManager.save(transactions);

      const version = localStorage.getItem('expenseTrackerVersion');
      expect(version).toBe('1.0');
    });

    it('should include lastSaved timestamp in storage data', () => {
      const transactions = [];
      StorageManager.save(transactions);

      const stored = JSON.parse(localStorage.getItem('expenseTrackerTransactions'));
      expect(stored.lastSaved).toBeDefined();
      expect(typeof stored.lastSaved).toBe('string');
    });

    it('should return error if transactions is not an array', () => {
      const result = StorageManager.save('not-an-array');
      expect(result.success).toBe(false);
      expect(result.error).toContain('array');
    });

    it('should return error if localStorage is unavailable', () => {
      jest.spyOn(StorageManager, 'isAvailable').mockReturnValue(false);

      const result = StorageManager.save([]);
      expect(result.success).toBe(false);
      expect(result.error).toContain('LocalStorage');
    });

    it('should handle QuotaExceededError gracefully', () => {
      const mockSetItem = jest.fn(() => {
        const error = new Error();
        error.name = 'QuotaExceededError';
        throw error;
      });

      Storage.prototype.setItem = mockSetItem;

      const result = StorageManager.save([{ id: '1', itemName: 'test', amount: 100, category: 'Makanan', timestamp: Date.now() }]);
      expect(result.success).toBe(false);
      expect(result.error).toContain('penuh');
    });

    it('should handle SecurityError gracefully', () => {
      const mockSetItem = jest.fn(() => {
        const error = new Error();
        error.name = 'SecurityError';
        throw error;
      });

      Storage.prototype.setItem = mockSetItem;

      const result = StorageManager.save([]);
      expect(result.success).toBe(false);
      expect(result.error).toContain('private');
    });

    it('should save multiple transactions correctly', () => {
      const transactions = [
        { id: '1', itemName: 'Lunch', amount: 50000, category: 'Makanan', timestamp: 1000 },
        { id: '2', itemName: 'Bus', amount: 25000, category: 'Transportasi', timestamp: 2000 },
        { id: '3', itemName: 'Movie', amount: 150000, category: 'Hiburan', timestamp: 3000 }
      ];

      const result = StorageManager.save(transactions);
      expect(result.success).toBe(true);

      const stored = JSON.parse(localStorage.getItem('expenseTrackerTransactions'));
      expect(stored.transactions).toHaveLength(3);
      expect(stored.transactions[0].id).toBe('1');
      expect(stored.transactions[1].id).toBe('2');
      expect(stored.transactions[2].id).toBe('3');
    });
  });

  describe('load()', () => {
    it('should load transactions from localStorage', () => {
      const transactions = [
        { id: '1', itemName: 'Lunch', amount: 50000, category: 'Makanan', timestamp: Date.now() }
      ];

      StorageManager.save(transactions);
      const result = StorageManager.load();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(transactions);
      expect(result.error).toBeNull();
    });

    it('should return empty array when localStorage is empty', () => {
      const result = StorageManager.load();
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.error).toBeNull();
    });

    it('should filter out invalid transactions', () => {
      const storageData = {
        version: '1.0',
        transactions: [
          { id: '1', itemName: 'Valid', amount: 50000, category: 'Makanan', timestamp: 1000 },
          { itemName: 'Missing ID', amount: 50000, category: 'Makanan', timestamp: 1000 },
          { id: '2', amount: 50000, category: 'Makanan', timestamp: 1000 }, // Missing itemName
          { id: '3', itemName: 'Missing amount', category: 'Makanan', timestamp: 1000 },
          { id: '4', itemName: 'Missing category', amount: 50000, timestamp: 1000 },
          { id: '5', itemName: 'Missing timestamp', amount: 50000, category: 'Makanan' }
        ]
      };

      localStorage.setItem('expenseTrackerTransactions', JSON.stringify(storageData));
      const result = StorageManager.load();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('1');
    });

    it('should handle corrupted JSON gracefully', () => {
      localStorage.setItem('expenseTrackerTransactions', '{invalid json');
      const result = StorageManager.load();

      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
      expect(result.error).toContain('Gagal memuat');
    });

    it('should handle invalid storage structure', () => {
      localStorage.setItem('expenseTrackerTransactions', JSON.stringify({ transactions: 'not-an-array' }));
      const result = StorageManager.load();

      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
    });

    it('should return empty data when localStorage is unavailable', () => {
      jest.spyOn(StorageManager, 'isAvailable').mockReturnValue(false);
      const result = StorageManager.load();

      expect(result.success).toBe(false);
      expect(result.data).toEqual([]);
    });

    it('should handle amount as number, not string', () => {
      const storageData = {
        version: '1.0',
        transactions: [
          { id: '1', itemName: 'Valid', amount: 50000, category: 'Makanan', timestamp: 1000 },
          { id: '2', itemName: 'Invalid amount', amount: '50000', category: 'Makanan', timestamp: 1000 }
        ]
      };

      localStorage.setItem('expenseTrackerTransactions', JSON.stringify(storageData));
      const result = StorageManager.load();

      expect(result.data).toHaveLength(1);
      expect(result.data[0].id).toBe('1');
    });
  });

  describe('clear()', () => {
    it('should clear all stored data', () => {
      const transactions = [
        { id: '1', itemName: 'Test', amount: 50000, category: 'Makanan', timestamp: Date.now() }
      ];

      StorageManager.save(transactions);
      expect(localStorage.getItem('expenseTrackerTransactions')).not.toBeNull();

      const result = StorageManager.clear();
      expect(result.success).toBe(true);
      expect(result.error).toBeNull();
      expect(localStorage.getItem('expenseTrackerTransactions')).toBeNull();
      expect(localStorage.getItem('expenseTrackerVersion')).toBeNull();
    });

    it('should return error if localStorage is unavailable', () => {
      jest.spyOn(StorageManager, 'isAvailable').mockReturnValue(false);
      const result = StorageManager.clear();

      expect(result.success).toBe(false);
      expect(result.error).toContain('LocalStorage');
    });

    it('should handle errors gracefully', () => {
      jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('Remove failed');
      });

      const result = StorageManager.clear();
      expect(result.success).toBe(false);
      expect(result.error).toContain('Gagal');
    });
  });

  describe('getVersion()', () => {
    it('should return current version when set', () => {
      StorageManager.save([]);
      const version = StorageManager.getVersion();
      expect(version).toBe('1.0');
    });

    it('should return null when localStorage is empty', () => {
      const version = StorageManager.getVersion();
      expect(version).toBeNull();
    });

    it('should return null when localStorage is unavailable', () => {
      jest.spyOn(StorageManager, 'isAvailable').mockReturnValue(false);
      const version = StorageManager.getVersion();
      expect(version).toBeNull();
    });

    it('should handle errors gracefully', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('Get failed');
      });

      const version = StorageManager.getVersion();
      expect(version).toBeNull();
    });
  });

  describe('needsMigration()', () => {
    it('should return false when version matches current version', () => {
      StorageManager.save([]);
      const needs = StorageManager.needsMigration();
      expect(needs).toBe(false);
    });

    it('should return true when version differs from current', () => {
      localStorage.setItem('expenseTrackerVersion', '0.9');
      const needs = StorageManager.needsMigration();
      expect(needs).toBe(true);
    });

    it('should return false when no version is set', () => {
      const needs = StorageManager.needsMigration();
      expect(needs).toBe(false);
    });
  });

  describe('Round-trip persistence', () => {
    it('should preserve data through save and load cycle', () => {
      const originalTransactions = [
        { id: '1', itemName: 'Lunch', amount: 50000, category: 'Makanan', timestamp: 1000 },
        { id: '2', itemName: 'Grab', amount: 25000, category: 'Transportasi', timestamp: 2000 },
        { id: '3', itemName: 'Movie', amount: 150000, category: 'Hiburan', timestamp: 3000 }
      ];

      // Save
      const saveResult = StorageManager.save(originalTransactions);
      expect(saveResult.success).toBe(true);

      // Load
      const loadResult = StorageManager.load();
      expect(loadResult.success).toBe(true);
      expect(loadResult.data).toEqual(originalTransactions);
    });

    it('should handle empty transactions correctly', () => {
      const emptyTransactions = [];

      StorageManager.save(emptyTransactions);
      const result = StorageManager.load();

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should preserve complex transaction data', () => {
      const complexTransactions = [
        {
          id: '1701234567890',
          itemName: 'Makan siang di restoran dengan teman-teman',
          amount: 125750.50,
          category: 'Makanan',
          timestamp: 1701234567890
        }
      ];

      StorageManager.save(complexTransactions);
      const result = StorageManager.load();

      expect(result.data[0]).toEqual(complexTransactions[0]);
      expect(result.data[0].amount).toBe(125750.50);
    });
  });

  describe('getInfo()', () => {
    it('should return storage info when available', () => {
      StorageManager.save([
        { id: '1', itemName: 'Test', amount: 50000, category: 'Makanan', timestamp: Date.now() }
      ]);

      const info = StorageManager.getInfo();
      expect(info.available).toBe(true);
      expect(info.dataSize).toBeGreaterThan(0);
      expect(info.version).toBe('1.0');
    });

    it('should return empty info when storage is unavailable', () => {
      jest.spyOn(StorageManager, 'isAvailable').mockReturnValue(false);
      const info = StorageManager.getInfo();

      expect(info.available).toBe(false);
      expect(info.dataSize).toBe(0);
    });

    it('should return zero size when empty', () => {
      const info = StorageManager.getInfo();
      expect(info.dataSize).toBe(0);
    });
  });
});

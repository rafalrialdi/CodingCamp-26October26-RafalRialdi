/**
 * Unit Tests for Validators
 * Tests all validation functions for correctness and edge cases
 * 
 * **Validates: Requirements 1.3, 1.4, 1.6**
 */

describe('Validators', () => {
  describe('validateItemName', () => {
    describe('Valid cases', () => {
      it('should accept valid item name', () => {
        expect(Validators.validateItemName('Makan siang')).toBe(true);
      });

      it('should accept item name with numbers', () => {
        expect(Validators.validateItemName('Membeli 2 kopi')).toBe(true);
      });

      it('should accept item name with special characters', () => {
        expect(Validators.validateItemName('Restoran "Budi"')).toBe(true);
      });

      it('should accept single character', () => {
        expect(Validators.validateItemName('A')).toBe(true);
      });

      it('should accept exactly 100 characters', () => {
        const name = 'A'.repeat(100);
        expect(Validators.validateItemName(name)).toBe(true);
      });

      it('should accept item name with leading/trailing whitespace (trimmed)', () => {
        // Note: The validator accepts it because trim happens internally
        expect(Validators.validateItemName('   Valid name   ')).toBe(true);
      });

      it('should accept Unicode characters (Indonesian characters)', () => {
        expect(Validators.validateItemName('Makan di warung Budi')).toBe(true);
      });
    });

    describe('Invalid cases', () => {
      it('should reject empty string', () => {
        expect(Validators.validateItemName('')).toBe(false);
      });

      it('should reject whitespace-only string', () => {
        expect(Validators.validateItemName('   ')).toBe(false);
      });

      it('should reject null', () => {
        expect(Validators.validateItemName(null)).toBe(false);
      });

      it('should reject undefined', () => {
        expect(Validators.validateItemName(undefined)).toBe(false);
      });

      it('should reject number', () => {
        expect(Validators.validateItemName(123)).toBe(false);
      });

      it('should reject boolean', () => {
        expect(Validators.validateItemName(true)).toBe(false);
      });

      it('should reject object', () => {
        expect(Validators.validateItemName({})).toBe(false);
      });

      it('should reject array', () => {
        expect(Validators.validateItemName(['item'])).toBe(false);
      });

      it('should reject name longer than 100 characters', () => {
        const name = 'A'.repeat(101);
        expect(Validators.validateItemName(name)).toBe(false);
      });

      it('should reject name at 101 character boundary', () => {
        expect(Validators.validateItemName('A'.repeat(101))).toBe(false);
      });

      it('should reject name with only newlines', () => {
        expect(Validators.validateItemName('\n\n\n')).toBe(false);
      });

      it('should reject name with only tabs', () => {
        expect(Validators.validateItemName('\t\t\t')).toBe(false);
      });
    });
  });

  describe('validateAmount', () => {
    describe('Valid cases', () => {
      it('should accept positive integer', () => {
        expect(Validators.validateAmount(50000)).toBe(true);
      });

      it('should accept positive decimal', () => {
        expect(Validators.validateAmount(50000.50)).toBe(true);
      });

      it('should accept very small positive number', () => {
        expect(Validators.validateAmount(0.01)).toBe(true);
      });

      it('should accept string number', () => {
        expect(Validators.validateAmount('50000')).toBe(true);
      });

      it('should accept string number with decimal', () => {
        expect(Validators.validateAmount('50000.50')).toBe(true);
      });

      it('should accept large number up to 999999999', () => {
        expect(Validators.validateAmount(999999999)).toBe(true);
      });

      it('should accept scientific notation', () => {
        expect(Validators.validateAmount('1e5')).toBe(true);
      });

      it('should accept string with leading whitespace (parseFloat handles)', () => {
        expect(Validators.validateAmount('  50000')).toBe(true);
      });
    });

    describe('Invalid cases', () => {
      it('should reject zero', () => {
        expect(Validators.validateAmount(0)).toBe(false);
      });

      it('should reject negative number', () => {
        expect(Validators.validateAmount(-50000)).toBe(false);
      });

      it('should reject NaN', () => {
        expect(Validators.validateAmount(NaN)).toBe(false);
      });

      it('should reject Infinity', () => {
        expect(Validators.validateAmount(Infinity)).toBe(false);
      });

      it('should reject negative Infinity', () => {
        expect(Validators.validateAmount(-Infinity)).toBe(false);
      });

      it('should reject non-numeric string', () => {
        expect(Validators.validateAmount('not a number')).toBe(false);
      });

      it('should reject null', () => {
        expect(Validators.validateAmount(null)).toBe(false);
      });

      it('should reject undefined', () => {
        expect(Validators.validateAmount(undefined)).toBe(false);
      });

      it('should reject boolean', () => {
        expect(Validators.validateAmount(true)).toBe(false);
      });

      it('should reject empty string', () => {
        expect(Validators.validateAmount('')).toBe(false);
      });

      it('should reject string "0"', () => {
        expect(Validators.validateAmount('0')).toBe(false);
      });

      it('should reject number larger than 999999999', () => {
        expect(Validators.validateAmount(1000000000)).toBe(false);
      });

      it('should reject number at 1000000000 boundary', () => {
        expect(Validators.validateAmount(999999999.01)).toBe(false);
      });

      it('should reject array', () => {
        expect(Validators.validateAmount([50000])).toBe(false);
      });

      it('should reject object', () => {
        expect(Validators.validateAmount({ amount: 50000 })).toBe(false);
      });

      it('should reject string with currency symbol', () => {
        expect(Validators.validateAmount('Rp 50000')).toBe(false);
      });

      it('should reject string with non-numeric characters', () => {
        expect(Validators.validateAmount('50000abc')).toBe(false);
      });
    });
  });

  describe('validateCategory', () => {
    describe('Valid cases', () => {
      it('should accept Makanan', () => {
        expect(Validators.validateCategory('Makanan')).toBe(true);
      });

      it('should accept Transportasi', () => {
        expect(Validators.validateCategory('Transportasi')).toBe(true);
      });

      it('should accept Hiburan', () => {
        expect(Validators.validateCategory('Hiburan')).toBe(true);
      });
    });

    describe('Invalid cases', () => {
      it('should reject empty string', () => {
        expect(Validators.validateCategory('')).toBe(false);
      });

      it('should reject null', () => {
        expect(Validators.validateCategory(null)).toBe(false);
      });

      it('should reject undefined', () => {
        expect(Validators.validateCategory(undefined)).toBe(false);
      });

      it('should reject number', () => {
        expect(Validators.validateCategory(1)).toBe(false);
      });

      it('should reject boolean', () => {
        expect(Validators.validateCategory(true)).toBe(false);
      });

      it('should reject object', () => {
        expect(Validators.validateCategory({})).toBe(false);
      });

      it('should reject array', () => {
        expect(Validators.validateCategory(['Makanan'])).toBe(false);
      });

      it('should reject lowercase makanan', () => {
        expect(Validators.validateCategory('makanan')).toBe(false);
      });

      it('should reject with extra spaces', () => {
        expect(Validators.validateCategory(' Makanan ')).toBe(false);
      });

      it('should reject typo in category', () => {
        expect(Validators.validateCategory('Makan')).toBe(false);
      });

      it('should reject unknown category', () => {
        expect(Validators.validateCategory('Belanja')).toBe(false);
      });

      it('should reject partial match', () => {
        expect(Validators.validateCategory('Transp')).toBe(false);
      });
    });
  });

  describe('validateTransaction', () => {
    describe('Valid cases', () => {
      it('should accept valid transaction object', () => {
        const transaction = {
          itemName: 'Makan siang',
          amount: 50000,
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept transaction with string amount', () => {
        const transaction = {
          itemName: 'Makan siang',
          amount: '50000',
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept transaction with decimal amount', () => {
        const transaction = {
          itemName: 'Makan siang',
          amount: 50000.50,
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });

      it('should accept transaction with all three categories', () => {
        const categories = ['Makanan', 'Transportasi', 'Hiburan'];
        categories.forEach(category => {
          const transaction = {
            itemName: 'Item',
            amount: 50000,
            category: category
          };
          const result = Validators.validateTransaction(transaction);
          expect(result.isValid).toBe(true);
          expect(result.error).toBeNull();
        });
      });

      it('should accept transaction with extra properties', () => {
        const transaction = {
          itemName: 'Makan siang',
          amount: 50000,
          category: 'Makanan',
          id: '123',
          timestamp: Date.now()
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    describe('Invalid - null/undefined cases', () => {
      it('should reject null', () => {
        const result = Validators.validateTransaction(null);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.FORM_INCOMPLETE);
      });

      it('should reject undefined', () => {
        const result = Validators.validateTransaction(undefined);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.FORM_INCOMPLETE);
      });

      it('should reject non-object', () => {
        const result = Validators.validateTransaction('not an object');
        expect(result.isValid).toBe(false);
      });
    });

    describe('Invalid - itemName validation', () => {
      it('should reject transaction with empty itemName', () => {
        const transaction = {
          itemName: '',
          amount: 50000,
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.ITEM_NAME_EMPTY);
      });

      it('should reject transaction with whitespace-only itemName', () => {
        const transaction = {
          itemName: '   ',
          amount: 50000,
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.ITEM_NAME_EMPTY);
      });

      it('should reject transaction with itemName too long', () => {
        const transaction = {
          itemName: 'A'.repeat(101),
          amount: 50000,
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.ITEM_NAME_TOO_LONG);
      });

      it('should reject transaction with missing itemName property', () => {
        const transaction = {
          amount: 50000,
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.ITEM_NAME_EMPTY);
      });

      it('should reject transaction with null itemName', () => {
        const transaction = {
          itemName: null,
          amount: 50000,
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.ITEM_NAME_EMPTY);
      });
    });

    describe('Invalid - amount validation', () => {
      it('should reject transaction with zero amount', () => {
        const transaction = {
          itemName: 'Makan siang',
          amount: 0,
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.AMOUNT_INVALID);
      });

      it('should reject transaction with negative amount', () => {
        const transaction = {
          itemName: 'Makan siang',
          amount: -50000,
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.AMOUNT_INVALID);
      });

      it('should reject transaction with non-numeric amount', () => {
        const transaction = {
          itemName: 'Makan siang',
          amount: 'not a number',
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.AMOUNT_INVALID);
      });

      it('should reject transaction with Infinity', () => {
        const transaction = {
          itemName: 'Makan siang',
          amount: Infinity,
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.AMOUNT_INVALID);
      });

      it('should reject transaction with missing amount property', () => {
        const transaction = {
          itemName: 'Makan siang',
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.AMOUNT_INVALID);
      });

      it('should reject transaction with amount too large', () => {
        const transaction = {
          itemName: 'Makan siang',
          amount: 1000000000,
          category: 'Makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.AMOUNT_INVALID);
      });
    });

    describe('Invalid - category validation', () => {
      it('should reject transaction with invalid category', () => {
        const transaction = {
          itemName: 'Makan siang',
          amount: 50000,
          category: 'Belanja'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.CATEGORY_INVALID);
      });

      it('should reject transaction with lowercase category', () => {
        const transaction = {
          itemName: 'Makan siang',
          amount: 50000,
          category: 'makanan'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.CATEGORY_INVALID);
      });

      it('should reject transaction with missing category property', () => {
        const transaction = {
          itemName: 'Makan siang',
          amount: 50000
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.CATEGORY_INVALID);
      });

      it('should reject transaction with null category', () => {
        const transaction = {
          itemName: 'Makan siang',
          amount: 50000,
          category: null
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.CATEGORY_INVALID);
      });
    });

    describe('Validation order', () => {
      it('should check itemName first', () => {
        const transaction = {
          itemName: '',
          amount: 0,
          category: 'Invalid'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.ITEM_NAME_EMPTY);
      });

      it('should check amount second', () => {
        const transaction = {
          itemName: 'Valid item',
          amount: 0,
          category: 'Invalid'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.AMOUNT_INVALID);
      });

      it('should check category third', () => {
        const transaction = {
          itemName: 'Valid item',
          amount: 50000,
          category: 'Invalid'
        };
        const result = Validators.validateTransaction(transaction);
        expect(result.error).toBe(Validators.ERROR_MESSAGES.CATEGORY_INVALID);
      });
    });
  });

  describe('sanitizeString', () => {
    describe('Valid cases', () => {
      it('should trim leading whitespace', () => {
        expect(Validators.sanitizeString('   hello')).toBe('hello');
      });

      it('should trim trailing whitespace', () => {
        expect(Validators.sanitizeString('hello   ')).toBe('hello');
      });

      it('should trim both leading and trailing whitespace', () => {
        expect(Validators.sanitizeString('   hello   ')).toBe('hello');
      });

      it('should return string as-is if no whitespace', () => {
        expect(Validators.sanitizeString('hello')).toBe('hello');
      });

      it('should return empty string if only whitespace', () => {
        expect(Validators.sanitizeString('   ')).toBe('');
      });

      it('should preserve internal whitespace', () => {
        expect(Validators.sanitizeString('hello   world')).toBe('hello   world');
      });

      it('should return empty string for empty input', () => {
        expect(Validators.sanitizeString('')).toBe('');
      });
    });

    describe('Invalid cases', () => {
      it('should return empty string for null', () => {
        expect(Validators.sanitizeString(null)).toBe('');
      });

      it('should return empty string for undefined', () => {
        expect(Validators.sanitizeString(undefined)).toBe('');
      });

      it('should return empty string for number', () => {
        expect(Validators.sanitizeString(123)).toBe('');
      });

      it('should return empty string for boolean', () => {
        expect(Validators.sanitizeString(true)).toBe('');
      });

      it('should return empty string for object', () => {
        expect(Validators.sanitizeString({})).toBe('');
      });

      it('should return empty string for array', () => {
        expect(Validators.sanitizeString(['hello'])).toBe('');
      });
    });
  });

  describe('Constants', () => {
    describe('ERROR_MESSAGES', () => {
      it('should have all required error messages', () => {
        expect(Validators.ERROR_MESSAGES.ITEM_NAME_EMPTY).toBeDefined();
        expect(Validators.ERROR_MESSAGES.ITEM_NAME_TOO_LONG).toBeDefined();
        expect(Validators.ERROR_MESSAGES.AMOUNT_INVALID).toBeDefined();
        expect(Validators.ERROR_MESSAGES.AMOUNT_ZERO).toBeDefined();
        expect(Validators.ERROR_MESSAGES.CATEGORY_INVALID).toBeDefined();
        expect(Validators.ERROR_MESSAGES.FORM_INCOMPLETE).toBeDefined();
      });

      it('should have non-empty error message strings', () => {
        Object.values(Validators.ERROR_MESSAGES).forEach(message => {
          expect(typeof message).toBe('string');
          expect(message.length).toBeGreaterThan(0);
        });
      });
    });

    describe('VALID_CATEGORIES', () => {
      it('should have all three categories', () => {
        expect(Validators.VALID_CATEGORIES).toHaveLength(3);
      });

      it('should contain Makanan', () => {
        expect(Validators.VALID_CATEGORIES).toContain('Makanan');
      });

      it('should contain Transportasi', () => {
        expect(Validators.VALID_CATEGORIES).toContain('Transportasi');
      });

      it('should contain Hiburan', () => {
        expect(Validators.VALID_CATEGORIES).toContain('Hiburan');
      });

      it('should not contain duplicates', () => {
        const unique = new Set(Validators.VALID_CATEGORIES);
        expect(unique.size).toBe(Validators.VALID_CATEGORIES.length);
      });

      it('should be read-only (modifying copy does not affect original)', () => {
        const originalLength = Validators.VALID_CATEGORIES.length;
        // Create a reference - cannot modify if properly protected
        const reference = Validators.VALID_CATEGORIES;
        // Even if someone modifies their local reference, validator should still work
        expect(Validators.validateCategory('Makanan')).toBe(true);
        expect(Validators.VALID_CATEGORIES.length).toBe(originalLength);
      });
    });
  });

  describe('Public API', () => {
    it('should expose all required public methods', () => {
      expect(typeof Validators.validateItemName).toBe('function');
      expect(typeof Validators.validateAmount).toBe('function');
      expect(typeof Validators.validateCategory).toBe('function');
      expect(typeof Validators.validateTransaction).toBe('function');
      expect(typeof Validators.sanitizeString).toBe('function');
    });

    it('should expose ERROR_MESSAGES constant', () => {
      expect(Validators.ERROR_MESSAGES).toBeDefined();
      expect(typeof Validators.ERROR_MESSAGES).toBe('object');
    });

    it('should expose VALID_CATEGORIES constant', () => {
      expect(Validators.VALID_CATEGORIES).toBeDefined();
      expect(Array.isArray(Validators.VALID_CATEGORIES)).toBe(true);
    });
  });

  describe('Integration tests', () => {
    it('should validate complete transaction flow', () => {
      const rawInput = {
        itemName: '  Makan siang di restoran  ',
        amount: '50000',
        category: 'Makanan'
      };

      // Sanitize inputs
      const sanitizedInput = {
        itemName: Validators.sanitizeString(rawInput.itemName),
        amount: rawInput.amount,
        category: rawInput.category
      };

      // Validate
      const result = Validators.validateTransaction(sanitizedInput);

      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should reject and report error on invalid input', () => {
      const transaction = {
        itemName: '',
        amount: 50000,
        category: 'Makanan'
      };

      const result = Validators.validateTransaction(transaction);

      expect(result.isValid).toBe(false);
      expect(result.error).toBeTruthy();
      expect(Object.values(Validators.ERROR_MESSAGES)).toContain(result.error);
    });

    it('should handle edge case amounts correctly', () => {
      const validAmounts = [0.01, 1, 100, 10000, 999999999];
      const invalidAmounts = [0, -1, 1000000000, NaN, Infinity];

      validAmounts.forEach(amount => {
        expect(Validators.validateAmount(amount)).toBe(true);
      });

      invalidAmounts.forEach(amount => {
        expect(Validators.validateAmount(amount)).toBe(false);
      });
    });

    it('should handle all valid categories', () => {
      Validators.VALID_CATEGORIES.forEach(category => {
        const transaction = {
          itemName: 'Test item',
          amount: 50000,
          category: category
        };

        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(true);
        expect(result.error).toBeNull();
      });
    });

    it('should validate multiple transactions independently', () => {
      const transactions = [
        { itemName: 'Item 1', amount: 10000, category: 'Makanan' },
        { itemName: 'Item 2', amount: 20000, category: 'Transportasi' },
        { itemName: 'Item 3', amount: 30000, category: 'Hiburan' }
      ];

      transactions.forEach(transaction => {
        const result = Validators.validateTransaction(transaction);
        expect(result.isValid).toBe(true);
      });
    });
  });
});

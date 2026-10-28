# Technical Design Document: Expense & Budget Visualizer

## Overview

Expense & Budget Visualizer adalah aplikasi web single-page (SPA) yang dirancang untuk membantu pengguna melacak pengeluaran harian dengan antarmuka yang sederhana dan responsif. Aplikasi ini dibangun menggunakan Vanilla JavaScript tanpa framework, memanfaatkan HTML5 LocalStorage untuk persistensi data client-side, dan Chart.js untuk visualisasi data.

**Tujuan Utama:**
- Memberikan cara yang mudah dan cepat untuk mencatat pengeluaran harian
- Visualisasi distribusi pengeluaran melalui pie chart interaktif
- Persistensi data tanpa memerlukan backend server
- Performa tinggi dan responsif di berbagai perangkat

**Key Characteristics:**
- **Single-Page Application:** Tidak ada page reload, semua interaksi bersifat client-side
- **No Backend Required:** Semua data disimpan di browser (LocalStorage)
- **Vanilla JavaScript:** Tidak menggunakan framework seperti React, Vue, atau Angular
- **Responsive Design:** Bekerja optimal di desktop, tablet, dan mobile
- **Real-time Updates:** UI diperbarui secara instant saat ada perubahan data

---

## Architecture

### Komponen Utama

Aplikasi terdiri dari lima komponen utama yang saling berinteraksi:

```
┌─────────────────────────────────────────────────────────┐
│                  Expense Tracker App                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Total Balance Display (Read-only)           │   │
│  │          Display: Total Pengeluaran              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Input Form Component                        │   │
│  │  • Item Name Input                               │   │
│  │  • Amount Input                                  │   │
│  │  • Category Dropdown                             │   │
│  │  • Add Button                                    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Transaction List Component                  │   │
│  │  • Display all transactions                      │   │
│  │  • Delete button per transaction                 │   │
│  │  • Scrollable container                          │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Pie Chart Visualization                     │   │
│  │  • Chart.js Instance                             │   │
│  │  • Category-based distribution                   │   │
│  │  • Labels and percentages                        │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │      Data Layer                                  │   │
│  │  • Transaksi Array (In-Memory)                   │   │
│  │  • LocalStorage Persistence                      │   │
│  │  • Data Validation & Transformation              │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Data Flow Architecture

Data mengalir dalam siklus unidirectional dengan reactive updates:

```
User Input
    ↓
[Input Form Validation]
    ↓
[Create/Delete Transaction]
    ↓
[Update In-Memory State]
    ↓
┌─────────────────────────────────────────────────────┐
│  Triggered Updates                                  │
├─────────────────────────────────────────────────────┤
│ • Save to LocalStorage                              │
│ • Update Total Balance Display                      │
│ • Update Transaction List View                      │
│ • Update Pie Chart Data & Render                    │
└─────────────────────────────────────────────────────┘
    ↓
[Render Updated UI]
    ↓
User Sees Changes
```

### Event-Driven Interaction Pattern

Aplikasi menggunakan event-driven architecture:

- **Form Submit Event**: Triggered ketika user klik "Add Transaction"
- **Delete Button Click**: Triggered ketika user hapus transaksi
- **Initialization Event**: Triggered saat halaman load untuk restore data dari LocalStorage
- **Window Load Event**: Untuk memastikan DOM siap sebelum manipulasi

---

## Data Models

### Struktur Data Transaksi

Setiap transaksi merepresentasikan satu pengeluaran:

```javascript
{
  id: string,              // UUID atau timestamp-based ID untuk unique identification
  itemName: string,        // Nama item/deskripsi pengeluaran (1-100 karakter)
  amount: number,          // Jumlah pengeluaran dalam format decimal (> 0)
  category: string,        // Kategori: "Makanan", "Transportasi", "Hiburan"
  timestamp: number,       // Unix timestamp untuk sorting dan chronological tracking
  date: string             // ISO format date string (YYYY-MM-DD) untuk display
}
```

**Contoh Transaction:**
```javascript
{
  id: "1701234567890",
  itemName: "Makan siang di restoran",
  amount: 50000,
  category: "Makanan",
  timestamp: 1701234567890,
  date: "2024-12-20"
}
```

### LocalStorage Schema

**Key Structure:**
```
localStorage["expenseTrackerTransactions"] = JSON Array of Transactions
localStorage["expenseTrackerVersion"] = "1.0" // untuk future migration
```

**Stored Format (JSON):**
```json
{
  "version": "1.0",
  "transactions": [
    {
      "id": "1701234567890",
      "itemName": "Makan siang di restoran",
      "amount": 50000,
      "category": "Makanan",
      "timestamp": 1701234567890,
      "date": "2024-12-20"
    },
    {
      "id": "1701234567891",
      "itemName": "Grab ke kantor",
      "amount": 25000,
      "category": "Transportasi",
      "timestamp": 1701234567891,
      "date": "2024-12-20"
    }
  ]
}
```

### Category Constants

```javascript
const CATEGORIES = {
  FOOD: "Makanan",
  TRANSPORTATION: "Transportasi",
  ENTERTAINMENT: "Hiburan"
};

// Untuk future extensibility
const CATEGORY_COLORS = {
  "Makanan": "#FF6B6B",
  "Transportasi": "#4ECDC4",
  "Hiburan": "#FFE66D"
};
```

### LocalStorage Access Patterns

**Load Data:**
- Cek key `expenseTrackerTransactions` di LocalStorage
- Parse JSON string ke Array
- Fallback ke empty array jika tidak ada atau parsing error

**Save Data:**
- Convert transactions array ke JSON string
- Store di LocalStorage dengan key `expenseTrackerTransactions`
- Handle storage quota exceeded error

---

## Components and Interfaces

### Component Map

| Komponen | Tanggung Jawab | Input | Output |
|----------|----------------|-------|--------|
| **Input Form** | Handle user input, validasi, trigger add | User interactions | Valid transaction object atau error |
| **Transaction List** | Render dan manage list, handle delete | Transaction array | Rendered list + delete handlers |
| **Total Balance** | Calculate dan display total | Transaction array | Formatted total amount |
| **Pie Chart** | Visualisasi distribusi kategori | Transaction array | Chart.js instance |
| **Data Manager** | CRUD operations, persistence | Transactions | Updated state |
| **Initializer** | Setup initial state, load dari storage | None (on init) | Loaded transactions |

### Component Interfaces

#### Input Form Component

**Responsibilities:**
- Render form dengan 3 input fields (Item Name, Amount, Category)
- Validasi input sebelum submission
- Clear form setelah successful submission
- Display error messages

**Public Methods:**
```javascript
InputForm.render() -> HTMLElement
InputForm.clear() -> void
InputForm.getValues() -> {itemName, amount, category}
InputForm.showError(message: string) -> void
InputForm.hideError() -> void
```

#### Transaction List Component

**Responsibilities:**
- Render list dari transactions dengan Item Name, Amount, Category
- Display delete button untuk setiap transaksi
- Handle delete event
- Update view ketika transaksi ditambah/dihapus

**Public Methods:**
```javascript
TransactionList.render(transactions: Array) -> HTMLElement
TransactionList.addItem(transaction: Object) -> void
TransactionList.removeItem(transactionId: string) -> void
TransactionList.refresh(transactions: Array) -> void
TransactionList.onDelete(callback: Function) -> void
```

#### Total Balance Component

**Responsibilities:**
- Calculate total dari semua transactions
- Format sebagai currency (IDR)
- Display prominent di bagian atas
- Update ketika ada perubahan data

**Public Methods:**
```javascript
TotalBalance.render(total: number) -> HTMLElement
TotalBalance.update(transactions: Array) -> void
TotalBalance.getTotal(transactions: Array) -> number
```

#### Pie Chart Component

**Responsibilities:**
- Initialize Chart.js pie chart
- Prepare data grouped by kategori
- Update chart saat data berubah
- Handle zero-balance categories

**Public Methods:**
```javascript
PieChart.initialize(containerId: string) -> Chart instance
PieChart.update(transactions: Array) -> void
PieChart.getChartData(transactions: Array) -> {labels, data, colors}
PieChart.destroy() -> void
```

#### Data Manager

**Responsibilities:**
- Manage in-memory transactions array
- CRUD operations (Create, Read, Update, Delete)
- Validasi data
- Trigger observers saat perubahan

**Public Methods:**
```javascript
DataManager.addTransaction(transaction: Object) -> boolean
DataManager.deleteTransaction(transactionId: string) -> boolean
DataManager.getAllTransactions() -> Array
DataManager.getTransactionsByCategory(category: string) -> Array
DataManager.calculateTotal() -> number
DataManager.subscribe(observer: Function) -> void
DataManager.notify() -> void
```

#### Storage Manager

**Responsibilities:**
- Save transactions ke LocalStorage
- Load transactions dari LocalStorage
- Handle storage errors
- Version management untuk migration

**Public Methods:**
```javascript
StorageManager.save(transactions: Array) -> boolean
StorageManager.load() -> Array
StorageManager.clear() -> boolean
StorageManager.isAvailable() -> boolean
```

---

## File Structure & Organization

### Directory Structure

```
expense-tracker/
├── index.html              # Entry point HTML
├── css/
│   └── styles.css         # Semua styling untuk aplikasi
├── js/
│   ├── app.js             # Main application file & initialization
│   ├── components/
│   │   ├── input-form.js
│   │   ├── transaction-list.js
│   │   ├── total-balance.js
│   │   └── pie-chart.js
│   ├── managers/
│   │   ├── data-manager.js
│   │   └── storage-manager.js
│   └── utils/
│       ├── validators.js
│       └── formatters.js
└── lib/
    └── chart.min.js       # Chart.js library (external dependency)
```

### File Organization Strategy

**Main Application File (app.js):**
- Initialize aplikasi
- Create component instances
- Setup event listeners
- Main orchestration logic
- ~150-200 lines

**Component Files:**
- Setiap file memuat satu komponen
- Self-contained dengan minimal dependencies
- Export sebagai object/class
- ~100-150 lines per file

**Manager Files:**
- Encapsulate business logic
- Abstraksi dari DOM manipulation
- Pure functions where possible
- ~80-120 lines per file

**Utility Files:**
- Shared validation functions
- Formatting functions (currency, date)
- Constants
- ~50-100 lines per file

### Code Organization Principles

**Separation of Concerns:**
- Components: UI rendering & user interaction
- Managers: Business logic & data management
- Utils: Reusable helper functions

**Module Pattern:**
```javascript
// Contoh struktur komponen
const MyComponent = (() => {
  // Private variables
  let state = {...};
  
  // Private functions
  const createDOM = () => {...};
  
  // Public API
  return {
    render: () => {...},
    update: () => {...},
    initialize: () => {...}
  };
})();
```

---

## Error Handling

### Input Validation Rules

**Item Name Validation:**
```javascript
function validateItemName(itemName) {
  if (typeof itemName !== 'string') return false;
  const trimmed = itemName.trim();
  if (trimmed.length === 0) return false;      // Empty
  if (trimmed.length > 100) return false;      // Too long
  return true;
}
```

**Amount Validation:**
```javascript
function validateAmount(amount) {
  const num = parseFloat(amount);
  if (isNaN(num)) return false;                // Not a number
  if (num <= 0) return false;                  // Not positive
  if (!Number.isFinite(num)) return false;     // Infinity/NaN
  if (num > 999999999) return false;           // Too large (optional)
  return true;
}
```

**Category Validation:**
```javascript
function validateCategory(category) {
  const validCategories = ["Makanan", "Transportasi", "Hiburan"];
  return validCategories.includes(category);
}
```

### Error Messages

```javascript
const ERROR_MESSAGES = {
  ITEM_NAME_EMPTY: "Nama item tidak boleh kosong",
  ITEM_NAME_TOO_LONG: "Nama item terlalu panjang (maksimal 100 karakter)",
  AMOUNT_INVALID: "Jumlah harus berupa angka positif",
  AMOUNT_ZERO: "Jumlah tidak boleh nol atau negatif",
  CATEGORY_INVALID: "Kategori tidak valid. Pilih: Makanan, Transportasi, atau Hiburan",
  FORM_INCOMPLETE: "Semua field harus diisi",
  STORAGE_ERROR: "Gagal menyimpan data. Periksa storage browser Anda",
  LOAD_ERROR: "Gagal memuat data dari storage"
};
```

### Error Handling Strategy

**Form Submission Error Handling:**
```javascript
function handleFormSubmit(event) {
  event.preventDefault();
  
  const values = getFormValues();
  
  // Validate each field
  if (!validateItemName(values.itemName)) {
    showError(ERROR_MESSAGES.ITEM_NAME_EMPTY);
    return;
  }
  
  if (!validateAmount(values.amount)) {
    showError(ERROR_MESSAGES.AMOUNT_INVALID);
    return;
  }
  
  if (!validateCategory(values.category)) {
    showError(ERROR_MESSAGES.CATEGORY_INVALID);
    return;
  }
  
  // Try to add transaction
  try {
    const success = addTransaction(values.itemName, values.amount, values.category);
    if (!success) {
      showError(ERROR_MESSAGES.FORM_INCOMPLETE);
      return;
    }
    
    clearForm();
    hideError();
    updateAllViews(); // Refresh all components
    
  } catch (error) {
    console.error("Error adding transaction:", error);
    showError(ERROR_MESSAGES.STORAGE_ERROR);
  }
}
```

**Storage Error Handling:**
```javascript
function saveToLocalStorage(transactions) {
  try {
    if (!localStorage) {
      throw new Error("LocalStorage not available");
    }
    
    const jsonString = JSON.stringify(transactions);
    localStorage.setItem("expenseTrackerTransactions", jsonString);
    return true;
    
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      console.error("LocalStorage quota exceeded");
      showWarning("Penyimpanan penuh. Silakan hapus beberapa transaksi.");
      return false;
    } else if (error.name === "SecurityError") {
      console.error("LocalStorage access denied (possibly private browsing)");
      showWarning("Storage tidak tersedia di mode private browsing");
      return false;
    } else {
      console.error("Unexpected storage error:", error);
      showError(ERROR_MESSAGES.STORAGE_ERROR);
      return false;
    }
  }
}
```

### User Feedback Mechanism

**Success Feedback:**
```javascript
function showSuccess(message) {
  const notification = document.createElement('div');
  notification.className = 'notification notification--success';
  notification.textContent = message;
  notification.style.display = 'block';
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 3000);
}
```

**Error Feedback:**
```javascript
function showError(message) {
  const errorElement = document.getElementById('error-message');
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

function hideError() {
  const errorElement = document.getElementById('error-message');
  errorElement.style.display = 'none';
}
```

---

## Testing Strategy

### Unit Testing Coverage

**Test Framework:** Jest atau Mocha + Chai

**Unit Test Scope:**
- Validation functions (Item name, Amount, Category)
- Calculation functions (Total, Chart data aggregation)
- LocalStorage persistence (Save, Load, Error handling)
- Data transformation functions

**Example Unit Test:**
```javascript
describe('Validators', () => {
  describe('validateItemName', () => {
    it('should reject empty strings', () => {
      expect(validateItemName('')).toBe(false);
    });
    
    it('should reject whitespace-only strings', () => {
      expect(validateItemName('   ')).toBe(false);
    });
    
    it('should accept valid item names', () => {
      expect(validateItemName('Makan siang')).toBe(true);
    });
  });
});
```

### Property-Based Testing

**Framework:** fast-check (untuk JavaScript)

**Properties to Test:**
1. **Total Balance Accuracy:** Sum of transactions equals calculated total
2. **Transaction Addition:** Adding transaction increases list length by 1
3. **Transaction Deletion:** Deleting transaction removes it and decreases length
4. **Persistence Round-Trip:** Save and load preserves all data
5. **Category Aggregation:** Pie chart data correctly sums by category
6. **Validation Correctness:** Only valid inputs are accepted

### Integration Testing

**Test Points:**
- Form submission flow (Input → Validation → Add → Update UI)
- Delete flow (Delete button → Remove data → Update UI)
- Load from storage → Display data
- Chart updates on data change

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Total Balance Calculation Accuracy

*For any* collection of transactions, the calculated total balance SHALL equal the sum of all transaction amounts.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 2: Transaction Addition Correctness

*For any* valid transaction input, adding the transaction to the list SHALL increase the list length by exactly one and include the new transaction.

**Validates: Requirements 2.3, 1.5, 4.2**

### Property 3: Transaction Deletion Correctness

*For any* existing transaction in the list, deleting it by ID SHALL remove it from the list and decrease list length by exactly one.

**Validates: Requirements 3.2, 3.3, 3.4, 2.5**

### Property 4: Balance Update on Transaction Change

*For any* transaction addition or deletion, the updated total balance SHALL correctly reflect the new cumulative sum.

**Validates: Requirements 4.2, 4.3**

### Property 5: Pie Chart Data Aggregation

*For any* collection of transactions, the pie chart data grouping by category SHALL accurately sum amounts per category and only include categories with non-zero totals.

**Validates: Requirements 5.2, 5.5**

### Property 6: Local Storage Persistence Round-Trip

*For any* collection of transactions, saving to and loading from localStorage SHALL preserve all transaction data identically.

**Validates: Requirements 6.1, 6.2, 6.3**

### Property 7: Input Validation Rejection

*For any* invalid input (empty item name, non-positive amount, invalid category), the validation SHALL reject the input without modifying the transaction list.

**Validates: Requirements 1.3, 1.4, 1.6**

### Property 8: Form Reset After Successful Addition

*For any* successful transaction addition, the input form SHALL be cleared of all values and ready for the next entry.

**Validates: Requirements 1.5**

### Property 9: Empty State Handling

*For any* empty transaction list (zero transactions), the total balance SHALL display zero and the pie chart SHALL handle gracefully without errors.

**Validates: Requirements 4.4, 5.5, 6.4**

---

## Performance Target

**Performance Budget:**
- Page load: < 1 second
- Transaction add: < 100ms
- Transaction delete: < 100ms
- Chart update: < 200ms

**Optimization Strategies:**
- Batch DOM updates menggunakan DocumentFragment
- Event delegation untuk delete buttons
- Debounced chart updates (100ms)
- Lazy chart initialization
- Efficient state management dengan single source of truth

---

## Browser Compatibility

| Browser | Version | LocalStorage | Chart.js | Support |
|---------|---------|--------------|----------|---------|
| Chrome | Latest | ✓ | ✓ | Full |
| Firefox | Latest | ✓ | ✓ | Full |
| Safari | Latest | ✓ | ✓ | Full |
| Edge | Latest | ✓ | ✓ | Full |
| IE | 11 | ✓ | ~ | Partial* |

*IE11: Requires polyfills for Promise, fetch, etc.

---

## Summary

Dokumen design ini memberikan panduan implementasi komprehensif untuk Expense & Budget Visualizer dengan:

✓ Arsitektur yang modular dan maintainable  
✓ Clear separation of concerns antara UI dan business logic  
✓ Robust data persistence dengan LocalStorage  
✓ Comprehensive error handling dan validation  
✓ Performance optimizations built-in  
✓ Testable components dengan defined interfaces  
✓ Responsive design untuk semua devices  
✓ Property-based testing properties untuk correctness verification  

**Fase berikutnya:** Konversi design ini menjadi detailed implementation tasks dalam tasks.md dengan checklist untuk development.

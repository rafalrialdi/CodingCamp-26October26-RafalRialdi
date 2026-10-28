# Implementation Plan: Expense & Budget Visualizer

## Overview

Rencana implementasi aplikasi Expense & Budget Visualizer menggunakan Vanilla JavaScript. Aplikasi ini akan dibangun secara modular dengan separasi yang jelas antara UI components, business logic, dan data persistence layer. Semua 9 correctness properties dari design document akan diverifikasi melalui unit tests dan property-based tests menggunakan fast-check library.

**Strategi Implementasi:**
1. Setup infrastruktur dan struktur file HTML/CSS dasar
2. Implementasi data layer (managers untuk data dan storage)
3. Implementasi UI components secara incremental
4. Integration dan event handling
5. Testing komprehensif (unit + property-based)
6. Optimization dan polish

**Tech Stack:**
- Vanilla JavaScript (ES6+)
- HTML5 Semantics
- CSS3 Responsive Design
- LocalStorage API
- Chart.js untuk visualisasi
- fast-check untuk property-based testing
- Jest untuk unit testing

---

## Tasks

### 1. Setup & Infrastructure

- [x] 1.1 Buat struktur project dan setup HTML template
  - Directory: `css/`, `js/`, `js/components/`, `js/managers/`, `js/utils/`, `lib/`
  - File: `index.html` dengan semantic HTML5 structure
  - CDN links untuk Chart.js dan testing libraries
  - Meta tags untuk responsive design
  - _Requirements: 9.1, 9.2, 7.1_

- [x] 1.2 Setup file CSS dengan responsive design baseline
  - CSS reset/normalize
  - Base typography (font-family, sizes, line-height)
  - Color variables untuk categories (Makanan #FF6B6B, Transportasi #4ECDC4, Hiburan #FFE66D)
  - Responsive grid system (mobile, tablet, desktop breakpoints)
  - Utility classes untuk layout, spacing, visibility
  - _Requirements: 7.1, 7.2, 7.3, 10.3, 10.4_

- [x] 1.3 Setup Chart.js library dan container
  - Chart.js v3+ di `lib/chart.min.js` atau via CDN
  - `<canvas id="expenseChart">` element di HTML
  - CSS styling untuk chart container (responsive size)
  - Chart.js plugin imports jika diperlukan
  - _Requirements: 5.1, 5.3_

### 2. Core Components Implementation

- [x] 2.1 Implementasi Input Form Component
  - File: `js/components/input-form.js`
  - HTML form dengan input fields dan dropdown
  - CSS styling untuk form elements
  - Module pattern dengan public methods: `render()`, `clear()`, `getValues()`, `showError()`, `hideError()`
  - _Requirements: 1.1, 1.2, 1.3, 1.5, 10.1, 10.2_

- [x] 2.2 Implementasi Transaction List Component
  - File: `js/components/transaction-list.js`
  - HTML structure untuk list (gunakan `<ul>` atau `<div>` dengan semantic markup)
  - CSS styling untuk list items dan delete buttons
  - Module pattern dengan methods: `render()`, `addItem()`, `removeItem()`, `refresh()`, `onDelete()`
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2_

- [x] 2.3 Implementasi Total Balance Component
  - File: `js/components/total-balance.js`
  - HTML element untuk total display (besar dan prominent)
  - CSS styling untuk header section
  - Module pattern dengan methods: `render()`, `update()`, `getTotal()`
  - Currency formatting function (IDR format)
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 2.4 Implementasi Pie Chart Component
  - File: `js/components/pie-chart.js`
  - Chart.js configuration untuk pie chart
  - Data aggregation logic grouped by kategori
  - Module pattern dengan methods: `initialize()`, `update()`, `getChartData()`, `destroy()`
  - Color mapping untuk kategori (dari design constants)
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 2.5 Implementasi Data Manager
  - File: `js/managers/data-manager.js`
  - In-memory transactions array management
  - Public methods: `addTransaction()`, `deleteTransaction()`, `getAllTransactions()`, `getTransactionsByCategory()`, `calculateTotal()`, `subscribe()`, `notify()`
  - Transaction ID generation (timestamp-based)
  - Validation sebelum add/delete
  - Observer pattern untuk notify subscribers saat data berubah
  - _Requirements: 1.4, 1.5, 2.3, 3.2, 3.3_

- [ ] 2.6 Implementasi Storage Manager
  - File: `js/managers/storage-manager.js`
  - LocalStorage schema (version 1.0)
  - Public methods: `save()`, `load()`, `clear()`, `isAvailable()`
  - JSON serialization/deserialization
  - Error handling untuk quota exceeded, security errors
  - Version migration readiness
  - _Requirements: 6.1, 6.2, 6.3, 6.4_

### 3. Utility & Helper Functions

- [ ] 3.1 Implementasi validation functions
  - File: `js/utils/validators.js`
  - Functions: `validateItemName()`, `validateAmount()`, `validateCategory()`, `validateTransaction()`
  - Error message constants
  - Input sanitization (trim whitespace)
  - _Requirements: 1.3, 1.4, 1.6_

- [ ] 3.2 Implementasi formatting functions
  - File: `js/utils/formatters.js`
  - Functions: `formatCurrency()`, `formatDate()`, `formatNumber()`, `formatPercentage()`
  - Menggunakan Intl API untuk locale-aware formatting
  - _Requirements: 4.1, 5.4_

### 4. Integration & App Orchestration

- [ ] 4.1 Implementasi app initialization dan lifecycle
  - File: `js/app.js`
  - Component instances initialization
  - Event listener setup (form submit, delete buttons, window load)
  - Observer subscription untuk data changes
  - Initialization flow: load from storage → render components → setup listeners
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1_

- [ ] 4.2 Implementasi form submission dan transaction addition flow
  - Form submit event handler
  - Validation error display logic
  - Component update orchestration
  - Storage save call
  - Form reset setelah successful submission
  - _Requirements: 1.3, 1.4, 1.5, 2.3, 4.2, 5.2, 6.1_

- [ ] 4.3 Implementasi transaction deletion flow
  - Delete button event delegation
  - Transaction deletion dari data layer
  - Component update orchestration (list, total, chart)
  - Storage save call
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 2.5_

### 5. Error Handling & User Feedback

- [ ] 5.1 Implementasi error handling dan user notification system
  - Error display container (alert/notification component)
  - Error message constants sesuai design
  - Error handling di all touch points (form, storage, chart init)
  - Success feedback mechanism
  - Timeout mechanism untuk auto-dismiss notifications
  - _Requirements: 1.4, 5.1, 6.1, 10.1_

### 6. Testing Implementation

- [ ] 6.1 Implementasi unit tests untuk validators dan formatters
  - Jest configuration (jest.config.js)
  - Test files: `js/utils/validators.test.js`, `js/utils/formatters.test.js`
  - Test coverage minimum 90% untuk utils
  - Test cases untuk semua validators (valid/invalid inputs)
  - Test cases untuk semua formatters (various inputs)
  - _Requirements: 1.3, 1.4, 1.6, 4.1, 5.1_

- [ ] 6.2 Implementasi unit tests untuk data manager dan storage manager
  - Test files: `js/managers/data-manager.test.js`, `js/managers/storage-manager.test.js`
  - Mock localStorage jika diperlukan
  - Test coverage minimum 85% untuk managers
  - Test cases untuk semua public methods
  - _Requirements: 2.3, 3.2, 3.3, 4.2, 4.3, 5.2, 5.5, 6.1, 6.2, 6.3, 6.4_

- [ ] 6.3 Implementasi property-based tests menggunakan fast-check
  - File: `js/__tests__/properties.test.js`
  - Property test cases untuk semua 9 properties dari design.md
  - fast-check setup dan Arbitraries untuk transaction generation
  - Shrinking strategy untuk minimal failing examples
  - **Property 1: Total Balance Accuracy** - verify sum equals calculated total
  - **Property 2: Transaction Addition** - adding transaction increases length by 1
  - **Property 3: Transaction Deletion** - deleting removes item and decreases length
  - **Property 4: Balance Update** - balance reflects changes after add/delete
  - **Property 5: Pie Chart Aggregation** - chart data sums correctly by category
  - **Property 6: LocalStorage Round-Trip** - save/load preserves all data
  - **Property 7: Input Validation Rejection** - invalid inputs don't modify list
  - **Property 8: Form Reset** - form cleared after successful add
  - **Property 9: Empty State Handling** - zero balance and empty chart graceful
  - _Requirements: 1.3, 1.4, 1.5, 1.6, 2.3, 3.2, 3.3, 3.4, 4.2, 4.3, 5.2, 5.5, 6.1, 6.2, 6.3, 6.4_

- [ ] 6.4 Implementasi integration tests untuk end-to-end flows
  - File: `js/__tests__/integration.test.js`
  - E2E flow tests: add transaction → update all components → verify storage
  - E2E flow tests: delete transaction → update all components → verify storage
  - Multiple transaction scenarios dan category distribution
  - LocalStorage mock dan cleanup antara tests
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 6.2, 6.3_

### 7. Performance Optimization & Polish

- [ ] 7.1 Implementasi performance optimizations
  - Batch DOM updates menggunakan DocumentFragment
  - Debounce mechanism untuk chart updates (100ms)
  - Event delegation untuk delete buttons (single listener untuk multiple items)
  - Lazy initialization untuk chart (init saat pertama kali ada data)
  - CSS optimization (critical CSS, remove unused rules)
  - _Requirements: 11.1, 11.2, 11.3, 11.4_

- [ ] 7.2 Test responsive design dan browser compatibility
  - Manual testing checklist untuk mobile (320px), tablet (768px), desktop (1024px+)
  - Browser testing di Chrome, Firefox, Edge, Safari (latest versions)
  - Accessibility testing (keyboard navigation, screen reader compatibility)
  - No console errors atau warnings pada runtime
  - Screenshot comparisons untuk visual regression testing
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3_

### 8. Final Checkpoint & Documentation

- [ ] 8.1 Final checkpoint - Ensure all tests pass dan app fully functional
  - All unit tests passing
  - All property-based tests passing
  - All integration tests passing
  - No console errors atau warnings
  - App fully functional sesuai requirements
  - Documentation complete (code comments, README)
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 5.1, 6.1, 7.1, 8.1, 9.1, 9.2, 9.3, 10.1, 11.1, 12.1, 12.2, 12.3_

- [ ] 8.2 Code documentation dan README
  - JSDoc comments untuk semua public methods dan functions
  - README.md dengan installation, usage, features overview
  - API documentation untuk semua components dan managers
  - Testing documentation (how to run tests)
  - Browser compatibility notes
  - Known limitations dan future improvements list
  - _Requirements: 9.1, 9.3_

---

## Task Dependency Graph

```json
{
  "waves": [
    {
      "id": 0,
      "tasks": ["1.1", "1.2", "1.3"],
      "description": "Setup infrastructure dan template HTML/CSS/Chart.js"
    },
    {
      "id": 1,
      "tasks": ["2.1", "2.2", "2.3", "2.4", "2.5", "2.6", "3.1", "3.2"],
      "description": "Implementasi semua components, managers, dan utils"
    },
    {
      "id": 2,
      "tasks": ["4.1"],
      "description": "App initialization dan orchestration"
    },
    {
      "id": 3,
      "tasks": ["4.2", "4.3", "5.1"],
      "description": "Event handling, flows, dan error management"
    },
    {
      "id": 4,
      "tasks": ["6.1", "6.2"],
      "description": "Unit tests untuk utils dan managers"
    },
    {
      "id": 5,
      "tasks": ["6.3"],
      "description": "Property-based tests untuk 9 correctness properties"
    },
    {
      "id": 6,
      "tasks": ["6.4"],
      "description": "Integration tests untuk end-to-end flows"
    },
    {
      "id": 7,
      "tasks": ["7.1", "7.2"],
      "description": "Performance optimization dan responsive design testing"
    },
    {
      "id": 8,
      "tasks": ["8.1", "8.2"],
      "description": "Final checkpoint dan documentation"
    }
  ]
}
```

---

## Notes

### Code Organization Guidelines

```javascript
// Module Pattern untuk Components
const MyComponent = (() => {
  // Private state
  let $container = null;
  let state = {};
  
  // Private functions
  const createDOM = () => {
    // DOM creation logic
  };
  
  const attachListeners = () => {
    // Event attachment
  };
  
  // Public API
  return {
    render: () => { /* ... */ },
    update: () => { /* ... */ },
    destroy: () => { /* ... */ }
  };
})();
```

### Performance Considerations

1. **Batch DOM Updates**: Gunakan `DocumentFragment` untuk multiple insertions
   ```javascript
   const fragment = document.createDocumentFragment();
   transactions.forEach(tx => {
     fragment.appendChild(createItemElement(tx));
   });
   container.appendChild(fragment);
   ```

2. **Debounce Chart Updates**: Chart.js rendering expensive
   ```javascript
   const updateChartDebounced = debounce(() => {
     chart.update();
   }, 100);
   ```

3. **Event Delegation**: Untuk delete buttons dalam list
   ```javascript
   container.addEventListener('click', (e) => {
     if (e.target.matches('.delete-btn')) {
       // Handle delete
     }
   });
   ```

### Browser Compatibility

- **LocalStorage:** Supported di semua modern browsers. Fallback: In-memory only
- **Chart.js:** v3+ compatible dengan semua target browsers
- **Intl API:** Untuk currency formatting, fallback ke manual formatting
- **ES6 Features:** Gunakan transpiler jika IE11 support required

### Testing Best Practices

1. **Test Data Setup**: Buat factory functions untuk test data
   ```javascript
   function createMockTransaction(overrides = {}) {
     return {
       id: '123',
       itemName: 'Test Item',
       amount: 50000,
       category: 'Makanan',
       ...overrides
     };
   }
   ```

2. **Isolation:** Mock localStorage di unit tests
   ```javascript
   beforeEach(() => {
     localStorage.clear();
     jest.clearAllMocks();
   });
   ```

3. **Property Test Shrinking:** fast-check automatically shrinks, tapi help dengan readable output
   ```javascript
   .prop([fc.array(transactionArbitrary)])
   .onFailure(([failing]) => {
     console.log('Failing example:', JSON.stringify(failing, null, 2));
   });
   ```

### Accessibility Checklist

- [ ] All form inputs punya associated labels
- [ ] Keyboard navigation working (Tab, Enter, Escape)
- [ ] ARIA attributes set where needed (aria-label, aria-required, aria-live)
- [ ] Color tidak satu-satunya info differentiation (use icons/text)
- [ ] 4.5:1 contrast ratio untuk text
- [ ] Touch targets ≥44px untuk mobile

### Responsive Design Breakpoints

```css
/* Mobile-first approach */
/* Default: 320px - 767px */

@media (min-width: 768px) {
  /* Tablet: 768px - 1023px */
}

@media (min-width: 1024px) {
  /* Desktop: 1024px+ */
}
```

### Key Development Steps

1. **Setup Development Environment:**
   ```bash
   npm init -y
   npm install --save-dev jest fast-check
   npm install chart.js
   ```

2. **Create npm scripts:**
   ```json
   {
     "scripts": {
       "test": "jest",
       "dev": "http-server",
       "build": "echo 'No build needed for vanilla JS'",
       "test:watch": "jest --watch"
     }
   }
   ```

3. **Development Workflow:**
   - Open `index.html` di live server (http-server atau VS Code Live Server)
   - Make changes di `.js` dan `.css` files
   - Refresh browser untuk melihat changes
   - Run tests dengan `npm test`

### Success Criteria untuk Completion

Aplikasi dianggap **COMPLETE** ketika:

1. ✅ Semua 8 tasks di waves 0-3 selesai dan tested
2. ✅ Semua 9 correctness properties terverifikasi melalui property-based tests
3. ✅ Test coverage ≥80% overall, ≥90% untuk utils
4. ✅ All acceptance criteria dari requirements.md terpenuhi
5. ✅ App responsif di mobile/tablet/desktop tanpa layout issues
6. ✅ No console errors atau warnings pada runtime
7. ✅ LocalStorage persistence working correctly
8. ✅ Chart visualization displaying data accurately
9. ✅ Code organized sesuai design specifications
10. ✅ Documentation complete dan code well-commented

### Optional Features Summary

Jika user memilih optional features, estimasi effort:

- **Custom Categories:** 4-5 jam
- **Monthly Summary:** 3-4 jam
- **Sort Transactions:** 2-3 jam
- **Export Data:** 3-4 jam
- **Budget Limit Alert:** 5-6 jam

**Recommendation:** Prioritize berdasarkan user value dan implementation complexity.


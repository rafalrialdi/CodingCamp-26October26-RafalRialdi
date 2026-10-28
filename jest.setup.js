// Mock Chart.js library for testing
global.Chart = jest.fn(function(ctx, config) {
  this.ctx = ctx;
  this.config = config;
  this.data = config.data;
  
  this.destroy = jest.fn();
  this.update = jest.fn();
});

// Expose the application sources as globals (they are classic browser scripts).
global.Validators = require('./js/utils/validators.js');
global.Formatters = require('./js/utils/formatters.js');
global.DataManager = require('./js/managers/data-manager.js');
global.StorageManager = require('./js/managers/storage-manager.js');
global.InputForm = require('./js/components/input-form.js');
global.TransactionList = require('./js/components/transaction-list.js');
global.TotalBalance = require('./js/components/total-balance.js');
global.PieChart = require('./js/components/pie-chart.js');

// Setup DOM for testing
const canvas = document.createElement('canvas');
canvas.id = 'expenseChart';
canvas.getContext = jest.fn(() => ({
  clearRect: jest.fn(),
  fillRect: jest.fn(),
  strokeRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  stroke: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  fillText: jest.fn(),
  measureText: jest.fn(() => ({ width: 0 }))
}));

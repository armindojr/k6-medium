import { group } from 'k6';
import getProducts from './specs/getProducts.spec.js';
import getProductById from './specs/getProductById.spec.js';

function loadSettings() {
  // Import default settings
  let parsedSettings = JSON.parse(open(`./config/default.json`));

  // Define the default test type
  let testType = __ENV.testType ? __ENV.testType : 'spike';
  parsedSettings.env.testType = testType;

  return parsedSettings;
}

function filterTests(arr, filterValue) {
  let lowerFilterValue;

  if (filterValue.includes(',')) {
    let files = filterValue.split(',');
    lowerFilterValue = files.map(item => item.toLowerCase());
  } else {
    lowerFilterValue = filterValue.toLowerCase();
  }

  return arr.filter(testFunc => lowerFilterValue.includes(testFunc.name.toLowerCase()));
}

// Import default settings
const settings = loadSettings();

// Define the imported tests
let importedTests = [getProducts, getProductById];

// Define the array of tests to run
let testsToRun = [];

// Filter tests based on configurations or environment variables
// To filter tests: -e testFilters=true -e filterValue=testname
if (__ENV.testFilters && __ENV.filterValue) {
  testsToRun = filterTests(importedTests, __ENV.filterValue);
} else if (settings.testFilters.enabled && settings.testFilters.value !== 'default') {
  testsToRun = filterTests(importedTests, settings.testFilters.value);
} else {
  testsToRun = importedTests;
}

if (testsToRun.length === 0) {
  throw new Error('No test found!');
}

export const options = JSON.parse(open(`./testType/${settings.env.testType}.json`));

export function setup() {
  return settings;
}

export default function(data) {
  for (const test of testsToRun) {
    group(`${test.name}`, () => test(data));
  }
}

export function teardown() {}

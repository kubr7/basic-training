#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Running JavaScript Assignment Tests..."
echo "----------------------------------------"

# Create a temporary test file
cat > test.js << 'EOL'
// Test cases for JavaScript Assignment

// Import the functions from the main file
const { secondLargest, calculateFrequency, flatten, unflatten } = require('./javascript-assignment.js');

// Test secondLargest
console.log("\nTesting secondLargest function:");
const test1 = [5, 2, 8, 1, 9];
console.log("Input:", test1);
console.log("Output:", secondLargest(test1));

// Test calculateFrequency
console.log("\nTesting calculateFrequency function:");
const test2 = "hello";
console.log("Input:", test2);
console.log("Output:", JSON.stringify(calculateFrequency(test2), null, 2));

// Test flatten
console.log("\nTesting flatten function:");
const test3 = {
    a: 1,
    b: {
        c: 2,
        d: {
            e: 3
        }
    }
};
console.log("Input:", JSON.stringify(test3, null, 2));
console.log("Output:", JSON.stringify(flatten(test3), null, 2));

// Test unflatten
console.log("\nTesting unflatten function:");
const test4 = {
    'a': 1,
    'b.c': 2,
    'b.d.e': 3
};
console.log("Input:", JSON.stringify(test4, null, 2));
console.log("Output:", JSON.stringify(unflatten(test4), null, 2));
EOL

# Run the tests
echo -e "${GREEN}Running tests...${NC}"
node test.js

# Clean up
rm test.js

echo -e "\n${GREEN}Tests completed!${NC}"

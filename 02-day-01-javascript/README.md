**Branch:** `02-assignment-javascript`
**File:** `Basic_Training_Day_1_JavaScript_Assignment.sh`


# JavaScript Assignment

This assignment contains four JavaScript problems that test different aspects of array manipulation, string processing, and object handling.

## Problems

### 1. Second Largest Number
The `secondLargest` function finds the second biggest number in an array without using the sort method.

```javascript
const numbers = [5, 2, 8, 1, 9];
console.log(secondLargest(numbers)); // Output: 8
```

### 2. Character Frequency Counter
The `calculateFrequency` function counts the frequency of all English alphabet characters in a lowercase string.

```javascript
const text = "hello";
console.log(calculateFrequency(text));
// Output: { h: 1, e: 1, l: 2, o: 1 }
```

### 3. Object Flattening
The `flatten` function converts a nested JavaScript object into a flattened format.

```javascript
const nested = {
    a: 1,
    b: {
        c: 2,
        d: {
            e: 3
        }
    }
};
console.log(flatten(nested));
// Output: { 'a': 1, 'b.c': 2, 'b.d.e': 3 }
```

### 4. Object Unflattening
The `unflatten` function converts a flattened JavaScript object back into a nested format.

```javascript
const flat = {
    'a': 1,
    'b.c': 2,
    'b.d.e': 3
};
console.log(unflatten(flat));
// Output: { a: 1, b: { c: 2, d: { e: 3 } } }
```

## How to Run

1. Open the `javascript-assignment.js` file
2. Each function is self-contained and can be tested independently
3. Use Node.js to run the file:
   ```bash
   node javascript-assignment.js
   ```
   
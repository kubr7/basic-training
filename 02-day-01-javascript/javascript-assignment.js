// Problem 1: Complete the secondLargest function which takes in an array of numbers in input and return the second biggest number in the array. (without using sort)?

function secondLargest(array) {
    // Write your code here
    if (!Array.isArray(array) || array.length < 2) return null;

    let largest = -Infinity;
    let secondLargest = -Infinity;

    for (let i = 0; i < array.length; i++) {
        if (array[i] > largest) {
            secondLargest = largest;
            largest = array[i];
        } else if (array[i] > secondLargest && array[i] !== largest) {
            secondLargest = array[i];
        }
    }

    return secondLargest;
}

// Problem 2: Complete the calculateFrequency function that takes lowercase string as input and returns frequency of all english alphabet. (using only array, no in-built function)

function calculateFrequency(string) {
    // Write your code here
    let freq = new Array(26);
    for (let i = 0; i < 26; i++) {
        freq[i] = 0;
    }

    for (let i = 0; i < string.length; i++) {
        let code = string.charCodeAt(i);

        if (code >= 97 && code <= 122) {
            let index = code - 97;
            freq[index]++;
        }
    }

    let result = {};
    for (let i = 0; i < 26; i++) {
        if (freq[i] > 0) {
            let char = String.fromCharCode(i + 97);
            result[char] = freq[i];
        }
    }

    return result;
}

// Problem 3: Complete the flatten function that takes a JS Object, returns a JS Object in flatten format (compressed)

function flatten(unflatObject) {
    // Write your code here
    let result = {};

    function recurse(curr, path) {
        if (typeof curr === "object" && curr !== null && !Array.isArray(curr)) {
            for (let key in curr) {
                recurse(curr[key], path ? path + "." + key : key);
            }
        } else if (Array.isArray(curr)) {
            for (let i = 0; i < curr.length; i++) {
                recurse(curr[i], path + "." + i);
            }
        } else {
            result[path] = curr;
        }
    }

    recurse(unflatObject, "");
    return result;
}

// Problem 4: Complete the unflatten function that takes a JS Object, returns a JS Object in unflatten format

function unflatten(flatObject) {
    // Write your code here
    let result = {};

    for (let flatKey in flatObject) {
        let keys = flatKey.split(".");
        let current = result;

        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];

            let nextKey = keys[i + 1];
            let isNum = !isNaN(parseInt(nextKey));

            if (i === keys.length - 1) {
                current[key] = flatObject[flatKey];
            } else {
                if (!(key in current)) {
                    current[key] = isNum ? [] : {};
                }
                current = current[key];
            }
        }
    }

    return result;
}

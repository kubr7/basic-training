#!/bin/bash

# Basic shell script demonstrating common functionality

# Display a welcome message
echo "Welcome to the Basic Shell Script Demo!"

# Variables
name="User"
current_date=$(date +"%Y-%m-%d")
script_name=$0

# Get user input
echo "Please enter your name:"
read name

# Display information using variables
echo "Hello, $name!"
echo "Today's date is: $current_date"
echo "This script is named: $script_name"

# Command line arguments
echo "Number of arguments provided: $#"
echo "First argument: $1"
echo "All arguments: $@"

# Conditional statement
if [ $# -gt 0 ]; then
    echo "You provided command line arguments"
else
    echo "No command line arguments were provided"
fi

# Loop example
echo "Counting from 1 to 5:"
for i in {1..5}; do
    echo "Count: $i"
done

# File operations
echo "Creating a test file..."
echo "This is a test file" > test.txt
echo "File created. Contents:"
cat test.txt

# Cleanup
echo "Cleaning up..."
rm test.txt

echo "Script completed successfully!"

#!/bin/bash

# Basic Training Day 04 Web Assignment Script
# This script helps set up a basic web development environment

echo "Starting web development environment setup..."

# Create project directory structure
mkdir -p src/css src/js src/images

# Create basic HTML file
cat > src/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Basic Training Day 04</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h1>Welcome to Basic Training Day 04</h1>
    <script src="js/main.js"></script>
</body>
</html>
EOF

# Create basic CSS file
cat > src/css/style.css << 'EOF'
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}
EOF

# Create basic JavaScript file
cat > src/js/main.js << 'EOF'
console.log('Basic Training Day 04 - JavaScript loaded');
EOF

# Make the script executable
chmod +x "$0"

echo "Setup complete! Project structure created in the 'src' directory."
echo "You can now start developing your web application."

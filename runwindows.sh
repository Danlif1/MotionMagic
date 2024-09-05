#!/bin/bash

# Export the shared environment variable
export PORT_TCP=10003

# Change directory to where your Python script is located
cd ./python_code

# Create a virtual environment
python3 -m venv venv

# Check if the system is running Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    # Activate the virtual environment for Windows
    source venv/Scripts/activate
else
    # Activate the virtual environment for Unix-like systems
    source venv/bin/activate
fi

# Install required dependencies in the virtual environment
pip install sympy
pip install python-dotenv
pip install numpy

# Run the Python server script using the virtual environment's Python interpreter
python tcp_server.py &

cd ..
cd ./server

npm install

# Check if the system is running Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    npm run windows
else
    npm run linux
fi

# Optionally, you can print a message indicating that the server has started
echo "Server started."

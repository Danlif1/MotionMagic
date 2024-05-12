#!/bin/bash

# Change directory to where your Python script is located
cd ./python_code

# Create a virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install required dependencies in the virtual environment
pip install sympy
pip install python-dotenv

# Run the Python server script using the virtual environment's Python interpreter
python tcp_server.py &

# Optionally, you can print a message indicating that the server has started
echo "Server started."

#!/bin/bash

# Function to kill a process by its name
kill_process_by_name() {
    local process_name=$1
    local pids=$(pgrep -f $process_name)
    if [ -z "$pids" ]; then
        echo "No process found with name: $process_name"
    else
        echo "Stopping process: $process_name"
        kill -9 $pids
    fi
}

# Stop the Python TCP server
kill_process_by_name "tcp_server.py"

# Stop the npm server
kill_process_by_name "node"

# Optionally, you can print a message indicating that the processes have been stopped
echo "Processes stopped."

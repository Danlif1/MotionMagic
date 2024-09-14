# <img src = 'server/public/logo.png' alt="Motion Magic Logo" width="100" align="center" /> &nbsp; Motion Magic

**Final Project by Daniel Assa and Daniel Lifshitz, Bar-Ilan University, Computer Science Department.**

## Project Description

Motion Magic is a social media website for solving and sharing motion problems. Users can solve motion-related problems and publish their solutions for others to view, comment on, and discuss.

## How to Run the Project

## For Windows

In the root directory of the project, run the following in **Git Bash**:  
### `sh runwindows.sh`
If you don't have Git Bash, you can either:  

1. Install Git and search for "Git Bash" in the Windows search bar (For the installation, you can use the instructions in the windows section here: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git )
2. Use the following commands in any terminal:
     
    ```bash
    cd ./python_code
    pip install sympy python-dotenv numpy  # If this fails, install each package individually
    python tcp_server.py &
    cd ../server
    npm install
    npm run windows
    ```



## For Unix (Linux/macOS)
In the root directory of the project, run:  
### `sh run.sh`

# View source code
## Client
The React source code is located in the `client-side` branch, within the `motion-magic` folder.
## Server
The server source code is located within the `server` folder.

import socket
import threading
import pickle
import motionSolver
import json
import os
from dotenv import load_dotenv

load_dotenv()


def handle_client(client_socket):
    data = client_socket.recv(4096)
    if not data:
        return
    received_data = json.loads(data.decode())
    solution = motionSolver.motion_solver(received_data)
    print(solution)
    solution_str_keys = {str(key): value for key, value in solution.items()}
    solution_serializable = {key: str(value) for key, value in solution_str_keys.items()}
    solution_json = json.dumps(solution_serializable)
    client_socket.send(solution_json.encode())
    client_socket.close()


def start_server(host, port):
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind((host, port))
    server.listen(5)
    print(f"[*] Listening on {host}:{port}")
    while True:
        client, addr = server.accept()
        print(f"[*] Accepted connection from {addr[0]}:{addr[1]}")
        client_handler = threading.Thread(target=handle_client, args=(client,))
        client_handler.start()


if __name__ == "__main__":
    HOST = '0.0.0.0'
    PORT = int(os.environ.get('PORT_TCP'))
    start_server(HOST, PORT)

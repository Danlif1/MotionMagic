import socket
import threading
import pickle
import motionSolver
import os
from dotenv import load_dotenv

load_dotenv()

def handle_client(client_socket):
    data = client_socket.recv(4096)
    if not data:
        return
    received_list = pickle.loads(data)
    processed_list = motionSolver.motion_solver(received_list)

    client_socket.send(pickle.dumps(processed_list))
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
    PORT = int(os.getenv('SERVER_PORT'))
    start_server(HOST, PORT)

import socket
import threading
import pickle
import motionSolver
import json
import os
# from dotenv import load_dotenv

# load_dotenv()


def handle_client(client_socket):
    data = client_socket.recv(4096)
    if not data:
        return
    received_data = json.loads(data.decode())
    print(f"recived: {received_data}")
    solution = motionSolver.motion_solver(received_data)
    print(f"solved: {solution}")
    json_solution = json.dumps(solution)
    print(f"in json: {json_solution}")
    encoded_solution = json_solution.encode('utf-8')
    print(f"encoded: {encoded_solution}")
    client_socket.send(encoded_solution)
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
    print("hello", os.environ)
    print(os.environ.get('PORT_TCP'))
    # PORT = int(os.environ.get('PORT_TCP'))
    PORT = 10003
    start_server(HOST, PORT)

import socket
import pickle

def send_list_to_server(host, port, string_list):
    client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    client.connect((host, port))
    data_to_send = pickle.dumps(string_list)
    client.send(data_to_send)
    received_data = client.recv(4096)
    processed_list = pickle.loads(received_data)
    print("Received processed list from server:", processed_list)
    client.close()

if __name__ == "__main__":
    SERVER_HOST = '127.0.0.1'
    SERVER_PORT = 10000
    equations = [
        "x+y+w=10*zxczxc",
        "2*x-y+z=5",
        "17*y/z=13*w",
        "w^2=3"
    ]
    send_list_to_server(SERVER_HOST, SERVER_PORT, equations)

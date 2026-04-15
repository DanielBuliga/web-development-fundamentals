import socket
import os
import threading
import gzip
import json

def handle_client(clientsocket):
    try:
        cerere = ''
        linieDeStart = ''

        while True:
            buf = clientsocket.recv(1024)
            if len(buf) < 1:
                break
            cerere += buf.decode()
            if '\r\n' in cerere and linieDeStart == '':
                linieDeStart = cerere.split('\r\n')[0]
                break

        if linieDeStart == '':
            clientsocket.close()
            print('[THREAD] Fără cerere. Deconectat.')
            return

        elementeLinieStart = linieDeStart.split()
        metoda = elementeLinieStart[0]
        resursa = elementeLinieStart[1]

        if resursa == '/':
            resursa = '/index.html'

        if resursa == "/api/utilizatori" and metoda == "POST":
            try:
                # Citire completă headere + body
                while "\r\n\r\n" not in cerere:
                    cerere += clientsocket.recv(1024).decode()

                header, body = cerere.split("\r\n\r\n", 1)

                content_length = 0
                for linie in header.split("\r\n"):
                    if linie.lower().startswith("content-length:"):
                        content_length = int(linie.split(":")[1].strip())

                while len(body.encode()) < content_length:
                    body += clientsocket.recv(1024).decode()

                user_data = json.loads(body)

                # Citire + actualizare utilizatori.json
                cale = 'continut/resurse/utilizatori.json'
                if not os.path.exists(cale):
                    utilizatori = []
                else:
                    with open(cale, 'r', encoding='utf-8') as f:
                        try:
                            utilizatori = json.load(f)
                        except json.JSONDecodeError:
                            utilizatori = []

                exista = any(u["utilizator"] == user_data["utilizator"] for u in utilizatori)

                if exista:
                    mesaj = "Eroare: utilizatorul există deja!"
                    status = b'HTTP/1.1 409 Conflict\r\n'
                else:
                    utilizatori.append(user_data)
                    with open(cale, 'w', encoding='utf-8') as f:
                        json.dump(utilizatori, f, indent=2, ensure_ascii=False)
                    mesaj = "Utilizatorul a fost înregistrat cu succes!"
                    status = b'HTTP/1.1 200 OK\r\n'

                body_bytes = gzip.compress(mesaj.encode("utf-8"))

                clientsocket.sendall(status)
                clientsocket.sendall(f"Content-Length: {len(body_bytes)}\r\n".encode())
                clientsocket.sendall(b"Content-Type: text/plain; charset=utf-8\r\n")
                clientsocket.sendall(b"Content-Encoding: gzip\r\n")
                clientsocket.sendall(b"Server: My PW Server\r\n\r\n")
                clientsocket.sendall(body_bytes)

            except Exception as e:
                eroare = f"Eroare la procesare POST: {str(e)}"
                print(eroare)
                clientsocket.sendall(b'HTTP/1.1 400 Bad Request\r\nContent-Length: 0\r\n\r\n')

            clientsocket.close()
            return

        # Refuză accesul la directoare suspecte
        if '..' in resursa:
            clientsocket.sendall(b'HTTP/1.1 403 Forbidden\r\n\r\n')
            clientsocket.close()
            return

        numeFisier = 'continut' + resursa
        if not os.path.exists(numeFisier):
            clientsocket.sendall(b'HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n')
            clientsocket.close()
            return

        with open(numeFisier, 'rb') as f:
            continut = f.read()

        extensie = numeFisier.split('.')[-1]
        tipuriMedia = {
            'html': 'text/html; charset=utf-8',
            'css': 'text/css; charset=utf-8',
            'js': 'application/javascript; charset=utf-8',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'ico': 'image/x-icon',
            'json': 'application/json',
            'xml': 'application/xml'
        }
        content_type = tipuriMedia.get(extensie, 'text/plain; charset=utf-8')

        continut_compresat = gzip.compress(continut)

        headers = [
            "HTTP/1.1 200 OK",
            f"Content-Type: {content_type}",
            "Content-Encoding: gzip",
            f"Content-Length: {len(continut_compresat)}",
            "Server: My PW Server",
            "",
            ""
        ]
        clientsocket.sendall('\r\n'.join(headers).encode() + continut_compresat)

    except Exception as e:
        msg = f"Eroare server: {str(e)}"
        print(msg)
        clientsocket.sendall(b'HTTP/1.1 500 Internal Server Error\r\n')
        clientsocket.sendall(f'Content-Length: {len(msg.encode())}\r\n'.encode())
        clientsocket.sendall(b'Content-Type: text/plain; charset=utf-8\r\n')
        clientsocket.sendall(b'Server: My PW Server\r\n\r\n')
        clientsocket.sendall(msg.encode())
    finally:
        clientsocket.close()


def start_server():
    serversocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    serversocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    serversocket.bind(('', 5679))
    serversocket.listen(5)
    print('Serverul ascultă pe portul 5679...')

    while True:
        clientsocket, address = serversocket.accept()
        print(f'Client conectat: {address}')
        threading.Thread(target=handle_client, args=(clientsocket,)).start()

start_server()
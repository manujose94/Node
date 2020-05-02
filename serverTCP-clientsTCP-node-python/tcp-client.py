#! /usr/bin/env python
import socket
import sys
import json
import argparse
import signal
from contextlib import contextmanager
import time


def parse():
    parser = argparse.ArgumentParser()
    parser.add_argument("-r","--robot", help='robot namespace for testing')
    parser.add_argument("-p","--port", help='port to comunicate test messages')
    parser.add_argument("-ui","--uuid", help='uuid about the specific test and client')
    args = parser.parse_args()
    return args

@contextmanager
def timeout(time):
    # Register a function to raise a TimeoutError on the signal.
    signal.signal(signal.SIGALRM, raise_timeout)
    # Schedule the signal to be sent after ``time``.
    signal.alarm(time)
    if sys.version_info[0] > 2:
        timeoutException = TimeoutError
    else:
        timeoutException = socket.timeout
    try:
        yield
    except timeoutException:
        pass
    finally:
        # Unregister the signal so it won't be triggered
        # if the timeout is not reached.
        signal.signal(signal.SIGALRM, signal.SIG_IGN)

def raise_timeout(signum, frame):
    if sys.version_info[0] > 2:
        timeoutException = TimeoutError
    else:
        timeoutException = socket.timeout

    raise timeoutException

def main(args):
        robot=args.robot
        port = int(args.port)
        #print("port: ",port)
        uuid = args.uuid
        #print("uuid: ",uuid)
        # Create a TCP/IP socket
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

        # Connect the socket to the port where the server is listening
        server_address = ('localhost', port)
        sock.connect(server_address)

        try:
            respuesta_json = {
                "message": "Primer mensaje de confirmacion",
                "succes": True,
                "endTest" : 0,
                "tipeInput" : 0,
                "uuid" : uuid
            }
            respuesta_json = json.dumps(respuesta_json)
            sock.sendall(respuesta_json.encode())

            conf = sock.recv(1024);
            print("[Server response]",conf.decode('utf-8'))
            respuesta_json = {
                "message": "Segundo mensaje de confirmacion",
                "succes": True,
                "endTest" : 0,
                "tipeInput" : 0,
                "uuid" : uuid
            }
            respuesta_json = json.dumps(respuesta_json)
            sock.sendall(respuesta_json)

            conf = sock.recv(1024);

            respuesta_json = {
                "message": "Test exitoso",
                "succes": True,
                "endTest" : 1,
                "tipeInput" : 0,
                "uuid" : uuid
            }
            respuesta_json = json.dumps(respuesta_json)
            sock.sendall(respuesta_json)
            

        finally:
            sock.close()
    

if __name__ == '__main__':
    try:
        if len(sys.argv) > 3:
            with timeout(15): # Timer 5 s
                main(parse())
                import time
                time.sleep(10)
                print('This should never get printed because the line before timed out')
            
        else:
            respuesta_json = {
            "message": "You must Usage: Angular_Velocity_Check.py -r robot_name -j {topic: translate, topic2:translate2} -p port",
            "succes": False
            }
            respuesta_json = json.dumps(respuesta_json)
            print(respuesta_json)

    except Exception as e:
        respuesta_json = {
            "message": "Exception during execution: " + str(sys.exc_info()[1]),
            "succes": False
        }
        respuesta_json = json.dumps(respuesta_json)
        print(respuesta_json)
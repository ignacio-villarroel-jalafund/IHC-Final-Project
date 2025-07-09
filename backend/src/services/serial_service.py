import paho.mqtt.client as mqtt
import serial
import time
import json
import threading

SERIAL_PORTS = ['/dev/ttyACM0', '/dev/ttyUSB0']
MQTT_BROKER = "localhost"
MQTT_PORT = 1883


def handle_arduino(port):
    try:
        arduino = serial.Serial(port, 9600, timeout=1)
        time.sleep(2)
        print(f"Connected to: {port}")
    except serial.SerialException as e:
        print(f"Error with port {port}: {e}")
        return

    client = mqtt.Client()
    try:
        client.connect(MQTT_BROKER, MQTT_PORT, 60)
        client.loop_start()
    except Exception as e:
        print(f"MQTT error: {e}")
        return

    while True:
        try:
            if arduino.in_waiting > 0:
                received_line = arduino.readline().decode("utf-8", "ignore").strip()

                if not received_line:
                    continue

                if received_line.endswith("}}"):
                    received_line = received_line[:-1]

                data = json.loads(received_line)

                device_id = data.pop("src", None)
                if not device_id:
                    device_id = port.replace("/", "_").strip("_")

                for sensor, value in data.items():
                    topic = f"sensors/{device_id}/{sensor}"
                    payload = json.dumps(value) if isinstance(value, dict) else str(value)
                    client.publish(topic, payload)
                    print(f"[{port}] → Published to '{topic}': {payload}")

        except (json.JSONDecodeError, UnicodeDecodeError):
            pass
        except serial.SerialException as e:
            print(f"Serial port error on {port}: {e}")
            break
        except Exception as e:
            print(f"Unexpected error on {port}: {e}")
            time.sleep(5)


def start_serial_listener():
    threads = []
    for port in SERIAL_PORTS:
        thread = threading.Thread(target=handle_arduino, args=(port,), daemon=True)
        threads.append(thread)
        thread.start()
    print("Serial listener threads started.")

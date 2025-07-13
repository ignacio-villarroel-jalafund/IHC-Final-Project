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
        if not arduino.is_open:
            print(f"Serial port {port} is not open. Attempting to reconnect...")
            try:
                arduino.open()
                time.sleep(2)
                print(f"Reconnected to {port}")
            except serial.SerialException as e:
                print(f"Failed to reconnect to {port}: {e}")
                time.sleep(5)
                continue

        try:
            if arduino.in_waiting > 0:
                received_line = arduino.readline().decode("utf-8", "ignore").strip()

                if not received_line:
                    continue

                try:
                    data = json.loads(received_line)
                except json.JSONDecodeError:
                    print(f"[{port}] → Invalid JSON received: {received_line}")
                    continue

                device_id = data.pop("src", None)
                if not device_id:
                    device_id = port.replace("/", "_").strip("_")

                if "infrared_security" in data:
                    topic = f"sensors/{device_id}/intruder_alarm"
                    payload = str(data["infrared_security"])
                    client.publish(topic, payload)
                    print(f"[{port}] → Published to '{topic}': {payload}")

                if "external" in data and data["external"] != "N/A":
                    external_data = data["external"]
                    if isinstance(external_data, dict):
                        if "humidity" in external_data:
                            topic_hum = f"sensors/{device_id}/humidity"
                            payload_hum = str(external_data["humidity"])
                            client.publish(topic_hum, payload_hum)
                            print(f"[{port}] → Published to '{topic_hum}': {payload_hum}")
                        
                        if "temperature" in external_data:
                            topic_temp = f"sensors/{device_id}/temperature"
                            payload_temp = str(external_data["temperature"])
                            client.publish(topic_temp, payload_temp)
                            print(f"[{port}] → Published to '{topic_temp}': {payload_temp}")
                elif "external" in data and data["external"] == "N/A":
                    client.publish(f"sensors/{device_id}/humidity", "N/A")
                    client.publish(f"sensors/{device_id}/temperature", "N/A")
                    print(f"[{port}] → Received N/A for external sensors.")


        except serial.SerialException as e:
            print(f"Serial port error on {port}: {e}")
            arduino.close()
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
import paho.mqtt.client as mqtt
import serial
import time
import json

arduino = serial.Serial('/dev/ttyACM0', 9600, timeout=1)
time.sleep(2)

client = mqtt.Client()
client.connect("localhost", 1883, 60)

while True:
    read = arduino.readline()
    if read != "":
        json_string = read.decode('utf-8').strip()
        try:
            data = json.loads(json_string) 
            client.publish("topic/temp/", data.get("temperature"))
            client.publish("topic/dht11/", data.get("dht11"))
            client.publish("topic/distance/", data.get("distance"))
            client.publish("topic/humidity/", data.get("humidity"))
            client.publish("topic/gas/", data.get("gas"))
            print(f"publicado: {json_string}")
        except:
            print("json invalido.")
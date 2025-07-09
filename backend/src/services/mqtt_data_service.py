import paho.mqtt.client as mqtt
import json
from collections import defaultdict

MQTT_BROKER = "localhost"
MQTT_PUERTO = 1883
MQTT_TOPIC = "house/#"

class DataService:
    def __init__(self):
        self._data = defaultdict(lambda: 0)
        self._client = mqtt.Client()
        self._client.on_connect = self.on_connect
        self._client.on_message = self.on_message

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("mqtt connected")
            client.subscribe(MQTT_TOPIC)
        else:
            print(f"mqtt failed\n")

    def on_message(self, client, userdata, msg):
        try:
            sensor = msg.topic.split('/')[-1]
            payload = msg.payload.decode()
            
            try:
                self._data[sensor] = json.loads(payload)
            except json.JSONDecodeError:
                self._data[sensor] = float(payload)

            print(f"data recived from topic: {msg.topic}, value: {self._data[sensor]}")
        except Exception as e:
            print(f"mqtt error: {e}")

    def start(self):
        try:
            self._client.connect(MQTT_BROKER, MQTT_PUERTO, 60)
            self._client.loop_start()
        except Exception as e:
            print(f"mqtt error at connect: {e}")

    def get_data(self, sensor_name):
        return self._data.get(sensor_name, "No data yet")

data_service = DataService()

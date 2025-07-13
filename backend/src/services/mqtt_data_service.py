import paho.mqtt.client as mqtt
import json
from collections import defaultdict

MQTT_BROKER = "192.168.43.51"
MQTT_PUERTO = 1883
MQTT_TOPIC = "sensors/#"

class DataService:
    def __init__(self):
        self._data = defaultdict(lambda: "No data yet")
        self._last_known_good_data = defaultdict(lambda: "No data yet")
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

            if payload == "N/A":
                self._data[sensor] = self._last_known_good_data[sensor]
                print(f"data received from topic: {msg.topic}, value: N/A, using last known good value: {self._data[sensor]}")
            else:
                try:
                    try:
                        value = json.loads(payload)
                    except json.JSONDecodeError:
                        value = float(payload)
                    
                    self._data[sensor] = value
                    self._last_known_good_data[sensor] = value
                    print(f"data received from topic: {msg.topic}, value: {self._data[sensor]}")

                except (json.JSONDecodeError, ValueError) as e:
                     print(f"Could not decode payload: {payload} from topic: {msg.topic}")
                
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
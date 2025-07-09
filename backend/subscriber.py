import paho.mqtt.client as mqtt


"""
Trabajo grupal Luis Espinoza e Ignacio Villarroel
Obtención de datos de sensores desde mqtt
"""

def on_message(client, userdata, message):
    print(f"recibido en {message.topic}: {message.payload.decode()}")

client = mqtt.Client()
client.on_message = on_message

client.connect("localhost", 1883, 60)
client.subscribe("topic/temp/")
client.subscribe("topic/dht11/")
client.subscribe("topic/distance/")
client.subscribe("topic/humidity/")
client.subscribe("topic/gas/")


client.loop_forever()
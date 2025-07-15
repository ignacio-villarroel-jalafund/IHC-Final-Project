#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* ssid = "fundacion-lev";
const char* password = "qwe123asd";
const char* mqtt_server = "172.20.25.12";

const int AlarmLedPin = 5;
const int ButtonPin = 14;

const int BLACK_THRESHOLD_MIN = 750;

WiFiClient espClient;
PubSubClient client(espClient);
long lastReconnectAttempt = 0;

bool alarmLedState = false;

void callback(char* topic, byte* payload, unsigned int length) {
  String message = "";
  for (unsigned int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  if (String(topic).endsWith("/intruder_alarm")) {
    int sensorValue = message.toInt();
    if (sensorValue > BLACK_THRESHOLD_MIN) {
      digitalWrite(AlarmLedPin, HIGH);
      alarmLedState = true;
      Serial.println(">>> LED ENCENDIDO por intrusión.");
    }
  }
}

boolean reconnect() {
  String clientId = "ESP8266_SecurityLightClient-" + WiFi.macAddress();
  if (client.connect(clientId.c_str())) {
    client.subscribe("sensors/+/intruder_alarm");
  }
  return client.connected();
}

void setup() {
  Serial.begin(115200);
  pinMode(AlarmLedPin, OUTPUT);
  digitalWrite(AlarmLedPin, LOW);
  pinMode(ButtonPin, INPUT_PULLUP);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);
}

void loop() {
  if (!client.connected()) {
    long now = millis();
    if (now - lastReconnectAttempt > 5000) {
      lastReconnectAttempt = now;
      if (reconnect()) {
        lastReconnectAttempt = 0;
      }
    }
  } else {
    client.loop();
  }

  if (digitalRead(ButtonPin) == LOW) {
    if (alarmLedState) {
      digitalWrite(AlarmLedPin, LOW);
      alarmLedState = false;
      Serial.println(">>> Botón presionado: LED APAGADO.");
    }
    delay(300);
  }
}
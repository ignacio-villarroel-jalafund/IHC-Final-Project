#include <DHT11.h>

const int DHT11_PIN = 8;
DHT11 dht11(DHT11_PIN);

void setup() {
  Serial.begin(9600);
}

void loop() {
  int temperature = 0;
  int humidity = 0;

  int data = dht11.readTemperatureHumidity(temperature, humidity);

  String jsonString = "";

  if (data == 0) {
    jsonString += "{";
    jsonString += "\"humidity\":";
    jsonString += humidity;
    jsonString += ",";
    jsonString += "\"temperature\":";
    jsonString += temperature;
    jsonString += "}";
  } else {
    jsonString += "{\"error\":\"";
    jsonString += DHT11::getErrorString(data);
    jsonString += "\"}";
  }

  Serial.println(jsonString);

  delay(1000);
}
#include <Arduino.h>

const int tcrt5000Pin = A1;

void setup() {
  Serial.begin(9600);
  Serial1.begin(9600);
}

int readTCRT5000() {
  int sensorValue = analogRead(tcrt5000Pin);
  return sensorValue;
}

void loop() {
  int tcrtValue = readTCRT5000();

  String jsonOutput = "{\"infrared_security\":";
  jsonOutput += tcrtValue;
  jsonOutput += ",\"external\":";

  if (Serial1.available()) {
    String externalData = Serial1.readStringUntil('\n');
    externalData.trim();

    jsonOutput += externalData;

  } else {
    jsonOutput += "\"N/A\"";
  }

  jsonOutput += "}";

  Serial.println(jsonOutput);

  delay(1000);
}

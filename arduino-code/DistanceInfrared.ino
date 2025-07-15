const int tcrt5000Pin = A0;

const int triggerPin = 9;
const int echoPin = 10;

void setup() {
  Serial.begin(9600);

  pinMode(triggerPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

int readTCRT5000() {
  return analogRead(tcrt5000Pin);
}

long readDistance() {
  // Se genera un pulso limpio en el pin Trigger
  digitalWrite(triggerPin, LOW);
  delayMicroseconds(2);
  
  // Se envía el pulso ultrasónico
  digitalWrite(triggerPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(triggerPin, LOW);

  // Se mide el tiempo que tarda en regresar el pulso de eco (en microsegundos)
  long duration = pulseIn(echoPin, HIGH);
  
  // Se calcula la distancia en centímetros
  long distance = (duration * 0.0343) / 2;
  
  return distance;
}

void loop() {
  int tcrtValue = readTCRT5000();
  long distance = readDistance();
  
  String jsonOutput = "{\"infrared_security\":";
  jsonOutput += tcrtValue;
  jsonOutput += ",\"distance\":";
  jsonOutput += distance;
  jsonOutput += "}";

  Serial.println(jsonOutput);

  delay(1000);
}
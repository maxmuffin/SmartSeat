#include <HX711-multi.h>

// Pins to the load cell amp
#define DOUT1 1    // data pin to the first sensor
#define DOUT2 2    // data pin to the second sensor
#define DOUT3 3    // data pin to the third sensor
#define CLK 5      // clock pin to the load cell amp
#define TARE_TIMEOUT_SECONDS 4

byte DOUTS[3] = {DOUT1, DOUT2, DOUT3};
#define CHANNEL_COUNT sizeof(DOUTS)/sizeof(byte)
long int results[CHANNEL_COUNT];

HX711MULTI scales(CHANNEL_COUNT, DOUTS, CLK);

void setup() {
  Serial.begin(115200);
  Serial.flush();
  tare();
}

void tare() {
  bool tareSuccessful = false;
  unsigned long tareStartTime = millis();
  while (!tareSuccessful && millis()<(tareStartTime+TARE_TIMEOUT_SECONDS*1000)) {
    tareSuccessful = scales.tare(20,10000);  //reject 'tare' if still ringing
  }
}

//this is for sending raw data, for where everything else is done in processing
void sendRawData() {
  scales.read(results);
  for (int i=0; i<scales.get_count(); ++i) {;
    Serial.print( -results[i]);
    Serial.print( (i!=scales.get_count()-1)?"#":"\n");
  }
  delay(10);
}

void loop() {
  sendRawData();
  //on serial data (any data) re-tare
  if (Serial.available()>0) {
    while (Serial.available()) {
      Serial.read();
    }
    tare();
  }
}

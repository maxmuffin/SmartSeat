/*
  Setup your scale and start the sketch WITHOUT a weight on the scale
  Once readings are displayed place the weight on the scale
  Press +/- or a/z to adjust the calibration_factor until the output readings match the known weight
  Arduino pin 6 -> HX711 CLK
  Arduino pin 5 -> HX711 DOUT
  Arduino pin 5V -> HX711 VCC
  Arduino pin GND -> HX711 GND
*/

#include <HX711.h>

#define Seat1pinDOUT 1
#define Seat1PinCLK 2
#define Seat2pinDOUT 3
#define Seat2PinCLK 4
#define Seat3pinDOUT 5
#define Seat3PinCLK 6
#define Seat4pinDOUT 7
#define Seat4PinCLK 8


HX711 scaleSeat1;
HX711 scaleSeat2;
HX711 scaleSeat3;
HX711 scaleSeat4;

float calibration_factor = -48078; // this calibration factor is adjusted according to my load cell
float seat1Weight, seat2Weight, seat3Weight, seat4Weight;
float ounces;

void setup() {
  Serial.begin(115200);
  Serial.println("HX711 calibration sketch");
  Serial.println("Remove all weight from scale");
  Serial.println("After readings begin, place known weight on scale");
  Serial.println("Press + or a to increase calibration factor");
  Serial.println("Press - or z to decrease calibration factor");

  scaleSeat1.begin(Seat1pinDOUT, Seat1PinCLK);
  scaleSeat2.begin(Seat2pinDOUT, Seat2PinCLK);
  scaleSeat3.begin(Seat3pinDOUT, Seat3PinCLK);
  scaleSeat4.begin(Seat4pinDOUT, Seat4PinCLK);

  scaleSeat1.set_scale();
  scaleSeat2.set_scale();
  scaleSeat3.set_scale();
  scaleSeat4.set_scale();

  //Reset the scales to 0
  scaleSeat1.tare();
  scaleSeat2.tare();
  scaleSeat3.tare();
  scaleSeat4.tare();

  //Get a baseline reading
  long zero_factor1 = scaleSeat1.read_average();
  long zero_factor2 = scaleSeat2.read_average();
  long zero_factor3 = scaleSeat3.read_average();
  long zero_factor4 = scaleSeat4.read_average();

  //This can be used to remove the need to tare the scale. Useful in permanent scale projects.
  Serial.print("Zero factor for seat1: ");
  Serial.println(zero_factor1);
  Serial.print("Zero factor for seat2: ");
  Serial.println(zero_factor2);
  Serial.print("Zero factor for seat3: ");
  Serial.println(zero_factor3);
  Serial.print("Zero factor for seat4: ");
  Serial.println(zero_factor4);
}

void loop() {

  //Adjust to this calibration factor
  scaleSeat1.set_scale(calibration_factor);
  scaleSeat2.set_scale(calibration_factor);
  scaleSeat3.set_scale(calibration_factor);
  scaleSeat4.set_scale(calibration_factor);

  Serial.print("Reading: ");
  seat1Weight = scaleSeat1.get_units(), 10;
  seat2Weight = scaleSeat2.get_units(), 10;
  seat3Weight = scaleSeat3.get_units(), 10;
  seat4Weight = scaleSeat4.get_units(), 10;

  if (seat1Weight < 0)
  {
    seat1Weight = 0.00;
  }

  if (seat2Weight < 0)
  {
    seat2Weight = 0.00;
  }

  if (seat3Weight < 0)
  {
    seat3Weight = 0.00;
  }

  if (seat4Weight < 0)
  {
    seat4Weight = 0.00;
  }

  //ounces = units * 0.035274;
  Serial.print(seat1Weight);
  Serial.print(" kg");
  Serial.println();
  Serial.print(seat2Weight);
  Serial.print(" kg");
  Serial.println();
  Serial.print(seat3Weight);
  Serial.print(" kg");
  Serial.println();
  Serial.print(seat4Weight);
  Serial.print(" kg");
  Serial.println();
  Serial.print(" calibration_factor: ");
  Serial.print(calibration_factor);
  Serial.println();
  Serial.println();
  delay(500);

  if (Serial.available())
  {
    char temp = Serial.read();
    if (temp == '+' || temp == 'a')
      calibration_factor += 1;
    else if (temp == '-' || temp == 'z')
      calibration_factor -= 1;
  }
}

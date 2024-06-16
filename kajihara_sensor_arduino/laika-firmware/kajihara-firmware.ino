#include <Arduino.h>
#include <pins_arduino.h>
#include "ArtNet/ArtNetWifi.h"
#include "config.h"

#define DEVICE_NAME "laika-receiver"
#define UNIVERSE 0

#define MAX_CHANNELS 100
#define LED 2

#define MIN(a, b) ((a) < (b) ? (a) : (b))

ArtnetWiFiReceiver artnet;
uint8_t channelVals[MAX_CHANNELS];

uint8_t receivePacketsCount = 0;

int trigPin = D1;    // Trigger
int echoPin = D2;    // Echo
long duration, cm, inches;

void setup()
{

  // シリアルポート
  Serial.begin(115200);

  Serial.print("Connecting WiFi SSID=");
  Serial.print(SSID);

  WiFi.begin(SSID, PASSWORD);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    analogWrite(LED, 0);
    delay(200);
    analogWrite(LED, 1024);
    delay(200);
  }

  Serial.println();
  Serial.print("Connected. SSID=");
  Serial.print(SSID);
  Serial.println(" IP=" + WiFi.localIP().toString());

  artnet.begin();
  artnet.subscribe(UNIVERSE, onArtnet);
  artnet.shortname(DEVICE_NAME);
  artnet.longname(DEVICE_NAME);
  artnet.nodereport("working!");

  // DMX出力
  Serial1.begin(250000, SERIAL_8N2);
  pinMode(LED, OUTPUT);

    //Serial Port begin
  Serial.begin (9600);
  //Define inputs and outputs
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);
}

void loop()
{
  // 接続切れたら再起動
  if (WiFi.status() != WL_CONNECTED)
  {
    delay(100);
    ESP.restart();
  }

  artnet.parse();

  Serial1.flush();
  Serial1.begin(90000, SERIAL_8N2);

  while (Serial1.available())
    Serial1.read();
  // send the break as a "slow" byte
  Serial1.write(0);
  // switch back to the original baud rate
  Serial1.flush();
  Serial1.begin(250000, SERIAL_8N2);
  while (Serial1.available())
    Serial1.read();
  Serial1.write(0); // Start Code

  for (uint8_t i = 0; i < MAX_CHANNELS; i++)
  {
    Serial1.write(channelVals[i]);
  }
   digitalWrite(trigPin, LOW);
  delayMicroseconds(5);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
 
  // Read the signal from the sensor: a HIGH pulse whose
  // duration is the time (in microseconds) from the sending
  // of the ping to the reception of its echo off of an object.
  pinMode(echoPin, INPUT);
  duration = pulseIn(echoPin, HIGH);
 
  // Convert the time into a distance
  cm = (duration/2) / 29.1;     // Divide by 29.1 or multiply by 0.0343
  inches = (duration/2) / 74;   // Divide by 74 or multiply by 0.0135
  
  Serial.print(inches);
  Serial.print("in, ");
  Serial.print(cm);
  Serial.print("cm");
  Serial.println();
}

void onArtnet(const uint8_t *data, const uint16_t size)
{
  receivePacketsCount++;
  if (receivePacketsCount > 50)
  {
    Serial.println();
    Serial.print("Packets are comming (" + WiFi.localIP().toString() + "): ");
    receivePacketsCount = 0;
  }
  Serial.print(".");

  for (size_t i = 0; i < MIN(size, MAX_CHANNELS); ++i)
  {
    channelVals[i] = data[i];
  }
}

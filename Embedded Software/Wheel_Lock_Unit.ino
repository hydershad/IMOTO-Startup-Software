//wheel lock unit code
//pin 6 = buzzer
//pin 2 = arduino->ble TX
//pin 3 = Arduino->ble RX
//pin 5 = indicator LED
//pin 7 = Relay control pin (transistor base terminal)

/*
   Typical pin layout used:
   -----------------------------------------------------------------------------------------
               MFRC522      Arduino       Arduino   Arduino    Arduino          Arduino
               Reader/PCD   Uno/101       Mega      Nano v3    Leonardo/Micro   Pro Micro
   Signal      Pin          Pin           Pin       Pin        Pin              Pin
   -----------------------------------------------------------------------------------------
   RST/Reset   RST          9             5         D9         RESET/ICSP-5     RST
   SPI SS      SDA(SS)      10            53        D10        10               10
   SPI MOSI    MOSI         11 / ICSP-4   51        D11        ICSP-4           16
   SPI MISO    MISO         12 / ICSP-1   50        D12        ICSP-1           14
   SPI SCK     SCK          13 / ICSP-3   52        D13        ICSP-3           15
*/

#include <SoftwareSerial.h>
#include <SPI.h>
#include <MFRC522.h>  // Library for Mifare RC522 Devices

#define RST_PIN         9           // Configurable, see typical pin layout above
#define SS_PIN          10          // Configurable, see typical pin layout above
MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance

SoftwareSerial bleSerial(3, 2); // RX, TX
int timeout = 26;
void setup() {
  Serial.begin(57600);
  pinMode(7, OUTPUT);
  pinMode(5, OUTPUT);
  pinMode(6, OUTPUT); 
  pinMode(13, OUTPUT);
  SPI.begin();               // Init SPI bus
  delay(100);
  mfrc522.PCD_Init();
  delay(100);
  mfrc522.PCD_SetAntennaGain(mfrc522.RxGain_max);      //If you set Antenna Gain to Max it will increase reading distance
  
Serial.println("Wheel Lock Unit Serial Readout");
//set up T1 timer interrupts for AUTO-LOCK
  noInterrupts();           // disable all interrupts
  //set timer1 interrupt at 50Hz
  TCCR1A = 0;// set entire TCCR1A register to 0
  TCCR1B = 0;// same for TCCR1B
  TCNT1  = 0;//initialize counter value to 0
  // set compare match register for 1hz increments
  OCR1A = 5000;// = (16*10^6) / (1*20) - 1 (must be <65536)
  // turn on CTC mode
  TCCR1B |= (1 << WGM12);
  // Set CS10 and CS12 bits for 1024 prescaler
  TCCR1B |= (1 << CS12) | (1 << CS10);  
  // enable timer compare interrupt
  TIMSK1 |= (1 << OCIE1A);
 interrupts();             // enable all interrupts

bleSerial.begin(19200);
delay(200);
bleSerial.write("AT+START");

}
char c =0;
void loop(){

 while(bleSerial.available()){
    c = bleSerial.read();
    if(c== 'u' || c == 'U'){
      digitalWrite(13, LOW);
      digitalWrite(7, HIGH);
      digitalWrite(5, HIGH);
    
      Serial.println("Unlock codes recieved, opening wheel lock");
      for (int x = 0; x<5; x++){
        digitalWrite(6, HIGH);
        delay(50);
        digitalWrite(6, LOW);
        delay(50);
      }
      timeout = 0;
    }
    if(c== 'l' || c== 'L'){
        digitalWrite(13, LOW);
        digitalWrite(7, LOW);
        digitalWrite(5, LOW);
        digitalWrite(6, LOW);
        Serial.println("Lock codes recieved, Securing Wheel Unit...");
        timeout = 26;
        for (int x = 0; x<3; x++){
          digitalWrite(6, HIGH);
          delay(100);
          digitalWrite(6, LOW);
          delay(100);
        }
      int j = 0;
      while ( ! mfrc522.PICC_IsNewCardPresent() && (j<20))  {
        j++;
        delay(50);
      }

  // Select one of the cards
  if ((j>20)|| !mfrc522.PICC_ReadCardSerial()) {
    bleSerial.write("FAILURE#");
    Serial.println("WARNING!!! FAILURE TO IDENTIFY RFID KEYS");
  }
  else{
    if(j<20){
    bleSerial.write("SUCCESS#");
    Serial.println("Success, Wheel Lock Secured");
    Serial.print(F("Card UID:"));    //Dump UID
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
      Serial.print(mfrc522.uid.uidByte[i], HEX);
    }
    Serial.println();
   }
  }
        
  }
 
}
}


int blynk = 0;
int limiter = 10;
ISR(TIMER1_COMPA_vect){//timer1 interrupt 1Hz toggles pin 13 (LED)

  if(timeout<limiter){
    timeout = timeout+1;
       digitalWrite(5, timeout%2);
  }

   else if (timeout == limiter){
    digitalWrite(7,LOW);
    digitalWrite(5, LOW);
    Serial.println("Autolocking...");
    timeout++;
   }
else{ blynk = !blynk;
       digitalWrite(13, blynk);

}
}

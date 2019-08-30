/*
 * Hyder Shad
 * 
 * testbench code for breadboard prototyping of in-car unit
 * uses SIM5320E GSM/GPS/GPRS module
 * test includes rfid functions which will not be part of in-car unit
 * 
 *
*/
//ble tx-> arduino rx is pin2 hardware interrupt capable
//sim tx-> arduino rx is pin3 hardware interrupt capable
//HC-08 MODULE ADDRESS: 3CA308C12576, BAUD RATE = 19200
//HM-10 MODULE ADDRESS: A81B6AB3F219, BAUD RATE = 19200

#include <NeoSWSerial.h>
#include <Wire.h>
#include <Adafruit_SSD1306.h>
//***IFDEF DEBUG VALUES***
#define butts             //button presses enabled
//#define autocheck         //auto poll SIM for new text unlock code @ address 0
#define display_on       // enable display
//************************
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 32 // OLED display height, in pixels

#define NUMFLAKES     10 // Number of snowflakes in the animation example

#define LOGO_HEIGHT   16
#define LOGO_WIDTH    16
static const unsigned char PROGMEM logo_bmp[] =
{ B00000000, B11000000,
  B00000001, B11000000,
  B00000001, B11000000,
  B00000011, B11100000,
  B11110011, B11100000,
  B11111110, B11111000,
  B01111110, B11111111,
  B00110011, B10011111,
  B00011111, B11111100,
  B00001101, B01110000,
  B00011011, B10100000,
  B00111111, B11100000,
  B00111111, B11110000,
  B01111100, B11110000,
  B01110000, B01110000,
  B00000000, B00110000 };
  int8_t f, icons[NUMFLAKES][3];

  //***********************************
#define OLED_RESET 12
Adafruit_SSD1306 display(OLED_RESET);
  
//sim and ble software serial
NeoSWSerial simSerial(3, 5); //Arduino (RX, TX)
NeoSWSerial bleSerial(2, 4); // RX, TX
//keep baud rate at 19200 to keep it a quick interrupt

//oled setup


byte display_active = 1;
//google iot port is 443 or 8883
//function calls
//ctrl-z  = 0x1A
//CR = 0x0D
//globals
String simdata;
String serialdata;
String bledata;

  char c = 0;            //to read/print characters from/to the user shell/serial window
  byte d1, d2, d3, d4 = 0;
  byte d1_stat = 0;      //temporary variables to hold status of button presses
  byte d2_stat = 0;
  byte d3_stat = 0;
  byte d4_stat = 0;
  byte current_menu = 0; 
  byte newsim = 0;
  byte newble = 0;
  byte newserial = 0;
  byte unlock_check = 0;
  byte clk_check = 0;
  byte gsm_check = 0;    //error checking message sent, check response
  byte gps_check = 0;    //error checking message sent, check response
  byte display_reset = 0;
  int toggle = 0;
  int autosend = 0;
//functions
void testanimate(const uint8_t *bitmap, uint8_t w, uint8_t h);

static void sim_handler( char c){

simdata += c;
if(c == 0x0D){
newsim = 1;
}
Serial.print(c);

}

static void ble_handler( char c){
if(c == '#'){
newble = 1;
}
else{bledata += c;}
}

//startup code  

void setup(){

  pinMode(6, INPUT);    //touchpad inputs for lcd menu options
  pinMode(7, INPUT);
  pinMode(8, INPUT);   
  pinMode(9, INPUT);
  pinMode(10, OUTPUT);  //Buzzer
  pinMode(11, OUTPUT);  //indicator LED
   pinMode(13, OUTPUT);  //Buzzer

  // Open serial communications for command window
  Serial.begin(57600); //Serial window communication rate (USE PUTTY NOT ARDUINO MONITOR TO UTILIZE CTR-Z AT COMMAND FUNCTIONS)
  bleSerial.attachInterrupt(ble_handler);   //serial handler
  bleSerial.begin(19200);
  delay(50);
  bleSerial.write("AT+START");  //start HM-10 Module on both devices
  delay(200);
 // bleSerial.write("AT+CONNL");  //connect using master ble to other device
  delay(200);
  Serial.println("SIM5320E Testbench Code");


  //initialize display
  #ifdef display_on

  display.begin(SSD1306_SWITCHCAPVCC, 0x3c);  // initialize with the I2C addr 0x3C (for the 128x64) 
  display.display();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0,0);
  
  //wait for SIM to boot up and acquire the network signal
  Serial.println("Initializing serial ports, bluetooth, and SIM5320E (warmup)");
  delay(1000);
  Serial.println("Startup in 5...");
  
  display.clearDisplay();
  display.println("Initializing SIM5320E");
  display.print("Startup in: 5");
  display.display();
  
  for(int i=4; i>=0; i--){
    delay(300);
    Serial.print("...");
    Serial.print(i);
    Serial.println("...");
    display.clearDisplay();
    display.setCursor(0,0);
    display.println("Initializing SIM5320E");
    display.print("Startup in: ");
    display.print(i);
    display.display();
  }

  #endif
  //
  //NEW: USE IPREX COMMEND TO PERMANENTLY SET BAUD RATE TO 57600 
  //start SIM software serial interface

    Serial.println("Starting comms");
    
  simSerial.attachInterrupt(sim_handler); //serial handler

  simSerial.begin(19200);           //ramp down the baud rate permanently
  delay(100);
  simSerial.write("AT+CPSI?");      //print gsm status
  simSerial.write(0x0D);
  delay(200);
  
  //set up T1 timer interrupts for button press
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
  

//start on menu1 screen for shortcut AT functions
menu1();

}//end setup

//main program

void loop(){    //Serial Commands, Data functions, sensor input

   //check for computer serial input
  while (Serial.available()){
    c = Serial.read();
    
    Serial.print(c);
    if(c== 127){
      int i = serialdata.length();
      serialdata[i-1]= ' ';
      serialdata.trim();
    }
    else{serialdata += c;}
    if(c == 0x0D){  //finished entering serial data into serial window (enter key pressed);
      newserial = 1;
    }
  }
  if(newserial){    //finished entering serial data into serial window (enter key pressed);
     simSerial.print(serialdata);
     newserial = 0;
     serialdata=' ';
  }

  if(newble){
    Serial.println("Wheel Locking Status: ");
    Serial.println(bledata);
    Serial.println();
    bleSerial.end();
    simSerial.begin(19200);
    if(0<bledata.lastIndexOf("FAILURE", bledata.length()-1)){
      Serial.print("WARNING! VALID KEYS NOT DETECTED IN WHEEL LOCK UNIT, RESERVATION NOT ENDED");
      display.clearDisplay();
      display.setTextSize(2);
      display.setCursor(0,0);
      display.println("WARNING");
      display.println("NO KEYS");
      display.display();
      delay(2000);
      display.setTextSize(0);
      menu1();
    }
    bledata = ' ';
    newble = 0;
  }


if(newsim){    //check for SIM input
  int x = 0; 
  int y = 0;
      x = simdata.lastIndexOf("@UNL0CK$", simdata.length() - 1);   //unlock sms recieved
      if(x > 0){
        simSerial.end();
        bleSerial.begin(19200);

        bleSerial.write('U');

        bleSerial.end();
       simSerial.begin(19200);
       toggle = 10;
      }
      x = simdata.lastIndexOf("secure-imot", simdata.length() - 1);    //lock sms recieved
       if(x > 0){
        simSerial.end();
 
        bleSerial.begin(19200);

        bleSerial.write('L');
        //simSerial.begin(19200);
        toggle = 10;
      }
  if(gsm_check){

    if(0<simdata.lastIndexOf("+CPSI:", simdata.length() - 1)){
      display.clearDisplay();
      display.setCursor(0,0);
      x = simdata.indexOf(',', 0);
      x = simdata.indexOf(',', x+1);
      display.println(simdata.substring(0,x));
      x = simdata.indexOf(',', x+1);
      x = simdata.indexOf(',', x+1);
      x = simdata.indexOf(' ', x+1);
      display.println(simdata.substring(x+1));
      display.display();
      gsm_check = 0;
      display_reset = 1;
  }
 }
  if(gps_check){
    if(0<simdata.lastIndexOf("+CGPSINFO:", simdata.length() - 1)){

      display.clearDisplay();
      display.setCursor(0,0);
      x = simdata.indexOf(':', 0);
      y = simdata.indexOf(',', x);
      y = simdata.indexOf(',', y+1);
      display.println(simdata.substring(x+1,y));
      x = simdata.indexOf(',', y+1);
      x = simdata.indexOf(',', x+1);
      display.println(simdata.substring(y+2,x));      
      display.display();
      gps_check = 0;
      display_reset = 1;
    }
  }
 if(clk_check){
    if(0<simdata.lastIndexOf("+CCLK:", simdata.length() - 1)){
      display.clearDisplay();
      display.setCursor(0,0);
      x = simdata.indexOf('"', 0);
      y = simdata.indexOf(',', x+1);
      display.println(simdata.substring(x+1,y));
      x = simdata.indexOf('"', x+1);
      display.println(simdata.substring(y+1,x));
      display.display();
      clk_check = 0;
      display_reset = 1;
    }
 }
 
newsim = 0;
simdata = ' ';
}

#ifdef butts
if(display_active){
  if(display_reset){
    if(d1_stat || d2_stat || d3_stat || d4_stat){
      current_menu = 0;
      menu1();  
      display_reset = 0;
      d1_stat = 0;
      d2_stat = 0;
      d3_stat = 0;
      d4_stat = 0;
   }
  }
  //logic for button inputs
  if(d4_stat){    //CHANGE MENUS button is pressed
    current_menu = (current_menu+1)%2; //modulo by number of total menu screens
    switch(current_menu){
      case 0:
        menu1();
        break;
      
      case 1:
        menu2();
        break;
      case 2:

      default:
        break;
    }
    d4_stat = 0;
  }
  
  if(d1_stat){  //button1 press
    switch(current_menu){
      case 0:
        simSerial.write("AT+CPSI?");
        simSerial.write(0x0D);
        gsm_check = 1;
     
        break;
      
      case 1:
         display_active = 0;
         display.clearDisplay();
         display.display();
        break;
       
      case 2:

        break;
        
      default:
        break;
    }
    d1_stat = 0;
  }

 if(d2_stat){   //button2 press
  switch(current_menu){
    
    case 0:
        simSerial.write("AT+CGPSINFO");
        simSerial.write(0x0D);
        gps_check = 1;
      break;
      
    case 1:
        simSerial.end();
        bleSerial.begin(19200);
        bleSerial.write('L');
        simSerial.begin(19200);
         Serial.println("Manual Override: Lock Wheel Unit");
        display.clearDisplay();
        display.setCursor(0,1);
        display.println("Manual Override:");
        display.println("Lock Wheel Unit");
        display.display();
        delay(2000); 
        menu2();
      break;
    case 2:
        
      break;
  
    deafult:
      break;
  }
    d2_stat = 0; 
  }
  
  if(d3_stat){  //button3 press
    switch(current_menu){
      
      case 0:
        simSerial.write("AT+CCLK?");
        simSerial.write(0x0D);
        clk_check = 1;
       
        break;
        
      case 1:
        simSerial.end();
        bleSerial.begin(19200);
        bleSerial.write('U');
        simSerial.begin(19200);

       Serial.println("Manual Override: Unlock Wheel Unit");
        display.clearDisplay();
        display.setCursor(0,1);
        display.println("Manual Override:");
        display.println("Unlock Wheel Unit");
        display.display();
        delay(2000); 
        menu2();
        break;

      default:
        break;
    }
    d3_stat = 0;
  }
}
else{
  if(d1_stat || d2_stat || d3_stat || d4_stat){
  display_active = 1;
  d1_stat = 0;
  d2_stat = 0;
  d3_stat = 0;
  d4_stat = 0;
  menu1();  
  }
}
  #endif
}   //end of main loop


//menu functions

void menu1(void){
    #ifdef display_on
     current_menu = 0;
     display.clearDisplay();
     display.setCursor(0,0);
     display.println("1 -> GSM Status");
     display.println("2 -> GPS Info");
     display.println("3 -> Network Time");
     display.print("4 -> -> -> -> ->");
     display.display();
     #endif
}

void menu2(void){
      #ifdef display_on
      current_menu = 1;
     display.clearDisplay();
     display.setCursor(0,0);
     display.println("1 -> Display Off");
     display.println("2 -> Manual Lock");
     display.println("3 -> Manual Unlock");
     display.print("4 -> -> -> -> ->");
     display.display();
#endif
}

int d1_old, d2_old, d3_old, d4_old = 0;    //for button depress
ISR(TIMER1_COMPA_vect){                    //timer1 in terrupt 1Hz toggles pin 13 (LED)
 autosend = (autosend+1)%20;    
 if(toggle>0){
   digitalWrite(11, toggle%2);
    toggle--;
 }
 #ifdef autocheck 
                 //automatically poll SIM module for new unlock sms @ address 0
    if(autosend == 5){ 
        simSerial.write("AT+CMGRD=0");    //read and delete sms
        simSerial.write(0x0D);            //actual processing of the message happens in main loop (newsim condition)
    }
  #endif
    #ifdef butts
        d1_old = d1;
        d2_old = d2;
        d3_old = d3;
        d4_old = d4;
        d1 = digitalRead(6);
        d2 = digitalRead(7);
        d3 = digitalRead(8);
        d4 = digitalRead(9);
        if((d1 != d1_old)&& d1){    //check to makesure button pressed once
           d1_stat = !d1_stat;
        }
        if((d2 != d2_old) && d2){
           d2_stat = !d2_stat;
        }
        if((d3 != d3_old)&& d3){
           d3_stat = !d3_stat;
        }
        if((d4 != d4_old)&& d4){
           d4_stat = !d4_stat;
        }
     #endif
}

#ifdef display_on

#define XPOS   0 // Indexes into the 'icons' array in function below
#define YPOS   1
#define DELTAY 2

void testanimate(const uint8_t *bitmap, uint8_t w, uint8_t h) {



  // Initialize 'snowflake' positions
  for(f=0; f< NUMFLAKES; f++) {
    icons[f][XPOS]   = random(1 - LOGO_WIDTH, display.width());
    icons[f][YPOS]   = -LOGO_HEIGHT;
    icons[f][DELTAY] = random(1, 6);
    Serial.print(F("x: "));
    Serial.print(icons[f][XPOS], DEC);
    Serial.print(F(" y: "));
    Serial.print(icons[f][YPOS], DEC);
    Serial.print(F(" dy: "));
    Serial.println(icons[f][DELTAY], DEC);
  }

  for(int i = 0; i<50;i++) { // Loop forever...
    display.clearDisplay(); // Clear the display buffer

    // Draw each snowflake:
    for(f=0; f< NUMFLAKES; f++) {
      display.drawBitmap(icons[f][XPOS], icons[f][YPOS], bitmap, w, h, WHITE);
    }

    display.display(); // Show the display buffer on the screen
    delay(20);        // Pause for 1/10 second

    // Then update coordinates of each flake...
    for(f=0; f< NUMFLAKES; f++) {
      icons[f][YPOS] += icons[f][DELTAY];
      // If snowflake is off the bottom of the screen...
      if (icons[f][YPOS] >= display.height()) {
        // Reinitialize to a random position, just off the top
        icons[f][XPOS]   = random(1 - LOGO_WIDTH, display.width());
        icons[f][YPOS]   = -LOGO_HEIGHT;
        icons[f][DELTAY] = random(1, 6);
      }
    }
  }
      display.clearDisplay(); // Clear the display buffer
}

  #endif

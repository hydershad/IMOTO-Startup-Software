# Imoto

See pictures folder

Imoto is a peer-to-peer carrental platform enabling owners to rent out their vehicles to users without any complex or expensive retrofits to their vehicle. Users will be able to find cars that suit their needs and access the vehicles without having to physically meet up with the owner. This allows for easier access for the user and multiple rentals of the owner's vehicle during a single time frame.


# Imoto hardware updates!

This is the Arduino .ino software file used to control the in-car unit Adafruit MetroMini ATmega328 microcontroller.
This software is designed for controllers and hardware that are pin-to-pin matches with the Arduino Uno R3.
Libraries and included fucntions are used under the creative commons and open source license.

SIM5320TEST::

The SIM5320TEST code currently supports the following hardware functionality:

  -SoftwareSerial communication between serial window and sim module using AT commands
  
  -Preprogrammed AT commands for demonstration purposes using capacitive touchpads with digital input
  
  -OLED mini display to show menu and preprogrammed functions
  
  -Timer1 interrupts for updates and button debouncing
  
  -Support for testing MIFARE 13.56MHz RC522 reader with MIFARE Ultralight Type C tags
  that will be used in the wheel unit to verify keys have been locked. This now implemented and can send feedback to both UART panel and OLED, will be moved to the wheel unit during the final design process
  
  -HM-10 BLE 4.0 SoftwareSerial to communicate with wheel unit, additional functionality has been added for ios ble serial communication 
  for manual control
  
  -indicator LED and peizio buzzer alarm

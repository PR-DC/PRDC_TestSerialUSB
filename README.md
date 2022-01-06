## PR-DC TestSerialUSB

<p align="center">
  <img src="https://pr-dc.com/web/img/github/TestSerialUSB_icon.svg" width="150">
</p>

In order to provide a usage example for [cordova-plugin-serialusb](https://github.com/PR-DC/cordova-plugin-serialusb), we provide both the Android Cordova application and Arduino sketch for the `TestSerialUSB` application.

## Requirements
[Arduino](https://www.arduino.cc/)<br>
[Apache Cordova](https://cordova.apache.org/)<br>

This code is tested with
**Cordova Android 9.1.0** and **Arduino IDE 1.8.16**

## Installation

For Cordova application run `Cordova\TestSerialUSB\scripts\win10\installApp.cmd` and then from same folder run 
`emulateApp.cmd` or `runApp.cmd`.

You can then compile and upload  `Arduino\TestSerialUSB\TestSerialUSB\TestSerialUSB.ino` sketch to the board and connect it to an Android device with the installed `TestSerialUSB` application.

## Usage
Connect Android device and Arduino board using USB OTG cable.

Open the Android `TestSerialUSB` application on the device and grant permissions (screen similar to the following) after that you will be able to see that the Android device sends and receives messages over USB.

<p align="center">
  <img src="https://pr-dc.com/web/img/github/TestSerialUSB.jpg" width="800">
</p>

## License
Copyright (C) 2021 PR-DC <info@pr-dc.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as 
published by the Free Software Foundation, either version 3 of the 
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.

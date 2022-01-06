/**
 * TestSerialUSB - frontend.js
 * Author: Milos Petrasinovic <mpetrasinovic@pr-dc.com>
 * PR-DC, Republic of Serbia
 * info@pr-dc.com
 * 
 * --------------------
 * Copyright (C) 2021 PR-DC <info@pr-dc.com>
 *
 * This file is part of TestSerialUSB.
 *
 * TestSerialUSB is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as 
 * published by the Free Software Foundation, either version 3 of the 
 * License, or (at your option) any later version.
 * 
 * TestSerialUSB is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with TestSerialUSB.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
 
// Global variables
var device_platform;
var autoscroll = true;
var show_timestamp = true;
var usb_enabled = false;
var last_tic = 0;
var N_messages = 0;
var show_raw_input = false; // [-] Show raw input data
var N_messages_max = 100; // [-] max number of messages

var baudrate = 115200; // [bps] baud rate
var databits = 8; // [-] number of data bits
var stopbits = 1; // [-] number of stop bits
var parity = 0; // [-] type of parity
var dtr = true; // [-] data terminal ready signal
var rts = false; // [-] request to send signal
var sleep_on_pause = false; // [-] sleep while app is not active

var detect_android_notch_dt = 100; // [ms] Time interval for andorid notch check
var usb_enable_dt = 200; // [ms] Time interval for ble enabled check
var same_message_dt = 1; // [ms] Time interval allowed for same message

var send_loop; // [-] output loop identifier
var send_dt = 2000; // [ms] Time interval for output 
var send_idx; // [-] output packet index

// DOM elements
var loader_animation = document.getElementById('loading');

// Event listeners
document.addEventListener('deviceready', onDeviceReady, false);

// onDeviceReady() function
// Device is ready
// --------------------
function onDeviceReady() {
  console.log('Running cordova-' + cordova.platformId +
    '@' + cordova.version);
  device_platform = cordova.platformId;
  document.body.classList.add(device_platform);
  document.addEventListener('resume', onResume, false);

  // Keep awake
  keepAwake();
  
  if(device_platform == 'android') {
    // Status bar color
    changeAndroidStatusBarColor();
    
    // Detect notch
    detectAndroidNotch();
    window.addEventListener('resize', detectAndroidNotch, false);
    screen.orientation.addEventListener('change', function() {
      setTimeout(detectAndroidNotch, detect_android_notch_dt);
    });
    
    // Wait for USB enable
    showAllowUSB();
    checkEnableUSB();
  }
}

// changeAndroidStatusBarColor() function
// Change statusbar color on android
// --------------------
function changeAndroidStatusBarColor() {
  var initial_height = document.documentElement.clientHeight;
  window.addEventListener('resize', resizeFunction);
  function resizeFunction() {
    status_bar_height = 
      document.documentElement.clientHeight - initial_height;
    detectAndroidNotch();
    window.removeEventListener('resize', resizeFunction);
  }
  StatusBar.overlaysWebView(true);
  StatusBar.styleDefault();
}
  
// detectAndroidNotch() function
// Detect notch on android
// --------------------
function detectAndroidNotch() {
  const style = document.documentElement.style;
  window.AndroidNotch.getInsetTop(px => {
    if(px) {
      style.setProperty('--notch-inset-top', (px+5) + 'px');
    } else {
      style.setProperty('--notch-inset-top', '24px');
    }
  }, (err) => console.error('Failed to get insets top:', err));
}

// keepAwake() function
// Keep device awake
// --------------------
function keepAwake() {
  window.plugins.insomnia.keepAwake();
}

// onResume() function
// On resume
// --------------------
function onResume() {
  keepAwake();
}

// openSerial() function
// Open serial connection
// --------------------
function openSerial() {
  SerialUSB.open({
      baudRate: baudrate,
      dataBits: databits,
      stopBits: stopbits,
      parity: parity,
      dtr: dtr,
      rts: rts,
      sleepOnPause: sleep_on_pause
    }, function(success_message) {
      showMessage('success_message: ' + success_message);
      usb_connected = true;
      send_idx = 0;
      send_loop = setInterval(function() {
        send_idx++;
        var data_out = 'Cordova packet ' + send_idx;
        SerialUSB.write(data_out);
        showMessage('Data out: ' + data_out);
      }, send_dt);
      SerialUSB.registerReadCallback(
        function(data) {
          readData(data);
        }, function(err) {
          showMessage('Error: ' + err);
        }
      );
      SerialUSB.detached(
        function(success_message) {
          
        }, function(err) {
          usb_connected = false;
          showAllowUSB();
          checkEnableUSB();
          clearInterval(send_loop);
        }
      );
    }, function(err) {
      showMessage('Error: ' + err);
      clearInterval(send_loop);
    });
}

// readData() function
// Read data from serial connection
// --------------------
function readData(data) {
  showMessage('Data in: ' + String.fromCharCode(...new Uint8Array(data)));
}

// checkEnableUSB() function
// Check if USB is enabled
// --------------------
function checkEnableUSB() {
  SerialUSB.requestPermission(
    function success() {
      usb_enabled = true;
      document.getElementById('allow-usb').style.display = 'none';
      document.getElementById('allow-usb-error').textContent = '';
      document.getElementById('terminal-panel').style.overflowY = 'scroll';
      updateMessagesScroll();
      openSerial();
    }, function error(err) {
      document.getElementById('allow-usb-error').textContent = 'Error: ' + err;
      usb_enabled = false;
      showAllowUSB();
      setTimeout(checkEnableUSB, usb_enable_dt);
  });
}

// showAllowUSB() funciton
// Show allow USB message
// --------------------
function showAllowUSB() {
  document.getElementById('terminal-panel').scrollTop = 0;
  document.getElementById('allow-usb').style.display = 'block';
  document.getElementById('terminal-panel').style.overflowY = 'hidden';
}

// getTimestamp() function
// Returns current timestamp in format HH:mm:SS.ms
// --------------------
function getTimestamp() {
  var date = new Date();
  var pad = function(num, size) { 
    return ('000' + num).slice(size * -1); 
  };
  var time = parseFloat(date.getTime()/1000).toFixed(3);
  var hours = date.getHours();
  var minutes = Math.floor(time / 60) % 60;
  var seconds = Math.floor(time - minutes * 60);
  var milliseconds = time.slice(-3);

  return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + 
    pad(seconds, 2) + '.' + pad(milliseconds, 3);
}

// updateMessagesScroll() function
// Go to bottom of messages container
// --------------------
function updateMessagesScroll() {
  var bcr = document.getElementById('messages').getBoundingClientRect();
  document.getElementById('terminal-panel').scrollTop = bcr.height;
}

// showMessage() function
// Show message
// --------------------
function showMessage(msg) {
  var t = performance.now();
  if(t-last_tic > same_message_dt) {
    last_tic = t;
    var timestamp = getTimestamp();
    
    if(N_messages < N_messages_max) {
      N_messages += 1;
    } else {
      document.getElementById('messages').firstChild.remove();
    }
    document.getElementById('messages').innerHTML += 
      '<p><span class="timestamp">'+timestamp+'</span>'+msg+'</p>';
  } else {
    document.getElementById('messages').lastChild.innerHTML += msg;
  }
  if(autoscroll) {
    updateMessagesScroll();
  }
}
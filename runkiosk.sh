#!/bin/sh
# ------------------------------------------------------------------
# [Author] Nafeu Nasir
#          Run chrome kiosk for rpi
# ------------------------------------------------------------------

activate_kiosk(){
  sleep 5
  export DISPLAY=:0.0
  chromium-browser --kiosk http://localhost:8000?remote=true
}

activate_kiosk &
node server.js
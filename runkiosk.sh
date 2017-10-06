#!/bin/sh
# ------------------------------------------------------------------
# [Author] Nafeu Nasir
#          Run chrome kiosk for rpi
# ------------------------------------------------------------------

BASEDIR=$(dirname "$0")

activate_kiosk(){
  sleep 5
  export DISPLAY=:0.0
  chromium-browser --kiosk http://localhost:8000?remote=true
  # chromium-browser --kiosk http://localhost:8000?remote=true&theme=%231C2021&mode=day
}

if [ -z "$SSH_CLIENT" ] && [ -z "$SSH_TTY" ]; then
  activate_kiosk &
  node "$BASEDIR/server.js"
fi
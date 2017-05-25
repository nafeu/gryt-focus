#!/bin/sh
# ------------------------------------------------------------------
# [Author] Nafeu Nasir
#          Run chrome kiosk for rpi
# ------------------------------------------------------------------

export DISPLAY=:0.0
chromium-browser --kiosk http://localhost:8000?remote=true
#!/bin/bash

cd Documents/SmartSeatArduino/raspberry

while true; do
	python3 realTime_posture.py
	echo "Restarting script.."
done

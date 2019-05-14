import serial
import time

while True:
	ser = serial.Serial('/dev/ttyACM0', 115200)
	line = ser.readline()
	print(line)
	time.sleep(3)

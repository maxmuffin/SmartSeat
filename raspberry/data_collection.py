import serial
import csv
import datetime
import uuid
import time

#serDevSeduta = serial.Serial('/dev/ttyACM0', 9600)
#serDevSchienale = serial.Serial('/dev/ttyACM1', 9600)

print("Inserisci peso:")
peso = float(input())

print("Inserisci la postura assunta (1-8): ")
postura = int(input())

print("Peso: " + str(peso) + " Postura: " + str(postura))


# read from Arduino

#inputSeduta = serDevSeduta.read()
#inputSchienale = serDevSchienale.read()

#receivedData = inputSeduta + "#" + inputSchienale


unique_filename = str(postura)+"/"+str(uuid.uuid4())+".csv"

with open("dataset/{}".format(unique_filename), 'w', newline='') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
    filewriter.writerow(['seduta1', 'seduta2', 'seduta3', 'seduta4', 'schienale1', 'schienale2', 'schienale3', 'postura'])
    for i in range(0,5):
        receivedData = "1#2#3#4#5#6#7"
        data = receivedData.split("#")

        equalizedData = []

        for temp in data:
            value = float(temp)
            equalizedData.append(value/peso)

        equalizedData.append(postura)   
        filewriter.writerow(equalizedData)
        print("take data")
        time.sleep(5)


#print ("Read input " + input.decode("utf-8") + " from Arduino")


# write something back
#ser.write(b'A')



# read response back from Arduino

#for i in range (0,3):

 #       input = ser.read()

  #      input_number = ord(input)

   #     print ("Read input back: " + str(input_number))
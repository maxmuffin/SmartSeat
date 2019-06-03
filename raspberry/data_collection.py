import serial
import csv
import datetime
import uuid
import time
import os
import datetime

serial_speed = 115200

peso = float(input("Inserisci peso (Kg): "))
altezza = float(input("Inserisci altezza (cm): "))
eta = int(input("Inserisci età: "))
sesso = input("Inserisci sesso: ")
postura = int(input("Inserisci la postura assunta (1-8): "))

print("\n\nPeso: " + str(peso) + "\tAltezza " + str(altezza) + "\tEtà: "+str(eta))
print("Sesso: "+ sesso + "\tPostura: "+ str(postura) + "\n\n")

unique_filename = str(postura)+"/"+str(uuid.uuid4())+".csv"

with open("dataset/{}".format(unique_filename), 'w', newline='') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
    filewriter.writerow(['seduta1', 'seduta2', 'seduta3', 'seduta4', 'schienale1', 'schienale2', 'schienale3', 'peso', 'altezza', 'eta', 'sesso','postura', 'timestamp'])
    startTime = datetime.datetime.now()
    for i in range(0,20):
        # read five relevations from Arduino
        serDevSeduta = serial.Serial('/dev/ttyACM0', serial_speed)
        serDevSchienale = serial.Serial('/dev/ttyACM1', serial_speed)

        inputSeduta = serDevSeduta.readline()
        inputSchienale = serDevSchienale.readline()

        decodedSeduta = inputSeduta.decode("utf-8")
        decodedSchienale = inputSchienale.decode("utf-8")

        receivedData = decodedSeduta + "#" + decodedSchienale
        #receivedData = "1#2#3#4#5#6#7"
        data = receivedData.split("#")

        #This is for normalize data
        equalizedData = []

        for temp in data:
            value = float(temp)
            equalizedData.append(value)
            #equalizedData.append(value/peso)

        equalizedData.append(peso)
        equalizedData.append(altezza)
        equalizedData.append(eta)
        equalizedData.append(sesso.upper())
        equalizedData.append(postura)

        date = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f")
        equalizedData.append(date)

        filewriter.writerow(equalizedData)
        print("Write "+ str(i+1) +"° row")
        time.sleep(0.5)

    csvfile.close()

    endTime = datetime.datetime.now()
    delta = endTime - startTime

    correct = input("Correct measurement? [Y/n]: ")
    if correct in ["Y","y"] :
        print("Measurement keeped in time: "+ str(delta))

    else:
        os.remove("dataset/{}".format(unique_filename))
        print("Measurement discarded")

import serial
import csv
import datetime
import uuid
import time
import os

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
    filewriter.writerow(['seduta1', 'seduta2', 'seduta3', 'seduta4', 'schienale1', 'schienale2', 'schienale3', 'peso', 'altezza', 'eta', 'sesso','postura'])
    for i in range(0,20):
        # read five relevations from Arduino
        #serDevSeduta = serial.Serial('/dev/ttyACM0', 115200)
        #serDevSchienale = serial.Serial('/dev/ttyACM1', 115200)

        #inputSeduta = serDevSeduta.readline()
        #inputSchienale = serDevSchienale.readline()

        #receivedData = inputSeduta + "#" + inputSchienale
        receivedData = "1#2#3#4#5#6#7"
        data = receivedData.split("#")

        '''  #This is for normalize data
        equalizedData = []

        for temp in data:
            value = float(temp)
            equalizedData.append(value/peso)

        equalizedData.append(postura)
        '''
        data.append(peso)
        data.append(altezza)
        data.append(eta)
        data.append(sesso)
        data.append(postura)

        filewriter.writerow(data)
        print("Write row")
        time.sleep(0.5)

    csvfile.close()

    correct = input("Correct measurement? [Y/n]: ")
    if correct in ["Y","y"] :
        print("Measurement keeped")
    else:
        os.remove("dataset/{}".format(unique_filename))
        print("Measurement discarded")

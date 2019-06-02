import serial
import csv
import datetime
import uuid
import time
import os

# RICHIEDERE AL SERVER INFO DELL'UTENTE (peso, altezza , sesso)

# Il dato dei singoli valori del csv è la media di 10 valori presi a distanza di 0.4s l'una
peso = 50
altezza = 153
eta = 25
sesso = "M"

# For stabilize initial startup
print("Waiting 5 seconds for stabilize sensors")
time.sleep(5)

while True:
    unique_filename = "realtimeView/"+str(uuid.uuid4())+"realtime_view.csv"

    with open("dataset/{}".format(unique_filename), 'w', newline='') as csvfile:
        filewriter = csv.writer(csvfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
        filewriter.writerow(['seduta1', 'seduta2', 'seduta3', 'seduta4', 'schienale1', 'schienale2', 'schienale3', 'peso', 'altezza', 'eta', 'sesso'])

        #This is for normalize data
        row_list = []


        for i in range(0,10):
            # read five relevations from Arduino
            #serDevSeduta = serial.Serial('/dev/ttyACM0', 115200)
            #serDevSchienale = serial.Serial('/dev/ttyACM1', 115200)

            #inputSeduta = serDevSeduta.readline()
            #inputSchienale = serDevSchienale.readline()

            #receivedData = inputSeduta + "#" + inputSchienale
            receivedData = "1#2#3#4#5#6#7"
            data = receivedData.split("#")

            equalizedData = []
            for temp in data:
                value = float(temp)
                equalizedData.append(value)

            print("Take relevation")
            row_list.append(equalizedData)

            time.sleep(0.4)


        meanData = [float(sum(l))/len(l) for l in zip(*row_list)]

        meanData.append(peso)
        meanData.append(altezza)
        meanData.append(eta)
        meanData.append(sesso)

        filewriter.writerow(meanData)
        print("------------ SUCCESS ------------")
        csvfile.close()

        # SEND TO SERVER
        delete_filename = unique_filename
        os.remove("dataset/{}".format(delete_filename))

        # time.sleep(4)

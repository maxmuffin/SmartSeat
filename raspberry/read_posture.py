import serial
import csv
import datetime
import uuid
import time
import os
import requests

# RICHIEDERE AL SERVER INFO DELL'UTENTE (peso, altezza , età, sesso)

# Il dato dei singoli valori del csv è la media di 10 valori presi a distanza di 0.4s l'una
peso = 50
altezza = 153
eta = 25
sesso = "M"

serial_speed = 115200
sendOK = ""

API_URL = 'Http://192.168.43.136:8000'

def sendCSV(filePath):
    global sendOK

    with open("dataset/{}".format(filePath)) as fp:
        content = fp.read()
    response = requests.post('{}/query_model'.format(API_URL), data=content)
    print(response.json())

    if response:
        sendOK = "OK"
        return sendOk


# For stabilize initial startup
print("Waiting 10 seconds for stabilize sensors")
time.sleep(10)

while True:

    unique_filename = "realtimeView/"+str(uuid.uuid4())+"realtime_view.csv"
    sendOk = ""

    with open("dataset/{}".format(unique_filename), 'w', newline='') as csvfile:
        filewriter = csv.writer(csvfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
        #filewriter.writerow(['seduta1', 'seduta2', 'seduta3', 'seduta4', 'schienale1', 'schienale2', 'schienale3'])

        #This is for normalize data
        row_list = []


        for i in range(0,10):
            # read five relevations from Arduino

            # macOS serialPort
            #serDevSeduta = serial.Serial('/dev/tty.usbmodem14201', serial_speed)
            #serDevSchienale = serial.Serial('/dev/tty.usbmodem14101', serial_speed)

            # linux serialPort
            serDevSeduta = serial.Serial('/dev/ttyACM0', 115200)
            serDevSchienale = serial.Serial('/dev/ttyACM1', 115200)

            inputSeduta = serDevSeduta.readline()
            inputSchienale = serDevSchienale.readline()

            decodedSeduta = inputSeduta.decode("utf-8")
            decodedSchienale = inputSchienale.decode("utf-8")

            receivedData = decodedSeduta + "\t" + decodedSchienale

            #receivedData = "1\t2\t3\t4\t5\t6\t7"
            data = receivedData.split("\t")

            equalizedData = []
            for temp in data:
                value = float(temp)
                equalizedData.append(value)

            print("Take relevation")
            filewriter.writerow(equalizedData)
            #row_list.append(equalizedData)

            time.sleep(0.1)

        '''
        meanData = [float(sum(l))/len(l) for l in zip(*row_list)]
        meanData.append(peso)
        meanData.append(altezza)
        meanData.append(eta)
        meanData.append(sesso)
        filewriter.writerow(equalizedData)
        '''

        csvfile.close()

        # SEND TO SERVER AND DELETE CSV
        delete_filename = unique_filename
        sendCSV(unique_filename)
        if sendOK:
            print("------------ SUCCESS ------------")
        else:
            print("------------ ERROR ------------")
        os.remove("dataset/{}".format(delete_filename))

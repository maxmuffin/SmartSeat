import time
import serial
import csv
import datetime
import uuid
import os
import datetime

'''
# macOS port
port1 = '/dev/tty.usbmodem14101'
port2 = '/dev/tty.usbmodem14201'
'''
# linux port
port1 = '/dev/ttyACM0'
port2 = '/dev/ttyACM1'

serial_speed = 115200

peso = 0
altezza = 0
eta = 0
sesso = "NONE"
postura = 0

def collectData():
    print("------- Read data for 20 minutes ------- ")
    # 20 minutes
    endTime = time.time() + 60 * 20
    startTime = time.time()


    while startTime < endTime:

        startTime = time.time()

        unique_filename = str(postura)+"/"+str(uuid.uuid4())+".csv"

        with open("dataset/{}".format(unique_filename), 'w', newline='') as csvfile:
            filewriter = csv.writer(csvfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
            filewriter.writerow(['seduta1', 'seduta2', 'seduta3', 'seduta4', 'schienale1', 'schienale2', 'schienale3', 'peso', 'altezza', 'eta', 'sesso','postura', 'timestamp'])

            for i in range(0,20):

                saveRow = True

                # read relevations from Arduino
                ser1 = serial.Serial(port1, serial_speed)
                ser2 = serial.Serial(port2, serial_speed)

                inputSer1 = ser1.readline()
                inputSer2 = ser2.readline()

                decodedSer1 = inputSer1.decode("utf-8")
                decodedSer2 = inputSer2.decode("utf-8")

                if decodedSer1.count('\t') == 3:
                    decodedSeduta = decodedSer1
                    decodedSchienale = decodedSer2
                    print("Seduta: "+ port1 +"\nSchienale: "+port2)
                else:
                    decodedSeduta = decodedSer2
                    decodedSchienale = decodedSer1
                    print("Seduta: "+ port2 +"\nSchienale: "+port1)

                receivedData = decodedSeduta + "\t" + decodedSchienale
                #receivedData = decodedSeduta + "\t7\t8\t9"
                #receivedData = "1\t2\t3\t4\t5\t6\t7"
                data = receivedData.split("\t")

                #This is for normalize data
                equalizedData = []

                for temp in data:
                    # if contains whitespaces and numbers
                    try:
                        value = float(temp)
                        equalizedData.append(value)
                    except ValueError:
                        saveRow = False
                        print("Discard Row")


                equalizedData.append(peso)
                equalizedData.append(altezza)
                equalizedData.append(eta)
                equalizedData.append(sesso.upper())
                equalizedData.append(postura)

                date = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S.%f")
                equalizedData.append(date)

                if saveRow:
                    filewriter.writerow(equalizedData)
                #filewriter.writerow(equalizedData)
                #print("Write "+ str(i+1) +"° row")
                time.sleep(0.2)
            print("csv saved")
            csvfile.close()

    print("--------------------------------------------------------")


def main():
    start = datetime.datetime.now()
    for i in range(3):
        print("------- Waiting for 5 minutes for reset sensors -------")
        time.sleep(300)

        collectData()
        print(str(i+1) + "° relevation: DONE")

    end = datetime.datetime.now()
    delta = end - start
    print("\nFINISH: Measurements keeped in time: "+ str(delta))

# Execute `main()` function
if __name__ == '__main__':
    main()

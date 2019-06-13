import time
import serial
import csv
import datetime
import uuid
import os
import datetime


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
                # read five relevations from Arduino
                serDevSeduta = serial.Serial('/dev/ttyACM0', serial_speed)
                serDevSchienale = serial.Serial('/dev/ttyACM1', serial_speed)

                inputSeduta = serDevSeduta.readline()
                inputSchienale = serDevSchienale.readline()

                decodedSeduta = inputSeduta.decode("utf-8")
                decodedSchienale = inputSchienale.decode("utf-8")

                receivedData = decodedSeduta + "\t" + decodedSchienale
                #receivedData = decodedSeduta + "\t7\t8\t9"
                #receivedData = "1\t2\t3\t4\t5\t6\t7"
                data = receivedData.split("\t")

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
                #print("Write "+ str(i+1) +"° row")
                time.sleep(0.5)
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

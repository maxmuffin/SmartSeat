import paho.mqtt.client as mqtt
import serial
import csv
import datetime
import uuid
import time
import os
import requests
from Crypto.Cipher import AES

'''
# macOS port
port1 = '/dev/tty.usbmodem14101'
port2 = '/dev/tty.usbmodem14201'
'''

# linux port
port1 = '/dev/ttyACM0'
port2 = '/dev/ttyACM1'

serial_speed = 115200

# Http
API_URL = 'Http://192.168.43.135:8000'

# MQTT
broker_address= "192.168.43.135"
broker_port = 1883
topic = "seat/chair1"
mqtt_username = "smartseat"
mqtt_password = "mqttss"

key1 = "SmartSeatApp2019"
key2 = '57t4U4$!@5J%BNBn'

sendOK = ""

peso = 50
altezza = 153
eta = 25
sesso = "M"

def on_message(client, userdata, message):
    print("message received " ,str(message.payload.decode("utf-8")))
    print("message topic=",message.topic)
    print("message qos=",message.qos)
    print("message retain flag=",message.retain)

def MQTT_sendCSV(filePath):
    global sendOK

    with open("dataset/{}".format(filePath)) as fp:
        content = fp.read()

    while len(content)%16 !=0:
        content = content+'@'

    try:
        cipher = AES.new(key2, AES.MODE_CBC,key1)
        encryptedFile = cipher.encrypt(content)
        client.loop_start()
        client.publish(topic, encryptedFile)
        client.loop_stop()
    except Exception as e :
        print(e)
        pass

    sendOK = "OK"
    return sendOk

def Http_sendCSV(filePath):
    global sendOK

    with open("dataset/{}".format(filePath)) as fp:
        content = fp.read()
    try:
        response = requests.post('{}/query_model'.format(API_URL), data=content)
        print(response.json())

    except (ConnectionError, ConnectionRefusedError) as e:
        print("Server not reachable")
        pass

    if response:
        sendOK = "OK"
        return sendOk


########## MQTT connection ##########
client = mqtt.Client("SmartSeat")
client.username_pw_set(mqtt_username, password=mqtt_password)
client.on_message=on_message #attach function to callback

# Connect to broker
print("Connecting..")
client.connect(broker_address)


# For stabilize initial startup
print("Waiting 10 seconds for stabilize sensors")
time.sleep(2)

try:
    while True:

        unique_filename = "realtimeView/"+str(uuid.uuid4())+"realtime_view.csv"
        sendOk = ""


        with open("dataset/{}".format(unique_filename), 'w', newline='') as csvfile:
            filewriter = csv.writer(csvfile, delimiter=',', quotechar='|', quoting=csv.QUOTE_MINIMAL)
            #filewriter.writerow(['seduta1', 'seduta2', 'seduta3', 'seduta4', 'schienale1', 'schienale2', 'schienale3'])

            #This is for normalize data
            #row_list = []

            for i in range(0,10):

                saveRow = True
                '''
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
                '''
                receivedData = "1\t2\t3\t4\t5\t6\t7"
                data = receivedData.split("\t")

                equalizedData = []

                for temp in data:
                    # if contains whitespaces and numbers
                    try:
                        value = float(temp)
                        equalizedData.append(value)

                    except ValueError:
                        saveRow = False
                        print("Discard Row")

                #print("Take relevation")
                if saveRow:
                    filewriter.writerow(equalizedData)
                #row_list.append(equalizedData)

                time.sleep(0.2)

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
            MQTT_sendCSV(unique_filename)
            if sendOK:
                print("------------ SUCCESS ------------")
            else:
                print("------------ ERROR ------------")

            os.remove("dataset/{}".format(delete_filename))

except KeyboardInterrupt:
    print("Client disconnect")
    time.sleep(1)
    client.disconnect()

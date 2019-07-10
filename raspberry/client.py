import paho.mqtt.client as mqtt
import time
#############
def on_message(client, userdata, message):
    print("message received " ,str(message.payload.decode("utf-8")))
    print("message topic=",message.topic)
    print("message qos=",message.qos)
    print("message retain flag=",message.retain)
#############


broker_address= "192.168.43.135"
broker_port = 1883
topic = "seat/chair1"
mqtt_username = "smartseat"
mqtt_password = "mqttss"

client=mqtt.Client("Marche")
client.username_pw_set(mqtt_username, password=mqtt_password)
client.on_message=on_message
client.connect(broker_address)



for i in range(0,10):
    client.loop_start()
    client.subscribe(topic)
    client.publish(topic,"CIAO " + str(i) )
    time.sleep(4)
    client.loop_stop()

# SmartSeatAI

<div style="text-align:center">
  <img src="/IA/image/ic_launcher.png" width="120">
</div>

SmartSeat server side that contains:
## Server
It aims to receive data sent by the raspberry through the MQTT protocol, decrypt them via AES decryption and query RandomForest for the prediction of postures.
In it there is an MQTT broker (mosquitto) which has the task of receiving the data and passing it to the server to be processed.
The purpose of the server is also to provide useful APIs for app requests and display user statistics.

Contains final dataset for Training **RandomForest Algoritm**.
The script used for in training phase is **training.py**, which before instructing the model generates synthetic data starting from the initial dataset using the SMOTE oversampling technique.

It use InfluXDB for save prediction obtained from RandomForest and user data.

#### Launch InfluxDB
```console
 sudo influxd
```
#### Launch Mosquitto (broker MQTT)
```console
 sudo mosquitto -c <path config mosquitto>
```
#### Start server
```console
 sudo python server/server.py
```

## Posenet
Posenet is used for validate correct posture(1) using two different webcams (front and left).
If [x,y] coordinates of each interested points is in particular prestabilited range it saves on unique txt files the coordinates and 1 if the points is in range 0 otherwise.

For launch Posenet:

```console
 cd posenet/

 yarn

 yarn watch
```

# SmartSeatArduino
Arduino & Raspberry code for SmartSeat @unibo
<div style="text-align:center">
  <img src="/raspberry/image/ic_launcher.png" width="120">
</div>

## Section microController
This folder contain:
- script for test LoadCell sensor (**test_pressure.ino**);
- script for take values of multiple LoadCells from sit (**seduta-multi.ino**) and back (**schienale-multi.ino**);

#### Fritzing schema
- Schienale
  <div style="text-align:center">
    <img src="/microController/schema/schienale.png" width="550">
  </div>
- Seduta
<div style="text-align:center">
  <img src="/microController/schema/seduta.png" width="550">
</div>

Tested on Fishino Piranha boards

## Section raspberry
This section contain:
#### - Collect Data
- **data_collection.py** for collect specific posture data;
- **no_sitting_acquisition.py** for collect sensors data when nobody is sitted;
- **realTime_posture.py** that collect 10 sensor readings every 0.2 seconds, encrypt file using AES, send it to the server via MQTT or Http and delete immediately created file;


#### -dataset
Contain subfolder of all data acquisitions divided by different postures (0-8), merged dataset of all single acquisition labeled by postures and an optimization of it removing outliers.
In this section there is a subfolder called Validation_1 that contain txt files obtained by Posenet for validate correct posture(1) using [x,y] coordinates of selected body points.

#### - Test
Contain script for read one value of all load sensors (**read_serial.py**)

#### - tool
Contain script for manipulate collected data:
  - merge multiple csv into one (**csvMerge.py**);
  - convert and sort by timestamp csv file (**csvToExcel.py**);
  - Oversampling of minority class using SMOTE (**smoteOversampling.py**);

#### - performance
Contain csv for performance evaluation (in timestamp) of:
- DataSent;
- DataReceived, DataProcessed and DataSaved from server;
- PacketLength;

From different combinations of data acquisitions and packet size, this feature is commented in realTime_posture script.

Tested on Raspberry 3B+

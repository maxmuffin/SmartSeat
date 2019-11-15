from datetime import datetime
import csv
# current date and time

csvFile= '100_01ALL'

with open(csvFile+'.csv', 'r') as readFile:
    reader = csv.reader(readFile)
    lines = list(reader)
#r = csv.reader(open('1_01ALL.csv')) # Here your csv file
#lines = list(r)

for i in range(1,len(lines)):
    #print(lines[i][1])
    stringDate = str(lines[i][1])
    now = datetime.strptime(stringDate, "%Y-%m-%dT%H:%M:%S.%f")
    timestamp = datetime.timestamp(now)
    lines[i][1] = timestamp

with open('new/'+csvFile+'New.csv', 'w') as writeFile:
    writer = csv.writer(writeFile)
    writer.writerows(lines)

readFile.close()
writeFile.close()
#print(lines)
'''
stringDate = "2019-07-11T17:59:31.665126"
now = datetime.strptime(stringDate, "%Y-%m-%dT%H:%M:%S.%f")
timestamp = datetime.timestamp(now)
print("timestamp =", timestamp)
'''

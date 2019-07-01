import json
import random
import sqlite3
import time
import datetime

from influxdb import InfluxDBClient


def create_connection():
    """Create an SQLite3 DB on disk"""
    conn = sqlite3.connect("DB/SmartSeat.db")
    print(sqlite3.version)
    conn.execute(
        "CREATE TABLE USERS (" +
        "   USERNAME\tTEXT\tPRIMARY KEY\tNOT NULL," +
        "   PASSWORD\t TEXT\tNOT NULL," +
        "   NAME\tTEXT\tNOT NULL," +
        "   SURNAME\tTEXT\tNOT NULL," +
        "   MAIL\tTEXT\tNOT NULL," +
        "   WEIGHT\tREAL," +
        "   HEIGHT\tREAL," +
        "   SEX\tTEXT" +
        ")"
    )
    conn.close()


def get_values_day():
    client = InfluxDBClient('localhost', 8086, 'root', 'root', 'SmartSeat')
    today = datetime.date.today()
    print(today)
    query_all = 'select * from Prediction order by time asc;'
    result_all = client.query(query_all)
    points_all = list(result_all.get_points())
    arr_day = {}
    print("-------DAY-------")
    i = 0
    for value in points_all:
        if value['time'].split("T")[0] == str(today):
            arr_day[(value['time'].split("T")[1]).split(".")[0]] = str(value['prediction'])
            # print("x:'" + (value['time'].split("T")[1]).split(".")[0] + "',y:" + str(value['prediction']))
        i = i+1
    print(arr_day)
    print("-------ALL-------")
    check_date = str(datetime.date(1970, 1, 1))
    counter_correct = 0
    counter_wrong = 0
    counter_no_sit = 0
    arr_counter = {}
    for value in points_all:
        if value['time'].split("T")[0] != check_date:
            # print("date:'" + check_date + "', no_sit:" + str(counter_no_sit) + ",
            # correct: " + str(counter_correct) + ", wrong: " + str(counter_wrong))
            check_date = value['time'].split("T")[0]
            arr_counter[check_date] = {}
            counter_correct = 0
            counter_wrong = 0
            counter_no_sit = 0
            if value['prediction'] == 0:
                counter_no_sit = counter_no_sit + 1
                arr_counter[check_date]['no_sit'] = counter_no_sit
            elif value['prediction'] == 1:
                counter_correct = counter_correct + 1
                arr_counter[check_date]['correct'] = counter_correct
            elif value['prediction'] == 2:
                counter_wrong = counter_wrong + 1
                arr_counter[check_date]['wrong'] = counter_wrong

        else:
            if value['prediction'] == 0:
                counter_no_sit = counter_no_sit + 1
                arr_counter[check_date]['no_sit'] = counter_no_sit
            elif value['prediction'] == 1:
                counter_correct = counter_correct + 1
                arr_counter[check_date]['correct'] = counter_correct
            elif value['prediction'] == 2:
                counter_wrong = counter_wrong + 1
                arr_counter[check_date]['wrong'] = counter_wrong

        # print("date:'" + check_date + "', no_sit:" + str(counter_no_sit) + ",
        # correct: " + str(counter_correct) + ", wrong: " + str(counter_wrong))
        # check_date = value['time'].split("T")[0]
    print(arr_counter)
    arr_all = {'Correct': {}, 'Wrong': {}, 'Not Sitted': {}}
    for date, val in arr_counter.items():
        arr_all['Correct'][date] = val['correct']
        arr_all['Wrong'][date] = val['wrong']
        arr_all['Not Sitted'][date] = val['no_sit']
    print(arr_day)
    print(arr_all)
    arr_final = {'day_measurement':arr_day,'all_measurement':arr_all}
    response = json.dumps(arr_final)
    print(response)


def save_prediction(pred_value, acc_value):
    clients = InfluxDBClient('localhost', 8086, 'root', 'root', 'SmartSeat')
    clients.create_database("SmartSeat")
    json_body = [
        {
            "measurement": "Prediction",
            "fields": {
                "prediction": pred_value,
                "accuracy": acc_value
            }
        }
    ]
    print("Saving to InfluxDB >> Prediction: " + str(pred_value) + ", Accuracy: " + str(acc_value))
    clients.write_points(json_body)


if __name__ == '__main__':
    # create_connection()
    # for i in range(0,50):
    #     save_prediction(random.randrange(0, 3), random.randrange(1, 11))
    #     time.sleep(2)
    get_values_day()

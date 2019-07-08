import random
import sqlite3
import time

from influxdb import InfluxDBClient


def create_user_db():
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

def create_bind_db():
    conn = sqlite3.connect("DB/SmartSeat.db")
    print(sqlite3.version)
    conn.execute(
        "CREATE TABLE BIND (" +
        "   CHAIRKEY\tINT\tPRIMARY KEY\tNOT NULL,"
        "   USERNAME\tTEXT"
        ")"
    )
    conn.close()


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
    # create_user_db()
    # create_bind_db()
    for i in range(0,50):
        save_prediction(random.randrange(0,3),random.randrange(1,11))
        time.sleep(2)

import sqlite3
from influxdb import InfluxDBClient
import time


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


def create_influx_db():
    clients = InfluxDBClient('localhost', 8086, 'root', 'root', 'SmartSeat')
    clients.create_database("SmartSeat")
    return clients


def save_prediction(clients, pred_value, acc_value):
    json_body = [
        {
            "measurement": "Prediction",
            "timestamp": time.time(),
            "fields": {
                "prediction": pred_value,
                "accuracy": acc_value
            }
        }
    ]
    clients.write_points(json_body)


if __name__ == '__main__':
    #create_connection()
    client = create_influx_db()
    print("Write")
    save_prediction(client, 1, 70)
    time.sleep(3)
    print("Write")
    save_prediction(client, 2, 100)
    time.sleep(3)
    print("Write")
    save_prediction(client, 1, 80)
    time.sleep(3)
    print("Write")
    save_prediction(client, 0, 60)


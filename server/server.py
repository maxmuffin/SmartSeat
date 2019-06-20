import hashlib
import json
import os
import sqlite3
import uuid

import pandas as pd
from flask import Flask, request, abort, jsonify, send_from_directory
import joblib
import numpy

UPLOAD_DIRECTORY = "./server/data/uploaded_files"
DB_FILE = "./server/DB/SmartSeat.db"

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)

api = Flask(__name__)


@api.route("/files")
def list_files():
    """Endpoint to list files on the server."""
    files = []
    for filename in os.listdir(UPLOAD_DIRECTORY):
        path = os.path.join(UPLOAD_DIRECTORY, filename)
        if os.path.isfile(path):
            files.append(filename)
    return jsonify(files)


@api.route("/files/<path:path>")
def get_file(path):
    """Download a file"""
    return send_from_directory(UPLOAD_DIRECTORY, path, as_attachment=True)


@api.route("/files/<filename>", methods=["POST"])
def post_file(filename):
    """Upload a file"""
    if "/" in filename:
        # Return $== BAD REQUEST
        abort(400, "no subdirectories directories allowed")

    with open(os.path.join(UPLOAD_DIRECTORY, filename), "wb") as fp:
        fp.write(request.data)

    # Return 201 CREATED
    return "", 201


@api.route("/query_model", methods=["POST"])
def query_model():
    # Load Trained Model
    rfc = joblib.load('./server/trained_model.skl')
    # CSV data to pandas array
    filename = str(uuid.uuid4())
    with open(os.path.join(UPLOAD_DIRECTORY, filename + ".csv"), "wb") as fp:
        fp.write(request.data)
    file_csv = "./server/data/uploaded_files/"+filename+".csv"

    columnsName = ['seduta1', 'seduta2', 'seduta3', 'seduta4', 'schienale1', 'schienale2', 'schienale3']

    csv_file_predict = pd.read_csv(file_csv,names=columnsName)
    print(csv_file_predict.head(10))
    os.remove("./server/data/uploaded_files/" + filename + ".csv")
    x_query = csv_file_predict
    try:
        rfc_predict = rfc.predict(x_query)
        print("Predict ", rfc_predict)
        return '{"prediction":"' + numpy.array2string(rfc_predict) + '"}'
    except ValueError as err:
        print(err)
        return '{"prediction": "ERROR"}'


@api.route("/signup", methods=["POST"])
def signup():
    # Parsing JSON data with Registration data
    file_json = request.data
    signup_data = json.loads(file_json)
    username = signup_data['username']
    password = signup_data['password']
    name = signup_data['name']
    surname = signup_data['surname']
    email = signup_data['email']

    # Adding Salt to password
    salted_password = "salt45" + password + "56ty"

    # Hashing MD5 password value
    password_hashed = hashlib.md5(salted_password.encode())

    # print("user: " + username +
    #       "\npassword: " + password +
    #       "\nname: " + name +
    #       "\nsurname:" + surname +
    #       "\nemail: " + email +
    #       "\nhashed: ")
    # print(password_hashed)

    # Check if not registered
    query_check_exists = "SELECT * FROM USERS WHERE USERNAME='" + username + "'"
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(query_check_exists)
    username_exists = cursor.fetchone()
    print("Sign-in Check: ")
    print(username_exists)
    cursor.close()
    conn.close()

    if username_exists:
        print("Signed False")
        return '{"signed":"false"}', 201
    else:
        # Insert new user if not exists
        query_login = "INSERT INTO USERS(USERNAME,PASSWORD,NAME,SURNAME,MAIL) " \
                      "VALUES ('" + username + "','" + password + "','" + name + "','" + surname + "','" + email + "')"
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(query_login)
        cursor.close()
        conn.commit()
        conn.close()
        print("Signed True")
        return '{"signed":"true"}', 201


@api.route("/login", methods=["POST"])
def login():
    file_json = request.data
    signup_data = json.loads(file_json)
    username = signup_data['username']
    password = signup_data['password']

    query_check_exists = "SELECT * FROM USERS WHERE USERNAME='" + username + "'"
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute(query_check_exists)
    username_exists = cursor.fetchone()
    print("Log-in Check: ")
    print(username_exists)
    cursor.close()
    conn.close()

    result_query = str(username_exists)
    result_query = result_query.replace("(", "")
    result_query = result_query.replace(")", "")
    result_query = result_query.replace("'", "")
    user_info = result_query.split(", ")
    print(user_info)
    if user_info[0] == username and user_info[1] == password:
        print("Logged True")
        return \
            '{' \
            ' "logged":"true",' \
            ' "username":"' + user_info[0] + '",' \
            ' "name":"' + user_info[2] + '",' \
            ' "surname":"' + user_info[3] + '",' \
            ' "mail":"' + user_info[4] + '",' \
            ' "weight":"' + user_info[5] + '",' \
            ' "height":"' + user_info[6] + '",' \
            ' "sex":"' + user_info[7] + ',"' \
            '}', 201
    else:
        print("Logged False")
        return '{"logged":"false"}', 201


@api.route("/bind/<bind_id>")
def bind(bind_id):
    print(bind_id)


@api.route("/unbind/<unbind_id>")
def unbind(unbind_id):
    print(unbind_id)


if __name__ == "__main__":
    api.run(debug=True, host='192.168.43.136', port=8000, threaded=True)

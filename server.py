import hashlib
import json
import os
import sqlite3
import pandas as pd
from flask import Flask, request, abort, jsonify, send_from_directory

UPLOAD_DIRECTORY = "./data/uploaded_files"

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


@api.route("/query/<filename>", methods=["POST"])
def query_csv(filename):
    print(filename)
    if "/" in filename:
        # Return $== BAD REQUEST
        abort(400, "no subdirectories directories allowed")

    with open(os.path.join(UPLOAD_DIRECTORY, filename), "wb") as fp:
        fp.write(request.data)

    csv_val = pd.read_csv(os.path.join(UPLOAD_DIRECTORY, filename))
    print(csv_val)
    json_val = csv_val.to_json()
    return jsonify(json_val)


@api.route("/signup", methods=["POST"])
def signup():
    """Parsing JSON data with Registration data
    """
    file_json = request.data
    signup_data = json.loads(file_json)
    username = signup_data['username']
    password = signup_data['password']
    name = signup_data['name']
    surname = signup_data['surname']
    email = signup_data['email']

    """Adding Salt to password
    """
    salted_password = "salt45" + password + "56ty"

    """Hashing MD5 password value
    """
    password_hashed = hashlib.md5(salted_password.encode())

    # print("user: " + username +
    #       "\npassword: " + password +
    #       "\nname: " + name +
    #       "\nsurname:" + surname +
    #       "\nemail: " + email +
    #       "\nhashed: ")
    # print(password_hashed)

    """Check if not registered
    """
    query_check_exists = "SELECT * FROM USERS WHERE USERNAME='" + username+"'"
    conn = sqlite3.connect("DB/SmartSeat.db")
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
        """Insert new user if not exists
        """
        query_login = "INSERT INTO USERS(USERNAME,PASSWORD,NAME,SURNAME,MAIL) " \
                      "VALUES ('" + username + "','" + password + "','" + name + "','" + surname + "','" + email + "')"
        conn = sqlite3.connect("DB/SmartSeat.db")
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

    query_check_exists = "SELECT USERNAME,PASSWORD FROM USERS WHERE USERNAME='" + username + "'"
    conn = sqlite3.connect("DB/SmartSeat.db")
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
        return '{"logged":"true"}', 201
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
    api.run(debug=True, host='0.0.0.0', port=8000)

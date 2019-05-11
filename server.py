from flask import Flask, request, abort, jsonify, send_from_directory, session, render_template
import pandas as pd
import os, hashlib, json

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
    """Parsing JSON data with Username and Password"""
    file_json = request.data
    signup_data = json.loads(file_json)
    username = signup_data['username']
    password = signup_data['password']

    """Adding Salt to password"""
    salted_password = "salt45" + password + "56ty"

    """Hashing MD5 password value"""
    password_hashed = hashlib.md5(salted_password.encode())

    print("user: " + username + "\npassword: " + password + "\nhashed: ")
    print(password_hashed)
    if True:
        return "", 201


@api.route("/login", methods=["POST"])
def login():
    if request.form['password'] == 'prova' and request.form['username'] == 'admin':
        ciao = 1


if __name__ == "__main__":
    api.run(debug=True, port=8000)

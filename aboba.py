from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This enables CORS for all routes

@app.route('/api/v1/rooms/all', methods=['GET'])
def get_data():
    data =     [ {
  "uuid" : "d4dd7baf-f46b-4030-b04c-4ed7ab8faf9f",
  "name" : "test",
  "physicalAddress" : "test",
  "state" : "NEW",
  "clientUid" : "test",
  "operatorUid" : "null"
}, {
  "uuid" : "bb6031b3-669e-4a9b-a876-fa7fc0b41ebd",
  "name" : "test",
  "physicalAddress" : "test",
  "state" : "NEW",
  "clientUid" : "test",
  "operatorUid" : "null"
}, {
  "uuid" : "645aa845-2e6c-468d-b5d3-71c77083d742",
  "name" : "test",
  "physicalAddress" : "test",
  "state" : "NEW",
  "clientUid" : "test",
  "operatorUid" : "null"
}, {
  "uuid" : "50bf8328-baf2-47a1-b1e1-6f75026b4664",
  "name" : "test",
  "physicalAddress" : "test",
  "state" : "NEW",
  "clientUid" : "test",
  "operatorUid" : "null"
}, {
  "uuid" : "f4614ad6-e7f7-4086-950c-84ae242cd043",
  "name" : "test",
  "physicalAddress" : "test",
  "state" : "NEW",
  "clientUid" : "test",
  "operatorUid" : "null"
}, {
  "uuid" : "564fe436-82f9-47cc-ba77-1e5f2885d463",
  "name" : "test",
  "physicalAddress" : "test",
  "state" : "NEW",
  "clientUid" : "test",
  "operatorUid" : "null"
}, {
  "uuid" : "217f18bd-a70b-4606-8394-0b2cb1bd2980",
  "name" : "test",
  "physicalAddress" : "test",
  "state" : "NEW",
  "clientUid" : "test",
  "operatorUid" : "null"
}, {
  "uuid" : "8ec0c479-3c6e-4127-a3c4-b5bd56864593",
  "name" : "test",
  "physicalAddress" : "test",
  "state" : "NEW",
  "clientUid" : "test",
  "operatorUid" : "null"
} ]

    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
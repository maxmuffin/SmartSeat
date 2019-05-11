import requests

API_URL = 'Http://127.0.0.1:8000'

response = requests.get('{}/files'.format(API_URL))
print(response.json())


with open('data/inputdata.csv') as fp:
    content = fp.read()
response = requests.post('{}/query/inputdata.csv'.format(API_URL), data=content)
print(response.json())


json_data = '{"username":"matteo", "password":"prova"}'
response = requests.post('{}/signup'.format(API_URL), data=json_data)
print(response)


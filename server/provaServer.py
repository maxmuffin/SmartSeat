import requests

API_URL = 'Http://0.0.0.0:8000'

response = requests.get('{}/files'.format(API_URL))
print(response.json())


with open('data/inputdata.csv') as fp:
    content = fp.read()
response = requests.post('{}/query_model'.format(API_URL), data=content)
print(response.json())


json_data = \
    '{' \
    ' "username":"Nuovo",' \
    ' "password":"prova",' \
    ' "name":"matteo",' \
    ' "surname":"sanfelici",' \
    ' "email":"sanfelicimatteo@gmail.com"' \
    '}'
response = requests.post('{}/signup'.format(API_URL), data=json_data)
print(response.json())


json_data1 = \
    '{' \
    ' "username":"Nuovo",' \
    ' "password":"prova"' \
    '}'
response = requests.post('{}/login'.format(API_URL), data=json_data1)
print(response.json())

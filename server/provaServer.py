import requests

API_URL = 'Http://192.168.43.136:8000'

response = requests.get('{}/files'.format(API_URL))
print(response.json())


with open('data/inputdata.csv') as fp:
    content = fp.read()
response = requests.post('{}/query_model'.format(API_URL), data=content)
print(response.json())


json_data = \
    '{' \
    ' "username":"Nuovoo1",' \
    ' "password":"prova",' \
    ' "name":"matteo",' \
    ' "surname":"sanfelici",' \
    ' "email":"sanfelicimatteo@gmail.com",' \
    ' "weight":"70",' \
    ' "height":"170",' \
    ' "sex":"M"' \
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

json_data2 = \
    '{' \
    ' "username":"Nuovoo1",' \
    ' "password":"prova",' \
    ' "weight":"60",' \
    ' "height":"160",' \
    ' "sex":"M"' \
    '}'

response = requests.post('{}/edit_personal_data'.format(API_URL), data=json_data2)
print(response.json())

json_data3 = \
    '{' \
    ' "username":"Nuovoo1",' \
    ' "password":"prova"' \
    '}'
response = requests.post('{}/login'.format(API_URL), data=json_data3)
print(response.json())


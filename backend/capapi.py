import dotenv
import os
import requests
from google.cloud import firestore
import pandas as pd

dotenv.load_dotenv()
CAR_TOKEN = os.getenv("CAR-TOKEN")
CAR_SECRET = os.getenv("CAR-SECRET")

db = firestore.Client()

response = requests.get("https://carapi.app/api/trims/v2?make=Toyota")
print(response.json())

duplicates = []
data = []

print(response.json()["collection"]["first"])

i = 1

while True:
        for car in response.json()["data"]:
                # print(car)
                print(f'{car["year"]}-{car["model"]}-{car["trim"]}-{car["description"]}')
                if f'{car["year"]}-{car["model"]}-{car["trim"]}-{car["description"]}' in duplicates:
                        continue
                else:
                        duplicates.append(f'{car["year"]}-{car["model"]}-{car["trim"]}-{car["description"]}')
                        try:
                                bodies = requests.get(f'https://carapi.app/api/bodies/v2?submodel_id={car["submodel_id"]}')
                                print(bodies.json()['data'][0])
                        except KeyError:
                                print(bodies.json())
                        try:
                                engines = requests.get(f'https://carapi.app/api/engines/v2?submodel_id={car["submodel_id"]}')
                                print(engines.json()['data'][0])
                        except KeyError:
                                print(engines.json())
                        try:
                                mileages = requests.get(f'https://carapi.app/api/mileages/v2?submodel_id={car["submodel_id"]}')
                                print(mileages.json()['data'][0])
                        except KeyError:
                                print(mileages.json())
                        combined = {'hack-id': f'{car["year"]}-{car["model"]}-{car["trim"]}-{car["description"]}', **car, **bodies.json()['data'][0], **engines.json()['data'][0], **mileages.json()['data'][0]}
                        print(combined)
                        data.append(combined)

        df = pd.DataFrame(data)
        df.to_csv('toyota_trims_2020_onwards' + str(i) + '.csv', index=False)
        data = []
        i += 1

        if response.json()["collection"]["next"] == '':
                break

        response = requests.get('https://carapi.app' + response.json()["collection"]["next"])

from pymongo import MongoClient 
import numpy as np
import pandas as pd 

# constants
MIN_TEMPERATURE = 18.0
MAX_TEMPERATURE = 39.0
TOTAL_OCCURRENCES = 20
START_TIMESTAMP = "01-01-2018 08:30:00"
END_TIMESTAMP = "31-10-2018 20:30:00"

# simulation of sensor readings with arrays
VALUES = np.random.uniform(low=MIN_TEMPERATURE, high=MAX_TEMPERATURE, size=(TOTAL_OCCURRENCES,))
TIMESTAMPS = pd.date_range(start='2016-01-15', periods=20, freq='1M').strftime('%Y-%m-%d').flatten()

# client db (localhost)
client = MongoClient("mongodb://localhost:27017/")

# connection to db
db = client["zero12_db"]

# object referring to the collection "temperatures"
collectionTemperatures = db["temperatures"]

# insertion of occurrences in the db
print("INSERIMENTO 20 TEMPERATURE CASUALI nel DATABASE MONGODB 'zero12_db' (localhost:27017):")
for index in range(TOTAL_OCCURRENCES):
	temp = {
	    'Value': str(VALUES[index]),
	    'Timestamp': str(TIMESTAMPS[index])
	}
	result = collectionTemperatures.insert_one(temp)

# reading the occurrences in the db
for data in collectionTemperatures.find():
	print(data)

# elimination of the collection "temperatures" from the db
#collectionTemperatures.drop()
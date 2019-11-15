from sklearn.datasets import make_classification

import pandas as pd
import matplotlib as mt
import numpy as np
import sklearn as sk

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from imblearn.over_sampling import RandomOverSampler
from collections import Counter
from sklearn.svm import LinearSVC

# list for column headers
columnsName = ['seduta1', 'seduta2', 'seduta3', 'seduta4', 'schienale1', 'schienale2', 'schienale3',
               'peso', 'altezza', 'eta', 'sesso', 'postura', 'timestamp']

# open csv file
csvFile = pd.read_csv('/home/matteo/Developments/git/SmartSeatArduino/raspberry/dataset/merged/allMerged/outputPostureallMerged.csv', names=columnsName)
print(csvFile.shape)

# print head of dataset
print(csvFile.head())

# split data and posture identifier
X = csvFile.drop(['peso', 'altezza', 'eta', 'sesso', 'postura', 'timestamp'], axis=1)
y = csvFile['postura']

ros = RandomOverSampler(random_state=0)
X_resampled, y_resampled = ros.fit_resample(X, y)

print(sorted(Counter(y_resampled).items()))

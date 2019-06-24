# Required Python Packages
import pandas as pd
import matplotlib as mt
import numpy as np
import sklearn as sk
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
from imblearn.over_sampling import RandomOverSampler
from collections import Counter
from imblearn.over_sampling import SMOTE, ADASYN

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

X_resampled, y_resampled = SMOTE().fit_resample(X, y)
print(sorted(Counter(y_resampled).items()))

# implementing train and test data split
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.01, random_state=66)

# Random Forest Model creation
rfc = RandomForestClassifier(n_estimators=50)
rfc.fit(X_train, y_train)

# predictions
rfc_predict = rfc.predict(X_test)

# Evaluations

print("=== Confusion Matrix ===")
print(confusion_matrix(y_test, rfc_predict))
print('\n')

print("=== Classification Report ===")
print(classification_report(y_test, rfc_predict))
print('\n')


# rfc_cv_score = cross_val_score(rfc, X, y, cv=10, scoring='roc_auc')
# print("=== All AUC Scores ===")
#
# print(rfc_cv_score)
# print('\n')
#
# print("=== Mean AUC Scores ===")
# print("Mean AUC Score - Random Forest: ", rfc_cv_score.mean())

# Dumping trained Model
joblib.dump(rfc, "trained_model.skl")


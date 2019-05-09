# Required Python Packages
import pandas as pd
import matplotlib as mt
import numpy as np
import sklearn as sk

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.metrics import classification_report, confusion_matrix

from sklearn.externals import joblib

# packages version
print("pandas: ", pd.__version__)
print("matplotlib: ", mt.__version__)
print("numpy: ",np.__version__)
print("scikit-learn: ",sk.__version__)

# list for column headers
columnsName = ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9', 's10', 'posture']

# open csv file
csvFile = pd.read_csv('./data/inputdata.csv', names=columnsName)
print(csvFile.shape)

# print head of dataset
print(csvFile.head())

# split data and posture identifier
X = csvFile.drop('posture', axis=1)
y = csvFile['posture']


# implementing train and test data split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=66)

# Random Forest Model creation

rfc = RandomForestClassifier()
rfc.fit(X_train, y_train)

# predictions
rfc_predict = rfc.predict(X_test)

# Evaluations
rfc_cv_score = cross_val_score(rfc, X, y, cv=10, scoring='roc_auc')

print("=== Confusion Matrix ===")
print(confusion_matrix(y_test, rfc_predict))
print('\n')

print("=== Classification Report ===")
print(classification_report(y_test, rfc_predict))
print('\n')

print("=== All AUC Scores ===")

print(rfc_cv_score)
print('\n')

print("=== Mean AUC Scores ===")
print("Mean AUC Score - Random Forest: ", rfc_cv_score.mean())

# Dumping trained Model
joblib.dump(rfc, "trained_model.skl")


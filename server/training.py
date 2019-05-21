# Required Python Packages
import pandas as pd
import matplotlib as mt
import numpy as np
import sklearn as sk

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# list for column headers
columnsName = ['pelvic_incidence',
               'pelvic_tilt numeric',
               'lumbar_lordosis_angle',
               'sacral_slope',
               'pelvic_radius',
               'degree_spondylolisthesis',
               'class']

# open csv file
csvFile = pd.read_csv('./data/column_3C_weka.csv', names=columnsName)
print(csvFile.shape)

# print head of dataset
print(csvFile.head())

# split data and posture identifier
X = csvFile.drop('class', axis=1)
y = csvFile['class']


# implementing train and test data split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=66)

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


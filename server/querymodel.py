import joblib
import pandas as pd


rfc = joblib.load('trained_model.skl')
columnsName = ['seduta1', 'seduta2', 'seduta3', 'seduta4', 'schienale1', 'schienale2', 'schienale3']

csv_file_predict = pd.read_csv("/home/matteo/Developments/git/SmartSeatArduino/raspberry/dataset/realtimeView/false/sanfo/fe7998f1-696b-4e03-bb0d-13b9f274240crealtime_view.csv", names=columnsName)
#print(csv_file_predict.shape)
#print(csv_file_predict.head())

x_test = csv_file_predict


rfc_predict = rfc.predict(x_test)
print("Predict ", rfc_predict)

# print("=== Confusion Matrix ===")
# print(confusion_matrix(y_test, rfc_predict))
# print('\n')
#
# print("=== Classification Report ===")
# print(classification_report(y_test, rfc_predict))
# print('\n')

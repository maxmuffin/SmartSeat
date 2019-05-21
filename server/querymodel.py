import joblib
import pandas as pd


rfc = joblib.load('trained_model.skl')
columnsName = ['pelvic_incidence',
               'pelvic_tilt numeric',
               'lumbar_lordosis_angle',
               'sacral_slope',
               'pelvic_radius',
               'degree_spondylolisthesis']

csv_file_predict = pd.read_csv("./data/column_test.csv", names=columnsName)
print(csv_file_predict.shape)
print(csv_file_predict.head())

x_test = csv_file_predict


rfc_predict = rfc.predict(x_test)
print(rfc_predict)

# print("=== Confusion Matrix ===")
# print(confusion_matrix(y_test, rfc_predict))
# print('\n')
#
# print("=== Classification Report ===")
# print(classification_report(y_test, rfc_predict))
# print('\n')

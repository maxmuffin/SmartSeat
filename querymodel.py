from sklearn.externals import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn import model_selection
import pandas as pd

rfc = joblib.load('trained_model.skl')

csvFilePredict = pd.read_csv("/path/to/csv")

rfc_predict = rfc.predict()

# Required Python Packages
import pandas as pd
import matplotlib as mt
import numpy as np
import sklearn as sk
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from sklearn.metrics import confusion_matrix

print("pandas: ", pd.__version__)
print("matplotlib: ", mt.__version__)
print("numpy: ",np.__version__)
print("scikit-learn: ",sk.__version__)
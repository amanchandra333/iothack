import pandas as pd
import numpy as np
from sklearn import linear_model
from sklearn.model_selection import train_test_split
import seaborn as sns
from sklearn import metrics
import matplotlib.pyplot as plt
import os


df = pd.read_json('./response/response1.json')
for f in os.listdir('./response'):
    if f is not 'response1.json':
        _ = './response/' + f
        print(_)
        t = pd.read_json(_)
        df = pd.concat([df, t])
print(df)
print(df.shape)

temp_shifted = df['Temperature'][1:]

# sns.jointplot(x=df['Hours'], y=df['Marks'], data=df, kind='reg')
x_train, x_test, y_train, y_test = train_test_split(np.array([df['Pressure'][:-1], df['RPM'][:-1], df['Temperature'][:-1]]).transpose(),
                                             temp_shifted, test_size=0.2, random_state=42)
# x_train, x_test, y_train, y_test = train_test_split(df['RPM'], df['Temperature'], test_size=0.2, random_state=42)
# x_train = np.array(x_train).reshape((1, -1)).transpose()
# x_test = np.array(x_test).reshape((1, -1)).transpose()
# y_train = np.array(y_train).reshape((1, -1)).transpose()
# y_test = np.array(y_test).reshape((1, -1)).transpose()
# x_train = np.array([df['Pressure'][:2200], df['RPM'][:2200]]).transpose()
# x_test = np.array([df['Pressure'][2200:], df['RPM'][2200:]]).transpose()
# y_train = np.array(df['Temperature'][:2200])
# y_test = np.array(df['Temperature'][2200:])

#
print('Train - Predictors shape', x_train.shape)
print('Test - Predictors shape', x_test.shape)
print('Train - Target shape', y_train.shape)
print('Test - Target shape', y_test.shape)


cls = linear_model.LinearRegression()
cls.fit(x_train,y_train)

prediction = cls.predict(x_test)
cls.get_params()
print('Co-efficient of linear regression',cls.coef_)
print('Intercept of linear regression model',cls.intercept_)
print('Mean Square Error', metrics.mean_squared_error(y_test, prediction))
print('Model R^2 Square value', metrics.r2_score(y_test, prediction))

# plt.scatter(x_test, y_test)
# plt.plot(x_test, prediction, color='red', linewidth=3)
# plt.xlabel('Hours')
# plt.ylabel('Marks')
# plt.title('Linear Regression')

# plt.scatter(cls.predict(x_test), cls.predict(x_test) - y_test, c='g', s = 40)
# plt.hlines(y=0, xmin=0, xmax=100)
# plt.title('Residual plot')
# plt.ylabel('Residual')
# 💳 Credit Risk Prediction for Loan Applicants

This web application helps banks and financial institutions assess the **credit risk** of loan applicants using **machine learning models**. It uses a React-based frontend, Firebase for authentication and real-time database, and a Python-based backend for predictive analytics.

---

## 🚀 Project Overview

This application aims to predict whether a loan applicant presents **high** or **low** credit risk. It helps reduce the number of loan defaults by giving institutions a reliable way to evaluate applicants before approval.

---

## 🧠 Machine Learning Models

We experimented with the following models:

| Model         | Accuracy | Precision | Recall  | F1 Score |
|---------------|----------|-----------|---------|----------|
| Random Forest | 0.725    | 0.7337    | 0.9574  | 0.8308   |
| SVM           | 0.63     | 0.7219    | 0.7731  | 0.7466   |
| Naive Bayes   | 0.705    | 0.7384    | 0.9007  | 0.8115   |
| KNN           | 0.68     | 0.7333    | 0.8581  | 0.7909   |

🔍 **Random Forest** achieved the highest performance.

---

## 📊 Data Preprocessing & Analysis

- **Missing Values** handled with imputation.
- **Label Encoding** for categorical data.
- **Normalization** applied to numerical features.
- **Feature Selection**: Dropped less relevant features like `Sex`, `Purpose`, `Job`, and `Housing`, improving model accuracy by **4%**.
- Dataset: 700 good credits, 300 bad credits.

---

## 🔐 Authentication & Database

- **Firebase Authentication (OAuth)**: Google login.
- **Firestore**: Real-time database to store user inputs and predictions.

---

## 🌐 Frontend (React.js)

- React app for UI and interactions.
- Firebase integration for login and database.
- Form-based input for prediction.
- Result shown dynamically: **High Risk / Low Risk**.
- Includes analytics section (correlational heatmap, user stats).

---

## 🔁 Backend (Python + Flask)

- Trained models stored using `pickle`.
- Backend API handles input from React, preprocesses, predicts, and returns the result.
- Hosted on **Google Cloud Platform**.

---



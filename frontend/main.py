import joblib
from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

try:
    model = joblib.load('rf_model.pkl')
except FileNotFoundError:
    model = None
    print("⚠️ Model file 'rf_model.pkl' not found! Make sure it's in the correct directory.")

saving_map = {'NaN': 0, 'little': 1, 'moderate': 2, 'quite rich': 3, 'rich': 4}
checking_map = {'NaN': 0, 'none': 1, 'little': 2, 'moderate': 3, 'rich': 4}

def preprocess(data):
    df = pd.DataFrame([data])
    df['Saving accounts'] = df.get('Saving accounts', 'NaN')
    df['Checking account'] = df.get('Checking account', 'NaN')
    df['Saving accounts'] = df['Saving accounts'].fillna('NaN').map(saving_map).fillna(0)
    df['Checking account'] = df['Checking account'].fillna('NaN').map(checking_map).fillna(0)
    for col in ['Age', 'Credit amount', 'Duration']:
        df[col] = pd.to_numeric(df.get(col, 0), errors='coerce').fillna(0)
    return df[['Age', 'Saving accounts', 'Checking account', 'Credit amount', 'Duration']]

@app.route('/')
def home():
    return "✅ Risk Prediction API is running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None:
            return jsonify({'error': "Model not loaded. Please check 'rf_model.pkl'"}), 500
        data = request.json.get('data', {})
        processed = preprocess(data)
        prediction = model.predict(processed)
        return jsonify({'predictions': prediction.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)

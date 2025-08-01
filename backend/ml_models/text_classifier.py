import sys
import json
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
import pickle
import os
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

# Download required NLTK data
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

class SymptomClassifier:
    def __init__(self):
        self.model_path = os.path.join(os.path.dirname(__file__), 'saved_models', 'symptom_classifier.pkl')
        self.vectorizer_path = os.path.join(os.path.dirname(__file__), 'saved_models', 'tfidf_vectorizer.pkl')
        
        # Initialize text preprocessor
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words('english'))
        
        # Disease classes
        self.classes = [
            'normal',
            'conjunctivitis',
            'stye', 
            'chalazion',
            'blepharitis',
            'ptosis',
            'allergic_reaction',
            'dry_eye'
        ]
        
        # Load or create model
        self.load_or_create_model()
    
    def preprocess_text(self, text):
        """Clean and preprocess symptom text"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Tokenize and remove stopwords
        words = text.split()
        words = [word for word in words if word not in self.stop_words]
        
        # Lemmatize words
        words = [self.lemmatizer.lemmatize(word) for word in words]
        
        return ' '.join(words)
    
    def load_or_create_model(self):
        """Load existing model or create new one"""
        try:
            # Try to load existing model
            with open(self.model_path, 'rb') as f:
                self.model = pickle.load(f)
            with open(self.vectorizer_path, 'rb') as f:
                self.vectorizer = pickle.load(f)
        except:
            # Create and train new model with sample data
            self.create_sample_model()
    
    def create_sample_model(self):
        """Create model with sample symptom data"""
        # Sample training data (replace with your actual training data)
        sample_data = {
            'symptoms': [
                'red eyes watery discharge itchy',
                'pink eye burning sensation tearing',
                'conjunctiva inflamed red watery',
                'small bump eyelid painful tender',
                'red lump lid margin painful',
                'stye hordeolum eyelid swollen',
                'painless bump eyelid hard lump',
                'chalazion meibomian gland blocked',
                'eyelid cyst painless firm',
                'eyelid margin red crusty flaky',
                'dandruff like scales lashes',
                'blepharitis itchy burning lid',
                'droopy eyelid sagging ptosis',
                'upper lid drooping vision blocked',
                'eyelid falls covers pupil',
                'swollen puffy eyes allergic',
                'itchy watery seasonal allergies',
                'allergic reaction eye swelling',
                'eyes feel dry scratchy gritty',
                'burning dry sensation insufficient tears',
                'dry eye syndrome uncomfortable'
            ],
            'disease': [
                'conjunctivitis', 'conjunctivitis', 'conjunctivitis',
                'stye', 'stye', 'stye',
                'chalazion', 'chalazion', 'chalazion',
                'blepharitis', 'blepharitis', 'blepharitis',
                'ptosis', 'ptosis', 'ptosis',
                'allergic_reaction', 'allergic_reaction', 'allergic_reaction',
                'dry_eye', 'dry_eye', 'dry_eye'
            ]
        }
        
        df = pd.DataFrame(sample_data)
        
        # Preprocess text
        df['processed_symptoms'] = df['symptoms'].apply(self.preprocess_text)
        
        # Create TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(max_features=1000, ngram_range=(1, 2))
        X = self.vectorizer.fit_transform(df['processed_symptoms'])
        y = df['disease']
        
        # Train Naive Bayes model
        self.model = MultinomialNB()
        self.model.fit(X, y)
        
        # Save model and vectorizer
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        with open(self.model_path, 'wb') as f:
            pickle.dump(self.model, f)
        with open(self.vectorizer_path, 'wb') as f:
            pickle.dump(self.vectorizer, f)
    
    def predict(self, symptoms_text):
        """Predict disease from symptoms"""
        try:
            # Preprocess input text
            processed_text = self.preprocess_text(symptoms_text)
            
            # Vectorize text
            text_vector = self.vectorizer.transform([processed_text])
            
            # Get prediction probabilities
            probabilities = self.model.predict_proba(text_vector)[0]
            
            # Create results
            results = []
            for i, class_name in enumerate(self.model.classes_):
                confidence = float(probabilities[i])
                results.append({
                    'disease': class_name,
                    'confidence': confidence,
                    'relevanceScore': round(confidence * 100, 2)
                })
            
            # Sort by confidence
            results.sort(key=lambda x: x['confidence'], reverse=True)
            
            return results
            
        except Exception as e:
            raise Exception(f"Error in symptom classification: {str(e)}")

def main():
    try:
        # Get symptoms from command line argument
        if len(sys.argv) < 2:
            raise ValueError("Symptoms text required as argument")
        
        symptoms = sys.argv[1]
        
        # Initialize classifier
        classifier = SymptomClassifier()
        
        # Make prediction
        results = classifier.predict(symptoms)
        
        # Return results as JSON
        print(json.dumps(results))
        
    except Exception as e:
        error_result = [{
            'disease': 'error',
            'confidence': 0.0,
            'relevanceScore': 0.0,
            'error': str(e)
        }]
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()

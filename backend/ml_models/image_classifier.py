import sys
import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import requests
from PIL import Image
import io
import os

class EyeDiseaseClassifier:
    def __init__(self):
        # Load pre-trained CNN model
        model_path = os.path.join(os.path.dirname(__file__), 'saved_models', 'eye_disease_cnn.h5')
        try:
            self.model = load_model(model_path)
        except:
            # If model doesn't exist, create a basic one (you'll replace this with trained model)
            self.model = self.create_basic_model()
        
        # Disease classes (based on your datasets)
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
        
        self.img_size = (224, 224)
    
    def create_basic_model(self):
        """Create a basic CNN model structure (replace with your trained model)"""
        model = tf.keras.Sequential([
            tf.keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
            tf.keras.layers.MaxPooling2D(2, 2),
            tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
            tf.keras.layers.MaxPooling2D(2, 2),
            tf.keras.layers.Conv2D(128, (3, 3), activation='relu'),
            tf.keras.layers.MaxPooling2D(2, 2),
            tf.keras.layers.Flatten(),
            tf.keras.layers.Dropout(0.5),
            tf.keras.layers.Dense(512, activation='relu'),
            tf.keras.layers.Dense(len(self.classes), activation='softmax')
        ])
        model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
        return model
    
    def preprocess_image(self, image_url):
        """Download and preprocess image from URL"""
        try:
            # Download image from URL
            response = requests.get(image_url)
            image = Image.open(io.BytesIO(response.content))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize image
            image = image.resize(self.img_size)
            
            # Convert to array and normalize
            img_array = img_to_array(image)
            img_array = np.expand_dims(img_array, axis=0)
            img_array = img_array / 255.0
            
            return img_array
            
        except Exception as e:
            raise Exception(f"Error preprocessing image: {str(e)}")
    
    def predict(self, image_url):
        """Make prediction on eye image"""
        try:
            # Preprocess image
            processed_image = self.preprocess_image(image_url)
            
            # Make prediction
            predictions = self.model.predict(processed_image)
            
            # Get probabilities for each class
            results = []
            for i, class_name in enumerate(self.classes):
                confidence = float(predictions[0][i])
                results.append({
                    'disease': class_name,
                    'confidence': confidence,
                    'probability': round(confidence * 100, 2)
                })
            
            # Sort by confidence
            results.sort(key=lambda x: x['confidence'], reverse=True)
            
            return results
            
        except Exception as e:
            raise Exception(f"Error making prediction: {str(e)}")

def main():
    try:
        # Get image URL from command line argument
        if len(sys.argv) < 2:
            raise ValueError("Image URL required as argument")
        
        image_url = sys.argv[1]
        
        # Initialize classifier
        classifier = EyeDiseaseClassifier()
        
        # Make prediction
        results = classifier.predict(image_url)
        
        # Return results as JSON
        print(json.dumps(results))
        
    except Exception as e:
        error_result = [{
            'disease': 'error',
            'confidence': 0.0,
            'probability': 0.0,
            'error': str(e)
        }]
        print(json.dumps(error_result))

if __name__ == "__main__":
    main()

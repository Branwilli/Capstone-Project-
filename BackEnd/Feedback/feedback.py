import os 
import json
import requests
import google.generativeai as genai
import instructor
from typing import List, Dict
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import pandas as pd

load_dotenv()

# Define a model for comparing attributes between the original item and the alternative
class ItemComparison(BaseModel):
    attribute: str = Field(..., description='The attribute being compared')
    original_item: str = Field(..., description='Value for the original item')
    alternative_item: str = Field(..., description='Value for the alternative item')


# Define the main data model for generating health-related suggestions
class DataModel(BaseModel):
    score: str = Field(..., description='A letter between A and E inclusive')
    translation: str = Field(..., description='A paragraph of what the score means in terms of health given the user health information.')
    health_issues: List[str] = Field(..., description='A list of medical conditions.')
    item: str = Field(..., description='A text input.')
    alternative: str = Field(..., description="""An alternative item suggestion based on the user's country and health needs. "
                                                Suggestions are selected from a list, otherwise suggestion are based on the user's country.""")
    comparison_table: List[ItemComparison] = Field(..., description="A table comparing the original item and the alternative in terms of key nutritional factors.")
    reasoning: str = Field(..., description='Explain in detail why you decided on the alternative item.')
    
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))  # Configure the Gemini AI API


# Create an AI client for generating suggestions
client = instructor.from_gemini(genai.GenerativeModel(model_name="models/gemini-2.0-flash"), mode=instructor.Mode.GEMINI_JSON)

df = pd.read_csv(os.path.join(os.path.dirname(__file__), '../Food_Dataset_Jamaica.csv')) # Load the food dataset for Jamaica


def generate_suggestion(score, product, nutrients_issue=None):
    """
    Generates a health-based food suggestion by:
    1. Checking if the product exists in the dataset.
    2. Finding alternative items from the same category.
    3. Using Gemini AI to generate a detailed response.
    """

    country = get_location()
    
    goods = df[df["Product Name"].str.lower() == product.lower()] # Search for the product in the dataset (case insensitive)
    
    if not goods.empty:
        category = goods.iloc[0]["Produce Category"]
        alternatives = df[df["Produce Category"] == category]
    else:
        alternatives = ""

    # Send the data to Gemini AI for response generation
    response = client.messages.create(
    max_retries=10,
    messages=[
        {
            'role':'user',
            'content':f'''{score, product, nutrients_issue, country, alternatives}'''
        }
    ],
    response_model=DataModel
    )

    # Print the formatted response output
    for field, value in response.model_dump().items():
        print(f"{field.replace('_', ' ').title()}: {value}\n")


def get_location():
    """Retrieves the user's country based on their public IP address."""
    try:
        # Get the user's public IP address using the ipify API
        ip_response = requests.get("https://api64.ipify.org?format=json")
        ip = ip_response.json().get('ip') # Extract the IP address from the JSON response

        # Use the IP address to get location details from the ipinfo.io API
        location_response = requests.get(f"https://ipinfo.io/{ip}/json")  # Convert response to JSON format
        location_data = location_response.json()

        # Extract the country code (e.g., 'US', 'JM', etc.), defaulting to "unknown" if not found
        country = location_data.get("country", "unknown")

        return country  # Return the detected country code
    except Exception as e:
        # Handle any errors (e.g., network issues, API failures) and return "unknown"
        return "uknown", "unknown"
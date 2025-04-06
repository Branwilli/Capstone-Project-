import re
import requests

# USDA API Configuration
USDA_API_URL = "https://api.nal.usda.gov/fdc/v1/foods/search"
USDA_API_KEY = "6APVHhG2NBGSq8bkCf4ds8hu7a0r1HzHnIeJxe6e"

def query_usda_api(query):
    try:
        response = requests.get(
            USDA_API_URL,
            params={"query": query, "api_key": USDA_API_KEY}
        )
        response.raise_for_status()
        data = response.json()
        if "foods" in data and len(data["foods"]) > 0:
            return data["foods"][0]
        return None
    except requests.RequestException as e:
        print(f"Error querying USDA API: {e}")
        return None

def categorize_text(clustered_texts):
    """
    Categorizes the extracted text into predefined categories such as Nutritional Values, 
    Ingredients, Chemicals, and Others using pattern matching and USDA API.

    Parameters:
    clustered_texts (dict): Output from layout_analysis - dictionary with cluster IDs 
                           as keys and lists of text strings as values

    Returns:
    list: A list of (category, item) tuples for heuristic scoring
    """
    categorized_content = {
        'Nutritional Values': {},
        'Ingredients': [],
        'Chemicals': {},  # Changed from list to dict to store quantities
        'Others': []
    }

    # Define patterns for nutritional values
    nutritional_patterns = {
        'calories': r'(calories|kcal)\s*[:=]?\s*(\d+\.?\d*\s*(kcal|cal)?)',
        'fat': r'(fat|total fat)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'trans fat': r'(trans fat|trans-fatty acids)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'saturated fat': r'(saturated fat|saturates)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'carbohydrates': r'(carbohydrate[s]?|carbs)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'sugar': r'(sugar[s]?)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'protein': r'(protein)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'salt': r'(salt|sodium)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin': r'(vitamin|vitamins)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'fiber': r'(fiber|dietary fiber)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'cholesterol': r'(cholesterol)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'sodium': r'(sodium)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'potassium': r'(potassium)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'calcium': r'(calcium)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'iron': r'(iron)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'magnesium': r'(magnesium)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'zinc': r'(zinc)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin a': r'(vitamin a|retinol)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin c': r'(vitamin c|ascorbic acid)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin d': r'(vitamin d|cholecalciferol)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin e': r'(vitamin e|tocopherol)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin k': r'(vitamin k|phylloquinone)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin b1': r'(vitamin b1|thiamine)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin b2': r'(vitamin b2|riboflavin)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin b3': r'(vitamin b3|niacin)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin b5': r'(vitamin b5|pantothenic acid)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin b6': r'(vitamin b6|pyridoxine)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin b7': r'(vitamin b7|biotin)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin b9': r'(vitamin b9|folate)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'vitamin b12': r'(vitamin b12|cobalamin)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)'
    }

    # Define patterns for chemicals (with quantities)
    chemical_patterns = {
        'E-numbers': r'E\d{3,4}',  
        'sodium compound': r'sodium [a-z]+',  
        'potassium compound': r'potassium [a-z]+',
        'calcium compound': r'calcium [a-z]+',
        'omega-3': r'(omega-3|alpha-linolenic acid)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)',
        'omega-6': r'(omega-6|linoleic acid)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?)',
        'omega-9': r'(omega-9|oleic acid)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?)',
        'caffeine': r'(caffeine)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?)',
        'theobromine': r'(theobromine)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?)',
        'theophylline': r'(theophylline)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?)',
        'lactose': r'(lactose)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?)',
        'gluten': r'(gluten)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?)',
        'sorbitol': r'(sorbitol)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?)',
        'xylitol': r'(xylitol)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?)',
        'mannitol': r'(mannitol)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?)',
        'erythritol': r'(erythritol)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?)',
        'aspartame': r'(aspartame)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?)',
        'sucralose': r'(sucralose)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?)',
        'saccharin': r'(saccharin)\s*[:=]?\s*(\d+\.?\d*\s*[gm]?[gm]?)'
    }

  # Ingredients pattern (list-like items, often comma-separated)
    ingredients_keywords = r'(ingredients|contains|made with)'

    for cluster_id, texts in clustered_texts.items():
        cluster_text = ' '.join(texts).lower()
        
        # Check for Nutritional Values
        for nutrient, pattern in nutritional_patterns.items():
            matches = re.findall(pattern, cluster_text)
            for match in matches:
                value = match[1]
                categorized_content['Nutritional Values'][nutrient] = value
        
        # Check for Chemicals
        for chemical, pattern in chemical_patterns.items():
            matches = re.findall(pattern, cluster_text)
            for match in matches:
                value = match[1] if isinstance(match, tuple) else match
                categorized_content['Chemicals'][chemical] = value

    # Deduplicate Nutritional Values and Chemicals
    categorized_content['Nutritional Values'] = {
        k: v for k, v in categorized_content['Nutritional Values'].items()
    }
    categorized_content['Chemicals'] = {
        k: v for k, v in categorized_content['Chemicals'].items()
    }

    # Convert to a list of (category, item) tuples for heuristic scoring
    result = []
    for category, items in categorized_content.items():
        if category in ['Nutritional Values', 'Chemicals']:
            for key, value in items.items():
                result.append((category, f"{key}: {value}"))
        else:
            for item in items:
                result.append((category, item))
    
    return result
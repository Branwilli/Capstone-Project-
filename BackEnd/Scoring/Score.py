from .General_Score import General_Score
from .Lipids_Score import Lipids_Score
from .Beverage_Score import Beverage_Score

class Score:
    # NutritionValues is of type dictionary [output from the OCR]

    def __init__(self, NutritionValues, ProductName):
        self.package = NutritionValues
        self.prodName = ProductName

    # Fallback assignment of category to 'General' if the category is not provided
    # while accuracy is somewhat affected, it ensures an assessment can still be conducted 
    def assignCategory(self):
        # Assign Category (only need to elimnate 2 of the 3 categories)
        categoryTypes = {"beer": "Beverage", "lager": "Beverage", "stout": "beverage", "ale": "Beverage", "vodka": "Beverage", "rum": "Beverage",
                         "whiskey": "Beveragec", "gin": "Beverage", "tequila": "Beverage", "wine": "Beverage", "brandy": "Beverage",
                         "cocktail": "Beverage", "cider": "Beverage", "drink": "Beverage", "juice": "Beverage", "soda": "Beverage", "pop": "Beverage",
                         "soft drink": "Beverage", "energy drink": "Beverage", "sports drink": "Beverage", "kombucha": "Beverage",
                         "coffee": "Beverage", "tea": "Beverage", "espresso": "Beverage", "latte": "Beverage", "cappuccino": "Beverage",
                         "mocha": "Beverage", "macchiato": "Beverage", "americano": "Beverage", "matcha": "Beverage", "chai": "Beverage",
                         "milk": "Beverage", "almond milk": "Beverage", "soy milk": "Beverage", "coconut milk": "Beverage", "oat milk": "Beverage",
                         "cashew milk": "Beverage", "water": "Beverage", "mineral water": "Beverage", "sparkling water": "Beverage",
                         "spring water": "Beverage", "electrolyte water": "Beverage", "protein shake": "Beverage", "smoothie": "Beverage",
                         "herbal tea": "Beverage", "infused water": "Beverage", "detox drink": "Beverage", "butter": "Lipids", "margarine": "Lipids",
                         "lard": "Lipids", "shortening": "Lipids", "ghee": "Lipids", "tallow": "Lipids", "vegetable oil": "Lipids", 
                         "olive oil": "Lipids", "coconut oil": "Lipids", "corn oil": "Lipids", "canola oil": "LIpids", "palm oil": "Lipids",
                         "sunflower oil": "Lipids", "soybean oil": "Lipids", "avocado oil": "Lipids", "sesame oil": "Lipids", "peanut oil": "Lipids",
                         "flaxseed oil": "Lipids", "almond": "Lipids", "peanut": "Lipids", "cashew": "Lipids", "walnut": "Lipids", "pecan": "Lipids",
                         "hazelnut": "Lipids", "brazil nut": "Lipids", "pistachio": "Lipids", "macadamia nut": "Lipids", "flaxseed": "Lipids", "chia seed": "Lipids",
                         "sunflower seed": "Lipids", "pumpkin seed": "Lipids", "sesame seed": "Lipids", "hemp seed": "Lipids", "poppy seed": "Lipids" }

        prodName = self.prodName.lower()
        found = False

        try:
            prodCategory = categoryTypes[prodName]
            return prodCategory
        except KeyError:
            #split prodName into single keywords
            prodNameList = prodName.split(" ")
            for prod in prodNameList:
                try:
                    prodCategory = categoryTypes[prod]
                    found = True
                    return prodCategory
                except KeyError:
                    continue
            if not found:
                prodCategory = "General"
                return prodCategory
                

    # Returns scoring based on food category
    def evaluate(self):
        # Assign package category
        category = self.assignCategory()

        if category == 'Beverage':
            print("Food item is of 'Beverage' type.")
            pkg = Beverage_Score(self.package)
            return pkg.calculate()
        
        elif category == 'Lipids':
            print("Food item is of 'Fats/Oils/Nuts/Seed' type.")
            pkg = Lipids_Score(self.package)
            return pkg.calculate()
        
        else:
            print("Food item is of 'General' type.")
            pkg = General_Score(self.package)
            return pkg.calculate()
        


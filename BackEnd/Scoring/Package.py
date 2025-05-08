from itertools import takewhile

class PackageComponent:

    def __init__(self, Nutrition_Dict):
        # fvp = proportion (%) of fruit, vegetables, pulses (legumes) 
        # To calculate the fvp, sum the percentages of any fruit, vegtable, pulses

        
        # Assign Calories 
        try: 
            value = self.valConvert(Nutrition_Dict['Calories']) * 4.184 # Convert from kcal to kj
            self.calories = value
        except KeyError:
            return "Error: Key 'Calories' was not found."
    
        # Assign Saturated Fats
        try: 
            value = self.valConvert(Nutrition_Dict['Saturated Fats'])
            self.saturated_fats = value
        except KeyError:
            return "Error: Key 'Saturated Fats' was not found."
        
        # Assign Sodium
        try: 
            value = self.valConvert(Nutrition_Dict['Sodium'])
            self.sodium = (value / 1000) # Convert from mg to g 
        except KeyError:
            return "Error: Key 'Sodium' was not found."
    
        # Assign Sugars
        try: 
            value = self.valConvert(Nutrition_Dict['Sugars'])
            self.sugar = value
        except KeyError:
            return "Error: Key 'Sugars' was not found."
    
        # Assign Protein
        try: 
            value = self.valConvert(Nutrition_Dict['Protein'])
            self.protein = value
        except KeyError:
            return "Error: Key 'Protein' was not found."

        # Assign Dietary Fibre
        try: 
            value = self.valConvert(Nutrition_Dict['Dietary Fibre'])
            self.dietary_fibre = value
        except KeyError:
            return "Error: Key 'Dietary Fibre' was not found."
    
        # Assign FVP
        try: 
            self.fvp = self.fvpCalc(Nutrition_Dict)
        except KeyError:
            print("Error: Cannot determine FVP value")
        
        # Assign Category
        try: 
            self.category = Nutrition_Dict['Category']
        except KeyError:
            self.category = 'General'

    # Processes the value into integer or float format
    def valConvert(self, val):
        validChars = set('0123456789.-')
        if type(val) == str:
            numerical_val_list = list(takewhile(lambda char: char in validChars, val))
            numerical_val = "".join(numerical_val_list)

            try:
                if "." in numerical_val:
                    return float(numerical_val)
                else:
                    return int(numerical_val)
            except ValueError:
                print ("Error: Inconsistent value format")
                return None

        else:
            return val
        
    def fvpCalc(self, NutritionDict):
        fvp_proportion = 0
        
        # Flag for indication of presence
        fruit = vegetable = pulses = False
        
        # Check for presence of fruit, vegetable, pulses separately in case food item contains a mixture
        
        # Fruits
        # Iterate through commonly used fruits in food items
        fruitList = ["Tomato", "Grape", "Apple", "Banana", "Lemon", "Orange", 
                    "Banana", "Mango", "Peach", "Guava", "Avocado"]
        for F in fruitList:
            try:
                fvp_proportion+=self.valConvert(NutritionDict[F])
                fruit = True
            except KeyError:
                pass
        # Check for Fruit or Juice keyword instead
        if not fruit:        
            if "Fruit" in NutritionDict or "Juice" in NutritionDict:
                try:
                    fvp_proportion+=self.valConvert(NutritionDict['Fruit'])
                    fruit = True
                except KeyError:
                    try:
                        fvp_proportion+=self.valConvert(NutritionDict['Juice'])
                    except KeyError:
                        pass
                        print("No presence of fruit.")
            else:
                print("No presence of fruit.")
        
        # Vegetables
        # Iterate through commonly used vegetables in food items
        vegetableList = ["Carrot", "Beetroot", "Ginger", "Cucumber", "Spinach", 
                        "Celery", "Corn", "Cabbage"]
        for V in vegetableList:
            try:
                fvp_proportion+=self.valConvert(NutritionDict[V])
                vegetable = True
            except KeyError:
                pass
        # Check for Vegetable keyword instead        
        if not vegetable:   
            if "Vegetable" in NutritionDict:
                    try:
                        fvp_proportion+=self.valConvert(NutritionDict['Vegetable'])
                    except KeyError:
                        print ("No presence of vegetables.")
            else:
                print ("No presence of vegetables.")

        # Pulses
        # Iterate through commonly used pulses in food items
        PulseList = ["Peas", "Chickpeas", "Beans", "Soyabeans", "Lentils", 
                    "Tofu", "Nuts", "Peanut", "Cashew", "Almond", "Chestnut",
                    "Pecan", "Hazelnut", "Macadamia", "Walnut"]
        for P in PulseList:
            try:
                fvp_proportion+=self.valConvert(NutritionDict[P])
                pulses = True
            except KeyError:
                pass
        # Check for Pulses keyword instead        
        if not pulses:      
            if "Pulse" in NutritionDict or "Pulses" in NutritionDict:
                    try:
                        fvp_proportion+=self.valConvert(NutritionDict['Pulses'])
                    except KeyError:
                        try:
                            fvp_proportion+=self.valConvert(NutritionDict['Pulses'])
                        except KeyError:
                            print ("No presence of pulses.")
            else:
                print ("No presence of pulses.")

        if fvp_proportion > 100:
            return 1
        else:
            return fvp_proportion/100



    def calculate():
        pass


    
   

    
    

    
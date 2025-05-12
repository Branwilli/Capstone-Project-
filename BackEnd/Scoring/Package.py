from abc import ABC, abstractmethod
from itertools import takewhile
import bisect

class PackageComponent(ABC):

    def __init__(self, Nutrition_Dict):
        # fvp = proportion (%) of fruit, vegetables, pulses (legumes) 
        # To calculate the fvp, sum the percentages of any fruit, vegtable, pulses, if over 100%, then default to 100

        # The expectation is that Nutrition_Dict contains the key that corresponds to each nutrition component, even
        # if their value is zero. Therefore if it is not found, the algorithm cannot function.
         
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

    # Processes the string numerical value with characters into integer or float format
    # Example: '10.1g' -> 10.1
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
    

    # fvpCalc assigns the proportion of the amount of fruit, vegetables, and pulses 
    def fvpCalc(self, NutritionDict):
        fvp_proportion = 0
        
        # Flag used for the indication of presence
        fruit = vegetable = pulses = False
        
        # Check for presence of fruit, vegetable, pulses separately in case food item contains a mixture
        
        # Fruits
        # Iterate through commonly used fruits in food items (cummulative point assigment per fruit in mixed fruit food items)
        # fruitList is not exhaustive
        fruitList = {"Tomato", "Grape", "Apple", "Banana", "Lemon", "Orange", 
                    "Banana", "Mango", "Peach", "Guava", "Avocado"}
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
                        print("No presence of fruit.")
            else:
                print("No presence of fruit.")
        
        # Vegetables
        # Iterate through commonly used vegetables in food items (cummulative point assigment per vegetable in mixed vegetable food items)
        # vegetableList is not exhaustive
        vegetableList = {"Carrot", "Beetroot", "Ginger", "Cucumber", "Spinach", 
                        "Celery", "Corn", "Cabbage"}
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
        # Iterate through commonly used pulses in food items (cummulative point assigment for pulses in mixed pulses food items)
        # PulseList is not exhaustive
        PulseList = {"Peas", "Chickpeas", "Beans", "Soyabeans", "Lentils", 
                    "Tofu", "Nuts", "Peanut", "Cashew", "Almond", "Chestnut",
                    "Pecan", "Hazelnut", "Macadamia", "Walnut"}
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
            return 100
        else:
            return fvp_proportion

    # Utilizes the bisect alorithm to determine the indexed item's position whose threshold value is most appropriate based on the target value (nut_amt)
    def Assign_Points(self, nut_amt, threshold, lowerbound, upperbound, sign):

        # threshold consists of a list of ordered lists that comprises of 2 values. Index 0 corresponds to the 'points' and
        # index 1 corresponds to the threshold value.

        # check if nut_amt is outside of the lower and upperbounds
        if nut_amt <= lowerbound:
            return 0
        
        elif nut_amt > upperbound:
            return threshold[-1][0]
        

        
        # search for the index of the element of the array whose threshold value closest matches the nut_amt
        # once found, use it to return the points (index 0) associated with that element
        if sign == 'less': 
            # Since the evalution per nutrient component may be on a less than or equal (<=) or a greater than (>) basis, a 'sign'
            # of 'less' (<=) or 'greater' (>) to assist in accurately determining the index.
            item_index  = bisect.bisect_left(threshold, nut_amt, key=lambda x: x[1]) 

            if item_index < len(threshold):
                return threshold[item_index][0]  # Return corresponding point
            else:
                return None
        
        else:

            item_index  = bisect.bisect_left(threshold, nut_amt, key=lambda x: x[1]) - 1

            if item_index >= 0:
                return threshold[item_index][0]  # Return the largest index where target_value > item[1]
            else:
                return None
            
    # this method assigns a general and/ specialised cummulative total of Positive and Negetive points, calculates the nutriscore
    # and returns the corresponding letter grade(A-E), indicating the nutritional quality. 
    @abstractmethod
    def calculate():
        "Subclasses must provide their own implementation for this method"
        pass


    
   

    
    

    
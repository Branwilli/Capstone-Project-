from .General_Score import General_Score
from .Lipids_Score import Lipids_Score
from .Beverage_Score import Beverage_Score

class Score:
    # NutritionValues is of type dictionary [output from the OCR]

    def __init__(self, NutritionValues):
        self.package = NutritionValues
        

    def assignCategory(self):
        # Assign Category
        try: 
            return self.package['Category']
        except KeyError:
            return 'General'



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
        


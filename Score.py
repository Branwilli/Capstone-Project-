from General_Score import General_Score
from Lipids_Score import Lipids_Score
from Beverage_Score import Beverage_Score

class Score:
    # package is of type dictionary [output from the OCR]

    def __init__(self, package):
        self.package = package

    def assignCategory(self):
        # Beverage Category
        for name in {"mineral water", "table water", "spring water", 
                     "flavoured water", "fruit juice", "nectar", "smoothie",
                     "vegetable juice", "milk", "yogurt", "yoghurt", "plant-based drink", 
                     "chocolate milk", "drink", "juice"}:
        
            if name in self.package['prod_name'].lower():
                return 'beverage'
            
        # Fats/Oil/Seed,Nuts (lipids) Category
        for name in {"margarine", "butter", "whipped cream", "nuts", "peanut butter",
                     "tahini", "vegetable oil", "oilseeds", "sunflower seeds", "linseed"
                     'seeds'}:
            if name in self.package['prod_name'].lower():
                if name != "coconut" or name != "chestnut":
                    return 'lipids' 

        # General Category (incl red meat and cheese)
         # Red Meat
        for name in {"beef", "pork", "lamb", "sheep", "goat meat", "horse meat", "ostrich meat",
                     "meatball", "sausage"}:
            if name in self.package['prod_name'].lower():
                return 'red meat'  
        
        return 'general'
    


    # Returns scoring based on food category
    def evaluate(self):
        # Assign package category
        category = self.assignCategory()
        self.package['category'] = category

        if self.package['category'] == 'beverage':
            pkg = Beverage_Score(self.package['prod_name'], self.package['calories'], self.package['saturated_fats'],
                           self.package['sugar'], self.package['sodium'], self.package['protein'],
                           self.package['dietary_fibre'], self.package['fvp'], self.package['category'],
                           self.package['sweetner'])
            return pkg.calculate()
        
        elif self.package['category'] == 'lipids':
            pkg = Lipids_Score(self.package['prod_name'], self.package['calories'], self.package['saturated_fats'],
                           self.package['sugar'], self.package['sodium'], self.package['protein'],
                           self.package['dietary_fibre'], self.package['fvp'], self.package['category'])
            return pkg.calculate()
        
        else:
            pkg = General_Score(self.package['prod_name'], self.package['calories'], self.package['saturated_fats'],
                           self.package['sugar'], self.package['sodium'], self.package['protein'],
                           self.package['dietary_fibre'], self.package['fvp'], self.package['category'])
            return pkg.calculate()
        


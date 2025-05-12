from Package import PackageComponent

class Beverage_Score(PackageComponent):
    
    
    def __init__(self, Nutrition_Dict):
        super().__init__(Nutrition_Dict)
        self.sweetner = self.sweetnerCheck(Nutrition_Dict)
       
    
    # checks for the presence of sweetners that accrue negative pointss according to the nutriscore documentation 
    def sweetnerCheck(self, Nutrition_Dict):
        sweetners = {"Sorbitol", "Mannitol", "Isomalt", "Alitame", "Polyglycitol Syrup", 
                     "Maltitol", "Lactitol", "Xylitol", "Erythritol"}
        for sweet in sweetners:
            if sweet in Nutrition_Dict:
                return True
        return False
    

    def calculate(self):

        # Capture the Positive and Negative Points
        Positive = 0
        Negative = 0

        # Assign 4 points to Negative if sweetner found
        if self.sweetner:
            Negative+=4
            

        # Negative Points Thresholds
        calories_threshold = [[0, 30] ,[1, 90], [2, 150], [3, 210], [4, 240], [5, 270], [6, 300], 
                              [7, 330], [8, 360], [9, 390]]
        
        sat_fat_threshold = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7] , [8, 8], [9, 9], [10, 10]]

        sugar_threshold = [[0, 0.5], [1, 2], [2, 3.5], [3, 5], [4, 6], [5, 7], [6, 8], [7, 9], [8, 10], 
                           [9, 11]]
        
        sodium_threshold = [[1, 0.2], [2, 0.4], [3, 0.6], [4, 0.8], [5, 1], [6, 1.2], [7, 1.4], [8, 1.6], 
                            [9, 1.8], [10, 2], [11, 2.2], [12, 2.4], [13, 2.6], [14, 2.8], [15, 3], [16, 3.2], 
                            [17, 3.4], [18, 3.6], [19, 3.8], [20, 4]]


        # Positive Points Thresholds
        protein_threshold = [[1, 1.2], [2, 1.5], [3, 1.8], [4, 2.1], [5, 2.4], [6, 2.7], [7, 3.0]]

        dietary_fibre_threshold = [[1, 3.0], [2, 4.1], [3, 5.2], [4, 6.3], [5, 7.4]]

        fvp_threshold = [[2, 40], [4, 60], [6, 80]]


        # Total Negative Points

        # Calories
        try:
            point = self.Assign_Points(self.calories, calories_threshold, calories_threshold[0][1], calories_threshold[-1][1], 'less')
            Negative+=point
        except TypeError:
            return "Error: Assignment of negative calories points cannot be completed. Unexpected Nonetype Value"
        

        # Saturated Fat
        try:
            point = self.Assign_Points(self.saturated_fats, sat_fat_threshold, sat_fat_threshold[0][1], sat_fat_threshold[-1][1], 'greater')
            Negative+=point
        except TypeError:
            return "Error: Assignment of negative saturated fat points cannot be completed. Unexpected Nonetype Value"


        # Sugar
        try:
            point = self.Assign_Points(self.sugar, sugar_threshold, sugar_threshold[0][1], sugar_threshold[-1][1], 'less')
            Negative+=point
        except TypeError:
            return "Error: Assignment of negative sugar points cannot be completed. Unexpected Nonetype Value"


        # Sodium
        try:
            point = self.Assign_Points(self.sodium, sodium_threshold, sodium_threshold[0][1], sodium_threshold[-1][1], 'greater')
            Negative+=point
        except TypeError:
            return "Error: Assignment of negative sodium points cannot be completed. Unexpected Nonetype Value"


        # Total Positive Points

        # Protein
        try:
            point = self.Assign_Points(self.protein, protein_threshold, protein_threshold[0][1], protein_threshold[-1][1], 'greater')
            Positive+=point
        except TypeError:
            return "Error: Assignment of postive protein points cannot be completed. Unexpected Nonetype Value"

        # Dietary Fibre
        try:
            point = self.Assign_Points(self.dietary_fibre, dietary_fibre_threshold, dietary_fibre_threshold[0][1], dietary_fibre_threshold[-1][1], 'greater')
            Positive+=point
        except TypeError:
            return "Error: Assignment of positive dietary fibre points cannot be completed. Unexpected Nonetype Value"

        # Fruits, Vegetables, Pulses
        try:
            point = self.Assign_Points(self.fvp, fvp_threshold, fvp_threshold[0][1], fvp_threshold[-1][1], 'greater')
            Positive+=point
        except TypeError:
            return "Error: Assignment of positive fvp points cannot be completed. Unexpected Nonetype Value"
        

        # Calculation Scheme

        NutriScore = Negative - Positive
       
        
        # Evaluation Scheme

        # If NutriScore == 0, then the food item is likely "water" without negative additives which == 'A'
        if NutriScore == 0: 
            return 'A'
        if NutriScore <= 2:
            return 'B'
        elif NutriScore >=3 and NutriScore<=6:
            return 'C'
        elif NutriScore >=7 and NutriScore<=9:
            return 'D'
        elif NutriScore >=10:
            return 'E'
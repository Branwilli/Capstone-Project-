from .Package import PackageComponent

class General_Score(PackageComponent):

    def __init__(self, Nutrition_Dict):
        super().__init__(Nutrition_Dict)
    
    #def getCategory(self):
    #    return self.category
    
    def calculate(self):

        # Capture the Positive and Negative Points
        Positive = 0
        Negative = 0

        # Negative Points Thresholds
        calories_threshold = [[1, 335], [2, 670], [3, 1005], [4, 1340], [5, 1675], [6, 2010], 
                              [7, 2345], [8, 2680], [9, 3015], [10, 3350]]
        
        sat_fat_threshold = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6], [7, 7] , [8, 8], [9, 9], [10, 10]]

        sugar_threshold = [[1, 3.4], [2, 6.8], [3, 10], [4, 14], [5, 17], [6, 20], [7, 24], [8, 27], 
                           [9, 31], [10, 34], [11, 37], [12, 41], [13, 44], [14, 48], [15, 51]]
        
        sodium_threshold = [[1, 0.2], [2, 0.4], [3, 0.6], [4, 0.8], [5, 1], [6, 1.2], [7, 1.4], [8, 1.6], 
                            [9, 1.8], [10, 2], [11, 2.2], [12, 2.4], [13, 2.6], [14, 2.8], [15, 3], [16, 3.2], 
                            [17, 3.4], [18, 3.6], [19, 3.8], [20, 4]]


        # Positive Points Thresholds
        protein_threshold = [[1, 2.4], [2, 4.8], [3, 7.2], [4, 9.6], [5, 12], [6, 14], [7, 17]]

        dietary_fibre_threshold = [[1, 3.0], [2, 4.1], [3, 5.2], [4, 6.3], [5, 7.4]]

        fvp_threshold = [[1, 40], [2, 60], [5, 80]]


        # Total Negative Points

        # Calories
        try:
            point = self.Assign_Points(self.calories, calories_threshold, calories_threshold[0][1], calories_threshold[-1][1], 'greater')
            Negative+=point
        except TypeError:
            return "Error: Assignment of negative calorie points cannot be completed. Unexpected Nonetype Value"
        

        # Saturated Fat
        try:
            point = self.Assign_Points(self.saturated_fats, sat_fat_threshold, sat_fat_threshold[0][1], sat_fat_threshold[-1][1], 'greater')
            Negative+=point
        except TypeError:
            return "Error: Assignment of negative saturated fat points cannot be completed. Unexpected Nonetype Value"


        # Sugar
        try:
            point = self.Assign_Points(self.sugar, sugar_threshold, sugar_threshold[0][1], sugar_threshold[-1][1], 'greater')
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
        fvpPoints = 0
        fibrePoints = 0

        # Protein

        # Note: Though certain food type like Red Meat may be assigned to its own Category,
        # its score is calculated with the General_Score algorithm. The only difference is that
        # the max positive points for protein is set at 2.  
        try:
            point = self.Assign_Points(self.protein, protein_threshold, protein_threshold[0][1], protein_threshold[-1][1], 'greater')
            Positive+=point
            #if self.getCategory() == 'Red Meat' and point > 2:
            #    Positive+=2
            #else:
            #    Positive+=point
        except TypeError:
            return "Error: Assignment of positve protein points cannot be completed. Unexpected Nonetype Value"


        # Dietary Fibre
        try:
            point = self.Assign_Points(self.dietary_fibre, dietary_fibre_threshold, dietary_fibre_threshold[0][1], dietary_fibre_threshold[-1][1], 'greater')
            Positive+=point
            fibrePoints = point
        except TypeError:
            return "Error: Assignment of positive dietary fibre cannot be completed. Unexpected Nonetype Value"


        # Fruits, Vegetables, Pulses
        try:
            point = self.Assign_Points(self.fvp, fvp_threshold, fvp_threshold[0][1], fvp_threshold[-1][1], 'greater')
            Positive+=point
            fvpPoints = point
        except TypeError:
            return "Error: Assignment of positive fvp points cannot be completed. Unexpected Nonetype Value"

      
        # Calculation Scheme

        if Negative > 11:
            NutriScore = Negative - fibrePoints - fvpPoints
        else:
            NutriScore = Negative - Positive

        
        # Evaluation Scheme

        if NutriScore <= 0:
            return 'A'
        elif NutriScore >=1 and NutriScore<=2:
            return 'B'
        elif NutriScore >=3 and NutriScore<=10:
            return 'C'
        elif NutriScore >=11 and NutriScore<=18:
            return 'D'
        else:
            return 'E'
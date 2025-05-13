from .Package import PackageComponent

# This class refers to Fats/Oils/Nuts/Seeds
class Lipids_Score(PackageComponent):

    def __init__(self, Nutrition_Dict):
        super().__init__(Nutrition_Dict)

    
    def calculate(self):

        # Capture the Positive and Negative Points
        Positive = 0
        Negative = 0

        # Negative Points Thresholds
        calories_threshold = [[1, 120], [2, 240], [3, 360], [4, 480], [5, 600], [6, 720], 
                              [7, 840], [8, 960], [9, 1080], [10, 1200]]

        #** Energy(calories) from saturated fatty acids = saturated fatty acids [g/100g] x 37 kJ/g
        self.calories = self.saturated_fats * 37
        
        sat_fat_threshold = [[0, 10], [1, 16], [2, 22], [3, 28], [4, 34], [5, 40], [6, 46], [7, 52] , [8, 58], 
                             [9, 64]]
        

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
            return "Error: Assignment of negative calorie points cannot be completed. Unexpected Nonetype value."
        

        # Saturated Fat
        try:
            point = self.Assign_Points(self.saturated_fats, sat_fat_threshold, sat_fat_threshold[0][1], sat_fat_threshold[-1][1], 'less')
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
        try:
            point = self.Assign_Points(self.protein, protein_threshold, protein_threshold[0][1], protein_threshold[-1][1], 'greater')
            Positive+=point
        except TypeError:
            return "Error: Assignment of positive protein points cannot be completed. Unexpected Nonetype Value"

        # Dietary Fibre
        try:
            point = self.Assign_Points(self.dietary_fibre, dietary_fibre_threshold, dietary_fibre_threshold[0][1], dietary_fibre_threshold[-1][1], 'greater')
            Positive+=point
            fibrePoints=point
        except TypeError:
            return "Error: Assignment of positive dietary fibre points cannot be completed. Unexpected Nonetype Value"
      
        # Fruits, Vegetables, Pulses
        try:
            point = self.Assign_Points(self.fvp, fvp_threshold, fvp_threshold[0][1], fvp_threshold[-1][1], 'greater')
            Positive+=point
            fvpPoints=point
        except TypeError:
            return "Error: Assignment of positve fvp points cannot be completed. Unexpected Nonetype Value"


        # Calculation Scheme

        if Negative >= 7:
            NutriScore = Negative - fibrePoints - fvpPoints
        else:
            NutriScore = Negative - Positive

        
        # Evaluation Scheme

        if NutriScore <= -6:
            return 'A'
        elif NutriScore >=-5 and NutriScore<=2:
            return 'B'
        elif NutriScore >=3 and NutriScore<=10:
            return 'C'
        elif NutriScore >=11 and NutriScore<=18:
            return 'D'
        else:
            return 'E'
        
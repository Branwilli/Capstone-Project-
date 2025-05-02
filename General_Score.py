from Package import PackageComponent

class General_Score(PackageComponent):

    def __init__(self, Nutrition_Dict):
        super().__init__(Nutrition_Dict)
    
    def getCategory(self):
        return self.category
    
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

        for cals in list(reversed(calories_threshold)):
            if self.calories > cals[1]:
                Negative+=cals[0]
                break
        

        # Saturated Fat

        for fats in list(reversed(sat_fat_threshold)):
            if self.saturated_fats > fats[1]:
                Negative+=fats[0]
                break


        # Sugar

        for sugr in list(reversed(sugar_threshold)):
            if self.sugar > sugr[1]:
                Negative+=sugr[0]
                break


        # Sodium

        for salt in list(reversed(sodium_threshold)):
            if self.sodium > salt[1]:
                Negative+=salt[0]
                break


        # Total Positive Points
        fvpPoints = 0
        fibrePoints = 0

        # Protein

        for prot in list(reversed(protein_threshold)):
            if self.protein > prot[1]:

                # Special rule for red meat and products with red meat
                 # For products in the red meat category, the number of points
                 #  for protein is limited to a maximum of 2 points.
                if self.category == 'Red Meat':
                    if prot[0] > 2:
                        Positive+=2
                else:
                    Positive+=prot[0]
      
                break

        # Dietary Fibre

        for d_fibre in list(reversed(dietary_fibre_threshold)):
            if self.dietary_fibre > d_fibre[1]:
                fibrePoints = d_fibre[0]
                Positive+=d_fibre[0]
                break

        # Fruits, Vegetables, Pulses

        for f_v_p in list(reversed(fvp_threshold)):
            if self.fvp > f_v_p[1]:
                fvpPoints = f_v_p[0]
                Positive+=f_v_p[0]
                break

        
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
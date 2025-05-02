from Package import PackageComponent

class Beverage_Score(PackageComponent):
    
    
    def __init__(self, Nutrition_Dict):
        super().__init__(Nutrition_Dict)
        self.sweetner = self.sweetnerCheck(Nutrition_Dict)


    def getCategory(self):
        return self.category
    
    
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

        if self.calories > 390:
            Negative+=10
        else:
            for cals in calories_threshold:
                if self.calories <= cals[1]:
                    Negative+=cals[0]
                    break
        

        # Saturated Fat

        for fats in list(reversed(sat_fat_threshold)):
            if self.saturated_fats > fats[1]:
                Negative+=fats[0]
                break


        # Sugar

        if self.sugar > 11:
            Negative+=10
        else:
            for sugr in sugar_threshold:
                if self.sugar <= sugr[1]:
                    Negative+=sugr[0]
                    break


        # Sodium

        for salt in list(reversed(sodium_threshold)):
            if self.sodium > salt[1]:
                Negative+=salt[0]
                break


        # Total Positive Points

        # Protein

        for prot in list(reversed(protein_threshold)):
            if self.protein > prot[1]:
                Positive+=prot[0]
                break

        # Dietary Fibre

        for d_fibre in list(reversed(dietary_fibre_threshold)):
            if self.dietary_fibre > d_fibre[1]:
                Positive+=d_fibre[0]
                break

        # Fruits, Vegetables, Pulses

        for f_v_p in list(reversed(fvp_threshold)):
            if self.fvp > f_v_p[1]:
                Positive+=f_v_p[0]
                break
        

        # Calculation Scheme

        NutriScore = Negative - Positive
       
        
        # Evaluation Scheme

        # If NutriScore == 0, then the food item is likely "water" with no negative additives which == 'A'
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
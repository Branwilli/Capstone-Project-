
class PackageComponent:

    """
    PackageComponent Format = {'product_name':string, 'calories':float, 'saturated_fats':float, 'sugar':float, 
    'protein':float, 'dietary_fibre':float, fvp ={} (key:value pairs = {fruits:int(%), vegetables:int(%), 
    pulses:int(%)}), category:string (initalized as 'None')}
    """

    def __init__(self, prod_name, calories, saturated_fats, sugar, sodium, protein, dietary_fibre, fvp, category=None):
        # fvp = percentage of fruit, vegetables, pulses (legumes)
        # To calculate the fvp, sum the percentages of any fruit, vegtable, pulses

        self.prod_name = prod_name
        self.calories = calories * 4.184 # Convert from kcal to kj
        self.saturated_fats = saturated_fats
        self.sugar = sugar
        self.sodium = (sodium / 1000) # Convert from mg to g 
        self.protein = protein
        self.dietary_fibre = dietary_fibre
        self.fvp = fvp
        self.category = category

    def fvpCalc(self):
        total = 0
        for fvpValues in self.fvp.values():
            total+=(fvpValues/100)
        return total


    def calculate():
        pass


    
   

    
    

    
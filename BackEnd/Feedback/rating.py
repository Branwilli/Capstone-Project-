import tkinter as tk
from tkinter import messagebox, simpledialog


# Function to update star display
def update_stars(rating, star_buttons):
    for i in range(5):
        if i < rating:
            star_buttons[i].config(text="★", fg="gold")  # Highlight selected stars
        else:
            star_buttons[i].config(text="☆", fg="black")  # Unselected stars
    rating_var.set(rating)

# Function to handle rating submission
def submit_rating():
    rating = rating_var.get()
    if rating == 0:
        messagebox.showwarning("No Selection", "Please select a rating before submitting.")
        return
    
    feedback = ""
    
    # If rating is below 5, ask for feedback
    if rating < 5:
        feedback = simpledialog.askstring("Feedback", "What could be improve? (Optional)")
    

    with open("ratings.txt", "a") as file:
        file.write(f"User Rating: {rating}\n")
        if feedback:
            file.write(f"Feedback: {feedback}\n")

    messagebox.showinfo("Thank You!", f"Thank you for rating us {rating}/5!")
    root.destroy()  # Close the panel after submission

def show_rating_panel():
    global root, rating_var
    # Create main window
    root = tk.Tk()
    root.title("Rating Panel")
    root.geometry("300x200")
    root.resizable(False, False)

    # Heading Label
    label = tk.Label(root, text="Rate Your Interaction", font=("Arial", 14))
    label.pack(pady=10)

    # Variable to store rating
    rating_var = tk.IntVar(value=0)

    # Create a frame for stars
    star_frame = tk.Frame(root)
    star_frame.pack()

    # Create star buttons
    star_buttons = []
    for i in range(5):
        btn = tk.Button(star_frame, text="☆", font=("Arial", 20), command=lambda i=i: update_stars(i+1, star_buttons))
        btn.pack(side=tk.LEFT, padx=5)
        star_buttons.append(btn)

    # Submit Button
    submit_btn = tk.Button(root, text="Submit", command=submit_rating, font=("Arial", 12), bg="blue", fg="white")
    submit_btn.pack(pady=20)

    # Run the application
    root.mainloop()

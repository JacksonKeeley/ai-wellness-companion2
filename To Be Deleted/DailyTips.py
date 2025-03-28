
import random

#create two arrays. One for the Tips another to ensure no repeat tips are output
DailyTips = [1,2,3,4,5,6,7,8,9,10]
Repeatarray = []

def random_element():
    attempts = 0
    while attempts < 20:
        selected = random.choice(DailyTips)
        if selected not in Repeatarray:
            Repeatarray.append(selected)
            return selected
        attempts += 1
    return "No more unique DailyTips"

# usage of the random_element class

for _ in range(15):
    result = random_element()
    print(f"selected: {result}")
    if result == "No more unique DailyTips":
        break













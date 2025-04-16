import unittest
from unittest.mock import patch
import random

# Arrays for tips and repeats
DailyTips = ["Practice Gratitude: Keep a journal to track three things you're grateful for and three achievements daily. Reflecting on positive aspects of your life can enhance happiness",
            "Exercise Regularly: Aim for at least 30 minutes of physical activity daily, such as walking or yoga. Exercise reduces stress hormones and boosts mood-enhancing chemicals like serotonin",
            "Prioritize Sleep: Establish a consistent sleep routine and avoid screens before bedtime to improve sleep quality. Sleep is essential for emotional regulation and mental clarity", 
            "Eat a Balanced Diet: Incorporate omega-3s, fruits, vegetables, and whole grains into your meals while reducing processed foods and refined sugars. Nutrition directly impacts mood and brain health", 
            "Connect with Others: Build strong relationships by spending time with friends, family, or community groups. Social connections improve emotional resilience and overall well-being", 
            "Take Breaks from Technology: Schedule tech-free periods to reduce stress and focus on face-to-face interactions or hobbies like reading or painting", 
            "Practice Mindfulness: Engage in mindfulness exercises such as meditation or deep breathing to stay present and calm during stressful moments", 
            "Engage in Meaningful Activities: Pursue hobbies or creative outlets that bring joy and purpose, like cooking, gardening, or volunteering", 
            "Give Back to Others: Acts of kindness—whether volunteering or expressing gratitude—can create positive feelings and foster a sense of purpose", 
            "Spend Time in Nature: Take daily walks outdoors or relax in natural settings to reduce stress and boost energy levels"]
Repeatarray = []

def random_element():
    if not DailyTips:  # Check if DailyTips is empty
        return "No more unique DailyTips"
    
    attempts = 0
    while attempts < 11:
        selected = random.choice(DailyTips)
        if selected not in Repeatarray:
            Repeatarray.append(selected)
            return selected
        attempts += 1
    return "No more unique DailyTips"

class TestRandomSelection(unittest.TestCase):
    def setUp(self):
        global Repeatarray, DailyTips
        Repeatarray.clear()
        DailyTips = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]  # Reset DailyTips
    
    def test_unique_selection(self):
        """Test successful unique selection"""
        with patch('random.choice') as mock_choice:
            mock_choice.side_effect = [5, 7]
            result = random_element()
            self.assertEqual(result, 5)
            self.assertIn(5, Repeatarray)

    def test_duplicate_reroll(self):
        """Test reroll when duplicate is selected"""
        global Repeatarray
        Repeatarray = [5]
        
        with patch('random.choice') as mock_choice:
            mock_choice.side_effect = [5, 7]
            result = random_element()
            self.assertEqual(result, 7)
            self.assertIn(7, Repeatarray)

    def test_max_attempts_exceeded(self):
        """Test maximum attempt handling"""
        global Repeatarray
        Repeatarray = list(range(1, 11))
        
        result = random_element()
        self.assertEqual(result, "No more unique DailyTips")

    def test_edge_case_empty_array(self):
        """Test behavior with empty DailyTips[]"""
        global DailyTips, Repeatarray
        original_DailyTips = DailyTips.copy()
        DailyTips.clear()
        
        result = random_element()
        self.assertEqual(result, "No more unique DailyTips")
        DailyTips = original_DailyTips

if __name__ == '__main__':
    import sys

    if len(sys.argv) > 1 and sys.argv[1] == '--test':
        unittest.main(argv=[''], verbosity=2, exit=False)
    else: 
        print("Demo Mode:")
        for _ in range(15):
            result = random_element()
            print(f"Selected: {result}")
            print(f"RepeatArray: {Repeatarray}")
            if result == "No more unique DailyTips":
                break

        run_tests = input("\nWould you like to run the unit tests? (y/n):").lower().strip()
        if run_tests == 'y':
            unittest.main(argv=[''], verbosity=2, exit=False)

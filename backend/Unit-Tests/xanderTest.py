#Credit to BannedDahn for the last-minute save!

import unittest
import requests

BASE_URL = "http://localhost:4000"

class testGetAffirmation(unittest.TestCase):
    def test_getAffirmation(self):
        quote1 = requests.get(f"{BASE_URL}/affirmation")
        quote2 = requests.get(f"{BASE_URL}/affirmation")

        affirmation1 = quote1.json().get("affirmation")
        affirmation2 = quote2.json().get("affirmation")

        self.assertIsInstance(affirmation1, str, "Returned affirmation should be a string")
        self.assertTrue(len(affirmation1) > 0, "Affirmation should not be an empty string")
        self.assertIn(affirmation1, [
            "I am confident and strong.",
            "I deserve happiness and success.",
            "I am in control of my thoughts and emotions.",
            "I radiate positive energy.",
            "I am growing and improving every day."
        ], "Returned affirmation should be from the predefined list")

        print(f"Test Passed: Retrieved Affirmation - '{affirmation1}'")
        
        if affirmation1 == affirmation2:
            print("Warning: Both affirmations were the same. Might be due to randomness.")
        else:
            print(f"Test Passed: Retrieved Another Affirmation - '{affirmation2}'")

if __name__ == '__main__':
    unittest.main()

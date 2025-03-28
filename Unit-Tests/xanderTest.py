#Credit to whoever made the analytics test. I did it wrong!

import unittest
import requests

BASE_URL = "http://localhost:4000"

class testGetAffirmation(unittest.TestCase):

    @classmethod
    def test_getAffirmation(self):
        quote1 = requests.get(f"{BASE_URL}/affirmation")
        quote2 = requests.get(f"{BASE_URL}/affirmation")
        
        self.assertTrue(quote1, str, "Returned quote should be a string")
        self.assertTrue(len(quote1), 0, "Returned quote should not be empty")
        self.assertIn(quote1, [
            "I am confident and strong.",
            "I deserve happiness and success.",
            "I am in control of my thoughts and emotions.",
            "I radiate positive energy.",
            "I am growing and improving every day."
        ], "Returned quote should be from the predefined list")

        print(f"Test Passed: Retrieved Quote - '{quote1}'")
        
        # Checking if multiple calls return different quotes (though not guaranteed)
        if len(set([quote1, quote2])) == 1:
            print("Warning: Both quotes were the same. Might be due to randomness.")
        else:
            print(f"Test Passed: Retrieved Another Quote - '{quote2}'")

if __name__ == '__main__':
    unittest.main()

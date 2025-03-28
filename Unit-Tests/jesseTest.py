import unittest
from feelAmazing import feelAmazing

class testFeelAmazing(unittest.TestCase):
    def setUp(self):
        self.motivation = feelAmazing()
    
    def test_feelAmazing(self):
        quote1 = self.motivation.feelAmazing()
        quote2 = self.motivation.feelAmazing()
        
        self.assertTrue(quote1, str, "Returned quote should be a string")
        self.assertTrue(len(quote1), 0, "Returned quote should not be empty")
        self.assertIn(quote1, [
            "Believe in yourself and all that you are.",
            "You are capable of amazing things!",
            "Every day is a fresh start.",
            "Difficult roads often lead to beautiful destinations.",
            "Your only limit is your mind."
        ], "Returned quote should be from the predefined list")

        print(f"Test Passed: Retrieved Quote - '{quote1}'")
        
        # Checking if multiple calls return different quotes (though not guaranteed)
        if len(set([quote1, quote2])) == 1:
            print("Warning: Both quotes were the same. Might be due to randomness.")
        else:
            print(f"Test Passed: Retrieved Another Quote - '{quote2}'")

if __name__ == '__main__':
    unittest.main()

import unittest
import requests

BASE_URL = "http://localhost:4000"

class TestAnalytics(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        """Runs once before all tests"""
        print("\nSetting up tests...")

    def setUp(self):
        """Runs before each test to reset analytics"""
        response = requests.post(f"{BASE_URL}/reset-analytics")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Analytics reset successfully."})

    def test_analytics_initial_state(self):
        """Test if analytics is empty after reset"""
        response = requests.get(f"{BASE_URL}/analytics")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get("usage", {}), {})

    def test_analytics_single_hit(self):
        """Test if a single request is tracked correctly"""
        requests.get(f"{BASE_URL}/motivation")
        response = requests.get(f"{BASE_URL}/analytics")
        usage_data = response.json().get("usage", {})

        self.assertEqual(usage_data.get("/motivation", 0), 1)

    def test_analytics_multiple_hits(self):
        """Test if multiple requests are counted properly"""
        requests.get(f"{BASE_URL}/motivation")
        requests.get(f"{BASE_URL}/motivation")
        requests.get(f"{BASE_URL}/affirmation")
        requests.get(f"{BASE_URL}/breathing")

        response = requests.get(f"{BASE_URL}/analytics")
        usage_data = response.json().get("usage", {})

        self.assertEqual(usage_data.get("/motivation", 0), 2)
        self.assertEqual(usage_data.get("/affirmation", 0), 1)
        self.assertEqual(usage_data.get("/breathing", 0), 1)

    def test_analytics_no_requests(self):
        """Test if analytics stays empty when no routes are accessed"""
        response = requests.get(f"{BASE_URL}/analytics")
        usage_data = response.json().get("usage", {})

        self.assertEqual(usage_data, {})

if __name__ == "__main__":
    unittest.main()

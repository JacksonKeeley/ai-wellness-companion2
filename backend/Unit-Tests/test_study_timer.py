import time
import unittest

def start_timer():
    return time.time()

def stop_timer(start_time):
    return time.time() - start_time

class TestStudyTimer(unittest.TestCase):
    def test_timer(self):
        start = start_timer()
        time.sleep(1)  # Simulate 1 second passing
        elapsed = stop_timer(start)
        self.assertTrue(0.9 <= elapsed <= 1.1)  # Allow small margin for timing

if __name__ == '__main__':
    unittest.main()

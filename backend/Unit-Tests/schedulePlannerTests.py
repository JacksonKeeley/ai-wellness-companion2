from datetime import datetime, timedelta

class SchedulePlanner:
    def __init__(self):
        self.appointments = []
    
    def book_session(self, user_id, therapist_id, session_time):
        """Books a new therapy session if the slot is available."""
        if any(appt for appt in self.appointments if appt['session_time'] == session_time and appt['therapist_id'] == therapist_id):
            return "Time slot unavailable. Choose a different time."
        
        self.appointments.append({
            'user_id': user_id,
            'therapist_id': therapist_id,
            'session_time': session_time
        })
        return "Session booked successfully."
    
    def cancel_session(self, user_id, session_time):
        """Cancels a therapy session if the user has booked it."""
        for appt in self.appointments:
            if appt['user_id'] == user_id and appt['session_time'] == session_time:
                self.appointments.remove(appt)
                return "Session canceled successfully."
        return "No matching session found."
    
    def view_schedule(self, therapist_id, date):
        """Returns all sessions for a given therapist on a particular date."""
        return [appt for appt in self.appointments if appt['therapist_id'] == therapist_id and appt['session_time'].date() == date]

# Unit Tests
import unittest

class TestSchedulePlanner(unittest.TestCase):
    def setUp(self):
        self.planner = SchedulePlanner()
        self.session_time1 = datetime.now() + timedelta(days=1, hours=2)
        self.session_time2 = datetime.now() + timedelta(days=1, hours=3)
        
    def test_book_session(self):
        result = self.planner.book_session(1, 101, self.session_time1)
        self.assertEqual(result, "Session booked successfully.")
        self.assertEqual(len(self.planner.appointments), 1)
        print("test_book_session passed")
        
    def test_book_conflicting_session(self):
        self.planner.book_session(1, 101, self.session_time1)
        result = self.planner.book_session(2, 101, self.session_time1)
        self.assertEqual(result, "Time slot unavailable. Choose a different time.")
        print("test_book_conflicting_session passed")
        
    def test_cancel_session(self):
        self.planner.book_session(1, 101, self.session_time1)
        result = self.planner.cancel_session(1, self.session_time1)
        self.assertEqual(result, "Session canceled successfully.")
        self.assertEqual(len(self.planner.appointments), 0)
        print("test_cancel_session passed")
        
    def test_cancel_non_existent_session(self):
        result = self.planner.cancel_session(1, self.session_time1)
        self.assertEqual(result, "No matching session found.")
        print("test_cancel_non_existent_session passed")
        
    def test_view_schedule(self):
        self.planner.book_session(1, 101, self.session_time1)
        self.planner.book_session(2, 101, self.session_time2)
        schedule = self.planner.view_schedule(101, self.session_time1.date())
        self.assertEqual(len(schedule), 2)
        print("test_view_schedule passed")
        
if __name__ == "__main__":
    unittest.main()

# tests/load/test_load.py
import pytest
import requests
import time
import concurrent.futures

@pytest.mark.load
class TestAPILoad:
    def make_request(self, api_client, test_payload):
        """Make a single request and return response time"""
        start_time = time.time()
        response = requests.post(
            f"{api_client['base_url']}/api/process/",
            headers=api_client['headers'],
            json=test_payload
        )
        end_time = time.time()
        return end_time - start_time, response.status_code

    def test_concurrent_requests(self, api_client, test_payload):
        """Test multiple concurrent requests"""
        num_requests = 10
        response_times = []
        status_codes = []
        
        print(f"\nStarting load test against {api_client['base_url']}")
        print(f"Making {num_requests} concurrent requests...")
        
        with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
            futures = [
                executor.submit(self.make_request, api_client, test_payload)
                for _ in range(num_requests)
            ]
            
            for i, future in enumerate(concurrent.futures.as_completed(futures), 1):
                response_time, status_code = future.result()
                response_times.append(response_time)
                status_codes.append(status_code)
                print(f"Request {i}/{num_requests} completed: {status_code} ({response_time:.2f}s)")
        
        # calculate statistics
        avg_time = sum(response_times) / len(response_times)
        max_time = max(response_times)
        min_time = min(response_times)
        success_rate = status_codes.count(200) / len(status_codes)
        
        # print results
        print(f"\nLoad Test Results:")
        print(f"Environment: {Config.ENVIRONMENT}")
        print(f"Average response time: {avg_time:.2f}s")
        print(f"Max response time: {max_time:.2f}s")
        print(f"Min response time: {min_time:.2f}s")
        print(f"Success rate: {success_rate*100:.1f}%")
        
        # status code breakdown
        status_breakdown = {}
        for code in status_codes:
            status_breakdown[code] = status_breakdown.get(code, 0) + 1
        print("\nStatus Code Breakdown:")
        for code, count in status_breakdown.items():
            print(f"  HTTP {code}: {count} requests")
        
        # assertions
        assert success_rate >= 0.9, "Success rate below 90%"
        assert avg_time < 5.0, "Average response time above 5 seconds"
        
        if avg_time > 2.0:
            print("\nWarning: Average response time is above 2 seconds")
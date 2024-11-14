# tests/integration/test_live_api.py
import pytest
import requests
import json

@pytest.mark.integration
class TestLiveAPI:
    def test_simple_addition(self, api_client, test_payload):
        """Test simple addition equation"""
        response = requests.post(
            f"{api_client['base_url']}/api/process/",
            headers=api_client['headers'],
            json=test_payload
        )
        
        assert response.status_code == 200
        data = response.json()
        assert 'errors' in data
        assert 'nominals' in data
        print(f"Response data: {json.dumps(data, indent=2)}")

    def test_complex_equation(self, api_client):
        """Test complex mathematical equation"""
        payload = {
            "equation": "sin(a*b)/c",
            "variables": ["a", "b", "c"],
            "nominalValues": ["1.0", "2.0", "3.0"],
            "errorValuesVariable": ["0.1", "0.1", "0.1"],
            "errorValuesConstant": ["0", "0", "0"],
            "constErrors": [False, False, False],
            "roundResult": True
        }
        
        response = requests.post(
            f"{api_client['base_url']}/api/process/",
            headers=api_client['headers'],
            json=payload
        )
        
        assert response.status_code == 200
        data = response.json()
        print(f"Complex equation result: {json.dumps(data, indent=2)}")

    def test_invalid_equation(self, api_client, test_payload):
        """Test invalid equation handling"""
        payload = test_payload.copy()
        payload["equation"] = "a += b"  # invalid syntax
        
        response = requests.post(
            f"{api_client['base_url']}/api/process/",
            headers=api_client['headers'],
            json=payload
        )
        
        print(f"Invalid equation response: {response.json()}")

        assert response.status_code == 400
        data = response.json()
        assert 'error' in data

    def test_latency(self, api_client, test_payload):
        """Test API response time"""
        import time
        start_time = time.time()
        
        response = requests.post(
            f"{api_client['base_url']}/api/process/",
            headers=api_client['headers'],
            json=test_payload
        )
        
        end_time = time.time()
        latency = end_time - start_time
        
        print(f"API Latency: {latency:.2f} seconds")
        assert latency < 10.0  # should respond within 10 seconds
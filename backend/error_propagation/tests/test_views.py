from django.test import TestCase, Client
from django.urls import reverse
import json
from datetime import datetime

class ErrorPropagationViewTests(TestCase):
    def setUp(self):
        """Set up test case"""
        self.client = Client()
        self.process_url = reverse('process_data')
        self.headers = {
            "Content-Type": "application/json",
        }
    
    def test_process_endpoint_valid_equation(self):
        """Test the process endpoint with valid equation"""
        data = {
            "equation": "a + b",
            "variables": ["a", "b"],
            "nominalValues": ["10", "5"],
            "errorValuesVariable": ["0.1", "0.2"],
            "errorValuesConstant": ["0", "0"],
            "constErrors": [False, False],
            "roundResult": True
        }
        
        response = self.client.post(
            self.process_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        response_data = response.json()
        self.assertIn('errors', response_data)
        self.assertIn('nominals', response_data)
        print(f"Valid equation response: {response_data}")

    def test_process_endpoint_complex_equation(self):
        """Test with complex mathematical equation"""
        data = {
            "equation": "sin(a*b)/c",
            "variables": ["a", "b", "c"],
            "nominalValues": ["1.0", "2.0", "3.0"],
            "errorValuesVariable": ["0.1", "0.1", "0.1"],
            "errorValuesConstant": ["0", "0", "0"],
            "constErrors": [False, False, False],
            "roundResult": True
        }
        
        response = self.client.post(
            self.process_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        print(f"Complex equation response: {response.json()}")

    def test_error_handling(self):
        """Test error responses"""
        # test invalid equation
        data = {
            "equation": "a += b",  # invalid equation
            "variables": ["a", "b"],
            "nominalValues": ["10", "5"],
            "errorValuesVariable": ["0.1", "0.2"],
            "errorValuesConstant": ["0", "0"],
            "constErrors": [False, False],
            "roundResult": True
        }
        
        response = self.client.post(
            self.process_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_method_not_allowed(self):
        """Test GET request (should fail)"""
        response = self.client.get(self.process_url)
        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.json())

    def test_missing_data(self):
        """Test with missing required fields"""
        data = {
            "equation": "a + b",
            # missing other required fields
        }
        
        response = self.client.post(
            self.process_url,
            data=json.dumps(data),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 400)

    def test_zero_division(self):
        """Test division by zero handling"""
        data = {
            "equation": "a / b",
            "variables": ["a", "b"],
            "nominalValues": ["10", "0"],  # division by zero
            "errorValuesVariable": ["0.1", "0.1"],
            "errorValuesConstant": ["0", "0"],
            "constErrors": [False, False],
            "roundResult": True
        }
        
        response = self.client.post(
            self.process_url,
            data=json.dumps(data),
            content_type='application/json'
        )

    
        print("Zero division response: ", response.json())
        self.assertEqual(response.json()['nominals'][0], 'undefined')
        self.assertEqual(response.json()['errors'][0], 'undefined')
        self.assertEqual(response.status_code, 200)

    def test_constant_errors(self):
        """Test with constant errors"""
        data = {
            "equation": "a * b",
            "variables": ["a", "b"],
            "nominalValues": ["100", "50"],
            "errorValuesVariable": ["0", "0"],
            "errorValuesConstant": ["1", "2"],
            "constErrors": [True, True],
            "roundResult": True
        }
        
        response = self.client.post(
            self.process_url,
            data=json.dumps(data),
            content_type='application/json'
        )
        
        self.assertEqual(response.status_code, 200)
        print(f"Constant errors response: {response.json()}")
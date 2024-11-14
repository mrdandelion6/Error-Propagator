# External Lambda API Tests

These tests are made with `pytest`. They test if the deployed Lambda function is correctly processing requests. You need to deploy the backend to run these tests.

The tests are in the following structure:

```
tests
├── README.md
├── __init__.py
├── conftest.py
├── integration
│   ├── __init__.py
│   └── test_live_api.py
└── load
    ├── __init__.py
    └── test_load.py
```

To run the tests, do the following in terminal:

```bash
cd backend

# run all tests
pytest

# run specific folder
pytest tests/integration
pytest tests/load

# run specific file
pytest tests/integration/test_live_api.py
pytest tests/load/test_load.py

# run specific class
pytest tests/integration/test_live_api.py::TestLiveAPI

# run specific method
pytest tests/integration/test_live_api.py::TestLiveAPI::test_simple_addition
```

Note that these tests will make actual requests to the deployed Lambda function. Make sure that the function is deployed before running the tests and that the environment variables in `zapppa_settings.json` are correctly set.
## Internal Django Tests

These tests are made with Django's built-in testing framework. They test if the Django views are correctly processing requests. You do not need to deploy the backend to run these tests. They also test the error propagation logic in the `error_propagator.py` module.

The tests are in the following structure:
```
error_propagation/tests/
├── README.md
├── __init__.py
├── test_propagator.py
└── test_views.py
```

To run the tests, do the following in terminal:
```bash
cd backend

# run all tests
python manage.py test

# run specific folder
python manage.py test error_propagation.tests

# run a specific file
python manage.py test error_propagation.tests.test_propagator

# run a specific class
python manage.py test error_propagation.tests.test_propagator.ErrorPropagationViewTests

# run a specific test
python manage.py test error_propagation.tests.test_propagator.ErrorPropagationViewTests.test_error_handling
```

These tests will not make actual requests to the deployed Lambda function. They will only test the Django views and the error propagation logic.
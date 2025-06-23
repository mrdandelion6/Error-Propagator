# Error Propagator

Live here: [https://errorpropagator.com](https://errorpropagator.com)

# Installation
Here is a quick guide on how to get the project up and running. Do the following steps in terminal.

## Frontend Installation

```bash
# use latest stable version of node
cd frontend
npm i
```

## Backend Installation
```bash
# create a virtual environment wherever you want
# activate the virtual environment
cd backend
pip install -r requirements.txt
```

If you want to deploy the backend to AWS Lambda, also run:
```bash
pip install -r deployment/requirements-dev.txt
```

## Running in Development

We use two separate terminals.

### Frontend
In terminal 1:
```bash
cd frontend
npm run dev
```
Visit [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser to see the web application running in dev. Do not close this terminal.

### Backend
In terminal 2:
```bash
# activate the virtual environment
cd backend
python manage.py runserver
```

This needs to be running for the `propagate` endpoint to work. Do not close this terminal.

# Deployment

It is a bit complicated to deploy this project. The backend uses `django` which is a classic monolith server. If you know how to deploy a django project as a regular server, you can do that but will have to set that up yourself.

If you want to deploy it as a serverless function (which is what I did on **AWS Lambda** to mitigate costs), then you will need to use *Zappa* to integrate the django project with AWS Lambda.

## Backend Deployment with Zappa

### Prerequisites
First make sure you have an AWS account. Then follow the steps below:
1. Create a new IAM user.
2. Create and attach a policy with the JSON in `backend/deployment/iam_policy.json` to the user.
3. Generate an access key and secret key for the user and save them.

### Configuration

Make sure you already ran `pip install -r deployment/requirements-dev.txt` in the backend directory. Then do the following in terminal:
```bash
aws configure
# enter the user access key and secret key and the region you want to deploy to
# select JSON as the output format

# activate the virtual environment (should have zappa installed)
cd backend

zappa init
# follow the instructions
# should automatically detect backend.settings in django 

# generate a django secret key and save it
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

Then edit the `zappa_settings.json` file to match the `backend/zappa_settings.example.json` file. Make sure to replace:
- `<DJANGO_SECRET_KEY>` with the secret key you generated
- `<AWS_ACCOUNT_ID>` with your AWS account ID
- `<AWS_REGION>` with the region you want to deploy to

### Creating Lambda Layers

Now you will need to create a few Lambda layers for the Lambda function to successfully deploy and work. Read the `README.md` files in `backend/lambda-layers/` located in the following directories:
- `web-framework-layer/README.md`
- `data-science-layer/README.md`
- `utils-layer/README.md`

Once you have created the layers, you can deploy the backend with the following command:
```bash
zappa deploy dev
```

This should deploy the backend to AWS Lambda and give you a URL to access the API. Update your `zappa_settings.json` file by adding the following line:
```json
{
    "dev": {
        "aws_environment_variables": {
            "API_URL": "https://<your-api-url>.execute-api.<your-region>.amazonaws.com/dev"
        }
    }
}
```

You can now use the API URL in the frontend to make requests to the backend.

## Frontend Deployment

The frontend is a static website, so you can deploy it to any static hosting service. I recommend using **Vercel** or **GitHub Pages**.


# Testing

This project has a few tests to ensure that the code is working as expected.

## Backend Testing

The backend has two types of tests: internal Django tests and external Lambda API tests.

### Internal Django Tests

These tests are made with Django's built-in testing framework. They test if the Django views are correctly processing requests. You do not need to deploy the backend to run these tests. They also test the error propagation logic in the `error_propagator.py` module.

To run the tests, do the following in terminal:
```bash
cd backend

# run all tests
python manage.py test
```

See the `README.md` file in `backend/error_propagation/tests` for more details on the tests.
 

### External Lambda API Tests

These tests are made with `pytest`. They test if the deployed Lambda function is correctly processing requests. You need to deploy the backend to run these tests.

To run the tests, do the following in terminal:
```bash
cd backend

# run all tests
pytest
```

See the `README.md` file in `backend/tests` for more details on the tests.


## Frontend Testing

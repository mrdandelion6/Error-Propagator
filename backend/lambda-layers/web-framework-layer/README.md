# Web Framework Layer

Not having this layer and uploading the `Flask` and `Werkzeug` libraries directly to AWS Lambda may cause [deployment issues](https://stackoverflow.com/questions/57228938/unable-to-import-module-handler-no-module-named-werkzeug). 

## Creating the Layer (Recommended)

We first need to install our web framework libraries in a new directory and zip it.

```bash
cd backend/layers/web-framework-layer
mkdir -p python/lib/python3.10/site-packages

# install django and other web frameworks in a new directory
pip install -r requirements.txt -t python/lib/python3.10/site-packages/
zip -r web-framework.zip python/
```

Now you can upload the `web-framework.zip` to AWS Lambda as a layer:
```bash
aws lambda publish-layer-version \
    --layer-name web-framework-layer \
    --description "Combined Django, and DRF layer." \
    --zip-file fileb://web-framework.zip \
    --compatible-runtimes python3.8 python3.9 python3.10
```
Do not modify the `zappa_settings.json` file, as it is already set up to use the layer. Only modify it if you want to remove the layer and upload the libraries directly.

## Removing the Layer (Not Recommended)
If you want to upload the libraries directly (which will enter an S3 bucket), remove the following lines from `zappa_settings.json`:

```json
{
    "layers": [
        # remove the line below
        "arn:aws:lambda:us-east-1:851725344124:layer:web-framework-layer:4"
    ],
    "exclude_glob": [
        # remove the following lines
        "flask*",
        "django*",
        "rest_framework*",
        "markupsafe*",
        "itsdangerous*"
    ]
}
```

This approach is not recommended because it will:
- cause deployment issues (like [this](https://stackoverflow.com/questions/57228938/unable-to-import-module-handler-no-module-named-werkzeug))
- increase the size of the deployment package
- cause longer cold starts (reinstalling the libraries on every cold start)
- make the deployment package harder to maintain

## Updating the Layer
To update the layer, simply do the same steps as above with the updated libraries. Make sure to update your Lambda function to use the new version of the layer (note the `:1` at the end of the ARN).
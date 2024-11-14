# Data Science Layer

Not having this layer and uploading the data science libraries directly to AWS Lambda will:
- increase the size of the deployment package
- cause longer cold starts (reinstalling the libraries on every cold start)
- make the deployment package harder to maintain

This is especially true for this layer because the packages within it are large and have many dependencies.

## Creating the Layer (Recommended)

We first need to install our data science libraries in a new directory and zip it.

```bash
cd backend/lambda-layers/data-science-layer
mkdir -p python/lib/python3.10/site-packages

# install numpy, pandas, and uncertainties in a new directory
pip install -r requirements.txt -t python/lib/python3.10/site-packages/
zip -r data-science.zip python/
```

Now you can upload the `data-science.zip` to AWS Lambda as a layer:
```bash
aws lambda publish-layer-version \
    --layer-name data-science-layer \
    --description "Contains heavy data science packages like Numpy, Pandas, and Uncertainties." \
    --zip-file fileb://data-science.zip \
    --compatible-runtimes python3.8 python3.9 python3.10
```

You can see libraries in this layer in requirements.txt. Feel free to experiment with newer versions of dependencies if desired.

Do not modify the `zappa_settings.json` file, as it is already set up to use the layer. Only modify it if you want to remove the layer and upload the libraries directly.

## Removing the Layer (Not Recommended)
If you want to upload the libraries directly (which will enter an S3 bucket), remove the following lines from `zappa_settings.json`:

```json
{
    "layers": [
        # remove the ARN below
        "arn:aws:lambda:us-east-1:851725344124:layer:data-science-layer:1"
    ],
    "exclude_glob": [
        # remove the following lines
        "numpy*",
        "pandas*",
        "uncertainties*",
        "python-dateutil*"
    ]
}
```

## Updating the Layer
To update the layer, simply do the same steps as above with the updated libraries. Make sure to update your Lambda function to use the new version of the layer (note the `:1` at the end of the ARN).

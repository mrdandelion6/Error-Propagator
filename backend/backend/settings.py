"""
Django settings for backend project.
"""
from pathlib import Path
import os
from config import Config
from urllib.parse import urlparse

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = Config.SECRET_KEY

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = Config.ENVIRONMENT != 'prod'

# Dynamically set ALLOWED_HOSTS based on environment
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
]

# Add API endpoint if available
if Config.API_BASE_URL:
    api_host = urlparse(Config.API_BASE_URL).netloc
    if api_host:
        ALLOWED_HOSTS.append(api_host)

# Add GitHub Pages domain for prod
if Config.ENVIRONMENT == 'prod':
    ALLOWED_HOSTS.append('error-propagator.github.io')

# Application definition
INSTALLED_APPS = [
    'django.contrib.staticfiles',
    'error_propagation',
    'rest_framework',
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# Database
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files
STATIC_URL = 'static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# CORS settings
CORS_ALLOW_ALL_ORIGINS = False

# Set CORS settings based on environment
if Config.ENVIRONMENT == 'prod':
    CORS_ALLOWED_ORIGINS = [
        "https://error-propagator.github.io",
    ]
    CSRF_TRUSTED_ORIGINS = [
        "https://error-propagator.github.io",
    ]
else:  # dev/local environment
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
    CSRF_TRUSTED_ORIGINS = [
        'http://localhost:5173', 
        'http://127.0.0.1:5173'
    ]

CORS_ALLOW_CREDENTIALS = True
CORS_ALLOW_METHODS = [
    "DELETE",
    "GET",
    "OPTIONS",
    "PATCH",
    "POST",
    "PUT",
]
CORS_ALLOW_HEADERS = [
    "accept",
    "accept-encoding",
    "authorization",
    "content-type",
    "dnt",
    "origin",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
]
from .base import *

DEBUG = True

ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
]

# development-specific CORS settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173', 
    'http://127.0.0.1:5173'
]

# add API endpoint if available
if Config.API_BASE_URL:
    from urllib.parse import urlparse
    api_host = urlparse(Config.API_BASE_URL).netloc
    if api_host:
        ALLOWED_HOSTS.append(api_host)
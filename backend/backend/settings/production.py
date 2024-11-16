from .base import *

DEBUG = False

ALLOWED_HOSTS = [
    '.execute-api.us-east-1.amazonaws.com',
    'error-propagator.github.io'
]

# production-specific CORS settings
CORS_ALLOWED_ORIGINS = [
    "https://error-propagator.github.io",
]

CSRF_TRUSTED_ORIGINS = [
    "https://error-propagator.github.io",
]

# add API endpoint if available (keeping your config logic)
if Config.API_BASE_URL:
    from urllib.parse import urlparse
    api_host = urlparse(Config.API_BASE_URL).netloc
    if api_host:
        ALLOWED_HOSTS.append(api_host)

# Additional production-specific security settings
SECURE_SSL_REDIRECT = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
import os
import sys
import json
from pathlib import Path

def _load_zappa_settings():
    """Load environment variables from zappa_settings.json"""
    try:
        # assuming config.py is in the same directory as zappa_settings.json
        zappa_path = Path(__file__).parent / 'zappa_settings.json'
        with open(zappa_path) as f:
            settings = json.load(f)
            # get environment variables from dev environment
            env_vars = settings['dev']['aws_environment_variables']
            
            # set environment variables if they're not already set
            for key, value in env_vars.items():
                if not os.getenv(key):
                    os.environ[key] = str(value)
    except FileNotFoundError:
        print("Warning: zappa_settings.json not found")
    except KeyError as e:
        print(f"Warning: Missing key in zappa_settings.json: {e}")
    except json.JSONDecodeError:
        print("Warning: Invalid JSON in zappa_settings.json")

# load settings before class definition
_load_zappa_settings()

class Config:
    """Configuration from zappa_settings.json"""
    ENVIRONMENT = os.getenv('ENVIRONMENT', 'dev')
    API_BASE_URL = os.getenv('API_BASE_URL')
    SECRET_KEY = os.getenv('DJANGO_SECRET_KEY')
    
    @classmethod
    def validate(cls):
        if cls.ENVIRONMENT == 'production':
            missing_vars = []
            if not cls.SECRET_KEY:
                missing_vars.append('DJANGO_SECRET_KEY')
            if not cls.API_BASE_URL:
                missing_vars.append('API_BASE_URL')
            
            if missing_vars:
                print("Error: Missing required production variables:")
                for var in missing_vars:
                    print(f"- {var}")
                sys.exit(1)
        else:
            # dev environment, show warnings
            if not cls.SECRET_KEY:
                print("Warning: DJANGO_SECRET_KEY not set, using default")
                cls.SECRET_KEY = 'django-insecure-dev-key-do-not-use-in-production'

Config.validate()
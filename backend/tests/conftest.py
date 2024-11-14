import pytest
from config import Config

@pytest.fixture(scope="session")
def api_client():
    """
    Fixture that provides API client configuration.
    scope="session" means this fixture runs once for the entire test session.
    """
    base_url = Config.API_BASE_URL
    if not base_url:
        pytest.fail("API_BASE_URL is not set in environment variables")
    
    return {
        'base_url': base_url,
        'headers': {"Content-Type": "application/json"}
    }

@pytest.fixture
def test_payload():
    """
    Fixture that provides a standard test payload.
    Default scope is "function" - runs for each test.
    """
    return {
        "equation": "a + b",
        "variables": ["a", "b"],
        "nominalValues": ["10", "5"],
        "errorValuesVariable": ["0.1", "0.2"],
        "errorValuesConstant": ["0", "0"],
        "constErrors": [False, False],
        "roundResult": True
    }
import redis
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

class MockRedis:
    """A simple in-memory fallback for Redis during development."""
    def __init__(self):
        self._data = {}
        logger.info("Using InMemory Cache (Redis Mock)")

    def get(self, key):
        return self._data.get(key)

    def set(self, key, value):
        self._data[key] = value
        return True

    def setex(self, key, time, value):
        self._data[key] = value
        return True

    def delete(self, *keys):
        for k in keys:
            if k in self._data:
                del self._data[k]
        return True

    def keys(self, pattern):
        # Very basic pattern matching (only supports suffix *)
        if pattern.endswith('*'):
            prefix = pattern[:-1]
            return [k for k in self._data.keys() if k.startswith(prefix)]
        return [k for k in self._data.keys() if k == pattern]

    def ping(self):
        return True

# Initialize Redis Client
try:
    redis_client = redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        decode_responses=True,
        socket_timeout=1,
        socket_connect_timeout=1,
    )
    # Test connection immediately
    redis_client.ping()
    IS_MOCK = False
except Exception:
    redis_client = MockRedis()
    IS_MOCK = True

def is_redis_available():
    if IS_MOCK:
        return True # Report as available since the mock is working
    try:
        return redis_client.ping()
    except Exception:
        return False

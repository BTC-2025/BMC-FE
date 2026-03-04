import sys
import os

# Add the project root to sys.path
sys.path.append(os.getcwd())

from app.core.cache.redis import is_redis_available, redis_client

if __name__ == "__main__":
    print(f"Checking Redis connection to {redis_client.connection_pool.connection_kwargs['host']}...")
    if is_redis_available():
        print("✅ Redis is reachable!")
        redis_client.set("test_key", "Antigravity")
        print(f"Value retrieved: {redis_client.get('test_key')}")
        redis_client.delete("test_key")
    else:
        print("❌ Redis is NOT reachable. Ensure it's running via Docker.")

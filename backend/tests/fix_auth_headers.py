#!/usr/bin/env python3
"""
Script to add auth_headers parameter to all test functions in test_event_api.py
and update client calls to use headers=auth_headers.
"""
import re

# Read the test file
with open('tests/api/test_event_api.py', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match test function signatures (excluding fixtures and auth tests)
# Match functions that have 'client: TestClient' but not 'auth_headers'
pattern = r'(def test_(?!organization|user|event|session|ticket|registration|.*requires_authentication)\w+\([^)]*client: TestClient)([^)]*)\):'

def add_auth_param(match):
    """Add auth_headers parameter to function signature if not present."""
    func_start = match.group(1)
    rest_params = match.group(2)

    # Check if auth_headers already in params
    if 'auth_headers' in rest_params:
        return match.group(0)  # Already has it, return unchanged

    # Add auth_headers as last parameter
    if rest_params.strip():
        return f"{func_start}{rest_params}, auth_headers: dict):"
    else:
        return f"{func_start}, auth_headers: dict):"

# Add auth_headers parameter to function signatures
content = re.sub(pattern, add_auth_param, content)

# Now update client.get/post/put/delete calls to include headers=auth_headers
# Pattern to match client HTTP calls without headers parameter
http_methods = ['get', 'post', 'put', 'delete', 'patch']

for method in http_methods:
    # Match client.METHOD(...) that doesn't have headers= parameter
    # This is a simplified regex - handles most common cases
    pattern = rf'(client\.{method}\([^)]+)(\))'

    def add_headers_param(match):
        call_content = match.group(1)
        closing = match.group(2)

        # Skip if already has headers parameter or if it's a test checking auth
        if 'headers=' in call_content or 'client.headers.clear()' in content[max(0, match.start()-100):match.start()]:
            return match.group(0)

        # Add headers=auth_headers before closing paren
        return f"{call_content}, headers=auth_headers{closing}"

    content = re.sub(pattern, add_headers_param, content)

# Write back
with open('tests/api/test_event_api.py', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Updated test_event_api.py with auth_headers parameters")

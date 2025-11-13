#!/usr/bin/env python3
"""Debug script to check registered routes."""
from app.main import app

print("All registered routes:\n")
for route in app.routes:
    if hasattr(route, 'path') and hasattr(route, 'methods'):
        methods = ', '.join(route.methods) if route.methods else 'N/A'
        print(f"{route.path:50s} {methods}")
    elif hasattr(route, 'path'):
        print(f"{route.path:50s} [no methods]")

print("\n\nDocument-related routes:")
doc_routes = [r for r in app.routes if hasattr(r, 'path') and 'document' in r.path.lower()]
for route in doc_routes:
    methods = ', '.join(route.methods) if hasattr(route, 'methods') and route.methods else 'N/A'
    print(f"{route.path:50s} {methods}")

print(f"\nTotal routes: {len(app.routes)}")
print(f"Document routes: {len(doc_routes)}")

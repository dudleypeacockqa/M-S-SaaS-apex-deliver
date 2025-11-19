from app.main import app
routes = [
    (route.path, sorted(route.methods))
    for route in app.router.routes
    if 'blog' in route.path
]
for path, methods in sorted(routes):
    print(path, methods)

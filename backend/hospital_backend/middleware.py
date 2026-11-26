from django.http import HttpResponse


class SimpleCorsMiddleware:
    """
    Lightweight CORS middleware for Hospital Management EMR backend.
    Enables React frontend running on any local port (5173, 4173, etc.) or preview host
    to access the JSON-based API seamlessly.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":
            response = HttpResponse(status=200)
        else:
            response = self.get_response(request)

        response["Access-Control-Allow-Origin"] = "*"
        response["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Requested-With, Accept, Access-Control-Request-Private-Network"
        response["Access-Control-Allow-Private-Network"] = "true"
        response["Access-Control-Max-Age"] = "86400"
        return response

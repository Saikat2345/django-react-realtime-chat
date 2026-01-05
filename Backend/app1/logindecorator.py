from django.http import JsonResponse
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

def tiken_sortcut(view_fun):
    def wrapper(request, *args, **kwargs):
        token=request.headers.get("Authorization")
        if not token:
            return view_fun(request, *args, **kwargs)
        try:
            token_value=token.split(" ")[1]
            AccessToken(token_value)
            return JsonResponse({"status":True,"msg":"already login"})
        except (InvalidToken, TokenError):
            return view_fun(request, *args, **kwargs)
    return wrapper    
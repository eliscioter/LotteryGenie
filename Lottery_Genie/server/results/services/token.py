"""
Token management service for storing and fetching tokens.
"""

from ..models import NotificationToken

def store_token(token: str):
    """Store the token in a secure location."""
    token = NotificationToken(token=token)
    token.save()

    return {"status": "success", "message": "Token saved successfully."}

def fetch_correlation_token(token: str):
    """Fetch the correlation token from the database."""
    try:
        token = NotificationToken.objects.filter(token=token)

        token = token.first()
        if token.token:
            return {"status": "success", "message": token.token}
        return {"status": "error", "message": "Token is empty."}
    except AttributeError:
        return {"status": "error", "message": "Token not found."}

""" This module contains the views for the results app. """

import json
from typing import NamedTuple
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .services import scraper
from .services import token as token_service


def results(_):
    """
    This function fetches the lottery results from the web
    and returns them as a JSON response.
    """
    data = scraper.fetch_data()
    return JsonResponse(data)


def summary(_, category):
    """
    This function fetches the summary of the lottery results for a specific category
    and returns it as a JSON response.
    """
    data = scraper.fetch_summary(category)
    return JsonResponse(data)


def delete(_):
    """This function deletes the lottery results from the database and returns a JSON response."""
    data = scraper.delete_data()
    return JsonResponse(data)


# LottoDetails is a NamedTuple that represents the data structure of the request body.
LottoDetails = NamedTuple(
    "LottoDetails", [("combination", str), ("category", str), ("date", str)]
)


@csrf_exempt
def combinations(request):
    """
    This function checks the combinations of the lottery results
    and returns the results as a JSON response.
    """
    data = json.loads(request.body.decode())
    lotto_details = LottoDetails(**data)
    response = scraper.check_combinations(
        lotto_details.combination, lotto_details.category, lotto_details.date
    )
    return JsonResponse(response)

@csrf_exempt
def notification_token(request):
    """
    This function handles the notification token for the user.
    It saves the token to the database and returns a JSON response.
    """
    try:
        data = json.loads(request.body.decode())
        token = data.get("token")
        response = token_service.store_token(token)
        return JsonResponse(response)
    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({"error": str(e)}, status=500)

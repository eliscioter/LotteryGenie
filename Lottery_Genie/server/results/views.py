import json
from typing import NamedTuple
from django.http import HttpRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .services import scraper


def results(_):
    data = scraper.fetch_data()
    return JsonResponse(data)


def summary(_, category):
    data = scraper.fetch_summary(category)
    return JsonResponse(data)


def delete(_):
    data = scraper.delete_data()
    return JsonResponse(data)

User = NamedTuple("User", [("combinations", str)])

@csrf_exempt
def combinations(request, category):
    data = json.loads(request.body.decode())
    user = User(**data)
    
    response = scraper.check_combinations(user.combinations, category)
    
    return JsonResponse(response)

import json
from typing import NamedTuple
from django.http import JsonResponse
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

LottoDetails = NamedTuple("LottoDetails", [("combination", str), ("category", str), ("date", str)])

@csrf_exempt
def combinations(request):
    data = json.loads(request.body.decode())
    lotto_details = LottoDetails(**data)
    response = scraper.check_combinations(lotto_details.combination, lotto_details.category, lotto_details.date)
    return JsonResponse(response)

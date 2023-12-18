from django.http import JsonResponse
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

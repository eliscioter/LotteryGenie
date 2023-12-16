from django.http import JsonResponse
from .services import scraper


def results(request):
    data = scraper.fetch_data()
    return JsonResponse(data)


def delete(_):
    data = scraper.delete_data()
    return JsonResponse(data)

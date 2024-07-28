""" This file contains the URL patterns for the results app. """
from django.urls import path
from . import views

urlpatterns = [
    path('fetch', views.results, name='results_func'),
    path('fetch/summary/<category>', views.summary, name='summary_func'),
    path("delete", views.delete, name="delete_data"),
    path("check-combinations", views.combinations, name="combinations"),
]

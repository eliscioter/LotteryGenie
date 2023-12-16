
from . import views
from django.urls import path


urlpatterns = [
    path('fetch', views.results, name='results_func'),
    path("delete", views.delete, name="delete_data")
]
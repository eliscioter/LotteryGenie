from django.db import models


class Results(models.Model):
    date = models.DateField()
    category = models.CharField(max_length=20)
    combination = models.CharField(max_length=17)

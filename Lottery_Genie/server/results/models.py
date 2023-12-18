from django.db import models


class Results(models.Model):
    date = models.DateField()
    category = models.CharField(max_length=20)
    combination = models.CharField(max_length=17)
    prize = models.CharField(max_length=20, null=True)
    winners = models.CharField(max_length=3, null=True)

class Summary(models.Model):
    category = models.CharField(max_length=20)
    date = models.DateField()
    combination = models.CharField(max_length=17)
    prize = models.CharField(max_length=20)
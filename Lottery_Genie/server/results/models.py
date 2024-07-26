""" This module contains the models for the results and summary. """
from django.db import models

class Results(models.Model):
    """ This class represents the results of the lottery. """
    date = models.DateField(null=True)
    category = models.CharField(max_length=20)
    combination = models.CharField(max_length=17)
    prize = models.CharField(max_length=20, null=True)
    winners = models.CharField(max_length=3, null=True)
    objects = models.Manager()

class Summary(models.Model):
    """ This class represents the summary of the lottery results. """
    category = models.CharField(max_length=20)
    date = models.DateField()
    combination = models.CharField(max_length=17)
    prize = models.CharField(max_length=20)
    objects = models.Manager()

class Prizes(models.Model):
    """ This class represents the prizes of the lottery. """
    category = models.CharField(max_length=20)
    first_prize = models.CharField(max_length=20)
    second_prize = models.CharField(max_length=20)
    third_prize = models.CharField(max_length=20)
    fourth_prize = models.CharField(max_length=20)
    objects = models.Manager()

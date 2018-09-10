from __future__ import unicode_literals

from django.db import models

class queryHist(models.Model):
    #user = models.OneToOneField(User)
    #course = models.ForeignKey(Course)
    #year = models.IntegerField(validators=[MinValueValidator(1))
    user=models.CharField(max_length=30, blank=True)
    query=models.TextField()
    qTable=models.CharField(max_length=50, blank=True)
    qTime=models.CharField(max_length=100)
    qRows=models.BigIntegerField(blank=True, null = True)
    qResult=models.TextField(blank=True)
    qTimetaken=models.TextField(blank=True)
    qEnv=models.CharField(max_length=100, blank=True)

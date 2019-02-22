from django.db import models

from django.conf import settings 
User = settings.AUTH_USER_MODEL

from django.utils import timezone
from django.shortcuts import reverse
# Create your models here.


class Task(models.Model):
	
	user 		 = models.ForeignKey(User, on_delete=models.CASCADE)
	title		 = models.CharField(max_length=100)
	content 	 = models.TextField(default="")
	category 	 = models.CharField(max_length=1, default=1)
	created_date = models.DateTimeField(default=timezone.now)
	started_date = models.DateTimeField(blank=True, null=True)
	end_date 	 = models.DateTimeField(blank=True, null=True)

	def __str__(self):
		return self.title

	def get_absolute_url(self):
		return reverse("taskapp:tasks", kwargs={"tasks":self.tasks})

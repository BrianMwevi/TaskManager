from django.db import models

from django.conf import settings 
User = settings.AUTH_USER_MODEL

from django.utils import timezone
from django.shortcuts import reverse
# Create your models here.

class Category(models.Model):
	NEW = 1
	DOING = 2
	DONE = 3

	TASK_CHOICES = (
			(NEW, 'waiting'),
			(DOING, 'Inprogress'),
			(DONE, 'Completed'),
		)
	status = models.IntegerField(default=NEW, choices=TASK_CHOICES)
	
	def __str__(self):
		return str(self.status)
		

class Task(models.Model):
	
	user 		 = models.ForeignKey(User, on_delete=models.CASCADE)
	title		 = models.CharField(max_length=100)
	content 	 = models.TextField(default="")
	category 	 = models.ForeignKey(Category, default=1, on_delete=models.SET_DEFAULT)
	created_date = models.DateTimeField(default=timezone.now)
	started_date = models.DateTimeField(blank=True, null=True)
	end_date 	 = models.DateTimeField(blank=True, null=True)


	def __str__(self):
		return self.title

	def get_absolute_url(self):
		return reverse("taskapp:tasks", kwargs={"tasks":self.tasks})

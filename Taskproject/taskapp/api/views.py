from django.shortcuts import get_object_or_404
from django.utils import timezone


from rest_framework.generics import ListAPIView, ListCreateAPIView,RetrieveUpdateAPIView, RetrieveDestroyAPIView
from rest_framework.mixins import UpdateModelMixin
from rest_framework.response import Response
from rest_framework import permissions, authentication

from .serializers import TaskModelSerializer


from taskapp.models import Task


class TaskNewList(ListAPIView):
	serializer_class = TaskModelSerializer

	def get_queryset(self, *args, **kwargs):
		user_tasks = Task.objects.filter(user__exact=self.request.user)
		# tasksk = Task.objects.filter()
		return user_tasks

class TaskCreate(ListCreateAPIView):
	serializer_class = TaskModelSerializer
	permission_classes = [permissions.IsAuthenticated, permissions.AllowAny]

	def get_queryset(self, *args, **kwargs):
		user_tasks = Task.objects.filter(user__exact=self.request.user)
		return user_tasks

	def perform_create(self, serializer):
		serializer.save(user=self.request.user)


class TaskUpdate(RetrieveUpdateAPIView):
	serializer_class = TaskModelSerializer
	permission_classes = [permissions.IsAuthenticated]
	authentication_classes = [authentication.SessionAuthentication]
	lookup_field = "pk"	
	
	def get_queryset(self, *args, **kwargs):
		tasks =  Task.objects.filter(user=self.request.user)
		return tasks

	def perform_update(self, serializer):
		serializer.save(started_date=timezone.now())

		def get_date(*args, **kwargs):
			if self.request.method == 'PUT':
				category = self.request.POST.get("category")
				if category == "3":
					serializer.save(end_date=timezone.now())
				else:
					serializer.save(end_date=None)
			else:
				pass
		get_date()

	
class TaskDelete(RetrieveDestroyAPIView):
	serializer_class = TaskModelSerializer
	permission_classes = [permissions.IsAuthenticated]

	def get_queryset(self, *args, **kwargs):
		tasks = Task.objects.filter(user=self.request.user)
		print(tasks.count())
		return tasks

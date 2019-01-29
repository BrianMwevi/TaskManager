from django.shortcuts import render
from django.views.generic import ListView,CreateView
from django.urls import reverse_lazy


from .models import Task
# Create your views here.

class TaskListView(ListView):
	model = Task


class TaskCreateView(CreateView):
	queryset = Task.objects.all()
	fields = ['title', 'content']
	template_name = "taskapp/task_list.html"
	success_url = reverse_lazy("taskapp:task_list")


	def form_valid(self,form):
		form.instance.user = self.request.user

		return super().form_valid(form)
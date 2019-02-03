from django.shortcuts import render
from django.views.generic import ListView,CreateView, UpdateView
from django.urls import reverse_lazy

from django.contrib.auth.mixins import LoginRequiredMixin


from .models import Task
# Create your views here.

class TaskListView(ListView):
	model = Task
	def get_context_data(self, **kwargs):
	    context = super(TaskListView, self).get_context_data(**kwargs)
	    context['create_url'] = reverse_lazy("taskapp:task_create")
	    return context


class TaskCreateView(LoginRequiredMixin, CreateView):
	queryset = Task.objects.all()
	fields = ['title', 'content']
	template_name = "taskapp/task_list.html"
	success_url = reverse_lazy("taskapp:task_list")


	def form_valid(self,form):
		form.instance.user = self.request.user

		return super().form_valid(form)


class TaskUpdateView(LoginRequiredMixin, UpdateView):
	model = Task
	fields = ['title', 'content']
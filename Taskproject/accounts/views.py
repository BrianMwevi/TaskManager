from django.shortcuts import render
from django.urls import reverse_lazy
from django.views.generic import CreateView
from . import forms 

# Create your views here.

class SignUpView(CreateView):
	form_class = forms.SignupForm
	success_url = reverse_lazy('login')
	template_name = 'accounts/signup.html'
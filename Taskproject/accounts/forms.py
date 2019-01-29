from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm
from django import forms

class SignupForm(UserCreationForm):
	
	class Meta:
		model = get_user_model()
		fields = ('username', 'email', 'password1', 'password2')

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		field_class = "form-control, form_create"
		self.fields['username'].widget.attrs.update({"placeholder": "Enter username","class": field_class})
		self.fields['email'].widget.attrs.update({"required":True,"placeholder": "example@gmail.com","class": field_class})
		self.fields['password1'].widget.attrs.update({"placeholder": "Password","class": field_class})
		self.fields['password2'].widget.attrs.update({"placeholder": "Repeat password","class": field_class})


from django.contrib.auth.forms import AuthenticationForm 
from django import forms
from django.core.exceptions import ValidationError
from django.utils.translation import ugettext_lazy as _
from querya.models import queryHist

# If you don't do this you cannot use Bootstrap CSS
class LoginForm(AuthenticationForm):
    username = forms.CharField(label="Username", max_length=30, 
                               widget=forms.TextInput(attrs={'class': 'form-control', 'name': 'username'}))
    password = forms.CharField(label="Password", max_length=30, 
                               widget=forms.PasswordInput(attrs={'class': 'form-control', 'name': 'password'}),)
class queryform(forms.ModelForm):
	class Meta:
		model = queryHist
		fields = ['query']
		widgets = {
          'query': forms.Textarea(attrs={'rows':8, 'cols':54, 'id': 'post-text', 'required': True}),
        }
		

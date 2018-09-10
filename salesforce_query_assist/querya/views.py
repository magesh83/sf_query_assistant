from django.shortcuts import render,redirect
from django.http import HttpResponse,JsonResponse
from django.core import serializers
from .models import queryHist
from .forms import queryform
import json,datetime,time
from .soql import sf_exec,sf_tbl_desc,replace_comma, wsdl_table_list
from django.contrib.auth.decorators import login_required
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import UserCreationForm
import configparser, os, distutils

file_path = os.path.dirname(os.path.realpath(__file__))
config_file_name = file_path + '/config.ini'
config = configparser.ConfigParser()
if not (os.path.isfile(config_file_name)):
    config_err=1
    envs = []
else:
    config_err=1
    config.read(config_file_name)
    envs = config.sections()
def signup(request):
    if request.method == 'POST':
        form = UserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            raw_password = form.cleaned_data.get('password1')
            user = authenticate(username=username, password=raw_password)
            login(request, user)
            return redirect('index')
    else:
        form = UserCreationForm()
    return render(request, 'signup.html', {'form': form})

@login_required(login_url="login/")
def home(request):
    return HttpResponseRedirect(
               reverse("home.html", 
                       args=[request.user.username], config_err=config_err, envs = envs))

@login_required(login_url="login/")
def index(request):
    form = queryform()
    tablelist=wsdl_table_list()
    return render(request,"home.html",{"form":form,"tableList":tablelist, "config_err":config_err, "envs" : envs})

@login_required(login_url="login/")
def qhist_json(request):
    object_list = queryHist.objects.all().filter(user=request.user.username).order_by('-qTime')
    qjson = serializers.serialize('json', object_list)
    return HttpResponse(qjson, content_type='application/json')

@login_required(login_url="login/")
def qresult_json(request):
    if request.is_ajax():
        if request.method == 'POST':
            my_form = queryform(request.POST)
            if my_form.is_valid():
                post_text = request.POST.get('query')
                env = request.POST.get('env')				
                queryall = request.POST.get('queryall')
                if json.loads(queryall.lower()):
                    squery = post_text
                    # squery = '$' + post_text
                else:
                    squery = post_text
                query_start_time = datetime.datetime.now().time().strftime('%H:%M:%S')
                response = sf_exec(env,squery)
                query_end_time = datetime.datetime.now().time().strftime('%H:%M:%S')
                elapsed_time=(datetime.datetime.strptime(query_end_time,'%H:%M:%S') - datetime.datetime.strptime(query_start_time,'%H:%M:%S'))
                post = my_form.save(commit=False)
                post.query=replace_comma(post_text)
                post.user = request.user.username
                post.qTable = response["table"]
                post.qTime = datetime.datetime.now().replace(microsecond=0).isoformat().replace('T', ' ')
                post.qRows = response["qRows"]
                post.qResult = response["error_msg"]
                post.qTimetaken = str(elapsed_time)
                post.qEnv = env 
                post.save()
                return JsonResponse(response)
            else:
                return JsonResponse({"error":"Form invalid"})
        context = {'form':my_form}
    return render(request,"home.html",{"form":form})

@login_required(login_url="login/")	
def qcollist_json(request):
    if request.is_ajax():
        if request.method == 'POST':
            table_name = request.POST.get('table_name')
            env = request.POST.get('env')
            response = sf_tbl_desc(env,table_name)
            return JsonResponse(response)
    return render(request,"home.html")
	
def password_reset_done(request):
    return render(request,"home.html")

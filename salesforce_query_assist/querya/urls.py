
from django.conf.urls import url

from . import views

urlpatterns = [
	url(r'^qhist/qhist_ajax_url',views.qhist_json,name='qhist_ajax_url'),
	url(r'^qresult/query_ajax_url',views.qresult_json,name='query_ajax_url'),
	url(r'^qcollist/collist_ajax_url',views.qcollist_json,name='collist_ajax_url'),
	url(r'^$', views.index, name='index'),
]

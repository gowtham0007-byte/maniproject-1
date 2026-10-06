from django.urls import path
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_page, name="login"),
    path("handlelogin", views.handlelogin, name="handlelogin"),
    path("uploaddata", views.uploaddata, name="uploddata"),
    path("getApplicantsData/", views.connecitonListView.as_view(), name="connection_list"),
    path("update_applicant/<id>/", views.update_applicant, name="update_applicant"),
    path("connectionvisualization/", views.connectionvisualization, name="connectionvisualization"),
    path("connectionrequestdata/", views.connectionrequest, name="connectionrequestdata"),
]
from django.contrib import admin
from .models import Applicant,Connection,status

# Register your models here.
admin.site.register(Applicant)
admin.site.register(Connection)
admin.site.register(status)

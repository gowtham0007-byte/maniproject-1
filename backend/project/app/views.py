from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
import pandas as pd
from .models import Applicant, Connection, status
from datetime import datetime
from typing import Any
from django.views.generic import ListView
from django.core.paginator import Paginator
import json
from django.utils.dateparse import parse_date
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.contrib.auth import authenticate, login as auth_login, logout


def index(request):
    return render(request, "index.html")


def login_page(request):
    return render(request, "login.html")


def convert_date(value):
    if pd.isna(value):
        return None
    d = datetime.strptime(value, "%d-%m-%Y")
    return d.strftime("%Y-%m-%d")


def uploaddata(request):
    try:
        filepath = "electricity_board_case_study.csv"
        df = pd.read_csv(filepath, encoding="latin-1")
        count = 0

        for _, row in df.iterrows():
            applicant, created = Applicant.objects.get_or_create(
                Applicant_Name=row["Applicant_Name"],
                Gender=row["Gender"],
                District=row["District"],
                State=row["State"],
                Pincode=int(row["Pincode"]),
                OwnerShip=row["Ownership"],
                GovtID_Type=row["GovtID_Type"],
                ID_Number=row["ID_Number"],
                Category=row["Category"],
            )

            status_obj, created = status.objects.get_or_create(status_Name=row["Status"])

            Connection.objects.get_or_create(
                Applicant=applicant,
                Load_Applied=int(row["Load_Applied"]),
                Date_of_Application=convert_date(row["Date_of_Application"]),
                Date_of_Approval=convert_date(row["Date_of_Approval"]),
                Modified_Date=convert_date(row["Modified_Data"]),
                Status=status_obj,
                Reviewer_ID=int(row["Reviewer_ID"]),
                Reviewer_Name=row["Reviewer_Name"],
                Reviewer_Comments=row["Reviewer_Comments"],
            )
            count += 1

        return HttpResponse(f"{count} rows uploaded out of {len(df)}")

    except Exception as e:
        print("ERROR:", e)
        return HttpResponse("file data is not uploaded or updated: " + str(e))


class connecitonListView(ListView):
    model = Connection
    context_object_name = "connection"
    paginate_by = 100

    def get_queryset(self):
        queryset = super().get_queryset().order_by("id")
        search_query = self.request.GET.get("search")

        start_date_param = self.request.GET.get("start_date")
        end_date_param = self.request.GET.get("end_date")

        start_date = parse_date(start_date_param) if start_date_param else None
        end_date = parse_date(end_date_param) if end_date_param else None

        if search_query:
            queryset = queryset.filter(id__icontains=search_query)

        if start_date and end_date:
            queryset = queryset.filter(
                Date_of_Application__gte=start_date,
                Date_of_Application__lte=end_date,
            )

        return queryset

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context["search_query"] = self.request.GET.get("search")
        return context

    def render_to_response(self, context: dict[str, Any], **response_kwargs: Any) -> HttpResponse:
        serialized_data = [
            {
                "id": conn.id,
                "Load_Applied": conn.Load_Applied,
                "Date_of_application": conn.Date_of_Application,
                "status": conn.Status.status_Name,
                "Applicant": {
                    "Applicant_Name": conn.Applicant.Applicant_Name,
                    "Gender": conn.Applicant.Gender,
                    "District": conn.Applicant.District,
                    "State": conn.Applicant.State,
                    "Pincode": conn.Applicant.Pincode,
                    "ownership": conn.Applicant.OwnerShip,
                    "GovtID_Type": conn.Applicant.GovtID_Type,
                    "ID_Number": conn.Applicant.ID_Number,
                    "Category": conn.Applicant.Category,
                },
                "Reviewer_ID": conn.Reviewer_ID,
                "Reviewer_Name": conn.Reviewer_Name,
                "Reviewer_comments": conn.Reviewer_Comments,
            }
            for conn in context["connection"]
        ]

        response_data = {
            "data": serialized_data,
            "search_query": context["search_query"],
            "total_pages": context["paginator"].num_pages,
            "current_page": context["page_obj"].number,
        }

        return JsonResponse(response_data)


@csrf_exempt
def update_applicant(request, id):
    if request.method == "GET":
        try:
            applicant = Applicant.objects.get(pk=id)
            connection = Connection.objects.get(Applicant=applicant)
            applicant_data = {
                "Applicant_Name": applicant.Applicant_Name,
                "Gender": applicant.Gender,
                "District": applicant.District,
                "State": applicant.State,
                "Pincode": applicant.Pincode,
                "ownership": applicant.OwnerShip,
                "GovtID_Type": applicant.GovtID_Type,
                "ID_Number": applicant.ID_Number,
                "Category": applicant.Category,
            }
            connection_data = {
                "Load_Applied": connection.Load_Applied,
                "Date_of_application": connection.Date_of_Application,
                "status": connection.Status.status_Name,
                "Date_of_Approval": connection.Date_of_Approval,
                "Reviewer_ID": connection.Reviewer_ID,
                "Reviewer_Name": connection.Reviewer_Name,
                "Reviewer_comments": connection.Reviewer_Comments,
                "modified_Date": connection.Modified_Date,
            }
            return JsonResponse({"applicant": applicant_data, "connection": connection_data})
        except Applicant.DoesNotExist:
            return JsonResponse({"error": "Applicant not found"}, status=404)
        except Connection.DoesNotExist:
            return JsonResponse({"error": "Connection not found"}, status=404)

    elif request.method == "POST":
        try:
            applicant = Applicant.objects.get(pk=id)
            connection = Connection.objects.get(Applicant=applicant)
            data = json.loads(request.body)
            status_name = data.get("connection", {}).get("status")
            status_instance = status.objects.filter(status_Name=status_name).first()

            if status_instance:
                applicant_data = data.get("applicant", {})
                for key, value in applicant_data.items():
                    setattr(applicant, key, value)
                applicant.save()

                connection_data = data.get("connection", {})
                for key, value in connection_data.items():
                    if key != "status":
                        setattr(connection, key, value)

                connection.Status = status_instance
                connection.save()

                return JsonResponse({"success": "Applicant details updated successfully"})
            else:
                return JsonResponse({"error": "invalid status value"}, status=400)
        except Applicant.DoesNotExist:
            return JsonResponse({"error": "Applicant not found"}, status=404)
        except Connection.DoesNotExist:
            return JsonResponse({"error": "Connection not found"}, status=404)

    return JsonResponse({"error": "Method not allowed"}, status=405)


def connectionvisualization(request):
    # FIXED: __year add pannirukken, KeyError varaadhu
    connection_requests = (
        Connection.objects.values("Date_of_Application__year", "Date_of_Application__month")
        .annotate(Total_Count=Count("id"))
        .order_by("Date_of_Application__year", "Date_of_Application__month")
    )
    labels = [
        f"{x['Date_of_Application__year']}-{x['Date_of_Application__month']}"
        for x in connection_requests
        if x["Date_of_Application__year"] is not None
    ]
    Total_Count = [
        x["Total_Count"]
        for x in connection_requests
        if x["Date_of_Application__year"] is not None
    ]

    context = {"labels": labels, "Total_Count": Total_Count}
    return render(request, "connection_visualization.html", context)


def connectionrequest(request):
    selected_status = request.GET.get("status")
    if selected_status:
        filtered_connections = Connection.objects.filter(Status__status_Name=selected_status)
    else:
        filtered_connections = Connection.objects.all()

    data = (
        filtered_connections.exclude(Date_of_Application__isnull=True)
        .annotate(month=TruncMonth("Date_of_Application"))
        .values("month")
        .annotate(Total_Count=Count("id"))
        .order_by("month")
    )
    labels = [entry["month"].strftime("%B-%Y") for entry in data]
    Total_Count = [entry["Total_Count"] for entry in data]

    return JsonResponse({"labels": labels, "Total_Count": Total_Count})


@csrf_exempt
def handlelogin(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return JsonResponse({"error": "Username and password are required"}, status=400)

    user = authenticate(request, username=username, password=password)
    if user is not None:
        auth_login(request, user)
        return JsonResponse({"user": user.username}, status=200)

    return JsonResponse({"error": "Invalid username or password"}, status=400)
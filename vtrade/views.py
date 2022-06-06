from django.shortcuts import render
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, JsonResponse
from django.urls import reverse
from django.db import IntegrityError
from django.contrib.auth.models import User
from django import forms

# Create your views here.
def index(request):
    if(request.user.is_authenticated):
        return HttpResponseRedirect(reverse("dashboard"))
    return render(request, "index.html")

def login_view(request):
    if(request.user.is_authenticated):
        return HttpResponseRedirect(reverse("dashboard"))
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("dashboard"))
        else:
            return render(request, "login.html", {
                "message": "Failed: Invalid username or password"
            })
    else:
        return render(request, "login.html")

def register(request):
    if(request.user.is_authenticated):
        return HttpResponseRedirect(reverse("dashboard"))
    if request.method == "POST":
        username = request.POST["username"].strip()
        email = request.POST["email"].strip()
        password = request.POST["password"].strip()
        # Ensure all fields are filled
        if bool(username and email and password) == False:
            return render(request, "register.html", {
                "message": "Failed: Please fill in all fields"
            })
        if request.POST["password"] != request.POST["password"].strip():
            return render(request, "register.html", {
                "message": "Failed: Password cannot have spaces at start & end"
            })
        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "register.html", {
                "message": "Failed: Username already taken"
            })
        login(request, user)
        return HttpResponseRedirect(reverse("dashboard"))
    else:
        return render(request, "register.html")

@login_required(login_url="login")
def dashboard(request):
    return render(request, "dashboard.html")

@login_required(login_url="login")
def search(request):
    return render(request, "search.html")

@login_required(login_url="login")
def portfolio(request):
    return render(request, "portfolio.html")

@login_required(login_url="login")
def history(request):
    return render(request, "history.html")

@login_required(login_url="login")
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))

# API
def checkUser(request):
    if request.method == 'GET':
        username = request.GET.get("username")
        if username:
            username_available =  not bool(User.objects.filter(username = username))
        else:
            username_available = True
        return JsonResponse({"username_available": username_available})
    else:
        return JsonResponse({
            "error": "GET request required"
        }, status=400)
from django.urls import path
from . import views

urlpatterns = [
    # Before login
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("register", views.register, name="register"),

    # After login
    path("dashboard", views.dashboard, name="dashboard"),
    path("search", views.search, name="search"),
    path("portfolio", views.portfolio, name="portfolio"),
    path("history", views.history, name="history"),
    path("logout", views.logout_view, name="logout"),

    # API paths
    path("checkUser", views.checkUser, name="checkUser"),
    
]

from django.contrib import admin
from django.conf.urls.static import static
from django.urls import path
from django.conf import settings
from DataPortal.views import LoginPage, HomePage, SpatialData, AdministrativeBoundaries,LandUseLandCover,Transportation, Downloads

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', LoginPage, name='LoginPage'),
    path('home/', HomePage, name='HomePage'),
    path('SpatialData/', SpatialData, name='SpatialData'),
    path('AdministrativeBoundaries/', AdministrativeBoundaries, name='AdministrativeBoundaries'),
    path('LandUseLandCover/', LandUseLandCover, name='LandUseLandCover'),
    path('Transportation/', Transportation, name='Transportation'),
    path('Downlaods/', Downloads, name='Downlaods'),
      
] 

from django.contrib import admin

from Home.models import MainBanner, Gallery


# Register your models here.
class GalleryInline(admin.TabularInline):
    fk_name = 'product'
    model = Gallery


@admin.register(MainBanner)
class BannerAdsAdmin(admin.ModelAdmin):
    list_display = ['name',  'caption', 'title', 'link', 'dark_mode', 'position', 'uploaded']
    list_display_links = ['name']
    list_editable = ['position', 'dark_mode']
    list_filter = ['name', 'uploaded']
    prepopulated_fields = {'slug': ('name',)}
    fields = ['name', 'slug', 'caption', 'title', 'link', 'dark_mode', 'position']
    inlines = [GalleryInline]

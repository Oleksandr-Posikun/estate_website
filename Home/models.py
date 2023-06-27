from django.core.validators import URLValidator
from django.db import models

# Create your models here.


class MainBanner(models.Model):
    POSITION_CHOICES = (
        (False, '----'),
        ('centre-mode', 'Centre'),
        ('right-mode', 'Right'),
    )

    name = models.CharField(max_length=50, db_index=True)
    slug = models.SlugField(max_length=100)
    link = models.CharField(validators=[URLValidator()], max_length=200)
    title = models.TextField(max_length=100)
    caption = models.TextField(max_length=50)
    dark_mode = models.BooleanField(default=False)
    position = models.BooleanField(choices=POSITION_CHOICES, default=False)
    created = models.DateField(auto_now_add=True)
    uploaded = models.DateField(auto_now=True)

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return f"{self.name}, {self.link}"


class Gallery(models.Model):
    image = models.ImageField(upload_to='banners/%Y/%m/%d')
    position = models.CharField(max_length=50)
    product = models.ForeignKey(
        MainBanner,
        related_name='images',
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.image}"

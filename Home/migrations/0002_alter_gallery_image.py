# Generated by Django 4.2.2 on 2023-06-16 16:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Home', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='gallery',
            name='image',
            field=models.ImageField(upload_to='banners/%Y/%m/%d'),
        ),
    ]
# Generated by Django 4.2.2 on 2023-06-16 19:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Home', '0003_mainbanner_dark_mode_mainbanner_position'),
    ]

    operations = [
        migrations.AlterField(
            model_name='mainbanner',
            name='position',
            field=models.BooleanField(choices=[('centre-mode', 'Centre'), ('right-mode', 'Right')], default=False),
        ),
    ]
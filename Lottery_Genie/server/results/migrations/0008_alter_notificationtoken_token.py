# Generated by Django 5.1 on 2025-03-30 02:23

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("results", "0007_notificationtoken"),
    ]

    operations = [
        migrations.AlterField(
            model_name="notificationtoken",
            name="token",
            field=models.CharField(blank=True, max_length=255, null=True, unique=True),
        ),
    ]

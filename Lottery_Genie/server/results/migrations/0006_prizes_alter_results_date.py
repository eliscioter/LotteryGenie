# Generated by Django 5.0 on 2024-07-26 07:43

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("results", "0005_summary"),
    ]

    operations = [
        migrations.CreateModel(
            name="Prizes",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("category", models.CharField(max_length=20)),
                ("first_prize", models.CharField(max_length=20)),
                ("second_prize", models.CharField(max_length=20)),
                ("third_prize", models.CharField(max_length=20)),
                ("fourth_prize", models.CharField(max_length=20)),
            ],
        ),
        migrations.AlterField(
            model_name="results",
            name="date",
            field=models.DateField(null=True),
        ),
    ]

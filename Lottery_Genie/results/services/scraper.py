from bs4 import BeautifulSoup
import requests
from dotenv import load_dotenv
import os
from ..models import Results
import dateparser

load_dotenv()


def scrape_pcso():
    print("Scraping...")
    url = os.environ["WEB_URL"]

    page = requests.get(url).text

    soup = BeautifulSoup(page, "html.parser")

    table = soup.find_all("table", class_="has-fixed-layout")

    data = []
    date = ""
    category = ""

    for element in table[slice(0, 5)]:
        head_element = element.find("thead")

        description = head_element.find_all("th", class_="has-text-align-left")

        category = description[0].text
        date = description[1].text

        content_element = element.find_all("td", class_="has-text-align-left")
        content = content_element[1].text

        data.append({"date": date, "category": category, "combination": content})

        parsed_date = dateparser.parse(date)

        result = Results(date=parsed_date, category=category, combination=content)

        save_data(result)


def save_data(result: Results):
    try:
        result.save()
    except Exception as e:
        print(f"Error: {e}")


def fetch_data():
    data = Results.objects.all()
    if not data.count():
        scrape_pcso()
    return {"data": list(data.values())}

def delete_data():
    Results.objects.all().delete()
    return {"message": "Deleted"}
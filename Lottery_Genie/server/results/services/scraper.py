from bs4 import BeautifulSoup
import requests
from dotenv import load_dotenv
import os
from ..models import Results, Summary
import dateparser
from fake_useragent import UserAgent

load_dotenv()

ua = UserAgent()


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
        prize = content_element[3].text
        winners = content_element[5].text

        data.append(
            {
                "date": date,
                "category": category,
                "combination": content,
                "prize": prize,
                "winners": winners,
            }
        )

        parsed_date = dateparser.parse(date)

        result = Results(
            date=parsed_date,
            category=category,
            combination=content,
            prize=prize,
            winners=winners,
        )

        save_data(result)


def scrape_summary(category):
    base_url = os.environ["WEB_URL"]

    url = f"{base_url}/6-{category}-lotto-result-history-and-summary"

    user_agent = ua.random

    headers = {"User-Agent": user_agent}

    page = requests.get(url, headers=headers)

    soup = BeautifulSoup(page.content, "html.parser")

    table = soup.find("table")

    data = []

    head_element = table.find("tbody")

    description = head_element.find_all("tr")

    for element in description:
        content = element.find_all("td")

        date = content[0].text
        combination = content[1].text
        prize = content[2].text

        data.append({"date": date, "combination": combination, "prize": prize})
        
        parsed_date = dateparser.parse(date)
        
        summary = Summary(
            category=category, date=parsed_date, combination=combination, prize=prize
        )
        
        save_summary(summary)

    return {"category": f"6/{category}", "data": data}


def save_data(result: Results):
    try:
        result.save()
    except Exception as e:
        print(f"Error: {e}")

def save_summary(result: Results):
    try:
        result.save()
    except Exception as e:
        print(f"Error: {e}")

def fetch_data():
    data = Results.objects.all()
    if not data.count():
        scrape_pcso()
    return {"data": list(data.values())}

def fetch_summary(category):
    data = Summary.objects.all()
    games = ("42", "45", "49", "55", "58")
    
    if category not in games:
        return {"message": "Invalid category"}
    
    if not data.count():
        scrape_summary(category=category)
        
    if not data.filter(category=category).exists():
        scrape_summary(category=category)
    
    return {"data": list(data.filter(category=category).values())}

def delete_data():
    Results.objects.all().delete()
    Summary.objects.all().delete()
    return {"message": "Deleted"}

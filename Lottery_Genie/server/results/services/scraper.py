from bs4 import BeautifulSoup
import requests
from dotenv import load_dotenv
import os
from ..models import Results, Summary
import dateparser
from fake_useragent import UserAgent
from datetime import date, timedelta, datetime

load_dotenv()

ua = UserAgent()


def replace_php(prize):
    return prize.replace("Php", "\u20B1")


def scrape_pcso():
    print("Scraping...")
    url = os.environ.get("WEB_URL")

    page = requests.get(url).text

    soup = BeautifulSoup(page, "html.parser")

    ultra = soup.find(text="6/58 Ultra Lotto").find_parent("table").find_all("td")
    dateUltra = soup.find(text="6/58 Ultra Lotto").find_parent("table").find_all("th")

    ultraCombination = ultra[1].text
    ultraDate = dateUltra[1].text
    ultraPrize = ultra[3].text
    ultraWinners = ultra[5].text

    try:
        parsed_ultraDate = dateparser.parse(ultraDate)
    except:
        parsed_ultraDate = None

    result = Results(
        date=parsed_ultraDate if parsed_ultraDate else None,
        category="6/58 Ultra Lotto",
        combination=ultraCombination,
        prize=replace_php(ultraPrize),
        winners=ultraWinners,
    )

    save_data(result)

    grand = soup.find(text="6/55 Grand Lotto").find_parent("table").find_all("td")
    dateGrand = soup.find(text="6/55 Grand Lotto").find_parent("table").find_all("th")

    grandCombination = grand[1].text
    grandDate = dateGrand[1].text
    grandPrize = grand[3].text
    grandWinners = grand[5].text

    try:
        parsed_grandDate = dateparser.parse(grandDate)
    except:
        parsed_grandDate = None

    result2 = Results(
        date=parsed_grandDate if parsed_grandDate else None,
        category="6/55 Grand Lotto",
        combination=grandCombination,
        prize=replace_php(grandPrize),
        winners=grandWinners,
    )

    save_data(result2)

    super = soup.find(text="/49 Super Lotto").find_parent("table").find_all("td")
    dateSuper = soup.find(text="/49 Super Lotto").find_parent("table").find_all("th")

    superCombination = super[1].text
    superDate = dateSuper[1].text
    superPrize = super[3].text
    superWinners = super[5].text

    try:
        parsed_superDate = dateparser.parse(superDate)
    except:
        parsed_superDate = None

    result3 = Results(
        date=parsed_superDate if parsed_superDate else None,
        category="6/49 Super Lotto",
        combination=superCombination,
        prize=replace_php(superPrize),
        winners=superWinners,
    )

    save_data(result3)

    mega = soup.find(text="6/45 Mega Lotto").find_parent("table").find_all("td")
    dateMega = soup.find(text="6/45 Mega Lotto").find_parent("table").find_all("th")

    megaCombination = mega[1].text
    megaDate = dateMega[1].text
    megaPrize = mega[3].text
    megaWinners = mega[5].text

    try:
        parsed_megaDate = dateparser.parse(megaDate)
    except:
        parsed_megaDate = None

    result4 = Results(
        date=parsed_megaDate if parsed_megaDate else None,
        category="6/45 Mega Lotto",
        combination=megaCombination,
        prize=replace_php(megaPrize),
        winners=megaWinners,
    )

    save_data(result4)

    regular = soup.find(text="6/42 Lotto").find_parent("table").find_all("td")
    dateRegular = soup.find(text="6/42 Lotto").find_parent("table").find_all("th")

    regularCombination = regular[1].text
    regularDate = dateRegular[1].text
    regularPrize = regular[3].text
    regularWinners = regular[5].text

    try:
        parsed_regularDate = dateparser.parse(regularDate)
    except:
        parsed_regularDate = None

    result5 = Results(
        date=parsed_regularDate if parsed_regularDate else None,
        category="6/42 Lotto",
        combination=regularCombination,
        prize=replace_php(regularPrize),
        winners=regularWinners,
    )

    save_data(result5)


def scrape_summary(category):
    base_url = os.environ.get("WEB_URL")

    url = f"{base_url}/6-{category}-lotto-result-history-and-summary"

    user_agent = ua.random

    headers = {"User-Agent": user_agent}

    page = requests.get(url, headers=headers, timeout=5)

    soup = BeautifulSoup(page.content, "html.parser")

    table = soup.find("table")

    data = []

    head_element = table.find("tbody")

    description = head_element.find_all("tr")

    for element in description:
        content = element.find_all("td")

        game_date = content[0].text
        combination = content[1].text
        prize = content[2].text

        data.append({"date": game_date, "combination": combination, "prize": prize})

        parsed_date = dateparser.parse(game_date)

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
    today = date.today()
    yesterday = today - timedelta(days=1)

    data = Results.objects.filter(date=today)
    if data.count():
        return {"data": list(data.values())}
    elif not data.count():
        data = Results.objects.filter(date=yesterday)
        if data.count():
            return {"data": list(data.values())}
        elif not data.count():
            scrape_pcso()
            data = Results.objects.filter(date=today)
            return {"data": list(data.values())}
        else:
            return {"message": "No data"}
    else:
        return {"message": "No data"}


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


def prizes(category):
    # TODO: scrape the prizes for each category
    pass


def check_combinations(combinations, category, draw_date):
    games = {
        "6/42 Lotto": "6/42 Lotto",
        "6/45 Mega Lotto": "6/45 Mega Lotto",
        "6/49 Super Lotto": "6/49 Super Lotto",
        "6/55 Grand Lotto": "6/55 Grand Lotto",
        "6/58 Ultra Lotto": "6/58 Ultra Lotto",
    }
    # ! data should be getting from summary based on the category
    data = Results.objects

    parsed_date = datetime.fromisoformat(draw_date)
    formatted_date = datetime.strftime(parsed_date, "%Y-%m-%d")

    if category not in games:
        return {"message": "Invalid category"}

    if not data.filter(category=games[category]).exists():
        return {"message": "No data"}

    game = games[category]

    numbers_joined = "-".join([str(num) for num in combinations])
    winning_combination = data.filter(
        category=game, combination=numbers_joined, date=formatted_date
    ).values()

    # TODO: pass the prize won by the user. Also do the checking of how many numbers are winning numbers then return it

    if winning_combination.count() == 0:
        right_combination = list(
            data.filter(category=game, date=formatted_date).values()
        )
        numbers_list = [
            str(num) for num in right_combination[0]["combination"].split("-")
        ]
        print(f"list numbers: {numbers_list}")
        return {
            "category": right_combination[0]["category"],
            "date": right_combination[0]["date"],
            "combination": numbers_list,
            "prize": right_combination[0]["prize"],
            "winners": right_combination[0]["winners"],
        }

    if winning_combination.count() == 1:
        return {"win": "True", "details": list(winning_combination)}

    return {"message": "Error"}

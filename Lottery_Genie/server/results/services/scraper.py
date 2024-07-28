"""
This is to scrape data and save it to the database
This is also to fetch the data from the database and return it to the user
"""

import os
from datetime import date, datetime

from bs4 import BeautifulSoup
import requests
from dotenv import load_dotenv
import dateparser
from fake_useragent import UserAgent

from ..models import Results, Summary, Prizes

# Initialize the environment variables
load_dotenv()

# Initialize UserAgent to mimic real user when scraping
ua = UserAgent()


def replace_php(prize):
    """Replace Php with ₱ in the prize and return it"""
    return prize.replace("Php", "\u20B1")


def parsed_date_or_none(to_parsed_date):
    """Check if the date is parsed and return it"""
    try:
        return dateparser.parse(to_parsed_date)
    except (ValueError, TypeError) as e:
        print(f"Error parsing date: {e}")
        return None


def save_data(result: Results):
    """Save the data to the database"""
    try:
        result.save()
    except (ValueError, TypeError) as e:
        print(f"Error: {e}")


def save_summary(result: Results):
    """Save the summary data to the database"""
    try:
        result.save()
    except (ValueError, TypeError) as e:
        print(f"Error: {e}")


def save_prizes(result: Prizes):
    """Save the prizes data to the database"""
    try:
        result.save()
    except (ValueError, TypeError) as e:
        print(f"Error: {e}")


def scrape_per_game(game):
    """Scrape the data for each game and return the data"""
    try:
        url = os.environ.get("WEB_URL")

        user_agent = ua.random

        headers = {"User-Agent": user_agent}

        page = requests.get(url, headers=headers, timeout=5).text

        soup = BeautifulSoup(page, "html.parser")

        game_category = soup.find(text=game).find_parent("table").find_all("td")
        date_game = soup.find(text=game).find_parent("table").find_all("th")

        # Get the data from the scraped data
        game_combination = game_category[1].text
        game_date = date_game[1].text
        game_prize = game_category[3].text
        game_winners = game_category[5].text

        return game_combination, game_date, game_prize, game_winners
    except (AttributeError, IndexError) as e:
        print(f"Error: {e}")
        return None, None, None, None


def scrape_pcso():
    """Scrape the data from the lottoPCSO website and save it to the database"""
    print("Scraping...")

    lotto_names = [
        "6/58 Ultra Lotto",
        "6/55 Grand Lotto",
        "/49 Super Lotto",
        "6/45 Mega Lotto",
        "6/42 Lotto",
    ]

    flag = False
    for lotto_name in lotto_names:
        combination, game_date, prize, winners = scrape_per_game(lotto_name)
        if not combination or not game_date or not prize or not winners:
            flag = True
            break
        result = Results(
            date=parsed_date_or_none(game_date),
            category=lotto_name,
            combination=combination,
            prize=replace_php(prize),
            winners=winners,
        )

        # Save all results in a single operation
        save_data(result)

    if flag:
        return -1
    return 1



def scrape_summary(category):
    """
    Scapes the summary of the lotto results based on the category
    Save it to the database then return it
    """
    print("Scraping summary...")

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
        prize = replace_php(content[2].text)

        data.append({"date": game_date, "combination": combination, "prize": prize})

        parsed_date = dateparser.parse(game_date)

        summary = Summary(
            category=category, date=parsed_date, combination=combination, prize=prize
        )

        save_summary(summary)

    return {"category": f"6/{category}", "data": data}


def fetch_data():
    """Fetch the data from the database and return it to the user"""
    today = date.today()

    data = Results.objects.filter(date=today)

    if data.count():
        return {"data": list(data.values())}

    if not data.count():
        res = scrape_pcso()
        # Check if data is completely scraped
        if res == -1:
            return {"message": "No data"}

        data = Results.objects.filter(date=today)
        return {"data": list(data.values())}

    return {"message": "No data"}


def fetch_summary(category):
    """Fetch the summary data from the database and return it to the user"""
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
    """Delete the data from the database"""
    Results.objects.all().delete()
    Summary.objects.all().delete()
    Prizes.objects.all().delete()
    return {"message": "Deleted"}


def scrape_prizes(category):
    """
    Scrape the prizes for each category using the category parameter
    """
    print("Scraping prizes...")
    base_url = os.environ.get("WEB_URL")

    url = f"{base_url}/6-{category}-lotto-result"

    user_agent = ua.random

    headers = {"User-Agent": user_agent}

    page = requests.get(url, headers=headers, timeout=5)

    soup = BeautifulSoup(page.content, "html.parser")

    prizes = soup.find(text="1st Prize").find_parent("table").find_all("td")

    first_prize = replace_php(prizes[2].text)
    second_prize = replace_php(prizes[5].text)
    third_prize = replace_php(prizes[8].text)
    fourth_prize = replace_php(prizes[11].text)

    prizes_obj = Prizes(
        category=category,
        first_prize=first_prize,
        second_prize=second_prize,
        third_prize=third_prize,
        fourth_prize=fourth_prize,
    )

    save_prizes(prizes_obj)


def check_won_prize(category, correct_combination_count):
    """
    Based on the correct_combination_count, return the prize amount
    """
    data = Prizes.objects.all()
    games = ("42", "45", "49", "55", "58")

    if category not in games:
        return {"message": "Invalid category"}

    if not data.count():
        scrape_prizes(category=category)

    if not data.filter(category=category).exists():
        scrape_prizes(category=category)

    match correct_combination_count:
        case 6:
            return (
                data.filter(category=category)
                .values("first_prize")
                .get()["first_prize"]
            )
        case 5:
            return (
                data.filter(category=category)
                .values("second_prize")
                .get()["second_prize"]
            )
        case 4:
            return (
                data.filter(category=category)
                .values("third_prize")
                .get()["third_prize"]
            )
        case 3:
            return (
                data.filter(category=category)
                .values("fourth_prize")
                .get()["fourth_prize"]
            )
        case _:
            return -1


def check_correct_combinations(user_combinations, correct_combinations):
    """
    Compare the user combination input and the correct combination
    Return the number of correct combinations and values
    """
    numbers_got_right = [
        num for num in user_combinations if num in correct_combinations
    ]

    return {"numbers": numbers_got_right, "count": len(numbers_got_right)}


def reconvert_to_array(combination):
    """Reconvert the combination to an array"""
    return [str(num) for num in combination.split("-")]


def check_combinations(combinations, category, draw_date):
    """Check if the combination is a winning combination and return the details"""
    games = {
        "6/42 Lotto": "6/42 Lotto",
        "6/45 Mega Lotto": "6/45 Mega Lotto",
        "6/49 Super Lotto": "6/49 Super Lotto",
        "6/55 Grand Lotto": "6/55 Grand Lotto",
        "6/58 Ultra Lotto": "6/58 Ultra Lotto",
    }
    data = Summary.objects

    extracted_category = category.split("/")[1].split(" ")[0]

    if not data.count():
        scrape_summary(category=extracted_category)

    parsed_date = datetime.fromisoformat(draw_date)
    formatted_date = datetime.strftime(parsed_date, "%Y-%m-%d")

    if category not in games:
        return {"message": "Invalid category"}

    if not data.filter(category=extracted_category).exists():
        return {"message": "No data"}

    numbers_joined = "-".join([str(num) for num in combinations])

    winning_combination = data.filter(
        category=extracted_category, combination=numbers_joined, date=formatted_date
    ).values()

    if winning_combination.count() == 0:
        right_combination = list(
            data.filter(category=extracted_category, date=formatted_date).values()
        )

        numbers_list = reconvert_to_array(right_combination[0]["combination"])

        compared_combinations = check_correct_combinations(combinations, numbers_list)

        prize_amount = check_won_prize(
            extracted_category, compared_combinations["count"]
        )

        return {
            "category": right_combination[0]["category"],
            "date": right_combination[0]["date"],
            "combination": numbers_list,
            "prize": right_combination[0]["prize"],
            "result": compared_combinations,
            "prize_amount": prize_amount if prize_amount != -1 else "No Prize",
        }

    if winning_combination.count() == 1:

        winning_combination_list = reconvert_to_array(
            winning_combination[0]["combination"]
        )

        compared_combinations = check_correct_combinations(
            combinations, winning_combination_list
        )

        prize_amount = check_won_prize(
            extracted_category, compared_combinations["count"]
        )

        return {
            "category": winning_combination[0]["category"],
            "date": winning_combination[0]["date"],
            "combination": winning_combination_list,
            "prize": winning_combination[0]["prize"],
            "result": compared_combinations,
            "prize_amount": prize_amount if prize_amount != -1 else "No Prize",
        }

    return {"message": "Error"}

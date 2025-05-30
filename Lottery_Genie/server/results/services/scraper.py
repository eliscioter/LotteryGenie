"""
This is to scrape data and save it to the database
This is also to fetch the data from the database and return it to the user
"""

import os
from datetime import date, datetime
import re

from bs4 import BeautifulSoup
import requests
from dotenv import load_dotenv
import dateparser
from fake_useragent import UserAgent

from ..models import Results, Summary, Prizes

import json

# Initialize the environment variables
load_dotenv()

# Initialize UserAgent to mimic real user when scraping
ua = UserAgent()


def replace_php(prize):
    """Replace Php with ₱ in the prize and return it"""
    return prize.replace("Php", "\u20b1")


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


def scrape_per_game(soup, game):
    """Scrape the data for each game and return the data"""
    try:

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

    try:
        url = os.environ.get("WEB_URL")

        user_agent = ua.random

        headers = {"User-Agent": user_agent}

        page = requests.get(url, headers=headers, timeout=5).text

        soup = BeautifulSoup(page, "html.parser")

        lotto_names = [
            "6/58 Ultra Lotto",
            "6/55 Grand Lotto",
            "/49 Super Lotto",
            "6/45 Mega Lotto",
            "6/42 Lotto",
        ]

        flag = False
        for lotto_name in lotto_names:
            combination, game_date, prize, winners = scrape_per_game(soup, lotto_name)
            if not combination or not game_date or not prize or not winners:
                flag = True
                break
            if "/49" in lotto_name:
                lotto_name = "6/49 Super Lotto"

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
            Results.objects.all().delete()
            return -1
        return 1
    except (AttributeError, IndexError) as e:
        print(f"Error: {e}")
        Results.objects.all().delete()
        return -1


def scrape_summary(category):
    """
    Scapes the summary of the lotto results based on the category
    Save it to the database then return it
    """
    print("Scraping summary...")

    try:
        base_url = os.environ.get("WEB_URL")

        url = f"{base_url}/6-{category}-lotto-result-history-and-summary"

        user_agent = ua.random

        headers = {"User-Agent": user_agent}

        page = requests.get(url, headers=headers, timeout=5)

        soup = BeautifulSoup(page.content, "html.parser")

        table = soup.find("table").find("tbody").find_all("tr")

        for element in table:
            content = element.find_all("td")
            flag = False
            if not content:
                flag = True
                break

            parsed_date = dateparser.parse(content[0].text)
            parsed_prize = replace_php(content[2].text)

            summary = Summary(
                category=category,
                date=parsed_date,
                combination=content[1].text,
                prize=parsed_prize,
            )

            save_summary(summary)

        if flag:
            Summary.objects.all().delete()
            return -1
        return 1
    except (AttributeError, IndexError) as e:
        print(f"Error: {e}")
        Summary.objects.all().delete()
        return -1


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
            return {"error": {"message": "Error updating data"}}

        data = Results.objects.filter(date=today)
        return {"data": list(data.values())}

    return {"error": {"message": "No data"}}


def fetch_summary(category):
    """Fetch the summary data from the database and return it to the user"""
    data = Summary.objects.all()
    games = ("42", "45", "49", "55", "58")
    today = date.today()

    if category not in games:
        return {"message": "Invalid category"}

    if (
        not data.count()
        or not data.filter(category=category).exists()
        or not data.filter(date=today).exists()
    ):
        res = scrape_summary(category=category)
        if res == -1:
            return {"error": {"message": "No data"}}

    return {"data": list(data.filter(category=category).values())}


def delete_data():
    """Delete the data from the database"""
    try:
        Results.objects.all().delete()
        Summary.objects.all().delete()
        Prizes.objects.all().delete()
        return {"message": "Deleted"}
    except (ValueError, TypeError) as e:
        print(f"Error: {e}")
        return {"error": {"message": "Error deleting data"}}


def scrape_prizes(category):
    """
    Scrape the prizes for each category using the category parameter
    """
    print("Scraping prizes...")

    try:
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

        return 1
    except (AttributeError, IndexError) as e:
        print(f"Error: {e}")
        Prizes.objects.all().delete()
        return -1


def check_won_prize(category, correct_combination_count):
    """
    Based on the correct_combination_count, return the prize amount
    """
    data = Prizes.objects.all()
    games = ("42", "45", "49", "55", "58")

    if category not in games:
        return {"error": {"message": "Invalid category"}}

    if not data.count() or not data.filter(category=category).exists():
        res = scrape_prizes(category=category)
        if res == -1:
            return {"error": {"message": "No data"}}

    prize_map = {
        6: "first_prize",
        5: "second_prize",
        4: "third_prize",
        3: "fourth_prize",
    }

    message_map = {
        6: "Congratulations! You won the first prize!",
        5: "Congratulations! You won the second prize!",
        4: "Congratulations! You won the third prize!",
        3: "Congratulations! You won the fourth prize!",
        -1: "Sorry, you didn't win any prize",
    }

    prize_won = prize_map.get(correct_combination_count, -1)

    prize_message = message_map.get(
        correct_combination_count, "Sorry, you didn't win any prize"
    )

    if prize_won != -1:
        return {
            "amount": data.filter(category=category).values(prize_won).get()[prize_won],
            "message": prize_message,
        }
    else:
        return {"amount": 0, "message": "Sorry, you didn't win any prize"}


def check_correct_combinations(user_combinations, correct_combinations):
    """
    Compare the user combination input and the correct combination
    Return the number of correct combinations and values
    """
    numbers_got_right = [
        num for num in user_combinations if num in correct_combinations
    ]

    return {
        "user_combination": user_combinations,
        "numbers": numbers_got_right,
        "count": len(numbers_got_right),
    }


def reconvert_to_array(combination):
    """Reconvert the combination to an array"""
    return [str(num) for num in combination.split("-")]

def check_combinations(combinations, category, draw_date, correlation_id):
    """Check if the combination is a winning combination and return the details"""
    games = {
        "6/42 Lotto": "6/42 Lotto",
        "6/45 Mega Lotto": "6/45 Mega Lotto",
        "6/49 Super Lotto": "6/49 Super Lotto",
        "6/55 Grand Lotto": "6/55 Grand Lotto",
        "6/58 Ultra Lotto": "6/58 Ultra Lotto",
    }
    try:
        data = Summary.objects
        current_data = Results.objects

        parsed_date = datetime.fromisoformat(draw_date).strftime("%Y-%m-%d")

        extracted_category = category.split("/")[1].split(" ")[0]
        if category not in games:
            return {"error": {"message": "Invalid category"}}

        numbers_joined = ["-".join(item["value"]) for item in combinations]

        results_arr = []

        pattern = r'^(\d{1,2}-){5}\d{1,2}$'

        entry = current_data.filter(category=category, date=parsed_date).values().first()

        if entry:
            combination = entry['combination']
            if not re.match(pattern, combination):
                results_arr.append(
                    {
                        "prize_amount": { 
                            "message" : "We’ll let you know when the lotto results are out." 
                            }
                    }
                )
                # call to the scheduler in Spring boot to recheck again
                # pass the correlation id to the Spring Boot server so it knows where to send the notification
                return {"data": results_arr}

        if not data.filter(category=extracted_category).exists():
            res = scrape_summary(category=extracted_category)
            if res == -1:
                return {"error": {"message": "No data"}}

        if not data.filter(date=parsed_date).exists():
            res = scrape_summary(category=extracted_category)
            if res == -1:
                return {"error": {"message": "No data"}}

        if not data.count():
            res = scrape_summary(category=extracted_category)
            if res == -1:
                return {"error": {"message": "No data"}}


        for value in numbers_joined:
            winning_combination = data.filter(
                category=extracted_category, combination=value, date=parsed_date
            ).values()

            if winning_combination.count() == 0:
                right_combination = list(
                    data.filter(category=extracted_category, date=parsed_date).values()
                )

                numbers_list = reconvert_to_array(right_combination[0]["combination"])

                value_list = reconvert_to_array(value)

                compared_combinations = check_correct_combinations(
                    value_list, numbers_list
                )

                prize_amount = check_won_prize(
                    extracted_category, compared_combinations["count"]
                )

                results_arr.append(
                    {
                        "category": right_combination[0]["category"],
                        "date": right_combination[0]["date"],
                        "combination": numbers_list,
                        "prize": right_combination[0]["prize"],
                        "result": compared_combinations,
                        "prize_amount": prize_amount,
                    }
                )

            if winning_combination.count() >= 1:

                winning_combination_list = reconvert_to_array(
                    winning_combination[0]["combination"]
                )

                value_list = reconvert_to_array(value)

                compared_combinations = check_correct_combinations(
                    value_list, winning_combination_list
                )

                prize_amount = check_won_prize(
                    extracted_category, compared_combinations["count"]
                )

                results_arr.append(
                    {
                        "category": winning_combination[0]["category"],
                        "date": winning_combination[0]["date"],
                        "combination": winning_combination_list,
                        "prize": winning_combination[0]["prize"],
                        "result": compared_combinations,
                        "prize_amount": prize_amount,
                    }
                )

        if len(results_arr) == 0:
            return {"data": "No data"}
        push_notification(results_arr, correlation_id)
        return {"data": results_arr}
    except (ValueError, TypeError) as e:
        print(f"Error: {e}")
        return {"error": {"message": "Error checking combinations"}}


def serialize_date(obj):
    """JSON serializer for objects not serializable by default json code"""
    if isinstance(obj, (date, datetime)):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")


def push_notification(results, correlation_id):
    """
    Push notification to the user using the Spring server
    """
    try:
        url = os.environ.get("SPRING_URL")
        headers = {"Content-Type": "application/json"}

        payload = {
            "correlation_id": correlation_id,
            "title": "6/" + results[0].get("category"),
            "body": json.dumps(
                results[0].get('prize_amount', {}).get('message'),
                default=serialize_date),
        }

        response = requests.post(
            url + "/notification/send",
            json=payload,
            headers=headers,
            timeout=10,
        )
        if response.status_code == 200:
            return {"message": "Notification sent successfully"}
        return {"error": {"message": "Error sending notification"}}
    except Exception as e:
        print(f"Error: {e}")
        return {"error": {"message": "Error sending notification"}}

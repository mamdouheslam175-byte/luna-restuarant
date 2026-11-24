
import json
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from menu.models import MenuItem

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

json_path = os.path.join(BASE_DIR, "menu_data.json")

with open(json_path, "r", encoding="utf-8") as file:
    menu_items = json.load(file)

for item in menu_items:
    MenuItem.objects.update_or_create(
        slug=item["id"],
        defaults={
            "name_en": item["name"]["en"],
            "name_ar": item["name"]["ar"],
            "description_en": item["desc"]["en"],
            "description_ar": item["desc"]["ar"],
            "price": item["price"],
            "category": item["cat"],
            "image": item.get("img"),
            "emoji": item.get("emoji", ""),
            "is_available": True,
        }
    )

print(f"Successfully imported {len(menu_items)} menu items!")

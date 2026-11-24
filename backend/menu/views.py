
from django.http import JsonResponse
from .models import MenuItem
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def menu_list(request):
    items = MenuItem.objects.filter(is_available=True)

    data = []

    for item in items:
        data.append({
            "id": item.slug,
            "cat": item.category,
            "price": float(item.price),
            "emoji": item.emoji,
            "img": item.image,
            "name": {
                "en": item.name_en,
                "ar": item.name_ar,
            },
            "desc": {
                "en": item.description_en,
                "ar": item.description_ar,
            },
        })

    return JsonResponse(data, safe=False)


import json
from decimal import Decimal
from django.db import transaction
from django.views.decorators.http import require_POST
from .models import Order, OrderItem


@require_POST
def create_order(request):
    try:
        data = json.loads(request.body)

        name = str(data.get("name", "")).strip()
        phone = str(data.get("phone", "")).strip()
        note = str(data.get("note", "")).strip()
        items = data.get("items", [])

        if not name or not phone or not items:
            return JsonResponse(
                {"error": "Name, phone and items are required"},
                status=400
            )

        total = Decimal("0.00")
        order_items = []

        for entry in items:
            slug = entry.get("id")
            quantity = int(entry.get("quantity", 0))

            if quantity < 1 or quantity > 99:
                return JsonResponse(
                    {"error": "Invalid quantity"},
                    status=400
                )

            try:
                menu_item = MenuItem.objects.get(
                    slug=slug,
                    is_available=True
                )
            except MenuItem.DoesNotExist:
                return JsonResponse(
                    {"error": "Menu item not found"},
                    status=400
                )

            price = menu_item.price
            total += price * quantity

            order_items.append({
                "menu_item": menu_item,
                "quantity": quantity,
                "price": price,
            })

        with transaction.atomic():
            order = Order.objects.create(
                name=name,
                phone=phone,
                note=note,
                total=total,
            )

            for item in order_items:
                OrderItem.objects.create(
                    order=order,
                    menu_item=item["menu_item"],
                    quantity=item["quantity"],
                    price=item["price"],
                )

        return JsonResponse({
            "message": "Order created successfully",
            "order_id": order.id,
            "total": float(total),
        }, status=201)

    except (json.JSONDecodeError, ValueError, TypeError):
        return JsonResponse(
            {"error": "Invalid order data"},
            status=400
        )


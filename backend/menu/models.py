
from django.db import models


class MenuItem(models.Model):
    slug = models.SlugField(max_length=50, unique=True, null=True, blank=True)

    name_en = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100)

    description_en = models.TextField()
    description_ar = models.TextField()

    price = models.DecimalField(max_digits=8, decimal_places=2)

    category = models.CharField(max_length=50)

    image = models.URLField(blank=True, null=True)

    emoji = models.CharField(max_length=10, blank=True)

    is_available = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name_en


class Order(models.Model):
    name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    note = models.TextField(blank=True)

    total = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} - {self.name}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name="items"
    )

    menu_item = models.ForeignKey(
        MenuItem,
        on_delete=models.PROTECT
    )

    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.menu_item.name_en} x {self.quantity}"

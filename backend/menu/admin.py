from django.contrib import admin
from .models import MenuItem, Order, OrderItem


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = (
        'slug',
        'name_en',
        'price',
        'category',
        'emoji',
        'is_available'
    )

    list_filter = ('category', 'is_available')

    search_fields = ('name_en', 'name_ar', 'slug') 


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'name',
        'phone',
        'total',
        'created_at',
    )

    search_fields = ('name', 'phone')
    list_filter = ('created_at',)

    inlines = [OrderItemInline]

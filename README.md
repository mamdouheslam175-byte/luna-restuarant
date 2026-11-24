
# 🍽️ Luna Restaurant

A modern and responsive restaurant website built to provide customers with a smooth and enjoyable online dining experience.

## 📌 About The Project

Luna Restaurant is a full-stack web application that allows customers to explore the restaurant menu, view food details, add items to their cart, and place orders.

The project combines a responsive frontend with a Django backend and database integration.

## ✨ Features

- Responsive and modern user interface.
- Arabic and English language support.
- Dynamic menu loaded from the Django API.
- Menu categories and search functionality.
- Shopping cart with quantity management.
- Order submission and database storage.
- WhatsApp integration for customer orders.
- Django Admin dashboard to manage menu items and orders.

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Python
- Django
- Django REST-style JSON API

### Database
- SQLite

### Tools
- Git & GitHub
- Visual Studio Code / Code Editor

## 📂 Project Structure

```text
Luna-Restaurant/
│
├── backend/
│   ├── config/
│   ├── menu/
│   ├── manage.py
│   ├── import_menu.py
│   └── menu_data.json
│
├── index.html
├── style.css
├── script.JS
├── data.js
└── README.md
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mamdouheslam175-byte/luna-restuarant.git
```

### 2. Navigate to the project folder

```bash
cd luna-restuarant
```

### 3. Create a virtual environment

```bash
python -m venv .venv
```

### 4. Activate the virtual environment

Windows CMD:

```cmd
.venv\Scripts\activate
```

### 5. Install dependencies

```bash
pip install django django-cors-headers
```

### 6. Navigate to the backend folder

```bash
cd backend
```

### 7. Apply database migrations

```bash
python manage.py migrate
```

### 8. Import menu data

```bash
python import_menu.py
```

### 9. Create an admin account

```bash
python manage.py createsuperuser
```

### 10. Run the Django server

```bash
python manage.py runserver
```

The backend API will be available at:

`http://127.0.0.1:8000/api/menu/`

## 🔐 Admin Dashboard

Access the Django administration panel:

`http://127.0.0.1:8000/admin/`

From there, administrators can manage menu items and customer orders.

## 👨‍💻 Developer

**Mamdouh Eslam**

GitHub: [mamdouheslam175-byte](https://github.com/mamdouheslam175-byte)

## 📄 License

This project was developed as a portfolio project.

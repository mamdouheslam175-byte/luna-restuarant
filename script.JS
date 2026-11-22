
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
});

// Close menu after clicking a link
navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("active");
    });
});

const reservationForm = document.getElementById("reservation-form");

reservationForm.addEventListener("submit", function (event) {
    event.preventDefault();

    alert("Your reservation request has been received! Thank you.");

    reservationForm.reset();
});
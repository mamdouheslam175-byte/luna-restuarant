/* =====================================================
   LUNA RESTAURANT — behaviour
   Needs data.js loaded first (CONFIG, CATEGORIES, MENU, I18N ...).
   ===================================================== */

(function () {
    "use strict";

    /* ---------- helpers ---------- */

    const $ = (sel, root) => (root || document).querySelector(sel);
    const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

    const store = {
        get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
        set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* storage unavailable */ } }
    };

    function esc(value) {
        return String(value).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }


    let MENU = [];
    const MENU_BY_ID = {};

    function getCookie(name) {
        let cookieValue = null;

        if (document.cookie && document.cookie !== "") {
            const cookies = document.cookie.split(";");

            for (let cookie of cookies) {
                cookie = cookie.trim();

                if (cookie.startsWith(name + "=")) {
                    cookieValue = decodeURIComponent(
                        cookie.substring(name.length + 1)
                    );
                    break;
                }
            }
        }

        return cookieValue;
    }

    async function loadMenuFromAPI() {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/menu/", {
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error("Failed to load menu");
            }

            MENU = await response.json();

            Object.keys(MENU_BY_ID).forEach(function (key) {
                delete MENU_BY_ID[key];
            });
            MENU.forEach(function (item) {
                MENU_BY_ID[item.id] = item;
            });

            renderTabs();
            renderMenu();

        } catch (error) {
            console.error("Menu API Error:", error);
            menuGrid.innerHTML = '<p class="menu-empty">Unable to load menu.</p>';
        }
    }


    /* ---------- elements ---------- */

    const navLinks = $("#nav-links");
    const menuToggle = $("#menu-toggle");
    const langToggle = $("#lang-toggle");
    const cartButton = $("#cart-button");
    const cartCountEl = $("#cart-count");
    const menuTabs = $("#menu-tabs");
    const menuGrid = $("#menu-grid");
    const menuSearch = $("#menu-search");

    const footerContact = $("#footer-contact");

    const resForm = $("#reservation-form");
    const resDate = $("#res-date");
    const resTime = $("#res-time");
    const resGuests = $("#res-guests");
    const resSubmit = $("#res-submit");
    const resStatus = $("#res-status");

    const cartOverlay = $("#cart-overlay");
    const cartDrawer = $("#cart-drawer");
    const cartClose = $("#cart-close");
    const cartItems = $("#cart-items");
    const cartTotalEl = $("#cart-total");
    const checkoutForm = $("#checkout-form");
    const checkoutButton = $("#checkout-button");
    const cartStatus = $("#cart-status");
    const cartClear = $("#cart-clear");

    /* ---------- state ---------- */

    const LANGS = ["en", "ar"];
    let lang = initialLang();
    let activeCat = "all";
    let cart = loadCart();
    let lastFocus = null;

    function initialLang() {
        const saved = store.get("luna-lang");
        if (LANGS.indexOf(saved) !== -1) return saved;
        return (navigator.language || "").toLowerCase().indexOf("ar") === 0 ? "ar" : "en";
    }

    function loadCart() {
        const clean = {};
        try {
            const raw = JSON.parse(store.get("luna-cart") || "{}");
            Object.keys(raw).forEach(function (id) {
                const qty = raw[id];
                if (MENU_BY_ID[id] && Number.isInteger(qty) && qty > 0) clean[id] = Math.min(qty, 99);
            });
        } catch (e) { /* corrupted data: start with an empty cart */ }
        return clean;
    }

    function saveCart() {
        store.set("luna-cart", JSON.stringify(cart));
    }

    /* ---------- translation + formatting ---------- */

    function t(key, vars) {
        let text = (I18N[lang] && I18N[lang][key]);
        if (text === undefined) text = I18N.en[key];
        if (text === undefined) text = key;
        if (vars) {
            Object.keys(vars).forEach(function (k) {
                text = text.split("{" + k + "}").join(vars[k]);
            });
        }
        return text;
    }

    function pick(obj) {
        return obj[lang] || obj.en || "";
    }

    function locale() {
        return lang === "ar" ? "ar-EG" : "en-US";
    }

    function formatPrice(n) {
        const rounded = Math.round(n * 100) / 100;
        const num = rounded.toLocaleString(locale(), {
            minimumFractionDigits: Number.isInteger(rounded) ? 0 : 2,
            maximumFractionDigits: 2
        });
        return CONFIG.priceFormat[lang].replace("{n}", num);
    }

    function minutesOf(hhmm) {
        const parts = hhmm.split(":").map(Number);
        return parts[0] * 60 + parts[1];
    }

    function formatMinutes(total) {
        const d = new Date(2000, 0, 1, Math.floor(total / 60), total % 60);
        return d.toLocaleTimeString(locale(), { hour: "numeric", minute: "2-digit" });
    }

    function setStatus(el, message, type) {
        el.textContent = message;
        el.className = "form-status" + (type ? " is-" + type : "");
    }

    function callUs() {
        return CONFIG.phone ? " " + t("contact.call", { phone: CONFIG.phone }) : "";
    }

    function whatsappUrl(message) {
        const number = String(CONFIG.whatsappNumber).replace(/\D/g, "");
        return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
    }

    /* ---------- language ---------- */

    function applyLang(next) {
        lang = next;
        store.set("luna-lang", lang);

        const root = document.documentElement;
        root.lang = lang;
        root.dir = lang === "ar" ? "rtl" : "ltr";

        document.title = t("meta.title");
        $("#meta-description").setAttribute("content", t("meta.desc"));

        $$("[data-i18n]").forEach(function (el) { el.textContent = t(el.dataset.i18n); });
        $$("[data-i18n-placeholder]").forEach(function (el) { l.placeholder = t(el.dataset.i18nPlaceholder); });
        $$("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.dataset.i18nHtml); });
        $$("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });

        const other = lang === "ar" ? "en" : "ar";
        langToggle.textContent = other === "ar" ? "العربية" : "English";
        langToggle.setAttribute("lang", other);

        renderTabs();
        renderMenu();
        renderCart();
        buildSelects();
        renderFooter();

        setStatus(resStatus, "");
        setStatus(cartStatus, "");
    }

    langToggle.addEventListener("click", function () {
        applyLang(lang === "ar" ? "en" : "ar");
    });

    /* ---------- mobile navigation ---------- */

    function setNav(open) {
        navLinks.classList.toggle("active", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.textContent = open ? "✕" : "☰";
    }

    menuToggle.addEventListener("click", function () {
        setNav(!navLinks.classList.contains("active"));
    });

    navLinks.addEventListener("click", function (e) {
        if (e.target.closest("a")) setNav(false);
    });

    window.addEventListener("resize", function () {
        if (window.innerWidth > 768) setNav(false);
    });

    /* ---------- menu ---------- */

    function renderTabs() {
        const tabs = [{ id: "all", label: t("menu.all") }].concat(
            CATEGORIES.map(function (c) { return { id: c.id, label: pick(c) }; })
        );
        menuTabs.innerHTML = tabs.map(function (tab) {
            return '<button type="button" class="menu-tab" data-cat="' + esc(tab.id) +
                '" aria-pressed="' + (tab.id === activeCat) + '">' + esc(tab.label) + "</button>";
        }).join("");
    }

    function renderMenu() {
        const query = menuSearch.value.trim().toLocaleLowerCase();

        const items = MENU.filter(function (item) {
            const categoryMatch =
                activeCat === "all" || item.cat === activeCat;

            const searchableText = [
                item.name.en,
                item.name.ar,
                item.desc.en,
                item.desc.ar
            ].join(" ").toLocaleLowerCase();

            const searchMatch = searchableText.includes(query);

            return categoryMatch && searchMatch;
        });

        if (!items.length) {
            menuGrid.innerHTML =
                '<p class="menu-empty">' + esc(t("menu.noResults")) + '</p>';
            return;
        }

        menuGrid.innerHTML = items.map(function (item) {
            const name = pick(item.name);

            const media = item.img
                ? '<div class="menu-card-media"><img src="' +
                esc(item.img) + '" alt="' +
                esc(name) + '" loading="lazy"></div>'
                : '<div class="menu-card-media placeholder" aria-hidden="true">' +
                esc(item.emoji || "🍽️") + "</div>";

            return '<article class="menu-card" data-details="' +
                esc(item.id) + '">' + media +
                '<div class="menu-card-content">' +
                "<h3>" + esc(name) + "</h3>" +
                "<p>" + esc(pick(item.desc)) + "</p>" +
                '<div class="menu-card-footer">' +
                '<span class="price">' + esc(formatPrice(item.price)) + "</span>" +
                '<button type="button" class="add-button" data-add="' +
                esc(item.id) + '">' + esc(t("menu.add")) + "</button>" +
                "</div></div></article>";
        }).join("");
    }



    menuTabs.addEventListener("click", function (e) {
        const tab = e.target.closest("[data-cat]");
        if (!tab) return;
        activeCat = tab.dataset.cat;
        renderTabs();
        renderMenu();
    });


    menuSearch.addEventListener("input", function () {
        renderMenu();
    });

    menuGrid.addEventListener("click", function (e) {
        const button = e.target.closest("[data-add]");
        if (!button) return;

        changeQty(button.dataset.add, 1);

        button.textContent = t("menu.added");
        setTimeout(function () {
            if (button.isConnected) button.textContent = t("menu.add");
        }, 900);
    });

    // Food Details Modal
    let selectedFood = null;
    let foodQuantity = 1;

    const foodModal = document.getElementById("foodModal");

    menuGrid.addEventListener("click", function (e) {
        if (e.target.closest("[data-add]")) return;

        const card = e.target.closest("[data-details]");
        if (!card) return;

        selectedFood = MENU.find(function (item) {
            return item.id === card.dataset.details;
        });

        if (!selectedFood) return;

        foodQuantity = 1;

        document.getElementById("modalFoodImg").src =
            selectedFood.img || "";

        document.getElementById("modalFoodName").textContent =
            pick(selectedFood.name);

        document.getElementById("modalFoodDesc").textContent =
            pick(selectedFood.desc);

        document.getElementById("modalFoodPrice").textContent =
            formatPrice(selectedFood.price);

        document.getElementById("foodQty").textContent =
            foodQuantity;

        foodModal.classList.add("active");
    });

    // Close Modal
    document.getElementById("closeFoodModal").addEventListener("click", function () {
        foodModal.classList.remove("active");
    });

    foodModal.addEventListener("click", function (e) {
        if (e.target === foodModal) {
            foodModal.classList.remove("active");
        }
    });

    // Quantity Controls
    document.getElementById("increaseQty").addEventListener("click", function () {
        foodQuantity++;
        document.getElementById("foodQty").textContent = foodQuantity;
    });

    document.getElementById("decreaseQty").addEventListener("click", function () {
        if (foodQuantity > 1) {
            foodQuantity--;
            document.getElementById("foodQty").textContent = foodQuantity;
        }
    });

    // Add to Cart
    document.getElementById("addFoodToCart").addEventListener("click", function () {
        if (!selectedFood) return;

        changeQty(selectedFood.id, foodQuantity);

        foodModal.classList.remove("active");
    });


    /* ---------- cart ---------- */

    function cartCount() {
        return Object.keys(cart).reduce(function (sum, id) { return sum + cart[id]; }, 0);
    }

    function cartTotal() {
        return Object.keys(cart).reduce(function (sum, id) {
            return sum + MENU_BY_ID[id].price * cart[id];
        }, 0);
    }

    function changeQty(id, delta) {
        const next = (cart[id] || 0) + delta;
        if (next <= 0) delete cart[id];
        else cart[id] = Math.min(next, 99);
        saveCart();
        renderCart();

        if (delta > 0) {
            cartCountEl.classList.remove("bump");
            void cartCountEl.offsetWidth;
            cartCountEl.classList.add("bump");
        }
    }


    function renderCart() {
        const ids = Object.keys(cart);
        const count = cartCount();

        cartCountEl.textContent = count.toLocaleString(locale());
        cartCountEl.hidden = count === 0;

        if (!ids.length) {
            cartItems.innerHTML =
                '<li class="cart-empty">' + esc(t("cart.empty")) + "</li>";
        } else {
            cartItems.innerHTML = ids.map(function (id) {
                const item = MENU_BY_ID[id];
                const qty = cart[id];

                const image = item.img
                    ? '<img class="cart-item-image" src="' +
                    esc(item.img) + '" alt="' +
                    esc(pick(item.name)) + '" loading="lazy">'
                    : '<span class="cart-item-emoji">' +
                    esc(item.emoji || "🍽️") + '</span>';

                return '<li class="cart-item">' +
                    image +
                    '<div class="cart-item-details">' +
                    '<p class="cart-item-name">' +
                    esc(pick(item.name)) + '</p>' +
                    '<p class="cart-item-price">' +
                    esc(formatPrice(item.price * qty)) + '</p>' +
                    '<div class="qty">' +
                    '<button type="button" data-act="dec" data-id="' +
                    esc(id) + '">−</button>' +
                    '<span>' + esc(qty.toLocaleString(locale())) + '</span>' +
                    '<button type="button" data-act="inc" data-id="' +
                    esc(id) + '">+</button>' +
                    '</div></div></li>';
            }).join("");
        }

        cartTotalEl.textContent = formatPrice(cartTotal());
        checkoutButton.disabled = !ids.length;
        cartClear.hidden = !ids.length;
    }


    cartItems.addEventListener("click", function (e) {
        const button = e.target.closest("[data-act]");
        if (!button) return;
        changeQty(button.dataset.id, button.dataset.act === "inc" ? 1 : -1);
    });

    cartClear.addEventListener("click", function () {
        cart = {};
        saveCart();
        renderCart();
        setStatus(cartStatus, "");
    });

    function openCart() {
        lastFocus = document.activeElement;
        cartDrawer.classList.add("is-open");
        cartOverlay.classList.add("is-open");
        document.body.classList.add("no-scroll");
        cartClose.focus();
    }

    function closeCart() {
        cartDrawer.classList.remove("is-open");
        cartOverlay.classList.remove("is-open");
        document.body.classList.remove("no-scroll");
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    cartButton.addEventListener("click", openCart);
    cartClose.addEventListener("click", closeCart);
    cartOverlay.addEventListener("click", closeCart);

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (cartDrawer.classList.contains("is-open")) closeCart();
            setNav(false);
        }
    });

    /* keep keyboard focus inside the open drawer */
    cartDrawer.addEventListener("keydown", function (e) {
        if (e.key !== "Tab") return;
        const focusable = $$("button, input, [href]", cartDrawer).filter(function (el) {
            return !el.disabled && !el.hidden;
        });
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });

    // Save and restore customer information
    const customerFields = ["name", "phone", "note"];

    function loadCustomerInfo() {
        customerFields.forEach(function (field) {
            const input = checkoutForm.elements[field];
            const savedValue = localStorage.getItem("luna_customer_" + field);

            if (savedValue !== null) {
                input.value = savedValue;
            }
        });
    }

    function saveCustomerInfo() {
        customerFields.forEach(function (field) {
            const input = checkoutForm.elements[field];

            localStorage.setItem(
                "luna_customer_" + field,
                input.value
            );
        });
    }

    loadCustomerInfo();


    customerFields.forEach(function (field) {
        checkoutForm.elements[field].addEventListener("input", saveCustomerInfo);
    });



    checkoutForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        if (!Object.keys(cart).length) return;

        if (!CONFIG.whatsappNumber) {
            setStatus(cartStatus, t("order.unavailable") + callUs(), "error");
            return;
        }

        const form = new FormData(checkoutForm);

        const name = String(form.get("name")).trim();
        const phone = String(form.get("phone")).trim();
        const note = String(form.get("note")).trim();

        // تجهيز بيانات الطلب لإرسالها إلى Django
        const orderData = {
            name: name,
            phone: phone,
            note: note,
            items: Object.keys(cart).map(function (id) {
                return {
                    id: id,
                    quantity: cart[id]
                };
            })
        };

        // تجهيز رسالة WhatsApp
        const lines = [
            "*" + t("msg.orderTitle") + "*",
            t("msg.name") + ": " + name,
            t("msg.phone") + ": " + phone
        ];

        if (note) lines.push(t("msg.note") + ": " + note);
        lines.push("");

        Object.keys(cart).forEach(function (id) {
            const item = MENU_BY_ID[id];

            lines.push(
                "• " + cart[id] + " × " +
                pick(item.name) + " — " +
                formatPrice(item.price * cart[id])
            );
        });

        lines.push("", t("msg.total") + ": " + formatPrice(cartTotal()));

        // فتح نافذة WhatsApp بشكل مبدئي لتجنب منع النوافذ المنبثقة
        const whatsappWindow = window.open("about:blank", "_blank");

        try {
            setStatus(cartStatus, "Saving your order...", "ok");

            // إرسال الطلب إلى Django
            const response = await fetch(
                "http://127.0.0.1:8000/api/orders/",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "X-CSRFToken": getCookie("csrftoken")
                    },
                    body: JSON.stringify(orderData)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Failed to save order");
            }

            // فتح WhatsApp بعد نجاح حفظ الطلب
            const whatsappLink = whatsappUrl(lines.join("\n"));

            if (whatsappWindow) {
                whatsappWindow.location.href = whatsappLink;
            } else {
                window.location.href = whatsappLink;
            }

            setStatus(cartStatus, "Order saved successfully!", "ok");

            console.log("Saved Order:", result);

        } catch (error) {
            console.error("Order Error:", error);

            if (whatsappWindow) {
                whatsappWindow.close();
            }

            setStatus(
                cartStatus,
                "Could not save your order. Please try again.",
                "error"
            );
        }
    });

    /* ---------- reservation form ---------- */

    function todayISO() {
        const d = new Date();
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    }

    function buildSelects() {
        const keepGuests = resGuests.value;
        const keepTime = resTime.value;
        const placeholder = '<option value="">' + esc(t("res.choose")) + "</option>";

        let guests = placeholder;
        for (let n = 1; n <= MAX_GUESTS; n++) {
            guests += '<option value="' + n + '">' + esc(GUESTS_LABEL[lang](n)) + "</option>";
        }
        resGuests.innerHTML = guests;
        resGuests.value = keepGuests;

        const hours = CONFIG.openingHours;
        const last = minutesOf(hours.close) - hours.lastSeatingBeforeClose;
        let times = placeholder;
        for (let m = minutesOf(hours.open); m <= last; m += hours.slotMinutes) {
            const value = String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
            times += '<option value="' + value + '">' + esc(formatMinutes(m)) + "</option>";
        }
        resTime.innerHTML = times;
        resTime.value = keepTime;
    }

    function formatDateLong(iso) {
        const p = iso.split("-").map(Number);
        return new Date(p[0], p[1] - 1, p[2]).toLocaleDateString(locale(), {
            weekday: "long", year: "numeric", month: "long", day: "numeric"
        });
    }

    resDate.min = todayISO();

    resForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const form = new FormData(resForm);
        const data = {
            name: String(form.get("name")).trim(),
            phone: String(form.get("phone")).trim(),
            email: String(form.get("email")).trim(),
            date: String(form.get("date")),
            time: String(form.get("time")),
            guests: Number(form.get("guests")),
            notes: String(form.get("notes")).trim()
        };

        const d = data.date.split("-").map(Number);
        const tm = data.time.split(":").map(Number);
        if (new Date(d[0], d[1] - 1, d[2], tm[0], tm[1]) <= new Date()) {
            setStatus(resStatus, t("res.past"), "error");
            return;
        }

        if (CONFIG.reservationEndpoint) {
            sendToEndpoint(data);
        } else if (CONFIG.whatsappNumber) {
            sendToWhatsApp(data);
        } else {
            setStatus(resStatus, t("res.unavailable") + callUs(), "error");
        }
    });

    function sendToWhatsApp(data) {
        const lines = [
            "*" + t("msg.reservationTitle") + "*",
            t("msg.name") + ": " + data.name,
            t("msg.phone") + ": " + data.phone
        ];
        if (data.email) lines.push(t("msg.email") + ": " + data.email);
        lines.push(
            t("msg.date") + ": " + formatDateLong(data.date),
            t("msg.time") + ": " + formatMinutes(minutesOf(data.time)),
            t("msg.guests") + ": " + data.guests
        );
        if (data.notes) lines.push(t("msg.notes") + ": " + data.notes);

        window.open(whatsappUrl(lines.join("\n")), "_blank", "noopener");
        setStatus(resStatus, t("res.opening"), "ok");
    }

    function sendToEndpoint(data) {
        resSubmit.disabled = true;
        setStatus(resStatus, t("res.sending"));

        fetch(CONFIG.reservationEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify(data)
        }).then(function (response) {
            if (!response.ok) throw new Error("HTTP " + response.status);
            setStatus(resStatus, t("res.done"), "ok");
            resForm.reset();
        }).catch(function () {
            setStatus(resStatus, t("res.error") + callUs(), "error");
        }).then(function () {
            resSubmit.disabled = false;
        });
    }

    /* ---------- footer ---------- */

    function renderFooter() {
        const hours = CONFIG.openingHours;
        const items = [
            "<li>" + esc(t("footer.hours", {
                from: formatMinutes(minutesOf(hours.open)),
                to: formatMinutes(minutesOf(hours.close))
            })) + "</li>"
        ];

        const address = CONFIG.address && pick(CONFIG.address);
        if (address) items.push("<li>" + esc(address) + "</li>");

        if (CONFIG.phone) {
            const tel = CONFIG.phone.replace(/[^\d+]/g, "");
            items.push('<li><a href="tel:' + esc(tel) + '" dir="ltr">' + esc(CONFIG.phone) + "</a></li>");
        }

        footerContact.innerHTML = items.join("");
        $("#copyright").textContent = t("footer.rights", { year: new Date().getFullYear() });
    }

    /* ---------- start ---------- */

    applyLang(lang);
    loadMenuFromAPI();
})();
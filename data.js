/* =====================================================
   LUNA RESTAURANT — settings, menu and translations
   This is the only file you need to edit for day-to-day changes.
   ===================================================== */

const CONFIG = {

    /* WhatsApp number that receives reservations and orders.
       International format, digits only, no "+" or spaces.
       Example (Egypt): "201001234567"
       Leave empty ("") until you have the real number: online booking and
       ordering stay switched off so nothing is sent to a wrong number. */
    whatsappNumber: "",

    /* Optional: a form endpoint (e.g. Formspree) that receives reservations
       as JSON. If set, it is used for reservations instead of WhatsApp. */
    reservationEndpoint: "",

    /* Shown in the footer and in "please call us" messages. Leave "" to hide. */
    phone: "",
    address: { en: "", ar: "" },

    /* Opening hours (24h, same day). They drive the reservation time slots
       and the footer. The last slot is `lastSeatingBeforeClose` minutes
       before closing. */
    openingHours: {
        open: "12:00",
        close: "23:00",
        slotMinutes: 30,
        lastSeatingBeforeClose: 60
    },

    /* How prices are displayed. {n} is replaced by the number. */
    priceFormat: { en: "${n}", ar: "{n} $" }
};


/* ---------- Menu categories ---------- */

const CATEGORIES = [
    { id: "starters", en: "Starters", ar: "المقبلات" },
    { id: "mains", en: "Main Dishes", ar: "الأطباق الرئيسية" },
    { id: "desserts", en: "Desserts", ar: "الحلويات" },
    { id: "drinks", en: "Drinks", ar: "المشروبات" }
];


/* ---------- Menu items ----------
   id:    unique, no spaces
   cat:   one of the category ids above
   price: number
   img:   image URL or local path (optional — without it a card with the
          `emoji` is shown instead)
   These dishes are samples: replace them with your real menu.        */

const MENU = [
    {
        id: "bruschetta", cat: "starters", price: 8, emoji: "🥖",
        name: { en: "Tomato Bruschetta", ar: "بروسكيتا الطماطم" },
        desc: {
            en: "Toasted ciabatta, ripe tomatoes, basil and olive oil.",
            ar: "خبز تشياباتا محمّص مع طماطم ناضجة وريحان وزيت زيتون."
        }
    },
    {
        id: "caesar", cat: "starters", price: 9, emoji: "🥗",
        name: { en: "Caesar Salad", ar: "سلطة سيزر" },
        desc: {
            en: "Crisp romaine, parmesan, croutons and house dressing.",
            ar: "خس روماني مقرمش وبارميزان وقطع خبز محمّص وصلصة خاصة."
        }
    },
    {
        id: "soup", cat: "starters", price: 7, emoji: "🥣",
        name: { en: "Tomato Basil Soup", ar: "شوربة الطماطم بالريحان" },
        desc: {
            en: "Slow-simmered tomatoes finished with fresh basil.",
            ar: "طماطم مطهوّة ببطء مع لمسة ريحان طازج."
        }
    },

    {
        id: "pasta", cat: "mains", price: 14, emoji: "🍝",
        img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=80",
        name: { en: "Italian Pasta", ar: "باستا إيطالية" },
        desc: {
            en: "Fresh pasta with a rich creamy sauce.",
            ar: "باستا طازجة مع صلصة كريمية غنية."
        }
    },
    {
        id: "burger", cat: "mains", price: 12, emoji: "🍔",
        img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
        name: { en: "Classic Burger", ar: "برجر كلاسيك" },
        desc: {
            en: "Premium beef with fresh ingredients.",
            ar: "لحم بقري فاخر مع مكونات طازجة."
        }
    },
    {
        id: "pizza", cat: "mains", price: 16, emoji: "🍕",
        img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=700&q=80",
        name: { en: "Italian Pizza", ar: "بيتزا إيطالية" },
        desc: {
            en: "Authentic pizza baked to perfection.",
            ar: "بيتزا أصلية مخبوزة بإتقان."
        }
    },
    {
        id: "salmon", cat: "mains", price: 22, emoji: "🐟",
        name: { en: "Grilled Salmon", ar: "سلمون مشوي" },
        desc: {
            en: "Served with lemon butter and seasonal vegetables.",
            ar: "يُقدَّم مع زبدة الليمون وخضار الموسم."
        }
    },
    {
        id: "steak", cat: "mains", price: 28, emoji: "🥩",
        name: { en: "Ribeye Steak", ar: "ريب آي ستيك" },
        desc: {
            en: "Charred to order with garlic butter and fries.",
            ar: "مشوي حسب الطلب مع زبدة الثوم والبطاطس."
        }
    },

    {
        id: "tiramisu", cat: "desserts", price: 8, emoji: "🍰",
        name: { en: "Tiramisu", ar: "تيراميسو" },
        desc: {
            en: "Espresso-soaked layers with mascarpone cream.",
            ar: "طبقات مبلّلة بالإسبريسو مع كريمة الماسكاربون."
        }
    },
    {
        id: "cheesecake", cat: "desserts", price: 7, emoji: "🍰",
        name: { en: "New York Cheesecake", ar: "تشيز كيك نيويورك" },
        desc: {
            en: "Creamy cheesecake with berry compote.",
            ar: "تشيز كيك كريمي مع صلصة التوت."
        }
    },
    {
        id: "lava", cat: "desserts", price: 9, emoji: "🍫",
        name: { en: "Chocolate Lava Cake", ar: "كيكة الشوكولاتة الذائبة" },
        desc: {
            en: "Warm chocolate cake with a molten center.",
            ar: "كيكة شوكولاتة دافئة بقلب ذائب."
        }
    },

    {
        id: "lemonade", cat: "drinks", price: 4, emoji: "🍋",
        name: { en: "Fresh Lemonade", ar: "ليمونادة طازجة" },
        desc: {
            en: "Freshly squeezed with a touch of mint.",
            ar: "عصير ليمون طازج مع لمسة نعناع."
        }
    },
    {
        id: "coffee", cat: "drinks", price: 5, emoji: "☕",
        name: { en: "Iced Coffee", ar: "آيس كوفي" },
        desc: {
            en: "Cold-brewed coffee over ice.",
            ar: "قهوة مخمّرة على البارد مع الثلج."
        }
    },
    {
        id: "orange", cat: "drinks", price: 5, emoji: "🍊",
        name: { en: "Fresh Orange Juice", ar: "عصير برتقال طازج" },
        desc: {
            en: "Squeezed to order.",
            ar: "يُعصر عند الطلب."
        }
    }
];


/* ---------- Interface text ---------- */

const I18N = {

    en: {
        "meta.title": "Luna Restaurant",
        "meta.desc": "Luna Restaurant – unforgettable flavors. Browse the menu and book your table.",

        "nav.home": "Home",
        "nav.menu": "Menu",
        "nav.about": "About",
        "nav.contact": "Contact",
        "nav.book": "Book a Table",

        "hero.eyebrow": "A TASTE OF SOMETHING SPECIAL",
        "hero.title": "Where flavor<br>meets <span>elegance.</span>",
        "hero.desc": "Discover a world of unforgettable flavors, crafted with passion and served with love.",
        "hero.explore": "Explore Menu",
        "hero.reserve": "Reserve a Table",

        "menu.eyebrow": "OUR SPECIALTIES",
        "menu.title": "Discover Our Menu",
        "menu.sub": "Carefully crafted dishes made with fresh ingredients.",
        "menu.all": "All",
        "menu.add": "Add",
        "menu.added": "Added ✓",
        "menu.search": "Search dishes...",
        "menu.noResults": "No dishes found.",

        "about.eyebrow": "OUR STORY",
        "about.title": "A passion for<br>great food.",
        "about.text": "At Luna, we believe that every meal should be an experience. Our chefs combine fresh ingredients, creativity, and passion to bring you unforgettable dishes.",
        "about.cta": "Join Us",

        "res.eyebrow": "YOUR TABLE AWAITS",
        "res.title": "Make a Reservation",
        "res.sub": "Reserve your place for an unforgettable dining experience.",
        "res.name": "Your name",
        "res.phone": "Phone number",
        "res.email": "Email (optional)",
        "res.date": "Date",
        "res.time": "Time",
        "res.guests": "Number of guests",
        "res.notes": "Special requests (optional)",
        "res.submit": "Book Now",
        "res.choose": "Select",
        "res.sending": "Sending…",
        "res.done": "Thank you! We received your reservation request and will confirm it shortly.",
        "res.opening": "Opening WhatsApp to send your reservation request…",
        "res.error": "Something went wrong. Please try again or call us.",
        "res.past": "Please choose a time later than now.",
        "res.unavailable": "Online booking isn't available right now.",

        "cart.open": "Open cart",
        "cart.close": "Close cart",
        "cart.title": "Your Order",
        "cart.empty": "Your cart is empty. Add some dishes from the menu.",
        "cart.total": "Total",
        "cart.name": "Your name",
        "cart.phone": "Phone number",
        "cart.note": "Address or table number",
        "cart.checkout": "Order via WhatsApp",
        "cart.clear": "Clear cart",
        "cart.inc": "Increase quantity",
        "cart.dec": "Decrease quantity",

        "order.opening": "Opening WhatsApp to send your order…",
        "order.unavailable": "Online ordering isn't available right now.",

        "msg.reservationTitle": "New reservation – Luna",
        "msg.orderTitle": "New order – Luna",
        "msg.name": "Name",
        "msg.phone": "Phone",
        "msg.email": "Email",
        "msg.guests": "Guests",
        "msg.date": "Date",
        "msg.time": "Time",
        "msg.notes": "Notes",
        "msg.note": "Address / table",
        "msg.total": "Total",

        "contact.call": "Please call us on {phone}.",

        "footer.tagline": "Crafting unforgettable moments, one dish at a time.",
        "footer.hours": "Open daily · {from} – {to}",
        "footer.rights": "© {year} Luna Restaurant. All rights reserved."
    },

    ar: {
        "meta.title": "مطعم لونا",
        "meta.desc": "مطعم لونا – نكهات لا تُنسى. تصفّح القائمة واحجز طاولتك.",

        "nav.home": "الرئيسية",
        "nav.menu": "القائمة",
        "nav.about": "من نحن",
        "nav.contact": "تواصل معنا",
        "nav.book": "احجز طاولة",

        "hero.eyebrow": "مذاق استثنائي",
        "hero.title": "حيث تلتقي النكهة<br><span>بالأناقة.</span>",
        "hero.desc": "اكتشف عالمًا من النكهات التي لا تُنسى، أُعدّت بشغف وتُقدَّم بحب.",
        "hero.explore": "استكشف القائمة",
        "hero.reserve": "احجز طاولة",

        "menu.eyebrow": "أطباقنا المميزة",
        "menu.title": "اكتشف قائمتنا",
        "menu.sub": "أطباق محضّرة بعناية من مكونات طازجة.",
        "menu.all": "الكل",
        "menu.add": "أضف",
        "menu.added": "تمت ✓",
        "menu.search": "ابحث عن أكلة...",
        "menu.noResults": "ملقيناش الأكلة دي.",

        "about.eyebrow": "حكايتنا",
        "about.title": "شغف بالطعام<br>الرائع.",
        "about.text": "في لونا، نؤمن بأن كل وجبة يجب أن تكون تجربة. يجمع طهاتنا بين المكونات الطازجة والإبداع والشغف ليقدّموا لك أطباقًا لا تُنسى.",
        "about.cta": "انضم إلينا",

        "res.eyebrow": "طاولتك بانتظارك",
        "res.title": "احجز طاولتك",
        "res.sub": "احجز مكانك لتجربة طعام لا تُنسى.",
        "res.name": "الاسم",
        "res.phone": "رقم الهاتف",
        "res.email": "البريد الإلكتروني (اختياري)",
        "res.date": "التاريخ",
        "res.time": "الوقت",
        "res.guests": "عدد الأشخاص",
        "res.notes": "طلبات خاصة (اختياري)",
        "res.submit": "احجز الآن",
        "res.choose": "اختر",
        "res.sending": "جاري الإرسال…",
        "res.done": "شكرًا لك! استلمنا طلب الحجز وسنؤكده معك قريبًا.",
        "res.opening": "جاري فتح واتساب لإرسال طلب الحجز…",
        "res.error": "حدث خطأ ما. حاول مرة أخرى أو اتصل بنا.",
        "res.past": "من فضلك اختر وقتًا لاحقًا من الوقت الحالي.",
        "res.unavailable": "الحجز أونلاين غير متاح حاليًا.",

        "cart.open": "فتح السلة",
        "cart.close": "إغلاق السلة",
        "cart.title": "طلبك",
        "cart.empty": "سلتك فارغة. أضف بعض الأطباق من القائمة.",
        "cart.total": "الإجمالي",
        "cart.name": "الاسم",
        "cart.phone": "رقم الهاتف",
        "cart.note": "العنوان أو رقم الطاولة",
        "cart.checkout": "اطلب عبر واتساب",
        "cart.clear": "إفراغ السلة",
        "cart.inc": "زيادة الكمية",
        "cart.dec": "تقليل الكمية",

        "order.opening": "جاري فتح واتساب لإرسال طلبك…",
        "order.unavailable": "الطلب أونلاين غير متاح حاليًا.",

        "msg.reservationTitle": "حجز جديد – لونا",
        "msg.orderTitle": "طلب جديد – لونا",
        "msg.name": "الاسم",
        "msg.phone": "الهاتف",
        "msg.email": "البريد",
        "msg.guests": "عدد الأشخاص",
        "msg.date": "التاريخ",
        "msg.time": "الوقت",
        "msg.notes": "ملاحظات",
        "msg.note": "العنوان / الطاولة",
        "msg.total": "الإجمالي",

        "contact.call": "من فضلك اتصل بنا على {phone}.",

        "footer.tagline": "نصنع لحظات لا تُنسى، طبقًا بعد طبق.",
        "footer.hours": "مفتوح يوميًا · {from} – {to}",
        "footer.rights": "© {year} مطعم لونا. جميع الحقوق محفوظة."
    }
};


/* Label for the guests dropdown (Arabic needs proper plural forms). */
const GUESTS_LABEL = {
    en: function (n) { return n === 1 ? "1 Person" : n + " People"; },
    ar: function (n) {
        if (n === 1) return "شخص واحد";
        if (n === 2) return "شخصان";
        return n + " أشخاص";
    }
};

const MAX_GUESTS = 10;
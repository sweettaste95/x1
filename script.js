

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}



document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
      fetchChampionshipData();

});

function initializeApp() {
    // التحقق من المستخدم المسجل
    const registeredUUID = localStorage.getItem("userUUID");
    const registerScreen = document.getElementById("register-screen");
    const overlay = document.getElementById("overlay");
    const mainButtons = document.getElementById("main-buttons");

    if (registeredUUID) {
        toggleVisibility(registerScreen, "hide");
        toggleVisibility(overlay, "hide");
        toggleVisibility(mainButtons, "show");
    } else {
        toggleVisibility(registerScreen, "show");
        toggleVisibility(overlay, "show");
        toggleVisibility(mainButtons, "hide");
    }

   
    // التحقق من الآدمن
    const adminEmail = "Abunowaf@outlook.com";
    const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails") || "[]");
    const userEmail = registeredEmails[0];

    if (userEmail !== adminEmail) {
        const sendLastMatchButton = document.getElementById("send-last-match");
        const telegramSendButton = document.getElementById("telegram-send-btn");

        if (sendLastMatchButton) sendLastMatchButton.style.display = "none";
        if (telegramSendButton) telegramSendButton.style.display = "none";
    }

    // تحديث رسالة الترحيب
    showWelcomeMessage();

    // إضافة الشريط النصي
    const marquee = document.getElementById("info-content");
    if (marquee) {
        marquee.textContent = "جاري البحث عن آخر مباراة...";
    }
}

function registerUser() {
    const name = document.getElementById("user-name").value;
    const email = document.getElementById("user-email").value;
    const registerButton = document.getElementById("register-btn");
    const uuid = generateUUID();
    const timestamp = new Date().toISOString();

    // منع النقر المتكرر على الزر
    registerButton.disabled = true;
    registerButton.textContent = "جاري التسجيل...";

    if (!name || !email) {
        alert("يرجى إدخال الاسم والبريد الإلكتروني.");
        registerButton.disabled = false;
        registerButton.textContent = "تسجيل";
        return;
    }

    if (isEmailRegistered(email)) {
        alert("هذا البريد الإلكتروني مسجل بالفعل.");
        toggleVisibility(document.getElementById("register-screen"), "hide");
        toggleVisibility(document.getElementById("overlay"), "hide");
        toggleVisibility(document.getElementById("main-buttons"), "show");
        registerButton.disabled = false;
        registerButton.textContent = "تسجيل";
        return;
    }

    // إرسال البيانات إلى Google Sheets وحفظها في Local Storage
    fetch(googleSheetURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, uuid, timestamp }),
        mode: "no-cors"
    })
        .then(() => {
            alert("تم التسجيل بنجاح!");

            // حفظ البيانات في Local Storage
            const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails")) || [];
            registeredEmails.push(email);
            localStorage.setItem("registeredEmails", JSON.stringify(registeredEmails));
            localStorage.setItem("userUUID", uuid);
            localStorage.setItem("username", name); // حفظ الاسم

            // تحديث واجهة المستخدم
            const welcomeMessage = document.getElementById("welcome-message");
            if (welcomeMessage) {
                welcomeMessage.textContent = `مرحبًا بك يا زعيــم ${name}`;
            }

            toggleVisibility(document.getElementById("register-screen"), "hide");
            toggleVisibility(document.getElementById("overlay"), "hide");
            toggleVisibility(document.getElementById("main-buttons"), "show");
        })
        .catch(error => {
            console.error("Error:", error);
            alert("حدث خطأ أثناء التسجيل. حاول مرة أخرى.");
        })
        .finally(() => {
            registerButton.disabled = false;
            registerButton.textContent = "تسجيل";
        });
}


// دالة مساعدة لإظهار أو إخفاء العناصر
function toggleVisibility(element, action) {
    if (element) {
        if (action === "show") {
            element.classList.remove("hidden");
        } else if (action === "hide") {
            element.classList.add("hidden");
        }
    }
}

// دالة عرض رسالة الترحيب
function showWelcomeMessage() {
    const username = localStorage.getItem("username");
    const welcomeMessageElement = document.getElementById("welcome-message");

    if (username && welcomeMessageElement) {
        welcomeMessageElement.textContent = `مرحبًا بك يا زعيــم ${username}`;
    }
}

// دالة للتحقق مما إذا كان البريد الإلكتروني مسجلًا مسبقًا
function isEmailRegistered(email) {
    const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails")) || [];
    return registeredEmails.includes(email);
}

// دالة لتوليد UUID فريد لكل مستخدم
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}


const menuToggle = document.getElementById("menu-toggle");
const menuContent = document.getElementById("menu-content");

// التحكم في فتح وغلق القائمة
menuToggle.addEventListener("click", () => {
  menuContent.classList.toggle("active");
});

// إغلاق القائمة عند الضغط على أي زر داخلها
const menuButtons = menuContent.querySelectorAll("button");
menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    menuContent.classList.remove("active");
  });
});

// دوال العرض
function showCompetitionSearch() {
  alert('عرض قسم المسابقة!'); // مثال فقط
}

function showTimeline() {
  alert('عرض قسم التتويجات!'); // مثال فقط
}

function showYouTubeVideos() {
  alert('عرض مقاطع التتويج!'); // مثال فقط
}

function showHilalMap() {
  alert('عرض منصات الهلال!'); // مثال فقط
}

function showManagers() {
  alert('عرض رؤساء الهلال!'); // مثال فقط
}

function showLastGames() {
  alert('عرض سجلات الدوري!'); // مثال فقط
}

function showMatches() {
  alert('عرض مباريات الهلال!'); // مثال فقط
}




// رابط Google Apps Script للإرسال
const googleSheetURL = "https://script.google.com/macros/s/AKfycbxyqMTKxHwD370QTyACURrHE27L_KyUXH7Z3EmhcHJoNYM-g0oww6vgSyxa38kkWhhv/exec";


// بيانات البطولات حسب المسابقة
const championshipsByCompetition = {
    "كأس الملك": [1962, 1965, 1980, 1982, 1984, 1989, 2015, 2017, 2020, 2023, 2024],
    "الدوري الممتاز": [1977, 1979, 1985, 1986, 1988, 1990, 1996, 1998, 2000, 2005, 2008, 2010, 2011, 2017, 2018, 2020, 2021, 2022, 2024],
    "كأس ولي العهد": [1965, 1995, 2000, 2003, 2005, 2006, 2008, 2009, 2010, 2011, 2012, 2013, 2016],
    "دوري أبطال آسيا": [ 1991, 1996, 1997, 2000 ,2000, 2002, 2019, 2021],
    "كأس الاتحاد السعودي": [ 1986, 1989, 1993, 1995, 1999, 2005],
    "كأس السوبر السعودي": [2015, 2018, 2021, 2023, 2024],
    "كأس المؤسس": [2000],
    "بطولة الأندية العربية أبطال الدوري": [1994, 1995, 2000, 2001],
    "كأس الأندية الخليجية": [1986, 1998],
    "كأس السوبر السعودي المصري": [2001],
};
  
// ====== إدارة زر العودة ======
function showMainMenuButton() {
    const mainMenuButton = document.getElementById("main-menu-btn");
    if (mainMenuButton) {
        mainMenuButton.classList.remove("hidden");
    }
}


function hideMainMenuButton() {
    const mainMenuButton = document.getElementById("main-menu-btn");
    if (mainMenuButton) {
        mainMenuButton.classList.add("hidden");
    }
}

// ====== دالة لإخفاء جميع الأقسام ======
function hideAllSections() {// ====== دالة لإخفاء جميع الأقسام ======
    document.getElementById("competition-search").classList.add("hidden");
    document.querySelector(".timeline-container").classList.add("hidden");
    document.getElementById("youtube-videos").classList.add("hidden");
    document.getElementById("championship-details").classList.add("hidden");
    document.getElementById("championship-info").classList.add("hidden");
    document.getElementById("managers-section").classList.add("hidden");
    document.getElementById("hilal-map-section").classList.add("hidden");
   document.getElementById("fifa-world-cup-section").classList.add("hidden"); // إضافة قسم كأس العالم
    document.getElementById("today-event-section").classList.add("hidden");
    document.getElementById("youtube-videos").innerHTML = ""; 
  
  
    // إخفاء جدول المواجهات وأزرار التصفية
    document.getElementById("team-stats-section").classList.add("hidden");
    document.getElementById("team-stats-table").classList.add("hidden");
    document.getElementById("team-matches-stats").classList.add("hidden");
    document.getElementById("team-stats").innerHTML = ""; // تنظيف الإحصائيات

   /// إخفاء قسم "حسميات الدوري"
    document.getElementById("year-stats-section").classList.add("hidden");
    document.getElementById("year-stats-table").classList.add("hidden");
    document.getElementById("year-matches-stats").classList.add("hidden");

    // تنظيف محتويات الجدول والإحصائيات
    document.getElementById("year-stats-tbody").innerHTML = ""; // تنظيف محتوى الجدول
    document.getElementById("year-stats").innerHTML = "";       // تنظيف الإحصائيات
    document.getElementById("year-stats-select").value = "";    // إعادة تعيين قيمة القائمة المنسدلة

    document.getElementById("upcoming-matches-section").classList.add("hidden");
    

    hidePagination(); // إخفاء أزرار التنقل بين الصفحات
    hideMainMenuButton(); // إخفاء زر العودة

    // إعادة ضبط الخريطة عند مغادرة القسم
   if (map) {
        resetMap();
    }

  


    

  
  
  
  
  
  
    // إعادة لون زر البحث إلى الأزرق الافتراضي عند مغادرة الخريطة
    const searchButton = document.getElementById("search-btn");
    searchButton.classList.remove("highlighted");

    // إزالة بطاقة الإحصائيات إذا كانت موجودة
    const statsPopup = document.querySelector(".stats-popup");
    if (statsPopup) {
        statsPopup.remove();
    }
}



  
  
   


// ====== دالة العودة إلى الشاشة الرئيسية ======

function goToMainMenu() {
    hideAllSections(); // إخفاء جميع الأقسام

    const welcomeMessage = document.getElementById("welcome-message");
    if (welcomeMessage) {
        welcomeMessage.classList.remove("hidden"); // إظهار رسالة الترحيب
    }

    hideMainMenuButton(); // إخفاء زر العودة
}






// ====== عرض الأقسام المختلفة ======

// عرض قسم البحث حسب المسابقة
function showCompetitionSearch() {
    hideAllSections();
    document.getElementById("competition-select").selectedIndex = 0; // إعادة تعيين القائمة
    document.getElementById("competition-results").innerHTML = ""; // تنظيف النتائج
    document.getElementById("competition-search").classList.remove("hidden");
    showMainMenuButton(); // إظهار زر العودة
}

// عرض قسم التتويجات
function showTimeline() {
    hideAllSections();
    document.querySelector(".timeline-container").classList.remove("hidden");
    document.getElementById("year-select").selectedIndex = 0; // إعادة تعيين القائمة
    document.getElementById("championship-details").innerHTML = ""; // تنظيف تفاصيل البطولات
    document.getElementById("championship-info").classList.add("hidden");
    showMainMenuButton(); // إظهار زر العودة
}


// عرض قسم مقاطع يوتيوب
function showYouTubeVideos() {
    hideAllSections();
    document.getElementById("youtube-videos").classList.remove("hidden");
    fetchYouTubeVideos(); // جلب بيانات الفيديوهات
    showMainMenuButton(); // إظهار زر العودة
}

// عرض قسم المدراء
function showManagers() {
    hideAllSections();
    fetchManagersData((data) => {
        managers = data;
        currentManagerIndex = 0; // إعادة تعيين المؤشر
        displayManager(currentManagerIndex); // عرض أول مدير
        document.getElementById("managers-section").classList.remove("hidden");
        showMainMenuButton(); // إظهار زر العودة
    });
}



// دالة لعرض قسم الخريطة
function showHilalMap() {
    hideAllSections(); // إخفاء الأقسام الأخرى
    document.getElementById("hilal-map-section").classList.remove("hidden"); // عرض قسم الخريطة
    showMainMenuButton(); // إظهار زر العودة

    if (!map) {
        initializeMap(); // تهيئة الخريطة إذا لم يتم تهيئتها مسبقًا
    } else {
        resetMap(); // إعادة الخريطة للوضع الافتراضي
    }
}






// دالة لعرض قسم كأس العالم
function showFifaWorldCup() {
    hideAllSections(); // إخفاء جميع الأقسام الأخرى أولاً
    const fifaSection = document.getElementById("fifa-world-cup-section");
    fifaSection.classList.remove("hidden"); // إظهار قسم كأس العالم
    
    fetch(fifaWorldCupUrl)
        .then(response => {
            if (!response.ok) throw new Error("Network response was not ok");
            return response.text();
        })
        .then(data => {
            const parsedData = Papa.parse(data, { header: true }).data; // تحويل CSV إلى كائن
            console.log("Parsed Data:", parsedData); // تأكيد البيانات
            renderFifaWorldCup(parsedData);
        })
        .catch(error => console.error("Error fetching World Cup data:", error));

    showMainMenuButton(); // إظهار زر العودة
}


// إعادة العرض إلى الشاشة الرئيسية
function resetView() {
    hideAllSections();
    document.getElementById("main-buttons").classList.remove("hidden");
}

// العودة إلى قائمة البطولات داخل التتويجات 
function backToList() {
    document.getElementById("championship-info").classList.add("hidden");
    document.getElementById("championship-details").classList.remove("hidden");
}














































































  
  
   














function showChampionshipDetails(year) {
    if (year) {
        showChampionshipsByYear(year);
    } else {
        document.getElementById("championship-details").innerHTML = "<p>يرجى اختيار سنة لعرض البطولات.</p>";
    }
}
// تعبئة القائمة المنسدله باسماء المسابقات

const competitionSelect = document.getElementById("competition-select");
Object.keys(championshipsByCompetition).forEach(competition => {
    const option = document.createElement("option");
    option.value = competition;
    option.textContent = competition;
    competitionSelect.appendChild(option);
});







function searchByCompetition() {
    const competition = document.getElementById("competition-select").value;
    const results = document.getElementById("competition-results");
    results.innerHTML = ""; // تنظيف النتائج السابقة

    if (competition && championshipsByCompetition[competition]) {
        // إضافة جميع البطولات حسب السنة
        championshipsByCompetition[competition].forEach(year => {
            const p = document.createElement("p");
            p.innerHTML = `<i class="fas fa-trophy"></i> عام ${year}`; // إضافة أيقونة الكأس
            results.appendChild(p);
        });

        // **إضافة هذه الأسطر في هذا المكان**
        // إضافة كلمة المجموعة وعدد البطولات في النهاية
        const groupInfo = document.createElement("p");
        groupInfo.style.fontWeight = "bold";
        groupInfo.style.marginTop = "15px";
        groupInfo.style.color = "#FFFFFF"; // لون النص
        groupInfo.style.backgroundColor = "#005fbf"; // لون الخلفية
        groupInfo.style.padding = "10px"; // حشوة داخلية
        groupInfo.style.borderRadius = "8px"; // زوايا دائرية
        groupInfo.innerHTML = `حقق الهلال  : ${championshipsByCompetition[competition].length} بطــولة`;
        results.appendChild(groupInfo);

    } else {
        results.innerHTML = "<p>لم يتم العثور على بطولات لهذه المسابقة.</p>";
    }
}





function resetSearch() {
    document.getElementById("competition-search").classList.add("hidden");
    document.getElementById("year-input").value = "";
    document.getElementById("year-results").innerHTML = "";
    document.getElementById("competition-results").innerHTML = "";
    document.querySelector(".timeline-container").classList.add("hidden");

    document.getElementById("championship-details").classList.add("hidden");
    document.getElementById("championship-info").classList.add("hidden");
}

// المعرفات المطلوبة لـ Google Sheets
const ConsentSheetID = "1ksZhTi3JW4QP5MOk8fcWnUCeXbmTqpXW4BLxLaHtmc8";
const championshipsSheet = "Sheet2";
const youtubeVideosSheet = "YouTubeVideos";
const ConsentChampionsLeagueSheet2 = "champcount";
const pastGamesSheet = "PastGames";
const managersSheet = "manger"; 
const mapsSheet = "MAPS";  
const fifaWorldCupSheet = "WorldCupParticipation";
const todayEventSheet = "today-event";
const upcomingMatchesSheet = "UpcomingMatches"; // إضافة هذا السطر


// URLs للشيتات
const championshipsUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(championshipsSheet)}`;
const youtubeVideosUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(youtubeVideosSheet)}`;
const presidentsUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(ConsentChampionsLeagueSheet2)}`;
const pastGamesUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(pastGamesSheet)}`;
const managersUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(managersSheet)}`;
const mapsUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(mapsSheet)}`;
const fifaWorldCupUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(fifaWorldCupSheet)}`;
const todayEventUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(todayEventSheet)}`;
const upcomingMatchesUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(upcomingMatchesSheet)}`; // إضافة هذا السطر



//===================================================================================

function showSuggestions() {
    hideAllSections(); // إخفاء جميع الأقسام الأخرى
    const feedbackSection = document.getElementById("feedback-section");
    if (feedbackSection) {
        feedbackSection.classList.remove("hidden"); // إظهار قسم الملاحظات
    } else {
        console.error("Feedback section not found in the DOM.");
    }
}




// دالة لإرسال الملاحظات
function sendFeedback() {
    const subject = document.getElementById("feedbackSubject").value.trim();
    const message = document.getElementById("feedbackMessage").value.trim();
    const feedbackButton = document.querySelector('.feedback-btn');

    // استرجاع بيانات المستخدم من LocalStorage
    const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails")) || [];
    const email = registeredEmails[0] || "No Email";
    const name = localStorage.getItem("username") || "No Name";
    const uuid = localStorage.getItem("userUUID") || "No UUID";

    // تحقق من المدخلات
    if (!subject || !message) {
        alert("يرجى ملء جميع الحقول.");
        return;
    }

    // تعطيل زر الإرسال أثناء المعالجة
    feedbackButton.disabled = true;
    feedbackButton.textContent = "جاري الإرسال...";

    // إرسال البيانات
    fetch("https://script.google.com/macros/s/AKfycbwnR6b_Wo3bLK65vBq3wuOh6uWY1_l41n3z-Mxt-tqN4-yCSHuJy2VsGdVGwg-niw5D/exec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, uuid, subject, message }),
        mode: "no-cors",
    })
        .then(() => {
            alert("تم إرسال مقترحك بنجاح!");
            resetView(); // إخفاء النموذج بعد الإرسال
            document.getElementById("feedbackSubject").value = '';
            document.getElementById("feedbackMessage").value = '';
        })
        .catch((error) => {
            console.error("Error sending feedback:", error);
            alert("حدث خطأ أثناء إرسال المقترح.");
        })
        .finally(() => {
            feedbackButton.disabled = false;
            feedbackButton.textContent = "إرسال الملاحظات";
        });
}

// دالة لإغلاق نموذج الملاحظات
function resetView() {
    const feedbackSection = document.getElementById("feedback-section");
    if (feedbackSection) {
        feedbackSection.classList.add("hidden");
    }
}











//======================================================================================================

// جلب البيانات وعرض البطولات من Google Sheets
function fetchChampionshipData() {
    Papa.parse(championshipsUrl, {
        download: true,
        header: true,
        complete: function(results) {
            populateYearSelect(results.data);
              
        },
        error: function(error) {
            console.error("Error fetching championships data: ", error);
        }
    });
}

// ملء قائمة السنوات بالبطولات
function populateYearSelect(data) {
    const yearSelect = document.getElementById("year-select");
    yearSelect.innerHTML = '<option value="">اختـــر سنــة التتويــج</option>';
    const uniqueYears = [...new Set(data.map(item => item["Year"]))];

    uniqueYears.forEach(year => {
        const option = document.createElement("option");
        option.value = year;
        option.textContent = year;
        yearSelect.appendChild(option);
    });

    yearSelect.onchange = () => {
        showChampionshipsByYear(data, yearSelect.value);
    };
}

// عرض البطولات حسب السنة
function showChampionshipsByYear(data, year) {
    const detailsContainer = document.getElementById("championship-details");
    const infoContainer = document.getElementById("championship-info");
    detailsContainer.classList.remove("hidden");
    infoContainer.classList.add("hidden");

    const championships = data.filter(item => item["Year"] == year); // استخدم "Year" للتصفية
    if (championships.length > 0) {
        detailsContainer.innerHTML = `
            <h3>اختر البطولة لمشاهدة تفاصيلها</h3>
            ${championships.map((championship, index) => `
                <p><a href="#" onclick="showChampionshipInfo(${JSON.stringify(championship).replace(/"/g, '&quot;')})">${championship["Name"]}</a></p>
            `).join("")}
        `;
    } else {
        detailsContainer.innerHTML = "<p>لا توجد بطولات لهذا العام</p>";
    }
}

// عرض تفاصيل البطولة
// إخفاء تفاصيل البطولة عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    const infoContainer = document.getElementById("championship-info");
    infoContainer.classList.add("hidden");
});

//عرض تفاصيل البطولة
function showChampionshipInfo(championship) {
    const infoContainer = document.getElementById("championship-info");
    const detailsContainer = document.getElementById("championship-details");

    // إخفاء قائمة البطولات
    detailsContainer.classList.add("hidden");

    // تحديث محتوى البطاقة
    infoContainer.innerHTML = `
    
        <h3 class="info-title">${championship["Name"]}</h3>
        <img src="${championship["Image URL"]}" alt="${championship["Name"]}" class="championship-image">
        <div class="info-section">
            <i class="fa fa-calendar-alt"></i>
            <span>الموسم: ${championship["Date"] || "غير متوفر"}</span>
        </div>
        <div class="info-section">
            <i class="fa fa-trophy"></i>
            <span>المباراة النهائية: ${championship["Final Match"]}</span>
        </div>
        <div class="info-section">
            <i class="fa fa-futbol"></i>
            <span>النتيجة: ${championship["Score"]}</span>
        </div>
        <div class="info-section">
            <i class="fa fa-user"></i>
            <span>الكابتن: ${championship["captn"] || "غير متوفر"}</span>
        </div>
        <div class="info-section">
            <i class="fa fa-hashtag"></i>
            <span>رقم البطولة: ${championship["Championship Rank"] || "غير متوفر"}</span>
        </div>
        <button class="return-btn" onclick="backToList()">العودة إلى قائمة البطولات</button>
        
    `;

  // الكود لضبط الشعار فقط
    const logo = document.getElementById("championship-logo");
    if (logo) {
        logo.style.border = "none"; // إزالة أي حدود
        logo.style.margin = "0"; // إزالة أي مسافات غير مرغوب فيها
        logo.style.boxShadow = "none"; // إزالة أي ظل
        logo.style.height = "auto"; // 
      
      
  logo.style.width = "100px"; // تكبير العرض
    logo.style.marginBottom = "2px"; // تقليل المسافة بين الشعار والعنوان
}   

    infoContainer.classList.remove("hidden");
 }
  

// زر العودة إلى قائمة البطولات
function backToList() {
    const infoContainer = document.getElementById("championship-info");
    const detailsContainer = document.getElementById("championship-details");

    // إخفاء البطاقة
    infoContainer.classList.add("hidden");

    // عرض قائمة البطولات
    detailsContainer.classList.remove("hidden");
}




// دالة جديدة لجلب بيانات البطولات حسب السنة من Google Sheets
function fetchDataByYear(year, callback) {
    Papa.parse(championshipsUrl, {
        download: true,
        header: true,
        complete: function(results) {
            const data = results.data.filter(item => item["Year"] == year);
            callback(data);
        },
        error: function(error) {
            console.error("Error fetching championships data by year: ", error);
        }
    });
}

// دالة البحث حسب العام باستخدام الدالة الجديدة لجلب البيانات
function searchByYear() {
    const yearInput = document.getElementById("year-input").value;
    const resultsContainer = document.getElementById("year-results");

    resultsContainer.innerHTML = ""; // تنظيف النتائج السابقة

    if (!yearInput) {
        resultsContainer.innerHTML = "<p>يرجى إدخال سنة للبحث.</p>";
        return;
    }

    fetchDataByYear(yearInput, (data) => {
        if (data.length > 0) {
            resultsContainer.innerHTML = data.map(championship => `
                <p><strong>${championship["Name"]}</strong></p>
            `).join("");
        } else {
            resultsContainer.innerHTML = "<p>لا توجد بطولات لهذا العام.</p>";
        }
    });
}






//********************************************************************************************************************
// الفيديو اليوتيوب 
//********************************************************************************************************************

// جلب وعرض مقاطع اليوتيوب من Google Sheets
function fetchYouTubeVideos() {
    Papa.parse(youtubeVideosUrl, {
        download: true,
        header: true,
        complete: function(results) {
            displayYouTubeVideos(results.data);
        },
        error: function(error) {
            console.error("Error fetching YouTube videos data: ", error);
        }
    });
}

// عرض مقاطع اليوتيوب في شكل شبكة
const videosPerPage = 4; // عدد الفيديوهات لكل صفحة
let currentPage = 1;
let videos = [];

// دالة عرض الفيديوهات في الصفحة الحالية
function displayYouTubeVideos(videosData) {
    videos = videosData;
    displayVideos();
}

// دالة لعرض الفيديوهات بناءً على الصفحة الحالية
function displayVideos() {
    const container = document.getElementById("youtube-videos");
    container.innerHTML = ""; // إعادة تعيين الحاوية

    // حساب بداية ونهاية الفيديوهات للصفحة الحالية
    const start = (currentPage - 1) * videosPerPage;
    const end = start + videosPerPage;
    const currentVideos = videos.slice(start, end); // الفيديوهات في الصفحة الحالية

    // عرض الفيديوهات مع العناوين
    currentVideos.forEach(video => {
        // إنشاء iframe للفيديو
        const videoElement = document.createElement("iframe");
        videoElement.src = `https://www.youtube.com/embed/${video.videoId}`;
        videoElement.width = "100%";
        videoElement.height = "315";
        videoElement.frameBorder = "0";
        videoElement.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
        videoElement.allowFullscreen = true;

        // إنشاء عنصر العنوان
        const videoTitle = document.createElement("p");
        videoTitle.classList.add("video-title");
        videoTitle.textContent = video.title || "عنوان غير متوفر"; // جلب العنوان من العمود title

        // إنشاء كارد الفيديو
        const videoCard = document.createElement("div");
        videoCard.classList.add("video-card");
        videoCard.appendChild(videoElement); // إضافة الفيديو
        videoCard.appendChild(videoTitle);  // إضافة العنوان

        // إضافة الكارد إلى الحاوية
        container.appendChild(videoCard);
    });

  

    displayPagination(); // عرض أزرار التنقل
}

// دالة عرض أزرار التنقل بين الصفحات
function displayPagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = "";

    const totalPages = Math.ceil(videos.length / videosPerPage);

    // زر "السابق" للصفحات
    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.textContent = "السابق";
        prevButton.className = "pagination-button";
        prevButton.onclick = () => {
            currentPage--;
            displayVideos();
        };
        paginationContainer.appendChild(prevButton);
    }

    // عرض رقم الصفحة الحالي
    const pageNumber = document.createElement("span");
    pageNumber.textContent = `الصفحة ${currentPage} من ${totalPages}`;
    pageNumber.className = "page-number";
    paginationContainer.appendChild(pageNumber);

    // زر "التالي" للصفحات
    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.textContent = "التالي";
        nextButton.className = "pagination-button";
        nextButton.onclick = () => {
            currentPage++;
            displayVideos();
        };
        paginationContainer.appendChild(nextButton);
    }
}

// دالة لإخفاء أزرار التنقل بين الصفحات
function hidePagination() {
    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = ""; // إخفاء أزرار التنقل
}

  // **************************************************************************************************************** 


function showAboutCard() {
    const aboutCard = document.getElementById("about-card");
    if (aboutCard) {
        aboutCard.classList.remove("hidden"); // إظهار البطاقة
    }
}

function closeAboutCard() {
    const aboutCard = document.getElementById("about-card");
    if (aboutCard) {
        aboutCard.classList.add("hidden"); // إخفاء البطاقة
    }
}


//**********************************************************************************************************

//**********************************************************************************************************
document.addEventListener("DOMContentLoaded", async () => {
  const marqueeContent = document.querySelector(".marquee-content");

  const matchesUrl = "https://docs.google.com/spreadsheets/d/1ksZhTi3JW4QP5MOk8fcWnUCeXbmTqpXW4BLxLaHtmc8/gviz/tq?tqx=out:csv&sheet=PastGames";
  const todayEventUrl = "https://docs.google.com/spreadsheets/d/1ksZhTi3JW4QP5MOk8fcWnUCeXbmTqpXW4BLxLaHtmc8/gviz/tq?tqx=out:csv&sheet=today-event";

  // دالة لجلب آخر مباراة
  async function fetchLastMatch() {
    try {
      const response = await fetch(matchesUrl);
      const csvData = await response.text();
      const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;

      const sortedData = parsedData.sort((a, b) => parseInt(b.Index) - parseInt(a.Index));
      const lastMatch = sortedData[0];
      return lastMatch
        ? `⚽ <span style="color:#f39c12; font-weight:bold;">آخر مباراة:</span> 
            <span>${lastMatch.Team1}</span> 
            <span style="color:red; font-weight:bold;">X</span> 
            <span>${lastMatch.Team2}</span> 
            انتهت <span>${lastMatch.Score1}-${lastMatch.Score2}</span>`
        : "⚽ لم يتم العثور على مباريات.";
    } catch (error) {
      console.error("Error fetching matches:", error);
      return "⚽ حدث خطأ أثناء جلب بيانات المباريات.";
    }
  }

  // دالة لجلب البطولات الخاصة باليوم الحالي أو الشهر الحالي
  async function fetchTodayOrMonthEvents() {
    try {
      const response = await fetch(todayEventUrl);
      const csvData = await response.text();
      const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;

      const today = new Date();
      const formattedToday = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
      const currentMonth = today.getMonth() + 1;

      // فلترة بطولات اليوم
      const eventsToday = parsedData.filter(event => event.date === formattedToday);

      if (eventsToday.length > 0) {
        const eventNames = eventsToday.map(event => `${event.title}`).join(" 🏆 ");
        return `🏆 <span style="color:#f39c12; font-weight:bold;">بطولات اليوم:</span> ${eventNames}`;
      } else {
        // فلترة بطولات الشهر
        const eventsThisMonth = parsedData.filter(event => {
          const eventMonth = parseInt(event.date.split("/")[1]);
          return eventMonth === currentMonth;
        });

        if (eventsThisMonth.length > 0) {
          const eventNames = eventsThisMonth.map(event => `${event.title}`).join(" 🏆 ");
          return `📅 <span style="color:#f39c12; font-weight:bold;">بطولات هذا الشهر:</span> ${eventNames}`;
        } else {
          return "📅 لا توجد بطولات في هذا اليوم أو الشهر.";
        }
      }
    } catch (error) {
      console.error("Error fetching today's or month's events:", error);
      return "📅 حدث خطأ أثناء جلب البطولات.";
    }
  }

  // تهيئة الشريط الزمني
  async function initializeMarquee() {
    try {
      const lastMatchText = await fetchLastMatch(); // جلب آخر مباراة
      const todayOrMonthEventsText = await fetchTodayOrMonthEvents(); // جلب بطولات اليوم أو الشهر

      // إضافة النصوص إلى الشريط الزمني
      marqueeContent.innerHTML = `
        <span><a href="https://t.me/AlHilalFansChannel" target="_blank" class="telegram-link">📲 اشتركوا في قناة التليجرام للحصول على أحدث الأخبار</a></span>
        <span style="margin: 0 20px;">${todayOrMonthEventsText}</span>
        <span style="margin: 0 20px;">${lastMatchText}</span>
      `;
    } catch (error) {
      console.error("Error initializing marquee:", error);
      marqueeContent.innerHTML = "<span>حدث خطأ أثناء تهيئة الشريط الزمني.</span>";
    }
  }

  initializeMarquee();
});

//**********************************************************************************************


// وظيفة إرسال رسالة التليجرام
function sendTelegramMessage(message) {
    const botToken = "7182497148:AAFp5bBYHwSju9Dp_46eUhtKlMnnUMdvGes"; // التوكن الخاص بالبوت
    const chatId = "@AlHilalFansChannel"; // اسم القناة
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

    const data = {
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((result) => {
            if (result.ok) {
                alert("تم إرسال الرسالة بنجاح!");
                console.log("Message sent successfully:", result);
            } else {
                alert("فشل في إرسال الرسالة.");
                console.error("Failed to send message:", result);
            }
        })
        .catch((error) => {
            alert("حدث خطأ أثناء الإرسال.");
            console.error("Error sending message:", error);
        });
}

// إضافة حدث النقر إلى زر التليجرام
document.getElementById("telegram-send-btn").addEventListener("click", () => {
    sendTelegramMessage("🎉 ألف مبروك فوز الهلال! 🏆 المباراة القادمة يوم الأحد.");
});


// كود يرسل رسالة لتلقرام اذا حدثت نتيجة مباراة الدوري 

document.getElementById("send-last-match").addEventListener("click", () => {
    fetch("https://script.google.com/macros/s/AKfycbxbyPhCg91vapZY-bma0an47bWhb2aDeSlbgu67VX5xcPToYVJjNmSOH-DDYzKY3CC_/exec")
  
        .then(response => response.json())
        .then(result => {
            if (result.status === "Success") {
                alert("تم إرسال الرسالة بنجاح!");
            } else {
                alert("فشل في إرسال الرسالة. حاول مرة أخرى.");
            }
        })
        .catch(error => {
            console.error("Error sending message:", error);
            alert("حدث خطأ أثناء الإرسال.");
        });
});
// هذا داله توديك لرابط التلقرام مباشره للاشتراك 

function subscribeChannel() {
    const telegramLink = "https://t.me/AlHilalFansChannel"; // رابط القناة
    window.open(telegramLink, "_blank"); // فتح الرابط في نافذة جديدة
}



// مصفوفة لتخزين بيانات المدراء
let managers = [];
let currentManagerIndex = 0;



// دالة لعرض بطاقة المدير بناءً على الفهرس
function displayManager(index) {
    const manager = managers[index];
    const container = document.getElementById("managers-container");

    // تحويل الفترات الزمنية إلى أسطر باستخدام <br>
    const formattedYears = manager.years
        .split(",")
        .map(year => `${year.trim()}`)
        .join("<br>");

    // تحويل البطولات إلى قائمة باستخدام <br>
    const formattedWins = manager.win
        ? manager.win
              .split(",")
              .map(win => `${win.trim()}`)
              .join("<br>")
        : "لا توجد بطولات";

    // حساب إجمالي السنوات لهذا المدير
    const totalYears = manager.years
        .split(",")
        .reduce((sum, range) => {
            const [start, end] = range.split("-").map(Number);
            return sum + (end - start + 1);
        }, 0);

    container.innerHTML = `
        <div class="manager-card">
            <div class="header">
                <span class="manager-number">#${manager.no}</span>
                <img src="${manager.ImageURL}" alt="${manager.mangertName}">
                <h3>${manager.mangertName}</h3>
            </div>
            <div class="body">
                <!-- الفقرة الزمنية -->
                <p class="manager-years">
                    <strong>:الفترة الزمنية</strong><br>
                    ${formattedYears}
                </p>
                <!-- البطولات -->
                <p class="manager-wins">
                    <strong>:البطولات</strong><br>
                    ${formattedWins}
                </p>
                <!-- الإحصائيات -->
                <p class="manager-stats">
                    <strong>:الإحصائيات</strong><br>
                    إجمالي السنوات: ${totalYears} سنة<br>
                    إجمالي البطولات: ${manager.milestoneCount || 0} بطولة
                </p>
                <!-- الأزرار -->
                <div class="buttons">
                 
                    <button onclick="nextManager()">التالي</button>
                     <button onclick="prevManager()">السابق</button>
                </div>
            </div>
        </div>
    `;
}
// دالة للانتقال إلى المدير السابق
function prevManager() {
    currentManagerIndex = (currentManagerIndex - 1 + managers.length) % managers.length;
    displayManager(currentManagerIndex);
}

// دالة للانتقال إلى المدير التالي
function nextManager() {
    currentManagerIndex = (currentManagerIndex + 1) % managers.length;
    displayManager(currentManagerIndex);
}
// دالة لجلب بيانات المدراء من Google Sheets
function fetchManagersData(callback) {
    Papa.parse(managersUrl, {
        download: true,
        header: true,
        complete: function (results) {
            callback(results.data);
        },
        error: function (error) {
            console.error("Error fetching managers data: ", error);
        },
    });
}



let map;
let markers = [];

// دالة تهيئة الخريطة
function initializeMap() {
    map = L.map('map').setView([24.7136, 46.6753], 5); // الرياض كموقع افتراضي

    // إضافة طبقة البلاط
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // جلب البيانات من جوجل شيت
    Papa.parse(mapsUrl, {
        download: true,
        header: true,
        complete: function (results) {
            addMarkersToMap(results.data); // إضافة العلامات إلى الخريطة
            populateDropdown(results.data); // تعبئة القائمة المنسدلة
        },
        error: function (error) {
            console.error("Error fetching data from Google Sheets:", error);
        }
    });
}

// دالة لإضافة العلامات إلى الخريطة
function addMarkersToMap(data) {
    markers = []; // تفريغ العلامات القديمة
    data.forEach(item => {
        const coordinates = item.coordinates.split(',');
        const lat = parseFloat(coordinates[0]);
        const lng = parseFloat(coordinates[1]);
        const name = item.Name;
        const stadium = item.Stadium;
        const year = item.Year;

        if (!isNaN(lat) && !isNaN(lng)) {
            const marker = L.marker([lat, lng], { icon: createGoldenIcon() })
                .addTo(map)
                .bindPopup(`<b>${name}</b><br>${stadium}<br>${year}`); // عرض التفاصيل في النافذة المنبثقة فقط
            markers.push({ marker, name, stadium, year });
        }
    });

    map.invalidateSize(); // تحديث حجم الخريطة
}

// دالة لإنشاء أيقونة الكأس
function createGoldenIcon() {
    return L.icon({
        iconUrl: 'https://github.com/sweettaste95/hilal-images/blob/main/png-transparent-copa-del-rey-football-cup-trophy-football-color-gold-sports11.png?raw=true',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });
}

// دالة للبحث عن المواقع
function searchMap() {
    const query = document.getElementById('search-box').value.toLowerCase();
    const foundMarker = markers.find(item =>
        item.name.toLowerCase().includes(query) ||
        item.stadium.toLowerCase().includes(query) ||
        item.year.toLowerCase().includes(query)
    );

    if (foundMarker) {
        map.setView(foundMarker.marker.getLatLng(), 10); // تحريك الخريطة للموقع
        foundMarker.marker.openPopup(); // عرض النص المنبثق
    } else {
        alert('لم يتم العثور على نتائج مطابقة.');
    }
}

// دالة لتعبئة القائمة المنسدلة
function populateDropdown(data) {
    const dropdown = document.getElementById('search-dropdown');
    dropdown.innerHTML = '<option value="">اختر من القائمة</option>';

    data.forEach(item => {
        dropdown.innerHTML += `<option value="${item.Name}">${item.Name} - ${item.Stadium} - ${item.Year}</option>`;
    });

    dropdown.addEventListener('change', () => {
        const selectedValue = dropdown.value;
        if (selectedValue) {
            const [name] = selectedValue.split(' - ');
            document.getElementById('search-box').value = name;
        }
    });
}

// دالة إعادة ضبط الخريطة
function resetMap() {
    // إعادة الخريطة للموقع الافتراضي (الرياض)
    map.setView([24.7136, 46.6753], 5);

    // إعادة الحقول إلى الوضع الافتراضي
    const searchBox = document.getElementById('search-box');
    const dropdown = document.getElementById('search-dropdown');
    const searchButton = document.getElementById('search-btn');

    searchBox.value = ''; // تصفية التكست بوكس
    dropdown.selectedIndex = 0; // تصفية الكومبو بوكس

    // إعادة لون زر البحث إلى الأزرق الافتراضي
    searchButton.classList.remove("highlighted");
}


// حساب عدد البطولات لكل ملعب وعرض الإحصائيات
function showCityStats() {
    const stats = {};

    // حساب عدد البطولات لكل ملعب
    markers.forEach(item => {
        const stadium = item.stadium;
        stats[stadium] = (stats[stadium] || 0) + 1;
    });

    // حساب إجمالي البطولات
    const totalChampionships = Object.values(stats).reduce((sum, count) => sum + count, 0);

    // إنشاء محتوى البطاقة
    let statsHtml = "<h3>إحصائيات البطولات حسب الملعب</h3><div class='stats-list'>";
    for (const stadium in stats) {
        statsHtml += `
            <div class="stats-item">
                <span class="stadium-name">${stadium}</span>
                <span class="stadium-count">
                    <span class="count">${stats[stadium]} بطولة</span>
                    <img src="https://github.com/sweettaste95/hilal-images/blob/main/png-transparent-copa-del-rey-football-cup-trophy-football-color-gold-sports11.png?raw=true" alt="كأس" class="cup-icon" />
                </span>
            </div>
        `;
    }
    statsHtml += `
        <div class="total-stats">
            إجمالي البطولات: ${totalChampionships} بطولة
            <img src="https://github.com/sweettaste95/hilal-images/blob/main/png-transparent-copa-del-rey-football-cup-trophy-football-color-gold-sports11.png?raw=true" alt="كأس" class="cup-icon" />
        </div>
    `;
    statsHtml += "</div>";

    // إنشاء البطاقة
    const statsContainer = document.createElement("div");
    statsContainer.classList.add("stats-popup");
    statsContainer.innerHTML = statsHtml;

    // زر الإغلاق
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "إغلاق";
    closeBtn.classList.add("close-btn");
    closeBtn.onclick = () => statsContainer.remove();

    statsContainer.appendChild(closeBtn);
    document.getElementById("map").appendChild(statsContainer);
}


// مراقبة تغييرات النص داخل التكست بوكس
document.getElementById('search-box').addEventListener('input', highlightSearchButton);

// مراقبة تغييرات القائمة المنسدلة
document.getElementById('search-dropdown').addEventListener('change', highlightSearchButton);


// تغيير لون زر البحث عند اختيار قيمة من الكومبو بوكس
function highlightSearchButton() {
    const searchBox = document.getElementById('search-box');
    const dropdown = document.getElementById('search-dropdown');
    const searchButton = document.getElementById('search-btn');

    // تحقق من وجود قيمة في الحقول
    if (searchBox.value.trim() !== "" || dropdown.value !== "") {
        searchButton.classList.add("highlighted");
    } else {
        searchButton.classList.remove("highlighted");
    }
}





//**********************************************************************************************



// دالة لعرض بطاقات البطولات
function renderFifaWorldCup(data) {
    const fifaSection = document.getElementById("fifa-world-cup-section");
    fifaSection.innerHTML = `<h2>بطولات كأس العالم</h2>`; // العنوان

    const container = document.createElement("div");
    container.className = "fifa-world-cup-container";

    // تصنيف البيانات حسب السنة
    const tournaments = {};
    data.forEach(row => {
        const year = row["Year"]?.trim();
        if (year) {
            if (!tournaments[year]) tournaments[year] = [];
            tournaments[year].push(row);
        }
    });

    // إنشاء بطاقات السنوات
    for (const year in tournaments) {
        const card = document.createElement("div");
        card.className = "fifa-card";
        card.innerHTML = `
            <h3>كأس العالم ${year}</h3>
            <p>المكان: ${getLocation(year)}</p>
            <button class="fifa-btn" onclick="showDetails('${year}')">عرض التفاصيل</button>
        `;
        container.appendChild(card);
    }

    fifaSection.appendChild(container);
}

// دالة جلب مكان البطولة مع صورة العلم
function getLocation(year) {
    const locations = {
        "2019": { name: "قطر", flag: "https://flagcdn.com/w40/qa.png" },
        "2021": { name: "الإمارات", flag: "https://flagcdn.com/w40/ae.png" },
        "2022": { name: "المغرب", flag: "https://flagcdn.com/w40/ma.png" },
        "2025": { name: "أمريكا", flag: "https://flagcdn.com/w40/us.png" }
    };
    const location = locations[year];
    return location 
        ? `${location.name} <img src="${location.flag}" alt="علم ${location.name}" style="width: 20px; height: 15px;">`
        : "غير معروف";
}

// دالة عرض التفاصيل حسب السنة
function showDetails(year) {
    fetch(fifaWorldCupUrl)
        .then(response => response.text())
        .then(data => {
            const rows = Papa.parse(data, { header: true }).data;
            const matches = rows.filter(match => match["Year"]?.trim() === year); // تصفية البيانات حسب السنة
            console.log("Filtered Matches:", matches);
            renderDetails(matches, year);
        })
        .catch(error => console.error("Error fetching match details: ", error));
}

function renderDetails(matches, year) {
    const fifaSection = document.getElementById("fifa-world-cup-section");
    fifaSection.innerHTML = `<h2>تفاصيل مباريات كأس العالم ${year}</h2>`;

    if (matches.length === 0) {
        fifaSection.innerHTML += `<p>لا توجد بيانات متاحة لمباريات هذا العام.</p>`;
        return;
    }

    const container = document.createElement("div");
    container.className = "fifa-details-container";

    matches.forEach(match => {
        const videoId = match["HighlightsLink"]?.trim(); // تأكد من وجود معرف الفيديو
        const card = document.createElement("div");
        card.className = "fifa-detail-card";
        card.innerHTML = `
            <h3>${match["Stage"]}</h3>
            <p><strong>المنافس:</strong> ${match["Opponent"]}</p>
            <p><strong>النتيجة:</strong> ${match["Result"]}</p>
            <p><strong>المكان:</strong> ${getLocation(match["Year"])}</p>
            <p><strong>الملعب:</strong> ${match["Stadium"] || "غير متوفر"}</p>
            <p><strong>الكابتن:</strong> ${match["Captain"] || "غير متوفر"}</p>
            <p><strong>الهدف:</strong> ${match["KeyMoments"] || "غير متوفر"}</p>
            <p><strong>التاريخ:</strong> ${match["MatchDate"]}</p>
            ${
                videoId
                    ? `<div>
                         <h4>🎥 مشاهدة الملخص:</h4>
                         <iframe 
                             src="https://www.youtube.com/embed/${videoId}" 
                             frameborder="0" 
                             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                             allowfullscreen 
                             style="width: 100%; height: 200px; margin-top: 10px;">
                         </iframe>
                       </div>`
                    : `<p style="color: red;">فيديو الملخص غير متوفر</p>`
            }
        `;
        container.appendChild(card);
    });

    fifaSection.appendChild(container);

    // زر العودة
    const backButton = createBackButton();
    fifaSection.appendChild(backButton);
}

// دالة إنشاء زر العودة
function createBackButton() {
    const button = document.createElement("button");
    button.textContent = "العودة";
    button.className = "fifa-back-btn";
    button.onclick = showFifaWorldCup;
    return button;
}





function showTodayEvent() {
    const todayEventContainer = document.getElementById("today-event-section");
    hideAllSections();
    todayEventContainer.classList.remove("hidden");
    showMainMenuButton();

    fetch(todayEventUrl)
        .then(response => response.text())
        .then(data => {
            const today = new Date();
            const formattedToday = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
            const parsedData = Papa.parse(data, { header: true }).data;

            const eventsToday = parsedData.filter(event => event.date === formattedToday);

            if (eventsToday.length > 0) {
                // البطاقة في المنتصف
                let content = `<h2 class="today-title">🏆 بطولات الهلال في مثل هذا اليوم 🏆</h2>`;
                content += `<div class="today-card-container">`;
                eventsToday.forEach(event => {
                    content += generateEventCard(event, true); // تحديد أنها بطاقة اليوم
                });
                content += `</div>`;
                todayEventContainer.innerHTML = content;
            } else {
                // رسالة عدم وجود بطولة
                todayEventContainer.innerHTML = `
                    <h2 class="today-title">🏆 بطولات الهلال في مثل هذا اليوم 🏆</h2>
                    <p class="no-event-msg">عذراً عزيزي الزعيم، لا توجد بطولات للهلال في هذا اليوم.</p>
                    <button onclick="showEventsThisMonth()" class="month-btn">📅 عرض بطولات الهلال في هذا الشهر</button>
                `;
            }
        })
        .catch(error => {
            console.error("Error fetching today's events:", error);
            todayEventContainer.innerHTML = `<p>حدث خطأ أثناء جلب البيانات.</p>`;
        });
}


// دالة لجلب وعرض بطولات الشهر الحالي
function showEventsThisMonth() {
    const todayEventContainer = document.getElementById("today-event-section");

    fetch(todayEventUrl)
        .then(response => response.text())
        .then(data => {
            const today = new Date();
            const currentMonth = today.getMonth() + 1; // الشهر الحالي
            const parsedData = Papa.parse(data, { header: true }).data;

            // تصفية البطولات حسب الشهر
            const eventsThisMonth = parsedData.filter(event => {
                const eventMonth = parseInt(event.date.split("/")[1]); // استخراج الشهر من التاريخ
                return eventMonth === currentMonth;
            });

            if (eventsThisMonth.length > 0) {
                let content = `<h2 class="today-title">📅 بطولات الهلال في هذا الشهر 📅</h2>`;
                content += `<div class="events-container">`;

                // توليد البطاقات
                eventsThisMonth.forEach(event => {
                    content += generateEventCard(event);
                });

                content += `</div>`;
                todayEventContainer.innerHTML = content;
            } else {
                todayEventContainer.innerHTML = `
                    <h2 class="today-title">📅 بطولات الهلال في هذا الشهر 📅</h2>
                    <p class="no-event-msg">عذراً، لا توجد بطولات للهلال في هذا الشهر.</p>
                `;
            }
        })
        .catch(error => {
            console.error("Error fetching monthly events:", error);
            todayEventContainer.innerHTML = `<p>حدث خطأ أثناء جلب بيانات الشهر.</p>`;
        });
}

// دالة لتوليد البطاقة الخاصة بالبطولة
function generateEventCard(event, isToday = false) {
    // إذا كانت البطاقة تخص اليوم نضيف كلاس خاص "center-card"
    const todayClass = isToday ? 'center-card' : '';
    return `
        <div class="event-card ${todayClass}">
            <!-- رقم البطولة -->
            <div class="rank-badge">#${event['Championship Rank'] || 'N/A'}</div>
            <p class="event-date">🗓️ ${event.date}</p>
            <p class="event-title">${event.title}</p>
            <div class="event-result">
                <span class="team-name">${event.alhilal}</span>
                <span class="vs"> X </span>
                <span class="team-name">${event.opponent}</span>
            </div>
            <p class="event-score">⚽ ${event.result} - ${event.G || '0'}</p>
            <img src="${event['Image URL']}" alt="صورة البطولة" />
            <div class="event-footer">
                وتذكر أن هذه البطولة رقم <span style="color: #d4af37;">${event['Championship Rank'] || 'غير متوفرة'}</span>
            </div>
        </div>
    `;
}

//**********************************************************************************************



// ====== دالة لعرض قسم مواجهات الهلال ======
function showTeamMatches() {
    hideAllSections(); // إخفاء جميع الأقسام
    document.getElementById("team-stats-section").classList.remove("hidden"); // إظهار القسم
    document.getElementById("team-select").value = ""; // إعادة تعيين القائمة المنسدلة
    document.getElementById("team-stats-table").classList.add("hidden"); // إخفاء الجدول
    document.getElementById("team-matches-stats").classList.add("hidden"); // إخفاء الأزرار
    loadTeamNames(); // تحميل أسماء الأندية
    showMainMenuButton(); // إظهار زر العودة
}

// تحميل أسماء الفرق
function loadTeamNames() {
    Papa.parse(pastGamesUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const teams = [...new Set(
                results.data.flatMap(game => [game.Team1, game.Team2]).filter(team => team.trim() !== "")
            )];
            const teamSelect = document.getElementById("team-select");
            teamSelect.innerHTML = '<option value="">-- اختر الفريق --</option>';
            teams.forEach(team => {
                teamSelect.innerHTML += `<option value="${team}">${team}</option>`;
            });
        },
        error: function(error) {
            console.error("Error loading team names:", error);
        }
    });
}

// جلب البيانات عند اختيار فريق
function fetchTeamMatchesData() {
    const selectedTeam = document.getElementById("team-select").value;
    if (!selectedTeam) {
        // إخفاء الجدول والأزرار إذا لم يتم اختيار فريق
        document.getElementById("team-stats-table").classList.add("hidden");
        document.getElementById("team-matches-stats").classList.add("hidden");
        document.getElementById("team-stats").innerHTML = ""; // تنظيف الإحصائيات
        return;
    }

    Papa.parse(pastGamesUrl, {
        download: true,
        header: true,
        complete: function(results) {
            const matches = results.data.filter(game => 
                game.Team2 === selectedTeam || game.Team1 === selectedTeam
            );

            displayTeamMatches(matches); // عرض المواجهات
            updateTeamStats(matches, selectedTeam); // تحديث الإحصائيات

            // إظهار الجدول وأزرار التصفية بعد اختيار الفريق
            document.getElementById("team-stats-table").classList.remove("hidden");
            document.getElementById("team-matches-stats").classList.remove("hidden");
        },
        error: function(error) {
            console.error("Error fetching team matches:", error);
        }
    });
}

// عرض المباريات في الجدول
function displayTeamMatches(matches) {
    const tableBody = document.getElementById("team-stats-tbody");
    tableBody.innerHTML = "";
    matches.forEach(match => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${match.Year}</td>
            <td>${match.Round}</td>
            <td>${match.Team1}</td>
            <td>${match.Team2}</td>
            <td>${match.Score1} - ${match.Score2}</td>
            <td>${match.Winner}</td>
        `;
        tableBody.appendChild(row);
    });
}

// حساب الإحصائيات
function updateTeamStats(matches, team) {
    const statsContainer = document.getElementById("team-stats");

    const totalMatches = matches.length;
    const wins = matches.filter(match => match.Winner === "الهلال").length;
    const losses = matches.filter(match => match.Winner === team).length;
    const draws = matches.filter(match => match.Winner === "التعادل").length;

    statsContainer.innerHTML = `
        <div class="team-stats-container">
            <div class="team-stat-card">
                <i class="fa fa-futbol"></i><h3>المباريات</h3><p>${totalMatches}</p>
            </div>
            <div class="team-stat-card">
                <i class="fa fa-trophy"></i><h3>الانتصارات</h3><p>${wins}</p>
            </div>
            <div class="team-stat-card">
                <i class="fa fa-times-circle"></i><h3>الخسائر</h3><p>${losses}</p>
            </div>
            <div class="team-stat-card">
                <i class="fa fa-handshake"></i><h3>التعادلات</h3><p>${draws}</p>
            </div>
        </div>
    `;
}
function filterMatches(filterType) {
    const selectedTeam = document.getElementById("team-select").value;
    if (!selectedTeam) return;

    Papa.parse(pastGamesUrl, {
        download: true,
        header: true,
        complete: function(results) {
            let matches = results.data.filter(
                game => game.Team1 === selectedTeam || game.Team2 === selectedTeam
            );

            // تطبيق الفلترة حسب نوع الاختيار
            if (filterType === "win") {
                matches = matches.filter(game => game.Winner === "الهلال");
            } else if (filterType === "loss") {
                matches = matches.filter(game => game.Winner === selectedTeam);
            } else if (filterType === "draw") {
                matches = matches.filter(game => game.Winner === "التعادل");
            }

            displayTeamMatches(matches); // تحديث عرض الجدول بالبيانات المفلترة
            updateTeamStats(matches, selectedTeam); // تحديث الإحصائيات
        },
        error: function(error) {
            console.error("Error fetching filtered matches:", error);
        }
    });
}
//=====================================================

// دالة عرض قسم "حسميات الدوري"
function showYearStats() {
  hideAllSections(); // إخفاء جميع الأقسام
  document.getElementById("year-stats-section").classList.remove("hidden"); // إظهار القسم
  document.getElementById("year-select").value = ""; // إعادة تعيين القائمة المنسدلة
  document.getElementById("year-stats-table").classList.add("hidden"); // إخفاء الجدول
  document.getElementById("year-matches-stats").classList.add("hidden"); // إخفاء أزرار التصفية
  loadYears(); // تحميل الأعوام
  showMainMenuButton(); // إظهار زر العودة
}

// تحميل الأعوام من Google Sheets
function loadYears() {
    Papa.parse(pastGamesUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            const years = [...new Set(results.data.map(game => game.Year))].sort();
            const yearSelect = document.getElementById("year-stats-select");
            if (yearSelect) {
                yearSelect.innerHTML = '<option value="">-- اختر السنة --</option>';
                years.forEach(year => {
                    if (year) {
                        yearSelect.innerHTML += `<option value="${year}">${year}</option>`;
                    }
                });
            } else {
                console.error("القائمة المنسدلة غير موجودة في HTML.");
            }
        },
        error: function(error) {
            console.error("خطأ أثناء تحميل البيانات:", error);
        }
    });
}

// جلب البيانات عند اختيار السنة
function fetchYearStatsData() {
    const selectedYear = document.getElementById("year-stats-select").value;
    if (!selectedYear) {
        document.getElementById("year-stats-table").classList.add("hidden");
        document.getElementById("year-matches-stats").classList.add("hidden");
        document.getElementById("year-stats").innerHTML = ""; // تنظيف الإحصائيات
        return;
    }

    Papa.parse(pastGamesUrl, {
        download: true,
        header: true,
        complete: function(results) {
            const matches = results.data.filter(game => game.Year === selectedYear);

            displayYearMatches(matches); // عرض المباريات
            updateYearStats(matches); // تحديث الإحصائيات

            document.getElementById("year-stats-table").classList.remove("hidden");
            document.getElementById("year-matches-stats").classList.remove("hidden");
        },
        error: function(error) {
            console.error("Error fetching year stats:", error);
        }
    });
}

// عرض المباريات في الجدول
function displayYearMatches(matches) {
    const tableBody = document.getElementById("year-stats-tbody");
    tableBody.innerHTML = "";
    matches.forEach(match => {
        const row = document.createElement("tr");
        row.innerHTML = `
             <td>${match.Index}</td> 
            <td>${match.Year}</td>
            <td>${match.Round}</td>
            <td>${match.Team1}</td>
            <td>${match.Team2}</td>
            <td>${match.Score1} - ${match.Score2}</td>
            <td>${match.Winner}</td>
        `;
        tableBody.appendChild(row);
    });
}

// حساب الإحصائيات
function updateYearStats(matches) {
    const statsContainer = document.getElementById("year-stats");

    const totalMatches = matches.length;
    const wins = matches.filter(match => match.Winner === "الهلال").length;
    const losses = matches.filter(match => match.Winner !== "الهلال" && match.Winner !== "التعادل").length;
    const draws = matches.filter(match => match.Winner === "التعادل").length;

    statsContainer.innerHTML = `
        <div class="team-stats-container">
            <div class="team-stat-card">
                <i class="fa fa-futbol"></i><h3>المباريات</h3><p>${totalMatches}</p>
            </div>
            <div class="team-stat-card">
                <i class="fa fa-trophy"></i><h3>الانتصارات</h3><p>${wins}</p>
            </div>
            <div class="team-stat-card">
                <i class="fa fa-times-circle"></i><h3>الخسائر</h3><p>${losses}</p>
            </div>
            <div class="team-stat-card">
                <i class="fa fa-handshake"></i><h3>التعادلات</h3><p>${draws}</p>
            </div>
        </div>
    `;
}

// تطبيق الفلترة حسب نوع المباراة في قسم حسميات الدوري
function filterYearMatches(filterType) {
    const selectedYear = document.getElementById("year-stats-select").value;
    if (!selectedYear) return;

    Papa.parse(pastGamesUrl, {
        download: true,
        header: true,
        complete: function(results) {
            let matches = results.data.filter(game => game.Year === selectedYear);

            if (filterType === "win") {
                matches = matches.filter(game => game.Winner === "الهلال");
            } else if (filterType === "loss") {
                matches = matches.filter(game => game.Winner !== "الهلال" && game.Winner !== "التعادل");
            } else if (filterType === "draw") {
                matches = matches.filter(game => game.Winner === "التعادل");
            }

            displayYearMatches(matches); // تحديث عرض الجدول
            updateYearStats(matches); // تحديث الإحصائيات
        },
        error: function(error) {
            console.error("Error fetching filtered matches:", error);
        }
    });
}


//==============================================================================================


// ====== دالة عرض جدول مباريات الهلال القادمة ======
function showUpcomingMatches() {
    hideAllSections(); // إخفاء جميع الأقسام
    document.getElementById("upcoming-matches-section").classList.remove("hidden");
    fetchUpcomingMatches(); // جلب البيانات
    showMainMenuButton(); // إظهار زر العودة
}

// ====== جلب البيانات من Google Sheets ======
let allUpcomingMatches = []; // لتخزين البيانات الأصلية

function fetchUpcomingMatches() {
    Papa.parse(upcomingMatchesUrl, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            allUpcomingMatches = results.data; // تخزين البيانات
            displayUpcomingMatches(allUpcomingMatches); // عرض كل البيانات
        },
        error: function (error) {
            console.error("Error fetching upcoming matches:", error);
        }
    });
}

// ====== عرض البيانات في الجدول ======
function displayUpcomingMatches(matches) {
    const tableBody = document.getElementById("upcoming-matches-tbody");
    tableBody.innerHTML = ""; // تنظيف الجدول

    matches.forEach(match => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${match.Date}</td>
            <td>${match.Opponent}</td>
            <td>${match.Competition}</td>
            <td>${match.Location}</td>
        `;
        tableBody.appendChild(row);
    });
}

// ====== فلترة البيانات بناءً على المسابقة ======
function filterUpcomingMatches(competition) {
    const filteredMatches = allUpcomingMatches.filter(match => match.Competition === competition);
    displayUpcomingMatches(filteredMatches); // عرض البيانات المفلترة
}

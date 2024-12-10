 // كود لفتح ازرار ارسال تلقرام اذا انا دخلت بايميلي الادمن 
 document.addEventListener("DOMContentLoaded", () => {
    const adminEmail = "Abunowaf@outlook.com"; // الإيميل الخاص بالأدمن
    const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails") || "[]"); // جلب القائمة من localStorage
    const userEmail = registeredEmails[0]; // جلب أول بريد إلكتروني من القائمة

    console.log("Admin Email:", adminEmail); // تتبع الإيميل الخاص بالأدمن
    console.log("User Email:", userEmail); // تتبع الإيميل المسجل للمستخدم

    if (userEmail !== adminEmail) {
        console.log("User is not admin, hiding buttons.");

        // إخفاء زر "إرسال آخر مباراة"
        const sendLastMatchButton = document.getElementById("send-last-match");
        if (sendLastMatchButton) {
            sendLastMatchButton.style.display = "none";
            console.log("Hiding send-last-match button");
        }

        // إخفاء زر "إرسال رسالة"
        const telegramSendButton = document.getElementById("telegram-send-btn");
        if (telegramSendButton) {
            telegramSendButton.style.display = "none";
            console.log("Hiding telegram-send-btn button");
        }
    } else {
        console.log("User is admin, showing buttons.");
    }
});
//===============================================================

if ("serviceWorker" in navigator) {
    window.addEventListener("load", function() {
        navigator.serviceWorker.register("/service-worker.js")
            .then(registration => {
                console.log("ServiceWorker registered with scope:", registration.scope);
            })
            .catch(error => {
                console.log("ServiceWorker registration failed:", error);
            });
    });
}

// تحميل البيانات والتحقق من وجود اتصال
//document.addEventListener("DOMContentLoaded", loadData);

//function loadData() {
   // const storedData = localStorage.getItem("videosData");
   // if (storedData) {
      //  displayYouTubeVideos(JSON.parse(storedData));
   // } else {
      //  fetchAndStoreData();
 //   }
//}

function fetchAndStoreData() {
    // تحقق مما إذا كانت البيانات موجودة في localStorage
    const storedData = localStorage.getItem("videosData");

    if (storedData) {
        // إذا كانت البيانات موجودة، استخدمها مباشرةً
        displayYouTubeVideos(JSON.parse(storedData));
    } else {
        // جلب البيانات من الإنترنت وتخزينها في localStorage
        Papa.parse(youtubeVideosUrl, {
            download: true,
            header: true,
            complete: function(results) {
                const videosData = results.data;
                displayYouTubeVideos(videosData);
                localStorage.setItem("videosData", JSON.stringify(videosData)); // تخزين البيانات
            },
            error: function(error) {
                console.error("Error fetching data:", error);
                alert("لا توجد بيانات متاحة حاليا للعمل بدون إنترنت.");
            }
        });
    }
}
if (!navigator.onLine) {
    // استخدم البيانات من localStorage عند عدم وجود اتصال
    const cachedData = localStorage.getItem("videosData");
    if (cachedData) {
        displayYouTubeVideos(JSON.parse(cachedData));
    } else {
        alert("لا توجد بيانات متاحة حاليا للعمل بدون إنترنت.");
    }
}

  

// رابط Google Apps Script للإرسال
const googleSheetURL = "https://script.google.com/macros/s/AKfycbxyqMTKxHwD370QTyACURrHE27L_KyUXH7Z3EmhcHJoNYM-g0oww6vgSyxa38kkWhhv/exec";


const uuid = generateUUID(); // توليد UUID
const timestamp = new Date().toISOString(); // إنشاء توقيت التسجيل
/// دالة لتوليد UUID فريد لكل مستخدم
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// تحقق من وجود مستخدم مسجل عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
    fetchChampionshipData();
  

   
    // إضافة الشريط النصي
    const marquee = document.getElementById("info-content");
    if (marquee) {
        marquee.textContent = "جاري البحث عن آخر مباراة...";
    }


    const registeredUUID = localStorage.getItem("userUUID");
    if (registeredUUID) {
        document.getElementById("register-screen").classList.add("hidden"); // إخفاء شاشة التسجيل إذا كان هناك مستخدم مسجل
        document.getElementById("overlay").classList.add("hidden"); // إخفاء التراكب
        document.getElementById("main-buttons").classList.remove("hidden"); // إظهار الأزرار
    } else {
        document.getElementById("register-screen").classList.remove("hidden"); // إظهار شاشة التسجيل إذا لم يكن هناك مستخدم
        document.getElementById("overlay").classList.remove("hidden"); // إظهار التراكب
        document.getElementById("main-buttons").classList.add("hidden"); // إخفاء الأزرار حتى يتم التسجيل
    }
});


   
// دالة التسجيل مع إرسال UUID و Timestamp
// دالة التسجيل مع إرسال UUID و Timestamp
function registerUser() {
    const name = document.getElementById("user-name").value;
    const email = document.getElementById("user-email").value;
    const registerButton = document.getElementById("register-btn");
    const uuid = generateUUID(); // توليد UUID
    const timestamp = new Date().toISOString(); // إنشاء توقيت التسجيل

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
        alert("هذا البريد الإلكتروني مسجل بالفعل. يمكنك الوصول إلى الميزات.");
        document.getElementById("register-screen").classList.add("hidden");
        document.getElementById("overlay").classList.add("hidden");
        document.getElementById("main-buttons").classList.remove("hidden");
        registerButton.disabled = false;
        registerButton.textContent = "تسجيل";
        return;
    }

    // حفظ البيانات في Google Sheets وLocal Storage
    fetch(googleSheetURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, uuid, timestamp }),
        mode: "no-cors"
    })
   
    .then(() => {
        alert("تم التسجيل بنجاح!");
        const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails")) || [];
        registeredEmails.push(email);
        localStorage.setItem("registeredEmails", JSON.stringify(registeredEmails));
        localStorage.setItem("userUUID", uuid);
        localStorage.setItem("username", name);
      const welcomeMessage = document.getElementById("welcome-message");
if (welcomeMessage) {
    welcomeMessage.textContent = `مرحبًا بك يازعيـــم  ${name}`;
}


        document.getElementById("register-screen").classList.add("hidden");
        document.getElementById("overlay").classList.add("hidden");
        document.getElementById("main-buttons").classList.remove("hidden");
    })
    .catch(error => {
        console.error("Error:", error);
        alert("حدث خطأ أثناء التسجيل. حاول مرة أخرى.");
    })
    .finally(() => {
        // إعادة تفعيل الزر بعد التسجيل
        registerButton.disabled = false;
        registerButton.textContent = "تسجيل";
    });
}

// دالة للتحقق مما إذا كان البريد الإلكتروني مسجلًا مسبقًا
function isEmailRegistered(email) {
    const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails")) || [];
    return registeredEmails.includes(email);
}



function showWelcomeMessage() {
    const username = localStorage.getItem("username"); // جلب اسم المستخدم من localStorage
    const welcomeMessageElement = document.getElementById("welcome-message"); // العنصر الذي سيظهر الرسالة

    if (username && welcomeMessageElement) {
        welcomeMessageElement.textContent = `  مرحباً بك يا زعيـــم :   ${username}`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    showWelcomeMessage(); // عرض رسالة الترحيب عند فتح التطبيق
});




function fetchUserCount() {
    fetch("https://script.google.com/macros/s/AKfycbwTghdY-7GCgsEibhJMD_9aFz-y2iqfWuTwDW8PlL9v0grw4BZvdKNSuhYVtgjeNu-3/exec")
        .then(response => response.json())
        .then(data => {
            if (data.status === "Success") {
                const userCount = data.userCount;
                document.getElementById("user-count").textContent = `أنت الزائر رقم : ${userCount}`;
            } else {
                console.error("Error:", data.message);
            }
        })
        .catch(error => console.error("Fetch error:", error));
}

document.addEventListener("DOMContentLoaded", () => {
    fetchUserCount(); // استدعاء الدالة بعد تحميل الصفحة
});


// بيانات البطولات حسب المسابقة
const championshipsByCompetition = {
    "كأس الملك": [1962, 1965, 1980, 1982, 1984, 1989, 2015, 2017, 2020, 2023, 2024],
    "الدوري الممتاز": [1977, 1979, 1985, 1986, 1988, 1990, 1996, 1998, 2000, 2005, 2008, 2010, 2011, 2017, 2018, 2020, 2021, 2022, 2024],
    "كأس ولي العهد": [1965,1964, 1995, 2000, 2003, 2005, 2006, 2008, 2009, 2010, 2011, 2012, 2013, 2016],
    "دوري أبطال آسيا": [ 1991, 1996, 1997, 2000, 2002, 2019, 2021],
    "كأس الاتحاد السعودي": [ 2005, 1999, 1986, 1989, 1993, 1995],
    "كأس السوبر السعودي": [2015, 2018, 2021, 2023, 2024],
    "كأس المؤسس": [2000],
    "بطولة الأندية العربية أبطال الدوري": [2001, 2000, 1994, 1995],
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
function hideAllSections() {
    document.getElementById("competition-search").classList.add("hidden");
    document.querySelector(".timeline-container").classList.add("hidden");
    document.getElementById("matches-schedule").classList.add("hidden");
    document.getElementById("youtube-videos").classList.add("hidden");
    document.getElementById("championship-details").classList.add("hidden");
    document.getElementById("championship-info").classList.add("hidden");
    document.getElementById("managers-section").classList.add("hidden");
    document.getElementById("last-games-section").classList.add("hidden");
    document.getElementById("youtube-videos").innerHTML = ""; // تنظيف فيديوهات يوتيوب
    hidePagination(); // إخفاء أزرار التنقل بين الصفحات
    hideMainMenuButton(); // إخفاء زر العودة
}

// ====== دالة العودة إلى الشاشة الرئيسية ======
function goToMainMenu() {
    hideAllSections(); // إخفاء جميع الأقسام
    document.getElementById("main-buttons").classList.remove("hidden"); // عرض الأزرار الرئيسية فقط
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

// عرض قسم مباريات الهلال القادمة
function showMatches() {
    hideAllSections();
    document.getElementById("matches-schedule").classList.remove("hidden");
    fetchMatchesData(); // جلب بيانات المباريات
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

// عرض قسم المباريات التاريخية
function showLastGames() {
    hideAllSections();
    document.getElementById("last-games-section").classList.remove("hidden");
    document.getElementById("season-select").classList.remove("hidden");
    document.getElementById("last-games-table").classList.add("hidden"); // إخفاء الجدول
    document.querySelector(".competition-buttons").classList.add("hidden"); // إخفاء الأزرار الإضافية
    loadLastGamesSeasons(); // تحميل السنوات
    showMainMenuButton(); // إظهار زر العودة
}



// ====== وظائف إضافية ======

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
const matchesSheet = "Sheet1";
const youtubeVideosSheet = "YouTubeVideos";
const ConsentChampionsLeagueSheet2 = "champcount";
const pastGamesSheet = "PastGames";
const managersSheet = "manger"; 
// URLs للشيتات
const championshipsUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(championshipsSheet)}`;
const matchesUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(matchesSheet)}`;
const youtubeVideosUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(youtubeVideosSheet)}`;
const presidentsUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(ConsentChampionsLeagueSheet2)}`;
const pastGamesUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(pastGamesSheet)}`;
const managersUrl = `https://docs.google.com/spreadsheets/d/${ConsentSheetID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(managersSheet)}`;



let lastGamesData = {}; // تخزين البيانات حسب الموسم


// تحميل السنوات في القائمة المنسدلة
function loadLastGamesSeasons() {
    Papa.parse(pastGamesUrl, {
        download: true,
        header: true,
        complete: function(results) {
            console.log("Fetched Data: ", results.data); // عرض البيانات في وحدة التحكم لفحصها
            const seasons = [...new Set(results.data.map(game => game.Year))]; // استخراج الأعوام الفريدة
            const seasonSelect = document.getElementById("season-select");
            seasonSelect.innerHTML = '<option value="">-- اختر السنة --</option>'; // إعادة تعيين القائمة
            seasons.forEach(season => {
                if (season) {
                    seasonSelect.innerHTML += `<option value="${season}">${season}</option>`;
                }
            });
        },
        error: function(error) {
            console.error("Error fetching seasons: ", error);
        }
    });
}

// دالة جلب البيانات عند اختيار الموسم
function fetchLastGamesData() {
    const selectedSeason = document.getElementById("season-select").value;
    if (!selectedSeason) return; // إذا لم يتم اختيار سنة، لا تفعل شيئًا

    Papa.parse(pastGamesUrl, {
        download: true,
        header: true,
        complete: function(results) {
            const filteredGames = results.data.filter(game => game.Year === selectedSeason);
            lastGamesData[selectedSeason] = filteredGames;

            // عرض الجدول والأزرار بعد اختيار السنة
            document.getElementById("last-games-table").classList.remove("hidden");
            document.querySelector(".competition-buttons").classList.remove("hidden");

            displayLastGames(filteredGames); // عرض المباريات
            updateStatistics(filteredGames); // تحديث الإحصائيات
        },
        error: function(error) {
            console.error("Error fetching data:", error);
        }
    });
}




// دالة عرض البيانات في الجدول
function displayLastGames(games) {
    const tableBody = document.getElementById("last-games-tbody");
    tableBody.innerHTML = ""; // إعادة تعيين محتوى الجدول
    games.forEach(game => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${game.Index}</td>
            <td>${game.Year}</td>
            <td>${game.Round}</td>
            <td>${game.Team1}</td>
            <td>${game.Team2}</td>
             <td>${game.Score1} - ${game.Score2}</td>
            <td>${game.Winner}</td>
        `;
        tableBody.appendChild(row);
    });
}

function filterMatchesByResult(result) {
    const selectedSeason = document.getElementById("season-select").value;
    if (!selectedSeason || !lastGamesData[selectedSeason]) return;

    let matchesToDisplay = [];
    if (result === "wins") {
        matchesToDisplay = lastGamesData[selectedSeason].filter(match => match.Winner === "الهلال");
    } else if (result === "losses") {
        matchesToDisplay = lastGamesData[selectedSeason].filter(match => match.Winner !== "الهلال" && match.Winner !== "التعادل" && match.Winner !== "");
    } else if (result === "draws") {
        matchesToDisplay = lastGamesData[selectedSeason].filter(match => match.Winner === "التعادل");
    }

    displayLastGames(matchesToDisplay); // عرض البيانات المفلترة
}



function updateStatistics(matches) {
    const wins = matches.filter(match => match.Winner === "الهلال").length; // عدد الفوز
    const losses = matches.filter(match => match.Winner !== "الهلال" && match.Winner !== "التعادل" && match.Winner !== "").length; // عدد الخسارة
    const draws = matches.filter(match => match.Winner === "التعادل").length; // عدد التعادل

    // تحديث النصوص في الأزرار
    document.getElementById("wins-button").textContent = `عدد الفوز: ${wins}`;
    document.getElementById("losses-button").textContent = `عدد الخسارة: ${losses}`;
    document.getElementById("draws-button").textContent = `عدد التعادل: ${draws}`;
}



// دالة لعرض نموذج الملاحظات
function showFeedbackForm() {
  hideAllSections(); // إخفاء جميع الأقسام الأخرى
  document.getElementById("feedback-section").classList.remove("hidden");
}

// دالة لإرسال الملاحظات
function sendFeedback() {
  const subject = document.getElementById("feedbackSubject").value.trim();
  const message = document.getElementById("feedbackMessage").value.trim();
  const feedbackButton = document.querySelector('.feedback-btn'); // استهداف زر الإرسال

  // استرجاع بيانات المستخدم من localStorage
  const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails")) || [];
  const email = registeredEmails[0] || "No Email"; // الحصول على أول بريد إلكتروني مسجل
  const name = localStorage.getItem("username") || "No Name";
  const uuid = localStorage.getItem("userUUID") || "No UUID";

  if (!subject || !message) {
    alert("يرجى ملء جميع الحقول.");
    return;
  }

  // تعطيل الزر وعرض رسالة "جاري الإرسال"
  feedbackButton.disabled = true;
  feedbackButton.textContent = "جاري الإرسال...";

  // إرسال البيانات إلى Google Apps Script
  fetch("https://script.google.com/macros/s/AKfycbwnR6b_Wo3bLK65vBq3wuOh6uWY1_l41n3z-Mxt-tqN4-yCSHuJy2VsGdVGwg-niw5D/exec", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, uuid, subject, message }),
    mode: "no-cors",
  })
    .then(() => {
      alert("تم إرسال مقترحك بنجاح!");
    resetView(); // إغلاق النموذج بعد ظهور رسالة النجاح

      document.getElementById("feedbackSubject").value = '';
      document.getElementById("feedbackMessage").value = '';
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      alert("حدث خطأ أثناء إرسال المقترح.");
    })
    .finally(() => {
      // إعادة تمكين الزر واستعادة النص الأصلي
      feedbackButton.disabled = false;
      feedbackButton.textContent = "إرسال الملاحظات";
    });
}


// دالة لإخفاء نموذج الملاحظات
function resetView() {
  document.getElementById("feedback-section").classList.add("hidden");
}





















// دالة جلب البيانات من Google Sheets للمباريات
let allMatches = []; // لتخزين جميع المباريات

function fetchMatchesData() {
    Papa.parse(matchesUrl, {
        download: true,
        header: true,
        complete: function(results) {
            allMatches = results.data; // حفظ جميع البيانات
            displayMatches(allMatches); // عرض كل المباريات عند التحميل
        },
        error: function(error) {
            console.error("Error fetching matches data: ", error);
        }
    });
}

function displayMatches(matches) {
    const tableBody = document.getElementById("matches-tbody");
    tableBody.innerHTML = "";
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

function filterMatches(competition) {
    const filteredMatches = allMatches.filter(match => match.Competition === competition);
    displayMatches(filteredMatches);
}








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

// عرض تفاصيل البطولة
// عرض تفاصيل البطولة
// عرض تفاصيل البطولة
// عرض تفاصيل البطولة
function showChampionshipInfo(championship) {
    const infoContainer = document.getElementById("championship-info");
    const detailsContainer = document.getElementById("championship-details");

    // إخفاء قائمة البطولات
    detailsContainer.classList.add("hidden");

    // تحديث محتوى البطاقة
    infoContainer.innerHTML = `
    
        <img src="icon.png" alt="شعار التطبيق" id="championship-logo" style="width: 50px; height: auto; margin-bottom: 10px;">
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








function showAboutCard() {
    document.getElementById("about-card").classList.remove("hidden");
}

function closeAboutCard() {
    document.getElementById("about-card").classList.add("hidden");
}

  // دلة الشريط الزمني الخاص بعرض اخر مباراة لعبها الهلال ونتيجتها 

document.addEventListener("DOMContentLoaded", async () => {
  const marqueeContent = document.querySelector(".marquee-content");

  const matchesUrl = "https://docs.google.com/spreadsheets/d/1ksZhTi3JW4QP5MOk8fcWnUCeXbmTqpXW4BLxLaHtmc8/gviz/tq?tqx=out:csv&sheet=PastGames";
  const championshipsUrl = "https://docs.google.com/spreadsheets/d/1ksZhTi3JW4QP5MOk8fcWnUCeXbmTqpXW4BLxLaHtmc8/gviz/tq?tqx=out:csv&sheet=Sheet2";

  async function fetchLastMatch() {
    try {
      const response = await fetch(matchesUrl);
      const csvData = await response.text();
      const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;

      const sortedData = parsedData.sort((a, b) => parseInt(b.Index) - parseInt(a.Index));
      const lastMatch = sortedData[0];
      return lastMatch ? `آخر مباراة: ${lastMatch.Team1} ❌ ${lastMatch.Team2} انتهت ${lastMatch.Score1}-${lastMatch.Score2}` : "لم يتم العثور على مباريات.";
    } catch (error) {
      console.error("Error fetching matches:", error);
      return "حدث خطأ أثناء جلب البيانات.";
    }
  }

  async function fetchLastChampionships() {
    try {
      const response = await fetch(championshipsUrl);
      const csvData = await response.text();
      const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true }).data;

      const latestYear = Math.max(...parsedData.map(item => parseInt(item.Year)));
      const championships = parsedData.filter(item => parseInt(item.Year) === latestYear);

      if (championships.length > 0) {
        const championshipsList = championships.map((item, index) => `${index + 1}. ${item.Name}`).join(' 🏆 ');
        return `بطولات عام ${latestYear}: ${championshipsList}`;
      } else {
        return "لا توجد بطولات في العام الأخير.";
      }
    } catch (error) {
      console.error("Error fetching championships:", error);
      return "حدث خطأ أثناء جلب البيانات.";
    }
  }

 async function initializeMarquee() {
    try {
        const lastMatchText = await fetchLastMatch(); // جلب نص آخر مباراة
        const lastChampionshipsText = await fetchLastChampionships(); // جلب نص آخر بطولات

        // أضف النصوص إلى الماركيه مع ترتيب البطولات أولاً
        marqueeContent.innerHTML = `
        <span><a href="https://t.me/AlHilalFansChannel" target="_blank" class="telegram-link">اشتركوا في قناة التليجرام للحصول على أحدث الأخبار 📲</a></span>

            <span>${lastChampionshipsText}</span>
            <span>${lastMatchText}</span>
                        
        `;
    } catch (error) {
        console.error("Error initializing marquee:", error);
    }
}
  initializeMarquee();
});


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

function redirectToTelegram() {
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
                    <button onclick="prevManager()">السابق</button>
                    <button onclick="nextManager()">التالي</button>
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

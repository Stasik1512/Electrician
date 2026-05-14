let mode = "";
let category = "";
let attempts = 3;
let currentQuestion = null;
let currentQuestionsList = []; // копия вопросов для игры, чтобы избежать проблем

// База вопросов
const questions = 
{
    formulas: 
    [
        { q: "Формула закона Ома: ", a: "I = U / R, U = I * R, R = U / I" },
        { q: "Формула закона Ома для полной цепи: ", a: "I = E / (R+r)" },
        { q: "Формула мощности:", a: "P = U * I, P = I^2 * R, P = U^2 / R" },
        { q: "Формула работы тока:", a: "A = U * I * t, A = P * t" },
        { q: "Формула закона Джоуля-Ленца ", a: "Q = I^2 * R * t" },

        { q: "Последовательное соединение. Сила тока:", a: "I = I1 = I2" },
        { q: "Последовательное соединение. Напряжние:", a: "U = U1 + U2" },
        { q: "Последовательное соединение. Сопративление:", a: "R = R1 + R2" },

        { q: "Паралельное соединение. Сила тока:", a: "I = I1 + I2" },
        { q: "Паралельное соединение. Напряжние:", a: "U = U1 = U2" },
        { q: "Паралельное соединение. Сопративление:", a: "1 / R = 1 / R1 + 1 / R2" },

        { q: "Последовательное соединение. Конденсатор:", a: "1 / C = 1 / C1 + 1 / C" },
        { q: "Паралельное соединение. Конденсатор:", a: "C = C1 + C2" },

        { q: "Формула cилы тока: ", a: "I = q / t" },
        { q: "Формула сопротивления: ", a: "R = (ρ * l) / s" },
        { q: "Формула напряжения: ", a: "U = A / q" },

        { q: "Формула частоты", a: "𝑣 = 1 / T"},
        
    ],

    terms: 
    [
        { q: "Что такое ток ?", a: "Упорядоченное движение заряженных частиц." },
        { q: "Что такое напряжение ?", a: "Разность потенциалов между двумя точками цепи." },
        { q: "Что такое сопротивление ?", a: "Свойство проводника препятствовать прохождению тока." },
        { q: "Что такое номинальный ток ?", a: "Максимальный ток, который устройство может пропускать длительное время без отключения."},
        { q: "Что такое автоматический выключатель ?", a: "Устройство защиты, отключающее цепь при перегрузке или коротком замыкании." },
        { q: "Что. такое устройство защитного отключения ?", a: "Аппарат защиты от токов утечки. Сравнивает ток фазы и нуля и отключает питание при их различии." },
        { q: "Что такое дифференциальный автомат ?", a: "Устройство объединяющее автоматический выключатель и УЗО."},
        { q: "Что такое жила ? ", a: "Токопроводящая часть кабеля."},
        { q: "Что такое сечение кабеля ?", a: "Площадь поперечного среза токопроводящей жилы."},
        { q: "Что такое изоляция ?", a: "Диэлектрический слой, защищающий токоведущие части от утечки тока и поражения человека."},
        { q: "Что такое мощность ?", a: "Скорость преобразования или потребления электрической энергии."},
        { q: "Что такое частота ?", a: "Количество циклов переменного тока за секунду."},
        { q: "Что такое заземление ?", a: "Преднамеренное соединение оборудования с землей для защиты от поражения электрическим током."},
        { q: "Что такое фаза ?", a: "Провод, находящийся под напряжением относительно земли."},
        { q: "Что такое ноль у электриков", a: "Провод, соединенный с нейтралью источника питания и служащий для замыкания цепи."},
        { q: "Что такое короткое замыкание", a: "Аварийное соединение точек цепи с разными потенциалами, вызывающее резкий рост тока."},
        { q: "Что такое фазировка", a: "Проверка правильности чередования фаз в трехфазной сети." }


    ],

    tools: [
        { q: "Что за режим прозвонка?", a: "Режим мультиметра, при котором происходит проверка целостности цепи измерением сопротивления" },
        { q: "Что измеряет мультиметр?", a: "Для определения напряжения, тока и сопротивления." },
        { q: "Что измеряют токоизмерительные клещи ?", a: "Силу тока без разрыва цепи." },
        { q: "Для чего нужен мегаомметр?", a: "Для измерения сопротивления изоляции (в мегаомах) под повышенным напряжением."},
        { q: "Для чего нужна индикаторная отвертка?", a: "Для определения наличия напряжения (фазы) на контакте"}, 
    ]
};

// === Вспомогательные функции ===
function clearChat() {
    const chatDiv = document.getElementById("chat");
    chatDiv.innerHTML = ""; // полная очистка истории чата
}

function addMessage(text, type) {
    let chat = document.getElementById("chat");
    let msg = document.createElement("div");
    msg.className = "message " + type;
    msg.innerText = text;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

// Удалить старые кнопки категорий, если они есть
function removeCategoryButtons() {
    const oldBtns = document.querySelectorAll(".category-buttons");
    oldBtns.forEach(btn => btn.remove());
}

// Показ кнопок выбора категории (без дублирования)
function showCategories() {
    removeCategoryButtons();
    
    let chat = document.getElementById("chat");
    let btnsContainer = document.createElement("div");
    btnsContainer.className = "category-buttons";
    btnsContainer.innerHTML = `
        <button onclick="setCategory('formulas')">📐 Формулы</button>
        <button onclick="setCategory('terms')">📖 Термины</button>
        <button onclick="setCategory('tools')">🔧 Инструменты</button>
    `;
    chat.appendChild(btnsContainer);
    chat.scrollTop = chat.scrollHeight;
}

// === Выбор режима (с очисткой истории) ===
function setMode(m) {
    // Стираем всю историю при смене режима
    clearChat();
    mode = m;
    category = "";
    attempts = 3;
    currentQuestion = null;
    
    addMessage(`✨ Режим: ${mode === "study" ? "📘 Обучение" : "🎮 Игра"}`, "bot");
    
    if (mode === "study") {
        addMessage("📌 Выберите категорию для изучения:", "bot");
        showCategories();
    } 
    else if (mode === "game") {
        addMessage("🎯 Игра: отвечайте на вопросы. Даётся 3 попытки на вопрос!", "bot");
        addMessage("📌 Выберите категорию для викторины:", "bot");
        showCategories();
    }
}

// === Выбор категории (очищаем чат от предыдущих вопросов, начинаем заново) ===
function setCategory(cat) {
    // При смене категории очищаем историю, чтобы не было старого мусора
    clearChat();
    category = cat;
    attempts = 3;
    currentQuestion = null;
    
    addMessage(`🗂️ Категория: ${cat}`, "bot");
    
    if (mode === "study") {
        showStudy();
    } 
    else if (mode === "game") {
        // Копируем список вопросов для игры (чтобы не менять оригинал)
        currentQuestionsList = [...questions[category]];
        // Перемешиваем вопросы для интереса (опционально)
        shuffleArray(currentQuestionsList);
        startNewGameQuestion();
    }
}

// Перемешивание массива (для разнообразия в игре)
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
}

// === Обучение: просто выводим все вопросы с ответами ===
function showStudy() {
    let list = questions[category];
    if (!list || list.length === 0) {
        addMessage("❌ Нет материалов в этой категории.", "bot");
        return;
    }
    
    addMessage(`📖 Справочные материалы (${category}):`, "bot");
    list.forEach((item, idx) => {
        addMessage(`${idx+1}. ${item.q} — ${item.a}`, "bot");
    });
    addMessage("✅ Вы изучили тему. Выберите другую категорию или режим.", "bot");
    // Показываем снова кнопки выбора категорий для удобства
    showCategories();
}

// === Игровая логика ===
function startNewGameQuestion() {
    if (!currentQuestionsList || currentQuestionsList.length === 0) {
        // Если вопросы закончились — пересоздаём список заново (можно снова перемешать)
        if (questions[category] && questions[category].length > 0) {
            currentQuestionsList = [...questions[category]];
            shuffleArray(currentQuestionsList);
            addMessage("🔄 Вопросы в категории закончились! Начинаем новый круг.", "bot");
        } else {
            addMessage("⚠️ Нет вопросов в этой категории. Выберите другую.", "bot");
            showCategories();
            return;
        }
    }
    
    // Берем следующий вопрос (сдвигаем с начала)
    currentQuestion = currentQuestionsList.shift();
    addMessage(`❓ ${currentQuestion.q}`, "bot");
    attempts = 3; // сбрасываем попытки для нового вопроса
}

// Проверка ответа в игре
// Проверка ответа в игре (с учётом регистра, но без учёта пробелов)
function checkAnswer(userAnswer) {
    if (!currentQuestion) {
        addMessage("❓ Сначала выберите категорию и начните игру.", "bot");
        return false;
    }
    
    const correctAnswerRaw = currentQuestion.a;
    const userAnswerTrimmed = userAnswer.trim();
    
    // Функция для удаления ВСЕХ пробелов (пробелы, табуляции, переносы строк)
    function removeSpaces(str) {
        return str.replace(/\s+/g, '');
    }
    
    // Удаляем пробелы из обоих ответов
    const userNoSpaces = removeSpaces(userAnswerTrimmed);
    const correctNoSpaces = removeSpaces(correctAnswerRaw);
    
    // Прямое сравнение без пробелов (регистр сохраняется!)
    let isMatch = (userNoSpaces === correctNoSpaces);
    
    // Дополнительная проверка для формул с разными вариантами написания
    if (!isMatch) {
        // Для закона Ома: I=U/R (допускаем I=U/R, I=U/R, I=U/R)
        if (correctNoSpaces === "I=U/R" && 
            (userNoSpaces === "I=U/R" || userNoSpaces === "I=U/R" || userNoSpaces === "I=U/R")) {
            isMatch = true;
        }
        // Для мощности: P=U*I (допускаем P=U*I, P=UI)
        else if (correctNoSpaces === "P=U*I" && 
                 (userNoSpaces === "P=U*I" || userNoSpaces === "P=UI")) {
            isMatch = true;
        }
        // Для работы тока: W=U*I*t (допускаем W=U*I*t, W=UIt)
        else if (correctNoSpaces === "W=U*I*t" && 
                 (userNoSpaces === "W=U*I*t" || userNoSpaces === "W=UIt")) {
            isMatch = true;
        }
        // Для текстовых ответов - проверка по ключевым словам (регистр сохраняется)
        else if (!correctNoSpaces.includes('=') && !correctNoSpaces.includes('*') && !correctNoSpaces.includes('/')) {
            // Для текстовых ответов проверяем, содержит ли ответ пользователя ключевое слово
            const firstKeyword = correctAnswerRaw.split(/\s+/)[0];
            if (userAnswerTrimmed.toLowerCase().includes(firstKeyword.toLowerCase())) {
                isMatch = true;
            }
        }
    }
    
    if (isMatch) {
        addMessage("✅ Правильно!", "bot");
        startNewGameQuestion();
        return true;
    } else {
        attempts--;
        if (attempts > 0) {
            addMessage(`❌ Неверно. Осталось попыток: ${attempts}`, "bot");
        } else {
            addMessage(`❌ Попытки кончились. Правильный ответ: ${currentQuestion.a}`, "bot");
            startNewGameQuestion();
        }
        return false;
    }
}
// === Отправка сообщения ===
function send() {
    let input = document.getElementById("input");
    let text = input.value.trim();
    
    if (!text) return;
    
    addMessage(text, "user");
    input.value = "";
    
    if (mode === "game") {
        if (!category) {
            addMessage("⚠️ Сначала выберите категорию для игры (нажмите на кнопки выше).", "bot");
        } else {
            checkAnswer(text);
        }
    } 
    else if (mode === "study") {
        addMessage("📘 Сейчас режим обучения. Чтобы отвечать на вопросы, переключитесь в режим 'Игра'.", "bot");
    } 
    else {
        addMessage("⚡ Пожалуйста, выберите режим: Обучение или Игра.", "bot");
    }
}

// Дополнительная функция для удобства: при загрузке страницы показываем приветствие
window.onload = () => {
    clearChat();
    addMessage("👋 Привет! Я ⚡ Электрик Бот. Выбери режим:", "bot");
    // Активно показываем кнопки выбора режима уже есть в меню, но можно добавить подсказку
};
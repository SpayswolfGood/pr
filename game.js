// Символы для игрового автомата
const symbols = ['❤️', '🌟', '🎲', '🎮', '🎯'];
let isSpinning = false;
let heartChance = 0; // Базовый шанс выпадения сердец

// Функция для получения случайного символа с учетом увеличенного шанса сердец
function getRandomSymbol() {
    // Проверяем, должно ли выпасть сердце на основе увеличенного шанса
    if (Math.random() * 100 < heartChance) {
        return '❤️';
    }
    return symbols[Math.floor(Math.random() * symbols.length)];
}

// Функция для анимации вращения одного слота
function animateSlot(slotElement, finalSymbol, delay) {
    return new Promise(resolve => {
        let counter = 0;
        const maxIterations = 20;
        
        const interval = setInterval(() => {
            slotElement.textContent = getRandomSymbol();
            counter++;
            
            if (counter >= maxIterations) {
                clearInterval(interval);
                slotElement.textContent = finalSymbol;
                resolve();
            }
        }, 50);
    });
}

// Основная функция вращения
async function spin() {
    if (isSpinning) return;
    isSpinning = true;

    // Очищаем предыдущее сообщение
    document.getElementById('message').textContent = '';
    
    // Отключаем кнопку во время вращения
    const spinButton = document.querySelector('.spin-button');
    spinButton.disabled = true;

    // Генерируем финальные символы
    const finalSymbols = [
        getRandomSymbol(),
        getRandomSymbol(),
        getRandomSymbol()
    ];

    // Запускаем анимацию для каждого слота с небольшой задержкой
    const slots = [
        document.getElementById('slot1'),
        document.getElementById('slot2'),
        document.getElementById('slot3')
    ];

    // Анимируем каждый слот с задержкой
    await Promise.all([
        animateSlot(slots[0], finalSymbols[0], 0),
        new Promise(r => setTimeout(() => r(animateSlot(slots[1], finalSymbols[1])), 200)),
        new Promise(r => setTimeout(() => r(animateSlot(slots[2], finalSymbols[2])), 400))
    ]);

    // Проверяем результат
    if (finalSymbols.every(symbol => symbol === '❤️')) {
        document.getElementById('message').innerHTML = '🎉 УРААА! Вот твоя подсказка! Ты меня ищи в квартире. Я постоянно на виду . Я постоянно на тебя глежу. Ты меня скорее надевай и в меня ты поиграй. 🎉';
        // Сбрасываем шанс выпадения сердец после победы
        heartChance = 0;
    } else if (finalSymbols[0] === finalSymbols[1] && finalSymbols[1] === finalSymbols[2]) {
        // Увеличиваем шанс выпадения сердец на 10%
        heartChance += 10;
        document.getElementById('message').textContent = `🎉 Поздравляем! Все символы совпали! Но нужно чтобы выпало 3 сердца и тогда я дам тебе полную подсказку! (Шанс выпадения сердец увеличен на 10%, текущий шанс: ${heartChance}%)`;
    }

    // Включаем кнопку обратно
    spinButton.disabled = false;
    isSpinning = false;
}

// Добавляем обработку нажатия пробела для вращения
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        event.preventDefault(); // Предотвращаем прокрутку страницы
        spin();
    }
}); 
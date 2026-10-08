window.MD_ON_READY( function () {

    const vladEl = document.querySelector('.vlad .tn-atom');
    const mskEl = document.querySelector('.msk .tn-atom');

    function getTime(timeZone) {
        return new Intl.DateTimeFormat('ru-RU', {
            timeZone: timeZone,
            hour: 'numeric',
            minute: '2-digit',
            hour12: false
        }).format(new Date());
    }

    function updateTimes() {
        // Preserve the character spans while the intro scrambles the clock labels.
        if (window.MD_INTRO_SEQUENCE?.phase === 'revealing') return;

        // Владивосток
        if (vladEl) {
            vladEl.textContent =
                'VLAD ' + getTime('Asia/Vladivostok');
        }

        // Москва
        if (mskEl) {
            mskEl.textContent =
                'MSK ' + getTime('Europe/Moscow');
        }
    }

    // Сразу показываем актуальное время
    updateTimes();

    // Обновляем каждую секунду
    setInterval(updateTimes, 1000);

});

import React, { useState, useEffect } from 'react';
import '../../css/date.css';

const CalendarComponent = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDay, setSelectedDay] = useState(null);
    const [memo, setMemo] = useState('');
    const [calendarPosition, setCalendarPosition] = useState('center');

    useEffect(() => {
        updateCalendar();
    }, [currentMonth, currentYear]);

    const prevMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth - 1 + 12) % 12);
        if (currentMonth === 11) setCurrentYear((prevYear) => prevYear - 1);
    };

    const nextMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth + 1) % 12);
        if (currentMonth === 0) setCurrentYear((prevYear) => prevYear + 1);
    };

    const updateCalendar = () => {
        // 이전에 선택한 날짜에서 빨간색 제거
        const beforeDay = document.querySelector('.day.selected');
        if (beforeDay) {
            beforeDay.classList.remove('selected');
        }

        const calendar = document.getElementById("calendar");
        const monthDisplay = document.getElementById("month-display");
        const yearDisplay = document.getElementById("year-display");

        calendar.innerHTML = '';

        const firstDay = new Date(currentYear, currentMonth, 1).getDay();
        const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

        if (firstDay !== 0) {
            for (let i = firstDay; i > 0; i--) {
                const day = document.createElement("div");
                day.className = "day prev-month";
                day.textContent = new Date(currentYear, currentMonth, -i + 1).getDate();
                calendar.appendChild(day);
            }
        }

        for (let i = 1; i <= lastDate; i++) {
            const day = document.createElement("div");
            day.className = "day";
            day.textContent = i;
            day.addEventListener("click", () => selectDay(day));
            calendar.appendChild(day);
        }

        monthDisplay.textContent = `${currentMonth + 1}월`;
        yearDisplay.textContent = currentYear;

        if (selectedDay) {
            setCalendarPosition('left');
        } else {
            setCalendarPosition('center');
        }
    };

    const selectDay = (dayElement) => {
        // 이전에 선택한 날짜에서 빨간색 제거
        const beforeDay = document.querySelector('.day.selected');
        if (beforeDay) {
            beforeDay.classList.remove('selected');
        }

        // 새로운 선택한 날짜를 설정하고 빨간색 적용
        setSelectedDay(dayElement);
        dayElement.classList.add('selected');
        showNote(dayElement.textContent);
    };

    const showNote = (day) => {
        const note = document.getElementById("note");
        const memoInput = document.getElementById("memo");

        const storedMemo = localStorage.getItem(`memo_${currentYear}_${currentMonth}_${day}`);
        setMemo(storedMemo || "");
        note.style.display = "block";

        setCalendarPosition('left');
    };

    const saveNote = () => {
        if (selectedDay) {
            localStorage.setItem(`memo_${currentYear}_${currentMonth}_${selectedDay.textContent}`, memo);
            setMemo('');
            const note = document.getElementById("note");
            note.style.display = "none";

            setCalendarPosition('center');
        }
    };

    const handleMemoChange = (e) => {
        setMemo(e.target.value);
    };

    return (
        <div>
            <div style={{ textAlign: calendarPosition }}>
                <h1 id="year-display">{currentYear}</h1>
                <div className="nav">
                    <button className="before" onClick={prevMonth}>
                        이전달
                    </button>
                    <span className="month" id="month-display">{`${currentMonth + 1}월`}</span>
                    <button className="after" onClick={nextMonth}>
                        다음달
                    </button>
                </div>
                <div className="weekdays">
                    <div>일</div>
                    <div>월</div>
                    <div>화</div>
                    <div>수</div>
                    <div>목</div>
                    <div>금</div>
                    <div>토</div>
                </div>
                <div className="calendar" id="calendar"></div>
            </div>
            <div className="note" id="note">
                <h2>메모</h2>
                <textarea id="memo" value={memo} onChange={handleMemoChange}></textarea>
                <button id="memoBtn" className="after" onClick={saveNote}>
                    메모 저장
                </button>
            </div>
        </div>
    );
};

export default CalendarComponent;

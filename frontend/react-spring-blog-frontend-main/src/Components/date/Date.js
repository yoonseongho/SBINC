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
        setCurrentYear((prevYear) => {
            if (currentMonth === 0) {
                return prevYear - 1;
            } else {
                return prevYear;
            }
        });
    };

    const nextMonth = () => {
        setCurrentMonth((prevMonth) => (prevMonth + 1) % 12);
        setCurrentYear((prevYear) => {
            if (currentMonth === 11) {
                return prevYear + 1;
            } else {
                return prevYear;
            }
        });
    };

    const updateCalendar = () => {
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

        const nextMonthFirstDay = new Date(currentYear, currentMonth + 1, 1).getDay();
        const daysInNextMonth = new Date(currentYear, currentMonth + 2, 0).getDate();

        for (let i = 1; i <= Math.min(6 - nextMonthFirstDay, daysInNextMonth); i++) {
            const day = document.createElement("div");
            day.className = "day next-month";
            day.textContent = i;
            calendar.appendChild(day);
        }
    };

    const selectDay = (dayElement) => {
        const beforeDay = document.querySelector('.day.selected');

        if (beforeDay === dayElement) {
            // 이미 선택된 날짜를 다시 선택하면 메모를 숨기고 색 제거
            dayElement.classList.remove('selected');
            setSelectedDay(null);
            setMemo('');
            hideNote();
        } else {
            // 다른 날짜를 선택하면 색 추가하고 메모 보이기
            if (beforeDay) {
                beforeDay.classList.remove('selected');
            }

            setSelectedDay(dayElement);
            dayElement.classList.add('selected');
            showNote(dayElement.textContent);
        }
    };

    const hideNote = () => {
        const note = document.getElementById("note");
        note.style.display = "none";

        if (!selectedDay) {
            setCalendarPosition('center');
        }
    };

    const showNote = (day) => {
        const note = document.getElementById("note");
        const memoInput = document.getElementById("memo");

        const storedMemo = localStorage.getItem(`memo_${currentYear}_${currentMonth}_${day}`);
        setMemo(storedMemo || "");
        note.style.display = "block";

        setCalendarPosition('left'); // 수정된 부분
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

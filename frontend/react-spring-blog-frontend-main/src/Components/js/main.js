const calendar = document.getElementById("calendar");
const note = document.getElementById("note");
const memo = document.getElementById("memo");
const monthDisplay = document.getElementById("month-display");
const yearDisplay = document.getElementById("year-display");
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();
let selectedDay = -1;

// 이전 달로 이동
function prevMonth() {
    currentMonth = (currentMonth - 1 + 12) % 12;
    if (currentMonth === 11) currentYear--;
    updateCalendar();
}

// 다음 달로 이동
function nextMonth() {
    currentMonth = (currentMonth + 1) % 12;
    if (currentMonth === 0) currentYear++;
    updateCalendar();
}

// 달력 셀을 동적으로 생성
function updateCalendar() {
    while (calendar.firstChild) {
        calendar.removeChild(calendar.firstChild);
    }
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
    monthDisplay.textContent = `${currentMonth + 1}월`;
    yearDisplay.textContent = currentYear;
    for (let i = 1; i <= lastDate; i++) {
        const day = document.createElement("div");
        day.className = "day";
        day.textContent = i;
        day.addEventListener("click", () => showNote(i));
        calendar.appendChild(day);
    }
}

// 선택한 날짜의 메모를 표시
function showNote(day) {
    note.style.display = "block";
    selectedDay = day;
    memo.value = localStorage.getItem(`memo_${currentYear}_${currentMonth}_${day}`) || "";
}

// 메모 저장
function saveNote() {
    if (selectedDay !== -1) {
        const memoText = memo.value;
        localStorage.setItem(`memo_${currentYear}_${currentMonth}_${selectedDay}`, memoText);
        memo.value = "";
        note.style.display = "none";
    }
}

// 페이지 로드 시 달력 초기화
updateCalendar();

// 전화번호 숫자 이외의 문자 제거
function formatPhoneNumber() {
    var phoneNumberInput = document.getElementById('phoneNumberInput');
    var phoneNumber = phoneNumberInput.value.replace(/\D/g, '');
    var formattedPhoneNumber = '';

    if (phoneNumber.length >= 4) {
        formattedPhoneNumber += phoneNumber.substring(0, 3) + '-';
        if (phoneNumber.length >= 7) {
            formattedPhoneNumber += phoneNumber.substring(3, 7) + '-';
            formattedPhoneNumber += phoneNumber.substring(7);
        } else {
            formattedPhoneNumber += phoneNumber.substring(3);
        }
    } else {
        formattedPhoneNumber = phoneNumber;
    }

    phoneNumberInput.value = formattedPhoneNumber;
}

function validateForm() {
    var phoneNumberInput = document.getElementById('phoneNumberInput');
    var phoneNumber = phoneNumberInput.value.replace(/\D/g, '');

    if (!/^\d+$/.test(phoneNumber)) {
        alert('전화번호는 숫자로만 입력해주세요.');
        return false;
    }

    return true;
}

// 아이디 중복 확인
function checkID() {
    var userId = document.getElementById('userId').value;
    // TODO: 실제 데이터베이스를 확인하는 로직 구현
    alert("아이디 '" + userId + "'의 중복 여부를 검사합니다.");
}

document.getElementById('registrationForm').onsubmit = function (e) {
    e.preventDefault();
    // TODO: 모든 필드가 유효한 경우 서버로 폼 데이터 제출
    alert("등록 양식이 제출되었습니다!");
};

// 로그인 유효성 검사
function submit_check() {

    // 입력 폼 아이디값 담기
    var userId = document.getElementById("userId");
    var password = document.getElementById("password");

    if (userId.value === "") {
        alert("아이디를 입력하세요.");
        userId.focus();
        return false;
    } else if (password.value === "") {
        alert("비밀번호를 입력하세요.");
        password.focus();
        return false;
    }
    
    submit_check();
};

// 유효성 검증 모듈
const USER_DATA = [
    { email: 'codeit1@codeit.com', password: "codeit101!" },
    { email: 'codeit2@codeit.com', password: "codeit202!" },
    { email: 'codeit3@codeit.com', password: "codeit303!" },
    { email: 'codeit4@codeit.com', password: "codeit404!" },
    { email: 'codeit5@codeit.com', password: "codeit505!" },
    { email: 'codeit6@codeit.com', password: "codeit606!" },
];

// 이메일 형식 검증
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 비밀번호 길이 검증
function validatePassword(password) {
    return password.length >= 8;
}

// 이메일 존재 여부 확인
function checkEmailExists(email) {
    return USER_DATA.some(user => user.email === email);
}

// 로그인 검증
function validateLogin(email, password) {
    const user = USER_DATA.find(user => user.email === email);
    if (!user || user.password !== password) {
        return { success: false, message: '비밀번호가 일치하지 않습니다.' };
    }
    return { success: true };
}

// 에러 메시지 표시 함수
function showError(input, message) {
    // 기존 에러 메시지 제거
    clearError(input);
    
    // 입력 필드에 에러 스타일 적용
    input.classList.add('error');
    
    // 에러 메시지 엘리먼트 생성
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    // 입력 필드 바로 다음에 에러 메시지 삽입
    input.parentNode.insertBefore(errorElement, input.nextSibling);
}

// 에러 메시지 제거 함수
function clearError(input) {
    input.classList.remove('error');
    const errorMessage = input.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// 모든 에러 메시지 확인
function hasErrors(container) {
    return container.querySelectorAll('.error-message').length > 0;
}

// 모든 필드가 채워져 있는지 확인
function areFieldsFilled(fields) {
    return fields.every(field => field.value.trim() !== '');
}

// 버튼 상태 업데이트
function updateButtonState(button, isValid) {
    if (isValid) {
        button.classList.add('active');
        button.disabled = false;
    } else {
        button.classList.remove('active');
        button.disabled = true;
    }
}
// user dummy data
const USER_DATA = [
  { email: 'codeit1@codeit.com', password: "codeit101!" },
  { email: 'codeit2@codeit.com', password: "codeit202!" },
  { email: 'codeit3@codeit.com', password: "codeit303!" },
  { email: 'codeit4@codeit.com', password: "codeit404!" },
  { email: 'codeit5@codeit.com', password: "codeit505!" },
  { email: 'codeit6@codeit.com', password: "codeit606!" },
]

// form elements (supports login and signup pages)
const loginForm = document.querySelector('#login-form, #signup');
if (!loginForm) {
  (function(){ return; })();
}
const emailInput = loginForm.querySelector('#email-input');
const passwordInput = loginForm.querySelector('#password-input');
const passwordCheckInput = loginForm.querySelector('#password-confirm-input');
const nicknameInput = loginForm.querySelector('#nickname-input');
const submitButton = loginForm.querySelector('.submit-btn');
const isSignupPage = loginForm.id === "signup";


// email validation
const emailValidation = function(value) {
  const pattern = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+$/;
  if(!value){
    return { isValid: false, message: "이메일을 입력해주세요." };
  }
  if(!pattern.test(value)){
    return { isValid: false, message: "잘못된 이메일 형식입니다." };
  }
  return { isValid: true, message: "" };
}

// password validation
const passwordValidation = function(value, id) {
  if(!value){
    return { isValid: false, message: "비밀번호를 입력해주세요." };
  }
  if(value.length < 8){
    return { isValid: false, message: "비밀번호를 8자 이상 입력해주세요." };
  }
  if(id === "password-confirm-input"){
    const passwordValue = passwordInput.value;
    if(value !== passwordValue){
      return { isValid: false, message: "비밀번호가 일치하지 않습니다." };
    }
  }
  return { isValid: true, message: "" };
}

// submit 버튼 활성화를 위한 전체 검증
const loginBtnValidation = function() {
  const isEmailValid = emailValidation(emailInput.value).isValid;
  const isPasswordValid = passwordValidation(passwordInput.value, passwordInput.id).isValid;

  if (isSignupPage) {
    const isPasswordCheckValid = passwordValidation(passwordCheckInput.value, passwordCheckInput.id).isValid;
    const isNicknameValid = !!nicknameInput?.value;
    submitButton.disabled = !(isEmailValid && isPasswordValid && isPasswordCheckValid && isNicknameValid);
  } else {
    submitButton.disabled = !(isEmailValid && isPasswordValid);
  }
}

// 유효성 검증 결과 처리
const validationResultProcess = function(result, box) {
  const { isValid, message } = result;
  const container = box.closest('.login-input, .signup-input') || box.parentElement;
  const warningMessage = container.querySelector(".warning-message");

  box.classList.toggle("input-warning", !isValid);
  if(!warningMessage){
    if(!isValid){
      const newMessageElement = document.createElement("p");
      newMessageElement.classList.add("warning-message");
      newMessageElement.textContent = message;
      container.appendChild(newMessageElement);
    }
  }else{
    if(!isValid){
      warningMessage.textContent = message;
    }else{
      warningMessage.remove();
    }
  }
  loginBtnValidation();
}

// 로그인 및 회원가입 폼 유효성 검증
const loginFormValidation = function(event) {
  const inputTarget = event.target; 
  const inputValue = inputTarget.value;
  const inputType = inputTarget.type;
  const inputId = inputTarget.id;
  let validationResult;

  if (inputType === "email") {
    validationResult = emailValidation(inputValue);
  } else if (inputType === "password") {
    validationResult = passwordValidation(inputValue, inputId);
  } else {
    loginBtnValidation();
    return;
  }

  validationResultProcess(validationResult, inputTarget);
}

loginBtnValidation(); // 최초 진입 시 폼 기본 검증
emailInput.addEventListener("input", (event) => loginFormValidation(event));
passwordInput.addEventListener("input", (event) => loginFormValidation(event));
if (passwordCheckInput) passwordCheckInput.addEventListener("input", (event) => loginFormValidation(event));
if (nicknameInput) nicknameInput.addEventListener("input", (event) => loginFormValidation(event));
loginForm.addEventListener("focusout", (event) => loginFormValidation(event));


// 비밀번호 표시/숨김 토글 (아이콘 클릭)
const pwViewToggle = function(event) {
  const icon = event.currentTarget;
  const pwInput = icon.closest('.password-box')?.querySelector('input');
  if (!pwInput) return;
  if (pwInput.type === "password") {
    pwInput.type = "text";
    icon.alt = "비밀번호 표시 토글, 보임상태";
  } else {
    pwInput.type = "password";
    icon.alt = "비밀번호 표시 토글, 숨김상태";
  }
}

document.querySelectorAll('.eye-icon').forEach((icon) => {
  icon.addEventListener('click', (event) => {
    event.preventDefault();
    pwViewToggle(event);
  });
});

// 오류 메시지 모달 (접근성 및 키보드 지원 포함)
let lastFocusedElement = null;
let modalKeydownHandler = null;

const alertMessageBox = function(message) {
  if (document.querySelector(".alert-message-box")) return;

  lastFocusedElement = document.activeElement;

  const messageBox = document.createElement("div");
  messageBox.className = 'alert-message-box';
  messageBox.setAttribute('role', 'dialog');
  messageBox.setAttribute('aria-modal', 'true');

  const popup = document.createElement("div");
  popup.className = "message-popup";

  const popupText = document.createElement("p");
  popupText.className = "popup-text";
  popupText.id = "popup-text";
  popupText.textContent = message;

  const popupBtnWarp = document.createElement("div");
  popupBtnWarp.className = "popup-btn-warp";

  const popupBtn = document.createElement("button");
  popupBtn.id = "popup-btn";
  popupBtn.className = "s-btn";
  popupBtn.type = "button";
  popupBtn.textContent = "확인";

  popupBtnWarp.appendChild(popupBtn);
  popup.appendChild(popupText);
  popup.appendChild(popupBtnWarp);
  messageBox.appendChild(popup);

  document.body.appendChild(messageBox);

  // 포커스 이동 및 키보드 핸들러 등록
  popupBtn.focus();
  modalKeydownHandler = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMessageBox();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      closeMessageBox();
    }
  };
  document.addEventListener('keydown', modalKeydownHandler);

  // 바깥 영역 클릭 시 닫기
  messageBox.addEventListener('click', (e) => {
    if (e.target === messageBox) closeMessageBox();
  });
  popupBtn.addEventListener("click", () => closeMessageBox());
}

const closeMessageBox = function() {
  const messageBox = document.querySelector(".alert-message-box");
  if (messageBox) messageBox.remove();
  if (modalKeydownHandler) {
    document.removeEventListener('keydown', modalKeydownHandler);
    modalKeydownHandler = null;
  }
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
  lastFocusedElement = null;
}

//로그인 버튼 클릭 시 사용자 유무 확인
const loginUserExistens = function(email, password) {
  const user = USER_DATA.find(user => user.email === email);
  if (!(user && user.password === password)) {
    alertMessageBox("비밀번호가 일치하지 않습니다.");
    return;
  }
  location.href = "/items";
}

//회원가입 버튼 클릭 시 이메일 중복 여부 확인
const signUpUserExistens = function(email) {
  const isExist = USER_DATA.some(user => user.email === email);
  if (isExist) {
    alertMessageBox("사용 중인 이메일입니다.");
    return;
  }
  location.href = "/login";
}

//폼 sumit 버튼 클릭에 대한 이벤트 리스너
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (submitButton?.disabled) {
    return;
  }
  const formData = new FormData(event.target);
  const email = formData.get('email');
  const password = formData.get('password');
  if(isSignupPage){
    signUpUserExistens(email);
  }else{
    loginUserExistens(email, password);
  }
});
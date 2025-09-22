// 모달 관련 함수들

// 모달 생성 함수
function createModal(message) {
    // 기존 모달이 있으면 제거
    const existingModal = document.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    // 모달 HTML 생성
    const modalHTML = `
        <div class="modal-overlay">
            <div class="modal-container">
                <div class="modal-content">
                    <p class="modal-message">${message}</p>
                    <button class="modal-close-button">확인</button>
                </div>
            </div>
        </div>
    `;

    // 모달을 body에 추가
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 모달 요소들 선택
    const modalOverlay = document.querySelector('.modal-overlay');
    const closeButton = document.querySelector('.modal-close-button');

    // 모달 닫기 이벤트
    closeButton.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', handleEscKey);

    // 모달 표시
    modalOverlay.style.display = 'flex';
}

// 모달 닫기 함수
function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
    document.removeEventListener('keydown', handleEscKey);
}

// ESC 키 핸들러
function handleEscKey(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

// alert 대신 모달 표시
function showModal(message) {
    createModal(message);
}
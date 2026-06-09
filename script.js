// Элементы управления
const uploadSection = document.getElementById('uploadSection');
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const selectBtn = document.getElementById('selectBtn');
const previewBeforeAfter = document.getElementById('previewBeforeAfter');
const originalImage = document.getElementById('originalImage');
const resultImage = document.getElementById('resultImage');
const clearBtn = document.getElementById('clearBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Элементы информации о задачах
const tasksSection = document.getElementById('tasksSection');
const taskFilename = document.getElementById('taskFilename');
const taskSize = document.getElementById('taskSize');
const taskStatus = document.getElementById('taskStatus');
const taskProgress = document.getElementById('taskProgress');
const taskHash = document.getElementById('taskHash');

// Открытие диалога выбора файла при клике на кнопку
selectBtn.addEventListener('click', () => {
    fileInput.click();
});

// Открытие диалога выбора файла при клике на область
uploadArea.addEventListener('click', (e) => {
    if (e.target.id !== 'selectBtn') {
        fileInput.click();
    }
});

// Обработка выбора файла через диалог
fileInput.addEventListener('change', handleFileSelect);

// Drag & Drop события
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect();
    }
});

// Функция обработки выбора файла
function handleFileSelect() {
    const file = fileInput.files[0];
    
    if (file && file.type.startsWith('image/')) {
        // Читаем файл и создаем превью
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const imageData = e.target.result;
            originalImage.src = imageData;
            resultImage.src = imageData;
            
            // Обновляем информацию о задаче
            updateTaskInfo(file);
            
            // Показываем результат "до и после"
            previewBeforeAfter.classList.add('visible');
            
            // Добавляем анимацию появления
            previewBeforeAfter.style.animation = 'none';
            setTimeout(() => {
                previewBeforeAfter.style.animation = 'slideIn 0.4s ease';
            }, 10);
        };
        
        reader.readAsDataURL(file);
    } else {
        alert('Пожалуйста, выберите изображение');
        fileInput.value = '';
    }
}

// Функция обновления информации о задаче
function updateTaskInfo(file) {
    // Обновляем имя файла
    taskFilename.textContent = file.name;
    
    // Обновляем размер файла
    const sizeKB = (file.size / 1024).toFixed(2);
    taskSize.textContent = sizeKB + ' KB';
    
    // Обновляем статус
    taskStatus.textContent = 'done';
    
    // Генерируем хэш (упрощенный вариант)
    generateFileHash(file);
    
    // Симулируем прогресс
    updateProgress(100);
}

// Функция форматирования размера файла
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Функция генерации хэша файла
function generateFileHash(file) {
    // Упрощенный вариант хэша (в реальном приложении используйте криптографию)
    const reader = new FileReader();
    reader.onload = (e) => {
        const arr = new Uint8Array(e.target.result).subarray(0, 256);
        let hash = '';
        for (let i = 0; i < arr.length; i++) {
            hash += ('00' + arr[i].toString(16)).slice(-2);
        }
        taskHash.textContent = hash.substring(0, 12);
    };
    reader.readAsArrayBuffer(file.slice(0, 1024));
}

// Функция обновления прогресса
function updateProgress(value) {
    taskProgress.style.width = value + '%';
}

// Кнопка очистки
clearBtn.addEventListener('click', () => {
    originalImage.src = '';
    resultImage.src = '';
    fileInput.value = '';
    previewBeforeAfter.classList.remove('visible');
    
    // Сбрасываем информацию о задаче
    taskFilename.textContent = 'Нет файла';
    taskSize.textContent = '— KB';
    taskStatus.textContent = 'ожидание';
    taskHash.textContent = '—';
    taskProgress.style.width = '0%';
});

// Кнопка скачивания результата
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = resultImage.src;
    link.download = 'result.png';
    link.click();
});
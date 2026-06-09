// Элементы управления
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const selectBtn = document.getElementById('selectBtn');
const previewSection = document.getElementById('previewSection');
const previewImage = document.getElementById('previewImage');
const fileNameElement = document.getElementById('fileName');
const fileSizeElement = document.getElementById('fileSize');
const clearBtn = document.getElementById('clearBtn');

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
            previewImage.src = e.target.result;
            
            // Показываем секцию с превью
            previewSection.style.display = 'block';
            
            // Добавляем анимацию появления
            previewSection.style.animation = 'none';
            setTimeout(() => {
                previewSection.style.animation = 'fadeIn 0.5s ease';
            }, 10);
        };
        
        reader.readAsDataURL(file);
    } else {
        alert('Пожалуйста, выберите изображение');
        fileInput.value = '';
    }
}

// Функция форматирования размера файла
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Кнопка очистки
clearBtn.addEventListener('click', () => {
    previewImage.src = '';
    fileInput.value = '';
    previewSection.style.display = 'none';
});
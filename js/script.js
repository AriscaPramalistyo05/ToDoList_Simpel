// Konstanta untuk event custom render todo
const RENDER_EVENT = 'render-todo';

// Array untuk menyimpan semua todo
const todos = [];

// Event listener saat DOM sudah dimuat
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addTodo();
    });
});

/**
 * Fungsi untuk menambahkan todo baru
 * Mengambil nilai dari input form dan membuat objek todo baru
 */
function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;
    
    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
    todos.push(todoObject);
    
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

/**
 * Fungsi untuk menghasilkan ID unik berdasarkan timestamp
 * @returns {number} ID unik
 */
function generateId() {
    return +new Date();
}

/**
 * Fungsi untuk membuat objek todo
 * @param {number} id - ID todo
 * @param {string} task - Judul todo
 * @param {string} timestamp - Tanggal todo
 * @param {boolean} isCompleted - Status selesai todo
 * @returns {Object} Objek todo
 */
function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
        id,
        task,
        timestamp,
        isCompleted
    }
}

// Event listener untuk merender todo
document.addEventListener(RENDER_EVENT, function () {
    // Ambil container untuk todo yang belum selesai
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';

    // Ambil container untuk todo yang sudah selesai
    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';
    
    // Render semua todo ke container yang sesuai
    for (const todoItem of todos) {
        const todoElement = makeTodo(todoItem);
        if (!todoItem.isCompleted)
            uncompletedTODOList.append(todoElement);
        else
            completedTODOList.append(todoElement);
    }
});

/**
 * Fungsi untuk membuat elemen todo di browser
 * @param {Object} todoObject - Objek todo yang akan dirender
 * @returns {HTMLElement} Elemen todo
 */
function makeTodo(todoObject) {
    // Membuat elemen judul
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;
    
    // Membuat elemen tanggal
    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = todoObject.timestamp;
    
    // Membuat container untuk teks
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);
    
    // Membuat container utama todo
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);
    
    // Menambahkan tombol berdasarkan status todo
    if (todoObject.isCompleted) {
        // Tombol untuk todo yang sudah selesai
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(todoObject.id);
        });
        
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(todoObject.id);
        });
        
        container.append(undoButton, trashButton);
    } else {
        // Tombol untuk todo yang belum selesai
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.addEventListener('click', function () {
            addTaskToCompleted(todoObject.id);
        });
        
        container.append(checkButton);
    }
    
    return container;
}

/**
 * Fungsi untuk menandai todo sebagai selesai
 * @param {number} todoId - ID todo yang akan ditandai selesai
 */
function addTaskToCompleted(todoId) {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;
    
    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

/**
 * Fungsi untuk mencari todo berdasarkan ID
 * @param {number} todoId - ID todo yang dicari
 * @returns {Object|null} Objek todo yang ditemukan atau null
 */
function findTodo(todoId) {
    for (const todoItem of todos) {
        if (todoItem.id === todoId) {
            return todoItem;
        }
    }
    return null;
}

/**
 * Fungsi untuk mengembalikan todo yang sudah selesai menjadi belum selesai
 * @param {number} todoId - ID todo yang akan dikembalikan
 */
function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;
    
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

/**
 * Fungsi untuk menghapus todo dari daftar
 * @param {number} todoId - ID todo yang akan dihapus
 */
function removeTaskFromCompleted(todoId) {
    const todoIndex = findTodoIndex(todoId);
    if (todoIndex === -1) return;
    
    todos.splice(todoIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

/**
 * Fungsi untuk mencari index todo berdasarkan ID
 * @param {number} todoId - ID todo yang dicari
 * @returns {number} Index todo yang ditemukan atau -1
 */
function findTodoIndex(todoId) {
    for (const index in todos) {
        if (todos[index].id === todoId) {
            return index;
        }
    }
    return -1;
}

/**
 * Fungsi untuk menyimpan data todo ke localStorage
 */
function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(todos);
      localStorage.setItem(STORAGE_KEY, parsed);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }


  //fungsi untuk tracking perubahan data 
const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';
 
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

//fungsi untuk menampilkan data yang sudah disimpan
document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});




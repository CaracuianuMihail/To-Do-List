const addToDoInput = document.getElementById('toDoTitle');
const addToDoBtn = document.getElementById('addToDoBtn');
const toDoList = document.getElementById('toDoList');
const completeToDoList = document.getElementById('completeToDo');
const modal = document.querySelector('.editToDoWrapper');
const editBtn = document.getElementById('editToDoBtn');
const editToDoInput = document.getElementById('editToDoTitle');
const saveToFileBtn = document.getElementById('saveToFileBtn');

let list = [];

window.onload = function() {
    const storedList = localStorage.getItem('toDoList');
    if (storedList) {
        list = JSON.parse(storedList);
        renderList();
    }
};

function toggleModal(title){
    if(modal.classList.contains('openModal')){
       return modal.classList.remove('openModal');
    }
    editToDoInput.value = title;
    return modal.classList.add('openModal');
}

editBtn.addEventListener('click', toggleModal);

function changeItemStatus (item){
    const newList = list.map(element => {
        if(element.title === item.title){
            return {...element, done: !element.done}
        }
        return element;
    })
    list = [...newList];
    renderList();
    saveListToLocalStorage();
}

function removeItem(item) {
    list = list.filter(element => element.title !== item.title);
    renderList();
    saveListToLocalStorage();
}

const renderList = () => {
    toDoList.innerHTML = '';
    completeToDoList.innerHTML = '';
    list.forEach((item) =>{
        const li = document.createElement('li');
        const checkBox = document.createElement('input');
        const toDoTitle = document.createElement('p');
        const editIcon = document.createElement('img');
        const deleteIcon = document.createElement('img');
        const saveIcon = document.createElement('img');

        editIcon.src = './8666681_edit_icon.png';
        saveIcon.src = './8666778_download_down_save_icon.png';
        editIcon.classList.add('icon');
        saveIcon.classList.add('icon');
        editIcon.addEventListener('click', (e) => {
            e.stopPropagation(); 
            toggleModal(item.title); 
        });

        deleteIcon.src = './8664938_trash_can_delete_remove_icon.png';
        deleteIcon.classList.add('icon'); 
        deleteIcon.addEventListener('click', () => {
            removeItem(item);
        });

        toDoTitle.textContent = item.title;
        checkBox.type = 'checkbox';
        checkBox.checked = item.done;
        li.appendChild(checkBox);
        li.appendChild(toDoTitle);
        li.appendChild(editIcon);
        li.appendChild(deleteIcon); 
        li.classList.add('toDoItem');

        li.addEventListener('click', () => changeItemStatus(item));

        if(item.done){
            return completeToDoList.appendChild(li);
        }
        else {
            toDoList.appendChild(li);
        }
    })
}

const addToDo = () => {
    if(list.some(todo => todo.title === addToDoInput.value)) return alert('To-do title should be unique');
    if(addToDoInput.value === '') return alert('To-do title should not be empty');

    list.push({title: addToDoInput.value, done: false});
    addToDoInput.value = '';

    renderList();
    saveListToLocalStorage();
}

addToDoBtn.addEventListener('click', addToDo);

editBtn.addEventListener('click', () => {
    const editedTitle = editToDoInput.value.trim(); 
    if (editedTitle === '') return alert('To-do title should not be empty');
    
    const selectedItemIndex = list.findIndex(item => item.title === editedTitle);
    if (selectedItemIndex !== -1) {
        list[selectedItemIndex].title = editedTitle; 
        toggleModal();
        renderList();
        modal.classList.remove('openModal');
        saveListToLocalStorage(); 
    }
    
});

function saveListToLocalStorage() {
    localStorage.setItem('toDoList', JSON.stringify(list));
}
function saveListToTextFile() {
    const formattedList = list.map(item => item.title + (item.done ? " (Completed)" : "")).join("\n");
    const blob = new Blob([formattedList], { type: "text/plain;charset=utf-8" });
    saveAs(blob, "todo_list.txt");
}

    addToDoBtn.addEventListener('click', addToDo);
    editBtn.addEventListener('click', toggleModal);
    saveToFileBtn.addEventListener('click', saveListToTextFile);

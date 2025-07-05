const input = document.getElementById("todo-input");
const item = document.getElementById("todoList");
const button1 = document.getElementById("All");
const button2 = document.getElementById("Active");
const button3 = document.getElementById("Completed");
const button4 = document.getElementById("clear-completed");
const button5 = document.getElementById("checked");
const footer = document.getElementById("footer");
let AllChecked = false;

const getCurrentFilter = () => {
    if (button1.classList.contains("selected")) return "all";
    if (button2.classList.contains("selected")) return "active";
    if (button3.classList.contains("selected")) return "completed";
    return "all";
};


const editMode = () => {
    const editing = document.querySelector(".edit-input");
    if (editing) {
        const li = editing.closest("li");
        const textSpan = document.createElement("span");
        textSpan.className = "todo-text";
        textSpan.innerText = editing.value;
        textSpan.addEventListener("dblclick", () => editText(li, textSpan));
        li.replaceChild(textSpan, editing);

        li.querySelector(".cancel").style.display = "inline";
        li.querySelector(".checkbox").style.display = "inline";
    }
};

const updateLi = () => {
    const filter = getCurrentFilter();
    document.querySelectorAll("#todoList li").forEach(li => {
        const checkbox = li.querySelector(".checkbox");
        li.classList.remove("hidden");

        if (filter === "active" && checkbox.checked) li.classList.add("hidden");
        if (filter === "completed" && !checkbox.checked) li.classList.add("hidden");
    });
};

const addTodoItem = () => {
    const textVal = input.value.trim();
    if (!textVal) return false;

    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    // editMode();
    const text = document.createElement("span");
    text.className = "todo-text";
    text.innerText = textVal;
    text.addEventListener("dblclick", () => editText(li, text));

    const cancel = document.createElement("button");
    cancel.type = "button";
    cancel.className = "cancel";
    cancel.innerText = "✖";
    cancel.addEventListener("click", () => {
        li.remove();
        leftcount();
        // updateLi();
    });
      input.addEventListener("click", () => {
       editMode();
    });

    checkbox.addEventListener("change", () => {
        text.style.textDecoration = checkbox.checked ? "line-through" : "none";
        leftcount();
        allChecked();
        updateLi();
        editMode();
    });

    li.append(checkbox, text, cancel);
      item.prepend(li);


    footer.style.display = "flex";
    input.value = "";

    leftcount();
    allChecked();
    updateLi();

    return true;
};

const body = () => {
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            addTodoItem();
        }
    });
 button1.style.border = "3px solid #b83f45";
updateLi();
checked();

};
const filterButtons = (filterType) => {
    editMode();

    const listItems = document.querySelectorAll("#todoList li");
    const buttons = { all: button1, active: button2, completed: button3 };

    Object.values(buttons).forEach(btn => {
        btn.classList.remove("selected");
        btn.style.border = "none";
    });

    if (filterType === "clear-completed") {
        listItems.forEach(li => {
            const checkbox = li.querySelector("input[type='checkbox']");
            if (checkbox.checked) li.remove();
        });
    } else {
        buttons[filterType].classList.add("selected");
        buttons[filterType].style.border = "3px solid #b83f45";
    }

    updateLi();
    leftcount();
};

const editText = (li, text) => {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = text.innerText;
    editInput.className = "edit-input";
    li.replaceChild(editInput, text);
    editInput.focus();

    li.querySelector(".cancel").style.display = "none";
    li.querySelector(".checkbox").style.display = "none";

    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            text.innerText = editInput.value;
            li.replaceChild(text, editInput);
            li.querySelector(".cancel").style.display = "inline";
            li.querySelector(".checkbox").style.display = "inline";
        }
    });
};

const leftcount = () => {
    const allItems = document.querySelectorAll("#todoList li");
    const remaining = [...allItems].filter(li => !li.querySelector(".checkbox").checked).length;

    document.getElementById("todo-count").innerText = `${remaining} item Left`;
    button4.style.display = allItems.length > remaining ? "inline-block" : "none";
    button5.style.display = allItems.length > 0 ? "inline-block" : "none";
    footer.style.display = allItems.length > 0 ? "flex" : "none";
};

const checked = () => {
    button5.addEventListener("click", () => {
        editMode();
        // addTodoItem();
        document.querySelectorAll("#todoList li").forEach(li => {
            const checkbox = li.querySelector(".checkbox");
            const text = li.querySelector(".todo-text");
            checkbox.checked = !AllChecked;
            text.style.textDecoration = checkbox.checked ? "line-through" : "none";
        });

        AllChecked = !AllChecked;
        allChecked();
        leftcount();
        updateLi();
       
    });
};

const allChecked = () => {
    const checkboxes = document.querySelectorAll("#todoList .checkbox");
    const allChecked = [...checkboxes].every(cb => cb.checked);
    AllChecked = allChecked;
    //  button5.style.border = allChecked ? "2px solid #b83f45" : "2px solid rgb(72, 72, 72)";
    button5.style.color = allChecked ? " #b83f45" : " rgb(72, 72, 72)";

};


body();
button1.addEventListener("click", () => filterButtons("all"));
button2.addEventListener("click", () => filterButtons("active"));
button3.addEventListener("click", () => filterButtons("completed"));
button4.addEventListener("click", () => filterButtons("clear-completed"));
// checked();

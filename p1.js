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
    if (button1.style.border === "4px solid black") return "all";
    if (button2.style.border === "4px solid black") return "active";
    if (button3.style.border === "4px solid black") return "completed";
    return "all";
};

const exitEditModeIfActive = () => {
    const editing = document.querySelector(".edit-input");
    if (editing) {
        const li = editing.closest("li");
        const textSpan = document.createElement("span");
        textSpan.className = "todo-text";
        textSpan.innerText = editing.value;
        textSpan.addEventListener("dblclick", () => editText(li, textSpan));
        li.replaceChild(textSpan, editing);

        const cancel = li.querySelector(".cancel");
        const checkbox = li.querySelector(".checkbox");
        if (cancel) cancel.style.display = "inline";
        if (checkbox) checkbox.style.display = "inline";
    }
};

const body = () => {
    input.addEventListener("keydown", (event) => {
        let ans;
        if (event.key === "Enter" && (ans = input.value.trim())) {
            const li = document.createElement("li");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "checkbox";

            const text = document.createElement("span");
            text.className = "todo-text";
            text.innerText = ans;

            text.addEventListener("dblclick", () => editText(li, text));
            checkbox.addEventListener("change", () => {
                text.style.textDecoration = checkbox.checked ? "line-through" : "none";
                leftcount();
            });

            const cancel = document.createElement("button");
            cancel.type = "button";
            cancel.className = "cancel";
            cancel.innerText = "✖";
            cancel.addEventListener("click", () => {
                li.remove();
                leftcount();
            });

            li.append(checkbox, text, cancel);
            item.appendChild(li);
            CheckboxColor();
            footer.style.display = "flex";
            leftcount();
            input.value = "";

            filterButtons(getCurrentFilter());
        }
    });
};

const filterButtons = (filterType) => {
    exitEditModeIfActive();

    const listItems = document.querySelectorAll("#todoList li");
    const buttons = { all: button1, active: button2, completed: button3 };
    Object.values(buttons).forEach(btn => btn.style.border = "none");

    listItems.forEach(li => {
        const checkbox = li.querySelector("input[type='checkbox']");
        switch (filterType) {
            case "all":
                li.classList.remove("hidden");
                buttons.all.style.border = "4px solid black";
                break;
            case "active":
                li.classList.toggle("hidden", checkbox.checked);
                buttons.active.style.border = "4px solid black";
                break;
            case "completed":
                li.classList.toggle("hidden", !checkbox.checked);
                buttons.completed.style.border = "4px solid black";
                break;
            case "clear-completed":
                if (checkbox.checked) li.remove();
                break;
        }
    });
    leftcount();
};

const editText = (li, text) => {
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.value = text.innerText;
    editInput.className = "edit-input";
    li.replaceChild(editInput, text);
    editInput.focus();

    const cancel = li.querySelector(".cancel");
    const checkbox = li.querySelector(".checkbox");
    if (cancel) cancel.style.display = "none";
    if (checkbox) checkbox.style.display = "none";

    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            text.innerText = editInput.value;
            li.replaceChild(text, editInput);
            if (checkbox) checkbox.style.display = "inline";
            if (cancel) cancel.style.display = "inline";
        }
    });
};

const leftcount = () => {
    const allItems = document.querySelectorAll("#todoList li");
    let count = 0, Checked = false;
    allItems.forEach(li => {
        const checkbox = li.querySelector("input[type='checkbox']");
        if (checkbox.checked) Checked = true;
        else count++;
    });

    document.getElementById("todo-count").innerHTML = count + " item Left";
    button4.style.display = Checked ? "inline-block" : "none";
    button5.style.display = allItems.length > 0 ? "inline-block" : "none";
    footer.style.display = allItems.length > 0 ? "flex" : "none";
};

const checked = () => {
    button5.addEventListener("click", () => {
        exitEditModeIfActive();

        document.querySelectorAll("#todoList li").forEach(li => {
            const text = li.querySelector(".todo-text");
            const checkbox = li.querySelector("input[type='checkbox']");
            if (checkbox) {
                checkbox.checked = !AllChecked;
                text.style.textDecoration = checkbox.checked ? "line-through" : "none";
            }
        });

        AllChecked = !AllChecked;
button5.classList.remove("checked-default", "checked-active");
button5.classList.add(AllChecked ? "checked-active" : "checked-default");
        leftcount();

        const currentFilter = getCurrentFilter();
        document.querySelectorAll("#todoList li").forEach(li => {
            const checkbox = li.querySelector("input[type='checkbox']");
            if (currentFilter === "active") {
                li.classList.toggle("hidden", checkbox.checked);
            } else if (currentFilter === "completed") {
                li.classList.toggle("hidden", !checkbox.checked);
            } else {
                li.classList.remove("hidden");
            }
        });
    });
};

const CheckboxColor = () => {
    const checkboxes = document.querySelectorAll("#todoList input[type='checkbox']");
    checkboxes.forEach(cb => {
        cb.addEventListener("change", () => {
            const checkall = [...checkboxes].every(c => c.checked);
            AllChecked = checkall;
button5.classList.remove("checked-default", "checked-active");
button5.classList.add(checkall ? "checked-active" : "checked-default");

            const currentFilter = getCurrentFilter();
            document.querySelectorAll("#todoList li").forEach(li => {
                const checkbox = li.querySelector("input[type='checkbox']");
                if (currentFilter === "active") {
                    li.classList.toggle("hidden", checkbox.checked);
                } else if (currentFilter === "completed") {
                    li.classList.toggle("hidden", !checkbox.checked);
                } else {
                    li.classList.remove("hidden");
                }
            });

            leftcount();
        });
    });
};

body();
button1.addEventListener("click", () => filterButtons("all"));
button2.addEventListener("click", () => filterButtons("active"));
button3.addEventListener("click", () => filterButtons("completed"));
button4.addEventListener("click", () => filterButtons("clear-completed"));
checked();

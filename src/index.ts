import { v4 as uuidV4 } from "uuid";

// console.log("Hello World!!");
// console.log(uuidV4());

//custom Type
type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
};

const list = document.querySelector<HTMLUListElement>("#list");
const form = document.getElementById("new-task-form") as HTMLFormElement | null;
const input = document.querySelector<HTMLInputElement>("#new-task-title");

//save tasks in local storage
//Task[] = [] => An array of type "Task" set to an empty array
const tasks: Task[] = loadTasks();

tasks.forEach(addListItem);

//?. optional chaining to check if value is null -> returns undefined instead of causing an error
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  //const input: HTMLElement || null
  //return (undefined) and break out of function if input.value is empty string or null
  if (input?.value == "" || input?.value == null) return;

  //otherwise return input.value!!
  //Typescript understands that if we make it to this line, input.value will not be null
  // so you don't need the optional chaining check anymore!
  //const input: HTMLElement
  //declare uuid types by installing its types (because uuid comes in javascript), any -> string
  const newTask: Task = {
    id: uuidV4(),
    title: input.value,
    completed: false,
    createdAt: new Date(),
  };
  tasks.push(newTask);
  saveTasks();
  //   input.value;
  addListItem(newTask);
  input.value = "";
});

//if "strict": true, is turned on, TS throws error (implicitly has 'any' type) if task type isn't declared
function addListItem(task: Task) {
  //TS knows this item is an HTMLLiElement because we passed in "li"
  const item = document.createElement("li");
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.addEventListener("change", () => {
    task.completed = checkbox.checked;
    // console.log(tasks);
    saveTasks();
  });
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  //add checkbox and task title to the "end" of label
  label.append(checkbox, task.title);
  item.append(label);
  //TS will add the optional chaining so you don't get unexpected errors
  list?.append(item);
  //no returns
}

function saveTasks() {
  localStorage.setItem("TASKS", JSON.stringify(tasks));
}

function loadTasks(): Task[] {
  const taskJSON = localStorage.getItem("TASKS");
  if (taskJSON == null) return [];
  //else
  return JSON.parse(taskJSON);
}

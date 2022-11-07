import {
  invalidateChars,
  clearElements,
  clearInputs,
  validateForm,
  setDataToLocaleStorage,
} from "./services.js";
import { Edit } from "./edit.js";
import { Confirm } from "./confirm.js";
import { Message } from "./message.js";

const balance = document.querySelector(".balance");
const income = document.querySelector(".income");
const expense = document.querySelector(".expense");
const allList = document.querySelector("#all ul");
const clearAll = document.querySelector(".clearAll");

// filter code starts here;

const filterFeed = document.querySelector("#filter-list");

function onFilterChange(e) {
  filterFeed.value = e.target.value;
  updateLists();
}

filterFeed.addEventListener("change", onFilterChange);

// filter code ends here

let data = {
  incomeTotal: 0,
  expenseTotal: 0,
  list: [],
};

// new code starts here

const formContainer = document.querySelector(".form-container");
const formToggle = document.querySelector(".form-toggle");
const form = document.querySelector("#entry-form");
const titleInput = document.querySelector("#entry-title");
const amountInput = document.querySelector("#entry-amount");
const categoryButtons = document.querySelector(".categories .buttons");

function onAddElement(e) {
  e.preventDefault();
  const type = document.querySelector(".active-category").dataset.category;
  const title = titleInput.value;
  const amount = +Number(amountInput.value).toFixed(2);

  if (!validateForm(title, amount)) {
    console.log("Cannot do it baby");
    return;
  }

  if (type === "income") {
    data.incomeTotal += amount;
  } else if (type === "expense") {
    data.expenseTotal += amount;
  }

  data.list.push({
    type,
    title,
    amount,
    date: Date.now(),
  });

  clearInputs([titleInput, amountInput]);
  setDataToLocaleStorage(data);
  updateDOM();
  Message.open({
    message: "Element successfully added",
    displayDuration: 3000,
    classList: "bg-success",
  });
}

function openEntryForm() {
  formToggle.classList.add("hide");
  formContainer.classList.remove("hide");
}

function onCloseEntryForm(e) {
  if (
    e.target.classList.contains("close-entry-form") ||
    e.target === formContainer
  ) {
    formContainer.classList.add("hide");
    formToggle.classList.remove("hide");
  }
}

function toggleEntryCategories(e) {
  const currentActive = categoryButtons.querySelector(".active-category");
  currentActive.classList.remove("active-category");
  e.target.classList.add("active-category");
}

categoryButtons.addEventListener("click", toggleEntryCategories);
formContainer.addEventListener("click", onCloseEntryForm);
formToggle.addEventListener("click", openEntryForm);
form.addEventListener("submit", onAddElement);

function updateLists() {
  let displayElements = [];

  clearElements([allList]);

  if (filterFeed.value === "all") {
    displayElements = [...data.list];
  } else {
    displayElements = data.list.filter(
      (item) => item.type === filterFeed.value
    );
  }
  displayElements.forEach((item, index) => {
    addEntry(allList, index, item.title, item.amount);
  });
}

function updateDOM() {
  income.innerHTML = `$${data.incomeTotal}`;
  expense.innerHTML = `$${data.expenseTotal}`;
  balance.innerHTML = `$${data.incomeTotal - data.expenseTotal}`;

  updateLists();
  updateChart(data.incomeTotal, data.expenseTotal);
}

function addEntry(list, index, title, amount) {
  const elem = `
    <li id=${index}>
      <div class="list">
        <div class="entry">${title}: ${amount.toFixed(2)}</div>
        <div class="list-settings">
          <button class="btn btn-sm text-alert edit" data-index=${index}></button>
          <button class="btn btn-sm delete" data-id=${index}></button>
        </div>
      </div>
    </li>
  `;

  list.insertAdjacentHTML("afterbegin", elem);
}

function onDelete(data, index) {
  const [deletedElement] = data.list.splice(index, 1);
  if (deletedElement.type === "income") {
    data.incomeTotal -= deletedElement.amount;
  } else {
    data.expenseTotal -= deletedElement.amount;
  }

  setDataToLocaleStorage(data);
  updateDOM();
  Message.open({
    message: "Element was deleted successfully",
    displayDuration: 3000,
    classList: "bg-success",
  });
}

function onEdit(id, title, amount, initialAmount) {
  const element = data.list[id];
  element.title = title;
  element.amount = amount;
  if (element.type === "income") {
    data.incomeTotal += amount - initialAmount;
  } else if ((element.type = "expense")) {
    data.expenseTotal += amount - initialAmount;
  }
  data.list[id] = element;
  setDataToLocaleStorage(data);
  updateDOM();
  Message.open({
    message: "Element was edited successfully",
    displayDuration: 3000,
    classList: "bg-success",
  });
}

amountInput.addEventListener("keypress", invalidateChars);
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("budget-data")) {
    data = JSON.parse(localStorage.getItem("budget-data"));
  }
  updateDOM();
});

allList.addEventListener("click", function (e) {
  if (e.target) {
    if (e.target.classList.contains("edit")) {
      Edit.open({
        title: data.list[e.target.dataset.index].title,
        amount: data.list[e.target.dataset.index].amount,
        target: e.target.parentElement.parentElement.parentElement,
        onSave: onEdit,
      });
    } else if (e.target.classList.contains("delete")) {
      Confirm.open({
        title: `Are you sure you want to delete ${
          data.list[e.target.dataset.id].title
        }?`,
        message: "After deleting, you will not be able to restore the data!",
        okMessage: "Yes",
        cancelMessage: "Cancel",
        index: e.target.dataset.id,
        onOk: () => onDelete(data, e.target.dataset.id),
      });
    }
  }
});

clearAll.addEventListener("click", function () {
  Confirm.open({
    title: "Are you sure you want to remove everything?",
    message: "After deleting you will not be able to restore the data!",
    okMessage: "Yes, delete",
    cancelMessage: "Cancel",
    onOk: () => {
      localStorage.clear();
      data = {
        incomeTotal: 0,
        expenseTotal: 0,
        list: [],
      };
      updateDOM();
      Message.open({
        message: "All data was removed successfully",
        displayDuration: 3000,
        classList: "bg-success",
      });
    },
  });
});

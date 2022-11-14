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
  const tmpData = { ...data };
  const type = document.querySelector(".active-category").dataset.category;
  const title = titleInput.value;
  let amount = amountInput.value;

  if (!validateForm(title, amount)) {
    Message.open({
      message: "Title and amount fields must not be empty",
      displayDuration: 3000,
      classList: "bg-danger",
    });
    return;
  }

  if (type === "income") {
    tmpData.incomeTotal += parseFloat(Number(amount).toFixed(2));
  } else if (type === "expense") {
    tmpData.expenseTotal += parseFloat(Number(amount).toFixed(2));
  }

  tmpData.list.push({
    beingEdited: false,
    type,
    title,
    amount,
    date: Date.now(),
  });

  data = { ...tmpData };

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
    addEntry(allList, index, item.title, item.amount, item.type);
  });
}

function updateDOM() {
  income.innerHTML = `$${data.incomeTotal}`;
  expense.innerHTML = `$${data.expenseTotal}`;
  balance.innerHTML = `$${parseFloat(data.incomeTotal - data.expenseTotal)}`;

  updateLists();
  updateChart(data.incomeTotal, data.expenseTotal);
}

function addEntry(list, index, title, amount, type) {
  const elem = `
    <li id=${index} class=${type}-entry>
      <div class="list">
        <div class="entry">${title}: ${amount}</div>
        <div class="list-settings">
          <button class="btn btn-sm text-alert edit" data-index=${index}></button>
          <button class="btn btn-sm delete" data-id=${index}></button>
        </div>
      </div>
    </li>
  `;

  list.insertAdjacentHTML("afterbegin", elem);
}

function onDelete(index) {
  const tmpData = { ...data };
  const [deletedElement] = tmpData.list.splice(index, 1);
  if (deletedElement.type === "income") {
    tmpData.incomeTotal -= deletedElement.amount;
  } else {
    tmpData.expenseTotal -= deletedElement.amount;
  }
  tmpData.incomeTotal = parseFloat(tmpData.incomeTotal.toFixed(2));
  tmpData.expenseTotal = parseFloat(tmpData.expenseTotal.toFixed(2));

  console.log(tmpData === data, data);
  data = { ...tmpData };
  console.log(tmpData === data, data);

  setDataToLocaleStorage(data);
  updateDOM();
  Message.open({
    message: "Element was deleted successfully",
    displayDuration: 3000,
    classList: "bg-success",
  });
}

function onEdit(id, title, amount, initialAmount) {
  const tmpData = { ...data };
  const element = tmpData.list[id];
  element.title = title;
  element.amount = parseFloat(amount.toFixed(2));
  let result;
  if (element.type === "income") {
    result = tmpData.incomeTotal + amount - initialAmount;
    tmpData.incomeTotal = parseFloat(result.toFixed(2));
  } else if ((element.type = "expense")) {
    result = tmpData.expenseTotal + amount - initialAmount;
    tmpData.expenseTotal = parseFloat(result.toFixed(2));
  }
  element.beingEdited = false;
  tmpData.list[id] = element;
  data = { ...tmpData };
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
      const elem = data.list[e.target.dataset.index];
      if (elem.beingEdited) return;
      data.list[e.target.dataset.index].beingEdited = true;
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
        onOk: () => onDelete(e.target.dataset.id),
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

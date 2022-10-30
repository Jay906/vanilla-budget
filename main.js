import {
  invalidateChars,
  clearElements,
  clearInputs,
  validateForm,
  setDataToLocaleStorage,
} from "./services.js";
import { Edit } from "./edit.js";
import { Confirm } from "./confirm.js";

const balance = document.querySelector(".balance");
const income = document.querySelector(".income");
const expense = document.querySelector(".expense");
const incomeBtn = document.querySelector("#income-btn");
const expenseBtn = document.querySelector("#expense-btn");
const allBtn = document.querySelector("#all-btn");
const incomeContainer = document.querySelector("#income");
const incomeList = document.querySelector("#income ul");
const incomeForm = document.querySelector("#income-form");
const incomeTitle = document.querySelector("#income-title");
const incomeAmount = document.querySelector("#income-amount");
const expenseContainer = document.querySelector("#expense");
const expenseList = document.querySelector("#expense ul");
const expenseForm = document.querySelector("#expense-form");
const expenseTitle = document.querySelector("#expense-title");
const expenseAmount = document.querySelector("#expense-amount");
const allContainer = document.querySelector("#all");
const allList = document.querySelector("#all ul");

let data = {
  incomeTotal: 0,
  expenseTotal: 0,
  list: [],
};

function onToggle(elem) {
  document.querySelector(".lists .show").classList.remove("show");
  document.querySelector(".toggle .active").classList.remove("active");
  this.classList.add("active");
  elem.classList.add("show");
}

function onAddElement(e) {
  e.preventDefault();

  let amount, title, type;

  if (e.target.id === "income-form") {
    title = incomeTitle.value;
    amount = +Number(incomeAmount.value).toFixed(2);
    data.incomeTotal += amount;
    type = "income";
  } else {
    title = expenseTitle.value;
    amount = +Number(expenseAmount.value).toFixed(2);
    amount = +amount;
    data.expenseTotal += amount;
    type = "expense";
  }
  if (!validateForm(title, amount)) {
    console.log("Cannot do it baby");
    return;
  }

  data.list.push({
    type,
    title,
    amount,
    date: Date.now(),
  });

  setDataToLocaleStorage(data);
  updateDOM();
}

function updateDOM() {
  clearElements([incomeList, expenseList, allList]);

  data.list.forEach((item, index) => {
    if (item.type === "income") {
      addEntry(incomeList, index, item.amount, item.title);
      clearInputs([incomeTitle, incomeAmount]);
    } else if (item.type === "expense") {
      addEntry(expenseList, index, item.amount, item.title);
      clearInputs([expenseTitle, expenseAmount]);
    }

    addEntry(allList, index, item.amount, item.title);
  });

  income.innerHTML = `$${data.incomeTotal}`;
  expense.innerHTML = `$${data.expenseTotal}`;
  balance.innerHTML = `$${data.incomeTotal - data.expenseTotal}`;

  updateChart(data.incomeTotal, data.expenseTotal);
}

function addEntry(list, index, amount, title) {
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
}

function onEdit(id, title, amount, initialAmount) {
  const element = data.list[id];
  element.title = title;
  element.amount = amount;
  if (element.type === "income") {
    data.incomeTotal += amount - initialAmount;
  } else if ((element.type = "expense")) {
    data.expenseTotal += amount - intitalAmount;
  }
  data.list[id] = element;
  setDataToLocaleStorage(data);
  updateDOM();
}

// function onEdit(elem) {
//   const index = elem.dataset.index;
//   const targetElement = elem.parentElement.parentElement;
//   targetElement.style.display = "none";
//   const obj = data.list[index];

//   const { title, amount, type } = obj;

//   if (type === "income") {
//     incomeTitle.value = title;
//     incomeAmount.value = amount;
//     incomeTitle.focus();
//   } else {
//     expenseTitle.value = title;
//     expenseAmount.value = amount;
//     expenseTitle.focus();
//   }

//   [incomeForm, expenseForm].forEach((item) =>
//     item.removeEventListener("submit", onAddElement)
//   );

//   [incomeForm, expenseForm].forEach((elem) =>
//     elem.addEventListener("submit", (e) => onEditSubmit(e, { index, obj }))
//   );
// }

// function onEditSubmit(e, props) {
//   e.preventDefault();

//   let title, amount;

//   if (e.target.id === "income-form") {
//     title = incomeTitle.value;
//     amount = +Number(incomeAmount.value).toFixed(2);
//   } else {
//     title = expense.value;
//     amount = +Number(expense.value).toFixed(2);
//   }

//   if (!validateForm(title, amount)) {
//     console.log("Cannot do it baby");
//     return;
//   }

//   const { index, obj } = props;

//   const newObj = Object.assign({}, obj, { title, amount });

//   data.list.splice(index, 1, newObj);

//   console.log(data);
//   setDataToLocaleStorage(data);
//   updateDOM();

//   [incomeForm, expenseForm].forEach((item) =>
//     item.removeEventListener("submit", onEditSubmit)
//   );

//   [incomeForm, expenseForm].forEach((elem) =>
//     elem.addEventListener("submit", onAddElement)
//   );
// }

incomeBtn.addEventListener("click", () =>
  onToggle.call(incomeBtn, incomeContainer)
);
expenseBtn.addEventListener("click", () =>
  onToggle.call(expenseBtn, expenseContainer)
);
allBtn.addEventListener("click", () => onToggle.call(allBtn, allContainer));
incomeAmount.addEventListener("keypress", invalidateChars);
expenseAmount.addEventListener("keypress", invalidateChars);
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("budget-data")) {
    data = JSON.parse(localStorage.getItem("budget-data"));
  }
  updateDOM();
});

[incomeForm, expenseForm].forEach((elem) =>
  elem.addEventListener("submit", onAddElement)
);

[incomeList, expenseList, allList].forEach((item) => {
  item.addEventListener("click", function (e) {
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
});

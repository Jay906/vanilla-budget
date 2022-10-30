import { invalidateChars, validateForm } from "./services.js";

export const Edit = {
  open(options) {
    options = Object.assign(
      {},
      {
        title: "",
        amount: "",
        target: "",
        onSave: function () {},
      },
      options
    );

    const template = document.createElement("template");
    const html = `
      <div class="edit-inputs">
        <div class="inputs">
          <input type="text" autocomplete="off"/>
          <input type="number" step="0.01" autocomplete="off"/>
        </div>
        <div>
          <button class="btn-sm btn-primary">Save</button>
        </div>
      </div>
    `;

    template.innerHTML = html;

    const editContainer = template.content.querySelector(".edit-inputs");
    const titleInput = template.content.querySelector("input[type=text]");
    const amountInput = template.content.querySelector("input[type=number]");
    const button = template.content.querySelector("button");
    titleInput.value = options.title;
    amountInput.value = options.amount;

    amountInput.addEventListener("keypress", invalidateChars);

    button.addEventListener("click", () => {
      const title = titleInput.value;
      const amount = amountInput.value;
      if (!validateForm(title, amount)) return false;
      options.onSave(
        options.target.id,
        titleInput.value,
        +amountInput.value,
        options.amount
      );
      this.close(editContainer);
    });

    options.target.appendChild(template.content);
    titleInput.focus();
  },

  close(elem) {
    elem.parentElement.removeChild(elem);
  },
};

/*
  What do we need in edit button?

  options:
    element being edited
    title of the element
    amount of the element
    onSave: function that gets executed on save
    onCancel
*/

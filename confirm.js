export const Confirm = {
  open(options) {
    options = Object.assign(
      {},
      {
        title: "Are you sure you want to delete",
        message: "You will not be able to restore deleted data",
        okMessage: "OK",
        cancelMessage: "Cancel",
        onOk: function () {},
        onCancel: function () {},
      },
      options
    );

    const template = document.createElement("template");

    const html = `
      <div class="confirm">
        <div class="confirm-body">
          <div class="confirm-header">
            <p>${options.title}</p>
            <button class="confirm-close">&times;</button>
          </div>
          <div class="confirm-content">
            ${options.message}
          </div>
          <div class="confirm-buttons">
            <button class="btn btn-primary confirm-ok-button">${options.okMessage}</button>
            <button class="btn confirm-cancel-button">${options.cancelMessage}</button>
          </div>
        </div>
      </div>
    `;

    template.innerHTML = html;

    // Choose necessary elements

    const confirmElem = template.content.querySelector(".confirm");
    const confirmClose = template.content.querySelector(".confirm-close");
    const okBtn = template.content.querySelector(".confirm-ok-button");
    const cancelBtn = template.content.querySelector(".confirm-cancel-button");

    confirmElem.addEventListener("click", (e) => {
      if (e.target === confirmElem) {
        options.onCancel();
        this._close(confirmElem);
      }
    });

    okBtn.addEventListener("click", () => {
      options.onOk();
      this._close(confirmElem);
    });

    [confirmClose, cancelBtn].forEach((el) =>
      el.addEventListener("click", () => {
        options.onCancel();
        this._close(confirmElem);
      })
    );

    // Append template tag to the doc body
    document.body.appendChild(template.content);
  },

  _close(elem) {
    document.body.removeChild(elem);
  },
};

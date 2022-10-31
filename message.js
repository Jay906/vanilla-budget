export const Message = {
  open(props) {
    props = Object.assign(
      {},
      {
        message: "You can do whatever you put your mind to",
        displayDuration: 3000,
        classList: "bg-danger",
      },
      props
    );

    const template = document.createElement("template");

    const html = `
      <article class="message">
        <div class="message-container ${props.classList}">
          <p>${props.message}</p>
          <button class="close">&times;</button>
        </div>
      </article>
    `;

    template.innerHTML = html;

    const container = template.content.querySelector("article");
    const closeButton = template.content.querySelector("button.close");

    closeButton.addEventListener("click", () => {
      this.close(container);
    });

    document.body.appendChild(template.content);

    setTimeout(() => {
      if (document.body.contains(container)) {
        this.close(container);
      }
    }, props.displayDuration);
  },

  close(elem) {
    document.body.removeChild(elem);
  },
};

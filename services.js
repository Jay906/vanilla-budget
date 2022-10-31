import { Message } from "./message.js";

export function uid() {
  let a = new Uint32Array(3);
  window.crypto.getRandomValues(a);
  return (
    performance.now().toString(36) +
    Array.from(a)
      .map((A) => A.toString(36))
      .join("")
  ).replace(/\./g, "");
}

export function invalidateChars(e) {
  const invalidChars = ["+", "e", "-"];
  if (invalidChars.includes(e.key)) {
    e.preventDefault();
  }
}

export function clearElements(elementsArray) {
  elementsArray.forEach((elem) => {
    elem.innerHTML = "";
  });
}

export function clearInputs(inputsArray) {
  inputsArray.forEach((item) => {
    item.value = "";
    item.blur();
  });
}

export function validateForm(title, amount) {
  if (!title && !amount) {
    console.error("Title and amount should not be empty");
    return false;
  }
  if (title.length > 25) {
    Message.open({
      message: "Title should not contain more than 25 chars",
      displayDuration: 4000,
      classList: "bg-danger",
    });
    return false;
  }
  if (!isFinite(amount)) {
    console.log("Amount input must be number only");
    return false;
  }

  return true;
}

export function setDataToLocaleStorage(data) {
  let value = JSON.stringify(data);

  localStorage.setItem("budget-data", value);
}

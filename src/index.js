import "tailwindcss/tailwind.css";

function component() {
  const element = document.createElement("div");

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = "HELLO JORDAN";
  element.classList.add("flex");

  return element;
}

document.body.appendChild(component());

function component() {
  const element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = "HELLO WORLD"

  return element;
}

document.body.appendChild(component());
console.log("WORKING?")
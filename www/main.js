async function loadContent() {
  const response = await fetch("api/content");
  const content = await response.json();

  console.log(content);

  Array.from(document.getElementsByClassName("heading-el")).forEach(
    (element) => {
      element.innerHTML += content.title;
    }
  );

  Array.from(document.getElementsByClassName("information-el")).forEach(
    (element) => {
      element.innerHTML += content.information;
    }
  );
}

loadContent();

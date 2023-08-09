document.querySelectorAll(".main-line").forEach((element) => {
  element.addEventListener("click", function (event) {
    event.currentTarget.classList.add("main-line-selected");
  });
});

document.addEventListener("click", (e) => {
  const eraseStyle = document.querySelectorAll(".main-line");
  eraseStyle.forEach((el) => {
    const withinBoundaries = e.composedPath().includes(el);
    if (!withinBoundaries) {
      el.classList.remove("main-line-selected");
    }
  });
});

const closePopup = document.getElementById("closePopup");

closePopup.addEventListener("click", function () {
  myPopup.style.display = "none";
});
window.addEventListener("click", function (event) {
  if (event.target == myPopup) {
    myPopup.style.display = "none";
  }
});

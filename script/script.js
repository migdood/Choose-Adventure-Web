// "DOMContentLoaded" means it's waiting for all the html to load then executes the JS
document.addEventListener("DOMContentLoaded", function () {
  const MainTitle = document.getElementById("main-text-title");
  const chapterDescription = document.getElementById("main-text");
  const choiceElements = [
    document.getElementById("choice1"),
    document.getElementById("choice2"),
    document.getElementById("choice3"),
    document.getElementById("choice4"),
  ];
  const overlay = document.getElementById("overlay");
  const nameInput = document.getElementById("name");
  const submitButton = document.getElementById("submit");

  let playerName;

  fetch("story.json")
    .then((response) => response.json())
    .then((storyData) => {
      // Function to show the overlay
      function showOverlay() {
        overlay.style.display = "flex";
      }

      // Function to hide the overlay
      function hideOverlay() {
        overlay.style.display = "none";
      }

      // Event listener to hide the overlay when the user submits their name
      submitButton.addEventListener("click", function () {
        playerName = nameInput.value;
        storyData.characters.player.name = playerName;
        hideOverlay();
      });

      showOverlay();

      let currentChapter = "chapter1";

      function displayChapter(chapterId) {
        const chapter = storyData.chapters[chapterId];
        if (chapter) {
          MainTitle.innerHTML = chapter.title;
          chapterDescription.innerHTML = chapter.description;

          if (chapter.ending) {
            for (let i = choiceElements.length - 1; i >= 0; i--) {
              choiceElements[i].style.display = "none";
              choiceElements[i].removeEventListener("click", () => {});
            }
          } else {
            for (let i = 0; i < choiceElements.length; i++) {
              const choice = chapter.choices[i];
              const choiceElement = choiceElements[i];

              if (choice && choice.text !== "") {
                choiceElement.style.display = "";
                choiceElement.innerHTML = choice.text;

                choiceElement.addEventListener("click", () =>
                  displayChapter(choice.destination)
                );
              } else {
                choiceElement.style.display = "none";
                choiceElement.removeEventListener("click", () => {});
              }
            }
          }
        }
      }

      displayChapter(currentChapter);
    })
    .catch((error) => console.error("Error loading story data:", error));
});

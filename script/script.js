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

  fetch("story.json")
    .then((response) => response.json())
    .then((storyData) => {
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

      function showOverlay() {
        overlay.style.display = "flex";
      }

      function hideOverlay() {
        overlay.style.display = "none";
      }

      // Stupid button hides the damned overlay and activates the whole shabang
      submitButton.addEventListener("click", function () {      
        // My ass replacing the stinking names manually, kill me
        storyData.chapters.chapter1.title = storyData.chapters.chapter1.title.replace("{{playerName}}", nameInput.value);
        storyData.chapters.chapter1a.description = storyData.chapters.chapter1a.description.replace("{{playerName}}", nameInput.value);

        //MFing activates the whole shabang
        displayChapter(currentChapter);

        hideOverlay();
      });

      showOverlay();
    })
    .catch((error) => console.error("Error loading story data:", error));
});

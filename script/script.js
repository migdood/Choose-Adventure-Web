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
  const stack = [];
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
            // For choices
            for (let i = 0; i < choiceElements.length; i++) {
              const choice = chapter.choices[i];
              const choiceElement = choiceElements[i];

              if (choice && choice.text !== "") {
                choiceElement.style.display = "";
                choiceElement.innerHTML = choice.text;

                // Add the event listener
                choiceElement.addEventListener("click", () => {
                  currentChapter = choice.destination;
                  displayChapter(currentChapter);
                  stack.push(currentChapter);
                  console.log(stack);
                  console.log(currentChapter);
                  
                  for (let j = 0; j < choiceElements.length; j++) {
                    const choiceElement = choiceElements[j];

                    choiceElement.removeEventListener('click', () => {});
                  }
                });
              } else {
                choiceElement.style.display = "none";
                choiceElement.removeEventListener("click", () => {});
              }
            }
          }
        } else {
          alert("Failed to load Chapter " + chapter.error);
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
        function changeNameToUpperCase(str) {
          return str.charAt(0).toUpperCase() + str.slice(1);
        }
        const playerName = nameInput.value;
        const upperCaseName = changeNameToUpperCase(playerName);

        // My ass replacing the stinking names manually, kill me
        // This is where you have to change the names, so every time there is a new addition you gotta change it here
        storyData.chapters.chapter1.title =
          storyData.chapters.chapter1.title.replace(
            "{{playerName}}",
            upperCaseName
          );

        storyData.chapters.chapter1a.description =
          storyData.chapters.chapter1a.description.replace(
            "{{playerName}}",
            upperCaseName
          );

        //MFing activates the whole shabang
        displayChapter(currentChapter);

        hideOverlay();
      });

      showOverlay();
    })
    .catch((error) => console.error("Error loading story data:", error));
});

const MainTitle = document.getElementById("main-text-title");
const chapterDescription = document.getElementById("main-text");
const choices = document.getElementById("choices");
const choicesArray = [
  document.getElementById("choice1"),
  document.getElementById("choice2"),
  document.getElementById("choice3"),
  document.getElementById("choice4"),
];

const overlay = document.getElementById("overlay");
const nameInput = document.getElementById("name");
const submitButton = document.getElementById("submit");
const stack = [];

let currentChapter = "chapter1";
// "DOMContentLoaded" means it's waiting for all the html to load then executes the JS
// document.addEventListener("DOMContentLoaded", function () {
  fetch("story.json")
    .then((response) => response.json())
    .then((storyData) => {
      function eventDelegator(event) {
        // Check if the clicked element has the "choice" class
        if (event.target.classList.contains("choice-button")) {
          // Extract choice data based on the clicked element
          choiceIndex = event.target.getAttribute("data-choice");
          const choice =
            storyData.chapters[currentChapter].choices[choiceIndex];

          // Call the clickHandler with the choice data
          clickHandler(choice, event.target);
          // Remove the event listener after the first click
          choices.removeEventListener("click", eventDelegator);

          choices.addEventListener("click", eventDelegator);
        }
      }
      choices.addEventListener("click", eventDelegator);

      function clickHandler(choice, choiceFromTheArray) {
        currentChapter = choice.destination;
        loadChapter(currentChapter);
        stack.push(currentChapter);

        console.log("Clicked: " + choice.text);
        console.log("Current Chapter: " + currentChapter);
        console.log("Stack: ", stack);
      }

      function loadChapter(chapterID) {
        const chapter = storyData.chapters[chapterID];
        if (chapter) {
          // Display the title and description
          MainTitle.innerHTML = chapter.title;
          chapterDescription.innerHTML = chapter.description;

          // Hide all the choices
          choicesArray.forEach((choiceFromTheArray) => {
            choiceFromTheArray.style.display = "none";
          });
          if (!chapter.ending) {
            // Populate choice box with the available text
            chapter.choices.forEach((choice, i) => {
              const choiceFromTheArray = choicesArray[i];
              if (choice && choice.text !== "") {
                choiceFromTheArray.style.display = "";
                choiceFromTheArray.innerHTML = choice.text;
              }
            });
          }
        } else {
          alert("Failed to Load Chapter, Check the fetch API");
        }
      }
      // Stupid button hides the damned overlay and UpperCase first letter of the given name
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

          hideOverlay();
          
          loadChapter(currentChapter);
      });

    })
    .catch((error) => console.error("Error loading story data: ", error));
// });

function showOverlay() {
  overlay.style.display = "flex";
}

function hideOverlay() {
  overlay.style.display = "none";
}

showOverlay();

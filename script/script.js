const MainTitle = document.getElementById("main-text-title");
const chapterDescription = document.getElementById("main-text");
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
document.addEventListener("DOMContentLoaded", function () {
  fetch("story.json")
    .then((response) => response.json())
    .then((storyData) => {
      function loadChapter(chapterID) {

        const chapter = storyData.chapters[chapterID];

        if (chapter) {
          // Display the title and description
          MainTitle.innerHTML = chapter.title;
          chapterDescription.innerHTML = chapter.description;
          // Chapter Ending = Hide choices
          if (chapter.ending) {
            for (let i = choicesArray.length - 1; i >= 0; i--) {
              choicesArray[i].style.display = "none";
            }
          } else {
            for (let j = 0; j < choicesArray.length; j++) {
              const choiceFromTheArray = choicesArray[j];
              choiceFromTheArray.removeEventListener('click',clickHandler)
              //alert('removed event listener')
            }
            // TODO create a for loop outside the for loop, make it loop through all the choices inside the choice array, if there are some eventlisteners then activate boolean true and put it in an if statement
            if(choicesArray){

            }
            // Populate choice box with what's available
            for (let i = 0; i < choicesArray.length; i++) {
              const choice = chapter.choices[i];
              const choiceFromTheArray = choicesArray[i];

              if (choice && choice.text !== "") {
                choiceFromTheArray.style.display = "";
                choiceFromTheArray.innerHTML = choice.text;

                function clickHandlerRemover(removeElement) {
                  removeElement.removeEventListener('click', clickHandler);
                }
                function clickHandler() {
                  currentChapter = choice.destination;
                  loadChapter(currentChapter);
                  stack.push(currentChapter);
    
                  console.log("Clicked: " + choice.text);
                  console.log("Current Chapter: " + currentChapter);
                  console.log("Stack: ", stack);

                  clickHandlerRemover(choiceFromTheArray[i]);
                }

                choiceFromTheArray.addEventListener("click", clickHandler);
              } else {
                choiceFromTheArray.style.display = "none";
                choiceFromTheArray.removeEventListener("click", () => {});
              }
            }
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
      });

      loadChapter(currentChapter);
    })
    .catch((error) => console.error("Error loading story data: ", error));
});

function showOverlay() {
  overlay.style.display = "flex";
}

function hideOverlay() {
  overlay.style.display = "none";
}

showOverlay();

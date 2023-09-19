//const MainTitle = document.getElementById("main-text-title");
//const Choice1 = document.getElementById("Choice1");
//const Choice2 = document.getElementById("Choice2");
const Choice3 = document.getElementById("choice3");
const Choice4 = document.getElementById("choice4");

Choice3.style.display = "none";
Choice4.style.display = "none";




// This event listener waits for the HTML document to be fully loaded before executing its code.
document.addEventListener("DOMContentLoaded", function () {
  // Get references to HTML elements by their IDs.
  const MainTitle = document.getElementById("main-text-title");
  const chapterDescription = document.getElementById("main-text");
  const Choice1 = document.getElementById("choice1");
  const Choice2 = document.getElementById("choice2");

  // Load the story content from the JSON file using the fetch API.
  fetch("story.json")
    .then((response) => response.json()) // Parse the JSON response into a JavaScript object.
    .then((storyData) => {
      let currentChapter = "chapter1"; // Initialize with the first chapter

      // Function to display a chapter's content based on its ID.
      function displayChapter(chapterId) {
        const chapter = storyData.chapters[chapterId];
        if (chapter) {
          // Update the chapter title and description on the webpage.
          MainTitle.textContent = chapter.title;
          chapterDescription.textContent = chapter.description;

          if (chapter.ending) {
            // If it's the end of the story, hide choice buttons.
            Choice1.style.display = "none";
            Choice2.style.display = "none";
          } else {
            // If not the end, display and configure the choice buttons.
            Choice1.textContent = chapter.choices[0].text;
            Choice2.textContent = chapter.choices[1].text;

            // Add event listeners to the choice buttons.
            Choice1.addEventListener("click", () =>
              displayChapter(chapter.choices[0].destination)
            );
            Choice2.addEventListener("click", () =>
              displayChapter(chapter.choices[1].destination)
            );
          }
        }
      }

      // Start displaying the initial chapter (Chapter 1).
      displayChapter(currentChapter);
    })
    .catch((error) => console.error("Error loading story data:", error)); // Handle any errors during fetch.
});

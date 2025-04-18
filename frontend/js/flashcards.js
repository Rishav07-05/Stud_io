async function loadFlashcards() {
  try {
    const res = await fetch("/backend/flashcards.php");
    if (!res.ok) throw new Error("Network response was not ok");

    const data = await res.json();
    console.log("Received flashcards:", data); // Debug log

    if (!data.success) {
      throw new Error(data.message || "Failed to load flashcards");
    }

    const list = document.getElementById("flashcardList");
    list.innerHTML = "";

    if (!data.flashcards || data.flashcards.length === 0) {
      list.innerHTML =
        '<p class="text-gray-400 text-center">No flashcards yet. Create your first one!</p>';
      return;
    }

    data.flashcards.forEach((card) => {
      console.log(
        `Flashcard: Question: ${card.question}, Answer: ${card.answer}`
      ); // Debug log
      const div = document.createElement("div");
      div.className = "flashcard";
      div.innerHTML = `
        <div class="flashcard-inner bg-gray-800 rounded-lg shadow-xl">
          <div class="flashcard-front">
            <p class="font-semibold text-lg">${card.question}</p>
          </div>
          <div class="flashcard-back">
            <p class="text-lg">${card.answer}</p>
          </div>
        </div>
      `;
      div.addEventListener("click", () => div.classList.toggle("flipped"));
      list.appendChild(div);
    });
  } catch (err) {
    console.error("Error loading flashcards:", err);
    alert("Failed to load flashcards: " + err.message);
  }
}

document
  .getElementById("addFlashcardForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const question = document.getElementById("question").value.trim();
    const answer = document.getElementById("answer").value.trim();

    if (!question || !answer) {
      alert("Both question and answer are required!");
      return;
    }

    try {
      const res = await fetch("../backend/flashcards.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, answer }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Server response:", data); // Debug log

      if (data.success) {
        document.getElementById("addFlashcardForm").reset();
        alert("Flashcard added successfully!");
        await loadFlashcards(); // Reload the flashcards
      } else {
        throw new Error(data.message || "Failed to add flashcard");
      }
    } catch (err) {
      console.error("Error adding flashcard:", err);
      alert("Failed to add flashcard: " + err.message);
    }
  });

// Load flashcards when page loads
document.addEventListener("DOMContentLoaded", loadFlashcards);

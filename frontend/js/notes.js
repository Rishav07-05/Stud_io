document.addEventListener("DOMContentLoaded", () => {
  loadNotes();
});

function saveNote() {
  const note = document.getElementById("noteInput").value.trim();
  if (!note) return;

  fetch("../backend/notes.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ note }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        document.getElementById("noteInput").value = "";
        loadNotes();
      } else {
        alert("Failed to save note.");
      }
    });
}

function loadNotes() {
  fetch("../backend/notes.php")
    .then((res) => res.json())
    .then((data) => {
      const list = document.getElementById("notesList");
      list.innerHTML = ""; // Clear existing notes before adding new ones
      data.notes.forEach((note) => {
        const div = document.createElement("div");
        div.className =
          "p-3 rounded bg-gray-700 flex justify-between items-center";
        div.innerHTML = `
          <span>${note.content}</span>
          <div class="space-x-2">
            <button class="editBtn text-blue-500" onclick="editNote(${note.id}, '${note.content}')">Edit</button>
            <button class="deleteBtn text-red-500" onclick="deleteNote(${note.id})">Delete</button>
          </div>
        `;
        list.appendChild(div);
      });
    })
    .catch((err) => console.log("Failed to fetch notes: ", err));
}

function editNote(noteId, currentContent) {
  const newContent = prompt("Edit your note:", currentContent);
  if (newContent && newContent !== currentContent) {
    fetch("../backend/notes.php", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ noteId, newContent }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          loadNotes(); // Reload notes to reflect the changes
        } else {
          alert("Failed to update note.");
        }
      });
  }
}

function deleteNote(noteId) {
  if (confirm("Are you sure you want to delete this note?")) {
    fetch("../backend/notes.php", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ noteId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          loadNotes(); // Reload notes to reflect the changes
        } else {
          alert("Failed to delete note.");
        }
      });
  }
}

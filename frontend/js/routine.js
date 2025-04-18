function loadRoutine() {
  fetch("../backend/routine.php")
    .then((res) => res.json())
    .then((data) => {
      console.log("Data received from backend:", data); // Debug

      const list = document.getElementById("routineList");
      list.innerHTML = "";

      if (!data.success || !Array.isArray(data.routines)) {
        alert("Failed to load routines.");
        return;
      }

      data.routines.forEach((r) => {
        const li = document.createElement("li");
        li.className =
          "flex justify-between items-center bg-gray-800 p-3 rounded";

        const span = document.createElement("span");
        span.textContent = r.task;

        const controls = document.createElement("div");
        controls.className = "space-x-2";

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "bg-yellow-500 px-3 py-1 rounded";
        editBtn.onclick = () => {
          const newTask = prompt("Edit your task:", r.task);
          if (newTask) updateRoutine(r.id, newTask);
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "bg-red-500 px-3 py-1 rounded";
        deleteBtn.onclick = () => {
          if (confirm("Are you sure you want to delete this task?")) {
            deleteRoutine(r.id);
          }
        };

        controls.append(editBtn, deleteBtn);
        li.append(span, controls);
        list.appendChild(li);
      });
    })
    .catch((err) => {
      console.error("Failed to fetch routine data:", err);
    });
}

function addRoutine() {
  const input = document.getElementById("routineInput");
  const task = input.value.trim();
  if (!task) return alert("Please enter a task.");

  fetch("../backend/routine.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        input.value = "";
        loadRoutine();
      } else {
        alert("Failed to add task.");
      }
    });
}

function updateRoutine(id, task) {
  fetch("../backend/routine.php", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, task }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) loadRoutine();
      else alert("Failed to update task.");
    });
}

function deleteRoutine(id) {
  fetch("../backend/routine.php", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) loadRoutine();
      else alert("Failed to delete task.");
    });
}

// Initial load
window.onload = loadRoutine;

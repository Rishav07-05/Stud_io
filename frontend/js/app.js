document.addEventListener("DOMContentLoaded", async () => {
  const roomsList = document.getElementById("roomsList");

  try {
    const res = await fetch("../backend/get_rooms.php");
    const rooms = await res.json();

    if (rooms.length === 0) {
      roomsList.innerHTML = '<p class="text-gray-400">No rooms available.</p>';
      return;
    }

    roomsList.innerHTML = "";

    rooms.forEach((room) => {
      const card = document.createElement("div");
      card.className = "bg-gray-800 p-4 rounded shadow space-y-2";

      card.innerHTML = `
        <h3 class="text-xl font-semibold">${room.room_code}</h3>
        <p class="text-gray-400">Users: ${room.user_count}/15</p>
        <button class="join-btn bg-green-600 hover:bg-green-500 px-4 py-2 rounded text-white" data-id="${room.id}">
          Join
        </button>
      `;

      roomsList.appendChild(card);
    });

    document.querySelectorAll(".join-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const roomId = btn.getAttribute("data-id");

        const response = await fetch(
          `../backend/join_room.php?room_id=${roomId}`
        );
        const result = await response.json();

        if (result.success) {
          window.location.href = `room.html?room_id=${roomId}`;
        } else {
          alert(result.message || "Failed to join room");
        }
      });
    });
  } catch (err) {
    console.error("Failed to fetch rooms:", err);
    roomsList.innerHTML = '<p class="text-red-400">Error loading rooms.</p>';
  }
});

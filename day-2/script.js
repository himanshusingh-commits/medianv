const button = document.getElementById("loadData");
const description = document.getElementById("description");

button.addEventListener("click", async () => {
  try {
    const response = await fetch("http://localhost:3000/file");
    const data = await response.json();
    description.textContent = data.content;
  } catch (error) {
    console.error("Error:", error);
    description.textContent = "Failed to load data.";
  }
});
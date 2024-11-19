const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const app = express();
const sqlite3 = require("sqlite3").verbose();

// Serve static files from src directory
app.use("/styles", express.static(path.join(__dirname, "../styles")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use("/public", express.static(path.join(__dirname, "../../public")));

app.get("/", async (request, response) => {
  response.send(
    await fs.readFile(path.join(__dirname, "../views/home.html"), "utf8")
  );
});

app.listen(process.env.PORT || 3000, () =>
  console.log("App available on http://localhost:3000")
);

const express = require("express");
const fsp = require("fs").promises;
const fs = require("fs");
const path = require("path");
const app = express();
const sqlite3 = require("sqlite3").verbose();

app.use(express.json()); // Add this line to parse JSON bodies

if (!fs.existsSync("./data")) {
  fs.mkdirSync("./data");
}

let db = new sqlite3.Database("./data/database.db", (err) => {
  if (err) {
    console.error(`Error opening database: ${err.message}`);
  } else {
    console.log("__DB__ connected to the UserData database.");
  }
});

db.run(
  `CREATE TABLE IF NOT EXISTS TimeEntry (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL
  )`,
  (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("__DB__ Table accessed successfully");
  }
);

function closedb() {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("__DB__ Database connection closed.");
  });
}

function getTimeEntries() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM TimeEntry`, (err, rows) => {
      if (err) {
        console.error(err.message);
        reject(err);
        return;
      }
      console.log("__DB__ TimeEntry table accessed successfully");
      resolve(rows);
    });
  });
}

// Serve static files from src directory
app.use("/styles", express.static(path.join(__dirname, "../styles")));
app.use("/js", express.static(path.join(__dirname, "../js")));
app.use("/public", express.static(path.join(__dirname, "../../public")));

app.get("/", async (request, response) => {
  console.log("__ROUTES__ Home page accessed");
  response.send(
    await fsp.readFile(path.join(__dirname, "../views/home.html"), "utf8")
  );
});

app.get("/settings", async (request, response) => {
  console.log("__ROUTES__ Settings page accessed");
  response.send(
    await fsp.readFile(path.join(__dirname, "../views/settings.html"), "utf8")
  );
});

// Add this route before your other routes
app.get("/api/time-entries", async (request, response) => {
  try {
    const rows = await getTimeEntries();
    response.json(rows);
  } catch (err) {
    console.error("Error fetching time entries:", err);
    response.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/statistics", async (request, response) => {
  console.log("__ROUTES__ statistics page accessed");
  try {
    const htmlTemplate = await fsp.readFile(
      path.join(__dirname, "../views/statistics.html"),
      "utf8"
    );
    response.send(htmlTemplate);
  } catch (err) {
    console.error("Error in statistics route:", err);
    response.status(500).send("Internal Server Error");
  }
});

app.post("/save-datetime", (req, res) => {
  const { start, end } = req.body;
  console.log(`Start: ${start}, End: ${end}`);
  res.sendStatus(200);
  db.run(
    "INSERT INTO TimeEntry (start_time, end_time) VALUES (?, ?)",
    [start, end],
    (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log("Data inserted successfully");
    }
  );
});

app.listen(process.env.PORT || 3000, () =>
  console.log("App available on http://localhost:3000")
);

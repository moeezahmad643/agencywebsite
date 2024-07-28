const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("./artical.db", (err) => {
    if (err) return console.error(err.message);
    console.log("Connected to the in-memory SQlite database.");
});

const createTableQuery = `
CREATE TABLE IF NOT EXISTS articals (
id INTEGER PRIMARY KEY AUTOINCREMENT,
mytitle TEXT,
mydescription TEXT,
minidescription TEXT,
image TEXT
)
`;

// Run the SQL query to create the table
db.serialize(() => {
    db.run(createTableQuery, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        } else {
            console.log("Table created successfully");
        }
    });
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.get("/setArtical", (req, res) => {
    let { title, desctiption, minidescription, image } = req.query;
    db.run(
        "INSERT INTO articals (mytitle,mydescription,minidescription,image) values (?,?,?,?) ",
        [title, desctiption, minidescription, image],
        (err) => {
            if (err) {
                res.json({
                    message: "There Is Some Problem While adding the Artical",
                });
            } else {
                res.json({ message: "ok" });
            }
        }
    );
});

app.get("/getArtical", (req, res) => {
    let limit = req.query.limit;
    if (limit) {
        limit = 100;
    }

    console.log(limit);
    db.all("select * from articals limit ?", [limit], (err, data) => {
        if (err) {
            res.json({ message: "not-ok" });
        } else if (!data) {
            res.json({ message: "No Artical Found" });
        } else if (data.length == 0) {
            res.json({ message: "data-empty" });
        } else {
            res.json({ message: "ok", data });
        }
    });
});

app.get("/getArtical/id:id", (req, res) => {
    let id = req.params.id;
    console.log(id);

    db.all("select * from articals where id = ?", [id], (err, data) => {
        if (err) {
            res.json({ message: "not-ok" });
        } else if (!data) {
            res.json({ message: "No Artical Found" });
        } else if (data.length == 0) {
            res.json({ message: "data-empty" });
        } else {
            res.json({ message: "ok", data });
        }
    });
});

app.get("/updateArtical", (req, res) => {
    let { id, title, desctiption, minidescription, image } = req.query;
    console.log(id, title, desctiption, minidescription, image);
    db.run(
        `Update articals set 
        mytitle =?,
        mydescription=?,
        minidescription=?,
        image=?
        where id = ?`,
        [title, desctiption, minidescription, image, id],
        (err) => {
            if (err) {
                console.log(err);
                res.json({ message: "not-ok" });
            } else {
                res.json({ message: "ok" });
            }
        }
    );
});

app.get("/delete", (req, res) => {
    db.run(`delete from articals where id=8`);
    res.send("hello world");
});

app.listen(port, () => {
    console.log(`The Server Is live on http://localhost:${port}`);
});

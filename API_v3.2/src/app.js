const cors = require("cors");
const v1Router = require("./v1/route");
const express = require("express");
const app = express();

const PORT = 3001;
const VERSION = "v1";

app.use(cors());
app.use(express.json());
app.use(`/${VERSION}`, v1Router);
app.use(express.static("pictures"));

app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}/${VERSION}`);
});

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const ExcelJS = require("exceljs");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");

// Routers
const authRouter = require("./controllers/auth");
const formRouter = require("./controllers/form");

const passport = require("./utils/passport");
const knex = require("./utils/knex");

const app = express();
const sessionStore = new MySQLStore({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
});

app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL
        : "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(
  session({
    secret: "akumosol",
    store: sessionStore,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res) {
  res.send("hello world");
});

app.post("/members", async (req, res) => {
  const result = await knex("members").insert({
    first_name: "First Name",
    last_name: "Last Name",
  });
  res.send("ok");
});

app.get("/members", async (req, res) => {
  const { query } = req;
  const { q, page = 0, size = 20, type } = query;

  const rowsQuery = knex("members").where(
    q
      ? function () {
          this.where("first_name", "like", `%${q}%`).orWhere(
            "last_name",
            "like",
            `%${q}%`
          );
        }
      : {}
  );

  if (type) rowsQuery.where({ [type]: true });

  const rows = await rowsQuery.offset(size * page).limit(size);

  const countQuery = knex("members").where(
    q
      ? function () {
          this.where("first_name", "like", `%${q}%`).orWhere(
            "last_name",
            "like",
            `%${q}%`
          );
        }
      : {}
  );
  if (type) countQuery.where({ [type]: true });
  const count = await countQuery.count();
  res.json({ data: rows, count: count[0]["count(*)"] });
});

app.post("/members/xlsx", async (req, res) => {
  const { body } = req;
  const { selectedIds = [], downloadSelected = false } = body;
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Members");
  sheet.columns = [
    { header: "Member ID", key: "id" },
    { header: "First Name", key: "first_name" },
    { header: "Last Name", key: "last_name" },
    { header: "Status", key: "status" },
    { header: "Slack", key: "slack" },
    { header: "Teachable", key: "teachable" },
    { header: "Linux", key: "linux" },
    { header: "AWS", key: "aws" },
    { header: "Ansible", key: "ansible" },
    { header: "Terraform", key: "terraform" },
    { header: "Git", key: "git" },
    { header: "Cloudformation", key: "cloudformation" },
    { header: "Career coaching", key: "career_coaching" },
  ];
  const query = knex("members");
  console.log("downloadSelected", downloadSelected);
  if (downloadSelected) query.whereIn("id", selectedIds);
  const rows = await query;
  console.log("len", rows.length);
  for (const row of rows) {
    sheet.addRow({
      ...["id", "first_name", "last_name"].reduce(
        (p, n) => ({ ...p, [n]: row[n] }),
        {}
      ),
      ...[
        "status",
        "slack",
        "teachable",
        "linux",
        "aws",
        "ansible",
        "terraform",
        "git",
        "cloudformation",
        "career_coaching",
      ].reduce((p, n) => ({ ...p, [n]: row[n] ? "TRUE" : "FALSE" }), {}),
    });
  }
  const buffer = await workbook.xlsx.writeBuffer();
  const base64 = Buffer.from(buffer).toString("base64");
  res.json({ base64 });
});

app.post("/members/changeState", async (req, res) => {
  const { body } = req;
  const { id, ...state } = body;
  const result = await knex("members").where({ id }).update(state);
  res.send("ok");
});

// Forms

app.get("/forms", async (req, res) => {
  const { query } = req;
  const { type, page = 0, size = 20 } = query;
  const forms_query = knex("forms");
  if (type) {
    forms_query.where("type", type);
  }
  forms_query.offset(size * page).limit(size);
  const result = await forms_query;
  const count = await forms_query.count();
  res.json({ data: result, count: count[0]["count(*)"] });
});

app.post("/forms", async (req, res) => {
  const { body } = req;
  const stringGen = (len) => {
    let text = "";
    const charset = "abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    return text;
  };
  const token = stringGen(7);
  const result = await knex("forms").insert({
    ...body,
    status: "active",
    token,
  });
  res.json(result);
});

app.post("/forms/update", async (req, res) => {
  const { body } = req;
  const { id, ...data } = body;
  const result = await knex("forms").where({ id }).update(data);
  res.json(result);
});

app.post("/forms/delete", async (req, res) => {
  const { body } = req;
  const { id } = body;
  const result = await knex("forms").where({ id }).delete();
  res.json(result);
});

app.use("/auth", authRouter);
app.use("/form", formRouter);

const server = app.listen(process.env.PORT, () => {
  console.log(`Server listening on ${process.env.HOST}:${process.env.PORT}`);
});

const shutDown = () => {
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGTERM", shutDown);
process.on("SIGINT", shutDown);

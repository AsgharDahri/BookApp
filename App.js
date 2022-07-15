const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
require("./config/database").connect();
const bcrypt = require("bcrypt");
const async = require("hbs/lib/async");
const User = require("./model/User");
const jwt = require("jsonwebtoken");
const Auth = require("./middleware/Auth");
const Book = require("./model/Book");
var ObjectID = require("mongodb").ObjectID;
//middleware
const viewPath = path.join(__dirname, "/template/views");
app.set("view engine", "hbs");
app.set("views", viewPath);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
var Admin = "";

app.listen(process.env.PORt|| 3000, () => {
  console.log("Server is listening at 3000!");
});

app.get("/", (req, res) => {
  res.render("Home.hbs");
});

app.get("/signup", (req, res) => {
  res.render("signup.hbs");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/dashboard", Auth, async (req, res) => {
  const books = await Book.find({});
  // console.log(books);
  res.render("Dashboard.hbs", { Books: books });
});

app.get("/addBook", Auth, (req, res) => {
  res.render("AddBooks.hbs");
});
app.get("/deleteBook", Auth, async (req, res) => {
  const books = await Book.find({});
  // console.log(books);
  res.render("Delete.hbs", { Books: books });
});

app.get("/editBook", Auth, async (req, res) => {
  const books = await Book.find({});
  
  res.render("EditBook.hbs",{ Books: books });
});

//POST FUNCTIONS for authentication
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (password && email) {
    const user = await User.create({ email, password });
    const id = user._id;
    Admin = user.email;
    const token = jwt.sign({ id }, "Asghar", { expiresIn: 3 * 24 * 60 * 60 });
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 3 * 24 * 60 * 60 * 1000,
    });
    res.redirect("/");
  } else {
    res.redirect("signup");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    console.log(user);
    const id = user._id;
    Admin = user.email;
    // const password=''+password;await bcrypt.compare(password,user.password);
    const userPermission = await bcrypt.compare(password, user.password);
    console.log(userPermission);
    if (userPermission) {
      const token = jwt.sign({ id }, "Asghar", { expiresIn: 3 * 24 * 60 * 60 });
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
      });
      res.redirect("/");
    } else {
      console.log("wrond password");
    }
  } else {
    console.log("user not exists");
  }
});

app.post("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/login");
});

//POST FUNCTIONS FOR CRUD OF BOOKS admin side

app.post("/addBook", Auth, async (req, res) => {
  console.log(req.body);
  // const BName=req.body.BName;
  const { BName, BDescription, BAvailability } = req.body;
  // const book=await Book.create({BName})
  // res.redirect('Dashboard')

  // console.log(BName,BDescription,BAvailability);
  const token = await req.cookies.jwt;
  if (token) {
    jwt.verify(token, "Asghar", async (err, decodedToken) => {
      if (err) {
        console.log("error");
      } else {
        const userID = decodedToken.id;
        const user = await User.findById(userID);
        const AddedBy = user.email;
        const book = await Book.create({
          BName,
          BDescription,
          BAvailability,
          AddedBy,
        });
        console.log("book added");
        res.redirect("Dashboard");
      }
    });
  }
});

app.post("/deleteBook", Auth, async (req, res) => {
  // console.log(req.body);
  // var count={
  //   BId:'asdf'
  // };
  const count = req.body.BId;
  console.log(count);

  //
  // console.log(count);
  len = count.length;
  //  len= Object.keys(req.body.BId).length;
  console.log(len);
  // const len = req.body.BId.length;
  if (len == 24) {
    console.log(len);

    const id = new ObjectID(req.body.BId);
    const bookDelete = await Book.deleteOne({ _id: id });
  } else {
    console.log(len);

    for (let i = 0; i < req.body.BId.length; i++) {
      const id = new ObjectID(req.body.BId[i]);
      const bookDelete = await Book.deleteMany({ _id: id });

      // console.log(id);
      // //   const deleteId=id[i]
      // // // //   console.log(deleteId);
    }
  }
  // console.log(req.body.BId.length);

  // console.log(id.length);
  console.log("Book deleted");
  res.redirect("deleteBook");
});

app.post("/editBook", Auth, async (req, res) => {
  const id = new ObjectID(req.body.BId);
  const bookDelete = await Book.deleteOne({ _id: id });
  const {BId, BName, BDescription, BAvailability,AddedBy } = req.body;
  const book = await Book.create({
    BName,
    BDescription,
    BAvailability,
    AddedBy,
  });
  res.redirect('dashboard')
// console.log(req.body.BId);
});

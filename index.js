const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "harkirat"
const app = express();
app.use(express.json());
const users = [];
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
})

app.post("/signup", function (req, res) {
    const username = req.body.username
    const password = req.body.password
    users.push({
        username: username,
        password: password
    })
    res.json({
        message: "you are successfully signed up"
    })

})
app.post("/signin", function (req, res) {
    const username = req.body.username
    const password = req.body.password
    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == username && users[i].password == password) {
            foundUser = users[i]
        }
    }
    if (!foundUser) {
        res.json({
            message: "crediantials incorrect"
        })
        return
    } else {
        const token = jwt.sign({
            username: foundUser.username
        }, JWT_SECRET);
        res.json({
            token: token
        })
    }
})
function auth(req, res, next) {
    const token = req.headers.token;
    try {
        const decodedData = jwt.verify(token, JWT_SECRET);
        req.username = decodedData.username
        next();
    } catch (err) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
}
app.get("/me", auth, function (req, res) {
    const currentUser = req.username;
    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username == currentUser) {
            foundUser = users[i]
        }
    }
    res.json({
        username: foundUser.username,
        password: foundUser.password
    })
}

)
app.get("/todo", auth, function (req, res) {

})
app.listen(3000);
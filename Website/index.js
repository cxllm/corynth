
const express = require("express");
const app = express();
const { join } = require("path");
const links = {
    invite: "https://discord.com/api/oauth2/authorize?client_id=660818351638970370&permissions=8&scope=bot",
    support: "https://discord.gg/6kFbxxkX5p",
    vote: "https://top.gg/bot/660818351638970370",
    donate: "https://paypal.me/cx11m"
};
const { server, ip } = require("../config.js");
app.set('view engine', 'ejs');
app.set('views', join(__dirname, "pages"))
app.use(express.static(join(__dirname, "public")))
app.get("/", (req, res) => {
    res.render("index");
});
app.get("/features", (req, res) => {
    res.render("features");
});
app.get("/privacy-policy", (req, res) => {
    res.render("policy");
})
Object.keys(links).map(link => {
    app.get(`/${link}`, (req, res) => {
        res.redirect(links[link]);
    });
});
app.get("*", (req, res) => {
    res.render("404");
});
app.listen(server, ip, () => {
    console.log(`Webserver is listening on ${server}`)
});
console.log(`Webserver is listening on ${server}`)

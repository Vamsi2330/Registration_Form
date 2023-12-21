const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const dontenv = require("dotenv");

const app = express();
dontenv.config();

const port = process.env.PORT || 3000;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.0ewkpc4.mongodb.net/registrationFormDB`,{
    useNewUrlParser : true,
    useUnifiedTopology : true,
});

const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
});

const Registration = mongoose.model('Registration',registrationSchema);

app.use(bodyparser.urlencoded({ extended: true}));
app.use(bodyparser.json());

app.use(express.static(__dirname + '/public'));

app.get('/',(req,res) =>{
    res.sendFile(__dirname + "/public/index.html");
});

app.post('/register',async(req,res) =>{
    try{
        const {name,email,password} = req.body;

        const registrationData = new Registration({
            name,
            email,
            password
        });
        await registrationData.save();
        res.redirect("/success");
    }
    catch(error){
        console.log(error);
        res.redirect("/error");
    }
});

app.get("/success", async(req,res) => {
    res.sendFile(__dirname + "/publice/success.html");
});

app.get("/error", async(req,res) => {
    res.sendFile(__dirname + "/publice/error.html");
});

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})
// is the environment variable, NODE_ENV, set to PRODUCTION? 
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, '../config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/bcd296';
}
const mongoose = require('mongoose');
// my schema goes here!
const Display = new mongoose.Schema({
    id: String,
    user: String,
    name: String,
    colors: [String],
    theme: String,
    responsive: String
});

const User = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    id: {
        type: Number,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    }
});

//contribution not yet used
const Contribution= new mongoose.Schema({
    displayId: String,
    Contribution: String
});


mongoose.connect(dbconf);
mongoose.model("Display", Display);
mongoose.model("User", User);
mongoose.model("Contribution", Contribution);

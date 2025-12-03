const fs = require("fs");
const path = require("path");
const moduleNames = fs.readdirSync(__dirname, {withFileTypes: true}).
    filter(dir => dir.isDirectory()).map(dir => dir.name);
module.exports  = {
    moduleNames
}
const fs = require("fs");
const path = require("path");
const modules = fs.readdirSync(__dirname, {withFileTypes : true})
    .filter(dir => dir.isDirectory())
    .map(dir=> {
        const moduleIndex = path.join(__dirname,dir.name, "index.js")
        const mod = require (moduleIndex);
        return{
            name: dir.name,
            needsLogging: false,
            needsOperator : false,
            ...mod
        }



    });

module.exports  = {
    modules,
    moduleNames: modules.map(m=> m.name)
}
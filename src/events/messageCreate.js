const {modules} = require("@modules")
module.exports =
{
    name :"messageCreate",
    async execute(client, message)
    {
        const messageFunctions = modules.filter(m => typeof(m.onMessage)==="function").map(m=> m.onMessage);
        for(const func of messageFunctions)
        {
            func(message);
        }

    }

}
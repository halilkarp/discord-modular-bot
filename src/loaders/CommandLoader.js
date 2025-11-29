const path = require("path");
const fs = require("fs");

function addCommandFile(client,file,cmdPath)
{
    const command = require(path.join(cmdPath, file));
	//If the file is a single command
    if("data" in command && "execute" in command){
		client.commands.set(command.data.name, command);
		return;
    }
	//If the file exports multiple commands
	if (typeof command === "object") {
		let valid = false;
		for(const key in command){
			const cmd = command[key];
			if("data" in cmd && "execute" in cmd) {
				client.commands.set(cmd.data.name, cmd);
				valid = true;
			}	
			
	
		}
		if(!valid){
				console.warn(`File "${file}" exports no valid commands.`);	
			}
			return;
	}
		console.warn(`File "${file}" exports no valid command.`);
	
}
function loadCommands(client, modulesPath)
{
	const commandsPath = path.join(modulesPath, "commands");

	if(!fs.existsSync(commandsPath)){
		return;
	}
	const items = fs.readdirSync(commandsPath, {withFileTypes: true});
	for (const item of items){
		const itemPath = path.join(commandsPath, item.name);
		 if(item.isFile() && item.name.endsWith(".js")){
			addCommandFile(client, item.name, commandsPath);
		}
		else
			continue;
	}
}


module.exports = (client) =>
 {
    const modulesPath = path.join(__dirname, "../modules");
	const modules = fs.readdirSync(modulesPath, {withFileTypes: true});
	for (const module of modules)
		if(module.isDirectory())
			loadCommands(client, path.join(modulesPath, module.name));
    
    
     console.log("Commands loaded:", client.commands.size);
};

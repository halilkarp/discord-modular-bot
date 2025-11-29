const createPayload = require("./payload.js");

async function getWebhook(channel)
{
    const webhooks = await channel.fetchWebhooks();
    if(webhooks.size == 0)
    {
	const hook = await channel.createWebhook({name: "Cpt. Hook",});
	return hook;
    }
    return webhooks.first()
}

module.exports = async function sendMessage(message, user, channel)
{
    try{
    const webhook = await getWebhook(channel);
    webhook.send(createPayload(message, user));
    }catch(err){ console.log(err.message)}
}


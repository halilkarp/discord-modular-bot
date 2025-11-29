module.exports = function createPayload(message, user)
{
    return {
	content : message,
	username : user.displayName,
	avatarURL : user.displayAvatarURL(),
	allowed_mentions : {parse : ["users","roles"]}
    }
}

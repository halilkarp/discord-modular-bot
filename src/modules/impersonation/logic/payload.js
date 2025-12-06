module.exports = function createPayload(message, user, files)
{
    return {
	content : message,
	username : user.displayName,
	avatarURL : user.displayAvatarURL(),
	allowed_mentions : {parse : ["users","roles"]},
	files : files ? [files] : []
    }
}

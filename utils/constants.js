const { SECRET_JWT } = process.env;
module.exports.SECRET_JWT = SECRET_JWT;
module.exports.AVATAR_URL_REGEX = /^(http|https):\/\/(([A-Z0-9][A-Z0-9_-]*)(\.[A-Z0-9][A-Z0-9_-]*)+)/i;

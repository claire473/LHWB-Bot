const { MessageEmbed } = require('discord.js');
const config = require("./config.json");

function anyUsage(guild, client, text) {
    if (guild) {
        return `\`${client.settings.get(guild.id, 'prefix', config.discord.prefix)}${text}\``
    }
    else {
        return `\`${text}\``
    }
}

function commandUsage(commandName, guild, client, text) {
    return new MessageEmbed()
        .setDescription(`Invalid command usage: the \`${commandName}\` command's accepted format is: ${anyUsage(guild, client, text)}`)
        .setColor('RED')
}

function modRoleCheck(message) {
    return message.member.roles.cache.some(role => role.id === config.discord.subRedditMod) || message.member.roles.cache.some(role => role.id === config.discord.mod);
}

function isMod(message) {
    if (message.guild.id !== config.discord.serverID) return "Server";
    if (isVoiceChannel(message)) return "Voice"
    if (message.member.roles.cache.some(role => role.id === config.discord.subRedditMod) || message.member.roles.cache.some(role => role.id === config.discord.mod)) {
        return null;
    }
    return "Role";
}

function isModNoVC(message) {
    if (message.guild.id !== config.discord.serverID) return "Server";
    if (message.member.roles.cache.some(role => role.id === config.discord.subRedditMod) || message.member.roles.cache.some(role => role.id === config.discord.mod)) {
        return null;
    }
    return "Role";
}

function cmdRestrictions(message) {
    if (message.guild.id !== config.discord.serverID) return "Server";
    if (isVoiceChannel(message)) return "Voice"
    if (modRoleCheck(message)) return null;
    if (message.channel.id !== config.discord.botsChannel) return "Channel";
    if (message.member.roles.cache.some(role => role.id === config.discord.repRole)) {
        return null;
    }
    return "Role";
}

function isVoiceChannel(message) {
    const botVoice = message.client.voice.connections.array()[0].channel.id
    const memberChannel = message.member.voice.channel
    if (memberChannel && memberChannel.id === botVoice) {
        return null;
    }
    return true;
}

function regularRestriction(message) {
    if (message.guild.id !== config.discord.serverID) return "Server";
    if (isVoiceChannel(message)) return "Voice"
    if (message.channel.id === config.discord.botsChannel || modRoleCheck(message)) {
        return null;
    }
    return "Channel";
}

function editDistance(source, target, callback){
    let n = source.length + 1;
    let m = target.length + 1;
    let distMatrix = [];
    let min = 0;
    let i,j;
    for(i = 0; i < n; i++){
        distMatrix[i] = [];
    }
    for(i = 0; i < n; i++){
        distMatrix[i][0] = i;
    }
    for(i = 0; i < m; i++){
        distMatrix[0][i] = i;
    }
    for(i = 1; i < n; i++){
        for (j = 1; j < m; j++){
            if(source.charAt(j-1) === target.charAt(i-1)){
                min = distMatrix[i-1][j-1];
            }else{
                min = Math.min(distMatrix[i-1][j-1] + 1, distMatrix[i-1][j] + 1, distMatrix[i][j-1] + 1);

            }
            distMatrix[i][j] = min;
        }
    }
    callback(distMatrix[n-1][m-1]);
}

function log(content) {
    console.log(`${time()} - ${content}`);
}

function time() {
    const date = new Date();
    return date.toLocaleString();
}

module.exports = { anyUsage, commandUsage, cmdRestrictions, regularRestriction, isMod, isModNoVC, editDistance, log, time }
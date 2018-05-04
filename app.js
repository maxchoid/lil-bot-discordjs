const Discord = require("discord.js");
const music = require('discord.js-music');
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setGame(`jHelp | Developed by Kem!`);
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setGame(`on ${client.guilds.size} servers`);
});


client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();


  if(command === "help") {
    return message.reply("https://twitter.com/JamieBotjs/status/991810840268496896");
    }

  

  
  if(command === "ping") {
    const m = await message.channel.send("Ping?");
    m.edit(`Bad! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }
  
  if(command === "say") { 
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});  
    message.channel.send(sayMessage);
  }
  
  
  
  if(command === "kick") {

    if(!message.member.roles.some(r=>["lil", "Moderator"].includes(r.name)) )
      return message.reply("Sorry, you don't ave permissions to use this!");
    

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    // very tired
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Tell me why!");
    
    // good quickscope 
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} is gona because of ${message.author.tag} because: ${reason}`);

  }
let PREFIX = 'j'

client.on('message', message => {
  
  if (message.content.startsWith(PREFIX + 'Userinfo')) {

    const UserInfo = new Discord.MessageEmbed()

        

        .setAuthor(message.author.username, message.author.avatarURL())  
        .setTitle('UserInfo')
        .setURL('www.google.com') 
        .setColor('RANDOM') 
        .setImage(message.author.avatarURL()) 
        .setThumbnail(message.author.avatarURL()) 

        

        .addField('Avatar', message.author.avatar, true) 
        .addField('AvatarURL', message.author.avatarURL({
            format: 'png'
        }), true) 
        .addField('AvatarURL', message.author.avatarURL({
            size: '2048'
        }), true)
        .addField('Bot', message.author.bot, true) 
        .addField('Created At', message.author.createdAt, false) 
        .addField('Discrim', message.author.discriminator, true) 
        .addField('DMChannel', message.author.dmChannel) 
        .addField('ID', message.author.id) 
        .addField('Last Message', message.author.lastMessage) 
        .addField('Last Message ID', message.author.lastMessageID) 
        .addField('Presence', message.author.presence) 
        .addField('Presence Status', message.author.presence.status) 
        .addField('Presence Game', message.author.presence.activity.name) 
        .addField('Tag', message.author.tag) 
        .addField('Username', message.author.username) 
        .addField('Nick Name', message.guild.member(target).displayName) 

        .setFooter('Requested By', message.author.tag) 
        .setTimestamp() 

    message.channel.send(UserInfo);
}
  
  if(command === "ban") {
    if(!message.member.roles.some(r=>["lil"].includes(r.name)) )
      return message.reply("No!");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.bannable) 
      return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");

    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Tell me why!");
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry m9 ${message.author} I couldn't ban that dude because of : ${error}`));
    message.reply(`${member.user.tag} got quickscoped (banned) by ${message.author.tag} because: ${reason}`);
  }

  if(command === "quote") {
    const [channelid, messageid, quotename, ...note] = args.splice(1);
    const channel = channelid == "here" ? message.channel : client.channels.get(channelid);
    const message = messageid === "last" ? msg.channel.messages.last(2)[0] : await channel.messages.get(messageid);
    insertInDB(quotename, channel.id, message.id, note.join(" "));
  }
  
  if(command === "purge") {
    if(!message.member.roles.some(r=>["lil"].includes(r.name)) )
      return message.reply("Sorry, you don't have permissions to use this!");

    const deleteCount = parseInt(args[0], 10);
    
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Sorry, you have to put in a number of messages to delete.");
    
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
  }


});	  

	  
client.login(config.token);        
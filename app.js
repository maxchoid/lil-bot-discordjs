const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const ms = require("ms");
const moment = require("moment");

client.on("ready", () => {
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`); 
  client.user.setGame('Made by Kem. (Alpha)');
  client.user.setStatus('Online')
});

client.on("guildCreate", guild => {
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

client.on("guildDelete", guild => {
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});

client.on("message", async message => {
  if(message.author.bot) return;
  if(message.content.indexOf(config.prefix) !== 0) return;
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase()

if(command === "server") {
  const embed = new Discord.RichEmbed()
        .setTitle('Server Statistics')
        .setColor('RANDOM')
        .addField('Members', `**${message.guild.memberCount}**`, true)
        .addField('Humans', `**${message.guild.members.filter(member => !member.user.bot).size}**`, true)
        .addField('Bots', `**${message.guild.members.filter(member => member.user.bot).size}**`, true)
        .setTimestamp()
  message.channel.send(embed);
};

if(command === 'userinfo') {
  let user;
    if (message.mentions.users.first()) {
      user = message.mentions.users.first();
    } else {
        user = message.author;
    }
    const member = message.guild.member(user);
	
    const embed = new Discord.RichEmbed()
		.setColor('RANDOM')
		.setThumbnail(user.avatarURL)
		.setTitle(`${user.username}#${user.discriminator}`)
		.addField("ID:", `${user.id}`, true)
		.addField("Nickname:", `${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
		.addField("Created At:", `${moment.utc(user.createdAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
		.addField("Joined Server:", `${moment.utc(member.joinedAt).format('dddd, MMMM Do YYYY, HH:mm:ss')}`, true)
		.addField("Bot:", `${user.bot}`, true)
		.addField("Status:", `${user.presence.status}`, true)
		.setFooter(`Replying to ${message.author.username}#${message.author.discriminator}`)
     message.channel.send({embed});
    }

if(command === "mute") {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply("Sorry, you do not have the perms to do that! :x:");
  let tomute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!tomute) return message.reply("Cannot find them!");
  if (tomute.hasPermission("MANAGE_MESSAGES")) return message.reply("Can\'t mute them!");
  let muterole = message.guild.roles.find(`name`, "Muted");

  if (!muterole) {
      try {
          muterole = await message.guild.createRole({
              name: "Muted",
              color: "#000000",
              permissions: []
          })
          message.guild.channels.forEach(async (channel, id) => {
              await channel.overwritePermissions(muterole, {
                  SEND_MESSAGES: false,
                  ADD_REACTIONS: false
              });
          });
      } catch (e) {
          console.log(e.stack);
      }
  }

  let mutetime = args[1];
  if (!mutetime) return message.reply("You didn't specify a time!");

  await (tomute.addRole(muterole.id));
  message.reply(`<@${tomute.id}> got muted for ${ms(ms(mutetime))}`);

  setTimeout(function() {
      tomute.removeRole(muterole.id);
      message.channel.send(`<@${tomute.id}> has been unmuted!`);
  }, ms(mutetime));

}

exports.conf = {
  aliases: [],
  permLevel: 2
};

module.exports.help = {
  name: "mute",
  description: 'Denies the user from speaking for the time provided.',
  usage: 'mute [time: hours, minitues, or days.]'
}

if(command === "ping") {
    const m = await message.channel.send("Loading");
    m.edit(`Your latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if(command === "say") { 
    const sayMessage = args.join(" ");
    message.delete().catch(O_o=>{});  
    message.channel.send(sayMessage);
  }
  
  
  if(command === "kick") {

    if(!message.member.roles.some(r=>["lil", "Moderator"].includes(r.name)) )
      return message.reply("No :x: You don't have the perms!");
    

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Please mention a valid member of this server");
    if(!member.kickable) 
      return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
    
    let reason = args.slice(1).join(' ');
    if(!reason)
      return message.reply("Tell me why!");
    
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
    message.reply(`${member.user.tag} is gona because of ${message.author.tag} because: ${reason}`);

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
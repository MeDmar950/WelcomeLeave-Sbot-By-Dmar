const { Client } = require('discord.js');
const client = new Client();
const { Canvas } = require('canvas-constructor');
const canvas = require('canvas');
const { connect } = require('mongoose');
const prefix = '$';

const WelcomeLeaveModel = require('./models/WelcomeLeave');

client.on('ready', _ => {
    console.log('Ready');
    connect("MongoDB URL", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    }).then(console.log('Conntect DataBase'))
})


client.on('message', async(message) => {
    if(message.author.bot) return;
    if(message.content.startsWith(prefix + 'setwelcome')) {
        if(!message.author.hasPermissions("MANAGE_CHANNELS")) return;
        let args = message.content.split(' ');
        let channel = message.mentions.channels.first() || message.guild.channels.cache.find((ch) => ch.id === args.join(' ')) || message.guild.channels.cache.find((ch) => ch.name === args.join(' '));
        if(!channel) return message.channel.send(`**Usage: ${prefix}setwelcome \`<#Channel/ID/Name>\`**`);
        WelcomeLeaveModel.findOne({
            guildID: message.guild.id
        }, async(err, doc) => {
            if(err) console.log(err);

            if(!doc) {
                new WelcomeLeaveModel({
                    guildID: message.guild.id,
                    WelcomeChannel: channel.id,
                }).save();
                message.channel.send(`**✅ Done Has Been Selected Welcome Channel**`);
            } else {
                doc.WelcomeChannel = channel.id;
                doc.save();
                message.channel.send(`**✅ Done Has Been Selected Welcome Channel**`);
            }
        })
    } else if(message.content.startsWith(prefix + 'setleave')) {
        if(!message.author.hasPermissions("MANAGE_CHANNELS")) return;
        let args = message.content.split(' ');
        let channel = message.mentions.channels.first() || message.guild.channels.cache.find((ch) => ch.id === args.join(' ')) || message.guild.channels.cache.find((ch) => ch.name === args.join(' '));
        if(!channel) return message.channel.send(`**Usage: ${prefix}setleave \`<#Channel/ID/Name>\`**`);
        WelcomeLeaveModel.findOne({
            guildID: message.guild.id
        }, async(err, doc) => {
            if(err) console.log(err);

            if(!doc) {
                new WelcomeLeaveModel({
                    guildID: message.guild.id,
                    LeaveChannel: channel.id,
                }).save();
                message.channel.send(`**✅ Done Has Been Selected Leave Channel**`);
            } else {
                doc.LeaveChannel = channel.id;
                doc.save();
                message.channel.send(`**✅ Done Has Been Selected Leave Channel**`);
            }
        })
        
    }
})
client.on('guildMemberAdd', async(member) => {
    let data = await WelcomeLeaveModel.findOne({guildID: member.guild.id});
    let channel = member.guild.channels.cache.get(data.WelcomeChannel);
    if(!channel) return;
    let MemberSub = member.user.tag.length > 15 ? member.user.tag.substring(0, 10) + '...' : member.user.tag;
    let avatar = await canvas.loadImage(member.user.displayAvatarURL({format: 'png'}));
        const background = await canvas.loadImage('https://cdn.discordapp.com/attachments/772888285226729544/790589224905605180/welcome.png');
        let welcome = await new Canvas(1080, 591)
        .printImage(background, 0, 0, 1080, 591)
        .setTextFont('40px Arial')
        .printText(MemberSub, 447, 476)
        .setTextFont('36px Arial')
        .setColor('#ffffff')
        .printText(member.user.discriminator, 76, 498)
        .printText('join', 898, 498)
        .printCircularImage(avatar, 541, 258, 171)
        .toBuffer();
        await channel.send(`**Welcome To The Server ${member.guild.name}**, User **${member.user.username}** You Member Number : **${member.guild.memberCount}**`).then(() => {
            channel.send({files: [welcome]});
})
});

client.on('guildMemberRemove', async(member) => {
    let data = await WelcomeLeaveModel.findOne({guildID: member.guild.id});
    let channel = member.guild.channels.cache.get(data.LeaveChannel);
    if(!channel) return;
    let MemberSub = member.user.tag.length > 15 ? member.user.tag.substring(0, 10) + '...' : member.user.tag;
        let avatar = await canvas.loadImage(member.user.displayAvatarURL({format: 'png'}));
        const background = await canvas.loadImage('https://cdn.discordapp.com/attachments/772888285226729544/790589224905605180/welcome.png');
        let leave = await new Canvas(1080, 591)
        .printImage(background, 0, 0, 1080, 591)
        .setTextFont('40px Arial')
        .printText(MemberSub, 437, 476)
        .setTextFont('36px Arial')
        .setColor('#ffffff')
        .printText(member.user.discriminator, 76, 498)
        .printText('leave', 898, 498)
        .printCircularImage(avatar, 541, 258, 171)
        .toBuffer();
        await channel.send(`**Good Bay ${member.user.tag}**`).then(() => {
            channel.send({files: [leave]});
})
});
client.login('TOKEN HERE')

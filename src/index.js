require('dotenv').config();

const {
    greetings, bannedWords, funnyEmojiReactionList, glassesEmojiReactionList
} = require('./lists')

const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,        
    ]
});

//Bot ready
client.on('ready', (c) => {
    console.log(
        `\n${c.user.username} is online and up to date.\n`
        );
});

//Random welcome message
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

client.on('messageCreate', (message) => {
    if(message.author.bot){
        return;
    }
    const num = getRandomInt(5);
    const msg = message.content.toLowerCase();
    const user = message.author;

    //User welcome message
    for(let i = 0; i < greetings.length; i++){
        if(msg === greetings[i]){
            switch(num){
                case 0: 
                    message.reply(
                        `Hello, ${message.author.username}`
                        );
                    break;
                case 1: 
                    message.reply(
                        `Hi, ${message.author.username}`
                        );
                    break;
                case 2:
                    message.reply(
                        `Hello sir, ${message.author.username}!`
                        );
                    break;
                case 3: 
                    message.reply(
                        "Hellow"
                        );
                    break;
                default:
                    break;
            }
        }
    }

    //User actions
    for(let i = 0; i < bannedWords.length; i++){
        if(msg.includes(bannedWords[i])){
            try{
                if (!message.guild.members.me.permissions.has('KickMembers')) {
                    console.log(
                        'Bot nie ma uprawnień do wyrzucania użytkowników!\n'
                        );
                    return;
                }
                message.guild.members.kick(user, {reason: `Uzycie zakazanej frazy: "${bannedWords[i]}"`});
                console.log(
                    `Uzytkownik ${user} zostal wyrzucony z serwera.\nPowod: uzycie zakazanej frazy "${bannedWords[i]}".\n`
                    );
                message.channel.send(
                    `${user.tag} został wyrzucony z serwera za użycie zakazanej frazy.`
                    );
                message.delete();
            }catch(error){
                console.error(
                    `Blad podczas banowania uzytkownika: "${user}"\n`
                    );
            }
        }
    }

    //Emoji reaction to message
    if(message.author.username === "evined" && message.channel.name === "welcome"){
        try{
            message.react('🫡');
            console.log(
                `Dodano reakcje "${'🫡'}" do wiadomosci szefa "${msg}" na kanale "${message.channel.name}".\n`
                );
        }catch(error){
            console.error(
                `Blad podczas reagowania na wiadomosc.\n`
                );
        }
    }
    for(let i = 0; i < funnyEmojiReactionList.length; i++){
        if(msg.includes(funnyEmojiReactionList[i])){
            try{
                message.react('😅');
                console.log(
                    `Dodano reakcje "${'😅'}" do wiadomosci "${msg}".\n`
                    );
            }catch(error){
                console.error(
                    `Blad podczas reagowania na wiadomosc.\n`
                    );
            }
        }
    }
    for(let i = 0; i < glassesEmojiReactionList.length; i++){
        if(msg.includes(glassesEmojiReactionList[i])){
            try{
                message.react('😎');
                console.log(
                    `Dodano reakcje "${'😎'}" do wiadomosci "${msg}".\n`
                    );
            }catch(error){
                console.error(
                    `Blad podczas reagowania na wiadomosc.\n`
                    );
            }
        }
    }
    
});
    //Message sent
client.on('messageCreate', (message) => {
    const msg = message.content.toLowerCase();
    const user = message.author;
    const logChannel = message.guild.channels.cache.find(channel => channel.name === "message-logs");

    if(message.author.bot){
        return;
    }
    
    if(!logChannel){
        return;
    }
    logChannel.send(
        `**${user.tag}** SENT a message to ( **#${message.channel.name}** ) that contains:\n "${msg}"`
    );
})

    //Message edit
client.on('messageUpdate', async (oldMessage, newMessage) => {
    const logChannel = oldMessage.guild.channels.cache.find(ch => ch.name === "message-logs");
    if (oldMessage.author.bot || newMessage.author.bot){
        return;
    }

    if (!logChannel) {
        return;
    }
    logChannel.send(
        `**${oldMessage.author.tag}** EDITED a message on **#${oldMessage.channel.name}**:
        **Before:** 
        \`
        ${oldMessage.content}
        \`
        **After:** 
        \`
        ${newMessage.content}
        \``
    );
});

    //Message delete log
client.on('messageDelete', (message) =>{
    const logChannel = message.guild.channels.cache.find(channel => channel.name === "message-logs");
    if(message.author.bot){
        return;
    }
    const msg = message.content;
    const user = message.author;
    if(!logChannel){
        return;
    }
    logChannel.send(
        `**${user.tag}** DELETED a message on ( **#${message.channel.name}** ) which contained:\n "${msg}"`
    );
});



//Login via token
client.login(process.env.DISCORD_TOKEN);


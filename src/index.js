require('dotenv').config();

const {
    greetings, bannedWords, funnyEmojiReactionList, glassesEmojiReactionList, obraza
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

//Informacja o poprawnym dzialaniu bota
client.on('ready', (c) => {
    console.log(`\n${c.user.username} is online and up to date.\n`);
});

//Losowa wiadomosc powitalna
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

    //Przywitanie sie z uzytkownikiem za pomoca losowej frazy
    for(let i = 0; i < greetings.length; i++){
        if(msg === greetings[i]){
            switch(num){
                case 0: 
                    message.reply(`Hello, ${message.author.username}`);
                    break;
                case 1: 
                    message.reply(`Hi, ${message.author.username}`);
                    break;
                case 2:
                    message.reply(`Hello sir, ${message.author.username}!`);
                    break;
                case 3: 
                    message.reply("Hellow");
                    break;
                default:
                    break;
            }
        }
    }

    //Kickowanie uzytkownika gdy napisze niedozwolona fraze
    for(let i = 0; i < bannedWords.length; i++){
        if(msg.includes(bannedWords[i])){
            try{
                if (!message.guild.members.me.permissions.has('KickMembers')) {
                    console.log('Bot nie ma uprawnień do wyrzucania użytkowników!\n');
                    return;
                }
                message.guild.members.kick(user, {reason: `Uzycie zakazanej frazy: "${bannedWords[i]}"`});
                console.log(`Uzytkownik ${user} zostal wyrzucony z serwera.\nPowod: uzycie zakazanej frazy "${bannedWords[i]}".\n`);
    
                message.channel.send(`${user.tag} został wyrzucony z serwera za użycie zakazanej frazy.`);
                message.delete();
            }catch(error){
                console.error(`Blad podczas banowania uzytkownika: "${user}"\n`);
            }
        }
    }
    
});

//Reagowanie na wiadmosc za pomoca emotek, ktora zawiera konkretna faze
client.on('messageCreate', (message) => {
    if(message.author.bot){
        return;
    }
    const temp = message.content.toLowerCase();

    if(message.author.username === "evined" && message.channel.name === "welcome"){
        try{
            message.react('🫡');
            console.log(`Dodano reakcje "${'🫡'}" do wiadomosci szefa "${temp}" na kanale "${message.channel.name}".\n`);
        }catch(error){
            console.error(`Blad podczas reagowania na wiadomosc.\n`);
        }
    }

    //😅
    for(let i = 0; i < funnyEmojiReactionList.length; i++){
        if(temp.includes(funnyEmojiReactionList[i])){
            try{
                message.react('😅');
                console.log(`Dodano reakcje "${'😅'}" do wiadomosci "${temp}".\n`);
            }catch(error){
                console.error(`Blad podczas reagowania na wiadomosc.\n`);
            }
        }
    }

    //😎
    for(let i = 0; i < glassesEmojiReactionList.length; i++){
        if(temp.includes(glassesEmojiReactionList[i])){
            try{
                message.react('😎');
                console.log(`Dodano reakcje "${'😎'}" do wiadomosci "${temp}".\n`);
            }catch(error){
                console.error(`Blad podczas reagowania na wiadomosc.\n`);
            }
        }
    }
});

//Logowanie poprzez token
client.login(process.env.DISCORD_TOKEN);

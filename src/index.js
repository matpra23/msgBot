require('dotenv').config();

const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,        
    ]
});

client.on('ready', (c) => {         //Informacja o poprawnym dzialaniu bota
    console.log(`${c.user.username} is online and up to date`);
});

function getRandomInt(max) {        //Losowa liczba na powitanie
    return Math.floor(Math.random() * max);
}

const greetings = ["Hello", "Hi"];      //Tablica przywitan

client.on('messageCreate', (message) => {       //Przywitanie
    if(message.author.bot){
        return;
    }
    let num = getRandomInt(5);
    for(let i = 0; i < greetings.length; i++){
        if(message.content === greetings[i]){
            switch(num){
                case 0: 
                    message.reply("Hello");
                    break;
                case 1: 
                    message.reply("Hi!");
                    break;
                case 2:
                    message.reply("Hello sir!");
                    break;
                case 3: 
                    message.reply("Hellow");
                    break;
                case 4:
                    message.reply("Yoooooo!");
                    break;
                default:
                    break;
            }
        }
    }
});

const bannedWords = [       //Tablica niedozwolonych fraz
    "test"
];

client.on('messageCreate', (message) => {       //Kickowanie uzytkownika gdy napisze niedozwolona fraze
    if(message.author.bot){
        return;
    }
    const userToKick = message.author;

    for(let i = 0; i < bannedWords.length; i++){
        if(message.content.includes(bannedWords[i])){
            try{
                if (!message.guild.members.me.permissions.has('KickMembers')) {
                    console.log('Bot nie ma uprawnień do wyrzucania użytkowników!');
                    return;
                }
                message.guild.members.kick(userToKick, {reason: `Uzycie zakazanej frazy: "${bannedWords[i]}"`});
                console.log(`Uzytkownik ${userToKick} zostal wyrzucony z serwera.\npowod: uzycie zakazanej frazy "${bannedWords[i]}"`);
    
                message.channel.send(`${userToKick.tag} został wyrzucony z serwera za użycie zakazanej frazy.`);
                message.delete();
            }catch(error){
                console.error(`Blad podczas banowania uzytkownika: "${userToKick}"`);
            }
        }
    }
})

client.login(process.env.DISCORD_TOKEN);        //Logowanie poprzez token
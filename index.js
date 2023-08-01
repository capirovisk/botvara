import { config } from "dotenv";
import { Client } from "tmi.js";
import { readFileSync, writeFileSync } from "fs";
config();

function setUpTodayProject(commands) {
    return JSON.parse(readFileSync('today_project.json', 'utf8')).project;
}

function saveNewTodayProject(project) {
    writeFileSync('today_project.json', JSON.stringify(project));
}

let todayProject = setUpTodayProject();

const oauth = process.env.OAUTH;
const discord_link = process.env.DISCORD_LINK;

const client = new Client({
    identity: {
        username: 'capirovisk',
        password: oauth
    },
    channels: [ 'capirovisk' ]
});

const commands = [
    {
        title: "!pog",
        tag: "@ ",
        message: "voce e muito Pog.",
        type: "output"
    },
    {
        title: "!hoje",
        message: `O projeto de hoje: ${todayProject}`,
        type: "output"
    },
    {
        title: "!setp",
        admin: true,
        message: "",
        type: "input"
    },
    {
        title: "!discord",
        tag: "@",
        message: discord_link,
        type: "output"
    },
    {
        title: "!php",
        message: "Mais um programador php ganhou uma ferraria",
        type: "output"
    },
    {
        title: "!javascript",
        message: "(const arr = [] == '') => true",
        type: "output"
    }
]


client.connect().catch(console.error).finally(() => {
    console.log("Bot connectado.");
});
client.on('message', (channel, tags, message, self) => {
    const commandSlice = message.split(" ")[0]
	if(self) return;
    for (const command of commands) {
        if (command.title !== commandSlice) {
            console.log(`Not equal: ${command.title} & ${message}`);
            continue
        }
        if (command.title === commandSlice) {
            let newMessage = command.message;
            if (command.tag) {
                command.tag += tags.username;
                newMessage = `${command.tag} ${newMessage}`;
            }
            if (command.admin && tags.username !== "capirovisk") {
                client.say(channel, "This command is only for admin or trusted users.")
            }
            if (command.admin && tags.username === "capirovisk") {
                if (command.type === "input") {
                    const splittedMessage = message.split(commandSlice)[1]
                    console.log(splittedMessage);
                    const project = {
                        project: splittedMessage
                    };
                    saveNewTodayProject(project);
                    todayProject = setUpTodayProject();
                    commands[1] = {
                        title: "!hoje",
                        message: `O projeto de hoje: ${todayProject}`,
                        type: "output"
                    };
                    client.say(channel, `O projeto de hoje foi setado para ${splittedMessage}`);
                }
            }
            client.say(channel, command.message);
        }
    }
});
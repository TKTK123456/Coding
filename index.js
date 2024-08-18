import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  Activity,
  SlashCommandBuilder,
  Partials,
  PermissionsBitField,
  RoleFlagsBitField,
  RoleManager,
  ChannelType,
  ActivityType
} from "discord.js";
import fs from "node:fs";
import path from "node:path";
import talkToCreatorWebhook from "./talkToCreatorWebhook.js";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildWebhooks,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User],
});
const __dirname = path.resolve();
client.login(process.env.TOKEN)
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({
    activities: [{ name: `for hi`, type: ActivityType.Watching }],
    status: 'online',
  });
})
client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
let commandNames = ""
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("name" in command && "execute" in command) {
      commandNames += command.name + "\n"
      client.commands.set(command.name, command.execute);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "name" or "execute" property.`,
      );
    }
  }
}
fs.writeFileSync(path.join(__dirname, "commands.txt"), commandNames)
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  const prefix = `<@${client.user.id}>`;
  if (!message.content.toLowerCase().startsWith(prefix)) return
    const args = message.content.toLowerCase().slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift();
    const command = message.client.commands.get(commandName);
    if (!command) return;
    try {
      await command(message);
    } catch (error) {
      console.error(error);
      message.reply("There was an error trying to execute that command!");
    }
});
talkToCreatorWebhook()
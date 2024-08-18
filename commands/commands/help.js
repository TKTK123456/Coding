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
  EmbedBuilder
} from "discord.js";
import fs from "node:fs";
import path from "node:path";
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
async function getCommands() {
  const commands = fs.readFileSync(path.join(__dirname, "commands.txt"), "utf-8")
  return commands
}
export const name = 'help';
  export const discription = `Get's the bot's commands`;;
export async function execute(message) {
  Promise.resolve(getCommands()).then((value) => {
  const sendReply = new EmbedBuilder() 
  .setTitle("Commands")
  .setDescription(value);
  message.reply({ embeds: [sendReply] })
  })
};
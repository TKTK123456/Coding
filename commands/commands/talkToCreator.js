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
export const name = 'talktocreator';
  export const discription = `Talk to the bot's creator!`;;
export async function execute(message) {
  message.author.createDM().then(async (channel) => {
    channel.send(`Hello ${message.author}!`)
    const talkToCreators = fs.readFileSync(path.join(__dirname, "talkToCreator.txt"), "utf-8")
    client.guilds.cache.get(`1222327428366729337`)
      client.guilds.cache.get(`1222327428366729337`).channels.create({
          name: `Talk to ${message.author.username}`,
          type: ChannelType.GuildText
      })
    .then(channel => {
      console.log(message.author.username)
      console.log(message.author.avatarURL())
      channel.createWebhook({
        avatar: message.author.avatarURL(),
        name: message.author.username
      }).then(webhook => {
        fs.writeFileSync(path.join(__dirname, "talkToCreator.txt"), `${talkToCreators}${message.author.id}:${channel.id}:${webhook.id}\n`)
      })
    })
    })
}
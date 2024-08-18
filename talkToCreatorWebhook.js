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
  Webhook
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
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.type === ChannelType.DM) {
    const talkToCreator = fs.readFileSync(path.join(__dirname, "talkToCreator.txt"), "utf-8")
    if (!talkToCreator.includes(message.author.id)) return;
    const channelId = talkToCreator.split("\n").find(line => line.startsWith(`${message.author.id}:`)).split(':')[1]
    const webhooks = await client.channels.cache.get(channelId).fetchWebhooks()
    const webhook = webhooks.find(webhook => webhook.name === message.author.username)
    webhook.send({
      content: message.content,
      username: message.author.username,
      avatarURL: message.author.avatarURL(),
    })
  } else {
    const talkToCreator = fs.readFileSync(path.join(__dirname, "talkToCreator.txt"), "utf-8")
    if (!talkToCreator.includes(message.channel.id)) return;
    const sendDmToUserId = talkToCreator.split("\n").find(line => line.includes(`${message.channel.id}:`)).split(':')[0]
    client.users.send(sendDmToUserId, message.content);
  }
})
export default function talkToCreatorWebhook() {
  client.login(process.env.TOKEN)
}

const { Client, GatewayIntentBits } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const config = require('./config.json');

// Включение интентов
const intents = [
  'GUILDS',
  'GUILD_MEMBERS',
  'GUILD_MESSAGES',
  'GUILD_VOICE_STATES',
  // Другие интенты, которые вам нужны
];

const client = new Client({ intents });

client.commands = new Map();

const commandFolders = fs.readdirSync('./src/slash');

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./src/slash/${folder}`).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./src/slash/${folder}/${file}`);
    client.commands.set(command.data.name, command);
  }
}

const commands = [];

client.commands.forEach(command => {
  commands.push(command.data);
});

const clientId = ''; // Замените на ваш ID клиента бота
const guildId = ''; // Замените на ID вашего сервера

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (!client.commands.has(commandName)) return;

  try {
    await client.commands.get(commandName).execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'Ошибка!', ephemeral: true });
  }
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  
  // Установка статуса бота
  client.user.setActivity('бета-тест | /help', { type: 'WATCHING' });

  // Ваш остальной код...
});

// Аутентификация бота
client.login(config.token);

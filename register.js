const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, token } = require('./config.json'); // Замените на свои значения

const commands = [];

// Добавьте команды в массив `commands`

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Зарегистрирование слэш команд...');

    await rest.put(Routes.applicationGuildCommands(clientId, '797083844922048582'), {
      body: commands,
    });

    console.log('Слэш команды успешно зарегистрированы.');
  } catch (error) {
    console.error(error);
  }
})();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Показать пинг бота'),

  async execute(interaction) {
    // Создаем встроенное сообщение (MessageEmbed) для вывода пинга
    const embed = new MessageEmbed()
      .setColor('#3498db')
      .setTitle('Пинг бота');

    // Вычисляем задержку между отправкой и редактированием сообщения
    const ping = Date.now() - interaction.createdTimestamp;

    // Добавляем информацию о пинге во встроенное сообщение
    embed.setDescription(`Задержка API: ${ping} мс\nЗадержка шлюза: ${interaction.client.ws.ping} мс`);

    // Отправляем встроенное сообщение
    await interaction.reply({ embeds: [embed] });
  },
};

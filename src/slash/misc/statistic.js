const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessagePayload, MessageEmbed } = require('discord.js');
const config = require('../../../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('statistic')
    .setDescription('Отобразить статистику бота'),
  async execute(interaction) {
    const guild = interaction.guild;
    const owner = await guild.fetchOwner();
    const requester = interaction.user.tag; // Получаем тег пользователя, который запросил команду

    const serverAvatarURL = guild.iconURL({ dynamic: true }) || '';

    const serverInfoEmbed = new MessageEmbed()
      .setColor(0x00FF00)
      .setTitle(`Информация о боте ${interaction.client.user.tag}`)
      .addFields(
        { name: 'Создатель', value: `:crown: ${owner.user.tag}`, inline: true },
        { name: 'Участников', value: `:busts_in_silhouette: ${guild.memberCount.toString()}`, inline: true },
        { name: 'Серверов', value: `:shield: ${interaction.client.guilds.cache.size.toString()}`, inline: true },
        { name: 'Shard', value: `:gem: 1`, inline: true },
        { name: 'Количество команд', value: `:gear: ${interaction.client.commands.size.toString()}`, inline: true },
        { name: 'Пинг', value: `:ping_pong: ${interaction.client.ws.ping} МС`, inline: true },
        { name: 'Использовано памяти', value: `:computer: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} МБ`, inline: true },
        { name: 'Discord сервер поддержки', value: `https://discord.gg/9Ha2mk7Jg9`, inline: true },
        { name: 'Поддержать разработчика', value: `https://www.donationalerts.com/r/daianu`, inline: true }
      )
      .setFooter(`Запросил ${requester} | Бот находится на бета-тесте!`, interaction.user.displayAvatarURL())
      .setTimestamp();

    interaction.reply({ embeds: [serverInfoEmbed] });
  },
};

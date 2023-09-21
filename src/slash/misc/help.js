const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Показать список команд.'),
  async execute(interaction) {
    const moderationCommands = [
      '/ban', '/unban', '/mute', '/unmute', '/warn', '/unwarn', '/warns', '/kick', '/clear',
    ];

    const funCommands = [
      '/8ball', '/dick', '/anime', '/cat', '/kiss', '/love', '/dog',
    ];

    const miscCommands = [
      '/help', '/ping', '/statistic', '/serverinfo', '/donation', '/invite',
    ];

    const embed = new MessageEmbed()
      .setColor('#FFFAFA')
      .setTitle('Меню помощи Shiku')
      .setDescription('Подсказка: Чтобы использовать команду, просто введите ее название.\n\n' +
        `**:tools: Модерация (${moderationCommands.length})**: ${moderationCommands.join(', ')}\n` +
        `**:video_game: Веселье (${funCommands.length})**: ${funCommands.join(', ')}\n` +
        `**:gear: Прочее (${miscCommands.length})**: ${miscCommands.join(', ')}`
      )
      .setFooter(`Команду запросил: ${interaction.user.tag}`, interaction.user.displayAvatarURL())
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  },
};

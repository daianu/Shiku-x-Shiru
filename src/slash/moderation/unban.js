const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Разблокировать участника на сервере')
    .addStringOption(option =>
      option.setName('участник')
        .setDescription('ID пользователя, которого нужно разблокировать')
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.member;
    const userToUnbanId = interaction.options.getString('участник');

    if (!member.permissions.has('BAN_MEMBERS')) {
      return interaction.reply('У вас нет прав на разблокировку участников.');
    }

    try {
      await interaction.guild.bans.remove(userToUnbanId);
      interaction.reply(`Участник с ID ${userToUnbanId} был разблокирован.`);
    } catch (error) {
      console.error(error);
      interaction.reply('Произошла ошибка при разблокировке участника.');
    }
  },
};

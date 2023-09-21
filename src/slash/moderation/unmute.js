const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Снять заглушку с участника на сервере')
    .addUserOption(option =>
      option.setName('участник')
        .setDescription('Участник, с которого нужно снять заглушку')
        .setRequired(true)
    ),
  async execute(interaction) {
    const member = interaction.member;
    const userToUnmute = interaction.options.getMember('участник');

    if (!member.permissions.has('MANAGE_ROLES')) {
      return interaction.reply('У вас нет прав на снятие заглушки участников.');
    }

    const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

    if (!muteRole) {
      return interaction.reply('На сервере не найдена роль для заглушки. Создайте роль с именем "Muted".');
    }

    try {
      await userToUnmute.roles.remove(muteRole);
      interaction.reply(`${userToUnmute} была успешно разглушена.`);
    } catch (error) {
      console.error(error);
      interaction.reply('Произошла ошибка при снятии заглушки участника.');
    }
  },
};

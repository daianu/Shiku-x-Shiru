const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Заглушить участника на сервере')
    .addUserOption(option =>
      option.setName('участник')
        .setDescription('Участник, которого нужно заглушить')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('причина')
        .setDescription('Причина заглушки (не обязательно)')
        .setRequired(false)
    ),
  async execute(interaction) {
    const member = interaction.member;
    const userToMute = interaction.options.getMember('участник');
    const reason = interaction.options.getString('причина') || 'не указана'; // Получаем значение причины или устанавливаем по умолчанию "не указана"

    if (!member.permissions.has('MANAGE_ROLES')) {
      return interaction.reply('У вас нет прав на заглушку участников.');
    }

    const muteRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

    if (!muteRole) {
      return interaction.reply('На сервере не найдена роль для заглушки. Создайте роль с именем "Muted".');
    }

    try {
      await userToMute.roles.add(muteRole);
      interaction.reply(`Участник ${userToMute} был успешно замьючен.\nПричина: ${reason}`);
    } catch (error) {
      console.error(error);
      interaction.reply('Произошла ошибка при заглушке участника.');
    }
  },
};

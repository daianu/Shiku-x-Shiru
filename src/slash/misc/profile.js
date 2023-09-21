const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('profile')
    .setDescription('Просмотр профиля участника')
    .addUserOption(option =>
      option.setName('участник')
        .setDescription('Участник, профиль которого вы хотите просмотреть')
    ),
  async execute(interaction) {
    try {
      // Отложить ответ на взаимодействие
      await interaction.deferReply();

      const user = interaction.options.getUser('участник') || interaction.user;

      // Создать и отправить сообщение с информацией о профиле
      const embed = new MessageEmbed()
        .setColor('#FFFAFA')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .setTitle(`Профиль участника: ${user.tag}`)
        .addField('ID', user.id, true)
        .addField('Пользовательский статус', user.presence?.activities[0]?.state || 'Не задан', true);

      // Дата регистрации аккаунта
      if (user.createdAt) {
        embed.addField('Дата регистрации аккаунта', user.createdAt.toUTCString(), true);
      } else {
        embed.addField('Дата регистрации аккаунта', 'Неизвестно', true);
      }

      // Дата захода на сервер
      if (user.joinedAt) {
        embed.addField('Дата захода на сервер', user.joinedAt.toUTCString(), true);
      } else {
        embed.addField('Дата захода на сервер', 'Неизвестно', true);
      }

      // Добавляем "Команду выполнил" в footer
      embed.setFooter(`Команду выполнил: ${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true }));

      // Отправить ответ на взаимодействие
      await interaction.followUp({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.followUp('Произошла ошибка при получении информации о профиле.');
    }
  },
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Очистка сообщений в чате')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('Количество сообщений для очистки')
        .setRequired(true)),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');
    const channel = interaction.channel;

    if (amount < 1 || amount > 100) {
      return interaction.reply('Количество сообщений для очистки должно быть от 1 до 100.');
    }

    const embed = new MessageEmbed()
      .setColor('#FFFAFA')
      .setTitle('Очистка сообщений')
      .setDescription(`Вы уверены, что хотите удалить последние ${amount} сообщений?`)
      .setFooter(`${interaction.user.tag}`, interaction.user.displayAvatarURL())
      .setTimestamp();

    const acceptButton = new MessageButton()
      .setCustomId('clear_accept')
      .setLabel('Принять')
      .setStyle('SUCCESS');

    const cancelButton = new MessageButton()
      .setCustomId('clear_cancel')
      .setLabel('Отменить')
      .setStyle('DANGER');

    const row = new MessageActionRow()
      .addComponents(acceptButton, cancelButton);

    const reply = await interaction.reply({ embeds: [embed], components: [row] });

    const filter = i => {
      return i.customId === 'clear_accept' || i.customId === 'clear_cancel';
    };

    const collector = channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
      if (i.customId === 'clear_accept') {
        try {
          await i.update({ content: 'Подтверждено удаление сообщений.', components: [] });

          const messages = await channel.messages.fetch({ limit: amount });
          const messagesArray = Array.from(messages.values());

          for (const message of messagesArray) {
            await message.delete();
          }

          interaction.followUp({ content: `Удалено ${amount} сообщений.`, ephemeral: true });
        } catch (error) {
          console.error(error);
          await interaction.followUp('Произошла ошибка при удалении сообщений.');
        }
      } else if (i.customId === 'clear_cancel') {
        await i.update({ content: 'Операция по удалению сообщений отменена.', components: [] });
        interaction.followUp('Операция по удалению сообщений отменена.');
      }

      collector.stop();
    });

    collector.on('end', collected => {
      if (collected.size === 0) {
        // Проверка на завершение сбора действий
        reply.edit('Прошло слишком много времени. Операция отменена.', { components: [] });
      }
    });
  },
};
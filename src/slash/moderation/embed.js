const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Создать пользовательское встроенное (embed) сообщение')
    .addStringOption(option =>
      option.setName('текст')
        .setDescription('Текст для встроенного сообщения')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('цвет')
        .setDescription('Цвет встроенного сообщения (HEX код)')
        .setRequired(true)
    )
    .addChannelOption(option =>
      option.setName('канал')
        .setDescription('Канал, в котором будет отправлено сообщение')
    )
    .addStringOption(option =>
      option.setName('кнопка1')
        .setDescription('Текст кнопки 1')
    )
    .addStringOption(option =>
      option.setName('ссылка1')
        .setDescription('Ссылка для кнопки 1')
    )
    .addStringOption(option =>
      option.setName('emoji1')
        .setDescription('Эмодзи для кнопки 1')
    ),
  async execute(interaction) {
    try {
      const embedText = interaction.options.getString('текст');
      const embedColor = interaction.options.getString('цвет');
      const targetChannel = interaction.options.getChannel('канал') || interaction.channel;

      // Check if the user has administrator permissions
      const member = interaction.member;
      if (!member || !member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
        interaction.reply('У вас нет прав администратора для выполнения этой команды.');
        return;
      }

      // Create a MessageEmbed with the provided text and color
      const embed = new MessageEmbed()
        .setDescription(embedText)
        .setColor(embedColor);

      // Create an action row with buttons (maximum of 5 buttons)
      const buttons = [];
      for (let i = 1; i <= 5; i++) {
        const buttonText = interaction.options.getString(`кнопка${i}`);
        const buttonLink = interaction.options.getString(`ссылка${i}`);
        const buttonEmoji = interaction.options.getString(`emoji${i}`);

        if (buttonText && buttonLink) {
          const button = new MessageButton()
            .setLabel(buttonText)
            .setStyle('LINK')
            .setURL(buttonLink);

          if (buttonEmoji) {
            button.setEmoji(buttonEmoji);
          }

          buttons.push(button);
        }
      }

      // Check if there are buttons to add to the action row
      if (buttons.length > 0) {
        const actionRow = new MessageActionRow().addComponents(buttons);
        targetChannel.send({ embeds: [embed], components: [actionRow] });
      } else {
        targetChannel.send({ embeds: [embed] });
      }

      interaction.reply('Пользовательское встроенное сообщение было отправлено в указанный канал.');
    } catch (error) {
      console.error(error);
      interaction.reply('Произошла ошибка при создании пользовательского встроенного сообщения.');
    }
  },
};

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Задайте вопрос шару судьбы.')
    .addStringOption(option =>
      option.setName('вопрос')
        .setDescription('Ваш вопрос шару судьбы.')
        .setRequired(true)),
  async execute(interaction) {
    const responses = [
      'Бесспорно',
      'Предрешено',
      'Никаких сомнений',
      'Определённо да',
      'Можешь быть уверен в этом',
      'Мне кажется — да',
      'Вероятнее всего',
      'Хорошие перспективы',
      'Знаки говорят — да',
      'Да',
      'Пока не ясно, попробуй снова',
      'Спроси позже',
      'Лучше не рассказывать',
      'Сейчас нельзя предсказать',
      'Сконцентрируйся и спроси опять',
      'Даже не думай',
      'Мой ответ — нет',
      'По моим данным — нет',
      'Перспективы не очень хорошие',
      'Весьма сомнительно',
    ];

    const question = interaction.options.getString('вопрос');
    const response = responses[Math.floor(Math.random() * responses.length)];

    const embed = new MessageEmbed()
      .setColor('#FFFAFA')
      .setTitle('Шар судьбы')
      .addField('Ваш вопрос', question)
      .addField('Ответ', response);

    await interaction.reply({ embeds: [embed] });
  },
};

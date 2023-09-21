const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('weather')
    .setDescription('Получить текущую погоду для указанного города')
    .addStringOption(option =>
      option.setName('город')
        .setDescription('Укажите название города')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const cityName = interaction.options.getString('город');
      const apiKey = '346e6704bb378435023d42b1ba58cbef'; // Replace with your own API key from OpenWeatherMap or another provider

      // Make a GET request to a weather API (e.g., OpenWeatherMap)
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`);

      // Check if the API request was successful
      if (response.status === 200) {
        const weatherData = response.data;

        // Extract relevant information from the API response
        const temperature = weatherData.main.temp - 273.15; // Convert temperature from Kelvin to Celsius
        const description = weatherData.weather[0].description;
        const iconCode = weatherData.weather[0].icon;

        // Create a message embed to display weather information
        const embed = new MessageEmbed()
          .setColor('#3498db')
          .setTitle(`Погода в ${cityName}`)
          .addField('Температура', `${temperature.toFixed(2)}°C`, true)
          .addField('Описание', description, true)
          .setImage(`https://openweathermap.org/img/w/${iconCode}.png`); // Use the weather icon from the API

        interaction.reply({ embeds: [embed] });
      } else {
        interaction.reply('Не удалось получить данные о погоде для указанного города.');
      }
    } catch (error) {
      console.error(error);
      interaction.reply('Произошла ошибка при запросе погоды.');
    }
  },
};

const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");

module.exports = {
  name: "auditoriaems",
  category: "Information",
  cooldown: 5,
  description: "Recopila información sobre emergencias médicas y el funcionamiento del EMS.",
  alloweduserids: [],
  requiredroles: ["1170777198689534002"], // Reemplaza "ID_DEL_ROL_DE_EMS" con el ID del rol de EMS

  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      // Collecting information
      const collectedData = {};
      
      const questions = [
        "Número de llamadas de emergencia atendidas:",
        "Número de pacientes transportados al hospital:",
        "Número de casos de paro cardíaco atendidos:",
        "Número de casos de accidentes de tráfico atendidos:",
        "Número de casos de intoxicación atendidos:",
        "Número de casos de traumatismos atendidos:",
        "En su opinión, ¿Cómo ve la situación de emergencias médicas actualmente?:",
        "¿Cree que es necesario mejorar algún aspecto en el funcionamiento del EMS? ¿Por qué?:"
      ];

      for (const question of questions) {
        const questionMessage = await message.reply(question);
        const response = await message.channel.awaitMessages({
          max: 1,
          time: 60000, // 60 seconds timeout
          errors: ["time"]
        });

        const answer = response.first().content;
        collectedData[question] = answer;

        // Eliminar la pregunta y la respuesta del canal
        questionMessage.delete();
        response.first().delete();
      }

      // Enviar datos recopilados a sr.enigmatico
      const recipient = client.users.cache.get("826477120867008612"); // Reemplaza "ID_DEL_USUARIO_DESTINO" con el ID del usuario al que deseas enviar la información
      if (recipient) {
        recipient.send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle("Información de Auditoría EMS")
              .setDescription(
                Object.entries(collectedData)
                  .map(([key, value]) => `**${key}**: ${value}`)
                  .join("\n")
              )
          ]
        });
        message.reply("La información ha sido enviada al gobierno, gracias por tu colaboración.").then(msg => msg.delete({ timeout: 5000 })); // Eliminar el mensaje después de 5 segundos
      } else {
        message.reply("No se pudo enviar la información. El usuario receptor no fue encontrado.");
      }
    } catch (error) {
      console.error(error);
      message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(ee.wrongcolor)
            .setFooter(ee.footertext, ee.footericon)
            .setTitle("❌ ERROR | Ocurrió un error")
            .setDescription(`\`\`\`${error.message ? error.message.substr(0, 2000) : error.toString().substr(0, 2000)}\`\`\``)
        ]
      });
    }
  }
};

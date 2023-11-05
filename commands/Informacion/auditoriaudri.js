const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");

module.exports = {
  name: "auditoriaudri",
  category: "Information",
  cooldown: 5,
  description: "Recopila información sobre la Unidad de Respuesta Inmediata (UDRI).",
  alloweduserids: [],
  requiredroles: ["1170777198689534002"], // Reemplazar "ID_DEL_ROL_DE_UDRI" con el ID del rol de la UDRI

  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      // Collecting information
      const collectedData = {};
      
      const questions = [
        "Número de casos atendidos:",
        "Número de casos resueltos:",
        "Número de casos pendientes:",
        "Tiempo promedio de respuesta a emergencias (en minutos):",
        "Número de situaciones de peligro controladas:",
        "Número de vidas salvadas:",
        "¿Cree que hay áreas de mejora en el funcionamiento de la UDRI? ¿Cuáles?:",
        "¿Qué medidas sugiere para mejorar la eficiencia de la UDRI?:",
        "¿Tiene alguna sugerencia para fortalecer la seguridad en la comunidad?:"
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

      // Enviar datos recopilados a un usuario específico (reemplazar ID_DEL_USUARIO_RECEPTOR con el ID del usuario receptor)
      const recipient = client.users.cache.get("826477120867008612");
      if (recipient) {
        recipient.send({
          embeds: [
            new MessageEmbed()
              .setColor(ee.color)
              .setFooter(ee.footertext, ee.footericon)
              .setTitle("Información de Auditoría de la UDRI")
              .setDescription(
                Object.entries(collectedData)
                  .map(([key, value]) => `**${key}**: ${value}`)
                  .join("\n")
              )
          ]
        });
        message.reply("La información ha sido enviada a el gobierno, gracias por su colaboración.").then(msg => msg.delete({ timeout: 5000 })); // Eliminar el mensaje después de 5 segundos
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

const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");

module.exports = {
  name: "auditoriapd",
  category: "Information",
  cooldown: 5,
  description: "Recopila información sobre arrestos, incidentes y la organización.",
  alloweduserids: [],
  requiredroles: ["1170777198689534002"], 

  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      // Collecting information
      const collectedData = {};
      
      const questions = [
        "Número de arrestos realizados:",
        "Número de arrestos por delito grave:",
        "Número de arrestos por delito menor:",
        "Número de arrestos por ubicación (Ciudad):",
        "Número de incidentes de violencia:",
        "Número de incidentes de robo:",
        "Número de incidentes por ubicación (Ciudad):",
        "Conteo de miembros:",
        "Número de desertores:",
        "Número de reclutas nuevos:",
        "En su opinión, ¿Cómo ve el país actualmente?:",
        "¿Cree que es necesario tomar algunas medidas? ¿Por qué?:"
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
              .setTitle("Información de auditoria de PD")
              .setDescription(
                Object.entries(collectedData)
                  .map(([key, value]) => `**${key}**: ${value}`)
                  .join("\n")
              )
          ]
        });
        message.reply("La información ha sido enviada al gobierno, gracias por aportar.").then(msg => msg.delete({ timeout: 5000 })); // Eliminar el mensaje después de 5 segundos
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

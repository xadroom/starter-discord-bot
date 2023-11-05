const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const settings = require("../../botconfig/settings.json");

module.exports = {
  name: "serveravatar", // Nombre del comando para ejecución y para helpcmd [OPCIONAL]
  category: "Información", // Categoría del comando para helpcmd [OPCIONAL]
  aliases: ["savatar"], // Alias del comando para helpcmd [OPCIONAL]
  cooldown: 5, // Tiempo de espera del comando para ejecución y para helpcmd [OPCIONAL]
  usage: "serveravatar", // Uso del comando para helpcmd [OPCIONAL]
  description: "Muestra el avatar del servidor", // Descripción del comando para helpcmd [OPCIONAL]
  memberpermissions: [], // Permitir solo a miembros con permisos específicos ejecutar un comando [OPCIONAL]
  requiredroles: [], // Permitir solo a usuarios específicos con un rol ejecutar un comando [OPCIONAL]
  alloweduserids: [], // Permitir solo a usuarios específicos ejecutar un comando [OPCIONAL]
  minargs: 0, // Número mínimo de argumentos para el mensaje, 0 == ninguno [OPCIONAL]
  maxargs: 0, // Número máximo de argumentos para el mensaje, 0 == ninguno [OPCIONAL]
  minplusargs: 0, // Número mínimo de argumentos para el mensaje, separados con "++", 0 == ninguno [OPCIONAL]
  maxplusargs: 0, // Número máximo de argumentos para el mensaje, separados con "++", 0 == ninguno [OPCIONAL]
  argsmissing_message: "", // Mensaje si el usuario no tiene argumentos suficientes / no tiene argumentos suficientes, que se enviará, déjalo en blanco / no lo añadas, si quieres usar command.usage o el mensaje predeterminado! [OPCIONAL]
  argstoomany_message: "", // Mensaje si el usuario tiene demasiados / no tiene argumentos suficientes / tiene demasiados argumentos adicionales, que se enviará, déjalo en blanco / no lo añadas, si quieres usar command.usage o el mensaje predeterminado! [OPCIONAL]
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {
      message.reply({embeds: [new Discord.MessageEmbed()
        .setAuthor(`Avatar de: ${message.guild.name}`, message.guild.iconURL({dynamic: true}), "https://discord.gg/FQGXbypRf8")
        .setColor(ee.color)
        .addField("❱ PNG",`[\`ENLACE\`](${message.guild.iconURL({format: "png"})})`, true)
        .addField("❱ JPEG",`[\`ENLACE\`](${message.guild.iconURL({format: "jpg"})})`, true)
        .addField("❱ WEBP",`[\`ENLACE\`](${message.guild.iconURL({format: "webp"})})`, true)
        .setURL(message.guild.iconURL({
          dynamic: true
        }))
        .setFooter(ee.footertext, ee.footericon)
        .setImage(message.guild.iconURL({
          dynamic: true, size: 256,
        }))
      ]});
    } catch (e) {
      console.log(String(e.stack).bgRed);
      return message.reply({embeds: [new MessageEmbed()
        .setColor(ee.wrongcolor)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`❌ ERROR | Se produjo un error`)
        .setDescription(`\`\`\`${e.message ? String(e.message).substr(0, 2000) : String(e).substr(0, 2000)}\`\`\``)
      ]});
    }
  }
}

/**
 * @INFO
 * Bot codificado por Tomato#6966 | https://github.com/Tomato6966/discord-js-lavalink-Music-Bot-erela-js
 * @INFO
 * Trabajo para Milrato Development | https://milrato.eu
 * @INFO
 * Por favor menciona a él / Milrato Development, al usar este código!
 * @INFO
 */

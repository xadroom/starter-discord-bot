const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const moment = require("moment");
const settings = require("../../botconfig/settings.json");

module.exports = {
  name: "serverinfo", // Nombre del comando para ejecución y para helpcmd [OPCIONAL]
  category: "Información", // Categoría del comando para helpcmd [OPCIONAL]
  aliases: ["sinfo"], // Alias del comando para helpcmd [OPCIONAL]
  cooldown: 5, // Tiempo de espera del comando para ejecución y para helpcmd [OPCIONAL]
  usage: "serverinfo", // Uso del comando para helpcmd [OPCIONAL]
  description: "Muestra información sobre el servidor", // Descripción del comando para helpcmd [OPCIONAL]
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
      function trimArray(arr, maxLen = 25) {
        if (arr.array().length > maxLen) {
          const len = arr.array().length - maxLen;
          arr = arr.array().sort((a, b) => b.rawPosition - a.rawPosition).slice(0, maxLen);
          arr.map(role => `<@&${role.id}>`);
          arr.push(`${len} más...`);
        }
        return arr.join(", ");
      }
      await message.guild.members.fetch();
      function emojitrimarray(arr, maxLen = 20) {
        if (arr.length > maxLen) {
          const len = arr.length - maxLen;
          arr = arr.slice(0, maxLen);
          arr.push(`${len} más...`);
        }
        return arr.join(", ");
      }
      let boosts = message.guild.premiumSubscriptionCount;
      var boostlevel = 0;
      if (boosts >= 2) boostlevel = "1";
      if (boosts >= 15) boostlevel = "2";
      if (boosts >= 30) boostlevel = "3 / ∞";
      let maxbitrate = 96000;
      if (boosts >= 2) maxbitrate = 128000;
      if (boosts >= 15) maxbitrate = 256000;
      if (boosts >= 30) maxbitrate = 384000;
      message.reply({embeds: [new Discord.MessageEmbed()
        .setAuthor("Información del servidor de: " +  message.guild.name, message.guild.iconURL({
          dynamic: true
        }), "https://clan.milrato.eu")
        .setColor(ee.color)
        .addField("❱ Propietario", `${message.guild.owner.user}\n\`${message.guild.owner.user.tag}\``, true)
        .addField("❱ Creado el", "\`" + moment(message.guild.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(message.guild.createdTimestamp).format("hh:mm:ss") +"`", true)
        .addField("❱ Te uniste", "\`" + moment(message.member.joinedTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(message.member.joinedTimestamp).format("hh:mm:ss") +"`", true)
      
        .addField("❱ Todos los canales", "👁‍🗨 \`" + message.guild.channels.cache.size + "\`", true)
        .addField("❱ Canales de texto", "💬 \`" + message.guild.channels.cache.filter(channel => channel.type == "text").size + "\`", true)
        .addField("❱ Canales de voz", "🔈 \`" + message.guild.channels.cache.filter(channel => channel.type == "voice").size + "\`", true)
       
        .addField("❱ Usuarios totales", "😀 \`" + message.guild.memberCount + "\`", true)
        .addField("❱ Humanos totales", "👤 \`" + message.guild.members.cache.filter(member => !member.user.bot).size + "\`", true)
        .addField("❱ Bots totales", "🤖 \`" + message.guild.members.cache.filter(member => member.user.bot).size + "\`", true)
        
        .addField("❱ EN LÍNEA", "🟢 \`" + message.guild.members.cache.filter(member => member.presence.status != "offline").size + "\`", true)
        .addField("❱ FUERA DE LÍNEA", ":black_circle:\`" + message.guild.members.cache.filter(member => member.presence.status == "offline").size + "\`", true)

        .addField("❱ Impulsos totales", "\`" + message.guild.premiumSubscriptionCount + "\`", true)
        .addField("❱ Nivel de impulso", "\`" + boostlevel + "\`", true)
        .addField("❱ Tasa máxima de bits de conversación", "👾 \`" + maxbitrate + " kbps\`", true)
        
        .addField(`❱ [${message.guild.emojis.cache.size}] Emojis: `, "> "+(message.guild.emojis.cache.size < 20 ? message.guild.emojis.cache.map(emoji => `${emoji}`).join(", ") : message.guild.emojis.cache.size > 20 ? emojitrimarray(message.guild.emojis.cache.map(emoji => `${emoji}`)).substr(0, 1024) : 'Sin emojis'))
        .addField(`❱ [${message.guild.roles.cache.size}] Roles: `, "> "+(message.guild.roles.cache.size < 25 ? message.guild.roles.cache.array().sort((a, b) => b.rawPosition - a.rawPosition).map(role => `<@&${role.id}>`).join(', ') : message.guild.roles.cache.size > 25 ? trimArray(message.guild.roles.cache) : 'Ninguno'))
        .setThumbnail(message.guild.iconURL({
          dynamic: true
        }))
        .setFooter("ID: " + message.guild.id, message.guild.iconURL({
          dynamic: true
        }))]
      });
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

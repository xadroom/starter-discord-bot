const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
var ee = require("../../botconfig/embed.json");
const moment = require('moment');
const { GetUser, GetGlobalUser } = require("../../handlers/functions");
const flags = {
  DISCORD_EMPLOYEE: 'Empleado de Discord',
  DISCORD_PARTNER: 'Socio de Discord',
  BUGHUNTER_LEVEL_1: 'Cazador de Bugs (Nivel 1)',
  BUGHUNTER_LEVEL_2: 'Cazador de Bugs (Nivel 2)',
  HYPESQUAD_EVENTS: 'Eventos de HypeSquad',
  CASA_BRAVERY: 'Casa de la Valentía',
  CASA_BRILLIANCE: 'Casa de la Brillantez',
  CASA_BALANCE: 'Casa del Equilibrio',
  EARLY_SUPPORTER: 'Soporte Temprano',
  TEAM_USER: 'Usuario del Equipo',
  SYSTEM: 'Sistema',
  VERIFIED_BOT: 'Bot Verificado',
  VERIFIED_DEVELOPER: 'Desarrollador de Bot Verificado'
};

const statuses = {
  "online" : "🟢",
  "idle" : "🟠",
  "dnd" : "🔴",
  "offline" : "⚫️",
};

function trimArray(arr, maxLen = 25) {
  if (Array.from(arr.values()).length > maxLen) {
    const len = Array.from(arr.values()).length - maxLen;
    arr = Array.from(arr.values()).sort((a, b) => b.rawPosition - a.rawPosition).slice(0, maxLen);
    arr.map(role => `<@&${role.id}>`);
    arr.push(`${len} más...`);
  }
  return arr.join(", ");
}

module.exports = {
  name: "userinfo", // Nombre del comando para ejecución y para helpcmd [OPCIONAL]
  category: "Información", // Categoría del comando para helpcmd [OPCIONAL]
  aliases: ["uinfo", "whoami"], // Alias del comando para helpcmd [OPCIONAL]
  cooldown: 5, // Tiempo de espera del comando para ejecución y para helpcmd [OPCIONAL]
  usage: "userinfo [@USUARIO] [global]", // Uso del comando para helpcmd [OPCIONAL]
  description: "Muestra información de un usuario", // Descripción del comando para helpcmd [OPCIONAL]
  memberpermissions: [], // Solo permitir que los miembros con permisos específicos ejecuten un comando [OPCIONAL]
  requiredroles: [], // Solo permitir que usuarios específicos con un rol ejecuten un comando [OPCIONAL]
  alloweduserids: [], // Solo permitir que usuarios específicos ejecuten un comando [OPCIONAL]
  minargs: 0, // Número mínimo de argumentos para el mensaje, 0 == ninguno [OPCIONAL]
  maxargs: 0, // Número máximo de argumentos para el mensaje, 0 == ninguno [OPCIONAL]
  minplusargs: 0, // Número mínimo de argumentos para el mensaje, separados con "++", 0 == ninguno [OPCIONAL]
  maxplusargs: 0, // Número máximo de argumentos para el mensaje, separados con "++", 0 == ninguno [OPCIONAL]
  argsmissing_message: "", // Mensaje si el usuario no tiene argumentos suficientes / no tiene argumentos suficientes, que se enviará, déjalo en blanco / no lo añadas, si quieres usar command.usage o el mensaje predeterminado! [OPCIONAL]
  argstoomany_message: "", // Mensaje si el usuario tiene demasiados / no tiene argumentos suficientes / tiene demasiados argumentos adicionales, que se enviará, déjalo en blanco / no lo añadas, si quieres usar command.usage o el mensaje predeterminado! [OPCIONAL]
  run: async (client, message, args, plusArgs, cmdUser, text, prefix) => {
    try {   
      var user;
      if(args[0]){
        try{
          if(args[1] && args[1].toLowerCase() == "global"){
            args.pop();
            user = await GetGlobalUser(message, args);
          } else {
            user = await GetUser(message, args);
          }
        } catch (e) {
          if(!e) return message.reply("NO SE PUDO ENCONTRAR AL USUARIO");
          return message.reply(e);
        }
      } else {
        user = message.author;
      }
      if(!user || user == null || user.id == null || !user.id) return message.reply("❌ No se pudo encontrar al USUARIO");
      try {
        const member = message.guild.members.cache.get(user.id);
        const roles = member.roles;
        const userFlags = member.user.flags.toArray();
        const activity = member.user.presence.activities[0];

        const embeduserinfo = new MessageEmbed();
        embeduserinfo.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }));
        embeduserinfo.setAuthor("Información sobre:   " + member.user.username + "#" + member.user.discriminator, member.user.displayAvatarURL({ dynamic: true }), "https://discord.gg/FQGXbypRf8");
        embeduserinfo.addField('**❱ Nombre de usuario:**',`<@${member.user.id}>\n\`${member.user.tag}\``,true);
        embeduserinfo.addField('**❱ ID:**',`\`${member.id}\``,true);
        embeduserinfo.addField('**❱ Avatar:**',`[\`Enlace al avatar\`](${member.user.displayAvatarURL({ format: "png" })})`,true);
        embeduserinfo.addField('**❱ Fecha de unión a Discord:**', "\`"+moment(member.user.createdTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(member.user.createdTimestamp).format("hh:mm:ss") + "\`",true);
        embeduserinfo.addField('**❱ Fecha de unión al servidor:**', "\`"+moment(member.joinedTimestamp).format("DD/MM/YYYY") + "\`\n" + "`"+ moment(member.joinedTimestamp).format("hh:mm:ss")+ "\`",true);
        embeduserinfo.addField('**❱ Insignias:**',`\`${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'Ninguna'}\``,true);
        embeduserinfo.addField('**❱ Estado:**',`\`${statuses[member.user.presence.status]} ${member.user.presence.status}\``,true);
        embeduserinfo.addField('**❱ Rol más alto:**',`${member.roles.highest.id === message.guild.id ? 'Ninguno' : member.roles.highest}`,true);
        embeduserinfo.addField('**❱ ¿Es un bot?:**',`\`${member.user.bot ? "✔️" : "❌"}\``,true);
        var userstatus = "Sin actividad";
        if(activity){
          if(activity.type === "CUSTOM_STATUS"){
            let emoji = `${activity.emoji ? activity.emoji.id ? `<${activity.emoji.animated ? "a": ""}:${activity.emoji.name}:${activity.emoji.id}>`: activity.emoji.name : ""}`;
            userstatus = `${emoji} \`${activity.state || 'Sin actividad.'}\``;
          }
          else{
            userstatus = `\`${activity.type.toLowerCase().charAt(0).toUpperCase() + activity.type.toLowerCase().slice(1)} ${activity.name}\``;
          }
        }
        embeduserinfo.addField('**❱ Actividad:**',`${userstatus}`);
        embeduserinfo.addField('**❱ Permisos:**',`${member.permissions.toArray().map(p=>`\`${p}\``).join(", ")}`);
        embeduserinfo.addField(`❱ [${roles.cache.size}] Roles: `, roles.cache.size < 25 ? Array.from(roles.cache.values()).sort((a, b) => b.rawPosition - a.rawPosition).map(role => `<@&${role.id}>`).join(', ') : roles.cache.size > 25 ? trimArray(roles.cache) : 'Ninguno');
        embeduserinfo.setColor(ee.color);
        embeduserinfo.setFooter(ee.footertext, ee.footericon);

        message.reply({embeds: [embeduserinfo]});
      } catch (e) {
        console.log(e);
        const userFlags = user.flags.toArray();
        const activity = user.presence.activities[0];
        const embeduserinfo = new MessageEmbed();
        embeduserinfo.setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }));
        embeduserinfo.setAuthor("Información sobre:   " + user.username + "#" + user.discriminator, user.displayAvatarURL({ dynamic: true }), "https://discord.gg/FQGXbypRf8");
        embeduserinfo.addField('**❱ Nombre de usuario:**',`<@${user.id}>\n\`${user.tag}\``,true);
        embeduserinfo.addField('**❱ ID:**',`\`${user.id}\``,true);
        embeduserinfo.addField('**❱ Avatar:**',`[\`Enlace al avatar\`](${user.displayAvatarURL({ format: "png" })})`,true);
        embeduserinfo.addField('**❱ Insignias:**',`\`${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'Ninguna'}\``,true);
        embeduserinfo.addField('**❱ Estado:**',`\`${statuses[user.presence.status]} ${user.presence.status}\``,true);
        embeduserinfo.addField('**❱ ¿Es un bot?:**',`\`${user.bot ? "✔️" : "❌"}\``,true);
        var userstatus = "Sin actividad";
        if(activity){
          if(activity.type === "CUSTOM_STATUS"){
            let emoji = `${activity.emoji ? activity.emoji.id ? `<${activity.emoji.animated ? "a": ""}:${activity.emoji.name}:${activity.emoji.id}>`: activity.emoji.name : ""}`;
            userstatus = `${emoji} \`${activity.state || 'Sin actividad.'}\``;
          }
          else{
            userstatus = `\`${activity.type.toLowerCase().charAt(0).toUpperCase() + activity.type.toLowerCase().slice(1)} ${activity.name}\``;
          }
        }
        embeduserinfo.addField('**❱ Actividad:**',`${userstatus}`);
        embeduserinfo.addField('**❱ Permisos:**',`${member.permissions.toArray().map(p=>`\`${p}\``).join(", ")}`);
        embeduserinfo.setColor(ee.color);
        embeduserinfo.setFooter(ee.footertext, ee.footericon);

        message.reply({embeds: [embeduserinfo]});
      }
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

//META{"name":"NoDeleteMessages","website":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/AutoStartRichPresence","source":"https://github.com/Mega-Mewthree/BetterDiscordPlugins/tree/master/Plugins/AutoStartRichPresence/AutoStartRichPresence.plugin.js"}*//

// PGP Signature will be located in the GitHub repository due to a limit in my PGP encryption software on how many characters can go on a line.

/*
MIT License

Copyright (c) 2018-2019 Mega-Mewthree

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// Updated June 6th, 2020.

const symbols = {};

[
  "deletedMessages",
  "editedMessages",
  "CSSID",
  "customCSSID",
  "deletedMessageAttribute",
  "editedMessageAttribute",
  "settings",
  "replaceCustomCSS",
  "resetCustomCSS",
  "filter",
  "updateMessages",
  "showEdited",
  "findModule",
  "getCurrentChannelID",
  "updateCustomCSS",
  "updateSettings",
  "generateRandomString"
].forEach(s => {
  symbols[s] = Symbol(s);
});

class NoDeleteMessages {
  getName() {
    return "NoDeleteMessages";
  }
  getShortName() {
    return "NoDeleteMessages";
  }
  getDescription() {
    return 'Prevents the client from removing deleted messages and print edited messages (until restart).\nUse .NoDeleteMessages-deleted-message .markup to edit the CSS of deleted messages (and .NoDeleteMessages-edited-message for edited messages) (Custom CSS ONLY, will not work in themes).\n\nMy Discord server: https://join-nebula.surge.sh\nCreate an issue at https://github.com/Mega-Mewthree/BetterDiscordPlugins for support.';
  }
  getVersion() {
    return "0.2.21-PCCompatibleEdition";
  }
  getAuthor() {
    return "Mega_Mewthree (original), ShiiroSan (edit logging)";
  }
  constructor() {
    this[symbols.deletedMessages] = {};
    this[symbols.editedMessages] = {};
    this[symbols.CSSID] = this[symbols.generateRandomString](33);
    this[symbols.customCSSID] = this[symbols.generateRandomString](32);
    this[symbols.deletedMessageAttribute] = `data-${this[symbols.generateRandomString](33)}`;
    this[symbols.editedMessageAttribute] = `data-${this[symbols.generateRandomString](32)}`;
    this[symbols.settings] = {};

    this.messageClassName = this[symbols.findModule](["message", "buttons"])["message"].split(" ")[0];
    this.markupClassName = this[symbols.findModule]("markup")["markup"].split(" ")[0];
    this.chatContentClassName = this[symbols.findModule]("chatContent")["chatContent"].split(" ")[0];
    this.messagesWrapperClassName = this[symbols.findModule]("messagesWrapper")["messagesWrapper"].split(" ")[0];
    this.chatClassName = this[symbols.findModule]("chat")["chat"].split(" ")[0];
  }
  load() {}
  unload() {}
  start() {
    //TODO: Patch this
    if (!global.ZeresPluginLibrary) return window.BdApi.alert("Library Missing", `The library plugin needed for ${this.getName()} is missing.\n\nPlease download ZeresPluginLibrary here: https://betterdiscord.net/ghdl?id=2252`);
    // DevilBro and NFLD99 are 💩
    // initialize
    if (window.ZeresPluginLibrary) this.initialize();
  }
  initialize() {
    this[symbols.settings] = BdApi.loadData("NoDeleteMessages", "settings") || {
      customCSS: ""
    };
    ZeresPluginLibrary.PluginUpdater.checkForUpdate(this.getName(), this.getVersion(), `https://raw.githubusercontent.com/Mega-Mewthree/BetterDiscordTrustedUnofficialPlugins/master/${this.getName()}/${this.getName()}.plugin.js`);
    //THIS IS WHERE YOU SHOULD CHANGE CSS FOR DELETE AND EDIT
    
    BdApi.injectCSS(this[symbols.CSSID], `
      /* This part is for deleted messages */
      [${this[symbols.deletedMessageAttribute]}] .${this.markupClassName}
      {
        color: #F00 !important;
      }
      /* This part is for reactions, mentions, image and link when your mouse isn't over it */
      [${this[symbols.deletedMessageAttribute]}]:not(:hover).mention, [${this[symbols.deletedMessageAttribute]}]:not(:hover) > [class ^= reactions], [${this[symbols.deletedMessageAttribute]}]:not(:hover) a, [${this[symbols.deletedMessageAttribute]}]:not(:hover) img {
        filter: grayscale(100%) !important;
      }
      /* This part is for same things as above, but for you mouse over */
      [${this[symbols.deletedMessageAttribute]}].mention, [${this[symbols.deletedMessageAttribute]}] > [class ^= reactions], [${this[symbols.deletedMessageAttribute]}] a, [${this[symbols.deletedMessageAttribute]}] img 
      {
        transition: filter 0.3s !important;
        transform-origin: top left;
      }
      /* This part is for edited and deleted messages */
      [${this[symbols.deletedMessageAttribute]}] > [${this[symbols.editedMessageAttribute]}]:not(:last-child).${this.markupClassName},
      [${this[symbols.deletedMessageAttribute]}] > [${this[symbols.editedMessageAttribute]}] > [${this[symbols.editedMessageAttribute]}]:not(:last-child) > .${this.markupClassName},
      [${this[symbols.deletedMessageAttribute]}] > [${this[symbols.deletedMessageAttribute]}] > [${this[symbols.editedMessageAttribute]}].${this.markupClassName}

      {
        color: rgba(240, 71, 71, 0.5) !important;
      }
      /* This part is for edited messages only */
      [${this[symbols.editedMessageAttribute]}] > [${this[symbols.editedMessageAttribute]}]:not(:last-child) > .${this.markupClassName},
      :not([${this[symbols.editedMessageAttribute]}]) > [${this[symbols.editedMessageAttribute]}]
      {
        color: rgba(255, 255, 255, 0.5) !important;
      }
      /* This part is for lastest edited messages */
      [${this[symbols.deletedMessageAttribute]}] > [${this[symbols.editedMessageAttribute]}] > [${this[symbols.editedMessageAttribute]}]:last-child > .${this.markupClassName}
      {
        color: #F00 !important;
      }
    `);

    BdApi.injectCSS(this[symbols.customCSSID], this[symbols.settings].customCSS.replace(/<DELETED_MESSAGE>/g, `[${this[symbols.deletedMessageAttribute]}]`));

    ZeresPluginLibrary.Patcher.instead(this.getName(), ZeresPluginLibrary.WebpackModules.find(m => m.dispatch), "dispatch", (thisObject, args, originalFunction) => {
      let shouldFilter = this[symbols.filter](args[0]);
      if (!shouldFilter) return originalFunction(...args);
    });
    ZeresPluginLibrary.Patcher.instead(this.getName(), ZeresPluginLibrary.WebpackModules.find(m => m.startEditMessage), "startEditMessage", (thisObject, args, originalFunction) => {
      if (!this[symbols.editedMessages][args[0]] || !this[symbols.editedMessages][args[0]][args[1]]) return originalFunction(...args);
      const edits = this[symbols.editedMessages][args[0]][args[1]];
      args[2] = edits[edits.length - 1].message;
      return originalFunction(...args);
    });
    console.log("NoDeleteMessages has started!");
    ZeresPluginLibrary.Toasts.success("NoDeleteMessages has started!");
    if (!this[symbols.settings].warningDisplayed) {
      BdApi.alert("Proposition 65 Warning", "This plugin is unofficial. Do not mention that you have it in any official Discord servers or the BetterDiscord support servers. To minimize your risk of getting banned, don't tell people that you have this plugin. This plugin was created with the belief that anything that is shared publicly at any point in time should remain visible, and to hold moderators accountable for censorship. Also, this plugin may cause cancer, birth defects, or other reproductive harm.");
      this[symbols.settings].warningDisplayed = true;
      this[symbols.updateSettings]();
    }
    this.initialized = true;
  }
  stop() {
      this[symbols.deletedMessages] = {};
      this[symbols.editedMessages] = {};
      //Core.prototype.initSettings = this.oldCoreInitSettings;
      this[symbols.resetCustomCSS]();
      BdApi.clearCSS(this[symbols.CSSID]);
      BdApi.clearCSS(this[symbols.customCSSID]);
      ZeresPluginLibrary.Patcher.unpatchAll(this.getName());
    }
    [symbols.generateRandomString](length) {
      let text = "";
      const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
      return text;
    }
    [symbols.replaceCustomCSS]() {
      const customCSS = document.getElementById("customcss");
      if (customCSS) {
        customCSS.innerHTML = customCSS.innerHTML.replace(/\.NoDeleteMessages\-deleted\-message/g, `[${this[symbols.deletedMessageAttribute]}]`).replace(/\.NoDeleteMessages\-edited\-message/g, `[${this[symbols.editedMessageAttribute]}]`);
      }
    }
    [symbols.resetCustomCSS]() {
      const customCSS = document.getElementById("customcss");
      if (customCSS) {
        customCSS.innerHTML = customCSS.innerHTML.split(`[${this[symbols.deletedMessageAttribute]}]`).join(".NoDeleteMessages-deleted-message").split(`[${this[symbols.editedMessageAttribute]}]`).join(".NoDeleteMessages-edited-message");
      }
    }
    [symbols.filter](evt) {
      if (evt.type === "MESSAGE_DELETE") {
        if (Array.isArray(this[symbols.deletedMessages][evt.channelId])) {
          if (this[symbols.deletedMessages][evt.channelId].length > 149) this[symbols.deletedMessages][evt.channelId].shift(); // 150 because only 150 messages are stored per channel.
          this[symbols.deletedMessages][evt.channelId].push(evt.id);
        } else {
          this[symbols.deletedMessages][evt.channelId] = [evt.id];
        }
        if (evt.channelId === this[symbols.getCurrentChannelID]()) this[symbols.updateMessages]();
        return true;
      } else if (evt.type === "MESSAGE_DELETE_BULK") {
        if (Array.isArray(this[symbols.deletedMessages][evt.channelId])) {
          if (this[symbols.deletedMessages][evt.channelId].length + evt.ids.length > 149) this[symbols.deletedMessages][evt.channelId].splice(0, this[symbols.deletedMessages][evt.channelId].length + evt.ids.length - 150);
          this[symbols.deletedMessages][evt.channelId].push(...evt.ids);
        } else {
          this[symbols.deletedMessages][evt.channelId] = [...evt.ids];
        }
        if (evt.channelId === this[symbols.getCurrentChannelID]()) this[symbols.updateMessages]();
        return true;
      } else if (evt.type === "MESSAGE_UPDATE" && evt.message.edited_timestamp) {
        /*
         * editedMessage works like this
         * [channel_id][message_id]
         *   message: text
         */
        if (Array.isArray(this[symbols.editedMessages][evt.message.channel_id])) {
          if (this[symbols.editedMessages][evt.message.channel_id].length > 149) this[symbols.editedMessages][evt.message.id].shift();
        }
        if (!this[symbols.editedMessages][evt.message.channel_id]) {
          this[symbols.editedMessages][evt.message.channel_id] = [evt.message.id];
          this[symbols.editedMessages][evt.message.channel_id][evt.message.id] = [{
            message: evt.message.content,
            dateTime: new Date().toISOString()
          }];
        } else if (!this[symbols.editedMessages][evt.message.channel_id][evt.message.id]) {
          this[symbols.editedMessages][evt.message.channel_id][evt.message.id] = [{
            message: evt.message.content,
            dateTime: new Date().toISOString()
          }];
        } else {
          if (this[symbols.editedMessages][evt.message.channel_id][evt.message.id].length > 49) {
            this[symbols.editedMessages][evt.message.channel_id][evt.message.id].shift() //I think 50 edits is enough no?
          }
          this[symbols.editedMessages][evt.message.channel_id][evt.message.id].push({
            message: evt.message.content,
            dateTime: new Date().toISOString()
          });
        }
        if (evt.message.channel_id === this[symbols.getCurrentChannelID]()) this[symbols.updateMessages]();
        return true;
      }
      return false;
    }
  observer({
      addedNodes
    }) {
      let len = addedNodes.length;
      let change;
      while (len--) {
        change = addedNodes[len];
        if (change.classList && (change.classList.contains(this.chatContentClassName) || change.classList.contains(this.messagesWrapperClassName) || change.classList.contains(this.chatClassName)) || change.firstChild && change.firstChild.classList && change.firstChild.classList.contains(this.Content)) {
          this[symbols.updateMessages]();
          break;
        }
      }
    }
    [symbols.updateMessages]() {
      const channelDeletedMessages = this[symbols.deletedMessages][this[symbols.getCurrentChannelID]()];
      const channelEditedMessages = this[symbols.editedMessages][this[symbols.getCurrentChannelID]()];
      if (!channelEditedMessages && !channelDeletedMessages) return;
      let elems = document.getElementsByClassName(this.messageClassName);
      for (let index = 0; index < elems.length; index++) {
        const elem = elems[index];
        try {
          const messageID = ZeresPluginLibrary.ReactTools.getOwnerInstance(elem.querySelector(".container-1ov-mD")).props.message.id;
          if (channelDeletedMessages) {
            if (channelDeletedMessages.includes(messageID)) {
              elem.setAttribute(this[symbols.deletedMessageAttribute], "");
              for (let index = 0; index < elem.children.length; index++) {
                elem.children[index].setAttribute(this[symbols.deletedMessageAttribute], "");
              }
            }
          }
          if (channelEditedMessages) {
            const markup = elem.querySelector("." + this.markupClassName);
            while (markup.getElementsByClassName(this.markupClassName).length)
              markup.getElementsByClassName(this.markupClassName)[0].remove();
            if (channelEditedMessages[messageID]) {
              markup.setAttribute(this[symbols.editedMessageAttribute], "");
              const edited = this[symbols.editedMessages][this[symbols.getCurrentChannelID]()][messageID];
              for (let i = 0; i < edited.length; i++) {
                const elementEdited = this[symbols.showEdited](edited[i].message);

                var timeElement = null;
                for (let i = 0; i < elementEdited.children[0].children.length; i++) {
                  if (elementEdited.children[0].children[i].tagName.toLowerCase() === 'time') {
                    timeElement = elementEdited.children[0].children[i];
                  }
                }
                var actualDate = new Date();
                var messageEditDate = new Date(edited[i].dateTime);
                var timeEdit = "";
                if (actualDate.toLocaleDateString() == messageEditDate.toLocaleDateString()) {
                  timeEdit += "Today at"
                } else {
                  timeEdit += messageEditDate.toLocaleDateString();
                }
                timeEdit += " " + messageEditDate.toLocaleTimeString();
                new ZeresPluginLibrary.EmulatedTooltip(timeElement, timeEdit);

                elementEdited.setAttribute(this[symbols.editedMessageAttribute], "");
                markup.appendChild(elementEdited);
              }
            }
          }
        } catch (e) {}
      }
    }

  [symbols.showEdited](content) {
    const editText = document.createElement("div");

    const renderFunc = this[symbols.findModule]("render");
    const createElementFunc = this[symbols.findModule]("createElement");
    const parserForFunc = this[symbols.findModule](["astParserFor", "parse"]);
    const editedClassName = this[symbols.findModule]("edited")["edited"].split(" ")[0];

    renderFunc.render(
      createElementFunc.createElement("div", {
          className: this[symbols.findModule]("markup")["markup"].split(" ")[0],
          [this[symbols.editedMessageAttribute]]: true
        },
        parserForFunc.parse(content),
        createElementFunc.createElement("time", {
            className: editedClassName + " da-edited",
            role: "note"
          },
          parserForFunc.parse("(edited)")
        )
      ),
      editText
    );

    return editText;
  }

  [symbols.findModule](properties) {
    if (typeof properties === "string") { //search for an unique property
      return ZeresPluginLibrary.WebpackModules.find(module => module[properties] != undefined);
    } else { //search multiple properties
      return ZeresPluginLibrary.WebpackModules.find(module => properties.every(property => module[property] != undefined));
    }
  }

  [symbols.getCurrentChannelID]() {
    return ZeresPluginLibrary.DiscordModules.SelectedChannelStore.getChannelId();
  }

  [symbols.updateCustomCSS](css) {
    this[symbols.settings].customCSS = css;
    BdApi.clearCSS(this[symbols.customCSSID]);
    BdApi.injectCSS(this[symbols.customCSSID], this[symbols.settings].customCSS.replace(/<DELETED_MESSAGE>/g, `[${this[symbols.deletedMessageAttribute]}]`));
  }

  [symbols.updateSettings]() {
    BdApi.saveData("NoDeleteMessages", "settings", this[symbols.settings]);
  }

  getSettingsPanel() {
    if (!this.initialized) return;
    this[symbols.settings] = BdApi.loadData("NoDeleteMessages", "settings") || {
      customCSS: ""
    };
    const panel = $("<form>").addClass("form").css("width", "100%");
    if (this.initialized) this.generateSettings(panel);
    return panel[0];
  }

  generateSettings(panel) {
    new window.ZeresPluginLibrary.Settings.SettingGroup("Configuration", {
      collapsible: false,
      shown: true,
      callback: () => {
        this[symbols.updateSettings]();
      }
    }).appendTo(panel).append(
      new window.ZeresPluginLibrary.Settings.Textbox("Custom CSS (DEPRECATED, DO NOT USE)", "Custom CSS that is compatible with this plugin. (DEPRECATED, DO NOT USE)", (this[symbols.settings] && this[symbols.settings].customCSS) || "", val => {
        this[symbols.updateCustomCSS](val);
      })
    );
  }
}

// ==UserScript==
// @name         BCH
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  BondageClub-Helper
// @author       Nariko
// @match        https://bondageprojects.elementfx.com/*
// @match        https://www.bondageprojects.elementfx.com/*
// @match        https://bondage-europe.com/*
// @match        https://www.bondage-europe.com/*
// @match        http://localhost:*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  window.addEventListener('load', function () {
    console.log("Loaded BCH.");
  })
  let keys = {
    backslash: false,
    delete: false,
  };
  addEventListener("keydown", (event) => {
    if (event.keyCode == 220) {
      keys.backslash = true;
    }
    if (event.key === "Delete") {
      keys.delete = true;
    }
    if (keys.backslash && keys.delete) {
      CharacterReleaseTotal(Player);
      setTimeout(function () {
        WardrobeFastLoad(Player, 2, true)
      }, 500);
      if (CurrentScreen == "ChatRoom") {
        ChatRoomCharacterUpdate(Player);
        CharacterRefresh(Player);
      } else
        CharacterRefresh(Player);
    }
  });
  addEventListener("keyup", (event) => {
    if (event.keyCode == 220) {
      keys.backslash = false;
    }
    if (event.key === "Delete") {
      keys.delete = false;
    }
  });
  addEventListener("keydown", (event) => {
    if (event.keyCode == 220 && keys.delete == false) {
      if (CurrentCharacter == null) {
        CharacterReleaseTotal(Player)
      } else {
        for (let C = 0; C < ChatRoomCharacter.length; C++)
          if (ChatRoomCharacter[C].MemberNumber == CurrentCharacter.MemberNumber) {
            CharacterReleaseTotal(CurrentCharacter);
            ChatRoomCharacterUpdate(CurrentCharacter);
          }
      }
      if (CurrentScreen == "ChatRoom") {
        ChatRoomCharacterUpdate(Player);
        CharacterRefresh(Player);
      } else
        CharacterRefresh(Player);
    } else if (event.keyCode == 109) {
      if (CurrentScreen == "ChatRoom") {
        DialogLentLockpicks = false;
        ChatRoomClearAllElements();
        ServerSend("ChatRoomLeave", "");
        ChatRoomSetLastChatRoom("");
        ChatRoomLeashPlayer = null;
        CommonSetScreen("Online", "ChatSearch");
        CharacterDeleteAllOnline();
        ChatSearchExit();
      } else
        MainHallWalk("MainHall");
    } else if (event.key === "]") {
      StruggleProgress = 125;
    } else if (event.key === "[") {
      document.getElementById("InputChat").style.display = "none";
      document.getElementById("TextAreaChatLog").style.display = "none";
      CharacterAppearanceReturnRoom = "ChatRoom";
      CharacterAppearanceReturnModule = "Online";
      ChatRoomStatusUpdate("Wardrobe");
      CharacterAppearanceLoadCharacter(Player);
    }
  })
})();
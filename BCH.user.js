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
// @grant        GM_xmlhttpRequest
// ==/UserScript==
// @ts-check
// eslint-disable-next-line
/// <reference path="./bch.d.ts" />
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-undef */
/* eslint-disable no-implicit-globals */
/**
 *  THIS SCRIPT USES CODE FROM https://gitlab.com/Sidiousious/bch/ IT IS NOT MY CODE. IT IS LICENSED UDNER GPLv3
 * 	GO SUPPORT THE ORIGINAL AUTHOR	
 * 
 *  Copyright (C) 2022  Sid
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
// eslint-disable-next-line capitalized-comments, multiline-comment-style
// prettier-ignore
// @ts-ignore
// eslint-disable-next-line
var bcModSdk=function(){"use strict";const o="1.0.2";function e(o){alert("Mod ERROR:\n"+o);const e=new Error(o);throw console.error(e),e}const t=new TextEncoder;function n(o){return!!o&&"object"==typeof o&&!Array.isArray(o)}function r(o){const e=new Set;return o.filter((o=>!e.has(o)&&e.add(o)))}const a=new Map,i=new Set;function d(o){i.has(o)||(i.add(o),console.warn(o))}function c(o,e){if(0===e.size)return o;let t=o.toString().replaceAll("\r\n","\n");for(const[n,r]of e.entries())t.includes(n)||d(`ModSDK: Patching ${o.name}: Patch ${n} not applied`),t=t.replaceAll(n,r);return(0,eval)(`(${t})`)}function s(o){const e=[],t=new Map,n=new Set;for(const r of u.values()){const a=r.patching.get(o.name);if(a){e.push(...a.hooks);for(const[e,i]of a.patches.entries())t.has(e)&&t.get(e)!==i&&d(`ModSDK: Mod '${r.name}' is patching function ${o.name} with same pattern that is already applied by different mod, but with different pattern:\nPattern:\n${e}\nPatch1:\n${t.get(e)||""}\nPatch2:\n${i}`),t.set(e,i),n.add(r.name)}}return e.sort(((o,e)=>e.priority-o.priority)),{hooks:e,patches:t,patchesSources:n,final:c(o.original,t)}}function l(o,e=!1){let r=a.get(o);if(r)e&&(r.precomputed=s(r));else{let e=window;const i=o.split(".");for(let t=0;t<i.length-1;t++)if(e=e[i[t]],!n(e))throw new Error(`ModSDK: Function ${o} to be patched not found; ${i.slice(0,t+1).join(".")} is not object`);const d=e[i[i.length-1]];if("function"!=typeof d)throw new Error(`ModSDK: Function ${o} to be patched not found`);const c=function(o){let e=-1;for(const n of t.encode(o)){let o=255&(e^n);for(let e=0;e<8;e++)o=1&o?-306674912^o>>>1:o>>>1;e=e>>>8^o}return((-1^e)>>>0).toString(16).padStart(8,"0").toUpperCase()}(d.toString().replaceAll("\r\n","\n")),l={name:o,original:d,originalHash:c};r=Object.assign(Object.assign({},l),{precomputed:s(l)}),a.set(o,r),e[i[i.length-1]]=function(o){return function(...e){const t=o.precomputed,n=t.hooks,r=t.final;let a=0;const i=d=>{var c,s,l,f;if(a<n.length){const e=n[a];a++;const t=null===(s=(c=w.errorReporterHooks).hookEnter)||void 0===s?void 0:s.call(c,o.name,e.mod),r=e.hook(d,i);return null==t||t(),r}{const n=null===(f=(l=w.errorReporterHooks).hookChainExit)||void 0===f?void 0:f.call(l,o.name,t.patchesSources),a=r.apply(this,e);return null==n||n(),a}};return i(e)}}(r)}return r}function f(){const o=new Set;for(const e of u.values())for(const t of e.patching.keys())o.add(t);for(const e of a.keys())o.add(e);for(const e of o)l(e,!0)}function p(){const o=new Map;for(const[e,t]of a)o.set(e,{name:e,originalHash:t.originalHash,hookedByMods:r(t.precomputed.hooks.map((o=>o.mod))),patchedByMods:Array.from(t.precomputed.patchesSources)});return o}const u=new Map;function h(o){u.get(o.name)!==o&&e(`Failed to unload mod '${o.name}': Not registered`),u.delete(o.name),o.loaded=!1}function g(o,t,r){"string"==typeof o&&o||e("Failed to register mod: Expected non-empty name string, got "+typeof o),"string"!=typeof t&&e(`Failed to register mod '${o}': Expected version string, got ${typeof t}`),r=!0===r;const a=u.get(o);a&&(a.allowReplace&&r||e(`Refusing to load mod '${o}': it is already loaded and doesn't allow being replaced.\nWas the mod loaded multiple times?`),h(a));const i=t=>{"string"==typeof t&&t||e(`Mod '${o}' failed to patch a function: Expected function name string, got ${typeof t}`);let n=c.patching.get(t);return n||(n={hooks:[],patches:new Map},c.patching.set(t,n)),n},d={unload:()=>h(c),hookFunction:(t,n,r)=>{c.loaded||e(`Mod '${c.name}' attempted to call SDK function after being unloaded`);const a=i(t);"number"!=typeof n&&e(`Mod '${o}' failed to hook function '${t}': Expected priority number, got ${typeof n}`),"function"!=typeof r&&e(`Mod '${o}' failed to hook function '${t}': Expected hook function, got ${typeof r}`);const d={mod:c.name,priority:n,hook:r};return a.hooks.push(d),f(),()=>{const o=a.hooks.indexOf(d);o>=0&&(a.hooks.splice(o,1),f())}},patchFunction:(t,r)=>{c.loaded||e(`Mod '${c.name}' attempted to call SDK function after being unloaded`);const a=i(t);n(r)||e(`Mod '${o}' failed to patch function '${t}': Expected patches object, got ${typeof r}`);for(const[n,i]of Object.entries(r))"string"==typeof i?a.patches.set(n,i):null===i?a.patches.delete(n):e(`Mod '${o}' failed to patch function '${t}': Invalid format of patch '${n}'`);f()},removePatches:o=>{c.loaded||e(`Mod '${c.name}' attempted to call SDK function after being unloaded`);i(o).patches.clear(),f()},callOriginal:(t,n,r)=>(c.loaded||e(`Mod '${c.name}' attempted to call SDK function after being unloaded`),"string"==typeof t&&t||e(`Mod '${o}' failed to call a function: Expected function name string, got ${typeof t}`),Array.isArray(n)||e(`Mod '${o}' failed to call a function: Expected args array, got ${typeof n}`),function(o,e,t=window){return l(o).original.apply(t,e)}(t,n,r)),getOriginalHash:t=>("string"==typeof t&&t||e(`Mod '${o}' failed to get hash: Expected function name string, got ${typeof t}`),l(t).originalHash)},c={name:o,version:t,allowReplace:r,api:d,loaded:!0,patching:new Map};return u.set(o,c),Object.freeze(d)}function m(){const o=[];for(const e of u.values())o.push({name:e.name,version:e.version});return o}let w;const y=void 0===window.bcModSdk?window.bcModSdk=function(){const e={version:o,apiVersion:1,registerMod:g,getModsInfo:m,getPatchingInfo:p,errorReporterHooks:Object.seal({hookEnter:null,hookChainExit:null})};return w=e,Object.freeze(e)}():(n(window.bcModSdk)||e("Failed to init Mod SDK: Name already in use"),1!==window.bcModSdk.apiVersion&&e(`Failed to init Mod SDK: Different version already loaded ('1.0.2' vs '${window.bcModSdk.version}')`),window.bcModSdk.version!==o&&alert(`Mod SDK warning: Loading different but compatible versions ('1.0.2' vs '${window.bcModSdk.version}')\nOne of mods you are using is using an old version of SDK. It will work for now but please inform author to update`),window.bcModSdk);return"undefined"!=typeof exports&&(Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=y),y}();

const BCH_VERSION = "1.0";

async function BondageClubHelper() {
    "use strict";

	const w = window;

    if (typeof ChatRoomCharacter === "undefined") {
		console.warn("Bondage Club not detected. Skipping BCH initialization.");
		return;
	}

	const modApi = bcModSdk.registerMod('BondageClubHelper', BCH_VERSION);

	w.BCH_VERSION = BCH_VERSION;

	var DressButtonTimer; 
	var LeaveButtonTimer;
	var EmoticonBlockTimer;

	let bcxType = "none";

	const BCH_GITHUB = "https://github.com/NarikoNep/BondageClub-Helper",
	BCH_MSG = "BCHMsg",
	HIDDEN = "Hidden",
	MESSAGE_TYPES = Object.freeze({
		Hello: "Hello",
	});

	const HOOK_PRIORITIES = {
		Top: 11,
		OverrideBehaviour: 10,
		ModifyBehaviourHigh: 6,
		ModifyBehaviourMedium: 5,
		ModifyBehaviourLow: 4,
		AddBehaviour: 3,
		Observe: 0,
	};

	let bchSettings = {};

	const defaultSettings = Object.freeze({
		allowLeave: {
			label: "Allows you to leave the room, and unlocks wardrobe",
			value: false,
			sideEffects: (newValue) => {
				if (newValue) {
					bchLog("You are now allowed to leave the chatroom");
					ChatRoomCanLeave = function() {return true;}
					Player.IsSlow = function () {return false;}
					Player.CanChangeOwnClothes = function() {return true;}
					ChangeLeaveButtonColor();
					ChangeDressButtonColor();
				} else {
					ChatRoomCanLeave = function () {if (ChatRoomLeashPlayer != null) {if (ChatRoomCanBeLeashedBy(0, Player)) {return false;} else ChatRoomLeashPlayer = null;}if (!Player.CanWalk()) return false;if (ChatRoomData.Locked && (ChatRoomData.Game == "GGTS")) return false;if (!ChatRoomData.Locked || ChatRoomPlayerIsAdmin()) return true;for (let C = 0; C < ChatRoomCharacter.length; C++)if (ChatRoomData.Admin.indexOf(ChatRoomCharacter[C].MemberNumber) >= 0)return false;return true;}
					Player.IsSlow = function() {return (((Player.Effect.indexOf("Slow") >= 0) || (Player.Pose.indexOf("Kneel") >= 0)) && ((Player.ID != 0) || !Player.RestrictionSettings.SlowImmunity));}
					Player.CanChangeOwnClothes = function() {return this.CanChangeClothesOn(this);}
					clearTimeout(LeaveButtonTimer);
					clearTimeout(DressButtonTimer);
					modApi.removePatches("ChatRoomRun");
					modApi.removePatches("ChatRoomMenuDraw");
				}
				bchLog("allowLeave", newValue);
			},
			category: "General",
		},
		EmoticonBlock: {
			label: "Block actions based on emoticon",
			value: false,
			sideEffects: (newValue) => {
					if (newValue) {
						EmoticonBlockTimerCheck();
					} else {
						clearTimeout(EmoticonBlockTimer);
					}
				bchLog("EmoticonBlock", newValue);
			},
			category: "General",
		},
		Pastebin: {
			label: "Enable Pastebin for exportlook",
			value: false,
			sideEffects: (newValue) => {
				bchLog("Pastebin", newValue);
			},
			category: "General",
		},
	});

	function settingsLoaded() {
		return Object.keys(bchSettings).length > 0;
	}

	const bchSettingKey = () => `bch.settings.${Player?.AccountName}`;

	const bchLoadSettings = async () => {
		await waitFor(() => !!Player?.AccountName);

		const key = bchSettingKey();

		bchLog("loading settings", key);
		if (!settingsLoaded()) {

			let settings = JSON.parse(localStorage.getItem(key));
			const onlineSettings = JSON.parse(
				LZString.decompressFromBase64(Player.OnlineSettings.BCH) || null
			);
			if (onlineSettings?.version >= settings?.version || (typeof settings?.version === "undefined" && typeof onlineSettings?.version !== "undefined") ) {
				settings = onlineSettings;
			}
			if (!settings) {
				bchLog("no settings", key);
				settings = {};
			}

			for (const setting in defaultSettings) {
				if (!Object.prototype.hasOwnProperty.call(defaultSettings, setting)) {
					continue;
				}
				if (!(setting in settings)) {
					settings[setting] = defaultSettings[setting].value;
				}
			}
			bchSettings = settings;
			return settings;
		}
		return bchSettings;
	};

	const bchSaveSettings = () => {
		localStorage.setItem(bchSettingKey(), JSON.stringify(bchSettings));
		Player.OnlineSettings.BCH = LZString.compressToBase64(
			JSON.stringify(bchSettings)
		);
		ServerAccountUpdate.QueueData({
			OnlineSettings: Player.OnlineSettings,
		});
	};

	function postSettings() {
		bchLog("handling settings side effects");
		for (const [k, v] of Object.entries(bchSettings)) {
			if (k in defaultSettings) {
				defaultSettings[k].sideEffects(v);
			}
		}
		bchSaveSettings();
	}

	const ICONS = Object.freeze({
		USER: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyEAYAAABOr1TyAAAACXBIWXMAAC4jAAAuIwF4pT92AAABeWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjaldA9a1MBGMXx302UVo10MIJIhztU6dBCVSiOEsEu0SGNkESX5DZvkKTh3gQproKLQ8FBdLHq4DfQVXBVEARFEHHxC/i2SLkOKaQIHTzTn3M4Dw+HTLEX9ZNDK/QHo7i0Vggr1Vo4803OESeds1iPkuHV9StlB+r3BwG8X+5F/cT/6dhGM4kIZrEaDeMRwSUUb42GI4J7yEed+gbBDpbiSrVG8Ab5xoS/It+e8E/k43LpMplZhO193NjHUSfuk1nEQr83jvb+CZBrDq6v4zTmJUrWFIQaxrp6RpZ1DTigt4J512wKRTYNbYl1tXWMLAmNJZpCLbGmpp6tSrUW/rtn0rpwfnI9V+DwlzT9cYaZ++xup+mfJ2m6+5TsZ14Npv3NHS7+Irs99RYeM3eHF6+nXuMBL+9y6tOwHtdBFplWi+/POV7lxDuO3phstZd79pHybYpvefiIsy3mbv4FQr9oKb+MK8cAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAYpJREFUeNrsmtGRgjAQhsWhALWDowS1BCzBK8EWxAq8GrxSsAS9Eizhjg5yD3Ef0AQwkCD6/S87TgaW8P2bTRwipZRSaoSeRGNeAUAQQACCAAIQ5EFx9fA26ybN36+Oh0O7+7g+z6P5k0TH9afb/dJUx8XSPH4+6Xg83g3JOcQcu1KeV+dpGkPlT9N299tm1dfL+P31sZvjLperQ74tDvvQcbMpO04c3tSxtooIlb8HuTmyziFtHdZ3/v4qhKbOLgu12GUNVecfHVcryy6pAEhQSdM2bCtfs0IWcx3z3Dw+nZj33dnu2R3azfxlVxcMyHRWPgDVOrYYqmO7mb/3pi6OlzX6Nkol2Bz1tR94j6qZv/v5xrFCHnW8P0f11KNq5m/7y+Rtm7q8EFsl3vY0dlm+1/jJUCuSgyFAkIclS5aCph8QSfOznZxtiqLyb8kXKj8V8vaK+FCOCkEAAQgCCEAQQACCAAIQBBAEEIAggAAEAQQgCCAAQQBBAAEIAghAEEBeWf8AAAD//wMAOcMcbwwSh6AAAAAASUVORK5CYII=",
		//LOGOOLD: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAABWCAYAAAEiUVFhAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAHRgSURBVHgBAO8BEP4B////5fn5+Q3///8AAQEBAPj4+AADAwMA/v7+AAICAgAMDAwAAAAAAAAAAAAA+Pj48oeHh//+/v7/AAAA/0FBQf8AAAD/EBAQ/5+fn//5+fn/xsbG//7+/v8A+Pj48v////8nJyf/BQUF/wAAAP9QUFD/AAAA/wAAAP8AAAD/AAAA/9/f3/8A////8v7+/v+IiIj/g4OD/wAAAP/Y2Nj/AAAA/wcHB/8wMDD/AAAA/7a2tv8A////8uHh4f9hYWH/Dw8P/y0tLf8AAAD/AAAA/wAAAP8bGxv/AAAA/9TU1P8A////8v7+/v8pKSn/nZ2d/+vr6///////8/Pz/2RkZP/l5eX/GBgY/9PT0/8A////8v//////////AAAA/5mZmf/w8PD//v7+/0pKSv9BQUH/AAAA/2dnZ/8A////8v//////////Li4u///////+/v7//////3BwcP+JiYn/AAAA/xUVFf8A////8tfX1/+qqqr/sbGx/0VFRf/MzMz/bGxs/wwMDP/r6+v/AAAA/yIiIv8A/v7+8v//////////OTk5//Ly8v//////c3Nz/wAAAP/+/v7/VVVV/xQUFP8B////8v///w3x8fEACQkJANnZ2QCampoAExMTAODg4ACFhYUAHBwcAL6+vgAA7wEQ/gH5+fny/Pz8AAMDAwD+/v4A+vr6AAgICAD4+PgACwsLAAQEBAAAAAAAAAAAAACampr//v7+/wAAAP+Tk5P/AAAA/wAAAP/29vb/AAAA/01NTf/+/v7/9PT0/wCdnZ3//v7+/15eXv8AAAD/DQ0N/z4+Pv8kJCT/AAAA/wAAAP/AwMD//////wD+/v7/zc3N/+Pj4/+jo6P/AAAA//v7+/8AAAD/AAAA/wICAv84ODj//////wIAAAAAyMjIAF1dXQDj4+MABwcHACwsLACqqqoAAQEBAEVFRQDIyMgAAAAAAAD9/f3//////w0NDf9dXV3//f39//////9FRUX/AAAA/729vf8AAAD//////wD/////lpaW/wMDA//6+vr///////7+/v/+/v7/AAAA/xMTE/8AAAD//////wD//////v7+/zExMf8AAAD////////////+/v7/AAAA/x4eHv8MDAz/8/Pz/wD+/v7//v7+/5eXl/81NTX/CQkJ//////8AAAD/AAAA/6+vr/8AAAD/5+fn/wIAAAAA9vb2AN3d3QASEhIA8vLyAAAAAAD///8AVVVVAB0dHQCrq6sA7+/vAADm5ub//////xMTE/+/v7///////2xsbP8SEhL/dnZ2/9PT0///////1tbW/wDTAyz8Afn5+fK0tLQN7e3tAENDQwCbm5sAIiIiAAkJCQD09PQAra2tAFpaWgC/v78AFhYWADQ0NADMzMwAv7+/ABISEgA8PDwAJycnAFdXVwAAAAAAAAAAAAEBAQAA9/f38piYmP95eXn//v7+//v7+/8AAAD/Ozs7/1VVVf8AAAD/AAAA/wAAAP8SEhL/AAAA/zg4OP8fHx//Hx8f/ycnJ/8iIiL/Tk5O/////////////////wH29vbyCQkJDf///wAAAAAAXl5eAO/v7wDs7OwAycnJAP39/QADAwMAAAAAAAAAAAAAAAAAAQEBAAMDAwD8/PwAAAAAAAAAAABAQEAAAAAAAFxcXABjY2MAAP////L+/v7//////3d3d/+ampr/Wlpa/xMTE///////AAAA/wAAAP8YGBj/Kioq/x4eHv8NDQ3/ZGRk/wAAAP8bGxv/ZGRk/wAAAP8SEhL/2dnZ//////8A/f398v7+/v//////7+/v/1ZWVv8xMTH/t7e3///////IyMj/pKSk/wAAAP//////k5OT/1ZWVv9TU1P/AAAA/1ZWVv+bm5v/AAAA/83Nzf///////////wD////y/v7+/7e3t/+4uLj/ExMT/y0tLf8AAAD//////yEhIf///////v7+//7+/v/+/v7//////9jY2P8AAAD/LCws/+zs7P8AAAD/AgIC/52dnf//////AP////L///////////7+/v/X19f/Kioq/xUVFf/q6ur//v7+//7+/v/FxcX//v7+//7+/v/6+vr//v7+/wAAAP9HR0f/JSUl/wAAAP8AAAD/KCgo//////8CAAAAAAAAAADr6+sAAAAAAICAgAAfHx8AOTk5AENDQwAMDAwAAQEBADk5OQDz8/MAAAAAAAUFBQAyMjIAAAAAADo6OgDg4OAAAAAAACYmJgD09PQAAAAAAAIAAAAAy8vLABQUFACwsLAAqKioAElJSQAAAAAAHBwcABwcHAABAQEAp6enAMTExABBQUEAsLCwANDQ0ABlZWUAWlpaAIaGhgAAAAAAEhISACEhIQDi4uIAAP////L+/v7/iIiI//7+/v9HR0f/ICAg/w0NDf8iIiL/+fn5//7+/v/Nzc3//////4yMjP8cHBz/AAAA///////+/v7/eXl5/wAAAP+1tbX/iIiI/+7u7v8B//////Ly8gD7+/sACQkJAP7+/gDe3t4ALi4uAAAAAAD///8AAQEBAOPj4wD///8AAQEBAO/v7wAVFRUAAwMDAOnp6QAtLS0A9fX1AN3d3QAJCQkAJSUlAABOB7H4Afz8/PL8/PwA////AAAAAAABAQEAAAAAAAAAAAD9/f0A/v7+AP39/QAICAgAAAAAAP7+/gD6+voABAQEAAQEBAAHBwcAAAAAAAAAAAAAAAAAAAAAAAHa2tr/v7+/ABoaGgDd3d0AAQEBAP39/QAQEBAA9PT0AB4eHgDFxcUA5+fnAERERAADAwMAj4+PAAEBAQB4eHgAVFRUAAAAAAD///8AAAAAAAEBAQAA0dHR/4CAgP/Jycn//v7+//////8AAAD/SEhI/wAAAP8AAAD/AAAA/wAAAP8BAQH/AAAA/0JCQv8AAAD/pqam/8vLy/+1tbX///////7+/v//////ANHR0f+AgID///////7+/v8AAAD/kpKS/wAAAP9ERET/AAAA/wAAAP8AAAD/ICAg/yQkJP8AAAD/MDAw/wAAAP8/Pz//Kioq/7Kysv/+/v7/39/f/wDR0dH/sbGx//7+/v//////S0tL/wsLC/8/Pz//29vb/wAAAP8AAAD/AAAA/29vb/8UFBT/AAAA/wAAAP9DQ0P/AAAA/0BAQP8qKir/+Pj4//////8A8/Pz//7+/v/+/v7/39/f/x4eHv8mJib/AAAA/6Wlpf8jIyP/aWlp/1ZWVv8+Pj7/Q0ND/w4ODv8AAAD/JiYm/w8PD/8AAAD/HBwc//r6+v//////AP/////+/v7//////5+fn/9RUVH/Z2dn/w0NDf8dHR3/Pj4+/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8MDAz/AAAA/wAAAP//////4ODg/wIAAAAAAAAAAP39/QAaGhoAGBgYAMvLywDc3NwAOzs7AODg4AAAAAAAzc3NAP///wABAQEAAQEBACYmJgAAAAAA9PT0AAAAAAABAQEAAAAAAB4eHgACAAAAAAEBAQDw8PAAx8fHAAcHBwD+/v4Aa2trAC4uLgDs7OwAAQEBAPPz8wAAAAAA/v7+AKysrACLi4sADAwMAAAAAAAAAAAAJiYmAPj4+AAAAAAAAf/////g4OAAx8fHAMbGxgD7+/sAtra2AO7u7gDt7e0ABwcHAAEBAQAAAAAAxMTEAOXl5QBzc3MA+/v7AP7+/gDq6uoAAQEBACAgIAAxMTEAra2tAAIAAAAA////AAAAAAA7OzsA2traAO3t7QDR0dEA3d3dAPDw8AD///8A////ANTU1ABWVlYAFRUVAMXFxQDr6+sAoKCgAAAAAACHh4cA8/PzAAAAAAAA////////////////29vb/w4ODv8AAAD/b29v/05OTv+ysrL//v7+//7+/v/+/v7//v7+/39/f/96enr/BgYG/5iYmP8AAAD/NDQ0/15eXv//////AP//////////9fX1//////8WFhb/AQEB/0lJSf//////pKSk//v7+//+/v7//v7+//7+/v///////////wAAAP82Njb/AAAA/yAgIP8SEhL//////wD//////////7y8vP/g4OD/CQkJ/xcXF//CwsL//v7+//7+/v///////v7+//7+/v/+/v7//////7Kysv8AAAD/BQUF/wAAAP8JCQn/AAAA//7+/v8A///////////BwcH//v7+/0NDQ/9gYGD/YWFh//n5+f++vr7//v7+/////////////v7+//////8MDAz/AAAA/zMzM/8AAAD/AAAA/wAAAP++vr7/AgAAAAAAAAAAPj4+AAEBAQC8vLwAKSkpAN/f3wAaGhoAkpKSAAEBAQD///8A+Pj4AAAAAACsrKwA9PT0ADk5OQAWFhYAAAAAAAAAAAAAAAAArq6uAAIAAAAAAAAAAP///wDHx8cA5ubmANHR0QAsLCwABwcHAMLCwgBTU1MAp6enAAgICAACAgIAQkJCAAAAAACampoAkJCQAAAAAAAAAAAAAAAAAAYGBgAEAAAAAAAAAAABAQEAwcHBAPDw8AD7+/sA0dHRAOjo6AD+/v4ACwsLAElJSQDFxcUA////AI6OjgAAAAAA////ACYmJgAeHh4A4uLiAAAAAAD29vYAAP/////+/v7/FxcX//7+/v+goKD/R0dH/ycnJ///////9vb2//7+/v+6urr//////5iYmP8AAAD/BwcH////////////pqam/09PT/8GBgb/ZGRk/wD/////19fX/////////////////0ZGRv8VFRX///////v7+//+/v7/xMTE////////////AAAA/8/Pz//+/v7////////////Z2dn/n5+f//////8E/Pz8ACgoKAAAAAAAc3NzAOzs7ADMzMwAAAAAAAAAAADm5uYAHh4eALu7uwC+vr4A2NjYABISEgDz8/MAkJCQACMjIwBOTk4AOTk5AO3t7QD9/f0AAf/////5+fkA9/f3AAQEBAACAgIA3NzcAAAAAAAoKCgABgYGAAAAAADm5uYA/v7+APHx8QAODg4ABAQEABcXFwD4+PgACgoKAAAAAAAAAAAA////AAAxDs7xAfz8/PLy8vIN7OzsAPb29gABAQEA6+vrAObm5gA1NTUA+vr6AP///wABAQEAAAAAAP///wABAQEACAgIAMnJyQBDQ0MAwcHBACUlJQAMDAwA6enpAPn5+QANDQ0A9fX1AA4ODgDZ2dkAAAAAAAAAAAAAAAAAAAAAADY2NgDp6ekANDQ0AOrq6gAgICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+Pj48tnZ2Q3IyMgA5ubmAAYGBgAhISEAWFhYAAEBAQAAAAAA/Pz8APj4+AAiIiIAREREAN7e3gAREREAS0tLAMXFxQCpqakAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERERAENDQwAjIyMAFBQUAHV1dQAAAAAAVVVVAAEBAQCoqKgAW1tbAKWlpQCdnZ0AY2NjAP///wAAAAAAAAAAAAAAAAAAAAAA////AAIAAAAAAAAAAAAAAAABAQEA39/fAFlZWQAAAAAA////AAAAAACnp6cADQ0NAOvr6wBJSUkAFRUVALi4uAB2dnYAvr6+AP///wD///8A////AP///wAKCgoABAQEAP///wD29vYAJCQkAPb29gAQEBAAMDAwAJCQkAC7u7sAEhISADs7OwCvr68ArKysALi4uAC9vb0A8vLyAAAAAAAAAAAAAAAAAN7e3gACAgIAAPf39/LR0dH/mJiY/3Jycv/19fX//v7+//7+/v//////tLS0/wAAAP8wMDD/V1dX/wAAAP8XFxf/AAAA/3d3d/8AAAD/AAAA/wAAAP8BAQH/AAAA/zAwMP8AAAD/AQEB/xsbG/8AAAD/AAAA/xoaGv8AAAD/AAAA/6CgoP8AAAD/AAAA/wAAAP8AAAD/oaGh/wAAAP+xsbH///////7+/v/p6en///////////8A9/f38s/Pz/+0tLT///////7+/v/+/v7//v7+/+jo6P98fHz/LCws/zc3N/8XFxf/AAAA/ysrK/8AAAD/0tLS/09PT/8JCQn/NDQ0/wAAAP9LS0v/JCQk/1paWv9mZmb/urq6/wMDA/8AAAD/Nzc3/wAAAP8AAAD/AAAA/zw8PP84ODj/AAAA/wAAAP8AAAD/Kioq/x8fH/+pqan/2NjY/97e3v///////////wD////y//////7+/v/+/v7//v7+//7+/v//////kJCQ/2FhYf9LS0v/QUFB/x4eHv9lZWX/AAAA/6ysrP9eXl7/AAAA/x8fH/8AAAD/AAAA/6Wlpf/CwsL/AAAA/wAAAP8EBAT/AAAA/wAAAP8AAAD/ISEh/wAAAP8AAAD/AgIC/wkJCf9VVVX/AAAA/wAAAP8AAAD/AAAA/z8/P//39/f/8PDw/+bm5v//////BAAAAAAAAAAAAAAAAAAAAAAAAAAA9/f3AM7OzgDm5uYAd3d3AMXFxQD4+PgAt7e3AN/f3wCUlJQAPDw8AGhoaAADAwMAIyMjAOHh4QASEhIAW1tbAObm5gB/f38A8fHxAJCQkAAAAAAAAAAAAAAAAADr6+sAAAAAAAAAAAD+/v4A9/f3APX19QAMDAwA9PT0AAAAAAAAAAAA8PDwAOTk5AD5+fkAKysrAPPz8wAA////8v/////+/v7//v7+/+np6f//////aGho/5WVlf9vb2//cHBw/0RERP8xMTH/ERER/93d3f//////2dnZ/wAAAP8AAAD/Ojo6/wAAAP/Dw8P/AAAA/76+vv8AAAD//////1xcXP8AAAD/AAAA/1ZWVv9DQ0P/AAAA/wAAAP8AAAD//////wYGBv8AAAD/AAAA/w4ODv/v7+//vr6+/+jo6P/+/v7//////wIAAAAAAAAAAAAAAAD09PQAFhYWAMfHxwBgYGAA2dnZAPLy8gD9/f0A9/f3APj4+AB8fHwAXV1dAAAAAAAmJiYA////AEFBQQDGxsYAAAAAAD09PQCzs7MA3d3dACEhIQAAAAAAxMTEAJCQkAD///8AVFRUAL29vQD///8AAAAAAAgICABbW1sABwcHAAAAAAAAAAAAMzMzACYmJgAsLCwAFRUVAAAAAAAAAAAAAgAAAADu7u4A4uLiAOnp6QD///8A0tLSADc3NwDx8fEA3t7eAPb29gDn5+cA3d3dAEpKSgC8vLwAwsLCAAAAAAAAAAAAu7u7APr6+gD///8AbW1tAGpqagB/f38AwcHBAAEBAQA4ODgAuLi4ACwsLADR0dEAXFxcAAEBAQAAAAAA3d3dACcnJwBZWVkAAAAAAAAAAAA4ODgA6+vrAFxcXAACAgIAAAAAAAAAAAAA////8v/////+/v7/09PT///////a2tr/8vLy/8XFxf8dHR3/EBAQ/zU1Nf8AAAD/goKC/wAAAP8ZGRn/AAAA/yoqKv+Li4v///////7+/v/+/v7//v7+//7+/v///////v7+//7+/v/k5OT/6urq/8/Pz///////AAAA/wAAAP8xMTH/4eHh/8jIyP8AAAD/BgYG/09PT/8HBwf/PDw8/5eXl////////////wD////y///////////+/v7/1NTU//////9mZmb/1tbW/3Nzc/8ZGRn/AAAA/woKCv8GBgb/rq6u//j4+P+pqan/hISE/7y8vP//////+vr6///////+/v7//v7+//7+/v/+/v7//v7+//7+/v///////////wAAAP8UFBT/AAAA/zU1Nf/9/f3/IiIi/wAAAP8AAAD/Pz8//wAAAP8AAAD/eXl5////////////AP////L/////////////////////paWl//////8uLi7//////yUlJf8oKCj/FRUV/wICAv84ODj/hYWF//7+/v///////v7+//7+/v/x8fH/5ubm//7+/v/+/v7//v7+//7+/v/+/v7//////6CgoP/IyMj//////wAAAP8AAAD/Ojo6/wAAAP8VFRX/AAAA/wAAAP8WFhb/AAAA/wAAAP8iIiL/7+/v//////8EAAAAAAAAAAAAAAAAAAAAAAAAAAAaGhoAAAAAANHR0QCcnJwADg4OAP39/QAtLS0ABAQEALq6ugDw8PAAenp6AP///wABAQEA////AA0NDQAODg4A////AAAAAAAAAAAAAAAAAAAAAAD///8AXl5eAAEBAQAEBAQAAAAAAAAAAAAmJiYA7e3tAAYGBgDr6+sAAAAAAPPz8wABAQEA////ACEhIQABAQEA+/v7AAIAAAAAAAAAAAAAAAAAAAAAAAAAABMTEwD///8A////ADAwMABqamoAGRkZACcnJwAAAAAAOjo6AB8fHwABAQEAIiIiAAAAAAAAAAAAAAAAAAAAAAChoaEA3NzcALa2tgC+vr4AAQEBAP///wC8vLwAAAAAAP39/QAAAAAAAAAAAAYGBgDl5eUA/v7+AAAAAAAAAAAA9/f3ABkZGQAAAAAA0dHRAJ6engAEBAQAAP////L//////v7+//7+/v/Hx8f///////7+/v//////EhIS//////9nZ2f/Xl5e/7Kysv9kZGT/NTU1/xYWFv8pKSn/CgoK/09PT/+np6f/9vb2////////////////////////////GBgY/zMzM/8YGBj/AAAA/wAAAP98fHz/nJyc/6SkpP8tLS3/AAAA/wAAAP8AAAD/Gxsb/wAAAP8UFBT/Y2Nj//Pz8/8EAAAAAAAAAAABAQEAq6urAFVVVQD///8AAQEBAAEBAQD///8ApaWlADo6OgDFxcUAubm5AObm5gAHBwcAAgICABwcHAAICAgAsbGxAPf39wDCwsIAcXFxANPT0wAeHh4ANTU1AAsLCwD09PQASUlJAM3NzQAAAAAAAAAAAHJycgDb29sANjY2APb29gBmZmYAAAAAAAAAAAABAQEAAAAAACQkJAAODg4AAAAAAAQAAAAA4uLiAB4eHgBUVFQA////AAEBAQABAQEA////AAAAAADHx8cAAAAAAODg4AD+/v4A8PDwAAAAAAAQEBAAoaGhABkZGQAAAAAAAAAAALS0tAC6uroAXl5eAA0NDQAAAAAA9PT0AJiYmAC4uLgAAAAAAAAAAADm5uYAv7+/AFJSUgAAAAAA0NDQAGpqagCWlpYALy8vABQUFADk5OQA9fX1APLy8gDk5OQAAgAAAAAeHh4A////AAEBAQCZmZkArKysAP///wAAAAAAn5+fAJSUlADb29sAHBwcAN/f3wDm5uYA+vr6ANXV1QAPDw8A+fn5AP39/QAAAAAASEhIABcXFwAMDAwAAAAAAMXFxQDY2NgAHR0dAAAAAAAA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1dXVAD8/PwC4uLgAAAAAADg4OADR0dEAyMjIAAkJCQAAAAAABwcHACAgIABUVFQA3d3dAAAAAAAAAAAAAAAAAAAAAAAAAAAACAgIAAAAAAAAAAAABQUFAAwMDADX19cAAAAAAAAAAAAAAAAAAgICAAoKCgDp6ekAIyMjAPf39wAAAAAAAP/////+/v7//v7+//7+/v/r6+v/8vLy/1xcXP/Ozs7/iYmJ/0lJSf9BQUH/Kysr/yMjI///////+Pj4/wAAAP8AAAD/RUVF/wAAAP9kZGT/AAAA//////8RERH/5ubm/wAAAP8NDQ3/BAQE/wAAAP+YmJj/AQEB/wAAAP8CAgL/AAAA/6mpqf8AAAD/AAAA/wAAAP88PDz/09PT/93d3f////////////7+/vIA//////7+/v/+/v7//////+/v7/+hoaH/u7u7/4eHh/9lZWX/QEBA/zo6Ov8oKCj/Dw8P///////u7u7/UVFR/wAAAP8kJCT/AAAA/wAAAP9TU1P/ZmZm/46Ojv9UVFT/0tLS/woKCv8AAAD/vLy8/wAAAP9aWlr/AAAA/wAAAP99fX3/NTU1/wAAAP8AAAD/AQEB/5iYmP8xMTH/////////////////////8gIAAAAAAAAAAAAAAADp6ekAEBAQALW1tQAwMDAA9PT0AAsLCwD6+voA/f39AP///wDz8/MAjIyMAJeXlwA4ODgAJSUlANzc3AATExMAAAAAAGpqagCampoAPDw8AEhISAB+fn4A9fX1AHBwcABXV1cAdnZ2ANDQ0AAAAAAAAQEBAM3NzQDNzc0ADg4OAAAAAAD///8AaGhoAEBAQADn5+cAAAAAAAAAAAAAAAAAAP/////+/v7//////97e3v//////MzMz//////9ra2v/aWlp/zMzM/8xMTH/AwMD/yQkJP////////////////+Ojo7/Jycn/wAAAP8AAAD/AAAA//////8KCgr/8vLy/+Hh4f8AAAD//////93d3f8/Pz//NDQ0/4SEhP8KCgr/LCws/zU1Nf8MDAz/AAAA/wAAAP8BAQH/2NjY/9bW1v////////////////IC/f39AAEBAQAAAAAAFBQUAAAAAAD5+fkA8vLyAPDw8ADj4+MA/v7+APf39wD9/f0A29vbAKCgoAD9/f0A9vb2ACgoKACkpKQAWFhYAAAAAAAAAAAAXFxcAPLy8gCXl5cAyMjIAJKSkgAgICAATExMAB8fHwD09PQAfHx8ABkZGQAbGxsAmpqaADY2NgAAAAAAAAAAAPj4+AAoKCgAKSkpAP///wAAAAAAAAAAAAICAgIAzs7OAAAAAAANDQ0AAAAAAAUFBQD09PQA7u7uAOjo6AANDQ0A+Pj4ABgYGAAAAAAAn5+fAAMDAwAKCgoASUlJADMzMwCSkpIA3t7eABUVFQDi4uIAsLCwALS0tABXV1cAlpaWAFdXVwD+/v4AFRUVAP///wAMDAwA+fn5AFBQUAB8fHwAFRUVAAAAAAALCwsALCwsAAwMDACIiIgAAQEBAAAAAAAAAAAAAgEBAQAyMjIAnp6eAAAAAAAAAAAAAgICABoaGgDy8vIA8/PzAAYGBgD39/cA6OjoAAAAAACioqIAe3t7AOHh4QDd3d0AAQEBABEREQAhISEA6urqAMDAwABTU1MAPDw8AP///wCfn58AxcXFACYmJgC8vLwADw8PAPX19QAICAgAGRkZABMTEwApKSkADw8PAGtrawAqKioA9PT0AAAAAAAAAAAAAAAAAAAAAAAA//////7+/v//////tra2//////88PDz//v7+/1VVVf8kJCT/Ozs7/wAAAP8LCwv/VVVV/wAAAP8LCwv/FRUV/yAgIP///////v7+//7+/v/+/v7//v7+/////////////v7+//////+kpKT//////6Ghof81NTX/AAAA/zc3N/9nZ2f/0tLS/11dXf8LCwv/AAAA/1RUVP8RERH/mJiY////////////////8gD//////v7+//7+/v/q6ur//v7+/2xsbP/5+fn/pKSk/w4ODv8AAAD/HBwc/xEREf8AAAD//////4+Pj/8gICD/cnJy///////+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//n5+f90dHT//////wAAAP8AAAD/AAAA/1JSUv++vr7/U1NT/wAAAP8AAAD/S0tL/zk5Of/IyMj/7Ozs///////////yAP/////+/v7////////////Ozs7/wcHB////////////R0dH/wAAAP8ODg7/AAAA/5KSkv+JiYn//////3x8fP/o6Oj/ubm5///////5+fn//v7+//7+/v/+/v7//v7+//7+/v/+/v7///////7+/v+Kior/dHR0/wAAAP8AAAD/pKSk//Ly8v8AAAD/AAAA/wAAAP9iYmL/Xl5e/zIyMv/S0tL///////////IA/////////////////////8PDw///////goKC/+7u7v+Tk5P/Dg4O/wAAAP8BAQH/AAAA///////n5+f//////zU1Nf///////////9zc3P///////v7+//7+/v/+/v7//v7+//7+/v/+/v7//////woKCv92dnb/AAAA/wAAAP+mpqb/AAAA/wAAAP8AAAD/AAAA/ygoKP9ERET/Dg4O/6+vr///////////8gD////////////////+/v7/0NDQ/9nZ2f+urq7/7u7u//////8AAAD/Pj4+/wgICP8iIiL/NjY2/93d3f/+/v7///////7+/v//////xsbG///////+/v7//v7+//7+/v/+/v7//v7+//v7+/84ODj//////zAwMP8AAAD/Dg4O/wcHB/8cHBz/AAAA/wAAAP8AAAD/FxcX/wEBAf8pKSn/cHBw///////////yBAAAAAAAAAAAAAAAAAAAAAAVFRUAGhoaACYmJgABAQEA////AA8PDwAGBgYAGhoaAN7e3gCenp4AIiIiAP///wD///8AAAAAAAAAAAD09PQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+/v7AMfHxwAAAAAA0NDQAAAAAAAGBgYALi4uAOLi4gAAAAAAAAAAAAAAAAAHBwcA////AAcHBwASEhIA8fHxAA8PDwACAAAAAAAAAAAAAAAAAAAAAAoKCgAAAAAA////AP///wABAQEAVlZWAAgICAD8/PwAQUFBAEBAQAD5+fkAAAAAAAAAAAABAQEA////AEVFRQD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAICAgA////AOPj4wAAAAAAAAAAAPv7+wAgICAA6urqAAAAAAAAAAAAAAAAABEREQAAAAAA8/PzALCwsAABAQEAAAAAAAIAAAAAAAAAAAAAAAAAAAAA7u7uAAAAAAAAAAAAAAAAAF5eXgBEREQACgoKABEREQD09PQAJycnACYmJgABAQEA////AOXl5QAAAAAA////AAAAAAABAQEAAQEBAAEBAQAAAAAAAAAAAAAAAAD+/v4ATk5OAAAAAAAAAAAASEhIALa2tgAPDw8ABgYGAAAAAAAAAAAADAwMAAAAAADr6+sADg4OAA4ODgAAAAAAAgAAAAAAAAAAAAAAAAAAAADu7u4AAAAAAAAAAAAAAAAAuLi4AP39/QD8/PwAHBwcAAsLCwAbGxsABgYGABMTEwCfn58AGxsbAAAAAAAAAAAAAQEBAJSUlAC7u7sAkZGRAAEBAQAAAAAA6+vrAOvr6wAVFRUAAAAAAAAAAAA/Pz8ADAwMAP7+/gAJCQkAAAAAAAAAAAAKCgoAAAAAAPPz8wDy8vIA+/v7APz8/AAA/////////////////////7q6uv///////v7+//////9SUlL/sbGx/1JSUv+np6f/RUVF/y0tLf8pKSn/EBAQ/wUFBf+1tbX///////7+/v//////+/v7/+7u7v/6+vr//v7+////////////T09P/wAAAP8AAAD/AAAA/+rq6v8rKyv/AAAA/wEBAf8AAAD/AAAA/zo6Ov8AAAD/AgIC/zIyMv/R0dH//f398gIAAAAA////AP///wAAAAAALS0tAP///wABAQEAkZGRAH9/fwDg4OAAICAgAPz8/AAwMDAACwsLABUVFQAJCQkABgYGAIyMjAB7e3sAw8PDAAAAAAADAwMAERERAAQEBAABAQEAkpKSAAEBAQBYWFgAAAAAAAAAAAAAAAAAFRUVADg4OABGRkYAHBwcAAAAAAAAAAAA4eHhAAAAAAAAAAAAAgICAOnp6QACAgIAAgAAAAAAAAAAAAAAALa2tgAYGBgAAAAAAAAAAAB1dXUALi4uAPr6+gD8/PwA5eXlAP7+/gANDQ0AAQEBAPf39wADAwMA7+/vAKmpqQABAQEAr6+vAMjIyAAAAAAAzc3NAAEBAQBvb28AlZWVAJiYmAAAAAAAAAAAAD09PQDt7e0ALCwsAAUFBQA9PT0AAAAAAAAAAADl5eUAAAAAAAEBAQACAgIA7OzsAP7+/gACAAAAAAAAAAD5+fkAPT09AP///wAAAAAAxsbGAJeXlwAAAAAA8/PzAPT09ADc3NwA8/PzAO/v7wAKCgoABwcHAPT09ADb29sA3d3dAMPDwwDe3t4ANDQ0ALq6ugDBwcEAAAAAAMXFxQArKysA+Pj4AAAAAAAAAAAAeXl5ABMTEwBNTU0AGRkZAI2NjQAAAAAAAAAAAA4ODgAAAAAA/v7+APz8/AAODg4A/v7+AAIAAAAAAQEBAMvLywAMDAwAAAAAAAEBAQA7OzsAY2NjAP///wAmJiYAAgICAPPz8wDh4eEA8vLyAAsLCwAcHBwA/v7+APX19QAAAAAA+fn5ACAgIADw8PAAvLy8ABEREQDr6+sAOjo6AMrKygDJyckAAAAAAAAAAAA2NjYAxsbGACMjIwA1NTUA+fn5AAAAAAAAAAAA8vLyACMjIwAAAAAAEhISAPf39wAEBAQAAvj4+ADY2NgAPT09AAAAAAABAQEAkJCQAKWlpQAAAAAAsbGxAPr6+gDl5eUA9fX1APb29gD9/f0AvLy8AGNjYwD///8A////AP///wBqamoA3t7eALW1tQBHR0cAurq6AOHh4QCWlpYAWlpaAAAAAAAAAAAAAAAAAMbGxgA6OjoA////ABAQEAD29vYAAAAAAAAAAABKSkoA+Pj4AAAAAAALCwsACQkJAPT09AAECAgIACcnJwD///8AAAAAAAAAAABxcXEA////AAAAAAC2trYALi4uAIODgwBnZ2cA/v7+AN3d3QD///8A8fHxAPT09AAHBwcAAgICABYWFgB1dXUA6enpABcXFwDDw8MADQ0NACUlJQBhYWEAAAAAAAAAAAB/f38AJCQkAP///wAAAAAAEhISAM/PzwACAgIA/f39AElJSQAhISEA5ubmAO3t7QDu7u4A/v7+AAD//////v7+//7+/v//////AAAA///////+/v7//////1RUVP9bW1v/3Nzc/ycnJ/8fHx//AAAA///////09PT/9vb2//r6+v/+/v7/+/v7/8LCwv///////v7+/+7u7v+vr6///////wAAAP8AAAD/AAAA/8PDw////////v7+//7+/v/IyMj/8/Pz/x4eHv/U1NT/ycnJ/66urv+EhIT/MjIy/6Kiov/w8PDyAP/////+/v7//////wAAAP///////v7+//7+/v/5+fn/4eHh/ykpKf9MTEz/BgYG/y0tLf8DAwP/cHBw//39/f/6+vr//f39//7+/v/u7u7/dXV1//Dw8P///////////7Ozs///////AAAA/wAAAP9XV1f/1NTU///////+/v7//v7+/8XFxf//////6urq/yAgIP/FxcX/0tLS/wEBAf///////f39//Dw8PICAAAAAAEBAQCLi4sA////AP///wAAAAAAAQEBAEZGRgAeHh4A19fXAN3d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////AAAAAACxsbEAS0tLANPT0wAoKCgAlJSUACEhIQAYGBgAwcHBAAAAAAAAAAAACQkJAPLy8gCQkJAAoKCgAM3NzQANDQ0AICAgAOrq6gAAAAAA3d3dAOfn5wDX19cAuLi4APX19QAAAAAALCwsAFdXVwBbW1sA+fn5APr6+gABAQEAAAAAAAAAAAAAAAAAAP////L///////////7+/v/+/v7//v7+//7+/v//////ycnJ/+jo6P//////jIyM/4yMjP//////2tra/+vr6/9JSUn/IyMj/wAAAP8AAAD/EBAQ/yoqKv8DAwP/CAgI/xYWFv9GRkb/V1dX/9vb2///////29vb/0ZGRv9KSkr/ICAg/3BwcP9DQ0P/0dHR///////+/v7////////////+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7/+/v7//////////////////////8FBQX/CAgI/xMTE/8AAAD/AAAA/wAAAP8vLy//nJyc/+Hh4f+tra3/0tLS/ywsLP8AAAD/AAAA/wAAAP8AAAD/Ly8v/1BQUP8AAAD/UlJS/wsLC/9lZWX/h4eH/+Hh4f/////////////////////yAP////L/////////////////////////////////////6enp/7y8vP///////v7+/1tbW//IyMj/3d3d///////Dw8P/Wlpa/yMjI/8AAAD/AAAA/wAAAP8BAQH/AAAA/wAAAP8XFxf/9fX1/+np6f/Ozs7/6enp///////h4eH/n5+f/5aWlv9paWn/4+Pj////////////+fn5/+Xl5f/+/v7///////7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v//////+fn5/wAAAP92dnb/tra2/wAAAP8AAAD/AAAA/wAAAP8sLCz/5ubm//////8+Pj7/AAAA/wAAAP8AAAD/AAAA/wAAAP8AAAD/OTk5/1lZWf8AAAD/T09P/wgICP8eHh7/enp6/9TU1P/////////////////////yAP////L////////////////////////////////+/v7//////8jIyP+8vLz/5eXl/93d3f9hYWH/wsLC//Hx8f///////Pz8/x4eHv8RERH/NDQ0/wAAAP8AAAD/BQUF/wUFBf8AAAD/AAAA/1xcXP/8/Pz//////////////////f39//////////////////7+/v//////8vLy/8bGxv/f39////////7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7///////////+rq6v/AAAA/9zc3P//////UFBQ/wAAAP8AAAD/AAAA/wEBAf9OTk7/AwMD/wAAAP8XFxf/ExMT/wAAAP8AAAD/AAAA/wAAAP8AAAD/Hh4e/xoaGv8AAAD/Kysr/wkJCf8XFxf/VFRU/4KCgv/4+Pj////////////////yAP////L////////////////////////////////+/v7//////9zc3P/MzMz/////////////////R0dH/1VVVf//////4uLi/xQUFP8FBQX/JiYm/09PT/8jIyP/HR0d/wAAAP80NDT/rKys/5WVlf+9vb3/1NTU//r6+v///////v7+//7+/v/+/v7//v7+//7+/v//////+Pj4/93d3f////////////7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/7+/v/z8/P/4+Pj//p6en////////////q6ur/AgIC/wAAAP8AAAD/AAAA/xcXF/80NDT/Hx8f/wAAAP8pKSn/JSUl/wAAAP8AAAD/AAAA/wAAAP8AAAD/BgYG/wsLC/8AAAD/AAAA/wAAAP8wMDD/HR0d/4qKiv/x8fH/9/f3///////////yAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEREQDy8vIAAAAAAAAAAAD///8AuLi4AFJSUgAqKioAp6enAA8PDwAwMDAAAgICAO/v7wAJCQkAAwMDADExMQDW1tYAn5+fAPT09ADz8/MAKysrAAUFBQD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAD///8ABwcHAAkJCQDT09MA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQAMDAwAHBwcAAVFRUAAAAAAAAAAAB1dXUA/v7+AAAAAAAAAAAAAAAAAP///wAoKCgALS0tABcXFwDn5+cAAQEB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AHZ2dgD19fUAAAAAAAAAAAAAAAAAAAAAAIODgwAcHBwAmZmZAD8/PwBOTk4A////AAAAAADZ2dkABAQEACgoKAAWFhYA8fHxAAAAAAAFBQUAAQEBAPr6+gD39/cAIiIiANnZ2QAAAAAA+/v7ABYWFgDy8vIAEBAQAOfn5wANDQ0ABPz8/AD4+PgAAQEBAC4uLgAAAAAA////AAAAAAAAAAAAAAAAAAEBAQDa2toAJycnAEJCQgC9vb0AAAAAAAAAAAAAAAAAt7e3AP7+/gD19fUABgYGABEREQDm5uYA9vb2AAcHBwD5+fkA9/f3AO3t7QDx8fEAenp6ALm5uQAAAAAAAAAAAPj4+AD///8AAwMDAAICAgABAQEAAwMDAAAAAAAAAAAAAAAAAMbGxgAqKioALCwsAOLi4gAHBwcA39/fAEVFRQAHBwcA2dnZAIqKigCsrKwAioqKAMrKygAAAAAAAAAAAAAAAAAAAAAAampqAC4uLgBwcHAAi4uLAAgICAD///8AAAAAAAAAAAAnJycA7OzsAMLCwgCAgIAAW1tbAFVVVQDm5uYAxcXFAIiIiADc3NwA0dHRAAsLCwD29vYA5eXlAA8PDwAAAAAA8vLyAAUFBQD09PQAAgQEBAAMDAwACwsLAP///wD///8AAAAAAAAAAAABAQEAAQEBAFdXVwAnJycAtbW1AL29vQD///8A////AAAAAADt7e0ApqamAF1dXQDv7+8A/f39AJKSkgAfHx8AAgICAPHx8QDv7+8A8fHxAOnp6QA9PT0AampqAPj4+AD09PQA9PT0AP39/QAAAAAAAQEBAAAAAAABAQEA////AP///wAAAAAA5ubmANzc3AAsLCwAAAAAAB4eHgAAAAAAfHx8AGRkZADQ0NAA0NDQAJ2dnQD7+/sAhISEAAAAAAAAAAAAAAAAAAAAAAAiIiIAGRkZANnZ2QCTk5MACAgIAP///wAAAAAAAAAAAAAAAAAZGRkADg4OAAICAgALCwsAAAAAAKurqwDExMQA////ANHR0QBTU1MANDQ0APX19QAAAAAA9PT0AOrq6gABAQEA+/v7APb29gAAAAAAAP////L///////////7+/v/+/v7//v7+///////FxcX/AAAA/6Kiov////////////7+/v/+/v7///////////9hYWH/nJyc//////9ERET/JSUl/1BQUP9NTU3/Dg4O/xsbG/8MDAz/ExMT/wYGBv8AAAD/qKio///////29vb/9/f3//j4+P/5+fn/+/v7//39/f/+/v7////////////19fX/rq6u/9jY2P///////////////////////////5aWlv+xsbH///////////9lZWX/AAAA/wAAAP8AAAD/AAAA/xISEv/Dw8P/vLy8/+rq6v///////v7+//7+/v/+/v7//v7+///////Gxsb/VFRU//b29v//////mZmZ/wAAAP95eXn/4+Pj/7q6uv9tbW3/sLCw/1BQUP9jY2P//////9nZ2f+srKz/ra2t/9HR0f/w8PDyAf////IAAAANAAAAAP///wABAQEA5ubmAF1dXQBjY2MAWlpaAAAAAAD///8AAAAAAAAAAAABAQEAAAAAAHd3dwC6uroAz8/PAPn5+QAYGBgAEBAQACgoKADm5uYA0tLSACUlJQBsbGwAdnZ2APn5+QCRkZEAICAgAOTk5ABqamoA/v7+AP///wACAgIAAAAAAAAAAAABAQEA////AImJiQDd3d0A////AAICAgAlJSUAGhoaAPr6+gAyMjIAFhYWAO3t7QD29vYALS0tANnZ2QAxMTEAAAAAAAAAAAAAAAAAGxsbAK2trQDp6ekAREREAAoKCgAAAAAAAAAAAAAAAAAAAAAA////AAEBAQClpaUA7OzsAG9vbwAAAAAAAAAAADc3NwDKysoA////AAAAAADm5uYA4ODgABMTEwB8fHwAvr6+AGpqagCDg4MAAAAAAPr6+gD8/PzzAf////IAAAANAAAAAPv7+wDCwsIAGRkZACoqKgAAAAAA////AAAAAAAAAAAAAAAAAAEBAQAAAAAA19fXAHBwcAChoaEAGBgYAMDAwABCQkIAGhoaAO7u7gD4+PgAAAAAAK6urgA+Pj4AFBQUAAAAAACbm5sAY2NjAO/v7wC2trYAIyMjACAgIAAODg4ABgYGAAMDAwABAQEAAAAAAKCgoAC/v78AJSUlAPv7+wASEhIAAgICAPT09AD7+/sA29vbAP///wD09PQAJSUlAJ+fnwDu7u4AAAAAAAAAAAAAAAAAQUFBAPb29gBNTU0ASUlJAMDAwADi4uIA+/v7APj4+ABycnIAKioqALe3twAkJCQA/f39AAoKCgAeHh4AAAAAAAAAAAACAgIAPT09AMHBwQD29vYACAgIALy8vAATExMALy8vAJqamgDOzs4ASEhIACsrKwAjIyPzAf////L+/v4N4eHhAAsLCwAWFhYA////AAAAAAABAQEAAAAAAAAAAADs7OwA/f39APT09ADc3NwA4uLiAAcHBwAEBAQABwcHAOzs7AChoaEA+fn5AAAAAAAAAAAAJycnAKampgDQ0NAAY2NjAAAAAACysrIAGxsbAAAAAAD9/f0AAgICAAEBAQAAAAAAAAAAAP///wAAAAAAAQEBAN/f3wCZmZkALCwsAPPz8wC5ubkA4+PjACYmJgD8/PwABQUFAEFBQQAYGBgAxMTEALy8vAAAAAAAAAAAAAAAAAApKSkAGhoaAAAAAAAKCgoADw8PAA4ODgD///8A7+/vAAQEBABxcXEAw8PDAB0dHQAgICAA/v7+AMfHxwArKysAEBAQAAAAAAAAAAAAMzMzAEFBQQCMjIwAAAAAAAAAAAAAAAAA4uLiAOjo6AAiIiIA4+PjACgoKAAJCQnzAf39/fL///8NAwMDAAAAAAAAAAAA+Pj4AOnp6QAICAgACAgIAOzs7AD5+fkAAgICAAoKCgALCwsA////AP///wD///8AAgICAP39/QDExMQA9vb2AAAAAAAAAAAANDQ0ACkpKQDl5eUAvr6+ABQUFABJSUkAAAAAAP7+/gDn5+cAEBAQAAsLCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADR0dEA/Pz8AAUFBQAGBgYACAgIAO7u7gD7+/sA5ubmABAQEAAhISEAz8/PAPT09AAAAAAAAAAAAA8PDwAGBgYA////ABkZGQAHBwcA/f39AAEBAQDu7u4ADAwMADExMQDU1NQA7u7uABgYGAAWFhYACQkJAAUFBQDt7e0ABAQEABEREQAAAAAAAAAAAK2trQABAQEAUlJSAAAAAAAAAAAAAAAAAMnJyQAODg4AKSkpAP///wAAAADzAf///+UAAAAN////AP39/QD///8ABAQEAP7+/gD6+voAAgICAAQEBAAAAAAA////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQD4+PgA/Pz8AAAAAAAAAAAADg4OAAEBAQD7+/sA9vb2AAwMDAADAwMAAAAAAPz8/AD8/PwACAgIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7+/gD+/v4A/v7+AP39/QACAgIAAgICAPr6+gAHBwcABAQEAP///wD7+/sA9/f3AAAAAAAAAAAAAgICAAQEBAABAQEAAQEBAAAAAAAAAAAAAAAAAP39/QAHBwcAAwMDAPn5+QAFBQUAAgICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPz8/AAAAAAAAgICAAICAgD7+/sA9vb2AAcHBwD8/PwAAwMDAAkJCQAAAAAAAAAAAAAAAAAAAADzAQAA//8Tih+LNZsdqgAAAABJRU5ErkJggg==",	
		GITHUB: "data:image/png;base64,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",
		LOGO: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAABWCAYAAAEiUVFhAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAHRgSURBVHgBAO8BEP4B2dnZ5ejo6A0DAwMA+Pj4ALi4uAAcHBwA6+vrABYWFgBra2s6AwMD1AAAAAAAvLy88qysrP////8AEhIS/0NDQ/8DAwP/ExMT/6CgoP/6+vr/5eXlZ////wAAzMzM8v///wB6enr/CQkJ/wAAAP9QUFD/AAAA/wAAAP8AAAD/ODg4/////wAA////AP///wCenp7/g4OD/wAAAP/Y2Nj/AAAA/wcHB/8wMDD/ICAg/////wAA////AP///wBvb2//Dw8P/y0tLf8AAAD/AAAA/wAAAP8bGxv/EhIS/////wAA////AP///wA6Ojr/nZ2d/+vr6///////8/Pz/2RkZP/l5eX/Hh4e/+fn52MA////AP///wD/////AQEB/5mZmf/w8PD//v7+/0pKSv9BQUH/AQEB/46Ojv8A////AP///wD///8AMzMz///////+/v7//////3BwcP+JiYn/AAAA/zw8PP8A////AP///wDR0dH/tLS0/0VFRf/MzMz/bGxs/wwMDP/r6+v/AAAA/zc3N/8A////AP///wD///8APj4+//Ly8v//////c3Nz/wAAAP/+/v7/VVVV/x4eHv8B////AAAAAAD09PT/BQUFANvb2wCdnZ0AEhISAOLi4gCAgIAAGxsbAMPDwwAA7wEQ/gHFxcXy7OzsAA8PDwDq6uoAzMzMAERERAC6uroAa2trACAgIA4AAAAAAAAAAACgoKD/////AD4+Pv+VlZX/AwMD/wMDA//29vb/BwcH/3x8fP////8A////AADExMT/////AHNzc/8AAAD/DQ0N/z4+Pv8kJCT/AAAA/woKCv/i4uJc////AAD///8A5ubm/+Tk5P+jo6P/AAAA//v7+/8AAAD/AAAA/wQEBP+IiIj3////AAIAAAAA0tLSAFxcXADj4+MABwcHACwsLACqqqoAAQEBAENDQwDExMQIAAAAAAD///8A/////w0NDf9dXV3//f39//////9FRUX/AAAA/729vf8vLy//////AAD///8AzMzMsw0NDf/6+vr///////7+/v/+/v7/AAAA/xMTE/8UFBT/////AAD///8A////AFFRUf8AAAD////////////+/v7/AAAA/x4eHv8WFhb/4uLiDQD///8A////AKurq/81NTX/CQkJ//////8AAAD/AAAA/6+vr/8EBAT/uLi4tAIAAAAAAAAAAN7e3gASEhIA8vLyAAAAAAD///8AVVVVAB0dHQCnp6cAuLi4SwL5+fklAAAAAKCgoAB6enoABAQEAHJycgAbGxsAJiYmAAkJCQBUVFQAAwMDAADTAyz8AcTExPLl5eUN/v7+AD8/PwC2trYACwsLAPz8/ADv7+8AqKioAF9fXwC7u7sAGBgYADY2NgDKysoAvLy8ABsbGwBOTk4AOTk5kTU1NXAAAAAAAAAAAAAAAAEBvr6+8uzs7A0LCwsASkpKAQAAAAA3Nzf/DQ0NABISEgCrq6sAAAAAAAAAAAASEhIA7u7uADg4OADn5+cAAAAAAAwMDAAPDw8AUFBQAHV1dQEAAAAAAAAAAADb29vy////AP///wD///8AiYmJ/1dXV/84ODj/AAAA//39/f8AAAD/AAAA/wAAAP8AAAD/AQEB/wQEBP8AAAD/AAAA/wQEBP9eXl7/mJiY3P///wD///8AAiQkJA4AAAAAAAAAAK6urv8eHh4ABAQEANvb2wD///8AAwMDAAAAAAAYGBgAKioqAB4eHgAMDAwAYGBgAAAAAAAbGxsAYWFhALu7uwDNzc0jAAAAAAAAAAAA////AP///wD///8A9PT0/2JiYv8xMTH/t7e3///////IyMj/pKSk/wAAAP//////k5OT/1ZWVv9TU1P/AAAA/1ZWVv+bm5v/DAwM/9nZ2f////8G////AAD///8A////AP///wDT09P/Ly8v/y8vL/8AAAD//////yEhIf///////v7+//7+/v/+/v7//////9jY2P8AAAD/LCws/+zs7P8DAwP/IiIi/8DAwPr///8AAP///wD///8A////AP///wDk5OT/Pz8//xcXF//q6ur//v7+//7+/v/FxcX//v7+//7+/v/6+vr//v7+/wAAAP9HR0f/JSUl/wAAAP8NDQ3/VFRU/////wMCAAAAAAAAAAAAAAAAAAAAAMPDwwAsLCwAPj4+AENDQwAMDAwAAQEBADk5OQDz8/MAAAAAAAUFBQAyMjIAAAAAADo6OgDg4OAAAAAAAB8fHwDo6OgAAAAAIQIAAAAAAAAAAAAAAADl5eX/WFhYATo6OgAAAAAAHBwcABwcHAABAQEAp6enAMTExABBQUEAsLCwANDQ0ABlZWUAWlpaAIaGhgAAAAAADg4OAA0NDQCenp7aAP///wD///8A3Nzc/////wCBgYH/ODg4/xAQEP8iIiL/+fn5//7+/v/Nzc3//////4yMjP8cHBz/AAAA///////+/v7/eXl5/wAAAP+1tbX/jIyM/8PDw/8B////AOvr6//x8fEACQkJAPX19QCIiIgAnp6eAAAAAAD7+/sABAQEAJubmwD9/f0AAwMDAMTExABMTEwABwcHALGxsQCenp4A29vbAIODgwAlJSUAeXl5AABOB7H4Ac7OzvLz8/MA/f39AAcHBwD///8A+vr6AP39/QDq6uoA6enpAObm5gBJSUkAAwMDAOjo6ADMzMwAJSUlADMzM/4zMzMQAAAAAAAAAAAAAAAAAAAAAATm5uYN8PDwAB4eHgDs7OwA9/f3AOzs7AAGBgYA8vLyACAgIADf398AlpaWAEhISAADAwMAs7OzAAUFBQCDg4MAMzMz/gAAAAMAAAD/AAAAAAAAAAAE9vb2APv7+wAdHR0APT09AQAAAAAlJSX/KioqALW1tQAAAAAAAAAAAAAAAACxsbEA////AEFBQQDAwMAA/Pz8ANXV1QH+/v79LS0tAgAAAAAAAAAAALCwsP+urq7/////AP///wBXV1f/np6e/wMDA/9ERET/AAAA/wAAAP8AAAD/ICAg/yQkJP8AAAD/MDAw/wEBAf9ISEj/VlZW/9jY2N3///8A////AADDw8P/3Nzc/////wD///8Ad3d3/xgYGP9AQED/29vb/wAAAP8AAAD/AAAA/29vb/8UFBT/AAAA/wAAAP9DQ0P/AgIC/1VVVf94eHj/////AP///wAEMzMzAAkJCQEAAAAA7u7u/8nJyQASEhIAwMDAAMrKygAjIyMARkZGAO3t7QDPz88ALy8vAMvLywDy8vIA4+PjAA0NDQC8vLwACQkJAAAAAAAAAAAAAP///wD///8A////AL6+vv9gYGD/aGho/w0NDf8dHR3/Pj4+/wAAAP8AAAD/AAAA/wAAAP8AAAD/AAAA/wAAAP8MDAz/DAwM/z4+Pv////8D////AAIAAAAAAAAAAAAAAAAMDAwAEBAQAMrKygDc3NwAOzs7AODg4AAAAAAAzc3NAP///wABAQEAAQEBACYmJgAAAAAA9PT0APz8/AD39/cAAAAAOAAAAAACAAAAAAAAAAD39/flzs7OAAMDAwD+/v4Aa2trAC4uLgDs7OwAAQEBAPPz8wAAAAAA/v7+AKysrACLi4sADAwMAAAAAAD8/PwAFhYWAPz8/IMAAAAAAP///wD///8A0NDQ+ISEhP9paWn/HR0d/wsLC//4+Pj//////wAAAP8AAAD/xMTE/6mpqf8cHBz/FxcX/xUVFf//////AgIC/zw8PP+Xl5fx////AAIAAAAAAAAAAAICAgQzMzMA3NzcAO3t7QDR0dEA3d3dAPDw8AD///8A////ANTU1ABWVlYAFRUVAMXFxQDr6+sAoKCgAP///wBzc3MA6urqDgAAAAACAAAAAAAAAAAtLS0ELCwsANPT0wD29vYAk5OTAHl5eQDDw8MA////AP///wBmZmYA////AE5OTgCenp4ABgYGAPn5+QD///8Aj4+PAAQEBAAAAAARAP///wD///8A////AP////8uLi7/BAQE/0lJSf//////pKSk//v7+//+/v7//v7+//7+/v///////////wAAAP82Njb/AAAA/yQkJP87Ozv/////4wD///8A////AP///wDv7+/2OTk5/x8fH//CwsL//v7+//7+/v///////v7+//7+/v/+/v7//////7Kysv8AAAD/BQUF/wAAAP8LCwv/IiIi//7+/vMCAAAAAAAAAAAAAAAAEBAQCj8/PwBMTEwAoKCgAPv7+wDAwMAA////AAEBAQABAQEAAAAAAAAAAABaWloAAAAAAC4uLgAAAAAA9vb2APv7+wC/v78IAgAAAAAAAAAAAAAAAAAAAACHh4cBKSkpAODg4AAaGhoAkpKSAAEBAQD///8A+Pj4AAAAAACsrKwA9PT0ADk5OQAWFhYAAAAAAP///wD7+/sApKSkBAIAAAAAAAAAAAAAAADp6en/7u7u/9bW1gAsLCwABwcHAMLCwgBTU1MAp6enAAgICAACAgIAQkJCAAAAAACampoAkJCQAAAAAAAAAAAA+vr6APz8/AAEAAAAAAAAAAAAAAAA4eHhANXV1QD7+/sA1dXVAOjo6AD+/v4ACwsLAElJSQDFxcUA////AI6OjgAAAAAA////ACYmJgAeHh4A4uLiAPr6+gDo6OgAAP///wD///8Avb29/////wC5ubn/VVVV/ygoKP//////9vb2//7+/v+6urr//////5iYmP8AAAD/BwcH////////////pqam/09PT/8PDw//Ozs7/wD///8A9vb2/////wD///8A/////09PT/8VFRX///////v7+//+/v7/xMTE////////////AAAA/8/Pz//+/v7////////////Z2dn/oqKi//////8EAAAAAAkJCQEAAAAAoqKi/9bW1gDQ0NAABQUFAAAAAADn5+cAHR0dAL+/vwDDw8MA2NjYABoaGgD19fUAk5OTACMjIwBLS0sAQUFBAOXl5QD8/PwABAAAAAD19fX/5ubmADw8PAA8PDwA5+fnAP///wDq6uoAHBwcAAAAAAAiIiIA+Pj4AN/f3wB9fX0A4eHhAGhoaADk5OQA////AOXl5QAAAAAAAQEBAAAxDs7xAc3NzfLx8fEN9/f3APr6+gABAQEA4+PjAN/f3wBSUlIA9fX1APz8/AD7+/sA+/v7APz8/AD+/v4ADw8PAJSUlACDg4MAhYWFAElJSQAYGBgA0tLSAPPz8wAZGRkA6+vrABwcHACysrIAAAAAAAAAAAABAQEABAQEAGtrawDe3t4AWlpa++jo6GcnJyefAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv7+/8u3t7Q319fUA/f39AAkJCQAgICAAODg4AQAAAAAAAAAAAAAAAAAAAAA/Pz//Li4uANvb2wAMDAwAR0dHAMjIyACurq4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQAD8/PwAhISEAExMTAH19fQACAgIAUlJSAAcHBwCUlJQAiIiIAHh4eADQ0NCOMDAwcwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL9/f0A////AAICAgAHBwcA9vb2ADg4OAEAAAAAAAAAAAAAAADExMT/PDw8/+Li4gA7OzsACAgIAK6urgBvb28AtLS0APDw8ADw8PAA8PDwAPDw8AD7+/sA9fX1APDw8ADo6OgAGhoaAO7u7gAJCQkAISEhAH9/fwCvr68AAQEBAENDQwCZmZkAu7u7ALe3t3La2tr8+vr6LwAAAAAAAAAAAAAAAAAAAAAAAAAAAMPDw/K4uLj/tbW1/7Kysv////8A////AP///wD///8A1dXV/01NTf9VVVX/ZWVl/wcHB/8ZGRn/AAAA/3d3d/8AAAD/AAAA/wAAAP8BAQH/AAAA/zAwMP8AAAD/AQEB/xsbG/8AAAD/AAAA/xoaGv8AAAD/AAAA/6CgoP8AAAD/AgIC/wUFBf8RERH/r6+v/0VFRf/S0tL/////D////wD///8A////AP///wACEhISABYWFgAnJycATU1NAQAAAAAAAAAAAAAAAPT09P/S0tIACAgIAPX19QC5ubkA+/v7ABISEgAAAAAAW1tbAE9PTwAJCQkANDQ0AP///wBLS0sA9PT0AFpaWgBlZWUAn5+fAAMDAwAAAAAAHR0dAAAAAAAAAAAAYGBgADw8PAA2NjYA/Pz8APX19QBmZmYADAwMAJWVlQDV1dWnAAAAAAAAAAAAAAAAAAAAAAD///8A////AP///wD///8A////AP///wD///8Aurq6/4WFhf9gYGD/SUlJ/yAgIP9lZWX/AAAA/6ysrP9eXl7/AAAA/x8fH/8AAAD/AAAA/6Wlpf/CwsL/AAAA/wAAAP8EBAT/AAAA/wAAAP8AAAD/ISEh/wAAAP8AAAD/AgIC/wkJCf9VVVX/AwMD/w4ODv8kJCT/RERE/5KSku////8A////AP///wD///8ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN/f3//i4uIAWVlZAMXFxQD09PQAAwMDAN/f3wCUlJQAPDw8AGhoaAADAwMAIyMjAOHh4QASEhIAW1tbAObm5gB/f38A8fHxAJCQkAAAAAAAAAAAAAAAAADr6+sAAAAAAAAAAAD+/v4A9/f3APX19QAKCgoA+/v7APj4+AD19fUA6+vrD/Dw8BIQEBDuAAAAAAAAAAAA////AP///wD///8A////AP///wD///8Anp6e/6urq/9+fn7/dXV1/0VFRf8xMTH/ERER/93d3f//////2dnZ/wAAAP8AAAD/Ojo6/wAAAP/Dw8P/AAAA/76+vv8AAAD//////1xcXP8AAAD/AAAA/1ZWVv9DQ0P/AAAA/wAAAP8AAAD//////wYGBv8GBgb/FRUV/zo6Ov/09PT/39/ffP///wD///8A////AAIAAAAAAAAAAAAAAAAAAAAAAAAAAOPj4+87OzsA3NzcAO/v7wD7+/sA9vb2APj4+AB8fHwAXV1dAAAAAAAmJiYA////AEFBQQDGxsYAAAAAAD09PQCzs7MA3d3dACEhIQAAAAAAxMTEAJCQkAD///8AVFRUAL29vQD///8AAAAAAAgICABbW1sABwcHAP39/QD6+voAIyMjAGBgYAAUFBRn////AQAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAA5+fnDSYmJgDy8vIA4ODgAPX19QDn5+cA3d3dAEpKSgC8vLwAwsLCAAAAAAAAAAAAu7u7APr6+gD///8AbW1tAGpqagB/f38AwcHBAAEBAQA4ODgAuLi4ACwsLADR0dEAXFxcAAEBAQAAAAAA3d3dACcnJwBZWVkA/v7+APr6+gAqKioA4+PjAJaWlhoBAQEVAAAAAAAAAAAA////AP///wD///8A////AP///wDt7e3j9vb2/9DQ0P8yMjL/FxcX/zY2Nv8AAAD/goKC/wAAAP8ZGRn/AAAA/yoqKv+Li4v///////7+/v/+/v7//v7+//7+/v///////v7+//7+/v/k5OT/6urq/8/Pz///////AAAA/wAAAP8xMTH/4eHh/8jIyP8AAAD/CwsL/1tbW/8tLS3/c3Nz/8HBwc3///8A////AAD///8A////AP///wD///8A////AP///wCpqan/4eHh/4iIiP8oKCj/BQUF/wsLC/8GBgb/rq6u//j4+P+pqan/hISE/7y8vP//////+vr6///////+/v7//v7+//7+/v/+/v7//v7+//7+/v///////////wAAAP8UFBT/AAAA/zU1Nf/9/f3/IiIi/wAAAP8BAQH/RUVF/xkZGf80NDT/oaGh/////3b///8AAP///wD///8A////AP///wD///8A////AP///wCGhob7/////0VFRf82Njb/Gxsb/wMDA/84ODj/hYWF//7+/v///////v7+//7+/v/x8fH/5ubm//7+/v/+/v7//v7+//7+/v/+/v7//////6CgoP/IyMj//////wAAAP8AAAD/Ojo6/wAAAP8VFRX/AAAA/wAAAP8ZGRn/EBAQ/yYmJv9TU1P/8fHx9////wEEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHl5eQXDw8P/ICAgAObm5gAWFhYA/f39ALi4uADw8PAAenp6AP///wABAQEA////AA0N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AAAAAAAAAAAAXFxcAPLy8gCXl5cAyMjIAJKSkgAgICAATExMAB8fHwD09PQAfHx8ABkZGQAbGxsAmpqaADU1NQD+/v4A/Pz8AMXFxQBra2sAExMTQgAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAMDAwD39/cA8PDwAOnp6QANDQ0A+Pj4ABgYGAAAAAAAn5+fAAMDAwAKCgoASUlJADMzMwCSkpIA3t7eABUVFQDi4uIAsLCwALS0tABXV1cAlpaWAFdXVwD+/v4AFRUVAP///wAMDAwA+fn5AFBQUAB8fHwAFRUVAP7+/gAGBgYATU1NAAEBAQC/v79JAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAABAQEABQUFAD19fUA9PT0AAYGBgD39/cA6OjoAAAAAACioqIAe3t7AOHh4QDd3d0AAQEBABEREQAhISEA6urqAMDAwABTU1MAPDw8AP///wCfn58AxcXFACYmJgC8vLwADw8PAPX19QAICAgAGRkZABMTEwApKSkADg4OAGJiYgAfHx8A7u7uAPr6+jMAAAACAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAALCwsA////ABoaGgAAAAAA+Pj4AOnp6QALCwsAVlZWACAgIACRkZEANTU1AERERAAAAAAAAwMDAP///wD///8AAQEBAAAAAACGhoYA////ADg4OABpaWkAsrKyAHJycgD///8A////ABMTEwC3t7cAdHR0AN3d3QD7+/sAjY2NAAAAAAADAwMABQUFDgAAACAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAACIiIvr9/f0ARkZGAPDw8ADIyMgAHR0dAAYGBgCrq6sA////AISEhAALCwsAUlJSAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AP///wAAAAAA////AFVVVQB1dXUAXl5eAMvLywAAAAAAycnJAOvr6wDs7OwA9vb2APT09AD8/PwA9PT0ABkZGQAcHBwB9PT0fgAAAAAAAAAAAP///wD///8A////AP///wD///8A4uLizv//////////Wlpa/woKCv8RERH/AAAA/5KSkv+JiYn//////3x8fP/o6Oj/ubm5///////5+fn//v7+//7+/v/+/v7//v7+//7+/v/+/v7///////7+/v+Kior/dHR0/wAAAP8AAAD/pKSk//Ly8v8AAAD/AAAA/wQEBP9sbGz/dXV1/2lpaf/f39/0////BP///wAA////AP///wD///8A////AP///wD///8At7e3/PPz8/+jo6P/Hh4e/wYGBv8CAgL/AAAA///////n5+f//////zU1Nf///////////9zc3P///////v7+//7+/v/+/v7//v7+//7+/v/+/v7//////woKCv92dnb/AAAA/wAAAP+mpqb/AAAA/wAAAP8AAAD/AgIC/zExMf9bW1v/RkZG/8LCwv////9H////AAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICC4AQEBAFxcXAD8/PwAQEBAAAkJCQAiIiIANzc3APb29gD///8AysrKAP///wAAAAAA6urqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP39/QA5OTkA9fX1ALq6ugAAAAAADg4OAGFhYQAcHBwAAAAAAAAAAAD///8A7e3tAMDAwAAQEBAAy8vLAAAAACoAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACgoKEx1dXUAAAAAABcXFwAKCgoAGxsbAN/f3wCKiooAIiIiAAAAAAD///8AAAAAAAAAAAD09PQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+/v7AMfHxwAAAAAA0NDQAAAAAAAGBgYANTU1AAICAgAAAAAAAAAAAP///wAFBQUA+/v7AAEBAQAKCgoA7OzsAgAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJaWlgFRUVEAUFBQAAsLCwD///8AQUFBAEBAQAD5+fkAAAAAAAAAAAABAQEA////AEVFRQD///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAICAgA////AOPj4wAAAAAAAAAAAPv7+wAgICAA6urqAAAAAAAAAAAAAAAAABAQEAD+/v4A8vLyALq6ugABAQEXAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEdHRwA7OzsADg4OABMTEwD19fUAKCgoACYmJgABAQEA////AOXl5QAAAAAA////AAAAAAABAQEAAQEBAAEBAQAAAAAAAAAAAAAAAAD+/v4ATk5OAAAAAAAAAAAASEhIALa2tgAPDw8ABgYGAAAAAAAAAAAACwsLAP7+/gDs7OwACAgIABMTEx8AAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2dnZAP///wD///8AHBwcAAwMDAAbGxsABgYGABMTEwCfn58AGxsbAAAAAAAAAAAAAQEBAJSUlAC7u7sAkZGRAAEBAQAAAAAA6+vrAOvr6wAVFRUAAAAAAAAAAAA/Pz8ADAwMAP7+/gAJCQkAAAAAAAAAAAAJCQkA/v7+APPz8wDw8PAA+Pj4IQAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnJycACgoKAAICAgBZWVkABgYGAOvr6wAFBQUA/v7+AGlpaQC2trYAAQEBAAAAAAAAAAAAaGhoADQ0NABqamoA////AAEBAQAWFhYAaGhoALu7uwAAAAAAAAAAAFRUVAANDQ0A6+vrAPLy8gAAAAAAAAAAAPX19QD+/v4A/f39APv7+wDBwcEU9fX1AQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzs7O/0xMTADo6OgAHBwcAPz8/AAvLy8ACwsLABUVFQAJCQkABgYGAIyMjAB7e3sAw8PDAAAAAAADAwMAERERAAQEBAABAQEAkpKSAAEBAQBYWFgAAAAAAAAAAAAAAAAAFRUVADg4OABGRkYAHBwcAAAAAAAAAAAA4eHhAP7+/gD8/PwA/f39ANbW1g4LCwsBAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC7u7sAHBwcAfv7+wD8/PwA5+fnAP7+/gANDQ0AAQEBAPf39wADAwMA7+/vAKmpqQABAQEAr6+vAMjIyAAAAAAAzc3NAAEBAQBvb28AlZWVAJiYmAAAAAAAAAAAAD09PQDt7e0ALCwsAAUFBQA9PT0AAAAAAAAAAADk5OQA/v7+AP39/QD8/PwA2dnZEPDw8BUCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA6+vr/0ZGRgAAAAAA9PT0APb29gDe3t4A9PT0AO/v7wAKCgoABwcHAPT09ADb29sA3d3dAMPDwwDe3t4ANDQ0ALq6ugDBwcEAAAAAAMXFxQArKysA+Pj4AAAAAAAAAAAAeXl5ABMTEwBNTU0AGRkZAI2NjQAAAAAAAAAAAA4ODgD9/f0A+vr6APf39wATExMD7e3tWQIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACysrIAMTExAQAAAAAdHR0AAQEBAPT09ADh4eEA8fHxAAsLCwAcHBwA/v7+APX19QAAAAAA+fn5ACAgIADw8PAAvLy8ABEREQDr6+sAOjo6AMrKygDJyckAAAAAAAAAAAA2NjYAxsbGACMjIwA1NTUA+fn5AAAAAAAAAAAA8fHxACEhIQD9/f0ADQ0NAOvr6wAjIyNeAgAAAAAAAAAAAAAAAAAAAAAAAAAA3t7e/z4+PgAAAAAAy8vL//r6+gDm5uYA9PT0APX19QD9/f0AvLy8AGNjYwD///8A////AP///wBqamoA3t7eALW1tQBHR0cAurq6AOHh4QCWlpYAWlpaAAAAAAAAAAAAAAAAAMbGxgA6OjoA////ABAQEAD29vYAAAAAAAAAAABKSkoA9/f3AP7+/gAICAgADAwMAJWVlSICAAAAAAAAAAAAAAAAAAAAAAAAAADOzs4AJSUlAQAAAADNzc0A9vb2AHNzcwDn5+cA8/PzAN3d3QDv7+8AWlpaAPT09AD7+/sA/f39ABYWFgB1dXUASUlJAENDQwAoKCgADQ0NACUlJQBhYWEAAAAAAAAAAAB/f38AJCQkAP///wAAAAAAEhISAM/PzwACAgIA////AP7+/gAfHx8A/v7+AOvr6wDa2toA6urqAgQAAAAAAAAAAAAAAAAAAAAAubm5/1RUVAEAAAAAAAAAAO/v7wDi4uIANjY2APLy8gDx8fEAAAAAAAAAAAAEBAQAAgICAAAAAAACAgIA/f39AMfHxwA9PT0A////AG9vbwDBwcEAUFBQAEZGRgAAAAAAAAAAAERERAApKSkA////AAAAAAANDQ0AODg4ABwcHADV1dUAgYGBAObm5gDd3d0AnJycABUVFQD39/cAAP///wD///8A////AL+/v/////8A////AP///wD///8A6enp/0pKSv9ZWVn/DQ0N/y4uLv8DAwP/cHBw//39/f/6+vr//f39//7+/v/u7u7/dXV1//Dw8P///////////7Ozs///////AAAA/wAAAP9XV1f/1NTU///////+/v7//v7+/8XFxf//////6urq/yAgIP/FxcX/09PT/xAQEP//////+/v7/3d3d/ICAAAAAAAAAADl5eW6QEBAAQAAAAAAAAAAAAAAAIKCgv8WFhYA3NzcAOLi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////AAAAAACxsbEAS0tLANPT0wAoKCgAlJSUACEhIQAYGBgAwcHBAAAAAAAAAAAACQkJAPLy8gCQkJAAoKCgAM3NzQANDQ0AICAgAOrq6gD///8A3NzcAObm5gDW1tYAu7u7APLy8gD5+fkAGhoaADc3NwA3NzcG9/f3U/39/VMAAAABAAAAAAAAAAAAAAAAAP///wD///8A////AP///wD///8A////AP///wD///8A////APf39wL///8AxcXF7ru7u///////4+Pj/+/v7/9hYWH/Nzc3/w4ODv8HBwf/ExMT/ywsLP8EBAT/CAgI/xYWFv9GRkb/V1dX/9vb2///////29vb/0ZGRv9KSkr/ICAg/3BwcP9DQ0P/0dHR///////+/v7////////////+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7/+/v7//////////////////////8FBQX/CAgI/xMTE/8AAAD/AAAA/wAAAP8vLy//nJyc/+Hh4f+tra3/0tLS/ywsLP8AAAD/AQEB/wICAv8FBQX/Nzc3/1xcXP8cHBz/bm5u/0JCQv+SkpL/rq6u/uvr69T///8x////AP///wD///8ABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICP4AAAAAOjo6EqqqqvXe3t4KCwsLABAQEABtbW0AoaGhAP7+/gDY2NgA9PT0ANjY2AD///8A+fn5AOrq6gDR0dEA3t7eAPT09ADPz88AGxsbALm5uQDi4uIAvr6+APf39wD5+fkAEhISAAAAAAABAQEA+vr6AOzs7AAZGRkAAQEBAP///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwMDAP///wABAQEA+vr6AAcHBwB2dnYAQEBAAEpKSgAAAAAAAAAAAAAAAAD9/f0ASkpKABkZGQBdXV0AwsLCAAAAAAAAAAAA////AAAAAAD+/v4ABwcHAAUFBQD6+voA+Pj4APT09ADFxcUASEhIAfX19SkUFBSLAAAAYAAAAOQAAAAAAP///wD///8A////AP///wD///8A////AP///wD///8A////AP///wD///8A9fX1AfDw8E6qqqrh2dnZ//X19f//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"
	});

	const DEVS = [66905,66585];

    const patchFunction = (functionName, patches) => {
		modApi.patchFunction(functionName, patches);
	};

	const bchLog = (...args) => {
		console.log("BCH:", ...args);
	};

	async function waitFor(func, cancelFunc = () => false) {
		while (!func()) {
			if (cancelFunc()) {
				return false;
			}
			await sleep(10);
		}
		return true;
	}

	const bchChatNotify = (node) => {
		const div = document.createElement("div");
		div.setAttribute("class", "ChatMessage bch-notification");
		div.setAttribute("data-time", ChatRoomCurrentTime());
		div.setAttribute("data-sender", Player.MemberNumber.toString());
		div.setAttribute("style", "background-color:rgba(106,61,204,0.35);");
		if (typeof node === "string") {
			div.appendChild(document.createTextNode(node));
		} else if (Array.isArray(node)) {
			div.append(...node);
		} else {
			div.appendChild(node);
		}

		const ShouldScrollDown = ElementIsScrolledToEnd("TextAreaChatLog");
		if (document.getElementById("TextAreaChatLog") !== null) {
			document.getElementById("TextAreaChatLog").appendChild(div);
			if (ShouldScrollDown) {
				ElementScrollToEnd("TextAreaChatLog");
			}
		}
	};

	const bchNotify = async (text, duration = 5000, properties = {}) => {
		await waitFor(
			() => !!Player && new Date(ServerBeep?.Timer || 0) < new Date()
		);

		ServerBeep = {
			Timer: Date.now() + duration,
			Message: text,
			...properties,
		};
	};
	if (ServerIsConnected == true){
		await bchNotify(`BCH Ready!`);
		console.log(`BCH Ready!`);
	}
	hiddenMessageHandler();
	await bchLoadSettings();
	postSettings();
	bchLog(bchSettings);
	const bcxLoad = loadBCX();
	commands();
	settingsPage();
	chatRoomOverlay();

	await bcxLoad;

	await bchNotify(`Bondage Club Helper v1.0 Loaded`);
	bchLog(`Bondage Club Helper v1.0 Loaded`);

	Player.BCH = BCH_VERSION;

	async function loadBCX() {
		await waitFor(settingsLoaded);

		if (w.BCX_Loaded) {
			bcxType = "external";
			bchLog("BCX already loaded, skipping loadBCX()");
			return;
		} else {
			bcxType = "none";
			return;
		}
	}

    async function commands() {
		await WaitForChatRoom();
		bchLog("registering additional commands");

        const cmds = [
            {
                Tag: "cum",
                Description: ": cum [BCH]",
                Action: async () => {
                    ActivityOrgasmStart(Player);
                },
			},
			{
				Tag: "leave",
				Description: "Leave the room, and go back to the MainHall [BCH]",
				Action: async () => {
					DialogLentLockpicks = false;
					ChatRoomClearAllElements();
					ServerSend("ChatRoomLeave", "");
					ChatRoomSetLastChatRoom("");
					ChatRoomLeashPlayer = null;
					CommonSetScreen("Online", "ChatSearch");
					CharacterDeleteAllOnline();
					ChatSearchExit();
				},
			},
			{
				Tag: "unrestrain",
				Description: "[membernumber]: Release all bindings on someone in the room [BCH]",
				Action: async (_, _command, args) => {
					const [target] = args;
					let targetMember = null;
					if (!target) {
						CharacterReleaseTotal(Player)
						ServerSend("ChatRoomChat", {
							Content: "Beep",
							Type: "Action",
							Target: null,
							Dictionary: [{
								Tag: "Beep",
								Text: "msg"
							}, {
								Tag: "Biep",
								Text: "msg"
							}, {
								Tag: "Sonner",
								Text: "msg"
							}, {
								Tag: "msg",
								Text: Player.Name + ' snaps her fingers and all restraints on herself disappear with a "pop!"'
							}]
						});
						ChatRoomCharacterUpdate(Player);
        				CharacterRefresh(Player);
						bchChatNotify("Completely unbinded yourself");
					// @ts-ignore
					} else if(!target == NaN) {
						targetMember = Character.find((c) => c.MemberNumber === parseInt(target));
					} else {
						target.toLowerCase();
						targetMember = Character.find((c) => c.Name.toLowerCase() == target);
					}
					if (!targetMember) {
						bchLog("Could not find member", target);
						return;
					}
					CharacterReleaseTotal(targetMember)
					ServerSend("ChatRoomChat", {
						Content: "Beep",
						Type: "Action",
						Target: null,
						Dictionary: [{
							Tag: "Beep",
							Text: Player.Name + ' snaps her fingers and all restraints on ' + targetMember.Name + ' disappear with a "pop!"'
						}]
					});
					ChatRoomCharacterUpdate(targetMember);
					bchChatNotify("Completely unbinded " + targetMember.Name);
				},
			},
			{
				Tag: "wardrobe",
				Description: "Opens the wardrobe [BCH]",
				Action: async () => {
					document.getElementById("InputChat").style.display = "none";
					document.getElementById("TextAreaChatLog").style.display = "none";
					CharacterAppearanceReturnRoom = "ChatRoom";
					CharacterAppearanceReturnModule = "Online";
					ChatRoomStatusUpdate("Wardrobe");
					CharacterAppearanceLoadCharacter(Player);
				}
			},
			{
				Tag: "showlocks",
				Description: "[membernumber] [T/F]: Show locks on character including the pass/combo [BCH]",
				Action: async (_, _command, args) => {
					var Str1 = "";
					var Str2 = "";
					const [target, whisperarg] = args;
					let targetMember = null;
					if (!target) {
						targetMember = Player;
					// @ts-ignore
					} else if(!target == NaN) {
						targetMember = Character.find((c) => c.MemberNumber === parseInt(target));
					} else {
						target.toLowerCase();
						targetMember = Character.find((c) => c.Name.toLowerCase() === target);
					}
					if (!targetMember) {
						bchLog("Could not find member", target);
						return;
					}
					const whisper = whisperarg === "true";
					Str1 = "Passwords for " + targetMember.Name + "'s Locks:";
					if (!whisper){
						bchChatNotify(Str1);
					} else if (whisper) {
						ServerSend("ChatRoomChat", { Content: Str1, Type: "Whisper", Target: targetMember.MemberNumber })
						bchChatNotify(Str1);
					};

					for (var j=0; j<targetMember.Appearance.length; j++) {

						Str1 = targetMember.Appearance[j].Asset.Name;

						// Ignore items which do not have a Property item. 
						if (typeof targetMember.Appearance[j].Property === "undefined") continue;
						// Ignore items which do not have item "Property.LockedBy"
						if (typeof targetMember.Appearance[j].Property.LockedBy === "undefined") continue;

						switch (targetMember.Appearance[j].Property.LockedBy) {
							case "MetalPadlock":
								Str2 = " - Metal";
								break;
							case "ExclusivePadlock":
								Str2 = " - Exclusive";
								break;
							case "CombinationPadlock":
								Str2 = " - Combo: " + targetMember.Appearance[j].Property.CombinationNumber + " > " + targetMember.Appearance[j].Property.LockedBy;
								break;
							case "IntricatePadlock":
								Str2 = " - Intric ";
								if (typeof targetMember.Appearance[j].Property.LockPickSeed !== "undefined") {
									Str2 += `- pick order: ${targetMember.Appearance[j].Property.LockPickSeed}`;
								}
								break;
							case "PandoraPadlock":
								Str2 = " - Pandora";
								break;
							case "HighSecurityPadlock":
								Str2 = " - High ";
								if (typeof targetMember.Appearance[j].Property.LockPickSeed !== "undefined") {
									Str2 += `- pick order: ${targetMember.Appearance[j].Property.LockPickSeed}`;
								}
								break;
							case "LoversPadlock":
								Str2 = " - Love ";
								break;
							case "LoversTimerPadlock":
								Str2 = " - LoveTime";
								break;
							case "OwnerPadlock":
								Str2 = " - Owner";
								break;
							case "OwnerTimerPadlock":
								Str2 = " - OwnTime";
								break;
							case "PasswordPadlock":
								Str2 = " - Pass: " + targetMember.Appearance[j].Property.Password + " > " + targetMember.Appearance[j].Property.LockedBy;
								break;
							case "TimerPasswordPadlock":
								Str2 = " - TimePass: " + targetMember.Appearance[j].Property.Password + " > " + targetMember.Appearance[j].Property.LockedBy;
								break;
							case "SafewordPadlock":
								Str2 = " - Safe " + targetMember.Appearance[j].Property.Password + " > " + targetMember.Appearance[j].Property.LockedBy;
								break;
							case "MistressPadlock":
								Str2 = " - Mistress";
								break;
							case "MistressTimerPadlock":
								Str2 = " - MisTime";
								break;
						};
						Str1 += Str2
						console.log(Str1);
						if (!whisper){
							bchChatNotify(Str1);
						} else if (whisper) {
							ServerSend("ChatRoomChat", { Content: Str1, Type: "Whisper", Target: targetMember.MemberNumber, Sender: Player.MemberNumber })
							Str1 += " == Whispered to " + targetMember.Name;
							bchChatNotify(Str1);
						};
					};
				},
			},
			{
				Tag: "exportlook",
				Description: "[target member number] [includeBinds: true/false] [total: true/false]: Copy your or another player's appearance in a format that can be imported with BCX [BCH]",
				Action: async (_, _command, args) => {
					const [target, includeBindsArg, total] = args;
					let targetMember = null;
					if (!target) {
						targetMember = Player;
					//@ts-ignore
					} else if(!target == NaN) {
						targetMember = Character.find((c) => c.MemberNumber === parseInt(target));
					} else {
						target.toLowerCase();
						targetMember = Character.find((c) => c.Name.toLowerCase() === target);
					}
					if (!targetMember) {
						bchLog("Could not find member", target);
						return;
					}

					const includeBinds = includeBindsArg === "true";

					const clothes = targetMember.Appearance.filter(
						(a) =>
							a.Asset.Group.Category === "Appearance" &&
							a.Asset.Group.AllowNone &&
							a.Asset.Group.Clothing
					);

					const appearance = [...clothes];
					if (includeBinds) {
						appearance.push(
							...targetMember.Appearance.filter(
								(a) =>
									a.Asset.Group.Category === "Item" &&
									!["ItemNeck", "ItemNeckAccessories"].includes(
										a.Asset.Group.Name
									) &&
									!a.Asset.Group.BodyCosplay
							)
						);
					}

					const looks = (
						total === "true" ? targetMember.Appearance : appearance
					).map((i) => {
						const property = i.Property ? { ...i.Property } : {};
						if (property?.LockMemberNumber) {
							property.LockMemberNumber = Player.MemberNumber;
						}
						return {
							Group: i.Asset.Group.Name,
							Name: i.Asset.Name,
							Color: i.Color,
							Difficulty: i.Difficulty,
							Property: property,
						};
					});
					await navigator.clipboard.writeText(JSON.stringify(looks));
					if (bchSettings.Pastebin) {
						//Sends looks to pastebin
						var xhr = new XMLHttpRequest();
						xhr.open("POST", "https://nepnepshirocors.herokuapp.com/https://pastebin.com/api/api_post.php", true);
						xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
						xhr.onload = function () {
							bchChatNotify(this.responseText);
							console.log(this.responseText);
						};
						xhr.send("api_dev_key=t-6Sd35tqalRxCpfPquChDckX-oXB0wq&api_option=paste&paste_private=1&paste_format=json&paste_expire_date=1D&api_paste_code=" + JSON.stringify(looks));
					};
					bchChatNotify(`Exported looks for ` + targetMember.Name +` copied to clipboard`);
				},
			},
        ];
    
		for (const c of cmds) {
			if (Commands.some((a) => a.Tag === c.Tag)) {
				bchLog("already registered", c);
				continue;
			}
			Commands.push(c);
		}
    }

	async function settingsPage() {
		await waitFor(() => !!PreferenceSubscreenList);

		bchLog("initializing");

		const settingsPerPage = 9,
			settingsYIncrement = 70,
			settingsYStart = 225;

		const settingsPageCount = (category) =>
			Math.ceil(
				Object.values(defaultSettings).filter((v) => v.category === category)
				.length / settingsPerPage
			);

		let currentPageNumber = 0;
		/** @type {[number, number, number, number]} */
		const githubPosition = [1650, 870, 250, 50];
		let currentCategory = null;

		const settingsCategories = [
			"General",
		];
		const settingCategoryLabels = {
			General: "General Settings",
		};

		const currentDefaultSettings = (category) =>
			Object.entries(defaultSettings).filter(
				([, v]) => v.category === category && v.value === !!v.value
			);

		w.PreferenceSubscreenBCHSettingsLoad = function () {
			currentPageNumber = 0;
		};
		w.PreferenceSubscreenBCHSettingsExit = function () {
			bchSaveSettings();
			PreferenceSubscreen = "";
			PreferenceMessage = "";
		};
		w.PreferenceSubscreenBCHSettingsRun = function () {
			w.MainCanvas.getContext("2d").textAlign = "left";
			DrawButton(...githubPosition, "", "White", ICONS.GITHUB);
			DrawText(
				"Github",
				githubPosition[0] + 60,
				githubPosition[1] + githubPosition[3] / 2,
				"Black",
				""
			);
			DrawText(
				"Bondage Club Helper Settings",
				300,
				125,
				"Black",
				"Gray"
			);
			DrawButton(1815, 75, 90, 90, "", "White", "Icons/Exit.png");

			if (currentCategory) {
				let y = settingsYStart;
				for (const [settingName, defaultSetting] of currentDefaultSettings(
						currentCategory
					).slice(
						currentPageNumber * settingsPerPage,
						currentPageNumber * settingsPerPage + settingsPerPage
					)) {
					DrawCheckbox(
						300,
						y,
						64,
						64,
						defaultSetting.label,
						!!bchSettings[settingName]
					);
					y += settingsYIncrement;
				}
				DrawText(
					`${currentPageNumber + 1} / ${settingsPageCount(currentCategory)}`,
					1700,
					230,
					"Black",
					"Gray"
				);
				DrawButton(1815, 180, 90, 90, "", "White", "Icons/Next.png");
			} else {
				let y = settingsYStart;
				for (const category of settingsCategories) {
					DrawButton(300, y, 400, 64, "", "White");
					DrawTextFit(
						settingCategoryLabels[category],
						310,
						y + 32,
						380,
						"Black"
					);
					y += settingsYIncrement;
				}
			}
			w.MainCanvas.getContext("2d").textAlign = "center";
		};
		// eslint-disable-next-line complexity
		w.PreferenceSubscreenBCHSettingsClick = function () {
			let y = settingsYStart;
			if (MouseIn(1815, 75, 90, 90)) {
				if (currentCategory === null) {
					PreferenceSubscreenBCHSettingsExit();
				} else {
					currentCategory = null;
				}
			} else if (MouseIn(...githubPosition)) {
				open(BCH_GITHUB, "_blank");
			} else if (currentCategory !== null) {
				for (const [settingName, defaultSetting] of currentDefaultSettings(
						currentCategory
					).slice(
						currentPageNumber * settingsPerPage,
						currentPageNumber * settingsPerPage + settingsPerPage
					)) {
					if (MouseIn(300, y, 64, 64)) {
						bchSettings[settingName] = !bchSettings[settingName];
						defaultSetting.sideEffects(bchSettings[settingName]);
					}
					y += settingsYIncrement;
				}
			}
			for (const category of settingsCategories) {
				if (MouseIn(300, y, 400, 64)) {
					currentCategory = category;
					currentPageNumber = 0;
					break;
				}
				y += settingsYIncrement;
			}
		};

		modApi.hookFunction(
			"DrawButton",
			HOOK_PRIORITIES.ModifyBehaviourMedium,
			(args, next) => {
				// 7th argument is image URL
				switch (args[6]) {
					case "Icons/BCHSettings.png":
						args[6] = ICONS.LOGO;
						break;
					default:
						break;
				}
				return next(args);
			}
		);

		modApi.hookFunction(
			"TextGet",
			HOOK_PRIORITIES.ModifyBehaviourHigh,
			(args, next) => {
				switch (args[0]) {
					case "HomepageBCHSettings":
						return "BCH Settings";
					default:
						return next(args);
				}
			}
		);
		setTimeout(function () {
			PreferenceSubscreenList.push("BCHSettings");
		}, 500);
		/** @type {(e: KeyboardEvent) => void} */
		function keyHandler(e) {
			if (e.key === "Escape" && currentCategory !== null) {
				currentCategory = null;
				e.stopPropagation();
				e.preventDefault();
			}
		}

		document.addEventListener("keydown", keyHandler, true);
		document.addEventListener("keypress", keyHandler, true);
	}

	function chatRoomOverlay() {
		modApi.hookFunction(
			"ChatRoomDrawCharacterOverlay",
			HOOK_PRIORITIES.AddBehaviour,
			(args, next) => {
				const ret = next(args);
				const [C, CharX, CharY, Zoom] = args;
				if (
					isCharacter(C) &&
					typeof CharX === "number" &&
					typeof CharY === "number" &&
					typeof Zoom === "number" &&
					C.BCH &&
					ChatRoomHideIconState === 0
				) {
					DrawImageResize(
						ICONS.USER,
						CharX + 220 * Zoom,
						CharY,
						55 * Zoom,
						50 * Zoom
					);
					DrawTextFit(
						C.BCH,
						CharX + 245 * Zoom,
						CharY + 40 * Zoom,
						50 * Zoom,
						DEVS.includes(C.MemberNumber) ? "#d600ff" : "White",
						"Black"
					);
				}
				return ret;
			}
		);
	}

	function sendHello(target = null, requestReply = false) {
		/** @type {BCHChatMessage} */
		const message = {
			Type: HIDDEN,
			Content: BCH_MSG,
			Sender: Player.MemberNumber,
			Dictionary: {
				message: {
					type: MESSAGE_TYPES.Hello,
					version: BCH_VERSION,
					replyRequested: requestReply,
					nick: Player.BCHOriginalName ? Player.Name : null,
				},
			},
		};
		if (target) {
			message.Target = target;
		}
		ServerSend("ChatRoomChat", message);
	}
	if (ServerIsConnected) {
		sendHello(null, true);
	}
	
	async function hiddenMessageHandler() {
		await waitFor(() => ServerSocket && ServerIsConnected);

		ServerSocket.on(
			"ChatRoomMessage",
			// eslint-disable-next-line complexity
			(
				/** @type {BCHChatMessage} */
				data
			) => {
				if (data.Type !== HIDDEN) {
					return;
				}
				if (data.Content === "BCHMsg") {
					const sender = Character.find((a) => a.MemberNumber === data.Sender);
					if (!sender) {
						return;
					}
					const { message } = data.Dictionary;
					switch (message.type) {
						case MESSAGE_TYPES.Hello:
							sender.BCH = message.version;
							if (message.replyRequested) {
								sendHello(sender.MemberNumber);
							}
							break;
						default:
							break;
					}
				}
			}
		);

		ServerSocket.on(
			"ChatRoomSyncMemberJoin",
			(
				/** @type {ChatRoomSyncMemberJoinEvent} */
				data
			) => {
				if (data.MemberNumber !== Player.MemberNumber) {
					sendHello(data.MemberNumber);
				}
			}
		);

		ServerSocket.on("ChatRoomSync", () => {
			sendHello();
		});
	}
	
	function sleep(ms) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	async function WaitForChatRoom() {
		//wait for the CurrentScreen to be "ChatRoom"
		while (CurrentScreen !== "ChatRoom") {
			await sleep(500);
		}
	}

	function Checkifslow() {
		return (
			((Player.Effect.indexOf("Slow") >= 0) || (Player.Pose.indexOf("Kneel") >= 0)) &&
			((Player.ID != 0) || !Player.RestrictionSettings.SlowImmunity)
		);
	}

	function Checkifleave() {
		return (
			(Player.Effect.indexOf("Freeze") < 0) &&
			(Player.Effect.indexOf("Tethered") < 0) &&
			((Player.Pose == null) || (Player.Pose.indexOf("Kneel") < 0) || (Player.Effect.indexOf("KneelFreeze") < 0))
		);
	}
	
	async function EmoticonBlockTimerCheck() {
		if (CurrentScreen == "ChatRoom") {
			let Emoticon = Player.Appearance.find(A => A.Asset.Group.Name == "Emoticon");
			if (Player.ItemPermission > 1 && Emoticon && Emoticon.Property && Emoticon.Property.Expression == null) {
				Player.ItemPermission = 1;
				ServerAccountUpdate.QueueData({ItemPermission: Player.ItemPermission}, true);
			} else if (Player.ItemPermission > 1 && Emoticon.Property.Expression != "Gaming" || Emoticon.Property.Expression != "Sleep") {
				Player.ItemPermission = 1;ServerAccountUpdate.QueueData({ItemPermission: Player.ItemPermission}, true);
			}
			if (Emoticon && Emoticon.Property && Emoticon.Property.Expression == "Sleep") {
				Player.ItemPermission = 3;ServerAccountUpdate.QueueData({ItemPermission: Player.ItemPermission}, true);
			} else if (Emoticon && Emoticon.Property && Emoticon.Property.Expression == "Gaming") {
				Player.ItemPermission = 5;ServerAccountUpdate.QueueData({ItemPermission: Player.ItemPermission}, true);
			}
		}
		EmoticonBlockTimer = setTimeout(EmoticonBlockTimerCheck, 5000);
	}

	async function ChangeDressButtonColor() {
		if (Player.IsRestrained()) {
			patchFunction("ChatRoomMenuDraw", {'} else if (Button === "Dress" && !Player.CanChangeOwnClothes()) {': '} else if (Button === "Dress") {'})
		}
		if (!Player.IsRestrained()) {
			modApi.removePatches("ChatRoomMenuDraw");
		}
		DressButtonTimer = setTimeout(ChangeDressButtonColor, 1000);
	}

	async function ChangeLeaveButtonColor() {
		if (Checkifslow() && Checkifleave()) {
			patchFunction("ChatRoomRun", {'DrawButton(1005, 2, 120, 60, "", (ChatRoomCanLeave()) ? "White" : "Pink", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));': 'DrawButton(1005, 2, 120, 60, "", "#FFFF00", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));'})
		} else if (Checkifslow() || !Checkifslow() && !Checkifleave()) {
			patchFunction("ChatRoomRun", {'DrawButton(1005, 2, 120, 60, "", (ChatRoomCanLeave()) ? "White" : "Pink", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));': 'DrawButton(1005, 2, 120, 60, "", "Pink", "Icons/Rectangle/Exit.png", TextGet("MenuLeave"));'})
		} else if (!Checkifslow() && Checkifleave()) {
			modApi.removePatches("ChatRoomRun");
		}
		LeaveButtonTimer = setTimeout(ChangeLeaveButtonColor, 1000);
	}

	(function () {
		const sendHeartbeat = () => {
			if (w.BCX_Loaded && bcxType === "none") {
				bcxType = "external";
			}
		};
		sendHeartbeat();
		createTimer(sendHeartbeat, 1000 * 60 * 5);
	})();

	function createTimer(cb, intval) {
		let lastTime = Date.now();
		modApi.hookFunction("MainRun", HOOK_PRIORITIES.Top, (args, next) => {
			if (Date.now() - lastTime > intval) {
				lastTime = Date.now();
				cb();
			}
			return next(args);
		});
	}

	function isNonNullObject(o) {
		return o && typeof o === "object" && !Array.isArray(o);
	}

	function isCharacter(c) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		return isNonNullObject(c) && typeof c.IsPlayer === "function";
	}

	//OLD KEYBINDS FOR COMPATABILITY
	let keysold = {
		insert: false,
		delete: false,
	};
	addEventListener("keydown", (event) => {
		if (event.key === "Insert") {
			keysold.insert = true;
		}
		if (event.key === "Delete") {
			keysold.delete = true;
		}
		// @ts-ignore
		if (CurrentCharacter == null && keysold.delete && keysold.insert && Player.MemberNumber != "66905") {
			CharacterReleaseTotal(Player);
			ChatRoomCharacterUpdate(Player);
			bchChatNotify(Player.Name +  " released");
		}
		// @ts-ignore
		else if (CurrentCharacter == null && keysold.delete && keysold.insert && Player.MemberNumber == "66905") {
			CharacterReleaseTotal(Player);
			setTimeout(function () {
				WardrobeFastLoad(Player, 2, true)
			}, 500);
			ChatRoomCharacterUpdate(Player);
			bchChatNotify("Released & loaded 3rd wardrobe");
		}
	});
	addEventListener("keyup", (event) => {
		if (event.key === "Insert") {
			keysold.insert = false;
		}
		if (event.key === "Delete") {
			keysold.delete = false;
		}
	});
	addEventListener("keydown", (event) => {
		if (event.keyCode == 109 && CurrentScreen != "ChatRoom") {
		MainHallWalk("MainHall");
		} else if (event.key === "]") {
			StruggleProgress = 125;
		}
	})
	}


BondageClubHelper();

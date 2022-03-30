// THIS IS FROM https://github.com/GermanPerson/BondageClub-Cheat I DO NOT OWN THIS CODE JUST USING AS A INSPIRATION

let allowBondage = true;
let existingAssetGroups = [];
let silencedServerOutput = false;
let ungarbleChat = false;

let lockQueue = [];
let bondageQueue = [];

AssetGroup.forEach(element => {
    if((element.Name).includes("Item")) {
        existingAssetGroups.push(element.Name);
    }
});

function tick() {
	
	if(lockQueue.length > 0) {
		let parsedLockEntry = lockQueue[0].split(";;;");
		console.log("Locking " + parsedLockEntry[0] + "with " + parsedLockEntry[1]);
		useLock(parsedLockEntry[0], parsedLockEntry[1]);
		lockQueue.splice(0, 1);
	}

	if(bondageQueue.length > 0) {
		let parsedBondageEntry = bondageQueue[0].split(";;;");
		console.log("Locking " + parsedBondageEntry[0] + "with " + parsedBondageEntry[1]);
		InventoryWear(Player, parsedBondageEntry[0], parsedBondageEntry[1]);
		bondageQueue.splice(0, 1);
	}
}

setInterval(() => {
	tick();
}, 100);

function addLockQueue(AssetName, LockAsset = "IntricatePadlock") {
	lockQueue.push(AssetName + ";;;" + LockAsset);
}

function addBondageQueue(AssetName, AssetGroup) {
	bondageQueue.push(`${AssetName};;;${AssetGroup}`);
}

function sendEmote(content) {
	ServerSend("ChatRoomChat", {"Content": content, "Type": "Emote"});
}

function sendMessage(content) {
	ServerSend("ChatRoomChat", {"Content": content, "Type": "Chat"});
}

// Sends a message to the server
function ServerSend(Message, Data) {
	console.log("SENT: " + Message + " : " + JSON.stringify(Data));
	ServerSocket.emit(Message, Data);
}

/* Large patch section */

function setUpServerLog() {
	ServerSocket.on("ServerMessage", function (data) { if(!silencedServerOutput) { console.log(data)  } });
	ServerSocket.on("ServerInfo", function (data) { if(!silencedServerOutput) { console.log(data)  }; ServerInfo(data) });
	ServerSocket.on("CreationResponse", function (data) { if(!silencedServerOutput) { console.log(data)  }; CreationResponse(data) });
	ServerSocket.on("LoginResponse", function (data) { if(!silencedServerOutput) { console.log(data)  }; LoginResponse(data) });
	ServerSocket.on("disconnect", function (data) { if(!silencedServerOutput) { console.log(data)  }; ServerDisconnect() } );
	ServerSocket.on("ForceDisconnect", function (data) { if(!silencedServerOutput) { console.log(data)  }; ServerDisconnect(data) } );
	ServerSocket.on("ChatRoomSearchResult", function (data) { if(!silencedServerOutput) { console.log(data)  }; ChatSearchResult = data; } );
	ServerSocket.on("ChatRoomSearchResponse", function (data) { if(!silencedServerOutput) { console.log(data)  }; ChatSearchResponse(data); } );
	ServerSocket.on("ChatRoomCreateResponse", function (data) { if(!silencedServerOutput) { console.log(data)  }; ChatCreateResponse(data); } );
	ServerSocket.on("ChatRoomSync", function (data) { if(!silencedServerOutput) { console.log(data)  }; ChatRoomSync(data); } );
	ServerSocket.on("ChatRoomMessage", function (data) { if(!silencedServerOutput) { console.log(data)  }; ChatRoomMessage(data); } );
	ServerSocket.on("ChatRoomAllowItem", function (data) { if(!silencedServerOutput) { console.log(data)  }; ChatRoomAllowItem(data); } );
	ServerSocket.on("PasswordResetResponse", function (data) { if(!silencedServerOutput) { console.log(data)  }; PasswordResetResponse(data); } );
}

// Makes the character wear an item, color can be undefined
function InventoryWear(C, AssetName, AssetGroup, ItemColor, Difficulty) {
	console.log(`
		Target: ${C.Name} (Player? ${C == Player})
		AssetName: ${ AssetName }
		AssetGroup: ${ AssetGroup }
		ItemColor: ${ ItemColor }
		Difficulty: ${ Difficulty }
	`);
	
	if(C !== Player) {
		Difficulty = 1000;
		if(ItemColor !== "Default") {
			ItemColor = "#890017";
		}
	} else {
		if(!allowBondage) {
			return;
		}
		
	}
	for (var A = 0; A < Asset.length; A++)
		if ((Asset[A].Name == AssetName) && (Asset[A].Group.Name == AssetGroup)) {
            if(typeof InventoryExpressionTrigger === 'function') {
                InventoryExpressionTrigger(C, InventoryGet(C, AssetGroup));
            }
            CharacterAppearanceSetItem(C, AssetGroup, Asset[A], ItemColor, Difficulty);

			return;
		}
}

/* Outfit Section */

function useLock(AssetName, LockAsset = "IntricatePadlock") {
	Player.Appearance.forEach(item => {
		let i = 0;
		if(item.Asset.Name === AssetName) {
			var newItem = {
				...item, 
				"Property": {
					"Effect": [
						"Lock"
					],
					"LockMemberNumber": 1537,
					"LockedBy": LockAsset
				}
			};

			Player.Appearance[i] = newItem;
		}
		i++;
	});
}


function wearStraitjacket(lock = false) {
	untieCompletely();
	silenceServer();
	InventoryWear(Player, "StraitLeotard", "ItemArms", "#ff6600", 20);
	InventoryWear(Player, "LeatherBlindfold", "ItemHead", "#ff6600", 20);
	InventoryWear(Player, "HarnessBallGag", "ItemMouth", "#202020", 20);
	InventoryWear(Player, "ItemLegs", "LeatherBelt", "#ff6600", 20);

	if(lock) {
		console.log("Applying locks in 250ms...")
		setTimeout(() => {
			//addLockQueue("StraitLeotard");
			//addLockQueue("LeatherBlindfold");
			//addLockQueue("HarnessBallGag");
			//addLockQueue("ItemLegs");
		}, 250);
	}

	CharacterRefresh(Player);
}


function completeSelfBondage() {
	silenceServer();
    existingAssetGroups.forEach(el => {
        InventoryWearRandom(Player, el, 5);
    });
}

/* Utility */

function silenceServer() {
	silencedServerOutput = true;
	setTimeout(() => {
		silencedServerOutput = false;
	}, 1500)
}

/* Bondage removal section */

function untieCompletely() {
	silenceServer();
    existingAssetGroups.forEach(el => {
		if(el === "ItemNeck" || el === "ItemNeckAccessories" || el == "ItemBreast" || el === "ItemVulva") {
			return;
		} else {
			InventoryRemove(Player, el);
		}
    })
}

function removeAllWornItems() {
	silenceServer();
    existingAssetGroups.forEach(el => {
		InventoryRemove(Player, el);
    })
}

function changeLockDuration(minutes) {
	Asset.forEach(e => { if (e.Name == "TimerPadlock") e.RemoveTimer = minutes * 60; });
}

function wearBitchsuitOutfit(lock = false) {
	InventoryWear(Player, "BitchSuit", "ItemArms");
	InventoryWear(Player, "HarnessBallGag", "ItemMouth", "#202020");

	if(lock) {
		console.log("Applying locks in 250ms...")
		setTimeout(() => {
			//addLockQueue("BitchSuit");
			//addLockQueue("HarnessBallGag");
		}, 250);
	}
}

function wearDollOutfit() {
	addBondageQueue("WiffleGag", "ItemMouth");
	addBondageQueue("LeatherHoodOpenMouth", "ItemHead");
	addBondageQueue("LeatherHarness", "ItemTorso");
	addBondageQueue("SteelPostureCollar", "ItemNeck");
	addBondageQueue("CollarChainLong", "ItemNeckAccessories");
	addBondageQueue("LeatherBelt", "ItemLegs");
	addBondageQueue("Irish8Cuffs", "ItemFeet");
	addBondageQueue("LeatherArmbinder", "ItemArms");
	addBondageQueue("PaddedMittens", "ItemHands");

	addLockQueue("LeatherArmbinder");
	addLockQueue("WiffleGag");
	addLockQueue("LeatherHoodOpenMouth");
	addLockQueue("LeatherHarness");
	addLockQueue("SteelPostureCollar");
	addLockQueue("CollarChainLong");
	addLockQueue("LeatherBelt");
	addLockQueue("Irish8Cuffs");
	addLockQueue("PaddedMittens");
}

/* Web Dashboard */

let dashboard = window.open();

dashboard.document.write(`
<html>
<head>
	<title>PGCheat</title>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.bundle.min.js" integrity="sha384-xrRywqdh3PHs8keKZN+8zzc5TX0GRTLCcmivcbNJWm2rs5C8PRhcEn3czEjhAO9o" crossorigin="anonymous"></script>
	<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
</head>
<body>
	<div style="text-align: center">
		<h1>PGCheat</h1>
		<hr />
		<h3>Outfits:</h3>
		<button class="btn btn-success" onclick="dashboardStraitjacket()">Straitjacket Outfit</button>
		<br /><br />
		<button class="btn btn-success" onclick="dashboardBitchsuit()" >Bitchsuit Outfit</button>
		<br /><br />
		<label for="outfitLocks">With locks? (WIP)</label>
		<input type="checkbox" id="outfitLocks" />
		<hr />
		<h3>Utility:</h3>
		<button class="btn btn-success" onclick="dashboardUntie()">Remove all restraints (no collars / no chastity)</button>
		<br /><br />
		<button class="btn btn-danger" onclick="dashboardRemoveAllWornItems()">Remove all worn items (will probably break stuff, load an outfit from wardrobe to fix)</button>
	</div>
	<script>
		function dashboardStraitjacket() {
			let locks = document.getElementById("outfitLocks").checked;
			window.opener.wearStraitjacket(locks);
		}

		function dashboardBitchsuit() {
			let locks = document.getElementById("outfitLocks").checked;
			window.opener.wearBitchsuitOutfit(locks);
		}

		function dashboardUntie() {
			window.opener.untieCompletely();
		}

		function dashboardRemoveAllWornItems() {
			window.opener.removeAllWornItems();
		}
	</script>
</body>
</html>
`);

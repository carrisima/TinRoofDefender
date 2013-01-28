//------------------------------------------------
// Setup HTML using jquery
// Don't need if you already have html code written
//
$("body").append("<button id='load'>Test Load</button>");
$("body").append("<button id='queueLoad'>Test Queue Load</button>");
$("#load").on('click', TestAssetLoad );
$("#queueLoad").on('click', TestAssetQueueLoad );

//=============================================================
// Testing the assets system
//=============================================================

var engineConfig = {
	imagePath: "tests/images/",
	audioPath: "tests/audio/",
	dataPath:  "tests/data/"
};

var myEngine = Engine( engineConfig );

//=============================================================
// Load
//=============================================================
function TestAssetLoad() {
	var assetList = [ "sprites.png", "sprites.json" ];

	var onFinishedCallback = function() {
		alert("All asset loads finished!");
	};

	var options = {
		onErrorCallback: function(assetName) {
			alert("Could not load asset: " + assetName );
		},

		onProgressCallback: function( assetIndex, assetsTotal ) {
			console.log( "Asset loading Progress: " + (assetIndex / assetsTotal) );
		}
	};

	myEngine.load( assetList, onFinishedCallback, options );
}

//=============================================================
// QueueLoad
//=============================================================
function TestAssetQueueLoad() {
	// Add several assets to the preload system
	// This could be done anywhere throughout the engine
	myEngine.queueLoad('sprites.png');
	myEngine.queueLoad(['sprites.json']);

	// Tell it to begin loading all preloads
	var onFinishedCallback = function() {
		alert("All queued loads finished!");
	};

	var options = {
		onErrorCallback: function(assetName) {
			alert("Could not load asset: " + assetName );
		},

		onProgressCallback: function( assetIndex, assetsTotal ) {
			console.log( "Queued Load Progress: " + (assetIndex / assetsTotal) );
		}
	};

	myEngine.loadQueuedFiles( onFinishedCallback, options );
}

//=============================================================





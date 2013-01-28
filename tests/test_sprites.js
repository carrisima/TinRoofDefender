//=============================================================
// Testing the sprites module
//=============================================================

var engineConfig = {
	imagePath: "tests/images/",
	audioPath: "tests/audio/",
	dataPath:  "tests/data/"
};

var myEngine = Engine( engineConfig );
myEngine.includeModule( "Sprites" );
myEngine.setupCanvas( );

myEngine.el.css('backgroundColor','#666');

//=============================================================
// Load
//=============================================================
function TestSpriteSheet() {
	var assetList = [ "sprites.png", "sprites.json" ];

	var onFinishedCallback = function() {
		console.log("All preloads finished!");

		// Create sprites sheets from our image and JSON files
		myEngine.compileSheets( "sprites.png", "sprites.json" );

		var slowDown = 4,
			frame1 = 0,
			frame2 = 0;
		var drawMinScale = 20;
		var drawMaxScale = 100;
		var scaleTimer = 0;

		myEngine.setGameLoop( function(dt) {
			myEngine.clearCanvas();

			var sheet1 = myEngine.getSpriteSheet( "man" );
			sheet1.draw( myEngine.getCanvas(), 0, 0, Math.floor( frame1/slowDown));
			frame1 = (frame1+1) % (sheet1.frames * slowDown);

			scaleTimer += dt;
			var drawScale = drawMinScale + Math.abs(Math.sin(scaleTimer)) * (drawMaxScale - drawMinScale);
			var sheet2 = myEngine.getSpriteSheet( "blob" );
			sheet2.draw( myEngine.getCanvas(), 150, 50, Math.floor( frame2/slowDown), drawScale, drawScale);
			frame2 = (frame2+1) % (sheet2.frames * slowDown);
		});
	};

	myEngine.load( assetList, onFinishedCallback );
}

//=============================================================
TestSpriteSheet();
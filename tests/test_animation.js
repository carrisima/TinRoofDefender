
//=========================================================================
// Animations Test App
//=========================================================================

//=========================================================================
// Create Engine Instance
//=========================================================================
var engineConfig = {
	imagePath: "tests/images/",
	audioPath: "tests/audio/",
	dataPath:  "tests/data/"
};

var myEngine = Engine( engineConfig );
myEngine.includeModule("Input, Sprites, Scenes, Animation");

//=========================================================================
// Setup Canvas
//=========================================================================
myEngine.setupCanvas( );
myEngine.el.css('backgroundColor','#666');

//=========================================================================
// HTML up in this hizzy
//=========================================================================
$("body").append("<h3>Controls</h3>");
$("body").append("<p>Left/Right to move player, camera will follow him.");
$("body").append("<p>Space to fire, will spawn explosion effect");
$("body").append("<p>Left click on screen to spawn explosion effect");

//=========================================================================
// Setup Input
//=========================================================================
myEngine.input.enableMouse();
myEngine.input.setKeyboardControls();

//=========================================================================
// Resources
//=========================================================================
var AssetList = [
	"smoke.png",
	"smoke.json",
	"platformerSprites.png",
	"platformerSprites.json" // sprites data file
];

var PlayerAnimationGroupName = "player";
var PlayerAnimationSequences = {
	run_right: {
		frames: _.range(7,-1,-1),
		rate: 1/10
	},

	run_left: {
		frames: _.range(0,8),
		rate:1/10
	},

	fire: {
		frames: [8,9,10,8],
		next: 'stand',
		rate: 1/30
	},

	stand: {
		frames: [8],
		rate: 1/5
	}
};

var SmokeAnimationGroupName = "smoke";
var SmokeAnimationSequences = {
	explode: {
		frames: _.range(0,7),
		rate: 1/10,
		loop: false
	}
};

//=========================================================================
// Game Object - Player
//=========================================================================
var ClassPlayer = Engine.Sprite.extend({

	// name to help with debugging
	name: "ClassPlayer",

	defaults: {
		// Sprite properties
		sheetName: "man",
		animSetName: PlayerAnimationGroupName,
		rate: 1/15,
		speed: 700
	},

	init:function(props) {
		this._super(props);

		this.addComponent('animation');
		this.play( "run_right" );

		// bind the input action event directly to trigger an animation
		myEngine.input.bindEvent('fire',this,"fire");

		this.bindEvent('animEnd.fire',this,function() { console.log("Fired!"); });
		this.bindEvent('animLoop.run_right',this,function() { console.log("right"); });
		this.bindEvent('animLoop.run_left',this,function() { console.log("left"); });
	},


	fire: function() {
		this.play('fire',1);

		var pos = this.transformLocalPosition( 100, 0 );
		var newEffect = new ClassExplosion( {x:pos.x, y:pos.y });
		this.parentStage.insert( newEffect );
    },

	step: function(dt) {
		var p = this.properties;
		if(p.animationName != 'fire') {
			if(myEngine.inputs['right']) {
				this.play('run_right');
				p.x += p.speed * dt;
			} else if(myEngine.inputs['left']) {
				this.play('run_left');
				p.x -= p.speed * dt;
			} else {
				this.play('stand');
			}
		}
		this._super(dt);
	}
});

//=========================================================================
// Game Object - Explosion Effect
//=========================================================================
var ClassExplosion = Engine.Sprite.extend({

	// name to help with debugging
	name: "ClassExplosion",

	defaults: {
		// Sprite properties
		sheetName: "smokeEffect",
		animSetName: SmokeAnimationGroupName,
		rate: 1/15,
		speed: 700,
		z: 20
	},

	init:function(props) {
		this._super(props);

		this.addComponent('animation');
		this.play( "explode" );

		// Once the animation is done playing, destroy this object
		this.bindEvent('animEnd',this,function() {
			this.destroy();
		});
	}

});

//=========================================================================
// Game Logic - Main Scene
//=========================================================================
function generator(stage) {
	var newPlayer = new ClassPlayer( {z:10} );
	stage.insert( newPlayer );

	stage.insert(new Engine.Sprite({ sheetName: "brick-border", x: -200, y: 0}));
	stage.insert(new Engine.Sprite({ sheetName: "brick", x: 200, y: 0 }));
	stage.insert(new Engine.Sprite({ sheetName: "wall", x: 600, y: 0 }));
	stage.insert(new Engine.Sprite({ sheetName: "woodbox", x: 1000, y: 0 }));

	stage.addComponent( "camera" );
	stage.camera.followEntity( newPlayer );

	//----------------
	// Input
	//----------------
	myEngine.input.bindEvent( "mouseleftdown", stage, function(mousePos) {
		mousePos = stage.transformLocalPosition( mousePos.x, mousePos.y );
		var newEffect = new ClassExplosion( {x:mousePos.x, y:mousePos.y });
		stage.insert( newEffect );
	});
}

var options = {
	sort: true
};
myEngine.addScene('level',new Engine.Scene(generator, options));


myEngine.load(AssetList, function() {
	// Create a sprite sheet out of the loaded assets
	myEngine.compileSheets('platformerSprites.png','platformerSprites.json');
	myEngine.compileSheets('smoke.png','smoke.json');

	// Assign animation data for sprites named 'player'
	myEngine.addAnimationData( PlayerAnimationGroupName, PlayerAnimationSequences );
	myEngine.addAnimationData( SmokeAnimationGroupName, SmokeAnimationSequences );

	// Start the level
	myEngine.stageScene("level");

	// Setup level to loop
	myEngine.setGameLoop(function(dt) {
		myEngine.stageGameLoop(dt);
	});

});


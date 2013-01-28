
//------------------------------------------------
// Setup HTML using jquery
// Don't need if you already have html code written
//
$("body").append("<div id='elapsedTime'>0</div>");
$("body").append("<div id='timer'>0</div>");
$("body").append("<div id='fps'>0</div>");
$("body").append("<button id='pause'>Pause</button>");
$("body").append("<button id='unpause'>Unpause</button>");


//------------------------------------------------
// Timer test code
//
var TimerTest = new Engine();

var totalFrames = 0,
	totalTime = 0;

TimerTest.setGameLoop(function(dt) {
	totalTime += dt;
	totalFrames += 1;
	$("#elapsedTime").text( "elapsedTime: " + dt.toFixed(4) + " ms" );
	$("#timer").text( "Accumulated: " + Math.round(totalTime * 1000) + " MS ");
	$("#fps").text( Math.round(totalFrames / totalTime) + " FPS");
});

//------------------------------------------------
// This approach is safest, because we can be sure that the Engine instance
// context is what is used for the 'this' variable.
//
// $("#pause").on('click', function() { TimerTest.pauseGame(); } );
// $("#unpause").on('click', function() { TimerTest.unpauseGame(); } );

//------------------------------------------------
// But this approach works now only because the Engine has used the
// Underscore library to bind the functions so that the context is preserved.
//
$("#pause").on('click', TimerTest.pauseGame );
$("#unpause").on('click', TimerTest.unpauseGame );

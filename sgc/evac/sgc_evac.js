function SGCEvacBase(element, refreshText, render) {
	
	if(!(element instanceof Element))
		throw "element is not element";
	if(typeof refreshText !== "function" && !(refreshText instanceof Function))
		throw "refreshText is not function";
	if(typeof render !== "function" && !(render instanceof Function))
		throw "render is not function";
	const graphicsWidth = 1311;
	const graphicsHeight = 1011;
	const phaseDuration = 300;
	const secondPartShowing = phaseDuration;
	const thirdPartShowing = phaseDuration*2;
	const fourthPartShowing = phaseDuration*3;
	const allShown = phaseDuration*4;
	const hiding = phaseDuration*5;
	const hidden = phaseDuration*6;
	const end = phaseDuration*10;
	const refreshTextFunction = refreshText;
	const renderFunction = render;
	const soundButton = new Audio("../sounds/button_controlroom.mp3");
	const soundAlert = new Audio("../sounds/alert2.mp3");
	const playing = () => {
		stopSound(soundAlert);
		window.cancelAnimationFrame(handler);
		lmnt.style.display = "";
		then = null;
		start = null;
		running = false;
	};
	const ended = () => {
		running = true;
		phase = false;
		lmnt.style.display = "block";
		refreshTextFunction(false);
		handler = requestAnimationFrame(animation);
		soundAlert.play();
	};
	var duration;
	var start = null;
	var then;
	var delta;
	var ratio;
	var running = false;
	var firstPart = 0;
	var secondPart = 0;
	var thirdPart = 0;
	var fourthPart = 0;
	var countdownFinished = false;
	var handler;
	var type = false;
	var phase = false;
	var lmnt = element;
	soundAlert.loop = true;

	const update = function(now) {
		if(then === undefined)
			then = now;
		delta = now - then;
		then = now;
		if(start == null)
			start = now;
		else if(duration >= end) {
			const n = Math.floor(duration/end);
			start += n*end;
			duration = duration - n*end;
			if(type && n%2 == 1) {
				phase = !phase
				refreshTextFunction(phase);
			}
		}
		duration = now - start;
		if(duration < secondPartShowing) {
			firstPart = duration/phaseDuration;
			secondPart = 0;
			thirdPart = 0;
			fourthPart = 0;
		} else if(duration < thirdPartShowing) {
			firstPart = 1;
			secondPart = (duration - secondPartShowing)/phaseDuration;
			thirdPart = 0;
			fourthPart = 0;
		} else if(duration < fourthPartShowing) {
			firstPart = 1;
			secondPart = 1;
			thirdPart = (duration - thirdPartShowing)/phaseDuration;
			fourthPart = 0;
		} else if(duration < allShown) {
			firstPart = 1;
			secondPart = 1;
			thirdPart = 1;
			fourthPart = (duration - fourthPartShowing)/phaseDuration;
		} else if(duration < hiding)
			firstPart = secondPart = thirdPart = fourthPart = 1;
		else if(duration < hidden)
			firstPart = secondPart = thirdPart = fourthPart = 1 - (duration - hiding)/phaseDuration;
		else if(duration < end)
			firstPart = secondPart = thirdPart = fourthPart = 0;
		ratio = window.devicePixelRatio;
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		var actualWidth = Math.floor(graphicsWidth*ratio);
		var actualHeight = Math.floor(graphicsHeight*ratio);
		var widthRatio = windowWidth/actualWidth;
		var heightRatio = windowHeight/actualHeight;
		var minimum = Math.min(widthRatio, heightRatio)*ratio;
		lmnt.setAttribute("width", actualWidth);
		lmnt.setAttribute("height", actualHeight);
		lmnt.style.width = graphicsWidth + "px";
		lmnt.style.height = graphicsHeight + "px";
		lmnt.style.transform = "translate(" + ((windowWidth - graphicsWidth*minimum)/2)
					+ "px," + ((windowHeight - graphicsHeight*minimum)/2)
					+ "px) scale(" + minimum + ")";
	};

	const animation = function(now) {
		update(now);
		renderFunction(
			{
				ratio: ratio,
				firstPart: firstPart,
				secondPart: secondPart,
				thirdPart: thirdPart,
				fourthPart: fourthPart
			}
		);
		handler = requestAnimationFrame(animation);
	};
	
	window.addEventListener("keypress", function() {
		if(!event.altKey && !event.ctrlKey && !event.metaKey) {
			if(event.keyCode == 32) {
				if(running) {
					soundButton.addEventListener("playing", playing);
					soundButton.removeEventListener("ended", ended);
				} else {
					type = event.shiftKey;
					soundButton.addEventListener("ended", ended);
					soundButton.removeEventListener("playing", playing);
				}
				soundButton.play();
			}
		}
	});
};
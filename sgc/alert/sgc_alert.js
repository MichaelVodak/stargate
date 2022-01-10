function SGCAlertBase(element, beforeStart, render) {
	
	if(!(element instanceof Element))
		throw "element is not element";
	if(typeof beforeStart !== "function" && !(beforeStart instanceof Function))
		throw "beforeStart is not function";
	if(typeof render !== "function" && !(render instanceof Function))
		throw "render is not function";
	const graphicsWidth = 1311;
	const graphicsHeight = 1011;
	const phaseDuration = 600;
	const secondPartShowing = phaseDuration;
	const thirdPartShowing = phaseDuration*2;
	const firstPartHiding = phaseDuration*3;
	const secondPartHiding = phaseDuration*4;
	const thirdPartHiding = phaseDuration*5;
	const beforeStartFunction = beforeStart;
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
		lmnt.style.display = "block";
		beforeStartFunction(type);
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
	var countdownFinished = false;
	var handler;
	var viewFps = false;
	var type = false;
	var lmnt = element;
	soundAlert.loop = true;

	const update = function(now) {
		if(then === undefined)
			then = now;
		delta = now - then;
		then = now;
		if(start == null)
			start = now;
		duration = now - start;
		if(duration >= thirdPartHiding)
			duration = duration - Math.floor(duration/thirdPartHiding)*thirdPartHiding;
		if(duration < secondPartShowing) {
			firstPart = duration/phaseDuration;
			secondPart = 0;
			thirdPart = 0;
		} else if(duration < thirdPartShowing) {
			firstPart = 1;
			secondPart = (duration - secondPartShowing)/phaseDuration;
			thirdPart = 0;
		} else if(duration < firstPartHiding) {
			firstPart = 1 - (duration - thirdPartShowing)/phaseDuration;
			secondPart = 1;
			thirdPart = (duration - thirdPartShowing)/phaseDuration;
		} else if(duration < secondPartHiding) {
			firstPart = 0;
			secondPart = 1 - (duration - firstPartHiding)/phaseDuration;
			thirdPart = 1;
		} else if(duration < thirdPartHiding) {
			firstPart = 0;
			secondPart = 0;
			thirdPart = 1 - (duration - secondPartHiding)/phaseDuration;
		}
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
				thirdPart: thirdPart
			}
		);
		handler = requestAnimationFrame(animation);
	};
	
	this.getFps = function() {
		return Math.floor(1000/delta);
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
			} else if(event.key === "f")
				viewFps = !viewFps;
		}
	});
};
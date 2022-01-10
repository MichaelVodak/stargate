function check(n) {
	return (n < 10 ? "0" : "") + n;
}

function SGCCountdownBase(element, render) {
	
	if(!(element instanceof Element))
		throw "element is not element";
	if(typeof render !== "function" && !(render instanceof Function))
		throw "render is not function";
	const graphicsWidth = 1322;
	const graphicsHeight = 1027;
	const timerMoverMaximum = 315;
	const maximumDate = new Date(2022, 0, 4, 17, 0, 0, 0);
	const maximum = maximumDate.getTime();
	const lmnt = element;
	const renderFunction = render;
	var timerY = 22;
	var date;
	var days;
	var hours;
	var minutes;
	var seconds;
	var then;
	var delta;
	var ratio;
	var countdownFinished = false;
	var viewFps = false;
	var running = false;
	var countdownFill = "#cc3333";

	const update = function(now) {
		date = new Date();
		ratio = window.devicePixelRatio;
		var distance = maximum - date.getTime();
		distance = distance - (distance < 0 ? 1000+distance%1000 : distance%1000) + 1000;
		var time = Math.abs(distance/1000);
		seconds = check(Math.floor(time%60));
		time /= 60;
		minutes = check(Math.floor(time%60));
		time /= 60;
		hours = check(Math.floor(time%24));
		time /= 24;
		days = check(Math.floor(time));
		
		if(then === undefined)
			then = now;
		delta = now - then;
		then = now;
		// If the count down is over, animate movable part 
		if(!countdownFinished && distance <= 0) {
			//TODO finish when time is up
			countdownFinished = true;
			countdownFill = "#339933";
		}
		if(countdownFinished && timerY < timerMoverMaximum) {
			timerY += delta*0.2;
			if(timerY > timerMoverMaximum)
				timerY = timerMoverMaximum;
		}
		var windowWidth = window.innerWidth;
		var windowHeight = window.innerHeight;
		var actualWidth = Math.floor(graphicsWidth*ratio);
		var actualHeight = Math.floor(graphicsHeight*ratio);
		var widthRatio = windowWidth/actualWidth;
		var heightRatio = windowHeight/actualHeight;
		var minimum = Math.min(widthRatio, heightRatio)*ratio;
		lmnt.width = actualWidth;
		lmnt.height = actualHeight;
		lmnt.style.width = graphicsWidth + "px";
		lmnt.style.height = graphicsHeight + "px";
		lmnt.style.transform = "translate(" + ((windowWidth - graphicsWidth*minimum)/2)
					+ "px," + ((windowHeight - graphicsHeight*minimum)/2)
					+ "px) scale(" + minimum + "," + minimum + ")";
	};

	const animation = function(now) {
		update(now);
		renderFunction(
			{
				timerY: timerY,
				countdownDays: days,
				countdownHours: hours,
				countdownMinutes: minutes,
				countdownSeconds: seconds,
				date: check(date.getDate()),
				month: check(date.getMonth()+1),
				fullYear: date.getFullYear(),
				hours: check(date.getHours()),
				minutes: check(date.getMinutes()),
				seconds: check(date.getSeconds()),
				ratio: ratio,
				countdownFill: countdownFill,
				viewFps: viewFps,
				fps: Math.floor(1000/delta)
			}
		);
		requestAnimationFrame(animation);
	};
	
	window.addEventListener("keypress", function(event) {
		if(event.key === "f")
			viewFps = !viewFps;
	});
	
	this.start = function() {
		if(!running) {
			running = true;
			requestAnimationFrame(animation);
		}
	};
};
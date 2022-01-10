function stopSound(media) {
	if(!(media instanceof HTMLMediaElement))
		throw "media is not HTMLMediElement";
	media.pause();
	media.currentTime = 0;
};
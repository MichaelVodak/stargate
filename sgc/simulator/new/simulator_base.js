function check(number) {
	return (number < 10 ? "0" : "") + number;
}
          
function AbstrDoubleList(t) {

	if(typeof t !== "function")
		throw "type is not function";
	const type = t;
	const Element = function(d, p, s) {
		const data = d;
		this.predecessor = p;
		this.successor = s;
		
		this.getData = function() {
			return data;
		};
	};

	var first = null;
	var last = null;
	var current = null;
	var cardinality = 0;

	this.isEmpty = function() {
		return cardinality == 0;
	};

	this.cardinality = function() {
		return cardinality;
	};

	this.clear = function() {
		first = null;
		last = null;
		current = null;
		cardinality = 0;
	};

	this.insertFirst = function(d) {
		if(d == null || d === undefined)
			throw "data is empty";
		else if(!type(d))
			throw "data is not same type";
		const element = new Element(d, null, first);
		if(this.isEmpty())
			last = element;
		else
			first.predecessor = element;
		first = element;
		cardinality++;
	};

	this.insertLast = function(d) {
		if(d == null || d === undefined)
			throw "data is empty";
		else if(!type(d))
			throw "data is not same type";
		const element = new Element(d, last, null);
		if(this.isEmpty())
			first = element;
		else
			last.successor = element;
		last = element;
		cardinality++;
	};

	this.insertPredecessor = function(d) {
		if(d == null || d === undefined)
			throw "data is empty";
		else if(!type(d))
			throw "data is not same type";
		else if(current == null)
			throw "current is not set";
		const element = new Element(d, current.predecessor, current);
		if(current == first)
			first = element;
		else
			current.predecessor.successor = element;
		current.predecessor = element;
		cardinality++;
	};

	this.insertSuccessor = function(d) {
		if(d == null || d === undefined)
			throw "data is empty";
		else if(!type(d))
			throw "data is not same type";
		else if(current == null)
			throw "current is not set";
		const element = new Element(d, current, current.successor);
		if(current == last)
			last = element;
		else
			current.successor.predecessor = element;
		current.successor = element;
		cardinality++;
	};

	this.accessCurrent = function() {
		if(this.isEmpty())
			throw "collection is empty";
		else if(current == null)
			throw "current is not set";
		return current.getData();
	};

	this.accessFirst = function() {
		if(this.isEmpty())
			throw "collection is empty";
		current = first;
		return first.getData();
	};

	this.accessLast = function() {
		if(this.isEmpty())
			throw "collection is empty";
		current = last;
		return last.getData();
	};

	this.accessPredecessor = function() {
		if(this.isEmpty())
			throw "collection is empty";
		else if(current == null)
			throw "current is not set";
		else if(current.predecessor == null)
			throw "current is first";
		current = current.predecessor;
		return current.getData();
	};

	this.accessSuccessor = function() {
		if(this.isEmpty())
			throw "collection is empty";
		else if(current == null)
			throw "current is not set";
		else if(current.successor == null)
			throw "current is last";
		current = current.successor;
		return current.getData();
	};

	this.removeCurrent = function() {
		if(this.isEmpty())
			throw "collection is empty";
		else if(current == null)
			throw "current is not set";
		const data = remove(current);
		current = first;
		return data;
	};

	this.removeFirst = function() {
		if(this.isEmpty())
			throw "collection is empty";
		const is = current == first;
		const data = remove(first);
		if(is)
			current = first;
		return data;
	};

	this.removeLast = function() {
		if(this.isEmpty())
			throw "collection is empty";
		const is = current == last;
		const data = remove(last);
		if(is)
			current = last;
		return data;
	};

	this.removePredecessor = function() {
		if(this.isEmpty())
			throw "collection is empty";
		else if(current == null)
			throw "current is not set";
		else if(current.predecessor == null)
			throw "current is first";
		return remove(current.predecessor);
	};

	this.removeSuccessor = function() {
		if(this.isEmpty())
			throw "collection is empty";
		else if(current == null)
			throw "current is not set";
		else if(current.successor == null)
			throw "current is last";
		return remove(current.successor);
	};

	this.iterator = function() {

		var element = first;
		return Object.freeze({
			
			hasNext: Object.freeze(function() {
				return element != null;
			}), next: Object.freeze(function() {
				if(this.hasNext()) {
					const data = element.getData();
					element = element.successor;
					return data;
				}
				throw "no such element";
			})
			
		});
	};

	this.contains = function(d) {
		if(d == null || d === undefined || !type(d))
			return false;
		var element = first;
		for(var i = 0; i < cardinality; i++) {
			if(d === element.getData())
				return true;
			element = element.successor;
		}
		return false;
	};

	const remove = function(element) {
		if(element.predecessor == null)
			first = element.successor;
		else
			element.predecessor.successor = element.successor;
		if(element.successor == null)
			last = element.predecessor;
		else
			element.successor.predecessor = element.predecessor;
		cardinality--;
		return element.getData();
	};
}
	
function PriorityQueue(t, c) {

	if(typeof c !== "function")
		throw "comparator is not function";
	const doubleList = new AbstrDoubleList(t);
	const type = t;
	const comparator = c;

	this.isEmpty = function() {
		return doubleList.isEmpty();
	};

	this.clear = function() {
		doubleList.clear();
	};

	this.cardinality = function() {
		return doubleList.cardinality();
	};

	this.insert = function(d) {
		if(d == null || d === undefined)
			throw "data is empty";
		else if(!type(d))
			throw "data is not same type";
		if(this.isEmpty()
				|| comparator(doubleList.accessLast(), d) <= 0) {
			doubleList.insertLast(d);
			return;
		}
		doubleList.accessFirst();
		for(var i = 0; i < doubleList.cardinality(); i++) {
			if(comparator(doubleList.accessCurrent(), d) > 0) {
				doubleList.insertPredecessor(d);
				return;
			}
			doubleList.accessSuccessor();
		} 
	};

	this.access = function() {
		if(this.isEmpty())
			throw "collection is empty";
		return doubleList.accessFirst();
	};

	this.remove = function(d) {
		if(this.isEmpty())
			throw "collection is empty";
		else if(!doubleList.contains(d))
			throw "not contained";
		for(var i = 0, data = doubleList.accessFirst();
				i < doubleList.cardinality(); i++, data =
						doubleList.accessSuccessor()) {
			if(data === d)
				return doubleList.removeCurrent();
		}
		return null;
	};

	this.contains = function(d) {
		return doubleList.contains(d);
	};

	this.iterator = function() {
		return doubleList.iterator();
	};
}

function SGCSimulatorBase(element, render) {
	if(!(element instanceof Element))
		throw "element is not element";
	if(typeof render !== "function" && !(render instanceof Function))
		throw "render is not function";
	const graphicsWidth = 1307;
	const graphicsHeight = 1012;
	const PLANET_STATUSES = {
		ACTIVE: {id: 1, label: "Active"},
		INACTIVE: {id: 2, label: "Inactive"},
		LOCKED: {id: 3, label: "Locked"}
	};
	const YES_NO = {
		NO: {id: 1, label: "No"},
		YES: {id: 2, label: "Yes"}
	};
	const STARGATE_STATUSES = {
		IDLE: {id: 1, label: "IDLE", color: "#E2E9C0", dx: 10, priority: 20},
		DIALING_IN_PROGRESS: {id: 2, label: "DIALING", color: "#E2E9C0", fontSize: 55, dx: 10, priority: 19},// IN PROGRESS
		ENGAGED: {id: 3, label: "ENGAGED", color: "#E2E9C0", dx: 10, priority: 18},
		LOCKED: {id: 4, label: "LOCKED", color: "#E2E9C0", dx: 10, priority: 18},
		ACTIVE: {id: 5, label: "ACTIVE", color: "#E2E9C0", dx: 10, priority: 17},
		SHUTDOWN: {id: 6, label: "SHUTDOWN", color: "rgb(172, 0, 0)", dx: 10, priority: 15},
		ABORTING: {id: 7, label: "ABORTING", color: "rgb(172, 0, 0)", dx: 10, priority: 15},
		HOLDING: {id: 8, label: "HOLDING", color: "#E2E9C0", dx: 10, priority: 16},
		CLOSING_IRIS: {id: 8, label: "CLOSING IRIS", color: "#E2E9C0", dx: 5, priority: 15},
		OPENING_IRIS: {id: 9, label: "OPENING IRIS", color: "#E2E9C0", dx: 5, priority: 15},
		INCOMING: {id: 10, label: "INCOMING", color: "rgb(172, 0, 0)", dx: 10, priority: 19},
		RECEIVING_SIGNAL: {id: 11, label: "RECEIVING SIGNAL", color: "#E2E9C0", dx: 5, priority: 18},
		RECEIVING_TRANSMISSION: {id: 11, label: "RECEIVING", color: "#E2E9C0", dx: 5, priority: 18},
		RECEIVING_CODE: {id: 12, label: "RECEIVING CODE", color: "rgb(172, 0, 0)", dx: 5, priority: 18},
		CODE_RECOGNIZED: {id: 13, label: "CODE RECOGNIZED", color: "#10aa10", dx: 5, priority: 18},
		ERROR_404: {id: 14, label: "ERROR 404", color: "rgb(172, 0, 0)", dx: 10, priority: 14},
		UNKNOWN_ERROR: {id: 14, label: "UNKNOWN ERROR", color: "rgb(172, 0, 0)", dx: 10, priority: 14}
	};
	const GLYPHS = {
		0: {
			name: "Earth",
			angle: 355.38461538461536
		}, 1: {
			name: "Crater",
			angle: 346.15384615384613
		}, 2: {
			name: "Virgo",
			angle: 336.9230769230769
		}, 3: {
			name: "Boötes",
			angle: 327.6923076923077
		}, 4: {
			name: "Centaurus",
			angle: 318.46153846153845
		}, 5: {
			name: "Libra",
			angle: 309.2307692307692
		}, 6: {
			name: "Serpens Caput",
			angle: 300
		}, 7: {
			name: "Norma",
			angle: 290.7692307692308
		}, 8: {
			name: "Scorpius",
			angle: 281.53846153846155
		}, 9: {
			name: "Corona Australis",
			angle: 272.3076923076923
		}, 10: {
			name: "Scutum",
			angle: 263.0769230769231
		}, 11: {
			name: "Sagittarius",
			angle: 253.84615384615387
		}, 12: {
			name: "Aquila",
			angle: 244.61538461538464
		}, 13: {
			name: "Microscopium",
			angle: 235.38461538461542
		}, 14: {
			name: "Capricornus",
			angle: 226.1538461538462
		}, 15: {
			name: "Piscis Austrinus",
			angle: 216.92307692307696
		}, 16: {
			name: "Equuleus",
			angle: 207.69230769230774
		}, 17: {
			name: "Aquarius",
			angle: 198.4615384615385
		}, 18: {
			name: "Pegasus",
			angle: 189.23076923076928
		}, 19: {
			name: "Sculptor",
			angle: 180.00000000000006
		}, 20: {
			name: "Pisces",
			angle: 170.76923076923083
		}, 21: {
			name: "Andromeda",
			angle: 161.5384615384616
		}, 22: {
			name: "Triangulum",
			angle: 152.30769230769238
		}, 23: {
			name: "Aries",
			angle: 143.07692307692315
		}, 24: {
			name: "Perseus",
			angle: 133.84615384615392
		}, 25: {
			name: "Cetus",
			angle: 124.6153846153847
		}, 26: {
			name: "Taurus",
			angle: 115.38461538461547
		}, 27: {
			name: "Auriga",
			angle: 106.15384615384625
		}, 28: {
			name: "Eridanus",
			angle: 96.92307692307702
		}, 29: {
			name: "Orion",
			angle: 87.69230769230779
		}, 30: {
			name: "Canis Minor",
			angle: 78.46153846153857
		}, 31: {
			name: "Monoceros",
			angle: 69.23076923076934
		}, 32: {
			name: "Gemini",
			angle: 60.000000000000114
		}, 33: {
			name: "Hydra",
			angle: 50.76923076923089
		}, 34: {
			name: "Lynx",
			angle: 41.53846153846166
		}, 35: {
			name: "Cancer",
			angle: 32.307692307692434
		}, 36: {
			name: "Sextans",
			angle: 23.076923076923208
		}, 37: {
			name: "Leo Minor",
			angle: 13.846153846153982
		}, 38: {
			name: "Leo",
			angle: 4.615384615384755
		}
	};
	const PLANETS = [
		{
			name: "Abydos",
			id: "#81001",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "09-2",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 22,
			address: [26, 6, 14, 31, 11, 29, 0]
		}, {
			name: "Chulak",
			id: "#81002",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "03-2",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.YES,
			daycycle: 26,
			address: [8, 1, 22, 14, 36, 19, 0]
		}, {
			name: "Cimmeria",
			id: "#81003",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "09-1",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 23,
			address: [10, 34, 21, 16, 5, 25, 0]
		}, {
			name: "Edora",
			id: "#81004",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "04-1",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 24,
			address: [27, 37, 34, 8, 14, 2, 0]},
		{
			name: "Uronda",
			id: "#81005",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "03-1",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 26,
			address: [29, 26, 8, 6, 17, 15, 0]
		}, {
			name: "Tollana",
			id: "#81006",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "12-2",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.YES,
			daycycle: 23,
			address: [3, 28, 7, 21, 17, 24, 0]
		}, {
			name: "Kheb",
			id: "#81007",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "10-4",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 24,
			address: [25, 34, 5, 7, 22, 13, 0]
		}, {
			name: "Rogue base",
			id: "#81008",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "03-4",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 24,
			address: [27, 34, 14, 2, 18, 37, 0]
		}, {
			name: "Aphophis homeworld",
			id: "#81009",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.YES,
			category: "03-3",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 16,
			address: [19, 17, 10, 37, 9, 31, 0]
		}, {
			name: "Goa'uld ship",
			id: "#81010",
			status: PLANET_STATUSES.INACTIVE,
			malp: YES_NO.NO,
			expd: YES_NO.YES,
			hstl: YES_NO.YES,
			category: "X5-c",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: null,
			address: [2, 38, 15, 7, 9, 11, 0]
		}, {
			name: "Martin's homeworld",
			id: "#81011",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "C3-2",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 20,
			address: [23, 11, 31, 21, 10, 33, 0]
		}, {
			name: "Tok'ra planet",
			id: "#81012",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.NO,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "C4-5",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 28,
			address: [23, 8, 27, 34, 2, 36, 0]
		}, {
			name: "Entity planet",
			id: "#81013",
			status: PLANET_STATUSES.LOCKED,
			malp: YES_NO.YES,
			expd: YES_NO.NO,
			hstl: YES_NO.YES,
			category: "X3-C",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: null,
			address: [24, 7, 17, 28, 3, 21, 0]
		}, {
			name: "Nox planet",
			id: "#81014",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "03-1",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 18,
			address: [31, 17, 11, 22, 6, 26, 0]
		}, {
			name: "P34-35J",
			id: "#81015",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "C3-1",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 26,
			address: [37, 8, 27, 14, 34, 2, 0]
		}, {
			name: "P3X-118",
			id: "#81016",
			status: PLANET_STATUSES.LOCKED,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.YES,
			category: "X4-A",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 29,
			address: [8, 25, 33, 36, 16, 20, 0]
		}, {
			name: "P3X-562",
			id: "#81017",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "O2-3",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 56,
			address: [2, 27, 8, 34, 23, 14, 0]
		}, {
			name: "P3X-763",
			id: "#81018",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "O1-8",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 25,
			address: [5, 32, 26, 36, 10, 17, 0]
		}, {
			name: "Argos",
			id: "#81019",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "O7-2",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 23,
			address: [23, 3, 19, 8, 14, 28, 0]
		}, {
			name: "Oannes",
			id: "#81020",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "C3-1",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 25,
			address: [3, 28, 9, 16, 35, 24, 0]
		}, {
			name: "P3X-972",
			id: "#81021",
			status: PLANET_STATUSES.INACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "O2-2",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 19,
			address: [26, 6, 14, 31, 12, 29, 0]
		}, {
			name: "P3X-797",
			id: "#81022",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "O4-7",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 25,
			address: [25, 1, 5, 23, 9, 31, 0]
		}, {
			name: "HANKA",
			id: "#81023",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "O1-8",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.YES,
			daycycle: 26,
			address: [29, 5, 23, 11, 13, 18, 0]
		}, {
			name: "P4X-639",
			id: "#81024",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "O2-4",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 28,
			address: [11, 35, 22, 17, 6, 26, 0]
		}, {
			name: "P2X-555",
			id: "#81025",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "O3-1",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 29,
			address: [27, 7, 15, 32, 12, 30, 0]
		}, {
			name: "P3T-761",
			id: "#81026",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "O5-8",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 19,
			address: [32, 28, 12, 24, 11, 31, 0]
		}, {
			name: "P3T-762",
			id: "#81027",
			status: PLANET_STATUSES.ACTIVE,
			malp: YES_NO.YES,
			expd: YES_NO.YES,
			hstl: YES_NO.NO,
			category: "O2-4",
			msnhsty: YES_NO.YES,
			tpgrphc: YES_NO.NO,
			daycycle: 22,
			address: [29, 5, 23, 11, 13, 18, 0]
		}
	];
	var running = false;
	var run = false;
	var abort = false;
	var hold = false;
	var stargateTimer = false;
	var index = 0;
	var then;
	var baseEmergency = null;
	const renderFunction = render;
	var ratio;
	const lmnt = element;
	var written = false;
	var opacity = 0;
	var percent = 0;
	var percentPause = null;
	var opacityType = 1;
	var percentType = 1;
	
	const update = function(now) {
		
		if(then === undefined)
			then = now;
		delta = now - then;
		then = now;
		
		opacity += opacityType*delta/2000;
		if(percentPause == null)
			percent += percentType*18*delta/200;
		if(opacityType == 1 && opacity >= 1) {
			opacityType = -1;
			opacity = 1;
		} else if(opacityType == -1 && opacity <= 0) {
			opacityType = 1;
			opacity = 0;
		}
		if(percentType == 1 && percent >= 18) {
			percentType = -1;
			percent = 18;
		} else if(percentType == -1 && percent <= 0) {
			percent = 0;
			if(percentPause == null) {
				percentPause = now;
			}
			if(now - percentPause > 400) {
				percentType = 1;
				percentPause = null;
			}
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
	
	this.start = function() {
		if(!running) {
			running = true;
			requestAnimationFrame(animation);
		}
	};
	const animation = function(now) {
		update(now);
		renderFunction({
			opacity: opacity,
			percent: percent,
			ratio: ratio
		});
		requestAnimationFrame(animation);
	};
}
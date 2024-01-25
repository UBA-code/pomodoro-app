// const progress = document.querySelector(".progress-ring__circle") as SVGCircleElement;
// const circumference: number = progress.r.baseVal.value * 2 * Math.PI;

// progress.style.strokeDasharray = `${circumference} ${circumference}`;
// progress.style.strokeDashoffset = circumference.toString();

// function setProgress(percent: number) {
//     const offset: string = (circumference - percent / 100 * circumference).toString();
//     progress.style.strokeDashoffset = offset;
// }

// setProgress(-25);

const UPDATE_INTERFACE = true;

enum Sessions {
	pomodoro,
	short,
	long,
}

enum Fonts {
	kumh = "'Kumbh Sans', sans-serif",
	roboto = "'Roboto Slab', serif",
	space = "'Space Mono', monospace"
}

enum Colors {
	red = "#F87272",
	blue = "#72F4F8",
	purple = "#D882F8"
}

enum nextSession {
	pomodoro = "WORKING",
	short = "SHORT BREAK",
	long = "LONG BREAK"
}

enum defaultTiming {
	pomodoro = 25,
	short = 5,
	long = 15,
};


interface storageObj {
	colorTheme: string,
	font: string,
	totalTime: number,
	session: number,
	currentTiming: number,
	totalShortBreak: number,
	nextSession: string,
	sessionsTiming: { pomodoro: number; short: number; long: number },
}

{
	let firstFont = document.querySelector('.font-changer-box .font-buttons .font-btn:first-child') as HTMLButtonElement;
	let secondFont = document.querySelector('.font-changer-box .font-buttons .font-btn:nth-child(2)') as HTMLButtonElement;
	let thirdFont = document.querySelector('.font-changer-box .font-buttons .font-btn:last-child') as HTMLButtonElement;

	firstFont.style.fontFamily = Fonts.kumh;
	secondFont.style.fontFamily = Fonts.roboto
	thirdFont.style.fontFamily = Fonts.space;
}

//* setting show hide

let settingBtn = document.querySelector(".setting-btn")!;

let settingBox = document.querySelector(".setting-container")!;
let settingBackground = document.querySelector(".setting-bg")!;
let closeSettingBtn = document.querySelector(".setting-close-btn")!;

settingBtn.addEventListener("click", toggleSetting);
settingBackground.addEventListener("click", toggleSetting);
document.addEventListener("keyup", (e) =>
	e.code === "Escape" ? toggleSetting() : ""
);
closeSettingBtn.addEventListener("click", toggleSetting);

function toggleSetting() {
	if (settingBox.classList.contains("invisible")) {
		settingBox.classList.remove("invisible");
		setTimeout(() => settingBox!.classList.remove("opacity-0"), 0);
	} else {
		settingBox.classList.add("opacity-0");
		setTimeout(() => settingBox!.classList.add("invisible"), 300);
	}
}


//* configure data object

function getDefaultData(): storageObj {
	let newObj = {
		colorTheme: Colors.red,
		font: Fonts.kumh,
		totalTime: 0,
		session: Sessions.pomodoro,
		sessionsTiming: { pomodoro: defaultTiming.pomodoro, short: defaultTiming.short, long: defaultTiming.long },
		totalShortBreak: 0,
		nextSession: nextSession.short,
		currentTiming: defaultTiming.pomodoro,
	}
	return (newObj);
}

let mainObj: storageObj = JSON.parse(localStorage.getItem("data")!);

if (!mainObj) {
	mainObj = getDefaultData();
	localStorage.setItem("data", JSON.stringify(mainObj));
}


//* pomodoro / short break / long break changer
{
	let sessionsOptions = document.querySelectorAll(".selecter .option")!;

	sessionsOptions.forEach((elem, i) => {
		elem.addEventListener("click", (e) => {
			sessionsOptions.forEach((e) => e.classList.remove("active-option"));
			elem.classList.add("active-option");
			mainObj.currentTiming = Object.values(mainObj.sessionsTiming)[i];
			updateData({ ...mainObj, session: i });
			updateUI();
			resetCounter();
		});
		if (i == mainObj.session)
			elem.classList.add("active-option");
	});
}

updateUI();

function updateData(obj: storageObj, updateInterface?: boolean) {
	mainObj = obj;
	localStorage.setItem("data", JSON.stringify(mainObj));
	if (updateInterface)
		updateUI();
}

//* setting configure

function switchToActiveBtn(e: HTMLButtonElement, arr: NodeListOf<HTMLButtonElement>) {
	e.addEventListener('click', () => {
		arr.forEach((e) => e.classList.remove('active'));
		e.classList.add('active');
	})
}

{
	let applyBtn = document.querySelector('.setting-box .apply-btn') as HTMLButtonElement;
	let inputs = document.querySelectorAll('.setting-body .time-fields-box .field-box .field-input') as NodeListOf<HTMLInputElement>;
	let fonts = document.querySelectorAll('.setting-body .font-changer-box .font-buttons .font-btn') as NodeListOf<HTMLButtonElement>;
	let colors = document.querySelectorAll('.setting-body .color-changer-box .color-buttons .color-btn') as NodeListOf<HTMLButtonElement>;

	//? check input values
	inputs.forEach((e, i) => {
		let inputsController = document.querySelectorAll('.input-field-box')!;

		inputsController.item(i).querySelector('.increase')!.addEventListener('mousedown', () => {
			e.value = `${+(e.value) + 1}`
			if (+e.value > 90)
				e.value = '90';
		});
		inputsController.item(i).querySelector('.decrease')!.addEventListener('mousedown', () => {
			e.value = `${+(e.value) - 1}`
			if (+e.value < 1)
				e.value = '1';
		});
		e.addEventListener('input', _ => {
			let oldValue: string = "";
			for (let i = 0; i < e.value.length; i++) {
				if (e.value[i] > '9' || e.value[i] < '0') {
					e.value = oldValue;
					break
				}
				oldValue += e.value[i];
			}
			e.value = oldValue;
		});
		e.addEventListener('change', () => { // when the focus change
			if (+e.value > 90)
				e.value = '90';
			if (!e.value.length || +e.value < 1)
				e.value = '1';
		})
	});
	fonts.forEach((e) => switchToActiveBtn(e, fonts));
	colors.forEach((e) => switchToActiveBtn(e, colors));

	//* apply settings
	applyBtn.addEventListener('click', () => {
		fonts.forEach((e, i) => e.classList.contains('active') ? mainObj.font = Object.values(Fonts)[i] : "");
		colors.forEach((e, i) => e.classList.contains('active') ? mainObj.colorTheme = Object.values(Colors)[i] : "");
		mainObj.sessionsTiming.pomodoro = +inputs.item(0).value;
		mainObj.sessionsTiming.short = +inputs.item(1).value;
		mainObj.sessionsTiming.long = +inputs.item(2).value;
		updateData({ ...mainObj, currentTiming: Object.values(mainObj.sessionsTiming)[mainObj.session] }, UPDATE_INTERFACE);
		resetCounter();
		toggleSetting();
	});

	//* reset settings
	let resetSetting = document.querySelector('.setting-box .reset-btn') as HTMLButtonElement;
	resetSetting.addEventListener('click', () => {
		updateData(getDefaultData(), UPDATE_INTERFACE);
	});
}

/**
 * update interface with the neweset data
 */

function updateUI() {
	let inputs = document.querySelectorAll('.setting-body .time-fields-box .field-box .field-input') as NodeListOf<HTMLInputElement>;
	let fonts = document.querySelectorAll('.setting-body .font-changer-box .font-buttons .font-btn') as NodeListOf<HTMLButtonElement>;
	let colors = document.querySelectorAll('.setting-body .color-changer-box .color-buttons .color-btn') as NodeListOf<HTMLButtonElement>;
	let counter = document.querySelector('.counter')!;
	let sessionsOptions = document.querySelectorAll(".selecter .option")!;
	let nextSession = document.querySelector('.next-session .next-session-status')!;

	counter.textContent = mainObj.currentTiming.toString() + ':00';
	fonts.forEach((e, i) => e.classList.remove('active'));
	colors.forEach((e, i) => e.classList.remove('active'));

	inputs.forEach((e, i) => e.value = Object.values(mainObj.sessionsTiming)[i].toString());
	fonts.forEach((e, i) => Object.values(Fonts)[i] === mainObj.font ? e.classList.add('active') : '');
	colors.forEach((e, i) => Object.values(Colors)[i] === mainObj.colorTheme ? e.classList.add('active') : '');
	document.body.style.setProperty('--color-theme', mainObj.colorTheme);
	document.body.style.setProperty('--font-theme', mainObj.font);

	sessionsOptions.forEach((elem, i) => {
		if (i === mainObj.session)
			elem.classList.add("active-option");
		else
			elem.classList.remove("active-option");
	});
	nextSession.textContent = mainObj.nextSession;
	updateTotalTime();
}

function updateTotalTime(amountOfTime: number = 0) {
	let totalTimeElement = document.querySelector('.total-work .total-work-timing')!;
	let time: Date;

	updateData({ ...mainObj, totalTime: mainObj.totalTime + amountOfTime });
	time = new Date(mainObj.totalTime);

	let hours = time.getHours() < 10 ? '0' + time.getHours().toString() : time.getHours();
	let minutes = time.getMinutes() < 10 ? '0' + time.getMinutes().toString() : time.getMinutes();
	let seconds = time.getSeconds() < 10 ? '0' + time.getSeconds().toString() : time.getSeconds();
	totalTimeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

//* configure counter

let counter = document.querySelector(".counter")!;
let startResetBtn = document.querySelector(".start-reset")!;
let pauseResumeBtn = document.querySelector(".pause-resume")!;
let targetTime = new Date(`0`);
let currentTime: Date;
let appLoop: number;

targetTime.setMinutes(mainObj.currentTiming);

counter.textContent = mainObj.currentTiming + ':00';
startResetBtn.addEventListener("click", switchStartReset);
pauseResumeBtn.addEventListener("click", runCounter);

/**
 * switch status between START & RESET
*/
function switchStartReset() {
	//? counter is already running
	if (counter.classList.contains("counter-active"))
		resetCounter();
	else {
		currentTime = new Date('0');
		runCounter();
	}
}

function runCounter() {
	startResetBtn.textContent = "RESET";
	pauseResumeBtn.textContent = "PAUSE";
	counter.classList.toggle("counter-active"); // toggle between pause and resume

	if (counter.classList.contains("counter-active")) {
		appLoop = setInterval(() => {
			targetTime.setSeconds(targetTime.getSeconds() - 1);
			if (mainObj.session === Sessions.pomodoro)
				updateTotalTime(1000);
			let remainingTime = targetTime.getTime() - currentTime.getTime();

			let minutes = `${Math.floor(remainingTime / (1000 * 60))}`;
			let seconds = `${Math.floor((remainingTime % (1000 * 60)) / 1000)}`;
			counter.textContent = `${minutes.length == 1 ? '0' + minutes : minutes}:${seconds.length == 1 ? '0' + seconds : seconds}`
			if (+minutes == 0 && +seconds == 0) {
				if (mainObj.session !== Sessions.short)
					updateData({ ...mainObj, totalShortBreak: mainObj.totalShortBreak + 1 });
				if (mainObj.session == Sessions.pomodoro) {
					if (mainObj.totalShortBreak % 5 === 0) {
						updateData(
							{
								...mainObj,
								session: Sessions.long,
								currentTiming: Object.values(mainObj.sessionsTiming)[Sessions.long],
								nextSession: nextSession.pomodoro,
							}, UPDATE_INTERFACE);
					}
					else {
						updateData(
							{
								...mainObj,
								session: Sessions.short,
								currentTiming: Object.values(mainObj.sessionsTiming)[Sessions.short],
								nextSession: nextSession.pomodoro,
							}, UPDATE_INTERFACE);
					}
				}
				else {
					let nextSessionStatus = nextSession.short;

					if ((mainObj.totalShortBreak + 1) % 5 === 0)
						nextSessionStatus = nextSession.long;
					updateData(
						{
							...mainObj,
							session: Sessions.pomodoro,
							currentTiming: Object.values(mainObj.sessionsTiming)[Sessions.pomodoro],
							nextSession: nextSessionStatus
						}, UPDATE_INTERFACE);
				}
				clearInterval(appLoop);
				resetCounter();
			}
		}, 1000);
		startResetBtn.addEventListener("click", resetCounter);
	} else {
		pauseResumeBtn.textContent = "RESUME";
		clearInterval(appLoop);
	}
}

function resetCounter() {
	counter.textContent = mainObj.currentTiming.toString() + ':00';
	startResetBtn.textContent = "START";
	pauseResumeBtn.textContent = "";
	counter.classList.remove("counter-active");
	clearInterval(appLoop);
	targetTime = new Date('0');
	targetTime.setMinutes(mainObj.currentTiming);
	startResetBtn.removeEventListener("click", resetCounter);
}


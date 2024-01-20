// const progress = document.querySelector(".progress-ring__circle") as SVGCircleElement;
// const circumference: number = progress.r.baseVal.value * 2 * Math.PI;

// progress.style.strokeDasharray = `${circumference} ${circumference}`;
// progress.style.strokeDashoffset = circumference.toString();



// function setProgress(percent: number) {
//     const offset: string = (circumference - percent / 100 * circumference).toString();
//     progress.style.strokeDashoffset = offset;
// }

// setProgress(-25);

enum Sessions {
    pomodoro,
    short,
    long
}

interface storageObj {
    colorTheme: string,
    totalTime: string,
    session: number,
}


let mainObj: storageObj = JSON.parse(localStorage.getItem('data')!);

if (!mainObj)
{
    mainObj = {colorTheme: "red", totalTime: "00:00:00", session: Sessions.pomodoro};
    localStorage.setItem('data', JSON.stringify(mainObj));
}

let sessionsOptions = document.querySelectorAll('.selecter .option')!;

sessionsOptions.forEach((elem, i) => {
    elem.addEventListener('click', (e) => {
        sessionsOptions.forEach(e => e.classList.remove('active-option'));
        elem.classList.add('active-option');
        updateData({...mainObj, session: i});
    })
    if (i == mainObj.session)
        elem.classList.add('active-option');
});

function updateData(obj: storageObj) {
    mainObj = obj;
    localStorage.setItem('data', JSON.stringify(obj));
}


let counter = document.querySelector('.counter')!;
let startResetBtn = document.querySelector('.start-reset')!;
let pauseResumeBtn = document.querySelector('.pause-resume')!;
let time = new Date("2000 00:25:00");
let appLoop: number;


startResetBtn.addEventListener('click', switchStartReset);
pauseResumeBtn.addEventListener('click', runCounter);

/**
 * switch status between START & RESET
*/
function switchStartReset() {
    if (counter.classList.contains('counter-active')) //? counter is already running
        resetCounter();
    else
        runCounter();
}

function runCounter() {
    startResetBtn.textContent = "RESET";
    pauseResumeBtn.textContent = "PAUSE";
    counter.classList.toggle('counter-active'); // toggle between pause and resume

    if (counter.classList.contains('counter-active'))
    {
        appLoop = setInterval(() => {
            time.setSeconds(time.getSeconds() - 1);
            counter.textContent = time.toTimeString().match(/\d{2}:\d{2} /ig)![0];
            if (counter.textContent.match('25:00'))
            clearInterval(appLoop);
        }, 1000);
        startResetBtn.addEventListener('click', resetCounter);
    }
    else
    {
        pauseResumeBtn.textContent = "RESUME";
        clearInterval(appLoop);
    }
}

function resetCounter() {
    counter.textContent = '25:00';
    startResetBtn.textContent = "START";
    pauseResumeBtn.textContent = "";
    counter.classList.remove('counter-active');
    clearInterval(appLoop)
    time = new Date("2000 00:25:00");
    startResetBtn.removeEventListener('click', resetCounter);
}

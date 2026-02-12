// take html ele
function FOGet(ele) {return document.querySelector(ele);}

// take answer button index
function FOindexbutton(index) {return FOGet(`.bottom-div button:nth-child(${index})`);}

// style function
function FOStyle(ele,kaam,kiya) {FOGet(ele).style[kaam] = kiya;}

// Save data to localStorage
function saveData(key, value) {localStorage.setItem(key, JSON.stringify(value));}

// Get data from localStorage
function getData(key) {return JSON.parse(localStorage.getItem(key));}

function randomNo(value, add = 0) {return Math.floor(Math.random() * value) + add;}

// find range
function range() {
    let lvl = parseInt(FOGet('#level').textContent, 10);
         if (lvl < 10)    {return 10;}
    else if (lvl < 100)   {return 100;}
    else if (lvl < 1000)  {return 1000;}
    else if (lvl < 10000) {return 10000;}
    else                  {return 0;}
}

// generate random number 
function getnum() {return randomNo(range(),0) + 1;}; 

function withORwithoutPoint(value) {
    if (Math.floor(value) === value) {
        return value;
    } else {
        return value.toFixed(3);
    }
}

// Loading screen ke liye function
function loading(text) {
    let phle = text + '.'
    let badme = text + '..'
    const loadingText = FOGet('#loading-text');
    const timeGap = 400;

    FOGet('.loading-page').style.display = 'flex'
    loadingText.innerText = phle;

    for (let i = 1; i <= 4; i++) {
        setTimeout(() => {
            loadingText.innerText = (i % 2 === 0) ? phle : badme;
        }, timeGap * i);
    }

    setTimeout(() => FOGet('.loading-page').style.display = 'none', timeGap * 5);

    FOGet('#level').innerText = getData("LEVEL") || 1;
    if (!getData("SOUND")) {saveData("SOUND", 100);}
    if (!getData("MUSIC")) {saveData("MUSIC", 100);}
}

if (!getData("LEVEL")) {saveData("LEVEL", 1);}
FOGet('#level').innerText = getData("LEVEL") || 1;

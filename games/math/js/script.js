// reset game including ( level & point )
function resetgame() {
    saveData("LEVEL", 1);
    loading("Reset");
    FOStyle('.reset-div','display','none')
}

// sound and music ki value set karnaa
function volume(ele,key) {saveData(key,FOGet(ele).value)}

// menu button open & close
function menu(div,btn) {
    FOGet('.menu-div').style.display = div;
    FOGet('#menu-btn').style.display = btn;
}

if (!getData("LEVEL")) {saveData("LEVEL", 1);}
if (!getData("SOUND")) {saveData("SOUND", 100);}
if (!getData("MUSIC")) {saveData("MUSIC", 100);}
FOGet('#sound-range').value = getData("SOUND") || 100
FOGet('#music-range').value = getData("MUSIC") || 100
FOGet('#level').innerText = getData("LEVEL") || 1;

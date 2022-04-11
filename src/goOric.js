const crtCanvas = document.getElementById('crtCanvas');
const ctx = crtCanvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
    
const crtCanvasOff = new OffscreenCanvas((1+240+1)*2, (1+224+1)*2);
const ctxOff = crtCanvasOff.getContext('2d');

const infos = document.getElementById('uiPanel');
const infoText = document.getElementById('infoText');

var crtArea = document.getElementById('crtArea');

function resizeArea() {
    var widthToHeight = (240+2) / (224+2);
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;
    var newWidthToHeight = newWidth / newHeight;
    
    if (newWidthToHeight > widthToHeight) {
        newWidth = newHeight * widthToHeight;
        crtArea.style.height = newHeight + 'px';
        crtArea.style.width = newWidth + 'px';
    } else {
        newHeight = newWidth / widthToHeight;
        crtArea.style.width = newWidth + 'px';
        crtArea.style.height = newHeight + 'px';
    }
    
    crtArea.style.marginTop = (-newHeight / 2) + 'px';
    crtArea.style.marginLeft = (-newWidth / 2) + 'px';
    
    crtCanvas.width = newWidth;
    crtCanvas.height = newHeight;
}

var sys = new System(ctx);
sys.init();

const desassB = document.getElementById('toggleDesass');
if (desassB.addEventListener) {
    desassB.addEventListener('click', toggleDesass, false);
} else if (desassB.attachEvent) {
    desassB.attachEvent('onclick', toggleDesass);
}

const soundB = document.getElementById('toggleSound');
if (soundB.addEventListener) {
    soundB.addEventListener('click', soundRsync, false);
} else if (soundB.attachEvent) {
    soundB.attachEvent('onclick', soundRsync);
}

document.addEventListener('keydown', keydownHandler);
document.addEventListener('keyup', keyupHandler);
document.addEventListener('keypress', keypressHandler);

crtCanvas.addEventListener('mousedown', mousedownHandler);

window.addEventListener('resize', resizeArea, false);
window.addEventListener('orientationchange', resizeArea, false);

sys.audioCtx.audioWorklet.addModule('psgWL.js').then(() => {
    sys.psgNode = new AudioWorkletNode(sys.audioCtx, 'psg-processor', { 'numberOfInputs': 0, 'numberOfOutputs': 1, 'outputChannelCount': [1] });
    sys.psg.init(sys.psgNode, sys.audioCtx.sampleRate);
    sys.psgNode.connect(sys.audioCtx.destination);
//    psgEnable = psgNode.parameters.get('enable');
//    console.log('enable ' + psgEnable);
    sys.oldTime = Date.now();
    sys.slice = window.setInterval(doSlice, 20);
    resizeArea();
});

function doSlice() {
    const currentTime = Date.now();
    const elapsedTime = Math.min(50, currentTime - sys.oldTime);
    const delta = ((sys.psg.bufferPtr + sys.audioCtx.sampleRate - sys.psg.states[0]) % sys.audioCtx.sampleRate) >> 12;
    if (delta != sys.prevDelta) {
        sys.prevDelta = delta;
        soundB.style.backgroundColor='rgb('+(23*delta)+','+(255-23*delta)+',0)';
    }
    if (sys.rom0[0] != 0) {
        sys.cpu.doOps(1000*elapsedTime); //elapsedTime);
        if (sys.ula.redraw) {
            sys.ula.display2(0);
            ctxOff.putImageData(sys.imagedata, 0, 0);
            ctx.drawImage(crtCanvasOff, 0, 0, crtCanvas.width, crtCanvas.height);
        }
    }
    sys.oldTime = currentTime;
}

function mousedownHandler(evt) {
    if (infos.style.visibility == 'visible') {
        infos.style.visibility = 'hidden';
    } else {
        infos.style.visibility = 'visible';
    }
}

function toggleDesass() {
    // sys.cpu.desassOk ^= 1;
    // sys.cpu.desassCounter = 0;
    // console.log('toggled ' + cpu.desassOk);
}

function soundRsync() {
    sys.psgNode.port.postMessage('RSC');
}

function keydownHandler(evt)  {
    console.log('Keydown! ' + evt.key + ', ' + evt.which);
    evt.preventDefault();
    if (evt.repeat == false) sys.io.keyDown(evt);
}
 
function keyupHandler(evt)  {
    // console.log("Keyup " + evt.key + ', ' + evt.which);
    sys.io.keyUp(evt);
}
 
function keypressHandler(evt)  {
    console.log("Keypress " + evt.key);
}

// for app state

const getState = () => {
    if (document.visibilityState === 'hidden') {
        return 'hidden';
    }
    if (document.hasFocus()) {
        return 'active';
    }
    return 'passive';
};

// Stores the initial state using the `getState()` function (defined above).
let state = getState();

// Accepts a next state and, if there's been a state change, logs the
// change to the console. It also updates the `state` value defined above.
const logStateChange = (nextState) => {
  const prevState = state;
  if (nextState !== prevState) {
    console.log(`State change: ${prevState} >>> ${nextState}`);
    state = nextState;
  }
};

// These lifecycle events can all use the same listener to observe state
// changes (they call the `getState()` function to determine the next state).
['pageshow', 'focus', 'blur', 'visibilitychange', 'resume'].forEach((type) => {
  window.addEventListener(type, () => logStateChange(getState()), {capture: true});
});

// The next two listeners, on the other hand, can determine the next
// state from the event itself.
window.addEventListener('freeze', () => {
  // In the freeze event, the next state is always frozen.
  logStateChange('frozen');
}, {capture: true});

window.addEventListener('pagehide', (event) => {
  if (event.persisted) {
    // If the event's persisted property is `true` the page is about
    // to enter the page navigation cache, which is also in the frozen state.
    logStateChange('frozen');
  } else {
    // If the event's persisted property is not `true` the page is
    // about to be unloaded.
    window.clearInterval(sys.slice);
    logStateChange('terminated');
  }
}, {capture: true});

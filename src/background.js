chrome.app.runtime.onLaunched.addListener(function() {
  console.log("start");
  chrome.app.window.create('window.html', {
    id: 'oricWindowID',
    innerBounds: {
      width: (1+240+1)*3,
      height: (1+224+1)*3,
      left: 0,
      top: 0
    }
  });
});

chrome.runtime.onInstalled.addListener(function() {
  //  chrome.storage.local.set(object items, function callback);
  });
  
  
chrome.runtime.onSuspend.addListener(function() {
  console.log("suspend");
  if (sys) chrome.app.window.clearInterval(sys.slice);
  //chrome.runtime.clearInterval(slice);
  alert("stop");
  // Do some simple clean-up tasks.
});
  

var tabsCount = 0;

chrome.browserAction.setBadgeBackgroundColor({ color: '#9b59b6' });

chrome.windows.getCurrent(function(w){
  chrome.tabs.getAllInWindow(w.id, function(tabs){
    tabsCount = tabs.length;
    badge(tabsCount);
  })
})

chrome.tabs.onCreated.addListener(function(){
  tabsCount += 1;
  badge(tabsCount);
});

chrome.tabs.onRemoved.addListener(function(){
  tabsCount -= 1;
  badge(tabsCount);
})

function badge(count) {
  chrome.browserAction.setBadgeText({ text: count.toString() });
}

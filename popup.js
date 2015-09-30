var tabId;

input = document.getElementById('input');
input.addEventListener('keyup', match);
input.addEventListener('blur', function(){ this.focus(); });

function match(e) {
  var input = document.getElementById('input');
  chrome.windows.getCurrent(function(w){
    chrome.tabs.getAllInWindow(w.id, function(tabs){
      if (input.value == '') {
        var ftabs = tabs;
      } else {
        var ftabs = new Fuse(tabs, { keys: ['title', 'url'] }).search(input.value);
      }
      console.log(e.keyCode)
      if (e.keyCode == 13) {
        var tId = document.getElementsByClassName('active')[0].id
        chrome.tabs.update(parseInt(tId), { active: true });
        return false;
      }
      if (e.keyCode == 40 || e.keyCode == 9) {
        moveTo('nextSibling');
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
      if (e.keyCode == 38) {
        moveTo('previousSibling');
        return false;
      }
      ul = document.getElementById('tabs')
      ul.innerHTML = '';
      ftabs.forEach(appendTab)
      window.resizeTo(0, ul.offseteight);
    });
  });
};

function appendTab(e, i) {
  var li = document.createElement('li');
  li.id = e.id;
  li.addEventListener('mouseover', hover);
  li.addEventListener('click', click);
  li.innerHTML = '<img src="' + e.favIconUrl + '">' + e.title + '<button>&times;</button>';
  if (i == 0) li.className = 'active';
  li.lastChild.addEventListener('click', close);
  ul.appendChild(li);
}

function moveTo(dir) {
  li = document.getElementsByClassName('active')[0], l = li[dir];
  if (l) {
    li.className = '';
    l.className = 'active';
    window.scrollTo(0, li.offsetTop)
  }
}

function hover(){
  var a = document.getElementsByClassName('active')[0];
  a.className = '';
  this.className = 'active';
}

function click(){
  chrome.tabs.update(parseInt(this.id), { active: true });
}


function close(e){
  li = this.parentNode;
  chrome.tabs.remove(parseInt(li.id));
  li.style.height = 0;
  e.preventDefault();
  e.stopPropagation();
  return false;
}

chrome.commands.onCommand.addListener(function(command){
  if (command == 'close-tab') {
    li = document.getElementsByClassName('active')[0];
    chrome.tabs.remove(parseInt(li.id));
    li.style.height = 0;
    document.getElementById('input').focus();
    console.log(document.getElementById('input'))
  }
})

match(new Event('click'));

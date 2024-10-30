/*  Collapse Functions, version 3.0
 *
 *--------------------------------------------------------------------------*/
String.prototype.trim = function() {
  return this.replace(/^\s+|\s+$/g,"");
}

function createCookie(name,value,days) {
  if (days) {
    var date = new Date();
    date.setTime(date.getTime()+(days*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
  } else {
    var expires = "";
  }
  document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') {
      c = c.substring(1,c.length);
    }
    if (c.indexOf(nameEQ) == 0) {
      return c.substring(nameEQ.length,c.length);
    }
  }
  return null;
}

function eraseCookie(name) {
  createCookie(name,"",-1);
}

function addExpandCollapseNew(widgetRoot, expandSym, collapseSym, accordion) {
	widgetRoot.querySelectorAll( 'span.collapsing-pages').forEach(item => {
		item.addEventListener('click', event => {
			if (accordion==1) {
				let theSpan = item.parentElement.parentElement.querySelector('span.collapse');
				let theDiv = theSpan.parentElement.querySelector('div');
				theDiv.style.display = 'none';
				theSpan.classList.remove('collapse');
				theSpan.classList.add('expand');
				let divId = theDiv.getAttribute("id");
				createCookie(divId, 0, 7);
			  widgetRoot.querySelectorAll( '.expand .sym').forEach(item => { item.innerHTML = expandSym;});
			}
			expandCollapsePage(item, expandSym, collapseSym, accordion );
			return false;
		})
	});
}

function expandCollapsePage(symbol, expandSym, collapseSym, accordion ) {
		let newDiv = symbol.parentElement.querySelector('div');
		let divId = newDiv.getAttribute("id");

		// calling again here to add to sub-pages, which may not have been in the DOM before
		//addExpandCollapseNew( newDiv, expandSym, collapseSym, accordion );
	//newDiv.style.maxHeight = newDiv.scrollHeight + "px";
	if (symbol.classList.contains('expand')) {
		newDiv.style.display = 'block';
		symbol.classList.remove('expand');
		symbol.classList.add('collapse');
		symbol.querySelector('.sym').innerHTML = collapseSym;
		createCookie(divId, 1, 7);
	} else {
		newDiv.style.display = 'none';
		symbol.classList.remove('collapse');
		symbol.classList.add('expand');
		symbol.querySelector('.sym').innerHTML = expandSym;
		createCookie(divId, 0, 7);
	}
}


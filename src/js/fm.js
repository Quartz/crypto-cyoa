var PARENT_DOMAIN = "qz.com";
//var PARENT_DOMAIN = "qz.dev";
//var PARENT_DOMAIN = "quartz.ly";
var interactiveEl = document.getElementById("interactive-content")
var FM = null;
var propCallback;

/**
 * Setup Frame Messenger and connect to parent.
 */
function setupFrameMessenger(options) {
	// Production: use frame messenging (will error if no parent frame)
	local_prod_test = window.location.search.toString().indexOf("e=1") > -1
	if (ENV == 'prod' || local_prod_test) {
		if(local_prod_test) {
			PARENT_DOMAIN = "localhost:3000"
		}
		FM = frameMessager(
			Object.assign({},
				{parentDomain : PARENT_DOMAIN},
				options
			)
		);

		document.body.style.overflow = "hidden";
	// Test environment: no frame messenging
	} else {
		document.body.style.border = "#ff8080";
	}
}

/**
 * Compute the height of the interactive.
 */
/**
 * Get height of window including margin
 */
function _getDocumentHeight() {
  var height = interactiveEl.offsetHeight;
  var style = getComputedStyle(interactiveEl);

  return height + parseInt(style.marginTop) + parseInt(style.marginBottom);
}

/**
 * Update parent height.
 */
function updateHeight (height) {
	if (!FM) {
		return;
	}

	height = height || _getDocumentHeight();

	FM.triggerMessage("QZParent", "child:updateHeight", {
		height : height
	});

	return;
}

/**
 * Update parent hash.
 */
function updateHash (hash) {
	if (!FM) {
		window.location.hash = hash;
	} else {
		FM.triggerMessage("QZParent", "child:updateHash", {
			hash : hash
		});
	}
	return;
}

/**
 * Read parent hash.
 */
function getWindowProps () {
	if (!FM) {
		var frame = document.getElementById("interactive-content")
		var frame_bb = frame.getBoundingClientRect()

		var clientWidth = window.innerWidth;
		var clientHeight = window.innerHeight;

		return propCallback({
			action: "parent:readWindowProps", 
			fromId: "QZParent", 
			toId: "interactive-local", 
			data: {
				windowProps: {
					clientDimensions: {
						width: clientWidth,
						height: clientHeight,
					},
					pageOffset: {
						x: window.scrollX,
						y: window.scrollY
					},
					uri: {
						hash: window.location.hash,
						href: window.location.href,
						origin: window.location.origin,
						pathname: window.location.pathname
					}
				}
			}
		});
	}

	FM.triggerMessage("QZParent", "child:getWindowProps");

	return;
}

function setupItemScroll(callback) {
	if(!FM) {
		var frame = document.getElementById("interactive-content")

		window.onscroll = function(){
			var rect = frame.getBoundingClientRect();
			var windowHeight = window.innerHeight;

			callback({
				"action":"itemWell:scroll",
				"data":{
					"frameTop":{
					"nav": rect.top,
					"window": windowHeight - rect.top
				},
				"frameBottom":{
					"nav": rect.bottom,
					"window": windowHeight - rect.bottom
				},
				"scrollDepth": document.body.scrollTop,
				"viewable":true,
					"visible":true
				},
				"fromId":"QZParent",
				"toId":"interactive-local"
			})
		}
	} else {
		FM.onMessage("itemWell:scroll", callback)
	}
}

/**
 * Set up a callback that will handle incoming hash data
 */
function setupReadWindow(callback) {
	if (!FM) {
		propCallback = callback;
	} else {
		FM.onMessage("parent:readWindowProps", callback);
	}
}

/**
 * Resize the parent to match the new child height.
 */
function resize () {
  updateHeight(_getDocumentHeight());
}

/**
 * Get height of window including margin
 */
function _getWindowHeight() {
  var height = interactiveEl.offsetHeight;
  var style = getComputedStyle(interactiveEl);

  return height + parseInt(style.marginTop) + parseInt(style.marginBottom);
}

/**
 * Scroll the parent window to a given location.
 *
 * Call like this:
 * fm.scrollToPosition($("#scrollToThisDiv").offset().top,500)
 *
 * Where 500 is the duration of the scroll animation
 */
function scrollToPosition (position,duration) {
	if (!FM) {
		$("html,body").animate({
			scrollTop: position
		}, duration);
	} else {
		FM.triggerMessage("QZParent", "child:scrollToPosition", {
			position : position,
			duration : 500
		});
	}
}

/**
 * Get a reference to the parent window.
 */
function getParentWindow () {
	return FM.triggerMessage("QZParent", "child:getWindow");
}

// setupFrameMessenger();

module.exports = {
	setup: setupFrameMessenger,
	updateHeight: updateHeight,
	resize: resize,
	scrollToPosition: scrollToPosition,
	getParentWindow: getParentWindow,
	updateHash: updateHash,
	getWindowProps: getWindowProps,
	setupReadWindow: setupReadWindow,
	setupItemScroll: setupItemScroll
};

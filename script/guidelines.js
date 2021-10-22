var version="30";

function titleToPathFrag (title) {
	return title.toLowerCase().replace(/[\s,]+/g, "-").replace(/[\(\)]/g, "");
}

function findHeading(el) {
	return el.querySelector('h1') || el.querySelector('h2') || el.querySelector('h3') || el.querySelector('h4') || el.querySelector('h5') || el.querySelector('h6');
}

function findFirstTextChild(el) {
	var children = el.childNodes;
	for (i = 0; i < children.length; i++) {
		if (children[i].nodeType == 3) {
			return children[i];
			break;
		}
	}
}

function textNoDescendant(el) {
	var textContent = "";
	el.childNodes.forEach(function(node) {
		if (node.nodeType == 3) textContent += node.textContent;
	})
	return textContent;
}

function linkHowTo() {
	var howtoBaseURI = "https://www.w3.org/WAI/GL/WCAG3/2020/how-tos/";
	//if (respecConfig.specStatus == "ED") understandingBaseURI = "../../understanding/";
	//else understandingBaseURI = "https://www.w3.org/WAI/WCAG" + version + "/Understanding/";
	document.querySelectorAll('.guideline').forEach(function(node){
		//this is brittle, depends on how respec does the heading
		var heading = textNoDescendant(findHeading(node));
		var pathFrag = titleToPathFrag(heading);
		var el = document.createElement("span");
		el.innerHTML = " <a href=\"" + howtoBaseURI + pathFrag + "/\" class=\"howto-link\">[" + heading + " <span>how-to</span>]</a>";
		node.querySelector("p.guideline-text").append(el);
	})
}

function addGuidelineMarkers() {
	document.querySelectorAll('.guideline').forEach(function(node){
		var guidelineText = node.querySelector("p");
		guidelineText.innerHTML = "<span class=\"inserted\">Guideline: </span>" + guidelineText.innerHTML;
	})
}

function addOutcomeMarkers() {
	document.querySelectorAll('.outcome').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var outcomeHeader = findHeading(node);
		outcomeHeader.innerHTML = "<span class=\"inserted\">" + textNoDescendant(parentHeader) + " outcome: </span>" + outcomeHeader.innerHTML;
		
		node.classList.add("notoc");
	})
}

function addMethodMarkers() {
	document.querySelectorAll('.methods').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var methodHeader = node.querySelector('summary');
		methodHeader.innerHTML = "Methods for <q>" + textNoDescendant(parentHeader).toLowerCase() + "</q>";
	})
}

function addFailureMarkers() {
	document.querySelectorAll('.failures').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var failureHeader = node.querySelector('summary');
		failureHeader.innerHTML = "Critical errors for <q>" + textNoDescendant(parentHeader).toLowerCase() + "</q>";
	})
}

function addRatingMarkers() {
	document.querySelectorAll('.rating').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var sectionHeader = node.querySelector('summary');
		sectionHeader.innerHTML = "Rating for <q>" + textNoDescendant(parentHeader).toLowerCase() + "</q>";
		
		var caption = node.querySelector('caption');
		caption.innerHTML = "Rating scale for <q>" + textNoDescendant(parentHeader).toLowerCase() + "</q>";
	})
}

function addSummaryMarkers() {
	document.querySelectorAll('.summary').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var summaryHeader = node.querySelector('summary');
		summaryHeader.innerHTML = "Simplified summary for " + textNoDescendant(parentHeader);
		
		var el = document.createElement("p");
		el.className = "summaryEnd";
		el.innerHTML = "~ End of summary for " + textNoDescendant(parentHeader) + " ~";
		node.appendChild(el);
		
		node.setAttribute("role", "region");
	})
}


var statusBlocks = [{
	className: '.status-placeholder',
	label: 'Placeholder',
	urlHash: '#placeholder',
	text: 'We are exploring one or more possible directions for this content.'
}, {
	className: '.status-exploratory',
	label: 'Exploratory',
	urlHash: '#exploratory',
	text: 'We are exploring one or more possible directions for this content.'
}, {
	className: '.status-maturing',
	label: 'Maturing',
	urlHash: '#maturing',
	text: 'We have high confidence in the direction and some confidence in the details.'
}, {
	className: '.status-mature',
	label: 'Mature',
	urlHash: '#mature',
	text: 'We have high confidence in the direction and moderate confidence in the details.'
}, {
	className: '.status-stable',
	label: 'Stable',
	urlHash: '#stable',
	text: 'Content is believed to be ready to become a W3C Recommendation.'
}]

function addStatusMarkers() {
	statusBlocks.forEach(function (statusBlock) {
		var statusSections = document.querySelectorAll(statusBlock.className);
		statusSections.forEach(function (section) {
			var div = document.createElement('div');
			div.setAttribute('class', 'addition');
			div.innerHTML = '<a href="https://www.w3.org/WAI/GL/wiki/AG_process'
			+ statusBlock.urlHash
			+ '" class="status-link">Section status: <strong>'
			+ statusBlock.label
			+ '</strong></a>.'
			+ statusBlock.text;
			// Insert div after the first heading:
			var firstHeading = section.querySelector('h1,h2,h3,h4,h5,h6');
			firstHeading.parentNode.insertBefore(div, firstHeading.nextSibling);
		})
	});
}

function termTitles() {
	// put definitions into title attributes of term references
	document.querySelectorAll('.internalDFN').forEach(function(node){
		node.title = document.querySelector(node.href.substring(node.href.indexOf('#'))).parentNode.nextElementSibling.firstElementChild.textContent.trim().replace(/\s+/g,' ');
	});	
}

function removeDraftMethodLinks() {
	document.querySelectorAll('.method-link').forEach(function(node){
		uri = node.href;
		if (!uri.startsWith("https://www.w3.org")) {
			node.parentElement.innerHTML = node.textContent;	
		}
	});
}

function adjustNormativity() {
	document.querySelectorAll('body > section').forEach(function(node){
		if (node.classList.contains("informative")) {
			var normativeStatement = node.querySelector('p');
			normativeStatement.classList.add("informative-statement");
			normativeStatement.innerHTML = "<em>This section (with its subsections) provides advice only and does not specify guidelines, meaning it is <a href=\"#dfn-informative\" class=\"internalDFN\" data-link-type=\"dfn\">informative</a> or non-normative.</em>";
		} else {
			var el = document.createElement("p");
			el.className = "normative-statement";
			el.innerHTML = "<em>This section (with its subsections) provides requirements which must be followed to <a>conform</a> to the specification, meaning it is <a href=\"#dfn-normative\" class=\"internalDFN\" data-link-type=\"dfn\">normative</a>.</em>";
			node.insertBefore(el, findHeading(node).nextSibling);
		}
	});
}

function adjustDfnData() {
	document.querySelectorAll('dfn').forEach(function(node){
		var datalt = node.getAttributeNode("data-lt");
		var curVal = node.getAttribute("data-lt");
		node.setAttribute("data-lt", node.textContent + (curVal == "" ? "|" : ""));
	});
}

// scripts before Respec has run
function preRespec() {
	adjustDfnData();
	addGuidelineMarkers();
	linkHowTo();
	addOutcomeMarkers();
	addMethodMarkers();
	addFailureMarkers();
	addRatingMarkers();
	addSummaryMarkers();
	addStatusMarkers();
}

// scripts after Respec has run
function postRespec() {
	adjustNormativity();
	termTitles();
	removeDraftMethodLinks();
}

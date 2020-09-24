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
		var el = document.createElement("p");
		el.setAttribute("class", "howto-link");
		el.innerHTML = "<a href=\"" + howtoBaseURI + pathFrag + "/\">" + heading + " <span>how-to</span></a>";
		node.insertBefore(el, node.querySelector('section'));
	})
}

function addGuidelineMarkers() {
	document.querySelectorAll('.guideline').forEach(function(node){
		var guideline = node.querySelector('p');
		guideline.innerHTML = "Guideline: <strong>" + guideline.innerHTML + "</strong>";
	})
}

function addOutcomeMarkers() {
	document.querySelectorAll('.outcome').forEach(function(node){
		var heading = textNoDescendant(findHeading(node.parentElement));
		var outcome = findHeading(node);
		outcome.innerHTML = heading + " outcome: <strong>" + outcome.innerHTML + "</strong>";
	})
}

function addMethodMarkers() {
	document.querySelectorAll('.methods').forEach(function(node){
		var heading = findHeading(node.parentElement).querySelector('strong').textContent;
		var sectionHeader = findHeading(node);
		sectionHeader.innerHTML = "Methods for <strong>" + heading + "</strong>";
	})
}

function addFailureMarkers() {
	document.querySelectorAll('.failures').forEach(function(node){
		var heading = findHeading(node.parentElement).querySelector('strong').textContent;
		var sectionHeader = findHeading(node);
		sectionHeader.innerHTML = "Critical failures for <strong>" + heading + "</strong>";
	})
}

function addRatingMarkers() {
	document.querySelectorAll('.rating').forEach(function(node){
		var heading = findHeading(node.parentElement).querySelector('strong').textContent;
		var sectionHeader = findHeading(node);
		sectionHeader.innerHTML = "Rating for <strong>" + heading + "</strong>";
		
		var caption = node.querySelector('caption');
		caption.innerHTML = "Rating scale for " + heading;
	})
}

function addSummaryMarkers() {
	document.querySelectorAll('.summary').forEach(function(node){
		var heading = textNoDescendant(findHeading(node.parentElement));
		var el = document.createElement("p");
		el.className = "summaryEnd";
		el.innerHTML = "~ End of summary for " + heading + " ~";
		node.appendChild(el);
		
		node.setAttribute("role", "region");
	})
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

function updateSummaryTitles() {
	document.querySelectorAll('.summary').forEach(function(node){
		var heading = findHeading(node.parentElement).childNodes[1].textContent;
		var header = findHeading(node);
		header.childNodes[0].textContent = "Summary for " + heading;
	});
}

// scripts after Respec has run
document.respecIsReady.then(() => {
	termTitles();
	addGuidelineMarkers();
	linkHowTo();
	addOutcomeMarkers();
	addMethodMarkers();
	addFailureMarkers();
	addRatingMarkers();
	addSummaryMarkers();
	updateSummaryTitles();
	removeDraftMethodLinks();
});

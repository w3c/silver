var version="30";

function titleToPathFrag (title) {
	return title.toLowerCase().replace(/[\s,]+/g, "-").replace(/[\(\)]/g, "");
}

function linkHowTo() {
	var howtoBaseURI = "https://www.w3.org/WAI/GL/WCAG3/2020/how-tos/";
	//if (respecConfig.specStatus == "ED") understandingBaseURI = "../../understanding/";
	//else understandingBaseURI = "https://www.w3.org/WAI/WCAG" + version + "/Understanding/";
	document.querySelectorAll('.guideline').forEach(function(node){
		//this is brittle, depends on how respec does the heading
		var heading = node.firstElementChild.childNodes[1].textContent;
		var pathFrag = titleToPathFrag(heading);
		var el = document.createElement("p");
		el.setAttribute("class", "howto-link");
		el.innerHTML = "<a href=\"" + howtoBaseURI + pathFrag + "/\">" + heading + " <span>how-to</span></a>";
		node.insertBefore(el, node.children[1]);
	})
}

function addGuidelineMarkers() {
	document.querySelectorAll('.guideline').forEach(function(node){
		var guideline = node.querySelector('p');
		guideline.innerHTML = "<strong>Guideline:</strong> " + guideline.innerHTML;
	})
}

function addOutcomeMarkers() {
	document.querySelectorAll('.outcome').forEach(function(node){
		var outcome = node.querySelector('p');
		outcome.innerHTML = "<strong>Outcome:</strong> " + outcome.innerHTML;
	})
}

function addOutcomeIndicators() {
	document.querySelectorAll('.guideline').forEach(function(node){
		var guidelineName = node.firstElementChild.childNodes[1].textContent;
		var firstOutcome = node.querySelector("section");
		var el = document.createElement("p");
		el.innerHTML = "<strong>Outcomes for " + guidelineName + ":</strong>";
		node.insertBefore(el, firstOutcome);
	})
}

function addSummaryMarkers() {
	document.querySelectorAll('.summary').forEach(function(node){
		var el = document.createElement("p");
		el.innerHTML = "<strong>Simplified Summary:</strong>";
		node.insertBefore(el, node.childNodes[0]);
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
		link = node.querySelector('a');
		if (link) {
			uri = link.href;
			if (!uri.startsWith("https://www.w3.org")) {
				node.innerHTML = link.textContent;	
			}
		}
	});
}

// scripts after Respec has run
document.respecIsReady.then(() => {
	termTitles();
	addGuidelineMarkers();
	addOutcomeMarkers();
	addOutcomeIndicators();
	addSummaryMarkers();
	linkHowTo();
	removeDraftMethodLinks();
});

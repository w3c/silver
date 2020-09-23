var version="30";

function titleToPathFrag (title) {
	return title.toLowerCase().replace(/[\s,]+/g, "-").replace(/[\(\)]/g, "");
}

function findHeading(el) {
	return el.querySelector('h1') || el.querySelector('h2') || el.querySelector('h3') || el.querySelector('h4') || el.querySelector('h5') || el.querySelector('h6');
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

function addMethodIndicators() {
	document.querySelectorAll('.outcome').forEach(function(node){
		var outcome = node.querySelector('h4');
		var methodList = node.querySelector('ol');
		var el = document.createElement("p");
		el.innerHTML = "<strong>Methods for " + outcome.innerHTML + ":</strong>";
		node.insertBefore(el, methodList);
	})
}

function addFailureMarkers() {
	document.querySelectorAll('.failures').forEach(function(node){
		var heading = findHeading(node.parentElement).childNodes[1].textContent;
		var sectionHeader = node.childNodes[1];
		sectionHeader.childNodes[0].textContent = "Critical failures for " + heading;
	})
}

function addRatingMarkers() {
	document.querySelectorAll('.rating').forEach(function(node){
		var heading = findHeading(node.parentElement).childNodes[1].textContent;
		var sectionHeader = node.childNodes[1];
		sectionHeader.childNodes[0].textContent = "Rating for " + heading;
		
		var caption = node.querySelector('caption');
		caption.innerHTML = "Rating scale for " + heading;
	})
}

function addSummaryMarkers() {
	document.querySelectorAll('.summary').forEach(function(node){
		var heading = findHeading(node.parentElement).childNodes[1].textContent;
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
	addOutcomeMarkers();
	addOutcomeIndicators();
	addMethodIndicators();
	addFailureMarkers();
	addRatingMarkers();
	addSummaryMarkers();
	updateSummaryTitles();
	linkHowTo();
	removeDraftMethodLinks();
});

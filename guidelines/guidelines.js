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

function linkOutcome() {
	var outcomeBaseURI = "https://www.w3.org/WAI/GL/WCAG3/2020/outcomes/";
	//if (respecConfig.specStatus == "ED") understandingBaseURI = "../../understanding/";
	//else understandingBaseURI = "https://www.w3.org/WAI/WCAG" + version + "/Understanding/";
	document.querySelectorAll('.outcome').forEach(function(node){
		//this is brittle, depends on how respec does the heading
		var heading = textNoDescendant(findHeading(node));
		var pathFrag = titleToPathFrag(heading);
		var el = document.createElement("p");
		el.innerHTML = " <a href=\"" + outcomeBaseURI + pathFrag + "\" class=\"outcome-link\"><span>Outcome, details, and methods for </span>" + heading + "</a>";
		node.insertBefore(el, node.querySelector("details"));
		
		node.classList.add("notoc");
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
		var insertion = document.createElement("span");
		insertion.classList.add("inserted");
		insertion.innerHTML = " (outcome for <q>" + textNoDescendant(parentHeader) + "</q>)";
		outcomeHeader.insertBefore(insertion, outcomeHeader.querySelector(".self-link"));
	})
}

function addCategoryMarkers() {
	document.querySelectorAll('.categories').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var sectionHeader = node.querySelector('summary');
		sectionHeader.innerHTML = "Functional categories for <q>" + textNoDescendant(parentHeader) + "</q>";
	})
}

function addErrorMarkers() {
	document.querySelectorAll('.errors').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var errorHeader = node.querySelector('summary');
		errorHeader.innerHTML = "Critical errors for <q>" + textNoDescendant(parentHeader) + "</q>";
	})
}

function addRatingMarkers() {
	document.querySelectorAll('.rating').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var sectionHeader = node.querySelector('summary');
		sectionHeader.innerHTML = "Rating for <q>" + textNoDescendant(parentHeader) + "</q>";
		
		var table = node.querySelector('table');
		table.setAttribute("summary", "Rating scale for \"" + textNoDescendant(parentHeader) + "\"");
		table.querySelector("caption").remove();
	})
}

function addSummaryMarkers() {
	document.querySelectorAll('.summary').forEach(function(node){
		var parentHeader = findHeading(node.parentElement);
		var summaryHeader = node.querySelector('summary');
		var extraTitle = "";
		if (summaryHeader.textContent.toLowerCase() != "summary") extraTitle = " - " + summaryHeader.textContent;
		summaryHeader.innerHTML = "Plain language summary of <q>" + textNoDescendant(parentHeader) + "</q>" + extraTitle;
		
		var el = document.createElement("p");
		el.className = "summaryEnd";
		el.innerHTML = "End of summary for <q>" + textNoDescendant(parentHeader) + "</q>";
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

function adjustNormativity() {
	document.querySelectorAll('body > section').forEach(function(node){
		if (node.classList.contains("informative")) {
			var normativeStatement = node.querySelector('p');
			normativeStatement.classList.add("informative-statement");
			normativeStatement.innerHTML = "<em>This section (with its subsections) provides advice only and does not specify guidelines, meaning it is <a href=\"#dfn-informative\" class=\"internalDFN\" data-link-type=\"dfn\">informative</a> or non-normative.</em>";
		} else if (node.id != "abstract" && node.id != "sotd" && !node.classList.contains("appendix")) {
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

function alternateFloats() {
	var order = "odd";
	document.querySelectorAll(".figure-float").forEach(function(node){
		if (order == "odd") {
			node.classList.add("figure-float-odd");
			order = "even";
		} else {
			node.classList.add("figure-float-even");
			order = "odd";
		}
	});
}

function edNotePermalinks() {
	document.querySelectorAll(".note").forEach(function(node){
		var id = node.id;
		var heading = node.querySelector(".marker");
		var permaLink = document.createElement("a");
		permaLink.classList.add("self-link");
		permaLink.setAttribute("aria-label", "§");
		permaLink.setAttribute("href", "#" + id);
		heading.appendChild(permaLink);
	});
}

// somewhere along the chain image sizes are being added where I don't want them, doesn't happen locally
function removeImgSize() {
	document.querySelectorAll("img").forEach(function(node){
		if (node.getAttribute("src").endsWith(".svg")) {
			node.removeAttribute("width");
			node.removeAttribute("height");
		}
	});
}

// scripts before Respec has run
function preRespec() {
	adjustDfnData();
	addGuidelineMarkers();
	linkHowTo();
	linkOutcome();
	addCategoryMarkers();
	addErrorMarkers();
	addRatingMarkers();
	addSummaryMarkers();
	//alternateFloats();
}

// scripts after Respec has run
function postRespec() {
	addOutcomeMarkers();
	adjustNormativity();
	termTitles();
	removeDraftMethodLinks();
	edNotePermalinks();
	removeImgSize();
}

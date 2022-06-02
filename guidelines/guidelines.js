var version="30";

function titleToPathFrag (title) {
	return title.toLowerCase().replace(/[\s,]+/g, "-").replace(/[\(\)]/g, "");
}

function findHeading(el) {
	return el.querySelector('h1, h2, h3, h4, h5, h6');
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

function sentenceCase(str) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

function pathToName(path) {
	return sentenceCase(path.replace(/-/g, " "));
}

function linkHowTo() {
	var howtoBaseURI = "https://www.w3.org/WAI/GL/WCAG3/" + new Date().getFullYear() + "/how-tos/";
	//if (respecConfig.specStatus == "ED") understandingBaseURI = "../../understanding/";
	//else understandingBaseURI = "https://www.w3.org/WAI/WCAG" + version + "/Understanding/";
	document.querySelectorAll('.guideline').forEach(function(node){
		//this is brittle, depends on how respec does the heading
		var heading = textNoDescendant(findHeading(node));
		var pathFrag = titleToPathFrag(heading);
		var el = document.createElement("span");
		el.innerHTML = " <a href=\"" + howtoBaseURI + pathFrag + "/\" class=\"howto-link\">" + heading + " <span>how-to</span></a>";
		node.querySelector("p.guideline-text").append(el);
	})
}

function linkOutcome() {
	var outcomeBaseURI = "https://www.w3.org/WAI/GL/WCAG3/" + new Date().getFullYear() + "/outcomes/";
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
		table.querySelector("caption").remove();
		var caption = document.createElement("caption");
		caption.innerHTML = "Rating scale for \"" + textNoDescendant(parentHeader) + "\"";
		table.insertBefore(caption, table.firstChild);
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
	})
}

function addNoteMarkers() {
	document.querySelectorAll(".note").forEach(function(node){
		var el = document.createElement("p");
		el.className = "summaryEnd";
		el.innerHTML = "End of note";
		node.appendChild(el);
	})
}

var statusLabels = {
	placeholder: 'We will be addressing this topic.',
	exploratory: 'We are exploring one or more possible directions for this content.',
	developing: 'We have high confidence in the direction and some confidence in the details.',
	refining: 'We have high confidence in the direction and moderate confidence in the details.',
	mature: 'We believe the content is ready to become a W3C Recommendation.',
}

function addStatusMarkers() {
	var statusKeys = Object.keys(statusLabels);
	statusKeys.forEach(function (status) {
		var selector = '[data-status="' + status + '"]';
		var statusSections = document.querySelectorAll(selector);
		statusSections.forEach(function (section) {
			var div = document.createElement('div');
			div.setAttribute('class', 'addition sticky');
			div.innerHTML = '<a href="#section-status-levels" class="status-link">Section status: <strong>'
				+ sentenceCase(status)
				+ '</strong></a>.'
				+ statusLabels[status]
				// + ' See the Editor&#39;s note for details.';

			// Insert div after the first heading:
			var firstHeading = section.querySelector('h1,h2,h3,h4,h5,h6');
			firstHeading.parentNode.insertBefore(div, firstHeading.nextSibling);
		})
	});
}

function termTitles() {
	// put definitions into title attributes of term references
	document.querySelectorAll('.internalDFN').forEach(function(node){
		var dfn = document.querySelector(node.href.substring(node.href.indexOf('#')));
		if (dfn.parentNode.name == "dt") node.title = dfn.parentNode.nextElementSibling.firstElementChild.textContent.trim().replace(/\s+/g,' ');
		else if (dfn.title) node.title=dfn.title;
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
			var heading = findHeading(node);
			while (heading.parentNode !== node) {
				heading = heading.parentNode;
			}
			node.insertBefore(el, heading.nextSibling);
		}
	});
}

function adjustDfnData() {
	document.querySelectorAll('dfn').forEach(function(node){
		var curVal = node.getAttribute("data-lt");
		if (curVal == null) curVal = "";
		node.setAttribute("data-lt", node.textContent + (curVal == "" ? "" : "|") + curVal);
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

function outputJson() {
	params = new URLSearchParams(window.location.search);
	if (params.get("json") != null) {
		var result = new Object();
		result.guidelines = new Array();
		document.querySelectorAll(".guideline").forEach(function(glnode) {
			var gl = {
				id: titleToPathFrag(findFirstTextChild(findHeading(glnode)).textContent),
				name: findFirstTextChild(findHeading(glnode)).textContent,
				guideline: findFirstTextChild(glnode.querySelector("p")).textContent
			};
			gl.outcomes = new Array();
			glnode.querySelectorAll(".outcome").forEach(function(ocnode) {
				var ocid = titleToPathFrag(findFirstTextChild(findHeading(ocnode)).textContent);
				var oc = {
					id: ocid,
					name: findFirstTextChild(findHeading(ocnode)).textContent,
					outcome: findFirstTextChild(ocnode.querySelector("p")).textContent,
					methods: loadMethods(ocid)
				}
				gl.outcomes.push(oc);
			});
			result.guidelines.push(gl);
		});
		
	    var a = document.createElement("a");
	    var file = new Blob([JSON.stringify(result)], {type: "application/json"});
	    a.href = URL.createObjectURL(file);
	    a.download = "wcag3.json";
	    a.click();
	}
	
	function loadMethods(path) {
		var returnVal;
		var ocpath = "../outcomes/" + path + ".html";
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				methodList = new Array();
				xml = xhttp.responseXML;
				xml.querySelectorAll(".method-link").forEach(function(node) {
					var methodid = node.href.match(/\/([a-z-]*)\/$/)[1]; 
					var method = {
						id: methodid,
						name: pathToName(methodid),
						method: node.textContent
					}
					methodList.push(method);
				});
				returnVal = methodList;
			}
		};
		xhttp.open("GET", ocpath, false);
		xhttp.overrideMimeType("text/xml");
		xhttp.send();

		return returnVal;
	}
}

function loadDoc(path) {
}

function authorToPM() {
	document.querySelectorAll("div.head dt").forEach(function(node){
    if (node.textContent.trim() == "Authors:" || node.textContent.trim() == "Author:") node.textContent = "Project Manager:";
  });
}

function moveStatusFilterToToc() {
	var button = document.querySelector('#status-filter');
	var button_parent = button.parentNode;
	var toc = document.querySelector('#toc');
	var toc_list = toc.querySelector('ol');
	toc.insertBefore(button_parent.removeChild(button), toc_list);
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
	addStatusMarkers();
	//alternateFloats();
}

// scripts after Respec has run
function postRespec() {
	authorToPM();
	addOutcomeMarkers();
	adjustNormativity();
	termTitles();
	removeDraftMethodLinks();
	edNotePermalinks();
	addNoteMarkers();
	removeImgSize();
	outputJson();
	moveStatusFilterToToc();
}

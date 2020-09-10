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

function addTextSemantics() {
	// put brackets around the change marker
	document.querySelectorAll('p.change').forEach(function(node){
		var change = node.textContent;
		node.textContent = "[" + change + "]";
	})
	// put level before and parentheses around the conformance level marker
	document.querySelectorAll('p.conformance-level').forEach(function(node){
		var level = node.textContent;
		node.textContent = "(Level " + level + ")";
	})
	// put principle in principle headings
	document.querySelectorAll('section.sc h2 bdi.secno').forEach(function(node){
		var num = node.textContent;
		node.textContent = "Principle " + num;
	})
	// put guideline in GL headings
	document.querySelectorAll('section.guideline h3 bdi.secno').forEach(function(node){
		var num = node.textContent;
		node.textContent = "Guideline " + num;
	})
	// put success criterion in SC headings
	document.querySelectorAll('section.sc h4 bdi.secno').forEach(function(node){
		var num = node.textContent;
		node.textContent = "Success Criterion " + num;
	})
}

function termTitles() {
	// put definitions into title attributes of term references
	document.querySelectorAll('.internalDFN').forEach(function(node){
		node.title = document.querySelector(node.href.substring(node.href.indexOf('#'))).parentNode.nextElementSibling.firstElementChild.textContent.trim().replace(/\s+/g,' ');
	});	
}

// scripts after Respec has run
document.respecIsReady.then(() => {
	termTitles();
	linkHowTo();
});

var respecConfig = {
	// embed RDFa data in the output
	trace: true,
	doRDFa: '1.1',
	includePermalinks: true,
	permalinkEdge: true,
	permalinkHide: false,
	// specification status (e.g., WD, LC, NOTE, etc.). If in doubt use ED.
	specStatus: "ED",
	noRecTrack: true,
	//crEnd:                "2012-04-30",
	//perEnd:               "2013-07-23",
	//publishDate:          "2013-08-22",
	diffTool: "http://www.aptest.com/standards/htmldiff/htmldiff.pl",
	
	// the specifications short name, as in https://www.w3.org/TR/short-name/
	shortName: "wcag-3.0-requirements",
	
	
	// if you wish the publication date to be other than today, set this
	// publishDate:  "2009-08-06",
	copyrightStart: "2021",
	license: "w3c-software-doc",
	
	// if there a publicly available Editors Draft, this is the link
	edDraftURI: "https://w3c.github.io/silver/requirements/",
	
	// if this is a LCWD, uncomment and set the end of its review period
	// lcEnd: "2012-02-21",
	
	// editors, add as many as you like
	// only "name" is required
	editors:[ {
		name: "Jeanne Spellman",
		mailto: "jspellman@spellmanconsulting.com",
		company: "TetraLogical",
		companyURI: "https://tetralogical.com/",
		w3cid: 42417
	}, {
		name: "Shawn Lauriat",
		mailto: "lauriat@google.com",
		company: "Google, Inc.",
		companyURI: "https://www.google.com/",
		w3cid: 90646
	}, {
				name: "Michael Cooper",
		mailto: "cooper@w3.org",
		company: "W3C",
		companyURI: "https://www.w3.org/",
		w3cid: 34017
	}],
	
	// authors, add as many as you like.
	// This is optional, uncomment if you have authors as well as editors.
	// only "name" is required. Same format as editors.
	
	//authors:  [
	//    { name: "Your Name", url: "http://example.org/",
	//      company: "Your Company", companyURI: "http://example.com/" },
	//],
	
	/*
	alternateFormats: [
	{ uri: 'aria-diff.html', label: "Diff from Previous Recommendation" } ,
	{ uri: 'aria.ps', label: "PostScript version" },
	{ uri: 'aria.pdf', label: "PDF version" }
	],
	 */
	
	// errata: 'https://www.w3.org/2010/02/rdfa/errata.html',
	
	group: "ag",
	github: "w3c/silver",

	maxTocLevel: 4,
	
	//localBiblio: biblio,
};

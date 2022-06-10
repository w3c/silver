function enableStatusFilter() {
	var filterActive = false;
	var button = document.querySelector('#status-filter');
	var statusLabels = (button.getAttribute('data-status-filter') || '').split(',');
	var statusSelector = statusLabels.map(function (status) {
		return '[data-status="'+ status +'"]'
	}).join(',')

	function toggleStatus() {
		filterActive = !filterActive; // Toggle
		var sections = document.querySelectorAll(statusSelector);
		sections.forEach(function (section) {
			if (section.hasAttribute('data-no-filter')) {
				return; // Use this to override the filter
			}
			var sectionId = section.id || findHeading(section).id;
			var tocLink = document.querySelector('#toc a[href="#' + sectionId + '"]'); // this may be null due to TOC depth limit
			var tocItem = tocLink == null ? null : tocLink.parentNode;
			if (filterActive) {
				section.setAttribute('hidden', '');
				if (tocItem != null) tocItem.setAttribute('hidden', '');
			} else {
				section.removeAttribute('hidden');
				if (tocItem != null) tocItem.removeAttribute('hidden');
			}
		});
		button.textContent = (filterActive ? 'Reveal' : 'Hide') + ' placeholder & exploratory sections';
	}
	button.addEventListener('click', toggleStatus);
	toggleStatus(); // Active by default
}

window.addEventListener('load', (event) => {
  enableStatusFilter();
});
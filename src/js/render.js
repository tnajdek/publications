import itemTpl from './tpl/partial/item.tpl';
import itemsTpl from './tpl/partial/items.tpl';
import groupTpl from './tpl/partial/group.tpl';
import groupsTpl from './tpl/partial/groups.tpl';
import brandingTpl from './tpl/partial/branding.tpl';
import groupViewTpl from './tpl/group-view.tpl';
import plainViewTpl from './tpl/plain-view.tpl';
import {
	GROUP_EXPANDED_SUMBOL,
	GROUP_TITLE
} from './data.js';
import {
	formatCategoryName,
	closest
} from './utils.js';


/**
 * Zotero Renderer constructor
 * @param {HTMLElement} container	- A container where contents is rendered
 * @param {Object} [config]			- ZoteroPublications config
 */
export function ZoteroRenderer(container, config) {
	this.container = container;
	this.config = config;
	this.toggleSpinner(true);
}

/**
 * Render single Zotero item
 * @param  {Object} zoteroItem       - Single Zotero item data
 * @return {String}                  - Rendered markup of a Zotero item
 */
ZoteroRenderer.prototype.renderItem = function(zoteroItem) {
	return itemTpl({
		'item': zoteroItem,
		'data': zoteroItem.data,
		'renderer': this
	});
};

/**
 * Render a list of Zotero items
 * @param  {Object[]} zoteroItems - List of Zotero items
 * @return {String}                          - Rendered markup of a list of Zotero items
 */
ZoteroRenderer.prototype.renderItems = function(zoteroItems) {
	return itemsTpl({
		'items': zoteroItems,
		'renderer': this
	});
};

/**
 * Render a group of Zotero items
 * @param  {Object[]} items 	- List of items for this group
 * @return {String}             - Rendered markup of a group
 */
ZoteroRenderer.prototype.renderGroup = function(items) {
	return groupTpl({
		'title': formatCategoryName(items[GROUP_TITLE]),
		'items': items,
		'expand': items[GROUP_EXPANDED_SUMBOL],
		'renderer': this
	});
};

/**
 * Renders a list of groups of Zotero items
 * @param {Object[]} 	- List of groups to render
 * @return {String} 	- Rendered markup of groups
 */
ZoteroRenderer.prototype.renderGroups = function(groups) {
	return groupsTpl({
		'groups': groups,
		'renderer': this
	});
};

/**
 * Render a Group View
 * @param {Object[]} 	- List of groups to render
 * @return {String} 	- Rendered markup of a complete group view
 */
ZoteroRenderer.prototype.renderGroupView = function(data) {
	return groupViewTpl({
		'groups': data,
		'renderer': this
	});
};

/**
 * Render a Plain View
 * @param  {Object[]} zoteroItems - List of Zotero items
 * @return {String} 	- Rendered markup of a complete plain view
 */
ZoteroRenderer.prototype.renderPlainView = function(data) {
	return plainViewTpl({
		'items': data,
		'renderer': this
	});
};

/**
 * Render Zotero branding
 * @return {String}
 */
ZoteroRenderer.prototype.renderBranding = function() {
	return brandingTpl();
};

/**
 * Render Zotero publications into a DOM element
 * @param  {ZoteroData} data       - Source of publications to be rendered
 */
ZoteroRenderer.prototype.displayPublications = function(data) {
	var markup;
	this.toggleSpinner(false);

	if(data.grouped > 0) {
		markup = this.renderGroupView(data);
	} else {
		markup = this.renderPlainView(data);
	}

	this.data = data;
	this.container.innerHTML = markup;
	this.previous = markup;
	this.addHandlers();
};

/**
 * Attach interaction handlers
 */
ZoteroRenderer.prototype.addHandlers = function() {
	this.container.addEventListener('click', function(ev) {
		var target;

		target = closest(ev.target, el => el.dataset && el.dataset.trigger === 'details');
		if(target) {
			let itemEl = closest(target, el => el.dataset && el.dataset.item);
			let detailsEl = itemEl.querySelector('.zotero-details');
			if(detailsEl) {
				detailsEl.classList.toggle('zotero-details-show');
			}
			return;
		}
	});
};

/**
 * Toggle CSS class that gives a visual loading feedback. Optionally allows to explicetly specify
 * whether to display or hide visual feedback.
 * @param  {boolean} [activate]    - Explicitely indicate whether to add or remove visual feedback
 */
ZoteroRenderer.prototype.toggleSpinner = function (activate) {
	var method = activate === null ? this.container.classList.toggle : activate ? this.container.classList.add : this.container.classList.remove;
	method.call(this.container.classList, 'zotero-loading');
};

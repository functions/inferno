(function() {
	"use strict";

	var createVNode = Inferno.createVNode;

	uibench.init('Inferno', '1.0.0-beta7 *dev*');

	var treeLeafProps = { className: 'TreeLeaf' };

	function TreeLeaf(id) {
		return createVNode(1 << 1, 'li', treeLeafProps, id + '');
	}

	var shouldDataUpdate = {
		onComponentShouldUpdate: function (lastProps, nextProps) {
			return lastProps !== nextProps;
		}
	};
	var treeNodeProps = { className: 'TreeNode' };

	function TreeNode(data) {
		var length = data.children.length;
		var children = new Array(length);

		for (var i = 0; i < length; i++) {
			var n = data.children[i];

			if (n.container) {
				children[i] = createVNode(1 << 3, TreeNode, n, null, n.id, shouldDataUpdate, true);
			} else {
				children[i] = createVNode(1 << 3, TreeLeaf, n.id, null, n.id, shouldDataUpdate);
			}
		}
		return createVNode(1 << 1 | 1 << 4, 'ul', treeNodeProps, children, null, null, true);
	}

	var treeProps = { className: 'Tree' };
	var lastTreeData;

	function tree(data) {
		if (data === lastTreeData) {
			return Inferno.NO_OP;
		}
		lastTreeData = data;
		return createVNode(1 << 1, 'div', treeProps, createVNode(1 << 3, TreeNode, data.root, null, null, shouldDataUpdate, true));
	}

	function AnimBox(data) {
		var time = data.time;
		var style = 'border-radius:' + (time % 10) + 'px;' +
			'background:rgba(0,0,0,' + (0.5 + ((time % 10) / 10)) + ')';

		return createVNode(1 << 1, 'div', { className: 'AnimBox', style: style, 'data-id': data.id });
	}

	var animProps = { className: 'Anim' };
	var lastAnimData;

	function anim(data) {
		if (data === lastAnimData) {
			return Inferno.NO_OP;
		}
		lastAnimData = data;
		var items = data.items;
		var length = items.length;
		var children = new Array(length);

		for (var i = 0; i < length; i++) {
			var item = items[i];

			children[i] = createVNode(1 << 3, AnimBox, item, null, item.id, shouldDataUpdate);
		}
		return createVNode(1 << 1 | 1 << 4, 'div', animProps, children, null, null, true);
	}

	function onClick(e, c, p) {
		console.log('Clicked', p);
		e.stopPropagation();
	}

	document.addEventListener('click', onClick);
	var tableCellProps = { className: 'TableCell' };

	function TableCell(text) {
		return createVNode(1 << 1, 'td', tableCellProps, text);
	}

	function TableRow(data) {
		var classes = 'TableRow';

		if (data.active) {
			classes = 'TableRow active';
		}
		var cells = data.props;
		var length = cells.length + 1;
		var children = new Array(length);

		children[0] = createVNode(1 << 3, TableCell, '#' + data.id, null, -1, shouldDataUpdate);

		for (var i = 1; i < length; i++) {
			children[i] = createVNode(1 << 3, TableCell, cells[i - 1], null, i, shouldDataUpdate);
		}
		return createVNode(1 << 1 | 1 << 4, 'tr', { className: classes, 'data-id': data.id }, children, null, null, true);
	}

	var tableProps = { className: 'Table' };
	var lastTableData;

	function table(data) {
		if (data === lastTableData) {
			return Inferno.NO_OP;
		}
		lastTableData = data;
		var items = data.items;
		var length = items.length;
		var children = new Array(length);

		for (var i = 0; i < length; i++) {
			var item = items[i];

			children[i] = createVNode(1 << 3, TableRow, item, null, item.id, shouldDataUpdate, true);
		}
		return createVNode(1 << 1 | 1 << 4, 'table', tableProps, children, null, null, true);
	}

	var mainProps = { className: 'Main' };
	var lastMainData;

	function main(data) {
		if (data === lastMainData) {
			return Inferno.NO_OP;
		}
		lastMainData = data;
		var location = data.location;
		var section;

		if (location === 'table') {
			section = table(data.table);
		} else if (location === 'anim') {
			section = anim(data.anim);
		} else if (location === 'tree') {
			section = tree(data.tree);
		}
		return createVNode(1 << 1, 'div', mainProps, section, null, null, true);
	}

	document.addEventListener('DOMContentLoaded', function(e) {
		var container = document.querySelector('#App');

		uibench.run(
			function(state) {
				Inferno.render(main(state), container);
			},
			function(samples) {
				Inferno.render(
					createVNode(1 << 1, 'pre', null, JSON.stringify(samples, null, ' '), null, null, true), container
				);
			}
		);
	});
})();

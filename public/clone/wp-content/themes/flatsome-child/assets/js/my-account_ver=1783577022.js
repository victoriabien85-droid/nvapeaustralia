(function () {
	function copyReferralLink(button) {
		var targetId = button.getAttribute('data-copy-target');
		var input = targetId ? document.getElementById(targetId) : null;

		if (!input) {
			return;
		}

		var value = input.value;

		if (navigator.clipboard && window.isSecureContext) {
			navigator.clipboard.writeText(value).then(showCopiedTip).catch(fallbackCopy);
			return;
		}

		fallbackCopy();

		function fallbackCopy() {
			input.focus();
			input.select();
			try {
				document.execCommand('copy');
				showCopiedTip();
			} catch (e) {
				/* ignore */
			}
		}

		function showCopiedTip() {
			var tip = document.querySelector('.cnvapes-referral-copy__tip');
			if (!tip) {
				return;
			}
			tip.hidden = false;
			window.setTimeout(function () {
				tip.hidden = true;
			}, 2000);
		}
	}

	document.addEventListener('click', function (event) {
		var button = event.target.closest('.cnvapes-referral-copy__btn');
		if (button) {
			event.preventDefault();
			copyReferralLink(button);
		}
	});

	/* YITH Points tabs: sync aria-selected (HTML is static; JS only toggles .active) */
	function syncYwparTabs(root) {
		var scope = root || document;
		scope.querySelectorAll('#ywpar_tabs').forEach(function (tabsRoot) {
			var links = tabsRoot.querySelectorAll('.ywpar_tabs_links');
			links.forEach(function (link) {
				var isActive = link.classList.contains('active');
				link.setAttribute('aria-selected', isActive ? 'true' : 'false');
				link.setAttribute('tabindex', isActive ? '0' : '-1');
			});
		});
	}

	document.addEventListener('click', function (event) {
		var tab = event.target.closest('.ywpar_tabs_links');
		if (!tab || !tab.closest('.cnvapes-my-account-page, .cnvapes-MyAccount-content')) {
			return;
		}
		window.setTimeout(function () {
			syncYwparTabs();
		}, 0);
	});

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			window.setTimeout(syncYwparTabs, 100);
		});
	} else {
		window.setTimeout(syncYwparTabs, 100);
	}
})();

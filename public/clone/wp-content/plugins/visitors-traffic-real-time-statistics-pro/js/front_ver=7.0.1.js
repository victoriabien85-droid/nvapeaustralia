var pageid = ahc_ajax_front.page_id;
var page_id = (pageid.length > 0) ? pageid : ''; 
var pagetitle = ahc_ajax_front.page_title;
var page_title = (pagetitle.length > 0) ? pagetitle : ''; 
var posttype = ahc_ajax_front.post_type;
var post_type = (posttype.length > 0) ? posttype : ''; 
var referer = document.referrer;
var useragent = window.navigator.userAgent;
var servername = location.hostname;
var hostname = location.host;
var request_uri = (location.pathname + location.search).replace(/^\//, '');

function ahcGetCampaignParams() {
    try {
        var p = new URLSearchParams(location.search || '');
        var keys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','gclid','fbclid','ttclid','msclkid'];
        var out = {};
        for (var i = 0; i < keys.length; i++) {
            var k = keys[i];
            var v = p.get(k);
            if (v && v.length) out[k] = v;
        }
        return out;
    } catch (e) {
        return {};
    }
}

var landing_url = location.href;
var campaign = ahcGetCampaignParams();

var xhttp = new XMLHttpRequest();

xhttp.open("POST", ahc_ajax_front.ajax_url, true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
var payload =
    "action=ahcpro_track_visitor" +
    "&page_id=" + encodeURIComponent(page_id) +
    "&page_title=" + encodeURIComponent(page_title) +
    "&post_type=" + encodeURIComponent(post_type) +
    "&referer=" + encodeURIComponent(referer || '') +
    "&useragent=" + encodeURIComponent(useragent || '') +
    "&servername=" + encodeURIComponent(servername || '') +
    "&hostname=" + encodeURIComponent(hostname || '') +
    "&request_uri=" + encodeURIComponent(request_uri || '') +
    "&landing_url=" + encodeURIComponent(landing_url || '') +
    "&utm_source=" + encodeURIComponent(campaign.utm_source || '') +
    "&utm_medium=" + encodeURIComponent(campaign.utm_medium || '') +
    "&utm_campaign=" + encodeURIComponent(campaign.utm_campaign || '') +
    "&utm_content=" + encodeURIComponent(campaign.utm_content || '') +
    "&utm_term=" + encodeURIComponent(campaign.utm_term || '') +
    "&gclid=" + encodeURIComponent(campaign.gclid || '') +
    "&fbclid=" + encodeURIComponent(campaign.fbclid || '') +
    "&ttclid=" + encodeURIComponent(campaign.ttclid || '') +
    "&msclkid=" + encodeURIComponent(campaign.msclkid || '');
xhttp.send(payload);
/*

jQuery(document).ready(function ()
{			
	var pageid = ahc_ajax_front.page_id;
	var page_id = (pageid.length > 0) ? pageid : ''; 
	var pagetitle = ahc_ajax_front.page_title;
	var page_title = (pagetitle.length > 0) ? pagetitle : ''; 
	var posttype = ahc_ajax_front.post_type;
	var post_type = (posttype.length > 0) ? posttype : ''; 
	var referer = document.referrer;
	var useragent = window.navigator.userAgent;
	var servername = location.hostname;
	var hostname = location.host;
	var request_uri = location.pathname.substring(1);
	
	jQuery.ajax({
		type: 'POST',
		url : ahc_ajax_front.ajax_url,
		data: {
			'action': 'ahcpro_track_visitor',
			'page_id': page_id,
			'page_title': page_title,
			'post_type': post_type,
			'referer': referer,
			'useragent':useragent,
			'servername':servername,
			'hostname':hostname,
			'request_uri':request_uri
		},
		success: function(data){
			console.log(data);
		},
		error: function(data)
		{	
			console.log(data);
		}
	});	
});
*/
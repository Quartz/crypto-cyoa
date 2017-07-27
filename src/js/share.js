var $twitter = document.querySelector('.icon-twitter');
var $facebook = document.querySelector('.icon-facebook');
var $linkedin = document.querySelector('.icon-linkedin');
var $email = document.querySelector('.icon-email');

var shareConfig = {
	facebook: {
		baseUrl: 'https://www.facebook.com/dialog/feed?',
		app_id: '676492505769612', // fb app id
		link: '', // url to story page
		name: '', // headline
		picture: '', // url to image file
		caption: 'qz.com', // little fb credit thing
		description: '', // text under the headline
		message: '', // not sure what this does
		redirect_uri: 'http://qz.com'
	},
	twitter: {
		baseUrl: 'https://twitter.com/intent/tweet?',
		url: '',
		text:+ tweetTxt,
		related: '',
		via: ''
	},
	linkedin: {
		baseUrl: 'http://linkedin.com/shareArticle?',
		mini: 'true',
		url: '',
		title: '',
		summary: ''
	},
	email: {
		baseUrl: 'mailto:?',
		subject: ''
	}
};
function updateHref (args) {
	var hrefs = {};

	hrefs.twitter = [
		shareConfig.twitter.baseUrl,
		'url=' + shareConfig.twitter.url,
		'&text=' + shareConfig.twitter.text,
		'&via=' + shareConfig.twitter.via,
		'&related=' + shareConfig.twitter.via
	].join('');

	hrefs.facebook = [
		shareConfig.facebook.base_url,
		'app_id=' + shareConfig.facebook.app_id,
		'&name=' + shareConfig.facebook.name,
		'&link=' + shareConfig.facebook.link,
		'&picture=' + shareConfig.facebook.picture,
		'&caption=' + shareConfig.facebook.caption,
		'&description=' + shareConfig.facebook.description,
		'&message=' + shareConfig.facebook.message,
		'&redirect_uri=' + shareConfig.facebook.redirect_uri
	].join('');

	hrefs.linkedin = [
		shareConfig.linkedin.base_url,
		'mini=' + shareConfig.linkedin.mini,
		'&url=' + shareConfig.linkedin.url,
		'&title=' + shareConfig.linkedin.title,
		'&summary=' + shareConfig.linkedin.summary
	].join('');

	hrefs.email = [
		shareConfig.email.base_url,
		shareConfig.email.subject
	].join('');

	$twitter.href = encodeURI(hrefs.twitter);
	$facebook.href = encodeURI(hrefs.facebook);
	$linkedin.href = encodeURI(hrefs.linkedin);
	$email.href = encodeURI(hrefs.email);
}

module.exports = updateHref;

var { Subscription } = require('../../model/subscription');

module.exports = {
	channelToTag(channelKey) {
		return "no_" + channelKey.toLowerCase();
	},
	channelsToTags() {
		return Object.keys(Subscription.Channels).map((item) => "no_" + item.toLowerCase());
	},

	tagsToChannelNames(tags) {
		return tags.map((tag) => (tag.replace("no_","").toUpperCase()));
  } 
};
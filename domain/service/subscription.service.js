var { SubscriptionPreferences, Subscription } = require('../model/subscription');
var TagUtils = require('./utils/tag.utils')

module.exports = class SubscriptionService {
    constructor(intercomService) {
		this.intercomService = intercomService;
	}

	getSubscriptionPreferences(email, callback) {
		return this.intercomService.getUser(email, function(user) {
			var allUnsubscribeTags = TagUtils.channelsToTags();
			var userUnsubscribeTags = user.tags.tags
				.map(tag => tag.name)
				.filter(tagName => allUnsubscribeTags.includes(tagName));
			var userUnsubscribeChannels = TagUtils.tagsToChannelNames(userUnsubscribeTags);
			
			var subscriptions = []
			Object.keys(Subscription.Channels).map((channelKey) => {
				if(userUnsubscribeChannels.includes(channelKey)) {
					subscriptions.push(new Subscription(Subscription.Channels[channelKey], false));
				} else {
					subscriptions.push(new Subscription(Subscription.Channels[channelKey], true));
				}
			});

			callback(new SubscriptionPreferences({name: user.name, email: user.email}, subscriptions));
		});
	}
	
	subscribeUserToChannel(email, channel, callback) {
		return this.intercomService.untagUser(email,TagUtils.channelToTag(channel), callback);
	}

	unsubscribeUserFromChannel(email, channel, callback) {
		return this.intercomService.tagUser(email,TagUtils.channelToTag(channel), callback);
	}
};
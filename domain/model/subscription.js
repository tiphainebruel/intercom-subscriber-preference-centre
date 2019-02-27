class SubscriptionPreferences {
	constructor(user, subscriptions) {
		this.user = user;
		this.subscriptions = subscriptions;
	}
}

class Subscription {
	constructor(channel, subscribed) {
		this.channel = channel;
		this.subscribed = subscribed;
	}
}

Subscription.Channels={
	EVENT: { key: "event", name: "event", description: "Ssshake videos" },
	JOBS: { key: "jobs", name: "job opportunities" },
	BLOG: { key: "blog", name: "blog articles" },
	VIDEO: { key: "video", name: "video content" },
	NEWSLETTER: { key: "newsletter", name: "monthly newsletter" }
}

module.exports = {
	SubscriptionPreferences, Subscription
}
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
	EVENT: { key: "event", type: "realtime", name: "event", description: "Ssshake videos" },
	JOBS: { key: "jobs", type: "realtime", name: "job opportunities" },
	BLOG: { key: "blog", type: "realtime", name: "blog articles" },
	VIDEO: { key: "video", type: "realtime", name: "video content" },
	NEWSLETTER: { key: "newsletter", type: "digest", name: "monthly newsletter",  }
}

module.exports = {
	SubscriptionPreferences, Subscription
}
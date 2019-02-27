module.exports = class IntercomService {
    constructor(intercomClient) {
		this.intercomClient = intercomClient;
	}

	getUser(email, callback) {
		return this.intercomClient.users.find({ email: email }, function(r) {
			callback(r.body);
		})
	}

	tagUser(email, tag, callback) {
		return this.intercomClient.tags.tag({ name: tag, users: [ { email : email } ] }, function(r) {
			callback(r.body);
		});
	}

	untagUser(email, tag, callback) {
		return this.intercomClient.tags.untag({ name: tag, users: [ { email : email, untag: true } ] }, function(r) {
			callback(r.body);
		});
	}
};
let firebase

module.exports = (_firebase) => {
	firebase = _firebase;
	return Members;
};

let Members = class {
	static getByID(id) {
		return new Promise((next) => {
		});
	}
	static getAll(max) {
		return new Promise((next) => {
			firebase.database().ref('members/').once('value')
				.then(function (snapshot) {
					var members = snapshot.val()
					let sortMembers = Object.keys(members).sort(function (a, b) {
						return members[b].score - members[a].score
					})

					let other = sortMembers.slice(3)
					let top = sortMembers.slice(0, 3)

					let allMembers = {
						top: [],
						other: []
					}

					let request = other.map(async (id) => {
						const resp = await firebase.database().ref('members/' + id).once('value')
							.then(function (snapshot) {
								allMembers.other.push(snapshot.val())
							})
					})
					Promise.all(request).then(() => {
						let request2 = top.map(async (id) => {
							const resp = await firebase.database().ref('members/' + id).once('value')
								.then(function (snapshot) {
									allMembers.top.push(snapshot.val())
								})
						})
						Promise.all(request2).then(() => {
							next(allMembers)
						})
					})
				})
				.catch((err) => {
					next(err);
				});
		});
	}
	static getByName(name) {
		return new Promise((next) => {

		});
	}
	static getById(id) {
		return new Promise((next) => {
			firebase.database().ref('members/' + id).once('value')
				.then(function (snapshot) {
					var member = snapshot.val()
					next(member)
				})
		});
	}
	static setMember(pseudo, score) {
		return new Promise((next) => {
			let memberID = Date.now()
			firebase.database().ref('members/' + memberID).set({
				id: memberID,
				pseudo,
				score
			}).then(() => next(true));
		});
	}
	static deleteMember(id) {
		return new Promise((next) => {

		});
	}
	static updateMember(id, name) {
		return new Promise((next) => {

		});
	}
};

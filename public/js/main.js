(function(){

	var state = {
		score: [],
		start: 0
	};

	function update(){
		m.request("api/highscore?start=" + state.start)
		.then(function(score){
			state.score = score;
		});
	}

	function next(){
		state.start += 10;
		update();
	}

	function previous(){
		state.start = Math.max(state.start - 10, 0);
		update();
	}

	var NextButton = {
		view: function(){
			return m("div", {class:"btn-group"}, [
				m("button", {class:"btn btn-secondary btn-lg", onclick: previous}, [
					m("i", {class:"fas fa-step-backward"}),
					" Previous"
				]),
				m("button", {class:"btn btn-secondary btn-lg", onclick: next}, [
					"Next ",
					m("i", {class:"fas fa-step-forward"})
				])
			]);
		}
	}

	var HighscoreRows = {
		view: function(){
			var rows = [];
			var ranking = state.start + 1;

			state.score.forEach(function(player){

				var time_diff = moment(moment()).diff(player.modified);
				var last_login = moment.duration(time_diff).humanize();
				var is_online = time_diff < 30000;
				var is_inactive = time_diff > (1000*3600*24*30); //30 days

				var state = m("span", {class: "badge badge-" + (is_online?"success":"danger")}, is_online?"Online":"Offline");
				var xp = m("span", {class: "badge badge-info"}, player.xp);
				var inactive = m("span", {class: "badge badge-secondary"}, "Inactive")

				rows.push(m("tr", [
					m("td", ranking++),
					m("td", player.name),
					m("td", xp),
					m("td", player.attributes.digged_nodes),
					m("td", player.attributes.crafted),
					m("td", player.attributes.placed_nodes),
					m("td", player.attributes.died),
					m("td", player.attributes.played_time ? moment.duration(+player.attributes.played_time, "seconds").humanize() : ""),
					m("td", [last_login, (is_inactive?inactive:null)]),
					m("td", state)
				]));

			});

			return m("tbody", rows);
		}
	};

	var Table = {
		view: function(){
			return m("table", {class:"table table-condensed table-striped"}, [
				m("thead", [
					m("tr", [
						m("th", "Ranking"),
						m("th", "Name"),
						m("th", "XP"),
						m("th", "Dig-count"),
						m("th", "Craft-count"),
						m("th", "Build-count"),
						m("th", "Death-count"),
						m("th", "Play-time"),
						m("th", "Last login"),
						m("th", "Status")
					])
				]),
				m(HighscoreRows)
			]);
		}
	};

	var Page = {
		view: function(){
			return m("div", [m(NextButton), m(Table)]);
		}
	}

	m.mount(document.getElementById("app"), Page);

	update();

	setInterval(update, 2000);

})();

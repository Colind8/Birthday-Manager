data = localStorage.getItem("data");
edit_toggled = false;
current_date = new Date();

if (data) {
	load();
} else {
	dataobj = JSON.parse(`{"data": []}`);
	save();
}

function save() {
	data = JSON.stringify(dataobj);
	data = window.btoa(data);
	localStorage.setItem("data", data);
	load();
}

function load() {
	data = localStorage.getItem("data");
	dataobj = window.atob(data);
	dataobj = JSON.parse(dataobj);
	console.log(dataobj);
	bm_str = "";
	bm_str += `<button onclick="toggle_edit()">Edit Mode</button>`;

	if (dataobj.data.length < 1) {
		bm_str += `<p>You have no birthdays added yet! Toggle Edit Mode to add some!</p>`;
	}

	create_bm();


	document.getElementById('main_container').innerHTML = bm_str;
}

function toggle_edit() {
	if (!edit_toggled) {
		edit_toggled = true;
		document.getElementById('main_container').style.display = "none";
		document.getElementById('edit_container').style.display = "block";
		edit_load();
	} else {
		edit_toggled = false;
		document.getElementById('main_container').style.display = "block";
		document.getElementById('edit_container').style.display = "none";
	}
}

function edit_load() {
	edit_str = ``;
	edit_str += `<button onclick="edit_save()" class="good">Save and return</button> `;
	edit_str += `<button onclick="edit_quit()" class="bad">Return without saving</button>`
	edit_str += `<table id="edit_table"><tr><th>Name</th><th>Birthdate</th><th>Edit</th></tr>`;
	edit_str += get_edit_table();
	edit_str += `</table>`;

	document.getElementById("edit_container").innerHTML = edit_str;
}

function get_edit_table() {
	table_str = ``;
	for (i = 0; i < dataobj.data.length; i++) {
		table_str += `<tr>`
		table_str += `<td>${dataobj.data[i].name}</td>`
		table_str += `<td>${dataobj.data[i].birthday}</td>`
		table_str += `<td><button class="table_button">Edit</button></td></tr>`
	}
	table_str += `<tr><td><input id="input_name" type="text" placeholder="Name"></td>`
	table_str += `<td><input id="input_day" type="text" placeholder="Birthday (MM/DD)"></td>`
	table_str += `<td><button class="table_button" onclick="add_birthday()">Add</button></td></tr>`

	return table_str;
}

function add_birthday() {
	sname = document.getElementById("input_name").value;
	sday = document.getElementById("input_day").value;
	d = new Date(sday);
	if (d == "Invalid Date") {
		return;
	}

	dataobj.data.push({
		name: sname,
		birthday: sday
	});
	document.getElementById("input_name").value = "";
	document.getElementById("input_day").value = "";

	edit_load();
}

function edit_save() {
	save();
	toggle_edit();
}

function edit_quit() {
	load();
	toggle_edit();
}

function create_bm() {
	bm_daysleft = [];
	for (i = 0; i < dataobj.data.length; i++) {
		d = new Date(`${dataobj.data[i].birthday}/${current_date.getFullYear()}`);
		if (d.getTime() < current_date.getTime()) {
			d = new Date(`${dataobj.data[i].birthday}/${current_date.getFullYear() + 1}`);
		}
		//calculate time difference  
		time_difference = d.getTime() - current_date.getTime();

		//calculate days difference by dividing total milliseconds in a day  
		days_difference = time_difference / (1000 * 60 * 60 * 24);
		days_difference = Math.ceil(days_difference);
		if (days_difference == 365) { days_difference = 0; }

		bm_daysleft.push(days_difference);
	}

	console.log(bm_daysleft);
}

/*

NEXT UP:
+ make clone of bm_daysleft, sort it, and replace the clone's numbers with the index of the birthday by comparing the clone's numbers with the original

+ go from there



*/
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
	bm_str = "";

	if (dataobj.data.length < 1) {
		bm_str += `<p>You have no birthdays added yet! Toggle Edit Mode to add some!</p>`;
		bm_str += `<button onclick="toggle_edit()">Edit Mode</button>`;
	} else {
		bm_arr = create_bm();
		// a = sorted daysleft
		// b = sorted indexes
		bm_str += `<div id="nextup"><h2 class="nextup">Next up: ${dataobj.data[bm_arr.b[0]].name}!</h2>`
		if (bm_arr.a[0] == 0) {
			bm_str += `<h3 class="nextup">Today!</h3>`
		} else {
			bm_str += `<h3 class="nextup">In ${bm_arr.a[0]} days</h3>`
		}
		dd = `${dataobj.data[bm_arr.b[0]].birthday}/${current_date.getFullYear()}`;
		d = new Date(dd);
		if ((d.getTime() < current_date.getTime()) && bm_arr.a[0] != 0) {
			dd = `${dataobj.data[bm_arr.b[0]].birthday}/${current_date.getFullYear() + 1}`;
		}
		bm_str += `<p class="nextup">${dd}</p></div>`

		bm_str += `<button style="display: block;" onclick="toggle_edit()">Edit Mode</button>`;

		bm_str += `<table id="birthday_table"><tr><th>Name</th><th>Days Left</th><th>Birthdate</th></tr>`;
		for (i = 0; i < dataobj.data.length; i++) {
			bm_str += `<tr><td>${dataobj.data[bm_arr.b[i]].name}</td><td>${bm_arr.a[i]}</td><td>${dataobj.data[bm_arr.b[i]].birthday}</td></tr>`;
		}
		bm_str += `</table>`;
	}


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
	edit_str += `<button onclick="edit_quit()" class="bad">Return without saving</button>`;
	edit_str += `<table id="edit_table"><tr><th>Name</th><th>Birthdate</th><th>Edit</th></tr>`;
	edit_str += get_edit_table();
	edit_str += `</table>`;
	edit_str += get_edit_settings();


	document.getElementById("edit_container").innerHTML = edit_str;
}

function get_edit_table() {
	table_str = ``;
	for (i = 0; i < dataobj.data.length; i++) {
		table_str += `<tr>`
		table_str += `<td>`
		table_str += `<div id="name${i}">${dataobj.data[i].name}</div>`
		table_str += `<div style="display: none;" id="name_edit${i}">`
		table_str += `<input id="input_edit_name${i}" type="text" placeholder="Name" value="${dataobj.data[i].name}"></div>`
		table_str += `</td>`
		table_str += `<td>`
		table_str += `<div id="day${i}">${dataobj.data[i].birthday}</div>`
		table_str += `<div style="display: none;" id="day_edit${i}">`
		table_str += `<input id="input_edit_day${i}" type="text" placeholder="Birthday (MM/DD)" value="${dataobj.data[i].birthday}"></div>`
		table_str += `</td>`
		table_str += `<td>`
		table_str += `<div id="edit${i}"><button onclick="toggle_table_edit(${i})" class="table_button">Edit</button></div>`
		table_str += `<div style="display: none;" id="edit_edit${i}">`
		table_str += `<button class="table_button" onclick="delete_day(${i})">X</button>`
		table_str += `<button class="table_button" onclick="save_edit(${i})">Done</button>`
		table_str += `</div></td>`
		table_str += `</tr>`
	}
	table_str += `<tr><td><input id="input_name" type="text" placeholder="Name"></td>`
	table_str += `<td><input id="input_day" type="text" placeholder="Birthday (MM/DD)"></td>`
	table_str += `<td><button class="table_button" onclick="add_birthday()">Add</button></td></tr>`

	return table_str;
}

function get_edit_settings() {
	settings_str = ``;
	settings_str += `<fieldset><legend>Settings</legend>`;
	settings_str += `<div><label>Save Data</label> `;
	settings_str += `<input id="savedata" value="${data}"> `;
	settings_str += `<button onclick="load_save()">Load</button>`;
	settings_str += `<p>Use the Save Data text box above to import or export your Birthday Manager Save Data by copying or pasting the code. Press the Load button to load the code.</p>`;
	settings_str += `<button onclick="delete_save()" class="bad">Delete savedata</button>`;
	settings_str += `</fieldset>`;
	return settings_str;
}

function toggle_table_edit(id) {
	document.getElementById(`name${id}`).style.display = "none";
	document.getElementById(`day${id}`).style.display = "none";
	document.getElementById(`edit${id}`).style.display = "none";

	document.getElementById(`name_edit${id}`).style.display = "block";
	document.getElementById(`day_edit${id}`).style.display = "block";
	document.getElementById(`edit_edit${id}`).style.display = "block";
}

function delete_day(id) {
	dataobj.data.splice(id, 1);
	edit_load();
}

function save_edit(id) {
	sname = document.getElementById(`input_edit_name${id}`).value;
	sday = document.getElementById(`input_edit_day${id}`).value;
	d = new Date(sday);
	if (d == "Invalid Date") {
		return;
	}

	dataobj.data[id].name = sname;
	dataobj.data[id].birthday = sday;

	document.getElementById(`name${id}`).style.display = "block";
	document.getElementById(`day${id}`).style.display = "block";
	document.getElementById(`edit${id}`).style.display = "block";

	document.getElementById(`name_edit${id}`).style.display = "none";
	document.getElementById(`day_edit${id}`).style.display = "none";
	document.getElementById(`edit_edit${id}`).style.display = "none";

	edit_load();
}

function add_birthday() {
	sname = document.getElementById("input_name").value;
	sday = document.getElementById("input_day").value;
	d = new Date(`${sday}/2000`);
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
		if (days_difference >= 365) { days_difference = 0; }
		console.log(days_difference);
		bm_daysleft.push(days_difference);
	}

	bm_indexsort = [];
	for (i = 0; i < bm_daysleft.length; i++) {
		bm_indexsort.push(bm_daysleft[i]);
	}

	bm_indexsort.sort(function(a, b) { return a - b });
	bm_index = [];

	for (i = 0; i < dataobj.data.length; i++) { // i = 0
		bm_index.push(0);
	}

	for (i = 0; i < dataobj.data.length; i++) {
		for (n = 0; n < dataobj.data.length; n++) {
			if (bm_daysleft[i] == bm_indexsort[n]) {
				bm_index[n] = i;
			}
		}
	}
	return { a: bm_indexsort, b: bm_index };
}

function delete_save() {
	localStorage.removeItem("data");
	location.reload();
}

function load_save() {
	data = document.getElementById("savedata").value;
	dataobj = window.atob(data);
	dataobj = JSON.parse(dataobj);
	edit_load();
}
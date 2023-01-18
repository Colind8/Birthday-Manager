data = localStorage.getItem("data");
edit_toggled = false;

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
	edit_str += `<button class="good">Save and return</button> <button class="bad">Return without saving</button>`;
	edit_str += `<table id="edit_table"><tr><th>Name</th><th>Birthdate</th><th>Edit</th></tr>`;
	edit_str += get_edit_table();
	edit_str += `</table>`;

	document.getElementById("edit_container").innerHTML = edit_str;
}

function get_edit_table() {
	table_str = ``;
	for (i=0; i < dataobj.data.length; i++) {
		table_str += `<tr>`
		table_str += `<td>${dataobj.data[i].name}</td>`
		table_str += `<td>${dataobj.data[i].birthday}</td>`
		table_str += `<td><button>Edit</button></td></tr>`
	}
	table_str += `<tr><td><input id="input_name" type="text" placeholder="Name"></td>`
	table_str += `<td><input type="text" placeholder="Birthday (MM/DD)"></td>`
	table_str += `<td><button onclick="add_birthday()">Add</button></td></tr>`

	return table_str;
}

function add_birthday() {
	sname = document.getElementById("input_name").value;
	sday = document.getElementById("input_day").value;

	dataobj.data.push({
		name: sname,
		birthday: sday
	});
	document.getElementById("input_name").value = "";
	document.getElementById("input_day").value = "";
}
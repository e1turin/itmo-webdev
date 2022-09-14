const Point = {x: null, y: null, r: null}

window.onload = function () {
    let x_inputs = document.getElementsByClassName("x-input");
    for (let x of x_inputs) {
        x.addEventListener("change", on_x_change);
    }

    let y_inputs = document.getElementsByClassName("y-input");
    for (let y of y_inputs) {
        y.addEventListener("change", on_y_change);
    }

    let r_inputs = document.getElementsByClassName("r-input");
    for (let r of r_inputs) {
        r.addEventListener("change", on_r_change);
    }

    let form = document.forms['coords'];
    form.onsubmit = submit_form;

    x_inputs[0].dispatchEvent(new Event("change")) // trigger to reload final table
}

function update_point() {
    const submit_btn = document.getElementById("form-submit-btn");
    let valid_point = true;
    let x_final = document.getElementById("final-input-x");
    if (Point.x == null) {
        valid_point = false;
        x_final.innerHTML = "-";
    } else {
        x_final.innerHTML = Point.x;
    }

    let y_final = document.getElementById("final-input-y");
    if (Point.y == null) {
        valid_point = false;
        y_final.innerHTML = "-";
    } else {
        y_final.innerHTML = Point.y;
    }

    let r_final = document.getElementById("final-input-r");
    if (Point.r == null) {
        valid_point = false;
        r_final.innerHTML = "-";
    } else {
        r_final.innerHTML = Point.r;
    }
    submit_btn.disabled = !valid_point;
}

function on_x_change(event) {
    console.log('x:', event);
    Point.x = get_x_value();
    update_point();
}

function on_y_change(event) {
    console.log('y:', event);
    Point.y = get_y_value(event.target.value);
    update_point();
}

function on_r_change(event) {
    console.log('r:', event);
    Point.r = get_r_value();
    update_point();
}

function get_x_value() {
    let el = [...document.forms['coords']['x']].find(el => el.checked);
    if (el !== undefined) {
        el = el.value;
    }
    return el;
}

function get_r_value() {
    let el = [...document.forms['coords']['r']].find(el => el.checked);
    if (el !== undefined) {
        el = el.value;
    }
    return el;
}

function get_y_value(dy) {
    let y_coords = document.forms['coords']['y'];
    let y_input = y_coords.value.replaceAll(",", ".");
    if(! /^-?\d+\.?\d*$/.test(y_input)) return null; // deny exponential form
    let y_as_num = parseFloat(y_input);
    if (isNaN(y_as_num)) return null;
    y_as_num = y_as_num.toFixed(4);
    if (y_as_num > 5 || y_as_num < -3) {
        return null;
    } else {
        return y_as_num;
    }
}

// useless >>>
function submit_form() { }
function get_res_table() {
    return document.getElementsByClassName("results-table")[0];
}
function reset_table() {
    fetch("back/reset_table.php")
        .then(async response => {
            console.log(await response);
            let res_table = get_res_table();
            res_table.getElementsByTagName('tbody')[0].remove();
            res_table.appendChild(document.createElement("tbody"))
            window.location.href = '/';
        });
}
function handle_response(response) {
    if (response !== "") {
        let json = JSON.parse(response);
        console.log(json);
        if (Array.isArray(json)) {
            for (let res of json) {
                add_res_row(res);
            }
        } else {
            add_res_row(json);
        }
    } else {
        console.log("response is empty");
    }
}
function add_res_row(json_response) {
    let tbody = get_res_table().getElementsByTagName('tbody')[0];
    let new_row = document.createElement('tr');
    // for(const [key, val] of json_response){ }

    let x = document.createElement('td');
    x.innerHTML = json_response['x'];
    new_row.appendChild(x);

    let y = document.createElement('td');
    y.innerHTML = json_response['y'];
    new_row.appendChild(y);

    let r = document.createElement('td');
    r.innerHTML = json_response['r'];
    new_row.appendChild(r);

    let AC = document.createElement('td');
    AC.innerHTML = json_response['inside'] ? "✅" : "❌";
    new_row.appendChild(AC);

    let server_time = document.createElement('td');
    server_time.innerHTML = json_response['cur_time'];
    new_row.appendChild(server_time);

    let response_time = document.createElement('td');
    response_time.innerHTML = json_response['time'];
    new_row.appendChild(response_time);

    tbody.appendChild(new_row);
}
// useless <<<

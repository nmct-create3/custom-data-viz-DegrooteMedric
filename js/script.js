const $legendEl = document.querySelector(`.js-legend`);
const $chartEl = document.querySelector(`.js-chart`);
const $controlsEl = document.querySelector(`.js-controls`);
const $toggleEl = document.querySelector(`.js-theme-toggle`);
let data;

// SVG drawing functions

const cos = Math.cos;
const sin = Math.sin;
const π = Math.PI;

const f_matrix_times = (([[a, b], [c, d]], [x, y]) => [a * x + b * y, c * x + d * y]);
const f_rotate_matrix = (x => [[cos(x), -sin(x)], [sin(x), cos(x)]]);
const f_vec_add = (([a1, a2], [b1, b2]) => [a1 + b1, a2 + b2]);

const drawArc = (([cx, cy], [rx, ry], [t1, Δ], φ,) => {
    /* [
    returns a SVG path element that represent a ellipse.
    cx,cy → center of ellipse
    rx,ry → major minor radius
    t1 → start angle, in degrees.
    Δ → angle to sweep, in degrees. positive.
    φ → rotation on the whole, in degrees
    Based on:
    URL: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
    Version 2019-06-19
     ] */
    // convert t1 from degree to radian
    t1 = t1 / 360 * 2 * π;
    // convert Δ from degree to radian
    Δ = Δ / 360 * 2 * π;
    Δ = Δ % (2 * π);
    // convert φ from degree to radian
    φ = φ / 360 * 2 * π;
    const rotMatrix = f_rotate_matrix(φ);
    const [sX, sY] = (f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1), ry * sin(t1)]), [cx, cy]));
    const [eX, eY] = (f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1 + Δ), ry * sin(t1 + Δ)]), [cx, cy]));
    const fA = ((Δ > π) ? 1 : 0);
    const fS = ((Δ > 0) ? 1 : 0);
    const d = `M ${sX} ${sY} A ${[rx, ry, φ / (2 * π) * 360, fA, fS, eX, eY].join(" ")}`;
    return d;
});

const renderLegend = obj => {
    const keys = data[obj].ages;
    $legendEl.innerHTML = ``;
    $legendEl.innerHTML += `<ul class="legend"></ul>`;
    const $legend = document.querySelector(`.legend`);

    $legend.innerHTML += Object.keys(keys).map((key, i) => {
        return `<li class="legend__item">
                    <span class="legend__key">${key}</span>
                    <span class="legend__value">${keys[key]}</span>
                </li>`;
    }).join(``);
}


const renderControls = data => {
    const $controls = document.createElement(`ul`);
    $controls.classList.add(`controls`);
    $controlsEl.appendChild($controls);
    // create a list item for each key in the data
    const keys = Object.keys(data);

    $controls.innerHTML += keys.map(key => {
        return `
        <li class="control">
            <label class="control__label">
                <input class="control__input" type="radio" name="control" value="${key}" />
                <span class="control__text">${key}</span>
            </label>
        </li>
        `
    }).join(``);

    // check the input of radio button that has the value of the first key
    const $firstInput = document.querySelector(`input[value="${keys[0]}"]`);
    $firstInput.checked = true;

    // add an event listener to the radio buttons to show the correct data
    const $radios = document.querySelectorAll(`.control__input`);
    $radios.forEach(radio => {
        radio.addEventListener(`change`, event => {
            renderLegend(event.target.value);
            // update the svg paths here
            updatePaths(event.target.value);
        });
    });

};

// render the chart for the first party and then update it with new data
// make a new svg of 400x200
// for each key in the keys object, draw an arc with a stroke width of 50
// use the drawArc([cx, cy], [rx, ry], [start angle, angle to sweep], rotation in the whole)
const renderChart = obj => {
    console.log(obj);
};

// update the arcs with new data
// change the stroke-dasharray to the new values
const updatePaths = obj => {
    console.log(obj);
};

// theme toggle
// the theme toggle should remember your choice in localStorage
// and it should sync with system changes


const getData = async () => {
    const jsonFile = `assets/data/data.json`;

    const response = await fetch(jsonFile);
    data = await response.json();

    renderControls(data);
    renderLegend(Object.keys(data)[0]);

    // create the svg here
    renderChart(Object.keys(data)[0]);
    updatePaths(Object.keys(data)[0]);
};

const init = () => {
    getData();
};

init();

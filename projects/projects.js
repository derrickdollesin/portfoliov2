import { fetchJSON, renderProjects } from "../global.js";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');

/* counter */
const titleElement = document.querySelector('.projects-title');

if (projects && Array.isArray(projects)) {
    titleElement.textContent = `${projects.length} Projects`;

    renderProjects(projects, projectsContainer, 'h2');
} else {
    titleElement.textContent = `Projects (0)`;
}

/* pie chart */
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});
let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));
let colors = d3.scaleOrdinal(d3.schemeTableau10);

arcs.forEach((arc, idx) => {
    d3.select('svg')
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx)) // Fill in the attribute for fill color via indexing the colors variable
})

/* legend */
let legend = d3.select('.legend');
data.forEach((d, idx) => {
    legend.append('li')
          .attr('style', `--color: ${colors(idx)}`)  // Sets a CSS variable to each li
          .attr('class', 'legend-item')              // Adds a CSS class for styling
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
});

// /* search bar */
let query = '';
let searchInput = document.querySelector('.searchBar');

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year }; // TODO
  });

  // re-calculate slice generator, arc data, arc, etc.
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));

  // TODO: clear up paths and legends
  let newSVG = d3.select('svg');
  newSVG.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  // update paths and legends, refer to steps 1.4 and 2.2
  newArcs.forEach((arc, idx) => {
    newSVG.append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;

        newSVG.selectAll('path')
          .attr('class', (_, i) => (
            selectedIndex === i ? 'selected' : null
          ));

        legend.selectAll('li')
          .attr('class', (_, i) => (
            selectedIndex === i ? 'legend-item selected' : 'legend-item'
          ));

        // Combine filters!
        let filteredProjects = getFilteredProjects();
        renderProjects(filteredProjects, projectsContainer, 'h2');
        renderPieChart(filteredProjects);
      });
  });
  
  newData.forEach((d, idx) => {
    legend.append('li')
          .attr('style', `--color: ${colors(idx)}`)
          .attr('class', 'legend-item')
          .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

// Call this function on page load
renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();
  let filteredProjects = getFilteredProjects();
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});

function getFilteredProjects() {
  return projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    let matchesQuery = values.includes(query);
    let matchesYear = selectedIndex === -1 || project.year === data[selectedIndex].label;
    return matchesQuery && matchesYear;
  });
}

let selectedIndex = -1;
let svg = d3.select('svg');
svg.selectAll('path').remove();
arcs.forEach((arc, i) => {
  svg
    .append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .on('click', () => {
      selectedIndex = selectedIndex === i ? -1 : i;

      svg
        .selectAll('path')
        .attr('class', (_, idx) => (
          selectedIndex === idx ? 'selected' : null
        ));

      legend
        .selectAll('li')
        .attr('class', (_, idx) => (
          selectedIndex === idx ? 'legend-item selected' : 'legend-item'
        ));

      let filteredProjects = getFilteredProjects();
      renderProjects(filteredProjects, projectsContainer, 'h2');
      renderPieChart(filteredProjects);
    });
});

document.getElementById('clearFilters').addEventListener('click', () => {
  selectedIndex = -1;
  query = '';
  searchInput.value = '';
  let filteredProjects = getFilteredProjects();
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});
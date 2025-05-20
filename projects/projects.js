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
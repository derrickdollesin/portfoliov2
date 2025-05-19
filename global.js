console.log('IT’S ALIVE!');

/* Nav Bar */

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '', title: 'Home' },
    { url: 'projects/', title: 'Projects' },
    { url: 'contact/', title: 'Contact' },
    { url: 'resume/', title: 'Resume' },
    { url: 'https://github.com/derrickdollesin', title: 'GitHub'},
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
     ? "/"                  // Local server
     : "/website/";         // GitHub Pages repo name

for (let p of pages) {
    let url = p.url;
     let title = p.title;

    url = !url.startsWith('http') ? BASE_PATH + url : url;

    // next step: create link and add it to nav
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;

    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
    );

    if (a.host !== location.host) {
        a.toggleAttribute(a.target = '_blank');
    }

    nav.append(a);
}

/* Light/Dark Mode */
document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
            <option value='light dark'>Automatic</option>
            <option value='light'>Light</option>
            <option value='dark'>Dark</option>
		</select>
	</label>`,
);

let prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let select = document.querySelector('select');
select.options[0].textContent = `Automatic (${prefersDark ? 'Dark' : 'Light'})`;

if ("colorScheme" in localStorage) {
    let scheme = localStorage.colorScheme;
    document.documentElement.style.setProperty('color-scheme', scheme);
    select.value = scheme;
}

select.addEventListener('input', function (event) {
    let value = event.target.value;
    document.documentElement.style.setProperty('color-scheme', value);
    localStorage.colorScheme = value; 
    console.log('color scheme changed to', value);
});


/* Projects Page */
// export async function fetchJSON(url) {
//     try {
//         // Fetch the JSON file from the given URL
//         const response = await fetch(url);
//         if (!response.ok) {
//             throw new Error(`Failed to fetch projects: ${response.statusText}`)
//         }
//     } catch (error) {
//         console.error('Error fetching or parsing JSON data:', error);
//     }
// }




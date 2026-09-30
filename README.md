# Ali Ghasemzadeh — Personal Academic Website

Source for [alighasemzadeh83.github.io](https://alighasemzadeh83.github.io), hosted on **GitHub Pages**.

A single-page academic homepage built with plain **HTML, CSS, and JavaScript**
(no build step, no framework). It presents:

- A short bio and research interests (computer vision, medical AI, and
  estimation theory).
- Completed research internship at The University of Hong Kong.
- Publications and manuscripts grouped by current status.
- Research experience and advisors.
- An **interactive collaboration network** of co-authors and advisors, grouped
  by institution ([vis-network](https://github.com/visjs/vis-network)).
- Selected repositories, honors, teaching, and contact information.

## Structure

```
index.html   — page content
style.css    — styling (dark / light themes)
script.js    — theme toggle, scrollspy, collaboration network
img/         — profile photo + paper figures
Ali_Ghasemzadeh_CV.pdf
```

## CV-to-site update checklist

When updating the CV, keep the public website aligned:

- Replace `Ali_Ghasemzadeh_CV.pdf` and confirm the sidebar CV button opens it.
- Update the bio, research interests, internship, publications, research experience, honors, and teaching content in `index.html` as needed.
- Keep News limited to completed milestones, acceptances, submissions, and other current updates.
- Update the `PEOPLE`, `PAPERS`, and `PROJECTS` arrays in `script.js` so the collaboration graph matches the visible research and publication content.
- Confirm each new paper image exists in `img/`; use a text-only publication card if no suitable figure is available.
- Preview locally, check both light and dark modes, and verify all sidebar links and external links.

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

The collaboration network loads `vis-network` from a CDN; everything else works
fully offline.

# Ali Ghasemzadeh — Personal Academic Website

Source for [alighasemzadeh83.github.io](https://alighasemzadeh83.github.io), hosted on **GitHub Pages**.

A single-page academic homepage built with plain **HTML, CSS, and JavaScript**
(no build step, no framework). It presents:

- A short bio and research interests (computer vision, estimation theory,
  convex & semidefinite optimization, medical AI).
- Research internship at The University of Hong Kong.
- Publications & manuscripts, each with its method / main figure and a status
  badge (accepted / under review / preprint).
- Ongoing research projects and advisors.
- An **interactive collaboration network** of co-authors and advisors, grouped
  by institution ([vis-network](https://github.com/visjs/vis-network)).
- Honors, teaching, and contact information.

## Structure

```
index.html   — page content
style.css    — styling (dark / light themes)
script.js    — theme toggle, scrollspy, collaboration network
img/         — profile photo + paper figures
Ali_Ghasemzadeh_CV.pdf
```

## Local preview

Open `index.html` in a browser, or serve the folder:

```bash
python -m http.server 8000
```

The collaboration network loads `vis-network` from a CDN; everything else works
fully offline.

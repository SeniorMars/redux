# apollo-redux

Modern and minimalistic blog theme powered by [Zola](https://getzola.org). See a live preview [here](https://not-matthias.github.io/apollo).

<sub><sup>Named after the greek god of knowledge, wisdom and intellect</sup></sub>

<details open>
  <summary>Dark theme</summary>

  ![blog-dark](./screenshot-dark.png)
</details>

<details>
  <summary>Light theme</summary>

![blog-light](./screenshot.png)
</details>

## Features

- [X] Pagination
- [X] Themes (light, dark, auto)
- [X] Projects page
- [X] Analytics using [GoatCounter](https://www.goatcounter.com/) / [Umami](https://umami.is/)
- [x] Social Links
- [x] MathJax Rendering
- [x] Taxonomies
- [x] Meta Tags For Individual Pages
- [ ] Search
- [ ] Categories

## Installation

1. Download the theme
```
git submodule add https://github.com/seniormars/redux themes/redux
```

2. Add `theme = "redux"` to your `config.toml`
3. Copy the example content

```
cp -r themes/redux/content content
```

## Development

Generated JavaScript bundles are checked in with their source maps. After
editing `static/js/search.js`, `static/js/searchElasticlunr.js`, or any
`static/js/*-loader.js` file, install the pinned tooling once and regenerate the
bundles:

```
npm install
npm run build:js
```

## Options

### Comment

You can enable comment (Giscus) for each page:

```toml
[extra]
comment = true
```

And then save your script from [Giscus](https://giscus.app) to `templates/_giscus_script.html`.

### Additional stylesheets

You can add stylesheets to override the theme:

```toml
[extra]
stylesheets = [
    "override.css",
    "something_else.css"
]
```

These filenames are relative to the root of the site. In this example, the two CSS files would be in the `static` folder.

### Images

Card images and image shortcodes are lazy-loaded by default. For Markdown images
rendered by Zola itself, enable lazy async image output in your site config:

```toml
[markdown]
lazy_async_image = true
```

If a shortcode image is above the fold, opt it back into eager loading:

```tera
{{ image(sources=["hero.webp"], fallback_path="/hero.jpg", fallback_alt="Hero", loading="eager") }}
```

### MathJax

To enable MathJax equation rendering, set the variable `mathjax` to `true` in
the `extra` section of your config.toml. Set `mathjax_dollar_inline_enable` to 
`true` to render inline math by surrounding them inside $..$.

```toml
[extra]
mathjax = true
mathjax_dollar_inline_enable = true
```

By default, MathJax is loaded only on pages that contain math-like content. The
AsciiMath input extension is disabled unless you opt in:

```toml
[extra]
mathjax_asciimath = true
```

If you want to control cache headers yourself, host MathJax with your site or
CDN and point the theme at that file:

```toml
[extra]
mathjax_src = "/js/mathjax/tex-mml-chtml.js"
```

For better initial load performance, MathJax is loaded after the page load event
and during an idle period by default. Use `mathjax_load = "eager"` when equations
must render as soon as possible, or `mathjax_load = "load"` to load immediately
after the page load event.

MathJax 4 enables speech and Braille exploration in its combined components by
default, which can load extra Speech Rule Engine assets. This theme disables that
path by default for performance. Enable it when your site depends on MathJax's
interactive accessibility tooling:

```toml
[extra]
mathjax_accessibility = true
```

### Mermaid

To enable Mermaid diagram rendering, set `mermaid` to `true` in the `extra`
section of your config.toml.

```toml
[extra]
mermaid = true
```

Mermaid is a large JavaScript bundle, so the theme waits until a diagram is near
the viewport before loading and rendering it. Use `mermaid_load = "idle"` to
render all diagrams after page load during idle time, or `mermaid_load = "eager"`
to render immediately.

### Table of contents

Enable `toc` to render a page table of contents. By default, the theme can show
both an inline table of contents in the article and a sidebar table of contents:

```toml
[extra]
toc = true
toc_inline = true
toc_sidebar = true
```

Set either `toc_inline` or `toc_sidebar` to `false` when you only want one
placement. Individual pages can override the defaults with `toc_inline` and
`toc_sidebar` in page front matter.

## Config

 ### Customize `<meta/>` tags 

 The following TOML and YAML code will yiled two `<meta/>` tags, `<meta property="og:title" content="the og title"/>`, `<meta property="og:description" content="the og description"/>`. 

 TOML: 

 ```toml
 title = "post title"
 description = "post desc"
 date = "2023-01-01"

 [extra]
 meta = [
     {property = "og:title", content = "the og title"},
     {property = "og:description", content = "the og description"},
 ]
 ```

 YAML: 

 ```yaml
 title: "post title"
 description: "post desc"
 date: "2023-01-01"
 extra: 
     meta: 
         - property: "og:title"
           content: "the og title"
         - property: "og:description"
           content: "the og description"
 ```

 If the `og:title`, the `og:description`, or the "description" are not set, the page's title and description will be used. That is, the following TOML code generates `<meta property="og:title" content="post title"/>`, `<meta property="og:description" content="post desc"/>`, and `<meta property="og:description" content="post desc"/>` as default values. 

 ```toml
 title = "post title"
 description = "post desc"
 date = "2023-01-01"
 ```

## References

This theme is based on [archie-zola](https://github.com/XXXMrG/archie-zola/).

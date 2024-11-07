# Notes

## Resume

The resume HTML is comprised of a single paragraph representing a position. Each position is made up of a Title, Company, Dates, and an optional description.

↓↓↓↓↓↓↓↓↓↓

```
<p class="resume">
<span class="position">POSTITION TITLE</span><br>
<span class="company">COMPANY</span>
<span class="date">DATES</span>
<span class="description">DESCRIPTION (Optional)</span>
</p>
```

## Writing

All posts begin with the following YAML Header to define metadata. `layout: ../../post-layout.astro` defines the page styling and should be included for all posts. 

```
---
title: TITLE
date: POST DATE
layout: ../../post-layout.astro
---
```

### RSS Feed

You can change the information in the RSS feed by editing the javascript in `/src/pages/feed.xml.js`

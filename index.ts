/// <reference path="index.d.ts" />

import Metalsmith = require('metalsmith');
import discoverPartials = require('metalsmith-discover-partials');
import layouts = require('metalsmith-layouts');

import getProcessedData from './skills';
import './helpers';

new Metalsmith(__dirname)
  .source('./src')
  .destination('./build')
  .clean(false)
  .use(async (files, _, done) => {
    const {root, categories, skills} = await getProcessedData();

    files[`index.html`] = {
      root,
      contents: '',
      layout: 'index.hbs',
    };

    files[`graph.html`] = {
      skills,
      contents: '',
      layout: 'graph.hbs',
    };

    categories.forEach(category => {
      files[`${category.slug}.html`] = {
        category,
        contents: '',
        layout: 'category.hbs',
      };
    });

    skills.forEach(skill => {
      files[`${skill.slug}.html`] = {
        skill,
        contents: '',
        layout: 'skill.hbs',
      };
    });

    done();
  })
  .use(discoverPartials())
  .use(layouts())
  .build(err => {
    if (err) throw err;
  });

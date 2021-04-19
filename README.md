# CoreSkill Skill System

## View

Go to [coreskill.github.io/csss](https://coreskill.github.io/csss/).

## Install

```sh
npm install
```

## Build

```sh
npm run build
```

Then, look into `build` folder.

## Develop

Watching, compiling and automatic reloading.

```sh
npm run dev
```

## Content guidelines

Complex example showing all options.

Please use quotation marks for everything that has them in the example (and vice versa).

Also keep keys ordered as suggested.

Generally we try to sort items according to their level but sometimes it makes more sense to break this rule.

```yaml
---
skill: "Example"
level: 2
sublevel: 1
text: "Example text with the skill"
requires:
  - "Example from the same file"
  - "Example section // Example from the same section"
  - "// Another example section // Example from the different section (Absolute path)"
resources:
  - url: https://example.com/
    desc: "Only url is required for resources, all others are optional"
    type: reference
    lang: en
  - url: https://example.com/simplest-example
```

# CoreSkill Skill System

## View

Go to [your.coreskill.tech](https://your.coreskill.tech).

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
text: |
  Example text with the skill
requires:
  - "Example from the same file"
  - "Example section // Example from the same section"
  - "// Another example section // Example from the different section (Absolute path)"
resources:
  - url: https://example.com/
    desc: "Only url is required for resources, all others are optional"
    text: |
      Longer description explaining more about what is expected to do with this resource.
    type: reference
    lang: en
    status: replace
  - url: https://example.com/simplest-example
```

Status values:
- ok: we’re happy with the resource
- check: resources should be checked if ok or needs changes
- improvemeta: we’re happy with the resource itself but meta information should be improved
- replace: the resource should be replaced with a better one in the future

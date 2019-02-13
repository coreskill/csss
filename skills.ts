import * as path from 'path';
import * as dir from 'node-dir';
import * as yaml from 'js-yaml';
import * as slug from 'slug';

slug.charmap['<'] = '';
slug.charmap['>'] = '';

export interface CNode {
  name: string;
  slug: string;
  parent: Category | CRoot;
  children?: CNode[];
  categories: Category[];
}

export interface CRoot {
  parent?: undefined;
  children: CNode[];
}

export interface Category extends CNode {
  children: CNode[];
}

export interface Skill extends CNode {
  parent: Category;
  children?: undefined;
  skill: true;

  stringCategories: string[];
  stringRequires: string[][];

  requires: Skill[];
  requiredBy: Skill[];
  sameLevelSkills: Skill[];
}

export interface CategoryMetadata {
  categories: string[];
  metadata: object;
}

const slugs = new Set(['index', 'graph', 'constructor']);
const getSlug = (input: string) => {
  let slugFromInput = slug(input).toLowerCase();
  let finalSlug = slugFromInput;
  for (let i = 1; slugs.has(finalSlug); i++) finalSlug = slugFromInput + i.toString(36);
  slugs.add(finalSlug);
  return finalSlug;
}

const loadSkills = () => new Promise<[Skill[], CategoryMetadata[]]>((resolve, reject) => {
  let contents: string[] = [];
  dir.readFiles('./skills', (err, content, next) => {
    if (err) return reject(err);
    contents.push(content as string);
    next();
  }, (err, files) => {
    if (err) return reject(err);
    resolve(files.reduce<[Skill[], CategoryMetadata[]]>(([skills, categoryInfos], filename, i) => {
      let content = yaml.safeLoadAll(contents[i]);
      let categories = filename.replace(/\.ya?ml$/, '').split(path.sep).slice(1).map(name => name.replace(/^\d+ /, ''));
      if (!content[0].skill) {
        categoryInfos.push({
          categories,
          metadata: content.shift(),
        });
      }
      content.forEach((skill) => {
        skill.name = skill.skill;
        skill.skill = true;
        skill.slug = getSlug(skill.name);
        skill.stringCategories = categories;
        skill.stringRequires = (skill.requires || []).map((r: string) => r.split(/ ?\/\/ /));
        delete skill.requires;
        skill.requires = [];
        skill.requiredBy = [];
    });
      return [[...skills, ...content], categoryInfos];
    }, [[], []]));
  });
});

export default async () => {
  let [skills, categoryInfos] = await loadSkills();
  let root: CRoot = {children: []};
  let categories: Category[] = [];

  // Prepare categories, including their relations
  skills.forEach(skill => {
    let parent = skill.stringCategories.reduce<Category>((node, stringCategory) => {
      // node.children = node.children || [];
      let category = node.children.find(child => child.name === stringCategory) as Category;
      if (category) {
        return category;
      } else {
        let newCategory: Category = {
          name: stringCategory,
          slug: getSlug(stringCategory),
          parent: node,
          children: [],
          categories: [],
        };
        node.children.push(newCategory);
        categories.push(newCategory);
        return newCategory;
      }
    }, root as any);

    skill.parent = parent;
    // parent.children = parent.children || [];
    parent.children.push(skill);
  });

  // Process required skills
  skills.forEach(skill => {
    skill.requires = skill.stringRequires.map(stringRequire => {

      let firstParentName = stringRequire[0];
      let node: CNode | CRoot | undefined;

      if (firstParentName === '') {
        node = root;
      } else {
        let currentNode: Category | CRoot = skill.parent;
        do {
          node = currentNode.children!.find(c => c.name === firstParentName);
          if (node) {
            break;
          }

          currentNode = currentNode.parent;
        } while (currentNode);

        if (!node) {
          console.error('ups, not found this required skill: “%s” for “%s” in “%s.yml”', stringRequire, skill.name, skill.parent.name);
          throw new Error('ups');
        }
      }

      stringRequire.slice(1).forEach(r => {
        node = node!.children!.find(c => c.name === r);

        if (!node) {
          console.error('ups, not found this required skill: “%O” for “%s” in “%s.yml”', stringRequire, skill.name, skill.parent.name);
          throw new Error('ups');
        }
      });

      let requiredSkill = node as Skill;
      requiredSkill.requiredBy.push(skill);
      return requiredSkill;
    });
  });

  // Also process same-level skills and flatten categories of a skill
  skills.forEach(skill => {
    if (skill.requires.length > 0) {
      let sameLevelSkills = new Set();
      skill.requires.forEach(requiredSkill => {
        skills.forEach(anotherSkill => {
          if (anotherSkill.requires.indexOf(requiredSkill) > -1) {
            sameLevelSkills.add(anotherSkill);
          }
        });
      });
      skill.sameLevelSkills = [...sameLevelSkills].filter(s => s !== skill);
    } else {
      skill.sameLevelSkills = skill.parent.children
        .filter((node): node is Skill => "skill" in node)
        .filter(anotherSkill => anotherSkill.requires.length === 0 && anotherSkill !== skill);
    }

    skill.categories = [];
    for (let parent: Category = skill.parent; parent.parent !== undefined; parent = parent.parent as Category) {
      skill.categories.unshift(parent);
    }
  });

  // And flatten parent categories of a category
  categories.forEach(category => {
    for (let parent = category.parent as Category; parent.parent !== undefined; parent = parent.parent as Category) {
      category.categories.unshift(parent);
    }
  });

  // And assign category metadata to their correct category
  categoryInfos.forEach(({categories, metadata}) => {
    let category: Category | CRoot = root;
    categories.forEach(name => category = category.children.find(cat => cat.name === name) as Category);
    Object.assign(category, metadata);
  });

  // And finally sort subcategories
  root.children.forEach(cat => cat.children && (cat.children as Array<Category & {sort?: number}>).sort((a, b) => ((a.sort || Infinity) - (b.sort || Infinity)) || 0));

  return {root, categories, skills};
}

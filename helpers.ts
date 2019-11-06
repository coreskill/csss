import { registerHelper, SafeString, HelperOptions } from 'handlebars';
import { Skill } from './skills';

registerHelper('ifCategoriesNotEqual', function(this: any, categories1: object[], categories2: object[], options: HelperOptions) {
  if (categories1 && categories2 && categories1[categories1.length - 1] !== categories2[categories2.length - 1]) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

registerHelper('nodes', (skills: Skill[]) => {
  return new SafeString(JSON.stringify(skills.map(skill => ({
    id: skill.slug,
    label: skill.name,
    group: skill.parent.slug,
  })), null, 2));
});

registerHelper('edges', (skills: Skill[]) => {
  return new SafeString(JSON.stringify(skills.reduce<{from: string, to: string, arrows: string}[]>((acc, skill) => [
    ...acc,
    ...(skill.requires || []).map(connectedSkill => ({
      from: connectedSkill.slug,
      to: skill.slug,
      arrows: 'to',
    })),
  ], []), null, 2));
});

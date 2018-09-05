declare type useFunction = (files: Record<string, object>, metalsmith: Metalsmith, done: () => void) => void;

declare class Metalsmith {
  constructor(dir: string);
  source(dir: string): this;
  destination(dir: string): this;
  clean(bool: boolean): this;
  use(fn: useFunction): this;
  build(fn: (error: Error, files: Record<string, object>) => void): void;
}

declare module 'metalsmith' {
  export = Metalsmith;
}

declare module 'metalsmith-discover-partials' {
  function fn(): useFunction;
  export = fn;
}

declare module 'metalsmith-layouts' {
  function fn(): useFunction;
  export = fn;
}

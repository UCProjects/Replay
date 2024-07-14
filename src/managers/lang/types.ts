export type Nodes = string[];

export type ParsedNodes = {
  args: Nodes;
  override: string;
  empty: boolean;
};

export type Plugin = (nodes: Nodes, translate: Translate) => string;

export type Translate = (message: string, ...args: Optional<string[], TranslateOptions>) => string;

export type TranslateOptions = {
  decode?: boolean;
  fallback?: string,
};

import type { ExampleData } from '../state/store';

export interface GraphQLExample {
  query: string;
  variables?: (() => any) | ((data: ExampleData) => any);
}

export interface CSharpExample {
  csharp: string;
}

export interface NodeJSExample {
  nodejs: string;
}

export interface PythonExample {
  python: string;
}

export type Example = GraphQLExample | CSharpExample | NodeJSExample | PythonExample;
export const EXAMPLE_LANGUAGES = [
  'graphql-raw',
  'graphql-interactive',
  'csharp',
  'nodejs',
  'python'
] as const;
export type ExampleLanguage = typeof EXAMPLE_LANGUAGES[number];

export function toLanguageDisplay(input: ExampleLanguage) {
  if (input === 'graphql-raw') {
    return 'GraphQL (Raw)';
  }
  if (input === 'graphql-interactive') {
    return 'GraphQL (Interactive)';
  }
  if (input === 'csharp') {
    return '.NET (C#)';
  }
  if (input === 'nodejs') {
    return 'Node.js';
  }
  if (input === 'python') {
    return 'Python';
  }

  assertUnreachable(input);
}

function assertUnreachable(x: never): never {
  throw new Error("Didn't expect to get here");
}

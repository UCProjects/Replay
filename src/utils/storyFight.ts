const STORY_NAME = /^story-fight-(\d+)-name$/;

export function storyFightOf(name: string): string | undefined {
  return STORY_NAME.exec(name)?.[1];
}

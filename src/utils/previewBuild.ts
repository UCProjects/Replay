const PREVIEW_HOST = /^uc-spectate--[a-z0-9-]+\.web\.app$/;

export function isPreviewHost(hostname: string): boolean {
  return PREVIEW_HOST.test(hostname);
}

export const previewBuild = typeof window !== 'undefined' && isPreviewHost(window.location.hostname);

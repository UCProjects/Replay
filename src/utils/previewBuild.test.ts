import { describe, expect, it } from 'vitest';
import { isPreviewHost } from './previewBuild';

describe('isPreviewHost', () => {
  it('matches a preview channel of the replay site', () => {
    expect(isPreviewHost('uc-spectate--preview-lpnmb29v.web.app')).toBe(true);
  });

  it('does not match the live site or other sites', () => {
    expect(isPreviewHost('replay.uc.feildmaster.com')).toBe(false);
    expect(isPreviewHost('uc-spectate.web.app')).toBe(false);
    expect(isPreviewHost('other--preview-lpnmb29v.web.app')).toBe(false);
    expect(isPreviewHost('localhost')).toBe(false);
  });
});

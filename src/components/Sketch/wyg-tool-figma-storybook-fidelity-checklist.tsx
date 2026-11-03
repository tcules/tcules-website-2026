import type { ReactNode } from 'react';

import type { PageSceneName } from '@/lib/page-scenes';

/* /tools/figma-storybook-fidelity-checklist: the page's still plates (LongformPage family "tool", 4 Nov
   2026): the worked example's STORY scene, inside the example panel beside its words, and the diagram
   after the corrections band's first paragraph. Each drawn from this page's own words. Helpers come
   from ./offer and ./scenes, classes from ./Sketch.module.css. Each scene is undefined until it is
   drawn; the comment above it is the item's title and words. */

export const SCENES: Partial<Record<PageSceneName, () => ReactNode>> = {
  /* Keyboard accessibility component check: a dialog that loses focus (#example): A dialog looks right and opens from the right button. Press Escape and it closes, but focus jumps to the top of the page when it should return to the button that opened it. The acceptance check: close the dialog in its real workflow and confirm focus goes back to the control that opened it. Draw the story: the dialog opened from its button; Escape closes it and the focus ring jumps to the top of the page; the corrected path returns the ring to the button that opened it. No type on the image. */
  'tool-figma-storybook-fidelity-checklist-example': undefined,
  /* Turn what you found into a component corrections list (#corrections): Put first anything that blocks an essential action or shows an important state wrongly. Keep untested and disputed states on their own list, with a note of what would show whether the design, the code or the expectation should change. Give each correction an owner and a check anyone can repeat, and close it when that check passes. Draw the diagram: a corrections list, blockers first, each row carrying an owner and a repeatable check, the untested and disputed states on a separate list. */
  'tool-figma-storybook-fidelity-checklist-corrections': undefined,
};

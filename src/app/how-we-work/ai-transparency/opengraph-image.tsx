import { ROUTES } from '@/lib/routes';

import { shareImage } from '../../_og';

/** This route's share card (ch10 Part C, tracker 6.6): see `_og/index.ts`. */
const og = shareImage(ROUTES.howWeWorkAiTransparency);

export const generateImageMetadata = og.generateImageMetadata;
export default og.Image;

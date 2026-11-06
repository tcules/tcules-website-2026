import { shareImage, under } from '../../../_og';

/** This route's share card (ch10 Part C, tracker 6.6): see `_og/index.ts`. */
const og = shareImage(under('/insights/podcasts'));

export const generateImageMetadata = og.generateImageMetadata;
export default og.Image;

export const dynamic = 'force-dynamic';

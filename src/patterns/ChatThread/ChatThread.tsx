import {
  Cluster,
  Icon,
  Layout,
  LOGOMARK_PATHS,
  LOGOMARK_VIEWBOX,
  Media,
  type MediaImage,
} from '@/components';
import { cx } from '@/lib/cx';
import { CHAT_AVATAR } from '@/lib/image-sizes';

import styles from './ChatThread.module.css';

/** One exchange: what the client says, then what Tcules answers. Plain text, as authored. */
export type ChatThreadExchange = {
  /** The client's line, in their words. Sentence case, no surrounding quotation marks. */
  client: string;
  /** Tcules' reply to it. */
  reply: string;
};

/** A portrait for the client's avatar: the asset record without the fields the thread decides. */
export type ChatThreadAvatar = Pick<MediaImage, 'src' | 'width' | 'height' | 'sources'>;

export type ChatThreadProps = {
  /** The exchanges in reading order. One or more; the boards carry four. */
  exchanges: readonly ChatThreadExchange[];
  /**
   * The thread's accessible name, read when a screen reader enters the list. Defaults to
   * "Conversation"; a band can pass its own ("What founders tell us first").
   */
  label?: string;
  /** The client's spoken name, announced before each of their lines. Default "Client". */
  clientName?: string;
  /** The replying side's spoken name, announced before each reply. Default "Tcules". */
  replyName?: string;
  /**
   * Deprecated and ignored since 18 Nov 2026: the reply's avatar is the Tcules logomark (owner),
   * not a letter. Kept so an existing call site still compiles.
   */
  replyMark?: string;
  /**
   * A photograph for the client's avatar, clipped to the disc. Optional: with none the disc carries
   * the neutral person glyph. Decorative either way (alt ""), since the speaker's name is read.
   */
  clientAvatar?: ChatThreadAvatar;
};

/**
 * ChatThread — a short conversation set as a messaging app sets it: the client ("them") on the
 * start side in a soft grey bubble beside a neutral person avatar, Tcules ("us") on the end side in
 * the lightest brand blue (brandeis-50; 100 on a tint band) with dark text beside the Tcules
 * logomark black on a white disc (owner, 18 Nov 2026, after Jatin's boards of 17 Nov; tracker O.5).
 *
 * Semantics: an `ol` of exchanges, each `li` holding two paragraphs. Every paragraph opens with
 * its speaker's name, visually hidden and announced ("Client: …", "Tcules: …"), so the order and
 * the voices survive without the bubbles; the avatars are aria-hidden.
 *
 * It paints no band, takes no surface prop and sets no outer spacing: the nearest Section supplies
 * the palette and the parent Layout the seam. The arrangement is Layout (the exchanges, 32 apart;
 * a line and its reply, 16 apart) and Cluster (a message and its avatar, foot-aligned on one line).
 * No motion.
 */
export function ChatThread({
  exchanges,
  label = 'Conversation',
  clientName = 'Client',
  replyName = 'Tcules',
  clientAvatar,
}: ChatThreadProps) {
  const items = exchanges.filter((e) => e.client.trim() || e.reply.trim());
  if (items.length === 0) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('ChatThread: exchanges is empty; rendering nothing.');
    }
    return null;
  }
  const portrait =
    clientAvatar && clientAvatar.src.trim() && clientAvatar.width > 0 && clientAvatar.height > 0
      ? clientAvatar
      : undefined;

  return (
    <Layout as="ol" rowGap="gutter" className={styles.root} aria-label={label}>
      {items.map((exchange, i) => (
        <Layout as="li" rowGap="text" key={i} className={styles.exchange}>
          {exchange.client.trim() ? (
            <Cluster nowrap colGap="tight" align="end" justify="start" className={styles.line}>
              <span
                className={cx(styles.avatar, styles.clientAvatar, Boolean(portrait) && styles.portrait)}
                aria-hidden="true"
              >
                {portrait ? (
                  <Media
                    image={{ ...portrait, alt: '', kind: 'photograph' }}
                    sizes={CHAT_AVATAR}
                    fit="fill"
                    edge="placement"
                    focus={AVATAR_FOCUS}
                  />
                ) : (
                  <Icon name="user" size="lg" />
                )}
              </span>
              <p className={cx(styles.bubble, styles.client)}>
                <span className={styles.speaker}>{clientName}: </span>
                {exchange.client}
              </p>
            </Cluster>
          ) : null}
          {exchange.reply.trim() ? (
            <Cluster nowrap colGap="tight" align="end" justify="end" className={styles.line}>
              <p className={cx(styles.bubble, styles.reply)}>
                <span className={styles.speaker}>{replyName}: </span>
                {exchange.reply}
              </p>
              <span className={cx(styles.avatar, styles.replyAvatar)} aria-hidden="true">
                <svg
                  className={styles.logomark}
                  viewBox={`0 0 ${LOGOMARK_VIEWBOX.width} ${LOGOMARK_VIEWBOX.height}`}
                  focusable="false"
                >
                  {LOGOMARK_PATHS.map((d) => (
                    <path key={d} d={d} />
                  ))}
                </svg>
              </span>
            </Cluster>
          ) : null}
        </Layout>
      ))}
    </Layout>
  );
}

const AVATAR_FOCUS = { x: 0.5, y: 0.5 };

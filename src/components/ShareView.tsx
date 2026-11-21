import { QRCodeSVG } from "qrcode.react";
import styles from "./ShareView.module.css";

const appUrl = "https://care-assistant-blue.vercel.app/";

type Props = { onMessage: (message: string) => void };

export default function ShareView({ onMessage }: Props) {
  async function copyLink() {
    if (!navigator.clipboard) {
      onMessage("Copy is not available here — use the link below");
      return;
    }
    try {
      await navigator.clipboard.writeText(appUrl);
      onMessage("Link copied");
    } catch {
      onMessage("Copy failed — use the link below");
    }
  }

  return (
    <section
      className={`view active ${styles.share}`}
      aria-labelledby="share-title"
    >
      <div className="page-heading">
        <p className="eyebrow">Take it with you</p>
        <h2 id="share-title">Share Care assistant</h2>
        <p className="muted">
          Scan this code with a phone to open the app, then add it to the home
          screen.
        </p>
      </div>
      <div className={styles.card}>
        <QRCodeSVG
          value={appUrl}
          size={220}
          bgColor="#fffdf8"
          fgColor="#243a36"
          level="M"
          includeMargin
        />
        <p className={styles.url}>{appUrl}</p>
        <button className="primary-button" type="button" onClick={copyLink}>
          Copy app link
        </button>
      </div>
    </section>
  );
}

import { QRCodeSVG } from "qrcode.react";
import PrimaryButton from "./PrimaryButton";
import styles from "./ShareView.module.css";

type Props = { onMessage: (message: string) => void };

export default function ShareView({ onMessage }: Props) {
  const appUrl = `${window.location.origin}/carer`;
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
    <section className={`view active ${styles.share}`} aria-labelledby="share-title">
      <div className="page-heading">
        <p className="eyebrow">Take it with you</p>
        <h2 id="share-title">Share Carekin</h2>
        <p className="muted">
          Scan this code with a phone to open the app, then add it to the home screen.
        </p>
      </div>
      <div className={styles.card}>
        <div role="img" aria-label={`QR code for the Carekin app at ${appUrl}`}>
          <QRCodeSVG
            value={appUrl}
            size={220}
            bgColor="#fffdf8"
            fgColor="#243a36"
            level="M"
            includeMargin
          />
        </div>
        <p className={styles.url}>{appUrl}</p>
        <PrimaryButton onClick={copyLink}>Copy app link</PrimaryButton>
      </div>
    </section>
  );
}

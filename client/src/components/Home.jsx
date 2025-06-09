import { Link } from "react-router-dom";
import styles from "../styles/Home.module.css";

export default function Home() {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to your Mood Tracker</h1>
            <p className={styles.subtitle}>Choose where you’d like to go:</p>

            <div className={styles.links}>
                <Link to="/tracker" className={styles.link}>Track Your Mood</Link>
                <Link to="/history" className={styles.link}>Mood History</Link>
                <Link to="/settings" className={styles.link}>Settings</Link>
            </div>
        </div>
    );
}
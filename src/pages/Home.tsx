import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import type { Module, Profile } from "../types";
import "./home.css";

const cleanCopy = (value: string) =>
  value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

export default function Home({ prof }: { prof: Profile }) {
  const [modules, setModules] = useState<Module[]>([]);
  const [exams, setExams] = useState<Array<{ id: string; title: string }>>([]);

  useEffect(() => {
    getDocs(query(collection(db, "modules"), orderBy("order"))).then((snapshot) =>
      setModules(
        snapshot.docs.map((item) => ({
          ...(item.data() as Module),
          id: item.id,
        })),
      ),
    );
    getDocs(collection(db, "exams")).then((snapshot) =>
      setExams(
        snapshot.docs.map((item) => ({
          id: item.id,
          title: (item.data() as { title?: string }).title || "Java checkpoint",
        })),
      ),
    );
  }, []);

  const xp = prof.xp ?? 0;
  const completedLessons = modules.filter((module) =>
    module.id ? Boolean(prof.done[module.id]) : false,
  ).length;
  const courseProgress = modules.length
    ? Math.round((completedLessons / modules.length) * 100)
    : 0;
  const nextModule =
    modules.find((module) => module.id && !prof.done[module.id]) || modules[0];
  const nextModuleId = nextModule?.id;
  const nextModuleIsComplete = nextModuleId
    ? Boolean(prof.done[nextModuleId])
    : false;
  const playerName = prof.email?.split("@")[0] || "player";
  const level = Math.floor(xp / 100) + 1;

  return (
    <div className="home-dashboard">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="eyebrow">PLAYER HUB / READY FOR ANOTHER RUN?</p>
          <h1>
            Keep your Java <span>momentum.</span>
          </h1>
          <p className="home-hero-lede">
            Welcome back, {playerName}. Build confidence one challenge at a time
            and turn today&apos;s practice into tomorrow&apos;s fluency.
          </p>
          <div className="home-hero-actions">
            {nextModuleId && (
              <Link className="button button-primary" to={`/lesson/${nextModuleId}`}>
                <span>{nextModuleIsComplete ? "Review a lesson" : "Continue learning"}</span>
                <span className="button-arrow">→</span>
              </Link>
            )}
            <Link className="button button-ghost" to="/leaderboard">
              See the leaderboard
            </Link>
          </div>
          <div className="home-hero-meta">
            <span>
              <i className="status-dot" /> Cloud progress synced
            </span>
            <span>Last run: today</span>
          </div>
        </div>
        <div className="home-hero-art" aria-hidden="true">
          <div className="home-hero-orbit home-hero-orbit-one" />
          <div className="home-hero-orbit home-hero-orbit-two" />
          <div className="home-hero-level">
            <span>CURRENT LEVEL</span>
            <strong>{String(level).padStart(2, "0")}</strong>
          </div>
          <img alt="Java Quest mascot" src="/mascot.png" />
          <div className="home-hero-art-label">
            <span>XP RUN</span>
            <strong>{xp} XP</strong>
          </div>
        </div>
      </section>

      <section aria-label="Your overview" className="home-stat-grid">
        <div className="home-stat-card home-stat-card-accent">
          <span className="home-stat-icon">✦</span>
          <div>
            <span className="home-stat-label">Current streak</span>
            <strong>{prof.streak ?? 0} days</strong>
            <small>Keep the chain alive</small>
          </div>
        </div>
        <div className="home-stat-card">
          <span className="home-stat-icon">✓</span>
          <div>
            <span className="home-stat-label">Course progress</span>
            <strong>{courseProgress}%</strong>
            <small>
              {completedLessons} of {modules.length || "—"} modules complete
            </small>
          </div>
        </div>
        <div className="home-stat-card">
          <span className="home-stat-icon">⌁</span>
          <div>
            <span className="home-stat-label">Next milestone</span>
            <strong>{Math.max(0, 100 - (xp % 100))} XP</strong>
            <small>Until your next level</small>
          </div>
        </div>
      </section>

      <section>
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">THE CURRICULUM</p>
            <h2>Choose your next mission</h2>
          </div>
          <span className="home-section-count">{modules.length} modules</span>
        </div>
        {modules.length ? (
          <div className="home-module-grid">
            {modules.map((module) => {
              const moduleId = module.id ?? String(module.order);
              const isComplete = module.id ? Boolean(prof.done[module.id]) : false;
              return (
                <Link
                  className={isComplete ? "home-module-card is-complete" : "home-module-card"}
                  key={moduleId}
                  to={`/lesson/${moduleId}`}
                >
                  <div className="home-module-topline">
                    <span>MODULE {String(module.order).padStart(2, "0")}</span>
                    <span>{isComplete ? "COMPLETE" : "+60 XP"}</span>
                  </div>
                  <div className="home-module-icon">{module.emoji}</div>
                  <h3>{module.title}</h3>
                  <p>{cleanCopy(module.learn).slice(0, 108)}…</p>
                  <div className="home-module-footer">
                    <span>{isComplete ? "Replay mission" : "Open lesson"}</span>
                    <span className="home-module-arrow">→</span>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="home-empty-state">
            <span className="home-empty-icon">◌</span>
            <div>
              <h3>Your first mission is loading</h3>
              <p>An admin can add lessons to populate the curriculum.</p>
            </div>
          </div>
        )}
      </section>

      <section className="home-checkpoints">
        <div className="home-checkpoints-copy">
          <p className="eyebrow">CHECKPOINTS</p>
          <h2>Prove what you know.</h2>
          <p>
            Exams turn your practice into a clear signal of progress. Take one
            when you&apos;re ready, then use your history to spot what to revisit.
          </p>
          <Link className="text-link" to="/history">
            View attempt history <span>↗</span>
          </Link>
        </div>
        <div className="home-exam-list">
          {exams.length ? (
            exams.slice(0, 3).map((exam, index) => (
              <Link className="home-exam-row" key={exam.id} to={`/exam/${exam.id}`}>
                <span className="home-exam-number">0{index + 1}</span>
                <span className="home-exam-title">{exam.title}</span>
                <span className="home-module-arrow">→</span>
              </Link>
            ))
          ) : (
            <p className="home-no-exams">No checkpoints available yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}

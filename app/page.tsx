import Image from 'next/image';
import { getAssetPath } from './utils/basePath';
import {
  experience,
  news,
  older,
  posters,
  profile,
  publications,
  skills,
  work,
  type Entry,
  type Link,
} from './content';

const href = (link: Link) => (link.href.startsWith('/') ? getAssetPath(link.href) : link.href);

function Authors({ names }: { names: string[] }) {
  return (
    <div className="authors">
      {names.map((n, i) => (
        <span key={n}>
          {n === 'M. Borek' ? <b>{n}</b> : n}
          {i < names.length - 1 ? ', ' : ''}
        </span>
      ))}
    </div>
  );
}

function Item({ entry }: { entry: Entry }) {
  return (
    <article className="item">
      <Image
        className="thumb"
        src={getAssetPath(entry.image)}
        alt={entry.imageAlt}
        width={480}
        height={320}
      />
      <div>
        <h3>
          {entry.title}
          {entry.year && <span className="year"> {entry.year}</span>}
        </h3>
        {entry.authors && <Authors names={entry.authors} />}
        {entry.venue && <div className="venue">{entry.venue}</div>}
        <p className="desc">{entry.description}</p>
        {entry.links && (
          <div className="item-links">
            {entry.links.map((l) => (
              <a key={l.label} href={href(l)}>
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main className="wrap">
      <header className="top">
        <h1>{profile.name}</h1>
        <p className="role">{profile.role}</p>
        <nav className="links">
          {profile.links.map((l) => (
            <a key={l.label} href={href(l)}>
              {l.label}
            </a>
          ))}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
        </nav>
      </header>

      <section className="bio">
        <p>
          I&apos;m a machine learning researcher in the{' '}
          <a href="https://www.midilab.org">Medical Imaging and Data Integration Lab</a> at MSU&apos;s
          Institute for Quantitative Health Science and Engineering. Our group works with CDC/NIOSH on
          screening chest X-rays for pneumoconiosis, the lung disease miners and industrial workers get
          from breathing coal and silica dust.
        </p>
        <p>
          My part is adapting vision and multimodal foundation models to this problem, and building the
          offline desktop application that lets radiologists and B&nbsp;readers actually use them. I also
          mentor undergraduates in the lab.
        </p>
        <p>
          I finished my B.S. in Computational Data Science, with a minor in mathematics, at MSU in 2026.
          Alongside my degree I spent three years at <a href="https://icer.msu.edu">iCER</a>, MSU&apos;s
          HPC center, writing tools for people who run jobs on the cluster. On the side I&apos;m co-founding
          DockPilot, which makes scheduling software for warehouse loading docks.
        </p>
      </section>

      <section>
        <h2>News</h2>
        <ul className="news">
          {news.map((n) => (
            <li key={n.date}>
              <span className="date">{n.date}</span>
              <span>{n.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Publications</h2>
        {publications.map((e) => (
          <Item key={e.title} entry={e} />
        ))}
        <h2 className="sub">Posters</h2>
        {posters.map((e) => (
          <Item key={e.title} entry={e} />
        ))}
      </section>

      <section>
        <h2>Selected work</h2>
        {work.map((e) => (
          <Item key={e.title} entry={e} />
        ))}
      </section>

      <section>
        <h2>Experience</h2>
        <ul className="cv">
          {experience.map((r) => (
            <li key={r.title}>
              <div className="cv-head">
                <span>
                  {r.title} <span className="muted">· {r.org}</span>
                </span>
                <span className="date">{r.when}</span>
              </div>
              <div className="cv-note">{r.note}</div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Education</h2>
        <ul className="cv">
          <li>
            <div className="cv-head">
              <span>
                B.S. Computational Data Science, minor in Mathematics{' '}
                <span className="muted">· Michigan State University</span>
              </span>
              <span className="date">2022 – 2026</span>
            </div>
            <div className="cv-note">
              Dean&apos;s List 7 of 8 semesters. EGRID Silver Scholarship (2024), REHS Teamwork Excellence
              Award (2025), International Tuition Grant (2022).
            </div>
          </li>
        </ul>
        <p className="small">
          Outside the lab I co-founded the Polish Student Association at MSU, which reached 250 members in
          its first year, and was a Resident Assistant for a hall of 100+ students. I&apos;m a native Polish
          speaker.
        </p>
      </section>

      <section>
        <h2>Skills</h2>
        <dl className="skills">
          {skills.map((s) => (
            <div key={s.area}>
              <dt>{s.area}</dt>
              <dd>{s.items}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h2>Older projects</h2>
        <ul className="older">
          {older.map((o) => (
            <li key={o.name}>
              {o.href ? <a href={o.href}>{o.name}</a> : o.name}: {o.text}
            </li>
          ))}
        </ul>
      </section>

      <footer>
        <a href={`mailto:${profile.email}`}>{profile.email}</a> · East Lansing, Michigan · Updated September
        2026
      </footer>
    </main>
  );
}

import { useEffect, useRef, useState } from 'react';
import { SiReact, SiNextdotjs, SiTailwindcss, SiNodedotjs, SiOpenai, SiFramer } from 'react-icons/si';
import { FiGithub, FiLinkedin, FiMail, FiExternalLink } from 'react-icons/fi';

import LogoLoop from './components/LogoLoop/LogoLoop';
import OrbitImages from './components/OrbitImages/OrbitImages';
import ProfileCard from './components/ProfileCard/ProfileCard';
import ScrollFloat from './components/ScrollFloat/ScrollFloat';
import ScrollVelocity from './components/ScrollVelocity/ScrollVelocity';
import CursorLens from './components/CursorLens/CursorLens';

/* ────────────────────────────────────────────────────────────
   DATA
   ──────────────────────────────────────────────────────────── */

const techLogos = [
  { node: <SiReact color="#61DAFB" />, title: 'React' },
  { node: <SiNextdotjs color="#ffffff" />, title: 'Next.js' },
  { node: <SiTailwindcss color="#38BDF8" />, title: 'Tailwind CSS' },
  { node: <SiNodedotjs color="#68A063" />, title: 'Node.js' },
  { node: <SiOpenai color="#ffffff" />, title: 'OpenAI' },
  { node: <SiFramer color="#ffffff" />, title: 'Framer Motion' },
];

const orbitImages = [
  'https://picsum.photos/300/300?grayscale&random=10',
  'https://picsum.photos/300/300?grayscale&random=20',
  'https://picsum.photos/300/300?grayscale&random=30',
  'https://picsum.photos/300/300?grayscale&random=40',
];

const orbitLabels = ['Air Draw', 'Fruit Ninja', 'Flappy Bird', 'Dashboard'];

const projects = [
  {
    title: 'WebRyza',
    desc: 'AI-powered web analysis tool that extracts insights from any webpage using LLM integration.',
    tech: ['React', 'Node.js', 'OpenAI', 'LangChain'],
    link: '#',
  },
  {
    title: 'Gesture Studio',
    desc: 'Suite of hand-gesture controlled applications — Air Draw, Fruit Ninja, Flappy Bird.',
    tech: ['React', 'MediaPipe', 'Canvas API', 'WebRTC'],
    link: '#',
  },
  {
    title: 'AI Content Engine',
    desc: 'Automated content generation pipeline powered by custom fine-tuned LLMs.',
    tech: ['Python', 'FastAPI', 'GPT-4', 'Redis'],
    link: '#',
  },
  {
    title: 'Neural Dashboard',
    desc: 'Real-time analytics dashboard with AI-driven predictions and anomaly detection.',
    tech: ['Next.js', 'D3.js', 'TensorFlow.js', 'WebSocket'],
    link: '#',
  },
];

const scrollVelocityTexts = [
  'Frontend Developer  •  Creative Developer  •  AI Integrations  •',
  'Building Real Products  •  GenAI / LLM  •  Full Stack  •',
];

/* ────────────────────────────────────────────────────────────
   APP COMPONENT
   ──────────────────────────────────────────────────────────── */

export default function App() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);

    const handleMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Mouse Glow */}
      <div
        className="mouse-glow"
        style={{ left: mousePos.x, top: mousePos.y }}
      />

      {/* ── Navigation ─────────────────────────────────── */}
      <nav className="nav" id="nav">
        <a className="nav__link" onClick={() => scrollTo('hero')} href="#hero">Home</a>
        <a className="nav__link" onClick={() => scrollTo('about')} href="#about">About</a>
        <div className="nav__logo">
          <span>LS</span>
        </div>
        <a className="nav__link" onClick={() => scrollTo('projects')} href="#projects">Projects</a>
        <a className="nav__link" onClick={() => scrollTo('contact')} href="#contact">Contact</a>
      </nav>

      {/* ── 1. HERO SECTION ────────────────────────────── */}
      <section className="hero section" id="hero">
        <CursorLens
          baseImage="/avatar.png"
          revealImage="/vr.png"
          className="cursor-lens-container"
          blobSize={150} /* Increased to match the large reference lens */
          objectFit="contain" /* Changed to 'contain' to decrease the avatar size */
        />
        <div className="hero__scroll-indicator fade-in-up delay-5">
          <span>Scroll</span>
          <div className="hero__scroll-line" />
        </div>
      </section>

      {/* ── 2. TECH STACK SECTION ──────────────────────── */}
      <section className="tech-stack" id="tech-stack">
        <p className="tech-stack__label">Tech Stack</p>
        <LogoLoop
          logos={techLogos}
          speed={80}
          direction="left"
          logoHeight={42}
          gap={60}
          hoverSpeed={20}
          scaleOnHover
          fadeOut
          fadeOutColor="#050505"
          ariaLabel="Technology stack"
        />
      </section>

      {/* ── 3. FEATURED PROJECT (Orbit) ────────────────── */}
      <section className="section featured" id="featured">
        <div className="container">
          <div className="section-label">Featured Project</div>
        </div>
        <div className="featured__orbit-wrapper">
          <OrbitImages
            images={orbitImages}
            shape="circle"
            radius={280}
            rotation={-6}
            duration={30}
            itemSize={90}
            responsive={true}
            centerContent={
              <div>
                <div className="featured__center-label">Gesture Studio</div>
                <div className="featured__center-sub">Hand-Tracking Powered</div>
              </div>
            }
          />
        </div>
        {/* Orbit item labels */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: '1rem',
          padding: '0 1rem'
        }}>
          {orbitLabels.map((label) => (
            <span key={label} style={{
              fontSize: '0.8rem',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-display)',
            }}>
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* ── 4. PROJECTS SECTION ────────────────────────── */}
      <section className="section" id="projects">
        <div className="container">
          <div className="section-label">Projects</div>
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
            containerClassName="projects-heading"
            textClassName="projects-heading-text"
          >
            Selected Work
          </ScrollFloat>
          <div className="projects-grid">
            {projects.map((project, i) => (
              <div className="project-card" key={project.title} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="project-card__content">
                  <h3 className="project-card__title">{project.title}</h3>
                  <p className="project-card__desc">{project.desc}</p>
                  <div className="project-card__tech">
                    {project.tech.map((t) => (
                      <span className="project-card__tech-tag" key={t}>{t}</span>
                    ))}
                  </div>
                  <a className="project-card__link" href={project.link} target="_blank" rel="noreferrer">
                    View Project
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. ABOUT SECTION ───────────────────────────── */}
      <section className="section about" id="about">
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="section-label" style={{ alignSelf: 'flex-start' }}>About</div>
          <ProfileCard
            name="Lalith Srinivas"
            title="Creative Developer"
            handle="lalithsrinivas"
            status="Building"
            contactText="Say Hello"
            avatarUrl="/avatar.png"
            showUserInfo={true}
            enableTilt={true}
            behindGlowEnabled
            innerGradient="linear-gradient(145deg, #1a0533cc 0%, #0d1b2acc 100%)"
            behindGlowColor="rgba(167, 139, 250, 0.5)"
            onContactClick={() => scrollTo('contact')}
          />
          <div className="about__text" style={{ marginTop: '3rem' }}>
            <p>
              <strong>2nd year engineering student</strong> passionate about building
              real-world products that blend creativity with cutting-edge technology.
            </p>
            <p>
              Focused on <strong>GenAI / LLM</strong> integrations and crafting immersive
              web experiences. Currently building projects like <strong>WebRyza</strong> and
              the <strong>Gesture Studio</strong> suite.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. SKILLS / IDENTITY ───────────────────────── */}
      <section className="skills-section" id="skills">
        <ScrollVelocity
          texts={scrollVelocityTexts}
          velocity={80}
          className="scroll-velocity-text"
        />
      </section>

      {/* ── 7. CONTACT SECTION ─────────────────────────── */}
      <section className="section contact" id="contact">
        <div className="container">
          <div className="section-label" style={{ justifyContent: 'center' }}>Get in Touch</div>
          <h2 className="contact__heading gradient-text">Let's Build Together</h2>
          <p className="contact__sub">
            Have a project in mind or want to collaborate? I'd love to hear from you.
          </p>
          <div className="contact__links">
            <a className="contact__link" href="mailto:pattemlalith1267@gmail.com" id="contact-email">
              <FiMail /> Email
            </a>
            <a className="contact__link" href="https://github.com/Lalith-srinivas" target="_blank" rel="noreferrer" id="contact-github">
              <FiGithub /> GitHub
            </a>
            <a className="contact__link" href="https://www.linkedin.com/in/lalith-pattem" target="_blank" rel="noreferrer" id="contact-linkedin">
              <FiLinkedin /> LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* ── 8. FOOTER ──────────────────────────────────── */}
      <footer className="footer" id="footer">
        <div className="footer__large-name">LALITH SRINIVAS</div>
        <div className="footer__bottom">
          <span className="footer__copy">© 2026 Lalith Srinivas. All rights reserved.</span>
          <div className="footer__socials">
            <a className="footer__social-link" href="https://github.com/Lalith-srinivas" target="_blank" rel="noreferrer" aria-label="GitHub">
              <FiGithub />
            </a>
            <a className="footer__social-link" href="https://www.linkedin.com/in/lalith-pattem" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <FiLinkedin />
            </a>
            <a className="footer__social-link" href="mailto:pattemlalith1267@gmail.com" aria-label="Email">
              <FiMail />
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}

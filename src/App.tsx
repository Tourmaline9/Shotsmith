import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, FormEvent, PointerEvent as ReactPointerEvent } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import heroBottle from './assets/hero.png'
import whyWoman from './assets/why-woman.png'
import './App.css'

const heroWomanImage =
  'https://raw.githubusercontent.com/Tourmaline9/Shotsmith/43e7877b97531d92a45fb271e149c06cd84b862c/ChatGPT%20Image%20Jun%2018%2C%202026%2C%2006_32_36%20AM.png'

const formulationMatrixImage =
  'https://raw.githubusercontent.com/Tourmaline9/Shotsmith/43e7877b97531d92a45fb271e149c06cd84b862c/ChatGPT%20Image%20Jun%2018%2C%202026%2C%2006_39_33%20AM.png'

gsap.registerPlugin(ScrollTrigger)

type IngredientStory = {
  name: string
  latin: string
  tone: string
  imageUrl: string
  note: string
  benefits: string[]
}

type Formulation = {
  orbit: string
  label: string
  name: string
  tagline: string
  items: Array<{
    ingredient: string
    detail: string
  }>
}

const ingredients: IngredientStory[] = [
  {
    name: 'Ginger',
    latin: 'Zingiber officinale',
    tone: 'rgba(201, 143, 88, 0.45)',
    imageUrl: 'https://images.pexels.com/photos/5202089/pexels-photo-5202089.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=800',
    note: 'Cold-pressed for immediate digestive clarity and a clean, warm lift.',
    benefits: ['Eases bloating and tension', 'Supports gentle motility'],
  },
  {
    name: 'Turmeric',
    latin: 'Curcuma longa',
    tone: 'rgba(215, 168, 83, 0.45)',
    imageUrl: 'https://images.pexels.com/photos/7988018/pexels-photo-7988018.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=800',
    note: 'A golden root known for calming inflammation and restoring balance.',
    benefits: ['Soothes internal stress', 'Supports radiant skin tone'],
  },
  {
    name: 'Rosemary',
    latin: 'Rosmarinus officinalis',
    tone: 'rgba(122, 141, 106, 0.45)',
    imageUrl: 'https://images.pexels.com/photos/10098889/pexels-photo-10098889.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=800',
    note: 'Aromatic botanicals for a clear morning lift and focused ritual.',
    benefits: ['Supports mental clarity', 'Refreshes the senses'],
  },
  {
    name: 'Amla',
    latin: 'Phyllanthus emblica',
    tone: 'rgba(173, 188, 143, 0.45)',
    imageUrl: 'https://images.pexels.com/photos/32112805/pexels-photo-32112805.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=800',
    note: 'A bright, vitamin-rich fruit that fortifies collagen pathways.',
    benefits: ['Boosts antioxidant reserves', 'Supports luminous clarity'],
  },
  {
    name: 'Beetroot',
    latin: 'Beta vulgaris',
    tone: 'rgba(182, 108, 102, 0.45)',
    imageUrl: 'https://images.pexels.com/photos/20517382/pexels-photo-20517382.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=800',
    note: 'Mineral-rich depth for oxygenation and visible glow.',
    benefits: ['Enhances cellular oxygenation', 'Encourages natural flush'],
  },
]

const formulations: Formulation[] = [
  {
    orbit: 'GUT',
    label: '01 / GUT FOCUS',
    name: 'GUT Focus',
    tagline: 'The Daily Reset',
    items: [
      {
        ingredient: 'Cold-Pressed Ginger (Zingiber officinale) Juice',
        detail:
          'Contains high concentrations of bioactive gingerols that optimize gastric motility, instantly relieving bloating, gas, and gastrointestinal friction.',
      },
      {
        ingredient: 'Fennel (Foeniculum vulgare) Seed Distillate',
        detail:
          'Acts as a natural carminative and cooling agent to calm acidity, reduce smooth muscle spasms, and soothe the digestive tract lining.',
      },
      {
        ingredient: 'Amla (Phyllanthus emblica) & Pineapple Juice Matrix',
        detail:
          'A potent source of natural ascorbic acid (Vitamin C) and the proteolytic enzyme bromelain, which actively breaks down complex proteins and fortifies the gut microbiome.',
      },
    ],
  },
  {
    orbit: 'SKIN',
    label: '02 / SKIN FOCUS',
    name: 'Skin Focus',
    tagline: 'The Cellular Glow',
    items: [
      {
        ingredient: 'Pure Beetroot (Beta vulgaris) Extract',
        detail:
          'Rich in dietary nitrates that convert into Nitric Oxide, dilating blood vessels to maximize cellular-level oxygenation and nutrient delivery, resulting in a natural, radiant flush.',
      },
      {
        ingredient: 'Raw Turmeric (Curcuma longa) Curcumin Extract',
        detail:
          'A molecular-level anti-inflammatory and blood purifier that eliminates acne-causing bacteria and micro-dermal inflammation from within.',
      },
      {
        ingredient: 'Pink Guava & Lemon Juice Concentrates',
        detail:
          'Serves as a high-antioxidant taste-masking vehicle, delivering vital co-factors (Vitamin C) necessary for natural dermal collagen synthesis.',
      },
    ],
  },
]

const timeline = [
  {
    day: 'Day 1-3',
    focus: 'Digestive reset begins.',
  },
  {
    day: 'Day 7',
    focus: 'Reduced bloating. Better hydration.',
  },
  {
    day: 'Day 14',
    focus: 'Visible skin clarity.',
  },
  {
    day: 'Day 21',
    focus: 'System optimization activated.',
  },
]

const faqs = [
  {
    question: 'What makes this product DIFFERENT?',
    points: [
      {
        title: 'The Formulation Purity (Zero Dilution)',
        body:
          'Unlike standard mass-market wellness juices or shots that use water, synthetic stabilizers, or apple juice fillers to cut costs, ShotSmith is a 100% active botanical matrix. Every single drop of the 50ml fluid is a functional asset.',
      },
      {
        title: 'Problem-Specialist vs. General Wellness',
        body:
          'Most health drinks try to be everything at once ("Immunity Boost"). ShotSmith operates on a precise, target-driven framework focusing on explicit daily physiological pain points: GUT and SKIN.',
      },
      {
        title: 'Matte Black Glass Structural Design',
        body:
          'The packaging completely breaks category norms. Moving away from cheap plastic or clear glass round bottles, the bespoke matte black square glass protects raw organic ingredients from UV degradation while establishing an ultra-premium lifestyle aesthetic on a kitchen counter or vanity table.',
      },
    ],
  },
  {
    question: 'Why would people care?',
    points: [
      {
        title: 'The Power of the 50ml Ritual (Efficiency)',
        body:
          'Affluent, high-performing consumers do not have the time to peel raw ginger, juice fresh turmeric, or brew rosemary water every single morning. ShotSmith gives them maximum organic potency in a single, effortless, 3-second daily ritual.',
      },
      {
        title: 'Uncompromising Clean Label',
        body:
          'Consumers are highly skeptical of hidden toxins. ShotSmith gives them definitive peace of mind: it is strictly sugar-free (0% refined sugar), preservative-free, 100% vegan, and sourced from certified organic farms.',
      },
      {
        title: 'Tangible Accountability',
        body:
          'Through QR-code batch purity reports (Certificate of Analysis transparency) and the trackable 21-Day Transformation Protocol, customers are treated like smart stakeholders who can see the science and track their physical progress.',
      },
    ],
  },
  {
    question: 'Why now?',
    points: [
      {
        title: 'The Rise of Functional Medicine & Bio-Hacking',
        body:
          'There is a massive macroeconomic shift happening now. Consumers are moving away from reactive healthcare (taking pills after getting sick) and surface-level cosmetics (expensive topical creams) toward proactive, internal, systemic wellness.',
      },
      {
        title: 'The Ingredient Education Boom',
        body:
          'Social media has deeply educated the modern consumer. People now actively search for specific high-performance compounds like curcumin, gingerols, and rosemary extract. They do not just want "juice"; they want the active biology, and ShotSmith packages exactly what they are looking for.',
      },
      {
        title: 'Premiumization of Daily Habits',
        body:
          'Consumers are increasingly willing to pay a premium for everyday items (coffee, skincare, water) if they elevate lifestyle aesthetics and deliver elite performance.',
      },
    ],
  },
  {
    question: 'What emotional trigger does it hit?',
    points: [
      {
        title: 'The Desire for Control and Optimization (The Primary Trigger)',
        body:
          'High-performers hate friction. ShotSmith targets the deep emotional need to feel optimized, sharp, and in complete control of the body from the moment they wake up.',
      },
      {
        title: 'The Feeling of Elite Status & Sophistication',
        body:
          'Drinking a mass-market juice feels like a basic health chore. Unboxing a matte black, two-tier drawer box to pull out a beautifully crafted black glass vial feels like a luxury reward. It converts wellness into a symbol of status and self-investment.',
      },
      {
        title: 'Relief from Hidden Anxiety (The Security Trigger)',
        body:
          'Modern lifestyles induce silent anxieties around digital screen fatigue, bloating from processed diets, and visible skin stress. ShotSmith acts as an elite, invisible biological shield, giving consumers confidence that their core health parameters are fully taken care of.',
      },
    ],
  },
]

function App() {
  const heroRef = useRef<HTMLElement | null>(null)
  const bottleRef = useRef<HTMLDivElement | null>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const pullTrackRef = useRef<HTMLDivElement | null>(null)
  const pullProgressRef = useRef(0)
  const isDraggingRef = useRef(false)
  const pullStartYRef = useRef(0)
  const pullStartProgressRef = useRef(0)

  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [pullProgress, setPullProgress] = useState(0)
  const [pullOpen, setPullOpen] = useState(false)
  const [activeFormulation, setActiveFormulation] = useState(formulations[0])

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.15,
      lerp: 0.08,
    })

    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)

    let rafId = 0
    const raf = (time: number) => {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    const bottle = bottleRef.current
    if (!hero || !bottle) {
      return undefined
    }

    const ctx = gsap.context(() => {
      gsap.to(bottle, {
        scale: 1.08,
        rotateY: 12,
        rotateX: -4,
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

      gsap.to('.hero-copy', {
        yPercent: -10,
        opacity: 0.7,
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, hero)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) {
      return undefined
    }

    const handleMove = (event: globalThis.PointerEvent) => {
      const rect = hero.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 100
      const y = ((event.clientY - rect.top) / rect.height) * 100
      hero.style.setProperty('--light-x', `${x.toFixed(2)}%`)
      hero.style.setProperty('--light-y', `${y.toFixed(2)}%`)
    }

    const handleLeave = () => {
      hero.style.setProperty('--light-x', '50%')
      hero.style.setProperty('--light-y', '30%')
    }

    hero.addEventListener('pointermove', handleMove)
    hero.addEventListener('pointerleave', handleLeave)

    return () => {
      hero.removeEventListener('pointermove', handleMove)
      hero.removeEventListener('pointerleave', handleLeave)
    }
  }, [])

  const handleScrollTo = (id: string) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(`#${id}`, { offset: -40 })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const setProgress = (value: number) => {
    const next = Math.max(0, Math.min(1, value))
    pullProgressRef.current = next
    setPullProgress(next)
  }

  const updatePull = (deltaY: number) => {
    if (!pullTrackRef.current) {
      return
    }
    const rect = pullTrackRef.current.getBoundingClientRect()
    const next = pullStartProgressRef.current + deltaY / rect.height
    setProgress(next)
  }

  const handlePullStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (pullOpen) {
      return
    }
    isDraggingRef.current = true
    pullStartYRef.current = event.clientY
    pullStartProgressRef.current = pullProgressRef.current
    event.currentTarget.setPointerCapture(event.pointerId)
    updatePull(0)
  }

  const handlePullMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current || pullOpen) {
      return
    }
    updatePull(event.clientY - pullStartYRef.current)
  }

  const handlePullEnd = () => {
    if (!isDraggingRef.current) {
      return
    }
    isDraggingRef.current = false
    if (pullProgressRef.current >= 0.82) {
      setPullOpen(true)
      setProgress(1)
      return
    }
    setProgress(0)
  }

  const handleWaitlistSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setHasSubmitted(true)
    setPullOpen(false)
    setProgress(0)
  }

  const wordOpacity = (start: number) => {
    const range = 0.18
    return Math.max(0, Math.min(1, (pullProgress - start) / range))
  }

  return (
    <div className="app">
      <header className="top-nav">
        <button className="brand" type="button" onClick={() => handleScrollTo('arrival')}>
          SHOTSMITH
        </button>
        <div className="nav-actions">
          <button className="nav-link" type="button" onClick={() => handleScrollTo('science')}>
            Formulations
          </button>
          <button className="nav-link" type="button" onClick={() => handleScrollTo('ingredients')}>
            Ingredients
          </button>
          <button className="btn small" type="button" onClick={() => handleScrollTo('waitlist')}>
            Join the First Batch
          </button>
        </div>
      </header>

      <section className="hero" id="arrival" ref={heroRef}>
        <div className="hero-copy">
          <p className="eyebrow">SHOTSMITH Labs</p>
          <p className="tagline">Forged by Nature. Precision Crafted.</p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.6 }}
          >
            The 50ml Daily Ritual for High-Performers.
          </motion.h1>
          <p className="hero-sub">
            Cold-pressed botanical formulations engineered for GUT and SKIN optimization.
          </p>
          <div className="hero-cta">
            <button className="btn primary" type="button" onClick={() => handleScrollTo('waitlist')}>
              Join Early Access
            </button>
            <button className="btn secondary" type="button" onClick={() => handleScrollTo('ritual')}>
              Explore the Ritual
            </button>
          </div>
          <p className="hero-scroll">Scroll to discover the ritual.</p>
        </div>
        <div className="hero-media">
          <div className="hero-image-frame" ref={bottleRef}>
            <img className="hero-image" src={heroWomanImage} alt="Woman holding and drinking a ShotSmith wellness bottle" />
          </div>
        </div>
      </section>

      <section className="scroll-sequence" id="sequence">
        <div className="scroll-panel intro">No time.</div>
        <div className="scroll-panel launch">Processed food.</div>
        <div className="scroll-panel launch">Poor sleep.</div>
        <div className="scroll-panel launch">Stress overload.</div>
      </section>

      <section className="waitlist" id="waitlist">
        <div className="waitlist-visuals" aria-hidden="true">
          <img className="waitlist-bottle" src={heroBottle} alt="" />
          <span className="waitlist-ingredient ginger">Ginger</span>
          <span className="waitlist-ingredient turmeric">Turmeric</span>
          <span className="waitlist-ingredient rosemary">Rosemary</span>
        </div>
        <div className="waitlist-copy">
          <p className="eyebrow">Launching soon</p>
          <h2>Feeling This Too?</h2>
          <p>Join the first batch and help shape the future of precision wellness.</p>
        </div>
        <form className="waitlist-form" onSubmit={handleWaitlistSubmit}>
          <label>
            Name
            <input type="text" name="name" placeholder="Full name" />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder="you@domain.com" />
          </label>
          <label>
            Which formulation interests you most?
            <select name="focus">
              <option>GUT</option>
              <option>SKIN</option>
              <option>Both</option>
            </select>
          </label>
          <label>
            What is your biggest daily wellness challenge?
            <select name="challenge">
              <option>Digestion</option>
              <option>Skin Health</option>
              <option>Energy</option>
              <option>Stress</option>
              <option>Convenience</option>
            </select>
          </label>
          <label>
            What other wellness rituals would you love simplified into a daily shot?
            <textarea name="rituals" rows={3} placeholder="Your ideas" />
          </label>
          <button className="btn primary" type="submit">
            Join the First Batch
          </button>
        </form>
      </section>

      {hasSubmitted ? (
        <section className="pull-story" id="modern-life">
          <p className="pull-microcopy">
            Thank you. Now let's talk about why modern health feels harder than ever.
          </p>
          <div
            className={`pull-stage${pullOpen ? ' open' : ''}`}
            style={{ '--pull-progress': pullProgress } as CSSProperties}
            ref={pullTrackRef}
          >
            <div className="pull-background" aria-hidden="true">
              <div className="pull-words">
                <span style={{ opacity: wordOpacity(0.05) }}>NO TIME</span>
                <span style={{ opacity: wordOpacity(0.25) }}>STRESS</span>
                <span style={{ opacity: wordOpacity(0.45) }}>POOR FOOD</span>
                <span style={{ opacity: wordOpacity(0.65) }}>SCREEN FATIGUE</span>
              </div>
              <div className="pull-figure">
                <span className="figure-head" />
                <span className="figure-body" />
                <div
                  className="stress-indicator gut"
                  style={{ opacity: pullProgress > 0.22 ? 1 : 0 }}
                >
                  <strong>Gut</strong>
                  <span>Bloating</span>
                </div>
                <div
                  className="stress-indicator skin"
                  style={{ opacity: pullProgress > 0.42 ? 1 : 0 }}
                >
                  <strong>Skin</strong>
                  <span>Dullness</span>
                </div>
                <div
                  className="stress-indicator energy"
                  style={{ opacity: pullProgress > 0.62 ? 1 : 0 }}
                >
                  <strong>Energy</strong>
                  <span>Drain</span>
                </div>
              </div>
              <p
                className="pull-quote"
                style={{ opacity: pullProgress > 0.55 ? 1 : 0 }}
              >
                The damage isn't always visible. Until it is.
              </p>
            </div>
            <div className="pull-curtain left" aria-hidden="true" />
            <div className="pull-curtain right" aria-hidden="true" />
            <div className="pull-handle">
              <button
                type="button"
                onPointerDown={handlePullStart}
                onPointerMove={handlePullMove}
                onPointerUp={handlePullEnd}
                onPointerCancel={handlePullEnd}
                onLostPointerCapture={handlePullEnd}
                aria-label="Pull to reveal"
              >
                Pull to reveal
              </button>
            </div>
            {pullOpen ? (
              <motion.div
                className="pull-reveal"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: 'easeOut' }}
              >
                <span>Modern Life</span>
                <span>Creates</span>
                <span>Invisible Damage</span>
              </motion.div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="precision" id="precision">
        <div className="section-intro">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.5 }}
          >
            Precision formulations for GUT and SKIN.
          </motion.h2>
        </div>
        <div className="precision-track">
          <article className="precision-panel" data-theme="gut">
            <div className="panel-meta">01 / GUT FOCUS</div>
            <h3>Calm, clean digestion.</h3>
            <p>
              Cold-pressed roots and enzymes that restore balance and ease daily
              discomfort.
            </p>
            <details>
              <summary>Ingredient focus</summary>
              <p>Ginger, fennel, and amla for gentle relief and daily reset.</p>
            </details>
          </article>
          <article className="precision-panel" data-theme="skin">
            <div className="panel-meta">02 / SKIN FOCUS</div>
            <h3>Glow from within.</h3>
            <p>Antioxidant botanicals that support hydration, tone, and inner radiance.</p>
            <details>
              <summary>Ingredient focus</summary>
              <p>Beetroot, turmeric, and citrus for clarity and luminous tone.</p>
            </details>
          </article>
        </div>
      </section>

      <section className="why" id="why-50ml">
        <div className="why-copy">
          <p className="eyebrow">Why 50ml?</p>
          <h2>Maximum Biological Efficiency. Minimal Daily Friction.</h2>
          <p>
            Every drop has a function. No fillers. No dilution. No compromise.
          </p>
        </div>
        <div className="why-image-wrap">
          <img className="why-image" src={whyWoman} alt="Woman enjoying a ShotSmith wellness drink" />
        </div>
      </section>

      <section className="clean" id="clean-label">
        <div className="section-intro">
          <h2>Ingredient Integrity</h2>
          <p>Clean label standards crafted for a premium daily ritual.</p>
        </div>
        <div className="clean-grid">
          {[
            {
              title: 'Sugar-Free -> YES (0% Added or Refined Sugar)',
              detail:
                'SHOTSMITH contains no refined sugar, high-fructose corn syrup, or synthetic sweeteners. Sweetness comes only from low-glycemic fruit sugars in apple, guava, and pineapple bases.',
            },
            {
              title: 'Preservative-Free -> YES (100% Clean Label)',
              detail:
                'Zero sodium benzoate, potassium sorbate, or chemical stabilizers. Shelf stability is achieved through HTST flash pasteurization and pH control with organic lemon citric acid.',
            },
            {
              title: 'Vegan -> YES (100% Plant-Based)',
              detail:
                'No animal-derived ingredients like marine collagen or honey. The entire line is plant-based and cruelty-free.',
            },
            {
              title: 'Organic -> YES (Responsibly Sourced)',
              detail:
                'Hero botanicals including turmeric, ginger, amla, and rosemary are sourced from verified organic farms using sustainable, pesticide-free agriculture.',
            },
          ].map((item) => (
            <div className="clean-card" key={item.title}>
              <span className="badge">Verified</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="science" id="science">
        <div className="section-intro">
          <h2>Ingredient Formulation Matrix</h2>
          <p>
            Every ShotSmith formulation is engineered as an Active Botanical Infusion,
            utilizing 50ml of highly concentrated, cold-pressed plant mechanics to deliver
            targeted physiological results.
          </p>
        </div>
        <div className="science-layout">
          <div className="science-visual">
            <div className="science-orbit">
              <img
                className="science-image"
                src={formulationMatrixImage}
                alt="Woman holding and drinking a ShotSmith wellness bottle"
              />
            </div>
            <div className="science-selector" role="tablist" aria-label="Choose formulation">
              {formulations.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={`orbit-item${activeFormulation.name === item.name ? ' active' : ''}`}
                  onClick={() => setActiveFormulation(item)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="science-detail">
            <p className="science-label">{activeFormulation.label}</p>
            <h3>{activeFormulation.name}</h3>
            <p className="science-tag">{activeFormulation.tagline}</p>
            <ul className="science-list">
              {activeFormulation.items.map((entry) => (
                <li key={entry.ingredient}>
                  <span className="science-item-title">{entry.ingredient}</span>
                  <span className="science-item-desc">{entry.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="ingredients" id="ingredients">
        <div className="section-intro">
          <h2>Ingredient Portraits</h2>
          <p>
            Botanical ingredients revealed with the softness of a luxury skincare campaign.
          </p>
        </div>
        <div className="ingredients-list">
          <div className="ingredients-collage" aria-hidden="true">
            {ingredients.map((ingredient, index) => (
              <div
                className={`ingredient-tile tile-${index + 1}`}
                key={ingredient.name}
                style={{ backgroundImage: `url(${ingredient.imageUrl})` }}
              >
                <span>{ingredient.name}</span>
              </div>
            ))}
          </div>

          <div className="ingredients-details-grid">
            {ingredients.map((ingredient) => (
              <motion.article
                key={ingredient.name}
                className="ingredient-card"
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, amount: 0.35 }}
              >
                <p className="ingredient-latin">{ingredient.latin}</p>
                <h3>{ingredient.name}</h3>
                <p>{ingredient.note}</p>
                <ul>
                  {ingredient.benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="ritual" id="ritual">
        <div className="section-intro">
          <h2>3 Seconds. Every Morning.</h2>
          <p>A quiet ritual of self-investment, designed to feel exclusive and effortless.</p>
        </div>
        <div className="ritual-grid">
          {[
            'Desk reset ritual',
            'Gym bag reload',
            'Kitchen counter clarity',
            'Vanity shelf precision',
          ].map((item) => (
            <div className="ritual-card" key={item}>
              <span className="ritual-glow" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="protocol" id="protocol">
        <div className="section-intro">
          <h2>21-Day Transformation Protocol</h2>
          <p>A soft, guided timeline that builds visible change.</p>
        </div>
        <div className="timeline">
          {timeline.map((step) => (
            <motion.div
              key={step.day}
              className="timeline-step"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.5 }}
            >
              <h3>{step.day}</h3>
              <p>{step.focus}</p>
            </motion.div>
          ))}
        </div>
        <button className="btn ghost" type="button">
          See the full ritual
        </button>
      </section>

      <section className="faq" id="faq">
        <div className="section-intro">
          <h2>FAQs</h2>
          <p>Direct answers to the most common questions around SHOTSMITH Labs.</p>
        </div>
        <div className="faq-grid">
          {faqs.map((item) => (
            <details className="faq-item" key={item.question}>
              <summary>{item.question}</summary>
              <div className="faq-body">
                <ul>
                  {item.points.map((point) => (
                    <li key={point.title}>
                      <span className="faq-point-title">{point.title}</span>
                      <span className="faq-point-body">{point.body}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="final" id="final">
        <div className="final-media" aria-hidden="true">
          <div className="hero-bottle">
            <img src={heroBottle} alt="" />
          </div>
        </div>
        <div className="final-copy">
          <h2>The ritual begins with the first bottle.</h2>
          <button className="btn primary" type="button" onClick={() => handleScrollTo('waitlist')}>
            Join the First Batch
          </button>
        </div>
      </section>

      <div className="floating-cta">
        <button className="btn primary" type="button" onClick={() => handleScrollTo('waitlist')}>
          Join Early Access
        </button>
      </div>
    </div>
  )
}

export default App

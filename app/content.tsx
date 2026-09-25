import type { ReactNode } from 'react';

export type Link = { label: string; href: string };

export type Entry = {
  title: string;
  year?: string;
  authors?: string[];
  venue?: string;
  description: ReactNode;
  image: string;
  imageAlt: string;
  links?: Link[];
};

export type Role = {
  title: string;
  org: string;
  when: string;
  note: string;
};

export const profile = {
  name: 'Michal Borek',
  role: 'Machine Learning Researcher, Michigan State University',
  email: 'borekmi1@msu.edu',
  links: [
    { label: 'CV', href: '/resume.pdf' },
    { label: 'GitHub', href: 'https://github.com/michaelborek' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/michal-borek2003/' },
  ] satisfies Link[],
};

export const news: { date: string; text: ReactNode }[] = [
  {
    date: 'Sep 2026',
    text: (
      <>
        Our pneumoconiosis screening work was{' '}
        <a href="https://msutoday.msu.edu/news/2026/09/lung-screenings-for-toxic-dust">featured by MSUToday</a>.
      </>
    ),
  },
  {
    date: 'Jul 2026',
    text: (
      <>
        Paper on pneumoconiosis screening published in{' '}
        <a href="https://doi.org/10.1136/oemed-2026-111040">
          <i>Occupational and Environmental Medicine</i>
        </a>
        .
      </>
    ),
  },
  { date: 'Jun 2026', text: 'Started full-time as a Machine Learning Researcher at MSU IQ.' },
  { date: 'May 2026', text: 'Graduated from Michigan State with a B.S. in Computational Data Science.' },
  { date: 'Apr 2026', text: 'Co-founded DockPilot.' },
];

const labAuthors = ['M. Liu', 'Z. Huang', 'M. Borek', 'I. Loveless', 'K. Rosenman', 'A. Alessio', 'L. Wang'];

export const publications: Entry[] = [
  {
    title: 'Pneumoconiosis screening and classification using deep learning models',
    authors: labAuthors,
    venue: 'Occupational and Environmental Medicine, 83(5):276–282, 2026',
    description:
      'Deep learning models for screening and grading chest X-rays performed comparably to certified B readers on in-distribution test images. Out-of-distribution cases remain harder.',
    image: '/images/radiographs.jpg',
    imageAlt: 'Two chest radiographs side by side: ILO profusion grade 0/0 and grade 3/3',
    links: [
      { label: 'paper', href: 'https://doi.org/10.1136/oemed-2026-111040' },
      { label: 'press', href: 'https://msutoday.msu.edu/news/2026/09/lung-screenings-for-toxic-dust' },
    ],
  },
  {
    title: 'Ordinal classification framework for multiclass grading of pneumoconiosis',
    authors: ['M. Liu', 'I. Loveless', 'Z. Huang', 'M. Borek', 'K. Rosenman', 'A. Alessio', 'L. Wang'],
    venue: 'SPIE Medical Imaging 2025: Computer-Aided Diagnosis, Proc. SPIE 13407',
    description:
      'One of the first studies to apply deep learning to multiclass grading of occupational lung disease, treating the four ILO grades as an ordered scale.',
    image: '/images/confusion-matrix.jpg',
    imageAlt: 'Confusion matrix for the CORN-loss model across grades 0 to 3',
    links: [{ label: 'paper', href: 'https://doi.org/10.1117/12.3046353' }],
  },
];

export const posters: Entry[] = [
  {
    title: 'Deep learning algorithm for pneumoconiosis staging on chest radiographs',
    authors: ['M. Borek', 'M. Liu', 'Z. Huang', 'I. Loveless', 'K. Rosenman', 'A. Alessio', 'L. Wang'],
    venue: 'University Undergraduate Research and Arts Forum (UURAF), MSU, 2025',
    description:
      'Compared six loss functions for ordinal grading on 2,077 NIOSH radiographs. CORN loss did best, at 70.9% accuracy and 89.8% specificity.',
    image: '/images/poster-uuraf.jpg',
    imageAlt: 'UURAF 2025 poster',
    links: [{ label: 'poster', href: '/UURAF_poster_2025.pdf' }],
  },
  {
    title: 'A local SLURM AI agent for script linting and resource guidance',
    authors: ['M. Borek', 'M. Parvizi'],
    venue: 'Mid-SURE 2025, Michigan State University',
    description: 'The job-script checker described below, presented with a live demo.',
    image: '/images/poster-midsure.jpg',
    imageAlt: 'Mid-SURE 2025 poster',
    links: [{ label: 'poster', href: '/icer_midsure_poster.pdf' }],
  },
];

export const work: Entry[] = [
  {
    title: 'Chest X-ray screening software for B readers',
    year: '2026',
    description:
      "A desktop application that runs our models entirely offline, so patient images never leave the reading workstation. I lead development: the PySide6 interface, ONNX inference, about 1,860 automated tests, Windows CI, and the installer. It's in beta with radiologists now.",
    image: '/images/offline-app.svg',
    imageAlt: 'Diagram: chest X-ray goes into an ONNX model and produces a report, all on one offline workstation',
  },
  {
    title: 'Adapting foundation models to chest radiographs',
    year: '2026',
    description:
      "Fine-tuning and benchmarking vision and multimodal models on our NIOSH data. Held-out accuracy went from 75% to 85% (ROC-AUC 0.80 to 0.96), and LoRA on MedGemma 4B went from 82% to 90%. I'm now working on uncertainty-aware labels for films where expert readers disagree.",
    image: '/images/model-adaptation.svg',
    imageAlt: 'Bar chart of accuracy and ROC-AUC before and after fine-tuning',
  },
  {
    title: "Job-script checker for MSU's HPC cluster",
    year: '2024–2026',
    description:
      "Catches mistakes in SLURM scripts before they're submitted, using rule-based checks, ShellCheck, and a local LLM for the fuzzier cases. Deployed on Open OnDemand for MSU researchers. I also built a model that suggests CPU, memory, GPU, and wall-time requests from past job data.",
    image: '/images/slurm-agent.jpg',
    imageAlt: 'Terminal transcript of the agent explaining two errors in a SLURM script',
    links: [{ label: 'poster', href: '/icer_midsure_poster.pdf' }],
  },
  {
    title: 'Legal document search with cited answers',
    year: '2026',
    description:
      "A local retrieval system over PDFs and Word files. It answers questions, quotes the passage each claim comes from, and declines when it can't find support. Keyword search in PostgreSQL plus vector search in Qdrant, with a local model through Ollama.",
    image: '/images/legal-search.svg',
    imageAlt: 'Example: a question, an answer, and the quoted source passage it cites',
    links: [{ label: 'code', href: 'https://github.com/michaelborek/Law-Assistant' }],
  },
];

export const experience: Role[] = [
  {
    title: 'Machine Learning Researcher',
    org: 'MSU Institute for Quantitative Health Science & Engineering',
    when: '2026 –',
    note: 'Foundation-model adaptation and offline screening software, with CDC/NIOSH. Mentoring undergraduate researchers.',
  },
  {
    title: 'Co-founder',
    org: 'DockPilot',
    when: '2026 –',
    note: 'Dock-scheduling software for warehouses and third-party logistics. Next.js, Supabase, PostgreSQL.',
  },
  {
    title: 'Deep Learning Researcher, part-time',
    org: 'MSU IQ, MIDI Lab',
    when: '2023 – 2026',
    note: 'Ordinal X-ray classification. Multi-GPU training with PyTorch DDP cut runs from about 8 hours to 3.',
  },
  {
    title: 'AI Engineer Intern',
    org: 'MSU Institute for Cyber-Enabled Research',
    when: '2023 – 2026',
    note: 'SLURM job-script checker, job resource prediction, LLM benchmarks on H200s, Python training for cluster users.',
  },
  {
    title: 'Teaching Assistant, CSE 102',
    org: 'Michigan State University',
    when: '2023',
    note: 'Review sessions and office hours for the intro Python course.',
  },
];

export const skills: { area: string; items: string }[] = [
  { area: 'Machine learning', items: 'PyTorch, DDP, LoRA fine-tuning, ONNX, scikit-learn, Captum, TorchXRayVision' },
  { area: 'Languages', items: 'Python, SQL, C++, Bash, TypeScript' },
  { area: 'Systems', items: 'SLURM, CUDA, Docker, AWS SageMaker, FastAPI, Flask, PostgreSQL, Qdrant' },
  { area: 'Applications', items: 'PySide6, PyInstaller, Next.js, React' },
];

export const older: { name: string; href?: string; text: string }[] = [
  {
    name: 'Delta Dental capstone',
    text: "led a sponsored data science project with Delta Dental's data team and built their canonical analytics dataset.",
  },
  {
    name: 'DarkVision',
    href: 'https://github.com/michaelborek/DarkVision',
    text: 'classifying animals in low-light and infrared camera-trap images.',
  },
  {
    name: 'Auto-grader',
    href: 'https://github.com/michaelborek/AUTO-GRADER',
    text: 'runs student Python submissions against tests in a sandbox, used for a 100+ student course.',
  },
  {
    name: 'QSide Notebook',
    href: 'https://github.com/michaelborek/QSide-Notebook',
    text: 'in-browser Python and SQL notebooks for data exploration, no install needed.',
  },
];

import { type Metadata } from 'next';
import { Container } from '../components/Container';
import { Button } from '../components/Button';

const resumePdfUrl =
  'https://will-white.github.io/resume/William_White_Resume.pdf';

type Role = {
  title: string;
  company: string;
  location: string;
  start: string;
  end: string;
  highlights: string[];
};

const experience: Role[] = [
  {
    title: 'Senior Software Engineer',
    company: 'SkySlope Inc.',
    location: 'Sacramento, CA',
    start: 'March 2022',
    end: 'March 2024',
    highlights: [
      'Developed and maintained a key full-stack business application with over 2,000 unit tests, managing ~30 pull requests per sprint and shipping consistent bi-weekly releases with an 80% reduction in deployment times.',
      'Monitored and debugged high-volume applications with Grafana, Splunk, and Datadog, supporting 10K+ daily concurrent users at 99.999% uptime.',
      'Improved monetization by implementing sponsored/partnered ads with a non-disruptive user experience, producing five-figure monthly recurring revenue.',
      'Led a cost-saving initiative built on file and data streaming and deferred executions, reducing cluster costs by 40% using .NET Web API and Node.js.',
      'Collaborated across multiple teams on a widely adopted property technology app using .NET Web API, Node.js, React, and OpenFaaS, driving a 30% increase in user adoption.',
    ],
  },
  {
    title: 'Senior Software Engineer',
    company: 'ARMtech Insurance Services Inc.',
    location: 'Houston, TX',
    start: 'August 2020',
    end: 'March 2022',
    highlights: [
      'Developed a unified single sign-on solution with Angular 2+, Node.js, .NET Core, and Duo Security, enhancing security for 10K+ users and reducing login time by 20%.',
      'Refactored hundreds of MSSQL PDF reports into DevExpress and Angular/HTML-based reports.',
      'Raised coding standards by introducing ESLint, Prettier, and CI/CD pipelines with GitLab.',
    ],
  },
  {
    title: 'Software Engineer',
    company: 'ARMtech Insurance Services Inc.',
    location: 'Houston, TX',
    start: 'August 2014',
    end: 'August 2020',
    highlights: [
      'Spearheaded performance optimization and refactoring of a core business service in .NET WCF and C#, achieving a 45x increase in processing speed.',
      'Introduced customized Webpack Hot Module Reloading, cutting development and debugging time across all teams.',
      'Architected and built a scalable web-based SaaS B2B application using Angular 2+, Node.js, WCF, RabbitMQ, Redis, CouchDB, Entity Framework, MSSQL, Docker, and DevExpress Reporting.',
      'Developed and optimized risk management software with C# and MSSQL, saving $20M+ in year-over-year capital.',
    ],
  },
];

const skills: { category: string; items: string }[] = [
  {
    category: 'Languages',
    items: 'C#, TypeScript, JavaScript, Python, Java, SQL',
  },
  {
    category: 'Frameworks & Libraries',
    items:
      'React, React Query, Redux, Angular 2+, Node.js, DevExpress, MUI, Bootstrap, Tailwind CSS',
  },
  {
    category: '.NET',
    items: '.NET Core, Web API, EF, WCF, WPF, MSTest, xUnit, NUnit',
  },
  {
    category: 'Cloud',
    items: 'AWS (Aurora, RDS, SQS, DynamoDB), GCP App Engine',
  },
  {
    category: 'Databases',
    items: 'MSSQL, MySQL, PostgreSQL, MongoDB',
  },
  {
    category: 'Web',
    items: 'HTML, CSS, LESS, SASS, SOAP, JSON, XML',
  },
];

export const metadata: Metadata = {
  title: 'Resume',
  description: 'The resume of William White, Senior Software Engineer.',
};

function ArrowDownIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4.75 8.75 8 12.25m0 0 3.25-3.5M8 12.25v-8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RoleEntry({ role }: { role: Role }) {
  return (
    <div className="md:grid md:grid-cols-4 md:items-baseline">
      <div className="md:col-span-1">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {role.start} – {role.end}
        </p>
      </div>
      <div className="md:col-span-3">
        <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100">
          {role.title}
        </h3>
        <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
          {role.company} · {role.location}
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-600 marker:text-cyan-500 dark:text-zinc-400">
          {role.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Resume() {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="animate-fade-up text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          Resume
        </h1>
        <p className="animate-fade-up mt-6 text-base text-zinc-600 [animation-delay:100ms] dark:text-zinc-400">
          Experienced polyglot engineer with over 10 years in the industry,
          specializing in scalable, high-performance B2B applications.
        </p>
        <div className="animate-fade-up mt-6 [animation-delay:200ms]">
          <Button href={resumePdfUrl} target="_blank" variant="primary">
            Download PDF
            <ArrowDownIcon className="h-4 w-4 stroke-zinc-400 transition group-active:stroke-zinc-600 dark:group-hover:stroke-zinc-50 dark:group-active:stroke-zinc-50" />
          </Button>
        </div>
      </header>

      <div className="mt-16 space-y-16 sm:mt-20">
        <section>
          <h2 className="text-sm font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
            Experience
          </h2>
          <div className="mt-8 space-y-12 border-l border-zinc-100 pl-6 md:border-none md:pl-0 dark:border-zinc-700/40">
            {experience.map((role) => (
              <RoleEntry key={`${role.title}-${role.start}`} role={role} />
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
            Skills
          </h2>
          <dl className="mt-8 grid grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2">
            {skills.map((skill) => (
              <div key={skill.category}>
                <dt className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
                  {skill.category}
                </dt>
                <dd className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {skill.items}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="text-sm font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500">
            Education
          </h2>
          <p className="mt-8 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-semibold text-zinc-800 dark:text-zinc-100">
              B.S.E. in Computer Science and Engineering
            </span>{' '}
            · University of Texas at Arlington
          </p>
        </section>
      </div>
    </Container>
  );
}

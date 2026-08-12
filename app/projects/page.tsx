import { type Metadata } from 'next';
import Image, { type StaticImageData } from 'next/image';

import k8s from '../images/logos/k8s.svg';
import github from '../images/logos/github.svg';
import skyslopeForms from '../images/logos/skyslope-forms.svg';
import armtech from '../images/logos/armtech.png';
import maplarge from '../images/logos/maplarge.svg';
import rasi from '../images/logos/rasi.png';
import statueCityCruises from '../images/logos/statue-city-cruises.webp';
import { SimpleLayout } from '../components/SimpleLayout';
import { Card } from '../components/Card';

type Project = {
  name: string;
  description: string;
  link: { href: string; label: string };
  logo: StaticImageData;
  tags: string[];
};

const personalProjects: Project[] = [
  {
    name: 'Personal Kubernetes Cluster',
    description:
      'Spouse approved self hosted cluster driven by Kubernetes and GitOps using Flux.',
    link: {
      href: 'https://github.com/will-white/home-k8s-cluster',
      label: 'github/home-k8s-cluster',
    },
    logo: k8s,
    tags: ['Kubernetes', 'Talos', 'Flux', 'GitOps'],
  },
  {
    name: 'Dahua Companion',
    description:
      'Small, simple, and fast event driven Dahua (Amcrest) doorbell processor for home automation integration made with Go (Golang).',
    link: {
      href: 'https://github.com/will-white/dahua-companion',
      label: 'github/dahua-companion',
    },
    logo: github,
    tags: ['Go', 'MQTT', 'Home Assistant'],
  },
  {
    name: 'AdGuard external-dns Sidecar',
    description:
      'Kubernetes sidecar that reconciles AdGuard Home DNS rewrites with live Ingress hosts, so a catch-all wildcard and per-service records can coexist. Zero dependencies, stdlib-only Go.',
    link: {
      href: 'https://github.com/will-white/adguard-external-dns-sidecar',
      label: 'github/adguard-external-dns-sidecar',
    },
    logo: github,
    tags: ['Go', 'Kubernetes', 'DNS'],
  },
];

const companyProjects: Project[] = [
  {
    name: 'MapLarge',
    description:
      'High-performance geospatial analytics platform powering rapid last-mile applications for operational AI. My current work.',
    link: {
      href: 'https://www.maplarge.com',
      label: 'maplarge.com',
    },
    logo: maplarge,
    tags: ['Geospatial', 'Big Data'],
  },
  {
    name: 'SkySlope Forms',
    description:
      'A beautiful and bespoke form pdf management tool specifically designed for real estate brokerages, agents, and property managers.',
    link: {
      href: 'https://skyslope.com/products-services/forms/',
      label: 'skyslope.com',
    },
    logo: skyslopeForms,
    tags: ['.NET', 'Node.js', 'React', 'AWS'],
  },
  {
    name: 'AgriSompo AgriNet',
    description:
      'Industry leading crop insurance management software for farmers and agents.',
    link: {
      href: 'https://www.agrisompo.com/resources/technology/agrinet/',
      label: 'agrisompo.com',
    },
    logo: armtech,
    tags: ['C#', '.NET', 'Angular', 'MSSQL'],
  },
  {
    name: 'RASI',
    description:
      'Restaurant accounting and management platform that helps operators drive profit through faster, more informed business decisions.',
    link: {
      href: 'https://rasiusa.com',
      label: 'rasiusa.com',
    },
    logo: rasi,
    tags: ['Fintech', 'SaaS'],
  },
  {
    name: 'Statue City Cruises Ticketing',
    description:
      'Official ticketing platform for ferry service to the Statue of Liberty and Ellis Island, serving millions of visitors a year.',
    link: {
      href: 'https://statuecitycruises.com/tickets',
      label: 'statuecitycruises.com',
    },
    logo: statueCityCruises,
    tags: ['E-commerce', 'Ticketing'],
  },
];

function LinkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  );
}

function ProjectSection({
  title,
  intro,
  projects,
}: {
  title: string;
  intro: string;
  projects: Project[];
}) {
  return (
    <section>
      <h2 className="text-2xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
        {intro}
      </p>
      <ul
        role="list"
        className="mt-10 grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {projects.map((project) => (
          <Card as="li" key={project.name}>
            <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md ring-1 shadow-zinc-800/5 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
              <Image
                src={project.logo}
                alt=""
                className="h-8 w-8"
                unoptimized
              />
            </div>
            <h3 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
              <Card.Link href={project.link.href} target="_blank">
                {project.name}
              </Card.Link>
            </h3>
            <Card.Description>{project.description}</Card.Description>
            <div className="relative z-10 mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-cyan-500 dark:text-zinc-200">
              <LinkIcon className="h-6 w-6 flex-none" />
              <span className="ml-2">{project.link.label}</span>
            </p>
          </Card>
        ))}
      </ul>
    </section>
  );
}

export const metadata: Metadata = {
  title: 'Projects',
  description: 'My creative footprint on the internet.',
};

export default function Projects() {
  return (
    <SimpleLayout
      title="My creative footprint on the internet."
      intro="I’ve worked on tons of little projects but these are the ones that I’m most proud of. Some of them are open-source, so if you see something that piques your interest, check out the code!"
    >
      <div className="space-y-20">
        <ProjectSection
          title="Professional work"
          intro="Products I’ve helped build and run for real users at real scale."
          projects={companyProjects}
        />
        <ProjectSection
          title="Personal projects"
          intro="Things I build and run for fun — all open source."
          projects={personalProjects}
        />
      </div>
    </SimpleLayout>
  );
}

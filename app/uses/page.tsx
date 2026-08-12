import { type Metadata } from 'next';

import { Card } from '../components/Card';
import { Section } from '../components/Section';
import { SimpleLayout } from '../components/SimpleLayout';

function ToolsSection({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof Section>) {
  return (
    <Section {...props}>
      <ul role="list" className="space-y-16">
        {children}
      </ul>
    </Section>
  );
}

function Tool({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <Card as="li">
      <Card.Title as="h3" href={href}>
        {title}
      </Card.Title>
      <Card.Description>{children}</Card.Description>
    </Card>
  );
}

export const metadata: Metadata = {
  title: 'Uses',
  description: 'Software and hardware I use to get things done.',
};

export default function Uses() {
  return (
    <SimpleLayout
      title="What I use to get things done."
      intro="The tools, hardware, and services behind my day-to-day work and my homelab. Not sponsored, not exhaustive — just the things that have earned their keep."
    >
      <div className="space-y-20">
        <ToolsSection title="Workstation">
          <Tool title="Windows 11 + WSL2 (Ubuntu)">
            My daily driver is Windows with WSL2 running Ubuntu. It sounds like
            a compromise, but it gives me a real Linux toolchain for development
            while keeping the Windows side for everything else. All of my
            projects live inside the WSL filesystem.
          </Tool>
          <Tool title="Windows Terminal">
            Fast, tabbed, and it makes juggling WSL, PowerShell, and SSH
            sessions painless.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Development">
          <Tool title="VS Code">
            My main editor for TypeScript, Go, and infrastructure work, with the
            Remote - WSL extension doing the heavy lifting.
          </Tool>
          <Tool title="pnpm">
            My package manager of choice for Node.js projects — fast installs
            and a strict dependency model that catches mistakes npm lets slide.
          </Tool>
          <Tool title="Docker">
            Local containers for anything I don’t want polluting my machine, and
            the build pipeline for everything that ends up on the homelab
            cluster.
          </Tool>
        </ToolsSection>
        <ToolsSection title="Homelab">
          <Tool
            title="Talos Linux + Flux"
            href="https://github.com/will-white/home-k8s-cluster"
          >
            Eight Lenovo Tiny mini-PCs running Talos Linux — an immutable,
            API-only Kubernetes OS with no SSH and nothing to drift. Every
            workload, secret, and upgrade flows through a Git repository:
            Renovate proposes updates, CI diffs and validates them, and Flux
            reconciles them onto the cluster.
          </Tool>
          <Tool title="Rook-Ceph + Volsync">
            Distributed storage across the workers’ NVMe drives, with every
            volume backed up via Volsync and Kopia — including a canary job that
            periodically restores a backup to prove the backups are real.
          </Tool>
          <Tool title="Home Assistant + Zigbee2MQTT + Frigate">
            The home automation stack the household actually notices. Fed by
            small single-purpose Go services I write when an integration is
            missing, like turning doorbell presses into MQTT events.
          </Tool>
        </ToolsSection>
      </div>
    </SimpleLayout>
  );
}

export const landingCopy = {
  hero: {
    eyebrow: 'Sirindhorn International Institute of Technology',
    headline: 'SIIT Complaint System',
    description:
      'Submit complaints or suggestions, follow status updates, and view anonymized public outcomes—built for SIIT students and staff.',
    primaryCta: 'File new complaint',
    secondaryCta: 'View public complaints',
  },
  about: {
    title: 'What is this system?',
    description:
      'The SIIT Complaint System centralizes how academic, facility, and student-life issues are reported. After you sign in with your SIIT Google account, you choose a topic, answer guided questions, and receive a submission ID. Administrators review cases, update status, and publish resolutions where policy allows.',
    bullets: [
      'Structured topics keep reports consistent and actionable.',
      'Sensitive categories remain restricted; other statuses may appear on the public board.',
      'Every status change is logged for accountability.',
    ],
  },
  features: [
    {
      id: 'anonymous',
      title: 'Protected identity',
      description:
        'Public views anonymize submitters while staff see details needed to resolve cases.',
    },
    {
      id: 'tracking',
      title: 'Complaint tracking',
      description:
        'Students monitor pending, in-progress, and resolved items from a personal dashboard.',
    },
    {
      id: 'transparency',
      title: 'Public transparency',
      description:
        'Non-sensitive complaints appear on the public board so the community sees progress.',
    },
    {
      id: 'workflow',
      title: 'Administrative workflow',
      description:
        'Staff assign status, attach evidence, and record official resolutions in one place.',
    },
  ],
  workflow: {
    title: 'How a complaint moves forward',
    subtitle: 'A simple path from submission to closure',
    steps: [
      { id: 'submit', title: 'Submit complaint', description: 'Choose a topic and provide details or attachments.' },
      { id: 'review', title: 'Review', description: 'Staff acknowledge receipt and validate the report.' },
      { id: 'investigation', title: 'Investigation', description: 'Relevant teams gather facts and coordinate a response.' },
      { id: 'resolution', title: 'Resolution', description: 'Outcome is recorded and status is updated for the submitter.' },
    ],
  },
  stats: {
    title: 'Platform activity',
    subtitle: 'Live counts from publicly visible submissions',
    labels: {
      total: 'Total submissions tracked',
      resolved: 'Resolved cases',
      inProgress: 'In progress',
      response: 'Typical response window',
    },
    responseValue: 'Within 5 business days',
    activeUsersLabel: 'Community',
    activeUsersValue: 'Students & staff',
  },
  mobile: {
    title: 'Built for web—and ready for mobile',
    description:
      'Components, spacing, and typography follow a shared token system so this experience can extend to a PWA or native app without redesigning from scratch.',
    points: [
      'Touch-friendly controls (44px minimum targets)',
      'Responsive navigation and card layouts',
      'Modular sections mapped to reusable screens',
      'Consistent color and type tokens across platforms',
    ],
  },
  footer: {
    purpose:
      'Official complaint channel of the SIIT Student Committee. Supporting fair, documented resolution of student concerns.',
    contactLabel: 'Contact',
    contact: 'siit.studentcommittee',
    copyright: `© ${new Date().getFullYear()} SIIT Complaint System. All rights reserved.`,
  },
};

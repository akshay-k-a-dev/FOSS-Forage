export interface Resource {
  id: string;
  title: string;
  description: string;
  link: string;
  category: string;
  type: string;
  tags: string[];
}

// Static fallback data in case API calls fail
export const fallbackResources: Resource[] = [
  // Frontend Development
  {
    id: '1',
    title: 'React',
    description: 'A JavaScript library for building user interfaces',
    link: 'https://github.com/facebook/react',
    category: 'Frontend Development',
    type: 'framework',
    tags: ['javascript', 'ui', 'frontend', 'spa']
  },
  {
    id: '2',
    title: 'Next.js',
    description: 'The React Framework for Production',
    link: 'https://github.com/vercel/next.js',
    category: 'Frontend Development',
    type: 'framework',
    tags: ['react', 'framework', 'ssr', 'frontend']
  },
  {
    id: '3',
    title: 'Vue.js',
    description: 'Progressive JavaScript Framework',
    link: 'https://github.com/vuejs/core',
    category: 'Frontend Development',
    type: 'framework',
    tags: ['javascript', 'frontend', 'spa']
  },
  {
    id: '4',
    title: 'Angular',
    description: 'Platform for building mobile and desktop web applications',
    link: 'https://github.com/angular/angular',
    category: 'Frontend Development',
    type: 'framework',
    tags: ['typescript', 'frontend', 'google']
  },

  // Backend Development
  {
    id: '5',
    title: 'Spring Boot',
    description: 'Java-based framework for creating stand-alone production-grade applications',
    link: 'https://github.com/spring-projects/spring-boot',
    category: 'Backend Development',
    type: 'framework',
    tags: ['java', 'spring', 'enterprise']
  },
  {
    id: '6',
    title: 'Django',
    description: 'High-level Python Web framework',
    link: 'https://github.com/django/django',
    category: 'Backend Development',
    type: 'framework',
    tags: ['python', 'web', 'orm']
  },
  {
    id: '7',
    title: 'Express',
    description: 'Fast, unopinionated web framework for Node.js',
    link: 'https://github.com/expressjs/express',
    category: 'Backend Development',
    type: 'framework',
    tags: ['nodejs', 'javascript', 'web']
  },

  // Mobile Development
  {
    id: '8',
    title: 'Flutter',
    description: 'Google\'s UI toolkit for building mobile, web, and desktop apps',
    link: 'https://github.com/flutter/flutter',
    category: 'Mobile Development',
    type: 'framework',
    tags: ['dart', 'mobile', 'cross-platform']
  },
  {
    id: '9',
    title: 'React Native',
    description: 'Framework for building native apps with React',
    link: 'https://github.com/facebook/react-native',
    category: 'Mobile Development',
    type: 'framework',
    tags: ['react', 'mobile', 'javascript']
  },
  {
    id: '10',
    title: 'Kotlin',
    description: 'Modern programming language for Android development',
    link: 'https://github.com/JetBrains/kotlin',
    category: 'Mobile Development',
    type: 'language',
    tags: ['android', 'jvm', 'mobile']
  },

  // Cloud Native
  {
    id: '11',
    title: 'Kubernetes',
    description: 'Production-Grade Container Orchestration',
    link: 'https://github.com/kubernetes/kubernetes',
    category: 'Cloud Native',
    type: 'platform',
    tags: ['containers', 'orchestration', 'cloud']
  },
  {
    id: '12',
    title: 'Docker',
    description: 'Container platform for building, sharing, and running applications',
    link: 'https://github.com/docker/docker-ce',
    category: 'Cloud Native',
    type: 'platform',
    tags: ['containers', 'virtualization']
  },

  // DevOps & CI/CD
  {
    id: '13',
    title: 'Jenkins',
    description: 'Automation server for building, deploying, and automating projects',
    link: 'https://github.com/jenkinsci/jenkins',
    category: 'DevOps & CI/CD',
    type: 'tool',
    tags: ['automation', 'ci-cd', 'java']
  },
  {
    id: '14',
    title: 'GitHub Actions',
    description: 'Automate your workflow from idea to production',
    link: 'https://github.com/features/actions',
    category: 'DevOps & CI/CD',
    type: 'tool',
    tags: ['automation', 'ci-cd', 'github']
  },

  // Security & Compliance
  {
    id: '15',
    title: 'OWASP ZAP',
    description: 'Web app security scanner',
    link: 'https://github.com/zaproxy/zaproxy',
    category: 'Security & Compliance',
    type: 'tool',
    tags: ['security', 'testing', 'scanner']
  },
  {
    id: '16',
    title: 'Vault',
    description: 'Tool for secrets management, encryption, and privileged access',
    link: 'https://github.com/hashicorp/vault',
    category: 'Security & Compliance',
    type: 'tool',
    tags: ['security', 'secrets', 'encryption']
  },

  // Data & AI
  {
    id: '17',
    title: 'TensorFlow',
    description: 'Open source platform for machine learning',
    link: 'https://github.com/tensorflow/tensorflow',
    category: 'Data & AI',
    type: 'framework',
    tags: ['machine-learning', 'ai', 'python']
  },
  {
    id: '18',
    title: 'PyTorch',
    description: 'Machine learning framework for Python',
    link: 'https://github.com/pytorch/pytorch',
    category: 'Data & AI',
    type: 'framework',
    tags: ['machine-learning', 'ai', 'python']
  },

  // Development Tools
  {
    id: '19',
    title: 'Visual Studio Code',
    description: 'Code editor redefined and optimized for building modern web and cloud applications',
    link: 'https://github.com/microsoft/vscode',
    category: 'Development Tools',
    type: 'tool',
    tags: ['editor', 'ide', 'microsoft']
  },
  {
    id: '20',
    title: 'Git',
    description: 'Distributed version control system',
    link: 'https://github.com/git/git',
    category: 'Development Tools',
    type: 'tool',
    tags: ['version-control', 'cli']
  }
];

// Categories for filtering
export const categories = [
  'Frontend Development',
  'Backend Development',
  'Mobile Development',
  'Cloud Native',
  'DevOps & CI/CD',
  'Security & Compliance',
  'Data & AI',
  'Development Tools'
];

// Types for filtering
export const types = [
  'framework',
  'library',
  'tool',
  'platform',
  'language'
];

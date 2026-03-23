// Pre-built VICAR threat model templates.
// Each template is a complete React Flow graph (nodes + edges) ready to load.

export const TEMPLATES = [
  // ────────────────────────────────────────────────────────────────────────────
  // Template 1 — Credential Phishing
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'credential-phishing',
    name: 'Credential Phishing',
    description:
      'An external adversary sends spear-phishing emails to steal employee credentials on a web portal with weak MFA.',
    nodes: [
      // Trust boundaries
      {
        id: 't1_zone_ext',
        type: 'trustBoundary',
        position: { x: 20, y: 50 },
        data: { title: 'Internet', zoneType: 'external' },
        style: { width: 240, height: 160 },
        zIndex: 0,
      },
      {
        id: 't1_zone_int',
        type: 'trustBoundary',
        position: { x: 290, y: 20 },
        data: { title: 'Internal Network', zoneType: 'internal' },
        style: { width: 800, height: 420 },
        zIndex: 0,
      },
      // Nodes
      {
        id: 't1_actor',
        type: 'threatActor',
        position: { x: 75, y: 115 },
        data: {
          title: 'External Adversary',
          description: 'Financially motivated attacker using commodity phishing kits.',
          actorType: 'external',
          motivation: 'Financial gain',
        },
        zIndex: 1,
      },
      {
        id: 't1_vector',
        type: 'attackVector',
        position: { x: 350, y: 100 },
        data: {
          title: 'Spear-Phishing Email',
          description: 'Crafted email with malicious link impersonating IT support.',
          technique: 'Phishing',
          reference: 'T1566.001',
        },
        zIndex: 1,
      },
      {
        id: 't1_surface',
        type: 'attackSurface',
        position: { x: 580, y: 100 },
        data: {
          title: 'Employee Login Portal',
          description: 'Web-based SSO portal exposed to the internet.',
          assetType: 'api',
          owner: 'Platform Team',
        },
        zIndex: 1,
      },
      {
        id: 't1_control',
        type: 'control',
        position: { x: 580, y: 295 },
        data: {
          title: 'MFA Enforcement',
          description: 'Multi-factor auth is enabled but not enforced for all user roles.',
          status: 'weak',
          controlType: 'preventive',
        },
        zIndex: 1,
      },
      {
        id: 't1_impact',
        type: 'impact',
        position: { x: 810, y: 100 },
        data: {
          title: 'Account Takeover',
          description: 'Attacker gains full access to the compromised employee account.',
          impactType: 'confidentiality',
          severity: 'high',
        },
        zIndex: 1,
      },
      {
        id: 't1_threat',
        type: 'threat',
        position: { x: 810, y: 295 },
        data: {
          title: 'Credential Phishing',
          description: 'High-likelihood threat combining phishing with weak MFA posture.',
          ranking: 'high',
          notes: 'Enforce MFA for all accounts. Adopt phishing-resistant FIDO2 keys.',
        },
        zIndex: 1,
      },
    ],
    edges: [
      { id: 't1_e1', source: 't1_actor',   target: 't1_vector',  type: 'vicarEdge', animated: false, data: { label: 'sends' } },
      { id: 't1_e2', source: 't1_vector',  target: 't1_surface', type: 'vicarEdge', animated: false, data: { label: 'targets' } },
      { id: 't1_e3', source: 't1_surface', target: 't1_impact',  type: 'vicarEdge', animated: false, data: { label: 'leads to' } },
      { id: 't1_e4', source: 't1_control', target: 't1_surface', type: 'vicarEdge', animated: false, data: { label: 'protects' } },
      { id: 't1_e5', source: 't1_impact',  target: 't1_threat',  type: 'vicarEdge', animated: false, data: { label: 'materializes as' } },
    ],
  },

  // ────────────────────────────────────────────────────────────────────────────
  // Template 2 — SQL Injection
  // ────────────────────────────────────────────────────────────────────────────
  {
    id: 'sql-injection',
    name: 'SQL Injection',
    description:
      'An attacker exploits missing input validation on legacy API endpoints to dump customer records from a product database.',
    nodes: [
      // Trust boundaries
      {
        id: 't2_zone_ext',
        type: 'trustBoundary',
        position: { x: 20, y: 50 },
        data: { title: 'Internet', zoneType: 'external' },
        style: { width: 240, height: 160 },
        zIndex: 0,
      },
      {
        id: 't2_zone_dmz',
        type: 'trustBoundary',
        position: { x: 290, y: 20 },
        data: { title: 'DMZ', zoneType: 'dmz' },
        style: { width: 800, height: 420 },
        zIndex: 0,
      },
      // Nodes
      {
        id: 't2_actor',
        type: 'threatActor',
        position: { x: 75, y: 115 },
        data: {
          title: 'Opportunistic Attacker',
          description: 'Automated scanner followed by manual exploitation.',
          actorType: 'external',
          motivation: 'Data theft / resale',
        },
        zIndex: 1,
      },
      {
        id: 't2_vector',
        type: 'attackVector',
        position: { x: 350, y: 100 },
        data: {
          title: 'SQL Injection',
          description: 'Malicious SQL payloads injected through unsanitized form fields.',
          technique: 'SQL Injection',
          reference: 'A03:2021',
        },
        zIndex: 1,
      },
      {
        id: 't2_surface',
        type: 'attackSurface',
        position: { x: 580, y: 100 },
        data: {
          title: 'Product Database',
          description: 'Relational database holding customer and order records.',
          assetType: 'database',
          owner: 'Backend Team',
        },
        zIndex: 1,
      },
      {
        id: 't2_control',
        type: 'control',
        position: { x: 580, y: 295 },
        data: {
          title: 'Input Validation',
          description: 'No parameterised queries or ORM used in legacy API endpoints.',
          status: 'missing',
          controlType: 'preventive',
        },
        zIndex: 1,
      },
      {
        id: 't2_impact',
        type: 'impact',
        position: { x: 810, y: 100 },
        data: {
          title: 'Data Exfiltration',
          description: 'Customer PII and payment data dumped to attacker-controlled server.',
          impactType: 'confidentiality',
          severity: 'critical',
        },
        zIndex: 1,
      },
      {
        id: 't2_threat',
        type: 'threat',
        position: { x: 810, y: 295 },
        data: {
          title: 'Database Breach',
          description: 'Critical risk — missing controls combined with exposed data assets.',
          ranking: 'high',
          notes: 'Migrate to parameterised queries. Add WAF SQLi rules. Run DAST scans.',
        },
        zIndex: 1,
      },
    ],
    edges: [
      { id: 't2_e1', source: 't2_actor',   target: 't2_vector',  type: 'vicarEdge', animated: false, data: { label: 'performs' } },
      { id: 't2_e2', source: 't2_vector',  target: 't2_surface', type: 'vicarEdge', animated: false, data: { label: 'attacks' } },
      { id: 't2_e3', source: 't2_surface', target: 't2_impact',  type: 'vicarEdge', animated: false, data: { label: 'exposes' } },
      { id: 't2_e4', source: 't2_control', target: 't2_surface', type: 'vicarEdge', animated: false, data: { label: 'should protect' } },
      { id: 't2_e5', source: 't2_impact',  target: 't2_threat',  type: 'vicarEdge', animated: false, data: { label: 'classified as' } },
    ],
  },
];

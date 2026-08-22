<?php

namespace Database\Seeders;

use App\Models\PageSection;
use Illuminate\Database\Seeder;

class PageSectionSeeder extends Seeder
{
    public function run(): void
    {
        $sections = [
            'hero' => [
                'eyebrow' => 'Bulk SMS, for Kenyan Enterprises',
                'headline_before' => 'Send bulk SMS over a ',
                'headline_highlight' => 'direct SMPP connection',
                'headline_after' => ' to the network — not through an aggregator.',
                'subhead' =>
                    "{productName} connects straight to the MNO's SMSC, starting with Safaricom. That means direct control over routing, cost, compliance, and your data — with real-time delivery reports and CAK-compliant sender governance built in from day one.",
                'primary_cta_label' => 'Request early access',
                'secondary_cta_label' => 'See the platform',
                'trust_stats' => [
                    ['label' => 'Licensed', 'value' => 'CA CSP'],
                    ['label' => 'Connection', 'value' => 'Direct SMPP'],
                    ['label' => 'Uptime target', 'value' => '99.9%'],
                ],
            ],

            'features' => [
                'heading' => 'Everything a compliance-conscious sender needs — nothing you have to build yourself.',
                'groups' => [
                    [
                        'category' => 'Core messaging',
                        'items' => [
                            'Single & bulk SMS send via API or portal',
                            'Scheduled and recurring campaigns',
                            'Two-way messaging with automated keyword replies',
                            'Long/concatenated SMS and Unicode support',
                            'Multiple sender IDs per account',
                        ],
                    ],
                    [
                        'category' => 'Compliance & trust',
                        'items' => [
                            'Opt-out / DND list management',
                            'CAK sending-window enforcement',
                            'Sender-ID approval workflow',
                            'Prohibited-content filtering',
                        ],
                    ],
                    [
                        'category' => 'Account & billing',
                        'items' => [
                            'Prepaid wallet with real-time balance',
                            'Multi-user accounts with role-based access',
                            'Full transaction ledger',
                        ],
                    ],
                    [
                        'category' => 'Reporting & analytics',
                        'items' => [
                            'Real-time delivery reports (DLR)',
                            'Campaign-level analytics dashboards',
                            'Exportable reports',
                        ],
                    ],
                    [
                        'category' => 'Developer tools',
                        'items' => [
                            'REST API with API-key authentication',
                            'Webhooks for delivery/status events',
                            'Sandbox / test environment',
                        ],
                    ],
                    [
                        'category' => 'Reliability',
                        'items' => [
                            'Automatic failover and retry logic',
                            'Queue-based architecture absorbs traffic bursts',
                            '99.9% uptime target',
                        ],
                    ],
                ],
            ],

            'security' => [
                'heading' => 'Built to survive review, not just a demo.',
                'bullets' => [
                    ['icon' => 'lock', 'title' => 'TLS in transit', 'body' => 'All client-facing API and portal traffic runs over TLS.'],
                    ['icon' => 'shield-check', 'title' => 'Encrypted at rest', 'body' => 'Contact data and message content are encrypted in storage.'],
                    ['icon' => 'key-round', 'title' => 'RBAC + key rotation', 'body' => 'Role-based access for portal/admin users; per-client API keys support rotation.'],
                    ['icon' => 'scroll-text', 'title' => 'Kenya DPA, 2019', 'body' => 'Subscriber data handling complies with the Kenya Data Protection Act, 2019.'],
                    ['icon' => 'clock-3', 'title' => 'CAK sending rules', 'body' => 'Sending-window and DND opt-out rules are enforced automatically, not manually.'],
                    ['icon' => 'list-checks', 'title' => 'Rate limits + audit log', 'body' => 'Per-account rate limiting, prohibited-content filtering, full audit logging of submissions.'],
                ],
            ],

            'glossary' => [
                'items' => [
                    [
                        'title' => 'What is SMPP?',
                        'body' => "SMPP (Short Message Peer-to-Peer) is the industry-standard protocol used to exchange SMS traffic between an application and a mobile network's SMSC. {productName} holds a persistent SMPP v3.4 bind directly to the MNO, rather than sending through a reseller's own SMPP connection.",
                    ],
                    [
                        'title' => 'What is a DLR?',
                        'body' => 'A DLR (delivery report) is the confirmation sent back by the network stating whether a message reached the handset. Every message sent through the platform gets a DLR captured and matched back to it in real time.',
                    ],
                    [
                        'title' => 'What is sender-ID governance?',
                        'body' => "It's the approval process that maps an alphanumeric sender name (e.g. your business name) to a verified account before it can be used, so recipients can trust who a message is really from and spoofed sender names are rejected.",
                    ],
                    [
                        'title' => 'What is a prepaid wallet?',
                        'body' => 'You top up your account, and each successfully delivered message deducts from your balance. Every top-up and deduction is recorded in a transaction ledger you can view and export.',
                    ],
                ],
            ],

            'how_it_works' => [
                'heading' => 'Two ways in. One direct route to the network.',
                'subhead' => 'However a message reaches the platform — API or portal — it leaves the same way: over our own SMPP bind, straight to the MNO. Nothing resold in between.',
                'steps' => [
                    [
                        'n' => '01',
                        'title' => 'Send — your way in',
                        'badges' => ['REST API', 'Web portal'],
                        'body' => 'Developers integrate against the REST API — single send, bulk send via JSON/CSV, webhooks. Campaign teams use the web portal instead. Same platform, same routing, underneath either one.',
                    ],
                    [
                        'n' => '02',
                        'title' => 'Route — direct to the network',
                        'badges' => ['Direct SMPP bind'],
                        'body' => "No resale hop. The message goes out over our own persistent SMPP v3.4 bind straight to the MNO's SMSC — Safaricom first — the same connection every time, not resold third-party capacity.",
                    ],
                    [
                        'n' => '03',
                        'title' => 'Confirm',
                        'badges' => [],
                        'body' => 'A delivery report (DLR) comes back from the network and is matched to the original message.',
                    ],
                    [
                        'n' => '04',
                        'title' => 'Report',
                        'badges' => [],
                        'body' => 'Delivery status, campaign analytics, and wallet usage are all visible in real time in the dashboard.',
                    ],
                ],
            ],

            'engineering' => [
                'heading' => 'A REST API, not a black box.',
                'bullets' => [
                    'API-key authentication, with rotation support',
                    'Webhooks for delivery/status events',
                    'Sandbox environment, isolated from your live wallet and traffic',
                    "Standard REST/JSON — fits whatever stack you're already running",
                ],
                'cta_label' => 'Get API access',
                'api_endpoints' => [
                    ['method' => 'POST', 'path' => '/v1/sms/send', 'desc' => 'Submit a single SMS'],
                    ['method' => 'POST', 'path' => '/v1/sms/bulk', 'desc' => 'Submit a batch (JSON or CSV)'],
                    ['method' => 'GET', 'path' => '/v1/sms/status/{message_id}', 'desc' => 'Delivery status lookup'],
                    ['method' => 'POST', 'path' => '/v1/webhooks/register', 'desc' => 'Register a DLR callback URL'],
                    ['method' => 'GET', 'path' => '/v1/account/balance', 'desc' => 'Current wallet balance'],
                    ['method' => 'POST', 'path' => '/v1/sender-ids', 'desc' => 'Request sender-ID registration'],
                    ['method' => 'GET', 'path' => '/v1/reports/campaigns/{id}', 'desc' => 'Campaign delivery/analytics'],
                    ['method' => 'POST', 'path' => '/v1/optout', 'desc' => 'Register a recipient opt-out (DND)'],
                ],
            ],

            'stats' => [
                'items' => [
                    ['value' => '10–30 TPS', 'label' => 'per SMPP bind'],
                    ['value' => 'Horizontal', 'label' => 'scaling via additional binds & workers'],
                    ['value' => '99.9%', 'label' => 'uptime target, excl. scheduled maintenance'],
                    ['value' => 'Queue-based', 'label' => 'architecture absorbs traffic bursts'],
                ],
            ],

            'use_cases' => [
                'heading' => "Built for traffic that has to arrive — and traffic that has to obey the rules.",
                'closing_line' =>
                    'Campaign and ops teams manage sends, contact lists, and delivery reports directly in the portal; engineering teams that want it wired into their own systems integrate the same functionality through the API.',
                'segments' => [
                    [
                        'segment' => 'Banks & SACCOs',
                        'body' => 'Transaction alerts, OTPs, and statement notifications where delivery has to be immediate, auditable, and never queued behind a promotional blast.',
                        'scenarios' => [
                            'One-time passcodes for login and transaction approval',
                            'Real-time debit/credit and low-balance alerts',
                            'Statement and mini-statement notifications',
                            'Loan repayment and arrears reminders',
                        ],
                    ],
                    [
                        'segment' => 'Retail & Enterprise',
                        'body' => 'Promotional and operational messaging at volume, sent through a system that enforces CAK sending-window and opt-out rules automatically instead of leaving compliance to whoever hits send.',
                        'scenarios' => [
                            'Scheduled promotional campaigns to segmented contact lists',
                            'Order confirmations and delivery notifications',
                            'Appointment, renewal, and payment reminders',
                            'Internal staff and operational alerts',
                        ],
                    ],
                ],
            ],

            'final_cta' => [
                'headline' => 'Get early access before general availability.',
                'body' =>
                    "We're onboarding a small number of pilot clients ahead of go-live — particularly banks, SACCOs, and enterprises with recurring, high-volume messaging needs. Pilot clients get preferential pricing, direct input into the roadmap, and dedicated onboarding support. Tell us about your sending volume and use case.",
                'cta_label' => 'Request early access',
            ],
        ];

        foreach ($sections as $key => $content) {
            PageSection::updateOrCreate(['key' => $key], ['content' => $content]);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\FaqItem;
use Illuminate\Database\Seeder;

class FaqItemSeeder extends Seeder
{
    /**
     * Mirrors the faqFallback array in the marketing site's lib/cms.ts —
     * keep the two in sync if either changes. This is the same gap that
     * PageSectionSeeder fixed for page content: without it, the faq_items
     * table stays empty forever, the admin has nothing to show as existing
     * FAQs to edit, and the marketing site silently runs on its hardcoded
     * TypeScript fallback the whole time, masking the empty database.
     */
    public function run(): void
    {
        $faqs = [
            [
                'question' => 'How is this different from a bulk SMS aggregator or CPaaS provider?',
                'answer' => "Most bulk SMS providers in Kenya relay your traffic through their own upstream carrier relationships and charge a margin on top. This platform connects directly to the MNO's SMSC over SMPP, so routing, cost, compliance, and data handling stay in one place instead of passing through a reseller.",
                'sort_order' => 1,
            ],
            [
                'question' => 'Which mobile networks are supported?',
                'answer' => "Safaricom is the first direct SMPP integration. The platform's routing layer is built to extend to Airtel and Telkom without an architectural change.",
                'sort_order' => 2,
            ],
            [
                'question' => 'Is this compliant with Kenyan telecoms regulation?',
                'answer' => 'The platform operates under a CA Communications Service Provider (CSP) licence. It enforces CAK-mandated sending-time windows for promotional messages, maintains an opt-out/DND list automatically, and requires sender IDs to be pre-approved and mapped to a verified account before use.',
                'sort_order' => 3,
            ],
            [
                'question' => 'How is subscriber data protected?',
                'answer' => 'Contact data and message content are encrypted at rest, all client-facing traffic runs over TLS, and handling of subscriber phone numbers and message content complies with the Kenya Data Protection Act, 2019.',
                'sort_order' => 4,
            ],
            [
                'question' => 'How do I integrate — API or dashboard?',
                'answer' => 'Both. A REST API (single send, bulk send, delivery-status lookup, webhook registration) covers programmatic integration, with a sandbox environment for testing. The web portal covers campaign creation, contact-list management, and reporting for non-technical users.',
                'sort_order' => 5,
            ],
            [
                'question' => 'How is message delivery tracked?',
                'answer' => 'Every submitted message gets a delivery report (DLR) from the network, captured and exposed in real time — at the individual message level and rolled up into campaign-level analytics you can export.',
                'sort_order' => 6,
            ],
            [
                'question' => 'How does billing work?',
                'answer' => 'Billing runs on a prepaid wallet: top up, and balance is deducted per successfully routed message. Every top-up and deduction is recorded in a full transaction ledger, visible in real time.',
                'sort_order' => 7,
            ],
            [
                'question' => 'What throughput can I expect?',
                'answer' => 'The initial target is 10–30 transactions per second (TPS) per SMPP bind. Throughput scales horizontally by adding further binds and worker instances as volume grows, without changing how you integrate.',
                'sort_order' => 8,
            ],
        ];

        foreach ($faqs as $faq) {
            FaqItem::updateOrCreate(
                ['question' => $faq['question']],
                ['answer' => $faq['answer'], 'sort_order' => $faq['sort_order'], 'is_published' => true],
            );
        }
    }
}

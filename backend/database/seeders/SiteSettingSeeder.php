<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SiteSettingSeeder extends Seeder
{
    /**
     * Mirrors every field in the marketing site's lib/site-config.ts, so the
     * CMS starts out in sync with what's actually live rather than empty.
     */
    public function run(): void
    {
        $defaults = [
            'product_name' => 'Zentive',
            'company_name' => 'Xtranet Communications Limited',
            'tagline' => 'Direct-to-carrier bulk SMS for Kenyan businesses',
            'domain' => 'https://zentive.xtranet.co.ke',
            'contact_email' => 'info@xtranet.co.ke',
            'contact_phone' => '+254 020 2490999',
            'street_address' => 'TRV Building, 7th Floor, Muthithi Road, Westlands',
            'address_locality' => 'Nairobi',
            'address_country' => 'KE',
            'regulator' => 'Communications Authority of Kenya (CAK)',
            'licence' => 'CA Communications Service Provider (CSP) licence',
            'data_law' => 'Kenya Data Protection Act, 2019',
            'social_linkedin' => '',
            'social_x' => '',
        ];
        foreach ($defaults as $key => $value) {
            SiteSetting::firstOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}

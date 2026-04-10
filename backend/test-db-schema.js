require('dotenv').config();
const supabase = require('./config/supabase');

async function testDatabaseSchema() {
    console.log('========================================');
    console.log('Testing Database Schema & Data');
    console.log('========================================\n');

    // Test Products
    console.log('1. PRODUCTS TABLE:');
    console.log('-------------------');
    const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .limit(1);

    if (productsError) {
        console.error('❌ Products Error:', productsError);
    } else if (products && products.length > 0) {
        console.log('✅ Products data found');
        console.log('📊 First product:', JSON.stringify(products[0], null, 2));
        console.log('🔑 Available columns:', Object.keys(products[0]));
    } else {
        console.log('⚠️ No products found in database');
    }

    console.log('\n');

    // Test Vendors
    console.log('2. VENDORS TABLE:');
    console.log('-------------------');
    const { data: vendors, error: vendorsError } = await supabase
        .from('vendors')
        .select('*')
        .limit(1);

    if (vendorsError) {
        console.error('❌ Vendors Error:', vendorsError);
    } else if (vendors && vendors.length > 0) {
        console.log('✅ Vendors data found');
        console.log('📊 First vendor:', JSON.stringify(vendors[0], null, 2));
        console.log('🔑 Available columns:', Object.keys(vendors[0]));
    } else {
        console.log('⚠️ No vendors found in database');
    }

    console.log('\n');

    // Test API Response Format
    console.log('3. TESTING API RESPONSE FORMAT:');
    console.log('-------------------');
    
    try {
        const response = await fetch('http://localhost:4000/api/products?limit=1');
        const data = await response.json();
        console.log('✅ API Response structure:', JSON.stringify(data, null, 2));
        console.log('🔍 Response keys:', Object.keys(data));
        if (data.data) {
            console.log('🔍 data.data keys:', Object.keys(data.data));
            if (data.data.items) {
                console.log('🔍 data.data.items length:', data.data.items.length);
                if (data.data.items.length > 0) {
                    console.log('🔍 First item keys:', Object.keys(data.data.items[0]));
                }
            }
        }
    } catch (error) {
        console.error('❌ API Test Error:', error.message);
        console.log('⚠️ Make sure backend server is running on port 4000');
    }

    console.log('\n========================================');
    console.log('Test Complete');
    console.log('========================================');
    process.exit(0);
}

testDatabaseSchema();

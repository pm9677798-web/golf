// DEBUG ADMIN API - Check what's being returned
// Run this in browser console on admin page

async function debugAdminAPI() {
    console.log('=== DEBUGGING ADMIN API ===');
    
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    console.log('Token found:', !!token);
    
    if (!token) {
        console.error('❌ No auth token found! Please login first.');
        return;
    }
    
    try {
        // Call admin dashboard API
        console.log('🔄 Calling /api/admin/dashboard...');
        const response = await fetch('/api/admin/dashboard', {
            headers: { 
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error:', errorText);
            return;
        }
        
        const data = await response.json();
        console.log('✅ API Response received');
        
        // Check winners data
        console.log('\n=== WINNERS DATA ===');
        console.log('Winners array:', data.winners);
        console.log('Winners count:', data.winners?.length || 0);
        
        if (data.winners && data.winners.length > 0) {
            console.log('✅ Winners found!');
            data.winners.forEach((winner, index) => {
                console.log(`Winner ${index + 1}:`, {
                    id: winner.id,
                    userName: winner.userName,
                    matchType: winner.match_type,
                    prizeAmount: winner.prize_amount,
                    verificationStatus: winner.verification_status,
                    paymentStatus: winner.payment_status
                });
            });
        } else {
            console.log('❌ No winners found in API response');
        }
        
        // Check stats
        console.log('\n=== STATS DATA ===');
        console.log('Pending winners count:', data.stats?.pendingWinners || 0);
        console.log('Total users:', data.stats?.totalUsers || 0);
        console.log('Active subscribers:', data.stats?.activeSubscribers || 0);
        
        // Check draws
        console.log('\n=== DRAWS DATA ===');
        console.log('Draws count:', data.draws?.length || 0);
        if (data.draws && data.draws.length > 0) {
            console.log('Latest draw:', data.draws[0]);
        }
        
        return data;
        
    } catch (error) {
        console.error('❌ Network error:', error);
    }
}

// Auto-run the debug
debugAdminAPI();

console.log('🔍 Debug script loaded. Check results above.');
console.log('💡 If no winners shown, run the GUARANTEED-WINNER-TEST.sql script first.');
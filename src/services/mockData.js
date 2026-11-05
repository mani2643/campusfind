// Initial mock sample data for CampusFind demonstration
// Represents realistic hostel situations with items, claims, and handovers

export const INITIAL_PERSONAS = [
  {
    id: 'user_bharath',
    name: 'bharath',
    role: 'Student',
    hostel: 'Hostel Block B',
    room: 'B-204',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    email: 'bharath@campus.edu'
  },
  {
    id: 'user_abhishek',
    name: 'abhishek',
    role: 'Student',
    hostel: 'Hostel Block A',
    room: 'A-112',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
    email: 'abhishek@campus.edu'
  },
  {
    id: 'user_sai',
    name: 'sai',
    role: 'Student',
    hostel: 'Hostel Block C',
    room: 'C-305',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    email: 'sai@campus.edu'
  },
  {
    id: 'user_bhanu_prakash',
    name: 'bhanu prakash',
    role: 'Student',
    hostel: 'Hostel Block B',
    room: 'B-118',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    email: 'bhanu.prakash@campus.edu'
  },
  {
    id: 'user_pravallika',
    name: 'pravallika',
    role: 'Student',
    hostel: 'Hostel Block A',
    room: 'A-207',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    email: 'pravallika@campus.edu'
  },
  {
    id: 'user_vaishnavi',
    name: 'vaishnavi',
    role: 'Student',
    hostel: 'Hostel Block D',
    room: 'D-105',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    email: 'vaishnavi@campus.edu'
  },
  {
    id: 'user_vennela',
    name: 'vennela',
    role: 'Student',
    hostel: 'Hostel Block C',
    room: 'C-214',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    email: 'vennela@campus.edu'
  }
];

export const CATEGORIES = [
  'All',
  'Electronics',
  'ID Cards',
  'Keys',
  'Wallets',
  'Bags',
  'Books',
  'Clothing',
  'Bottles',
  'Accessories',
  'Other'
];

export const LOCATIONS = [
  'All Locations',
  'Hostel Block A',
  'Hostel Block B',
  'Hostel Block C',
  'Hostel Block D',
  'Central Mess / Dining Hall',
  'Central Library',
  'Badminton / Sports Complex',
  'Canteen / Food Court',
  'Common Room',
  'Academic Block 1',
  'Computer Centre'
];

export const INITIAL_ITEMS = [
  {
    id: 'item-101',
    type: 'found', // 'lost' | 'found'
    title: 'Brass Room Key with Blue Spiral Keychain',
    category: 'Keys',
    location: 'Central Mess / Dining Hall',
    dateReported: '2026-10-25T14:30:00Z',
    dateEvent: '2026-10-25',
    status: 'open', // 'open' | 'claim_pending' | 'in_handover' | 'returned'
    description: 'Found on table 14 near the juice counter after lunch.',
    image: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    hasHiddenClue: true,
    hiddenClueDescription: 'Key has room number stamped on the back: B-204, and a mini brass bottle opener.',
    reporterId: 'user_abhishek',
    reporterName: 'abhishek',
    reporterHostel: 'Hostel Block A',
    custody: 'with_finder', // 'with_finder' | 'with_admin'
    currentHolder: 'abhishek (Hostel A-112)',
    contactPref: 'in_app'
  },
  {
    id: 'item-102',
    type: 'found',
    title: 'College Student ID Card in Transparent Lanyard',
    category: 'ID Cards',
    location: 'Central Library',
    dateReported: '2026-10-26T09:15:00Z',
    dateEvent: '2026-10-26',
    status: 'open',
    description: 'Found on the 2nd-floor quiet study carrel #18 next to the window.',
    image: 'https://images.unsplash.com/photo-1589330694653-dad6bc0140fa?auto=format&fit=crop&w=600&q=80',
    hasHiddenClue: true,
    hiddenClueDescription: 'Card holder has a small Pikachu sticker on the reverse and roll number ending in 408.',
    reporterId: 'user_bharath',
    reporterName: 'bharath',
    reporterHostel: 'Hostel Block B',
    custody: 'with_admin',
    currentHolder: 'Library Front Desk / Caretaker',
    contactPref: 'in_app'
  },
  {
    id: 'item-103',
    type: 'lost',
    title: 'Matte Blue Hydro Flask (750ml)',
    category: 'Bottles',
    location: 'Badminton / Sports Complex',
    dateReported: '2026-10-24T18:00:00Z',
    dateEvent: '2026-10-24',
    status: 'claim_pending',
    description: 'Left near court 2 bleachers during evening practice. Has minor dent near base.',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    distinguishingFeatures: 'Dent on the bottom rim, black loop cap, slight scratch on the logo.',
    reporterId: 'user_sai',
    reporterName: 'sai',
    reporterHostel: 'Hostel Block C',
    currentHolder: 'Searching',
    contactPref: 'in_app'
  },
  {
    id: 'item-104',
    type: 'lost',
    title: 'Sony WH-1000XM4 Noise Canceling Headphones (Black)',
    category: 'Electronics',
    location: 'Hostel Block B',
    dateReported: '2026-10-23T20:45:00Z',
    dateEvent: '2026-10-23',
    status: 'open',
    description: 'In hard zippered case. Last used in 1st floor TV / Common room around 9 PM.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    distinguishingFeatures: 'Airplane adapter and short auxiliary cable inside top mesh pouch.',
    reporterId: 'user_bharath',
    reporterName: 'bharath',
    reporterHostel: 'Hostel Block B',
    currentHolder: 'Searching',
    contactPref: 'in_app'
  },
  {
    id: 'item-105',
    type: 'found',
    title: 'Scientific Calculator Casio fx-991EX',
    category: 'Electronics',
    location: 'Academic Block 1',
    dateReported: '2026-10-22T11:00:00Z',
    dateEvent: '2026-10-22',
    status: 'returned',
    description: 'Found in Lecture Hall 3 on bench 5 after Engineering Math exam.',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    hasHiddenClue: true,
    hiddenClueDescription: 'Back cover had handwritten formula notes in silver ink.',
    reporterId: 'user_abhishek',
    reporterName: 'abhishek',
    reporterHostel: 'Hostel Block A',
    custody: 'with_finder',
    currentHolder: 'Returned to Owner',
    contactPref: 'in_app'
  },
  {
    id: 'item-106',
    type: 'lost',
    title: 'Tan Leather Bifold Wallet',
    category: 'Wallets',
    location: 'Canteen / Food Court',
    dateReported: '2026-10-26T21:00:00Z',
    dateEvent: '2026-10-26',
    status: 'open',
    description: 'Misplaced while paying for dinner. Contains college ID and bus pass.',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    distinguishingFeatures: 'Worn stitch on bottom fold, metro card in outer quick-access slot.',
    reporterId: 'user_sai',
    reporterName: 'sai',
    reporterHostel: 'Hostel Block C',
    currentHolder: 'Searching',
    contactPref: 'in_app'
  }
];

export const INITIAL_CLAIMS = [
  {
    id: 'claim-201',
    itemId: 'item-103',
    itemTitle: 'Matte Blue Hydro Flask (750ml)',
    claimantId: 'user_bharath',
    claimantName: 'bharath',
    claimantHostel: 'Hostel Block B',
    dateSubmitted: '2026-10-25T10:00:00Z',
    status: 'pending', // 'pending' | 'approved' | 'rejected'
    ownershipClue: 'I found a bottle matching this! It has a tiny sticker remnant near the mouth and a dent on the bottom.',
    responseNotes: ''
  },
  {
    id: 'claim-202',
    itemId: 'item-105',
    itemTitle: 'Scientific Calculator Casio fx-991EX',
    claimantId: 'user_sai',
    claimantName: 'sai',
    claimantHostel: 'Hostel Block C',
    dateSubmitted: '2026-10-22T14:10:00Z',
    status: 'approved',
    ownershipClue: 'Inside the hard slip cover I wrote Euler formula in silver gel pen.',
    responseNotes: 'Clue matched exactly! Ready for handover at Hostel A entrance.'
  }
];

export const INITIAL_HANDOVERS = [
  {
    id: 'ho-301',
    itemId: 'item-105',
    itemTitle: 'Scientific Calculator Casio fx-991EX',
    giverId: 'user_abhishek',
    giverName: 'abhishek',
    giverRole: 'Finder (Hostel Block A)',
    receiverId: 'user_sai',
    receiverName: 'sai',
    receiverRole: 'Owner (Hostel Block C)',
    handoverDate: '2026-10-22T17:30:00Z',
    location: 'Hostel Block A Gate Security Desk',
    confirmationStatus: 'Confirmed by Both Parties',
    handoverPin: '4921',
    notes: 'Verified silver ink handwriting on the slide case in person. Calculator tested and working.'
  }
];

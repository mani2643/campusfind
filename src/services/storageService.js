import { INITIAL_ITEMS, INITIAL_CLAIMS, INITIAL_HANDOVERS } from './mockData';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEYS = {
  ITEMS: 'campusfind_items_v2',
  CLAIMS: 'campusfind_claims_v2',
  HANDOVERS: 'campusfind_handovers_v2'
};

// Helper: load from localStorage with fallback to initial mock data
function loadLocal(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error loading localStorage key "${key}":`, err);
    return fallback;
  }
}

// Helper: save to localStorage
function saveLocal(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving localStorage key "${key}":`, err);
  }
}

export const storageService = {
  getStorageMode() {
    const isCloud = isSupabaseConfigured();
    return {
      mode: isCloud ? 'supabase' : 'local',
      isCloud,
      label: isCloud ? 'Supabase Cloud Storage' : 'Demo Mode (Local Storage)',
      note: isCloud
        ? 'Real-time synchronization enabled across all users & devices.'
        : 'Running in browser memory. Data will not sync across other devices or incognito windows.'
    };
  },

  resetToSampleData() {
    saveLocal(STORAGE_KEYS.ITEMS, INITIAL_ITEMS);
    saveLocal(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);
    saveLocal(STORAGE_KEYS.HANDOVERS, INITIAL_HANDOVERS);
    return true;
  },

  async getStats() {
    const items = await this.getItems({});
    const total = items.length;
    const lost = items.filter(i => i.type === 'lost').length;
    const found = items.filter(i => i.type === 'found').length;
    const returned = items.filter(i => i.status === 'returned').length;
    const active = items.filter(i => i.status !== 'returned').length;
    const claims = await this.getClaims();
    const pendingClaims = claims.filter(c => c.status === 'pending').length;
    const returnRate = total > 0 ? Math.round((returned / total) * 100) : 0;

    return {
      total,
      lost,
      found,
      returned,
      active,
      pendingClaims,
      returnRate
    };
  },

  async getItems(filters = {}) {
    const {
      type = 'all',
      category = 'All',
      location = 'All Locations',
      status = 'all', // 'all', 'active', 'open', 'returned', 'claim_pending'
      searchQuery = '',
      sortBy = 'newest'
    } = filters;

    let items = [];

    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase.from('items').select('*');
        if (type !== 'all') query = query.eq('type', type);
        if (category !== 'All') query = query.eq('category', category);
        if (location !== 'All Locations') query = query.eq('location', location);
        if (status === 'active') {
          query = query.neq('status', 'returned');
        } else if (status !== 'all') {
          query = query.eq('status', status);
        }

        const { data, error } = await query.order('created_at', { ascending: sortBy !== 'newest' });
        if (error) throw error;
        items = data || [];
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local:', err);
        items = loadLocal(STORAGE_KEYS.ITEMS, INITIAL_ITEMS);
      }
    } else {
      items = loadLocal(STORAGE_KEYS.ITEMS, INITIAL_ITEMS);
    }

    // Apply filtering in memory (ensures parity for local & hybrid fallback)
    return items.filter(item => {
      if (type !== 'all' && item.type !== type) return false;
      if (category !== 'All' && item.category !== category) return false;
      if (location !== 'All Locations' && item.location !== location) return false;

      if (status === 'active' && item.status === 'returned') return false;
      if (status !== 'all' && status !== 'active' && item.status !== status) return false;

      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = item.title?.toLowerCase().includes(q);
        const descMatch = item.description?.toLowerCase().includes(q);
        const locMatch = item.location?.toLowerCase().includes(q);
        const catMatch = item.category?.toLowerCase().includes(q);
        if (!titleMatch && !descMatch && !locMatch && !catMatch) return false;
      }
      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.dateReported || a.created_at || 0).getTime();
      const dateB = new Date(b.dateReported || b.created_at || 0).getTime();
      return sortBy === 'oldest' ? dateA - dateB : dateB - dateA;
    });
  },

  async getItemById(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('items').select('*').eq('id', id).single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getItemById failed:', err);
      }
    }
    const items = loadLocal(STORAGE_KEYS.ITEMS, INITIAL_ITEMS);
    return items.find(item => item.id === id) || null;
  },

  async createItem(itemData) {
    const newItem = {
      ...itemData,
      id: itemData.id || `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      dateReported: new Date().toISOString(),
      status: itemData.status || 'open'
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('items').insert([newItem]).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase createItem failed, storing locally:', err);
      }
    }

    const items = loadLocal(STORAGE_KEYS.ITEMS, INITIAL_ITEMS);
    items.unshift(newItem);
    saveLocal(STORAGE_KEYS.ITEMS, items);
    return newItem;
  },

  async updateItem(id, updates) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('items').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.warn('Supabase updateItem failed, updating locally:', err);
      }
    }

    const items = loadLocal(STORAGE_KEYS.ITEMS, INITIAL_ITEMS);
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updates };
      saveLocal(STORAGE_KEYS.ITEMS, items);
      return items[index];
    }
    return null;
  },

  async deleteItem(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('items').delete().eq('id', id);
      } catch (err) {
        console.warn('Supabase deleteItem error:', err);
      }
    }
    const items = loadLocal(STORAGE_KEYS.ITEMS, INITIAL_ITEMS);
    const filtered = items.filter(i => i.id !== id);
    saveLocal(STORAGE_KEYS.ITEMS, filtered);
    return true;
  },

  // ----------------------------------------------------
  // CLAIMS & VERIFICATION
  // ----------------------------------------------------
  async getClaims(filter = {}) {
    let claims = [];
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('claims').select('*').order('dateSubmitted', { ascending: false });
        if (!error && data) claims = data;
      } catch (err) {
        console.warn('Supabase getClaims failed:', err);
        claims = loadLocal(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);
      }
    } else {
      claims = loadLocal(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);
    }

    return claims.filter(claim => {
      if (filter.itemId && claim.itemId !== filter.itemId) return false;
      if (filter.claimantId && claim.claimantId !== filter.claimantId) return false;
      if (filter.status && claim.status !== filter.status) return false;
      return true;
    });
  },

  async createClaim(claimData) {
    const newClaim = {
      ...claimData,
      id: claimData.id || `claim-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      dateSubmitted: new Date().toISOString(),
      status: 'pending',
      responseNotes: ''
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('claims').insert([newClaim]).select().single();
        if (error) throw error;
        // Also update item status to claim_pending
        await this.updateItem(claimData.itemId, { status: 'claim_pending' });
        return data;
      } catch (err) {
        console.warn('Supabase createClaim error:', err);
      }
    }

    const claims = loadLocal(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);
    claims.unshift(newClaim);
    saveLocal(STORAGE_KEYS.CLAIMS, claims);

    // Update item status
    await this.updateItem(claimData.itemId, { status: 'claim_pending' });
    return newClaim;
  },

  async updateClaimStatus(claimId, status, responseNotes = '') {
    const claims = loadLocal(STORAGE_KEYS.CLAIMS, INITIAL_CLAIMS);
    const claim = claims.find(c => c.id === claimId);
    if (!claim) return null;

    claim.status = status;
    claim.responseNotes = responseNotes;
    claim.dateResolved = new Date().toISOString();

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('claims').update({
          status,
          responseNotes,
          dateResolved: claim.dateResolved
        }).eq('id', claimId);
      } catch (err) {
        console.warn('Supabase updateClaimStatus error:', err);
      }
    }

    saveLocal(STORAGE_KEYS.CLAIMS, claims);

    // If claim approved, mark item as in_handover
    if (status === 'approved') {
      await this.updateItem(claim.itemId, {
        status: 'in_handover',
        approvedClaimId: claim.id,
        recipientId: claim.claimantId,
        recipientName: claim.claimantName
      });
    } else if (status === 'rejected') {
      // Check if there are other pending claims
      const remainingPending = claims.filter(c => c.itemId === claim.itemId && c.id !== claimId && c.status === 'pending');
      if (remainingPending.length === 0) {
        await this.updateItem(claim.itemId, { status: 'open' });
      }
    }

    return claim;
  },

  // ----------------------------------------------------
  // HANDOVERS & RECEIPTS
  // ----------------------------------------------------
  async getHandovers() {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('handovers').select('*').order('handoverDate', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase getHandovers error:', err);
      }
    }
    return loadLocal(STORAGE_KEYS.HANDOVERS, INITIAL_HANDOVERS);
  },

  async getHandoverByItemId(itemId) {
    const handovers = await this.getHandovers();
    return handovers.find(h => h.itemId === itemId) || null;
  },

  async createHandover(handoverData) {
    const newHandover = {
      ...handoverData,
      id: handoverData.id || `ho-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      handoverDate: new Date().toISOString(),
      confirmationStatus: 'Confirmed by Both Parties',
      receiptNumber: `CP-REC-${Math.floor(100000 + Math.random() * 900000)}`
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('handovers').insert([newHandover]).select().single();
        if (error) throw error;
      } catch (err) {
        console.warn('Supabase createHandover error:', err);
      }
    }

    const handovers = loadLocal(STORAGE_KEYS.HANDOVERS, INITIAL_HANDOVERS);
    handovers.unshift(newHandover);
    saveLocal(STORAGE_KEYS.HANDOVERS, handovers);

    // Update item status to 'returned'
    await this.updateItem(handoverData.itemId, {
      status: 'returned',
      handoverId: newHandover.id,
      currentHolder: `Returned to ${handoverData.receiverName}`
    });

    return newHandover;
  }
};

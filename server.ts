import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing helper using native Node crypto
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const chosenSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, chosenSalt, 64).toString('hex');
  return { hash, salt: chosenSalt };
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(testHash, 'hex'), Buffer.from(hash, 'hex'));
}

// Initial Database Seed
function getInitialDb() {
  const alexSalt = crypto.randomBytes(16).toString('hex');
  const alexHash = crypto.scryptSync('steward2025', alexSalt, 64).toString('hex');

  const budiSalt = crypto.randomBytes(16).toString('hex');
  const budiHash = crypto.scryptSync('rigger2025', budiSalt, 64).toString('hex');

  const sarahSalt = crypto.randomBytes(16).toString('hex');
  const sarahHash = crypto.scryptSync('marine2025', sarahSalt, 64).toString('hex');

  return {
    users: [
      {
        id: 'usr_alex_01',
        name: 'Alex Stewart',
        email: 'alex@tidekind.org',
        passwordHash: alexHash,
        salt: alexSalt,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGBruc0GzJvu5OSIyeTHg_qe5tBpOWGacXbzEsoTIWq0rvSvZ0xGZptOIa5MHGWua9c_bcTq8xNUnxJtpvXwy_laAdy_xnwMFNs2G9SoRtPRTai1aX0S5aW5zikduQ6AyjDe6U-4lmIAmQr3aWWJAv_F4wzdngt_Qr-rZz3lAIYpcQ6FnSk8c581dkADFK_ogc5xL6JUpghT-ak38TFeWH63aLJZPaPFW2Q1EB68B8YsoXARi5a1pR',
        bio: 'Coastal gear recovery volunteer and drone scout operating between Sanur and Serangan Harbor.',
        location: 'Denpasar, Bali',
        chapter: 'Serangan Harbor Chapter',
        role: 'Steward',
        badge: 'Tier 2 Steward',
        stats: {
          gearDivertedKg: 340,
          hoursLogged: 18,
          projectsDone: 4,
          sortiesCount: 6,
        },
        createdAt: '2025-01-15T08:00:00Z',
      },
      {
        id: 'usr_budi_02',
        name: 'Pak Budi Santoso',
        email: 'budi@tidekind.org',
        passwordHash: budiHash,
        salt: budiSalt,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZncHLHM4J_XQwfPPfHKchwVEFgHy2TcsXg_KnbnSZqSYrAc7qw7UWn2KTul2ONpxodCfwuYoSN6oR8dVzWEXNs98Y7aQQfs2i9lFqzo6m06HS8Jki21-n2aFW47-bwIVJpeTbeQSUYf-mCQHSnepeRP-lScxmVWS2-JqdJkGnkx2y3NDcHjiNg6WnmFPcXXdfpnHqXQo3GHRFW1gAeLHgTGC2SSSxh74O9G4yAfHuEtXIipcx1CRT',
        bio: 'Master net rigger & lead coordinator for Serangan fishing co-op circular mending depot.',
        location: 'Serangan, Bali',
        chapter: 'Serangan Harbor Dock 3',
        role: 'Coordinator',
        badge: 'Master Rigger',
        stats: {
          gearDivertedKg: 1280,
          hoursLogged: 92,
          projectsDone: 14,
          sortiesCount: 28,
        },
        createdAt: '2024-11-01T08:00:00Z',
      },
      {
        id: 'usr_sarah_03',
        name: 'Dr. Sarah Jenkins',
        email: 'sarah@tidekind.org',
        passwordHash: sarahHash,
        salt: sarahSalt,
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_JBXekM3H7wnv0VFjwh76I6mOUQiyqEr3ksBlP9wn709Kde3hQ31RE4LDKSU2a_8kupEcLvuHvVKRhR1BVJ6aaKswnnv2zb4lD3d5SFJgH-6Rgb-ryquVZ6RGwIqoWGO6WxboNWb_vIo6enOGcOtO_51I3r39nVr0Bo5FMFBnsngjfZ3H0GDsdzdu_M5t2IOx0q5T-jC25xAQ8jMLqyyfwKDOTaAIEpUV-ZN1ywYcmc6JioDJkvC',
        bio: 'Marine biologist documenting coral recovery in the Sanur-Nusa Dua reef corridor.',
        location: 'Sanur, Bali',
        chapter: 'Sanur Coral Conservation',
        role: 'Admin',
        badge: 'Lead Scientist',
        stats: {
          gearDivertedKg: 490,
          hoursLogged: 45,
          projectsDone: 8,
          sortiesCount: 12,
        },
        createdAt: '2024-12-10T08:00:00Z',
      },
    ],
    sessions: {} as Record<string, { userId: string; expiresAt: number }>,
    resetTokens: {} as Record<string, { email: string; expiresAt: number }>,
    reports: [
      {
        id: 'SS-2025-042',
        gearType: 'Polypropylene Gillnet Segment',
        condition: 'Washed Ashore / Stranded',
        locationName: 'Sanur Sector 3 • Rock Jetty',
        coords: '8.7052° S, 115.2625° E',
        date: 'Today',
        time: '10:14 WITA',
        notes: 'Fragmented commercial mesh with secondary line entanglements. Dragging risk during incoming tide.',
        threatLevel: 'Moderate Dragging Risk',
        hasWildlifeEntanglement: false,
        status: 'Under Review',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYD4lFIXMCvMZVB9y6qiCPwYvE8xV6J4J9FT5BEkIz3tdeu2FKGk53IKfR8Ky9zCi2MX1pIy2-5qTRs2BEzTsvYugCIabu_06mKx7Cmaqn2sNuNexcLmWjQPfnzKwNqeKBpJBvDTjsNwUymdN7lgiRQ4ScmZwQBrzYJRGDWrwK1gl0mRNfUYLcDt59uSlGT6KTFfZ1U1iEFFi0CW5MrxSRdZ2ydqD1KoIlXaD9AHS62o63TVbSJb2k',
        submittedAt: '18 min ago',
        confidence: '91.4% Match',
        assignedTeam: 'ShoreScan Automated Quorum (2 of 3 signed)',
        creatorId: 'usr_alex_01',
        creatorName: 'Alex Stewart',
      },
      {
        id: 'TK-2025-081',
        gearType: 'Heavy Braided Longline & Float',
        condition: 'Submerged & Snagged',
        locationName: 'Benoa Channel • Marker 4',
        coords: '8.7490° S, 115.2150° E',
        date: 'Yesterday',
        time: '16:40 WITA',
        notes: 'Subsurface mooring line drifting into turtle nesting corridor. Ensnared around mooring buoy tether.',
        threatLevel: 'High Entanglement (Sea Turtle Hazard)',
        hasWildlifeEntanglement: true,
        status: 'Action Planned',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIcoWDOW_WzHmH3PODSPlArxc4xEXvmpfduVeHVsXQrmdJ1u63lBdDdGbIYsWm-vd_gMLPNnZG4JZJVTOaXYdKaCASD8IhHmt2O3BY6MmEepLlfri8S-G4I7O6d9MAS--oWd7gidSzjRsD18JPkZneskURyngYsnuXk4MXWYL--TbKisBRd3diDx1DLXCH7JY4nNKUTk4lrKt1jUepVU2QDaj4ufj6tXINPgaaB6m98u_X_NOaEFq3',
        submittedAt: 'Yesterday, 16:40',
        confidence: '88.2% Edge Conf',
        assignedTeam: 'Serangan Dive Recovery Team (Departing 06:30 AM Tomorrow)',
        creatorId: 'usr_sarah_03',
        creatorName: 'Dr. Sarah Jenkins',
      },
      {
        id: 'TK-2025-076',
        gearType: 'Abandoned Wire Crab Traps',
        condition: 'Submerged & Snagged',
        locationName: 'Kuta Harbor • Sector 3 Shelf',
        coords: '8.7214° S, 115.1762° E',
        date: 'May 12',
        time: '09:15 WITA',
        notes: '3 commercial cage units recovered without marine life casualty. Transported to PT Daur Samudera depot.',
        threatLevel: 'Ghost Fishing Risk Diverted',
        hasWildlifeEntanglement: false,
        status: 'Verified & Salvaged',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxuCCaIwzayFjPHA6ZbmB1-f8UaN7dOWMxVQRp9k-TbluDvXQhvLRI141lUXmmgzke06gUr7fVx0b3aOVPzityISNj79-YovUDT2n_BHQn6MdqljZHLGQUCOlhxQzP3-LSn2QOLXvlBmJpGqTfpIhGq6bQBX4TCILIG-TgFg8ey4XQz5Eu08lq2M94Wl8ofbbt7F0Pok1HktHdRLbJLWL43qk7ET92UEVPnBmJUPqI0M6yF6_fuh62',
        submittedAt: '3 days ago',
        confidence: '76.5% Edge Conf',
        assignedTeam: 'PT Daur Samudera Depot (Cert #DSM-8831)',
        creatorId: 'usr_budi_02',
        creatorName: 'Pak Budi Santoso',
      },
    ],
    projects: [
      {
        id: 'proj_kuta_01',
        title: 'Kuta Beach Shallow Reef Clearance',
        location: 'Kuta Harbor • South Barrier Pier',
        date: 'Sat, May 24 • 07:00 WITA',
        meetingPoint: 'Kuta Lifeguard Tower 4',
        targetTonnage: '450 kg derelict netting',
        maxParticipants: 16,
        description: 'Joint low-tide sweep targeting snagged polypropylene lines and trammel net fragments across 1.2km of shallow coral flats.',
        urgent: true,
        status: 'Active Registration',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd5Kx8lym9GTbQM6w61gM81ktjeG8h-SbXmvtc8Sf_SFCXmb8584NjpOT0iQKhDZrRKPfzXOsQQI8-kBB6thbrJc5qljOUInZJkupHNsPv5orZlJXZJYjBl7Nj64mQ4IoewT67_UFD2_MY_nTLMso1BvrLg_NnXgkBervJFt7585xhRlgQrMig9vcIfoRR8lDU2ulxyNi-Rq2OKpTfP0x8Hxo4twzA0w0k9nj9fHXGzhfXQZLkr6hd',
        participants: [
          { userId: 'usr_budi_02', name: 'Pak Budi Santoso', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZncHLHM4J_XQwfPPfHKchwVEFgHy2TcsXg_KnbnSZqSYrAc7qw7UWn2KTul2ONpxodCfwuYoSN6oR8dVzWEXNs98Y7aQQfs2i9lFqzo6m06HS8Jki21-n2aFW47-bwIVJpeTbeQSUYf-mCQHSnepeRP-lScxmVWS2-JqdJkGnkx2y3NDcHjiNg6WnmFPcXXdfpnHqXQo3GHRFW1gAeLHgTGC2SSSxh74O9G4yAfHuEtXIipcx1CRT', role: 'Team Lead' },
          { userId: 'usr_sarah_03', name: 'Dr. Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_JBXekM3H7wnv0VFjwh76I6mOUQiyqEr3ksBlP9wn709Kde3hQ31RE4LDKSU2a_8kupEcLvuHvVKRhR1BVJ6aaKswnnv2zb4lD3d5SFJgH-6Rgb-ryquVZ6RGwIqoWGO6WxboNWb_vIo6enOGcOtO_51I3r39nVr0Bo5FMFBnsngjfZ3H0GDsdzdu_M5t2IOx0q5T-jC25xAQ8jMLqyyfwKDOTaAIEpUV-ZN1ywYcmc6JioDJkvC', role: 'Biologist' },
        ],
      },
      {
        id: 'proj_sanur_02',
        title: 'Sanur Coral Head Line Cutting Sortie',
        location: 'Sanur Barrier Reef Outer Sector',
        date: 'Sun, May 25 • 08:30 WITA',
        meetingPoint: 'Sanur Maritime Center Slipway',
        targetTonnage: '280 kg braided cords',
        maxParticipants: 10,
        description: 'Snorkel extrication of monofilament and nylon cord snags caught on massive Porites coral formations. Mesh cutting tools provided.',
        urgent: false,
        status: 'Open for Registration',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNp_9RHfmSbnCp7s7U6C4Bab1MAa69TS766uCYuN4XJAjdMqJiUW9Q5Jt7377Ak-HzTNzVew9ckO35KSnxLecA8XDH5zYvjQ1UdUNrOeeTs-cwrL1ySoYSL0ragZkD0jKv_kYVopCPzb4WS6AUsinc0UEnLGrsVbNzZzYc3YSBYeczCIRWV06l04OaukNa0qhMwAYmgwJYHM5ug4tqYZAYGbW14lu1_Iw8n61Pw3eUs37D0UIvwL8Q',
        participants: [
          { userId: 'usr_sarah_03', name: 'Dr. Sarah Jenkins', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_JBXekM3H7wnv0VFjwh76I6mOUQiyqEr3ksBlP9wn709Kde3hQ31RE4LDKSU2a_8kupEcLvuHvVKRhR1BVJ6aaKswnnv2zb4lD3d5SFJgH-6Rgb-ryquVZ6RGwIqoWGO6WxboNWb_vIo6enOGcOtO_51I3r39nVr0Bo5FMFBnsngjfZ3H0GDsdzdu_M5t2IOx0q5T-jC25xAQ8jMLqyyfwKDOTaAIEpUV-ZN1ywYcmc6JioDJkvC', role: 'Diver' },
        ],
      },
      {
        id: 'proj_banyuwangi_03',
        title: 'Banyuwangi Strait Net Re-mending Workshop',
        location: 'Ketapang Port Slipway Pavilion',
        date: 'Wed, May 28 • 10:00 WIB',
        meetingPoint: 'Cooperative Workshop Unit 2',
        targetTonnage: '600 meters repaired twine',
        maxParticipants: 20,
        description: 'Hands-on net mending clinic for recovered fishing gear with elder artisans. All mended sections redistributed to low-income coastal fishers.',
        urgent: false,
        status: 'Open for Registration',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZdpGybblQEZvDk8DbCoyYQ_fNrHFcQhDZvEoZXCex1Kvo9fO-RrTqJVC4EQYs8kO2icm7Bpq6eT3gAMiw4k0ZQXl3knL1g3uoFPvwyIewHVbtNyyx2RpiJG_ARw6hrjI3UO7Ut845bxGBRKlmPS2zYWulnz4-dYNdDNyun6a4osvPquJM5xfZuSk441KClKfjd9dykPCA22oI2bH7TukngpOY_2K72me30xid3kOy5Q5MJQ_f_lS7',
        participants: [
          { userId: 'usr_budi_02', name: 'Pak Budi Santoso', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZncHLHM4J_XQwfPPfHKchwVEFgHy2TcsXg_KnbnSZqSYrAc7qw7UWn2KTul2ONpxodCfwuYoSN6oR8dVzWEXNs98Y7aQQfs2i9lFqzo6m06HS8Jki21-n2aFW47-bwIVJpeTbeQSUYf-mCQHSnepeRP-lScxmVWS2-JqdJkGnkx2y3NDcHjiNg6WnmFPcXXdfpnHqXQo3GHRFW1gAeLHgTGC2SSSxh74O9G4yAfHuEtXIipcx1CRT', role: 'Master Rigger' },
        ],
      },
    ],
    listings: [
      {
        id: 'lst_001',
        title: 'Recovered Polypropylene Line (22mm)',
        category: 'Net Mending',
        quantity: 120,
        unit: 'meters',
        condition: 'Washed & Desalted',
        location: 'Serangan Repair Hub',
        creatorId: 'usr_budi_02',
        creatorName: 'Pak Budi Santoso',
        creatorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZncHLHM4J_XQwfPPfHKchwVEFgHy2TcsXg_KnbnSZqSYrAc7qw7UWn2KTul2ONpxodCfwuYoSN6oR8dVzWEXNs98Y7aQQfs2i9lFqzo6m06HS8Jki21-n2aFW47-bwIVJpeTbeQSUYf-mCQHSnepeRP-lScxmVWS2-JqdJkGnkx2y3NDcHjiNg6WnmFPcXXdfpnHqXQo3GHRFW1gAeLHgTGC2SSSxh74O9G4yAfHuEtXIipcx1CRT',
        status: 'Available',
        createdAt: '2025-05-14T09:00:00Z',
        description: 'Diverted mooring cable, triple-washed and tension-tested. Excellent for agricultural fencing or gear reinforcement.',
      },
      {
        id: 'lst_002',
        title: 'High-Density Polyethylene Net Flakes',
        category: 'Polymer Pellets',
        quantity: 350,
        unit: 'kg',
        condition: 'Granulated & Sorted',
        location: 'Kusamba Coastal Depot',
        creatorId: 'usr_sarah_03',
        creatorName: 'Dr. Sarah Jenkins',
        creatorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_JBXekM3H7wnv0VFjwh76I6mOUQiyqEr3ksBlP9wn709Kde3hQ31RE4LDKSU2a_8kupEcLvuHvVKRhR1BVJ6aaKswnnv2zb4lD3d5SFJgH-6Rgb-ryquVZ6RGwIqoWGO6WxboNWb_vIo6enOGcOtO_51I3r39nVr0Bo5FMFBnsngjfZ3H0GDsdzdu_M5t2IOx0q5T-jC25xAQ8jMLqyyfwKDOTaAIEpUV-ZN1ywYcmc6JioDJkvC',
        status: 'Available',
        createdAt: '2025-05-13T14:30:00Z',
        description: 'Certified 100% ocean-recovered gillnet polymer ready for architectural extrusion tile or injection molding.',
      },
    ],
    activityLogs: [
      {
        id: 'act_001',
        userId: 'usr_alex_01',
        userName: 'Alex Stewart',
        category: 'Net Recovery',
        weightKg: 24,
        hours: 3.5,
        location: 'Serangan Harbor Dock #4',
        verificationMethod: 'Co-op Scale Station #3',
        date: 'Today, 11:20 WITA',
        timestamp: Date.now() - 3600000,
      },
      {
        id: 'act_002',
        userId: 'usr_budi_02',
        userName: 'Pak Budi Santoso',
        category: 'Net Mending',
        weightKg: 50,
        hours: 6.0,
        location: 'Serangan Net Repair Hub',
        verificationMethod: 'Co-op Ledger Verified',
        date: 'Yesterday, 17:00 WITA',
        timestamp: Date.now() - 86400000,
      },
    ],
    feedPosts: [
      {
        id: 'post_001',
        authorId: 'usr_budi_02',
        authorName: 'Pak Budi Santoso',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZncHLHM4J_XQwfPPfHKchwVEFgHy2TcsXg_KnbnSZqSYrAc7qw7UWn2KTul2ONpxodCfwuYoSN6oR8dVzWEXNs98Y7aQQfs2i9lFqzo6m06HS8Jki21-n2aFW47-bwIVJpeTbeQSUYf-mCQHSnepeRP-lScxmVWS2-JqdJkGnkx2y3NDcHjiNg6WnmFPcXXdfpnHqXQo3GHRFW1gAeLHgTGC2SSSxh74O9G4yAfHuEtXIipcx1CRT',
        authorRole: 'Master Net Rigger • Serangan Chapter',
        category: 'Recycling',
        timeAgo: '2 hours ago',
        location: 'Serangan Net Repair Hub, Bali',
        content: 'Finished mending 85 meters of snagged nylon gillnet brought in from the Benoa Channel. With new corkline toggles, it is ready to fish cleanly for another two seasons rather than sitting on the seabed.',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBha2vJASaTC3FuAJNoIzPSrOhDZ4aSBBkK5G6T1_gJrCKMpCD5yx80VY_HjFZrJACOEf0glBljiHgZuqvkh9YB3l_G1_Y2yPaaenmypoqm1p7i0-ZnZlL0bPKQn-av5u0dDAg-YiObwrEZ1X18WZockn52t1vVeIK2nXPd5pzjqjeF3ttjDtItp98J_6tvj7QJoso5iZ5vafyMgk-TSN89W1pyupGC0H_ByGkZab7cgqWew03A2PDX',
        likesCount: 18,
        likedBy: ['usr_alex_01', 'usr_sarah_03'],
        comments: [
          {
            id: 'c_01',
            authorId: 'usr_sarah_03',
            authorName: 'Dr. Sarah Jenkins',
            authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_JBXekM3H7wnv0VFjwh76I6mOUQiyqEr3ksBlP9wn709Kde3hQ31RE4LDKSU2a_8kupEcLvuHvVKRhR1BVJ6aaKswnnv2zb4lD3d5SFJgH-6Rgb-ryquVZ6RGwIqoWGO6WxboNWb_vIo6enOGcOtO_51I3r39nVr0Bo5FMFBnsngjfZ3H0GDsdzdu_M5t2IOx0q5T-jC25xAQ8jMLqyyfwKDOTaAIEpUV-ZN1ywYcmc6JioDJkvC',
            text: 'Huge thanks Pak Budi! That Benoa mooring was dragging towards the sea grass meadow.',
            createdAt: '1 hour ago',
          },
        ],
      },
      {
        id: 'post_002',
        authorId: 'usr_sarah_03',
        authorName: 'Dr. Sarah Jenkins',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_JBXekM3H7wnv0VFjwh76I6mOUQiyqEr3ksBlP9wn709Kde3hQ31RE4LDKSU2a_8kupEcLvuHvVKRhR1BVJ6aaKswnnv2zb4lD3d5SFJgH-6Rgb-ryquVZ6RGwIqoWGO6WxboNWb_vIo6enOGcOtO_51I3r39nVr0Bo5FMFBnsngjfZ3H0GDsdzdu_M5t2IOx0q5T-jC25xAQ8jMLqyyfwKDOTaAIEpUV-ZN1ywYcmc6JioDJkvC',
        authorRole: 'Marine Biologist • Sanur Coral Conservation',
        category: 'Marine Life',
        timeAgo: '4 hours ago',
        location: 'Sanur Barrier Reef, Bali',
        content: 'Coral survey completed after yesterday afternoon recovery. The Porites brain coral has zero tissue abrasion after the weighted synthetic line was gently sliced free. Great teamwork by the volunteer dive squad.',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNp_9RHfmSbnCp7s7U6C4Bab1MAa69TS766uCYuN4XJAjdMqJiUW9Q5Jt7377Ak-HzTNzVew9ckO35KSnxLecA8XDH5zYvjQ1UdUNrOeeTs-cwrL1ySoYSL0ragZkD0jKv_kYVopCPzb4WS6AUsinc0UEnLGrsVbNzZzYc3YSBYeczCIRWV06l04OaukNa0qhMwAYmgwJYHM5ug4tqYZAYGbW14lu1_Iw8n61Pw3eUs37D0UIvwL8Q',
        linkedReportId: 'TK-2025-081',
        linkedReportTitle: 'Heavy Braided Longline & Float',
        likesCount: 26,
        likedBy: ['usr_alex_01', 'usr_budi_02'],
        comments: [
          {
            id: 'c_02',
            authorId: 'usr_alex_01',
            authorName: 'Alex Stewart',
            authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGBruc0GzJvu5OSIyeTHg_qe5tBpOWGacXbzEsoTIWq0rvSvZ0xGZptOIa5MHGWua9c_bcTq8xNUnxJtpvXwy_laAdy_xnwMFNs2G9SoRtPRTai1aX0S5aW5zikduQ6AyjDe6U-4lmIAmQr3aWWJAv_F4wzdngt_Qr-rZz3lAIYpcQ6FnSk8c581dkADFK_ogc5xL6JUpghT-ak38TFeWH63aLJZPaPFW2Q1EB68B8YsoXARi5a1pR',
            text: 'The drone flyover confirmed no leftover strands on the north edge either!',
            createdAt: '2 hours ago',
          },
        ],
      },
      {
        id: 'post_003',
        authorId: 'usr_alex_01',
        authorName: 'Alex Stewart',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGBruc0GzJvu5OSIyeTHg_qe5tBpOWGacXbzEsoTIWq0rvSvZ0xGZptOIa5MHGWua9c_bcTq8xNUnxJtpvXwy_laAdy_xnwMFNs2G9SoRtPRTai1aX0S5aW5zikduQ6AyjDe6U-4lmIAmQr3aWWJAv_F4wzdngt_Qr-rZz3lAIYpcQ6FnSk8c581dkADFK_ogc5xL6JUpghT-ak38TFeWH63aLJZPaPFW2Q1EB68B8YsoXARi5a1pR',
        authorRole: 'Drone Scout • ShoreScan Ops',
        category: 'Ghost Gear Reports',
        timeAgo: '6 hours ago',
        location: 'Sanur Sector 3 • Rock Jetty',
        content: 'ShoreScan optical scan completed at low tide. Flagged an intact 40-meter polypropylene net stranded along the rock breakwater. GPS waypoint dispatched to triage dossiers for morning collection.',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYD4lFIXMCvMZVB9y6qiCPwYvE8xV6J4J9FT5BEkIz3tdeu2FKGk53IKfR8Ky9zCi2MX1pIy2-5qTRs2BEzTsvYugCIabu_06mKx7Cmaqn2sNuNexcLmWjQPfnzKwNqeKBpJBvDTjsNwUymdN7lgiRQ4ScmZwQBrzYJRGDWrwK1gl0mRNfUYLcDt59uSlGT6KTFfZ1U1iEFFi0CW5MrxSRdZ2ydqD1KoIlXaD9AHS62o63TVbSJb2k',
        linkedReportId: 'SS-2025-042',
        linkedReportTitle: 'Polypropylene Gillnet Segment',
        likesCount: 15,
        likedBy: ['usr_budi_02'],
        comments: [],
      },
      {
        id: 'post_004',
        authorId: 'usr_hawaii_04',
        authorName: 'Kalea Mahoe',
        authorAvatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
        authorRole: 'Reef Sentinel • Oahu Windward Chapter',
        category: 'Beach Cleanup',
        timeAgo: '9 hours ago',
        location: 'Kaneohe Bay, Oahu, Hawaii',
        content: 'Aloha stewards! Our weekend community sweep pulled 320 kg of North Pacific Gyre bundle netting from the barrier reef flats. Transferred directly to the Oahu net depot for mechanical shredding and tile extrusion.',
        imageUrl: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80',
        linkedProjectId: 'proj_kuta_01',
        linkedProjectTitle: 'Kuta Beach Shallow Reef Clearance',
        likesCount: 31,
        likedBy: ['usr_alex_01', 'usr_sarah_03', 'usr_budi_02'],
        comments: [
          {
            id: 'c_03',
            authorId: 'usr_sarah_03',
            authorName: 'Dr. Sarah Jenkins',
            authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_JBXekM3H7wnv0VFjwh76I6mOUQiyqEr3ksBlP9wn709Kde3hQ31RE4LDKSU2a_8kupEcLvuHvVKRhR1BVJ6aaKswnnv2zb4lD3d5SFJgH-6Rgb-ryquVZ6RGwIqoWGO6WxboNWb_vIo6enOGcOtO_51I3r39nVr0Bo5FMFBnsngjfZ3H0GDsdzdu_M5t2IOx0q5T-jC25xAQ8jMLqyyfwKDOTaAIEpUV-ZN1ywYcmc6JioDJkvC',
            text: 'Incredible recovery Kalea! Beautiful work by the Oahu outrigger crew.',
            createdAt: '7 hours ago',
          },
        ],
      },
      {
        id: 'post_005',
        authorId: 'usr_cyclades_05',
        authorName: 'Elena Vassiliou',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        authorRole: 'Circularity Forge • Cyclades Greece',
        category: 'Community Projects',
        timeAgo: '14 hours ago',
        location: 'Paros Port Slip, Aegean Sea',
        content: 'First batch of 240 kg recovered Aegean trammel netting successfully washed, separated by polyamide grade, and prepped for yarn spinning! No plastic waste goes to landfill.',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxuCCaIwzayFjPHA6ZbmB1-f8UaN7dOWMxVQRp9k-TbluDvXQhvLRI141lUXmmgzke06gUr7fVx0b3aOVPzityISNj79-YovUDT2n_BHQn6MdqljZHLGQUCOlhxQzP3-LSn2QOLXvlBmJpGqTfpIhGq6bQBX4TCILIG-TgFg8ey4XQz5Eu08lq2M94Wl8ofbbt7F0Pok1HktHdRLbJLWL43qk7ET92UEVPnBmJUPqI0M6yF6_fuh62',
        likesCount: 24,
        likedBy: ['usr_budi_02', 'usr_sarah_03'],
        comments: [],
      },
      {
        id: 'post_006',
        authorId: 'usr_cozumel_06',
        authorName: 'Captain Mateo Cruz',
        authorAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=mateo_cruz',
        authorRole: 'Dive Salvage Lead • Cozumel Mexico',
        category: 'Educational Tips',
        timeAgo: '1 day ago',
        location: 'Cozumel International Pier, Quintana Roo',
        content: 'Extricated 4 derelict wire crab and spiny lobster traps submerged in 14m depth near the south drop-off. Disarmed the cage doors and hoisted them onto our patrol skiff. Reef is clear!',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAd5Kx8lym9GTbQM6w61gM81ktjeG8h-SbXmvtc8Sf_SFCXmb8584NjpOT0iQKhDZrRKPfzXOsQQI8-kBB6thbrJc5qljOUInZJkupHNsPv5orZlJXZJYjBl7Nj64mQ4IoewT67_UFD2_MY_nTLMso1BvrLg_NnXgkBervJFt7585xhRlgQrMig9vcIfoRR8lDU2ulxyNi-Rq2OKpTfP0x8Hxo4twzA0w0k9nj9fHXGzhfXQZLkr6hd',
        likesCount: 38,
        likedBy: ['usr_alex_01', 'usr_budi_02', 'usr_sarah_03'],
        comments: [
          {
            id: 'c_04',
            authorId: 'usr_budi_02',
            authorName: 'Pak Budi Santoso',
            authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZncHLHM4J_XQwfPPfHKchwVEFgHy2TcsXg_KnbnSZqSYrAc7qw7UWn2KTul2ONpxodCfwuYoSN6oR8dVzWEXNs98Y7aQQfs2i9lFqzo6m06HS8Jki21-n2aFW47-bwIVJpeTbeQSUYf-mCQHSnepeRP-lScxmVWS2-JqdJkGnkx2y3NDcHjiNg6WnmFPcXXdfpnHqXQo3GHRFW1gAeLHgTGC2SSSxh74O9G4yAfHuEtXIipcx1CRT',
            text: 'Solid technique disarming the traps underwater Mateo. Prevents ongoing ghost fishing completely.',
            createdAt: '18 hours ago',
          },
        ],
      },
    ],
    testimonials: [
      {
        id: 'test_sample_01',
        authorId: 'usr_budi_02',
        authorName: 'Pak Budi Santoso',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCZncHLHM4J_XQwfPPfHKchwVEFgHy2TcsXg_KnbnSZqSYrAc7qw7UWn2KTul2ONpxodCfwuYoSN6oR8dVzWEXNs98Y7aQQfs2i9lFqzo6m06HS8Jki21-n2aFW47-bwIVJpeTbeQSUYf-mCQHSnepeRP-lScxmVWS2-JqdJkGnkx2y3NDcHjiNg6WnmFPcXXdfpnHqXQo3GHRFW1gAeLHgTGC2SSSxh74O9G4yAfHuEtXIipcx1CRT',
        authorRole: 'Fisher',
        affiliation: 'Serangan Fishermen Cooperative',
        story: 'For forty years my family fished the Bali Strait. Seeing ghost nets trap coral was heartbreaking. With Tidekind, we turn damaged gillnets into mended twine and dock bumpers instead of losing them at sea.',
        date: 'April 2025',
        createdAt: '2025-04-10T09:00:00Z',
        consentGiven: true,
        status: 'approved',
        isSample: true,
      },
      {
        id: 'test_sample_02',
        authorId: 'usr_sarah_03',
        authorName: 'Dr. Sarah Jenkins',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQ_JBXekM3H7wnv0VFjwh76I6mOUQiyqEr3ksBlP9wn709Kde3hQ31RE4LDKSU2a_8kupEcLvuHvVKRhR1BVJ6aaKswnnv2zb4lD3d5SFJgH-6Rgb-ryquVZ6RGwIqoWGO6WxboNWb_vIo6enOGcOtO_51I3r39nVr0Bo5FMFBnsngjfZ3H0GDsdzdu_M5t2IOx0q5T-jC25xAQ8jMLqyyfwKDOTaAIEpUV-ZN1ywYcmc6JioDJkvC',
        authorRole: 'Environmental Organization',
        affiliation: 'Sanur Coral Conservation Trust',
        story: 'Accurate citizen reporting combined with rapid dive squad verification has reduced entanglement response time from weeks to hours in our marine sanctuary sector.',
        date: 'May 2025',
        createdAt: '2025-05-02T14:30:00Z',
        consentGiven: true,
        status: 'approved',
        isSample: true,
      },
      {
        id: 'test_sample_03',
        authorId: 'usr_student_07',
        authorName: 'Wayan Aditya',
        authorAvatar: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80',
        authorRole: 'Student',
        affiliation: 'Udayana University Marine Science Club',
        story: 'Our campus group organized weekend harbor triage days. We learn polymer science while actively preventing microplastics from choking our home waters.',
        date: 'May 2025',
        createdAt: '2025-05-12T11:15:00Z',
        consentGiven: true,
        status: 'approved',
        isSample: true,
      },
      {
        id: 'test_sample_04',
        authorId: 'usr_alex_01',
        authorName: 'Alex Stewart',
        authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGBruc0GzJvu5OSIyeTHg_qe5tBpOWGacXbzEsoTIWq0rvSvZ0xGZptOIa5MHGWua9c_bcTq8xNUnxJtpvXwy_laAdy_xnwMFNs2G9SoRtPRTai1aX0S5aW5zikduQ6AyjDe6U-4lmIAmQr3aWWJAv_F4wzdngt_Qr-rZz3lAIYpcQ6FnSk8c581dkADFK_ogc5xL6JUpghT-ak38TFeWH63aLJZPaPFW2Q1EB68B8YsoXARi5a1pR',
        authorRole: 'Volunteer',
        affiliation: 'Bali Coastal Steward Chapter',
        story: 'Being able to log ghost gear sightings directly from the beach with GPS coordinates gives everyday beachgoers a real, tangible voice in ocean stewardship.',
        date: 'May 2025',
        createdAt: '2025-05-16T16:00:00Z',
        consentGiven: true,
        status: 'approved',
        isSample: true,
      },
      {
        id: 'test_sample_05',
        authorId: 'usr_org_08',
        authorName: 'Made Arisandi',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        authorRole: 'Community Organizer',
        affiliation: 'Kusamba Coastal Circular Alliance',
        story: 'Tidekind connects our salt farmers, artisanal fishers, and youth weavers into one unified circular recovery loop. The shared pride in our harbor is palpable.',
        date: 'May 2025',
        createdAt: '2025-05-18T10:00:00Z',
        consentGiven: true,
        status: 'approved',
        isSample: true,
      },
    ],
    notifications: [
      {
        id: 'notif_01',
        title: 'New ShoreScan Hazard Detected',
        message: 'Sanur Sector 3 reported stranded polypropylene netting under review.',
        time: '18 min ago',
        icon: 'radar',
        read: false,
        linkScreen: 'dossiers',
      },
      {
        id: 'notif_02',
        title: 'Kuta Shallow Reef Clearance',
        message: 'Registration is open. Low tide window starts at 07:00 WITA.',
        time: '2 hours ago',
        icon: 'calendar_month',
        read: false,
        linkScreen: 'project-details',
      },
    ],
    shorescanRuns: [] as Array<any>,
  };
}

// Load or initialize DB
function loadDb(): ReturnType<typeof getInitialDb> {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      const initial = getInitialDb();
      let modified = false;

      if (!parsed.testimonials || !Array.isArray(parsed.testimonials)) {
        parsed.testimonials = initial.testimonials;
        modified = true;
      }

      if (parsed.feedPosts && Array.isArray(parsed.feedPosts)) {
        parsed.feedPosts.forEach((p: any, idx: number) => {
          if (!p.category) {
            const cats = ['Recycling', 'Marine Life', 'Ghost Gear Reports', 'Beach Cleanup', 'Community Projects', 'Educational Tips'];
            p.category = cats[idx % cats.length];
            modified = true;
          }
        });
      }

      if (modified) {
        saveDb(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error('Failed reading DB file, re-initializing:', err);
  }
  const initial = getInitialDb();
  saveDb(initial);
  return initial;
}

function saveDb(data: any) {
  try {
    const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error('Failed saving DB file:', err);
  }
}

let db = loadDb();

// Active SSE client connections for real-time broadcasts
const sseClients: Response[] = [];

function broadcast(event: string, payload: any) {
  const msg = `event: ${event}\ndata: ${JSON.stringify(payload)}\n\n`;
  for (let i = sseClients.length - 1; i >= 0; i--) {
    try {
      sseClients[i].write(msg);
    } catch {
      sseClients.splice(i, 1);
    }
  }
}

// Helper to strip sensitive auth fields from user objects
function sanitizeUser(u: any) {
  if (!u) return null;
  const { passwordHash, salt, ...safe } = u;
  return safe;
}

// Helper to extract authenticated user from Authorization header
function getAuthUser(req: Request) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7).trim();
  const session = db.sessions[token];
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    delete db.sessions[token];
    saveDb(db);
    return null;
  }
  const user = db.users.find((u) => u.id === session.userId);
  return user || null;
}

// Initialize Express
const app = express();
app.use(express.json({ limit: '10mb' }));

// -------------------------------------------------------------
// Real-Time Server-Sent Events (SSE)
// -------------------------------------------------------------
app.get('/api/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  sseClients.push(res);
  res.write(`event: connected\ndata: ${JSON.stringify({ time: Date.now() })}\n\n`);

  req.on('close', () => {
    const idx = sseClients.indexOf(res);
    if (idx !== -1) sseClients.splice(idx, 1);
  });
});

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, location, chapter, bio, avatar, role, badge } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const existing = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  const { hash, salt } = hashPassword(password);
  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    email: cleanEmail,
    passwordHash: hash,
    salt,
    avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
    bio: bio || 'Active oceanic steward committed to coastal net salvage and circular recycling.',
    location: location || 'Bali Coastal Region',
    chapter: chapter || 'Bali Coastal Steward Chapter',
    role: role || 'Steward',
    badge: badge || 'Tier 1 Steward',
    stats: {
      gearDivertedKg: 0,
      hoursLogged: 0,
      projectsDone: 0,
      sortiesCount: 0,
    },
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);

  // Generate 30-day session token
  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[token] = {
    userId: newUser.id,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };

  saveDb(db);
  broadcast('user_registered', { user: sanitizeUser(newUser) });

  res.status(201).json({
    token,
    user: sanitizeUser(newUser),
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

  // If user does not exist in db, auto-create steward account seamlessly
  if (!user) {
    const { hash, salt } = hashPassword(password || 'steward2025');
    const namePart = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
    const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const newUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: capitalized || 'Ocean Steward',
      email: cleanEmail,
      passwordHash: hash,
      salt,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      bio: 'Dedicated marine steward committed to reef protection and circular ghost gear recovery.',
      location: 'Sanur, Bali, Indonesia',
      chapter: 'Coastal Steward Chapter',
      role: 'Steward',
      badge: 'Tier 1 Steward',
      stats: {
        gearDivertedKg: 35,
        hoursLogged: 4,
        projectsDone: 1,
        sortiesCount: 2,
      },
      createdAt: new Date().toISOString(),
    };
    db.users.push(newUser);
    user = newUser;
    broadcast('user_registered', { user: sanitizeUser(newUser) });
  } else if (password) {
    // If user exists, check password; allow test personas or valid passwords
    const isKnownDemo = ['alex@tidekind.org', 'budi@tidekind.org', 'sarah@tidekind.org'].includes(cleanEmail);
    if (!verifyPassword(password, user.passwordHash, user.salt) && !isKnownDemo) {
      return res.status(401).json({ error: 'Incorrect password. Please verify credentials or reset password.' });
    }
  }

  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[token] = {
    userId: user.id,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };

  saveDb(db);

  res.json({
    token,
    user: sanitizeUser(user),
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated or session expired.' });
  }
  res.json({ user: sanitizeUser(user) });
});

app.post('/api/auth/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (db.sessions[token]) {
      delete db.sessions[token];
      saveDb(db);
    }
  }
  res.json({ success: true });
});

app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email address is required.' });

  const cleanEmail = email.toLowerCase().trim();
  const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    // For privacy, still return success message
    return res.json({
      success: true,
      message: 'If an account exists with this email, password reset instructions have been generated.',
    });
  }

  const resetToken = crypto.randomBytes(24).toString('hex');
  db.resetTokens[resetToken] = {
    email: cleanEmail,
    expiresAt: Date.now() + 3600000, // 1 hour
  };
  saveDb(db);

  res.json({
    success: true,
    message: 'Reset token generated successfully. In live deployments, this is sent via email.',
    debugToken: resetToken, // Provided for testing convenience in prototype mode
  });
});

app.post('/api/auth/reset-password', (req: Request, res: Response) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Reset token and new password are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const record = db.resetTokens[token];
  if (!record || record.expiresAt < Date.now()) {
    return res.status(400).json({ error: 'Invalid or expired password reset token.' });
  }

  const user = db.users.find((u) => u.email === record.email);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const { hash, salt } = hashPassword(newPassword);
  user.passwordHash = hash;
  user.salt = salt;
  delete db.resetTokens[token];
  saveDb(db);

  res.json({ success: true, message: 'Password has been updated. You can now log in.' });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized.' });

  const { name, bio, location, chapter, avatar, role, badge, email, password, stats } = req.body;
  if (name && typeof name === 'string' && name.trim()) user.name = name.trim();
  if (email && typeof email === 'string' && email.trim()) {
    const cleanEmail = email.toLowerCase().trim();
    const existing = db.users.find((u) => u.email.toLowerCase() === cleanEmail && u.id !== user.id);
    if (!existing) {
      user.email = cleanEmail;
    }
  }
  if (bio !== undefined) user.bio = bio;
  if (location !== undefined) user.location = location;
  if (chapter !== undefined) user.chapter = chapter;
  if (avatar !== undefined) user.avatar = avatar;
  if (role !== undefined) user.role = role;
  if (badge !== undefined) user.badge = badge;
  if (stats && typeof stats === 'object') {
    user.stats = { ...user.stats, ...stats };
  }
  if (password && typeof password === 'string' && password.length >= 6) {
    const { hash, salt } = hashPassword(password);
    user.passwordHash = hash;
    user.salt = salt;
  }

  // Also propagate name and avatar changes to recent user posts and reports in db for seamless real-time consistency
  if (user.name || user.avatar) {
    for (const post of db.feedPosts) {
      if (post.authorId === user.id) {
        post.authorName = user.name;
        post.authorAvatar = user.avatar;
      }
      for (const comment of post.comments) {
        if (comment.authorId === user.id) {
          comment.authorName = user.name;
          comment.authorAvatar = user.avatar;
        }
      }
    }
    for (const report of db.reports) {
      if (report.creatorId === user.id) {
        report.creatorName = user.name;
      }
    }
  }

  saveDb(db);
  broadcast('profile_updated', { user: sanitizeUser(user) });

  res.json({ user: sanitizeUser(user) });
});

// -------------------------------------------------------------
// Shared Database Endpoints
// -------------------------------------------------------------
app.get('/api/data', (_req: Request, res: Response) => {
  res.json({
    users: db.users.map(sanitizeUser),
    reports: db.reports,
    projects: db.projects,
    listings: db.listings,
    activityLogs: db.activityLogs,
    feedPosts: db.feedPosts,
    notifications: db.notifications,
    shorescanRuns: db.shorescanRuns,
  });
});

// Community Reports
app.post('/api/reports', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const {
    gearType,
    condition,
    locationName,
    coords,
    notes,
    threatLevel,
    hasWildlifeEntanglement,
    imageUrl,
    confidence,
  } = req.body;

  if (!gearType || !locationName) {
    return res.status(400).json({ error: 'Gear type and location are required.' });
  }

  const now = new Date();
  const newReport = {
    id: `TK-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    gearType,
    condition: condition || 'Submerged & Snagged',
    locationName,
    coords: coords || '8.7052° S, 115.2625° E',
    date: 'Today',
    time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA',
    notes: notes || 'Logged via Tidekind field survey.',
    threatLevel: threatLevel || 'Moderate Dragging Risk',
    hasWildlifeEntanglement: Boolean(hasWildlifeEntanglement),
    status: 'Under Review' as const,
    imageUrl: imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAYD4lFIXMCvMZVB9y6qiCPwYvE8xV6J4J9FT5BEkIz3tdeu2FKGk53IKfR8Ky9zCi2MX1pIy2-5qTRs2BEzTsvYugCIabu_06mKx7Cmaqn2sNuNexcLmWjQPfnzKwNqeKBpJBvDTjsNwUymdN7lgiRQ4ScmZwQBrzYJRGDWrwK1gl0mRNfUYLcDt59uSlGT6KTFfZ1U1iEFFi0CW5MrxSRdZ2ydqD1KoIlXaD9AHS62o63TVbSJb2k',
    submittedAt: 'Just now',
    confidence: confidence || 'Field Verified',
    assignedTeam: 'ShoreScan Triage Queue',
    creatorId: user ? user.id : 'anonymous_steward',
    creatorName: user ? user.name : 'Coastal Volunteer',
  };

  db.reports.unshift(newReport);

  // Auto-create notification for community
  db.notifications.unshift({
    id: `notif_${Date.now()}`,
    title: 'New Hazard Logged',
    message: `${newReport.gearType} at ${newReport.locationName}`,
    time: 'Just now',
    icon: 'warning',
    read: false,
    linkScreen: 'dossiers',
  });

  saveDb(db);
  broadcast('report_created', { report: newReport });

  res.status(201).json({ report: newReport });
});

app.patch('/api/reports/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, assignedTeam } = req.body;

  const report = db.reports.find((r) => r.id === id);
  if (!report) return res.status(404).json({ error: 'Report not found' });

  if (status) report.status = status;
  if (assignedTeam) report.assignedTeam = assignedTeam;

  saveDb(db);
  broadcast('report_updated', { report });
  res.json({ report });
});

// Action Projects Join / Leave
app.post('/api/projects/:id/join', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required to join project.' });

  const { id } = req.params;
  const project = db.projects.find((p) => p.id === id);
  if (!project) return res.status(404).json({ error: 'Project not found.' });

  const alreadyJoined = project.participants.some((p: any) => p.userId === user.id);
  if (!alreadyJoined) {
    project.participants.push({
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      role: 'Participant',
    });
    user.stats.projectsDone += 1;
    saveDb(db);
    broadcast('project_updated', { project });
  }

  res.json({ project, isJoined: true });
});

app.post('/api/projects/:id/leave', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required.' });

  const { id } = req.params;
  const project = db.projects.find((p) => p.id === id);
  if (!project) return res.status(404).json({ error: 'Project not found.' });

  project.participants = project.participants.filter((p: any) => p.userId !== user.id);
  if (user.stats.projectsDone > 0) user.stats.projectsDone -= 1;

  saveDb(db);
  broadcast('project_updated', { project });

  res.json({ project, isJoined: false });
});

// Resource Exchange Listings
app.post('/api/listings', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required to create listings.' });

  const { title, category, quantity, unit, condition, location, description } = req.body;
  if (!title || !quantity) return res.status(400).json({ error: 'Title and quantity are required.' });

  const newListing = {
    id: `lst_${Date.now()}`,
    title,
    category: category || 'Net Mending',
    quantity: Number(quantity),
    unit: unit || 'kg',
    condition: condition || 'Sorted & Tagged',
    location: location || user.location,
    creatorId: user.id,
    creatorName: user.name,
    creatorAvatar: user.avatar,
    status: 'Available',
    createdAt: new Date().toISOString(),
    description: description || 'Diverted maritime material available for circular exchange.',
  };

  db.listings.unshift(newListing);
  saveDb(db);
  broadcast('listing_created', { listing: newListing });

  res.status(201).json({ listing: newListing });
});

// Activity Logs
app.post('/api/activity-logs', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required to record salvage activity.' });

  const { category, weightKg, hours, location, verificationMethod } = req.body;
  const weight = Number(weightKg) || 0;
  const loggedHours = Number(hours) || 2;

  const newLog = {
    id: `act_${Date.now()}`,
    userId: user.id,
    userName: user.name,
    category: category || 'Net Recovery',
    weightKg: weight,
    hours: loggedHours,
    location: location || user.location,
    verificationMethod: verificationMethod || 'Co-op Scale Station #3',
    date: 'Today, ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA',
    timestamp: Date.now(),
  };

  db.activityLogs.unshift(newLog);

  // Update user impact stats dynamically
  user.stats.gearDivertedKg += weight;
  user.stats.hoursLogged += loggedHours;
  user.stats.sortiesCount += 1;

  saveDb(db);
  broadcast('activity_logged', { log: newLog, user: sanitizeUser(user) });

  res.status(201).json({ log: newLog, user: sanitizeUser(user) });
});

// Community Feed (Posts, Likes, Comments)
app.post('/api/feed', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required to post.' });

  const { content, imageUrl, location } = req.body;
  if (!content || !content.trim()) return res.status(400).json({ error: 'Post content cannot be empty.' });

  const newPost = {
    id: `post_${Date.now()}`,
    authorId: user.id,
    authorName: user.name,
    authorAvatar: user.avatar,
    authorRole: `${user.badge} • ${user.chapter}`,
    timeAgo: 'Just now',
    location: location || user.location,
    content: content.trim(),
    imageUrl: imageUrl || null,
    likesCount: 0,
    likedBy: [],
    comments: [],
  };

  db.feedPosts.unshift(newPost);
  saveDb(db);
  broadcast('feed_updated', { post: newPost });

  res.status(201).json({ post: newPost });
});

app.post('/api/feed/:id/like', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required to like.' });

  const { id } = req.params;
  const post = db.feedPosts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ error: 'Post not found.' });

  const hasLiked = post.likedBy.includes(user.id);
  if (hasLiked) {
    post.likedBy = post.likedBy.filter((uid: string) => uid !== user.id);
    post.likesCount = Math.max(0, post.likesCount - 1);
  } else {
    post.likedBy.push(user.id);
    post.likesCount += 1;
  }

  saveDb(db);
  broadcast('feed_updated', { post });
  res.json({ post, hasLiked: !hasLiked });
});

app.post('/api/feed/:id/comment', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Authentication required to comment.' });

  const { id } = req.params;
  const { text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Comment text required.' });

  const post = db.feedPosts.find((p) => p.id === id);
  if (!post) return res.status(404).json({ error: 'Post not found.' });

  const comment = {
    id: `c_${Date.now()}`,
    authorId: user.id,
    authorName: user.name,
    authorAvatar: user.avatar,
    text: text.trim(),
    createdAt: 'Just now',
  };

  post.comments.push(comment);
  saveDb(db);
  broadcast('feed_updated', { post });

  res.status(201).json({ comment, post });
});

// ShoreScan Storage
app.post('/api/shorescan', (req: Request, res: Response) => {
  const user = getAuthUser(req);
  const { sampleKey, category, confidence, risk, notes, coordinates } = req.body;

  const run = {
    id: `scan_${Date.now()}`,
    userId: user?.id || 'guest',
    sampleKey,
    category,
    confidence,
    risk,
    notes,
    coordinates,
    timestamp: Date.now(),
  };

  db.shorescanRuns.unshift(run);
  saveDb(db);
  res.status(201).json({ run });
});

// Helper endpoint for switching demo personas during testing
app.post('/api/auth/demo-switch', (req: Request, res: Response) => {
  const { email } = req.body;
  const cleanEmail = (email || 'alex@tidekind.org').toLowerCase().trim();
  let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    const { hash, salt } = hashPassword('steward2025');
    const namePart = cleanEmail.split('@')[0] || 'Steward';
    const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    user = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: capitalized,
      email: cleanEmail,
      passwordHash: hash,
      salt,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
      bio: 'Oceanic steward exploring multi-region ghost gear salvage.',
      location: 'Sanur, Bali, Indonesia',
      chapter: 'Coastal Chapter',
      role: 'Steward',
      badge: 'Tier 1 Steward',
      stats: { gearDivertedKg: 50, hoursLogged: 6, projectsDone: 2, sortiesCount: 2 },
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    saveDb(db);
  }

  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[token] = {
    userId: user.id,
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
  saveDb(db);

  res.json({ token, user: sanitizeUser(user) });
});

// -------------------------------------------------------------
// Vite Dev or Static Production Serving
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Tidekind server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Tidekind server:', err);
  process.exit(1);
});

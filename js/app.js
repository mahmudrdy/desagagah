// ==========================================
// STATE
// ==========================================
let map, contactMap;
let markerCluster;
let allFeatures = [];
let allPotensi = [];
let currentFilter = 'All';
let currentPotensiFilter = 'Semua';
let desaBounds = null;
let contactMapInitialized = false;

// ==========================================
// CONFIGURATION DATA
// ==========================================
const menuItems = [
    { id: 'home', label: 'Beranda' },
    {
        id: 'profile',
        label: 'Profil Desa',
        dropdown: [
            { label: 'Tentang Desa', anchor: 'sec-tentang' },
            { label: 'Visi & Misi', anchor: 'sec-visi' },
            { label: 'Data Wilayah', anchor: 'sec-wilayah' },
            { label: 'Struktur Pemerintahan', anchor: 'sec-struktur' }
        ]
    },
    { id: 'potensi', label: 'Potensi Desa' },
    { id: 'map', label: 'Peta Digital' },
    { id: 'contact', label: 'Kontak' }
];

const dashboardStats = [
    { label: 'Penduduk', value: '998', icon: 'fa-users', color: '#047857', bg: '#ECFDF5' },
    { label: 'Luas Wilayah', value: '1,55 km²', icon: 'fa-map-location', color: '#047857', bg: '#ECFDF5' },
    { label: 'Dusun', value: '5', icon: 'fa-house-flag', color: '#047857', bg: '#ECFDF5' },
    { label: 'UMKM', value: '10+', icon: 'fa-store', color: '#047857', bg: '#ECFDF5' },
    { label: 'Sekolah', value: '4', icon: 'fa-school', color: '#047857', bg: '#ECFDF5' },
    { label: 'Tempat Ibadah', value: '6', icon: 'fa-mosque', color: '#047857', bg: '#ECFDF5' },
    { label: 'Tempat Wisata', value: '3', icon: 'fa-tree', color: '#047857', bg: '#ECFDF5' },
    { label: 'KK', value: '200+', icon: 'fa-people-roof', color: '#047857', bg: '#ECFDF5' }
];

const quickAccess = [
    { id: 'map', label: 'Peta Digital', icon: 'fa-map-location-dot', color: '#047857', bg: 'rgba(4,120,87,0.12)', desc: 'Lihat peta interaktif desa' },
    { id: 'profile', label: 'Profil Desa', icon: 'fa-landmark', color: '#047857', bg: 'rgba(4,120,87,0.12)', desc: 'Sejarah, visi & misi desa' },
    { id: 'potensi', label: 'Potensi Desa', icon: 'fa-seedling', color: '#047857', bg: 'rgba(4,120,87,0.12)', desc: 'UMKM, wisata & pertanian' },
    { id: 'contact', label: 'Hubungi Kami', icon: 'fa-headset', color: '#047857', bg: 'rgba(4,120,87,0.12)', desc: 'Kontak & jam pelayanan' }
];

const profileStatsRow = [
    { label: 'Luas Wilayah', value: '1,55 km²', icon: 'fa-expand', color: '#047857' },
    { label: 'Jumlah Dusun', value: '5', icon: 'fa-house-flag', color: '#047857' },
    { label: 'Kode Pos', value: '69363', icon: 'fa-envelope', color: '#047857' },
    { label: 'Kode Desa', value: '35.28.12.2004', icon: 'fa-hashtag', color: '#047857' }
];

const dataWilayah = [
    { label: 'Nama Desa', value: 'Gagah' },
    { label: 'Kecamatan', value: 'Kadur' },
    { label: 'Kabupaten', value: 'Pamekasan' },
    { label: 'Provinsi', value: 'Jawa Timur' },
    { label: 'Kode Desa (BPS)', value: '35.28.12.2004' },
    { label: 'Luas Wilayah', value: '1,55 km²' },
    { label: 'Jumlah Dusun', value: '5 Dusun' },
    { label: 'Koordinat', value: '-7.107° LS / 113.595° BT' },
    { label: 'Batas Utara', value: 'Desa Kartagena Tengah' },
    { label: 'Batas Selatan', value: 'Desa Sokalelah' },
    { label: 'Batas Timur', value: 'Desa Kartagena Laok' },
    { label: 'Batas Barat', value: 'Desa Sokalelah' }
];

const strukturPemerintahan = [
    { jabatan: 'Kepala Desa', nama: 'Hendra Budi Keisna, S.Si', icon: 'fa-user-tie' },
    { jabatan: 'Sekretaris Desa', nama: 'Lif Khadir', icon: 'fa-user-pen' },
    { jabatan: 'Kaur Keuangan', nama: 'Moh Maksum', icon: 'fa-coins' },
    { jabatan: 'Kaur Umum', nama: 'Jauhari Efendi', icon: 'fa-briefcase' },
    { jabatan: 'Kasi Pemerintahan', nama: 'Rasikun', icon: 'fa-scale-balanced' },
    { jabatan: 'Kasi Perencanaan', nama: 'Merdianto', icon: 'fa-handshake' }
];

const contactInfo = [
    { icon: 'fa-location-dot', color: '#047857', label: 'Alamat', value: 'Jl Raya Desa Gagah, Kec. Kadur, Pamekasan 69363' },
    { icon: 'fa-phone', color: '#047857', label: 'Telepon', value: '+62 812 3456 7890' },
    { icon: 'fa-envelope', color: '#047857', label: 'Email', value: 'gagahberbagi@gmail.com' },
    { icon: 'fa-clock', color: '#047857', label: 'Jam Kantor', value: 'Senin – Jumat, 08.00 – 15.00 WIB' }
];

const jamPelayanan = [
    { hari: 'Senin – Kamis', jam: '08.00 – 15.00 WIB', buka: true },
    { hari: 'Jumat', jam: '08.00 – 11.30 WIB', buka: true },
    { hari: 'Sabtu', jam: '08.00 – 12.00 WIB', buka: true },
    { hari: 'Minggu', jam: 'Tutup', buka: false }
];

const socialMedia = [
    { icon: 'fa-facebook', color: '#047857', label: 'Facebook', url: '#' },
    { icon: 'fa-instagram', color: '#047857', label: 'Instagram', url: '#' },
    { icon: 'fa-youtube', color: '#047857', label: 'YouTube', url: '#' },
    { icon: 'fa-whatsapp', color: '#047857', label: 'WhatsApp', url: '#' }
];

// ==========================================
// INIT
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initHome();
    initProfile();
    initContact();
    navigate('home');
});

// ==========================================
// NAVIGATION
// ==========================================
function initNavigation() {
    const desktopMenu = document.getElementById('desktop-menu');
    const mobileMenuContainer = document.getElementById('mobile-menu-container');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    menuItems.forEach(item => {
        if (item.dropdown) {
            // === DESKTOP: Dropdown wrapper ===
            const wrapper = document.createElement('div');
            wrapper.className = 'nav-dropdown-wrapper relative';

            const trigger = document.createElement('button');
            trigger.id = `nav-${item.id}`;
            trigger.className = 'nav-link px-3 py-2 rounded-md text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors flex items-center gap-1';
            trigger.innerHTML = `${item.label} <i class="fa-solid fa-chevron-down" style="font-size:10px; transition:transform 0.2s;"></i>`;
            trigger.onclick = () => navigate(item.id);

            const dropMenu = document.createElement('div');
            dropMenu.className = 'nav-dropdown-menu absolute top-full left-0 mt-1 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 hidden';

            item.dropdown.forEach(sub => {
                const subBtn = document.createElement('button');
                subBtn.className = 'w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:text-primary transition-colors font-medium';
                subBtn.textContent = sub.label;
                subBtn.onclick = () => {
                    navigate(item.id);
                    setTimeout(() => {
                        const el = document.getElementById(sub.anchor);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                    dropMenu.classList.add('hidden');
                    trigger.querySelector('i').style.transform = 'rotate(0deg)';
                };
                dropMenu.appendChild(subBtn);
            });

            wrapper.appendChild(trigger);
            wrapper.appendChild(dropMenu);
            desktopMenu.appendChild(wrapper);

            // Show/hide dropdown on hover
            wrapper.addEventListener('mouseenter', () => {
                dropMenu.classList.remove('hidden');
                trigger.querySelector('i').style.transform = 'rotate(180deg)';
            });
            wrapper.addEventListener('mouseleave', () => {
                dropMenu.classList.add('hidden');
                trigger.querySelector('i').style.transform = 'rotate(0deg)';
            });

            // === MOBILE: Collapsible ===
            const mWrapper = document.createElement('div');
            const mTrigger = document.createElement('button');
            mTrigger.className = 'nav-link-mobile w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between';
            mTrigger.innerHTML = `<span>${item.label}</span> <i class="fa-solid fa-chevron-down" style="font-size:11px; transition:transform 0.2s;"></i>`;

            const mSub = document.createElement('div');
            mSub.className = 'hidden pl-4';
            item.dropdown.forEach(sub => {
                const mSubBtn = document.createElement('button');
                mSubBtn.className = 'w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-emerald-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium';
                mSubBtn.innerHTML = `<i class="fa-solid fa-chevron-right" style="font-size:9px; margin-right:6px; color:#047857;"></i>${sub.label}`;
                mSubBtn.onclick = () => {
                    navigate(item.id);
                    setTimeout(() => {
                        const el = document.getElementById(sub.anchor);
                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                    mobileMenu.classList.add('hidden');
                };
                mSub.appendChild(mSubBtn);
            });

            mTrigger.onclick = () => {
                const isOpen = !mSub.classList.contains('hidden');
                mSub.classList.toggle('hidden');
                mTrigger.querySelector('i').style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
                if (!isOpen) navigate(item.id);
            };
            mWrapper.appendChild(mTrigger);
            mWrapper.appendChild(mSub);
            mobileMenuContainer.appendChild(mWrapper);

        } else {
            // === DESKTOP: Regular button ===
            const dBtn = document.createElement('button');
            dBtn.id = `nav-${item.id}`;
            dBtn.className = 'nav-link px-3 py-2 rounded-md text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors';
            dBtn.textContent = item.label;
            dBtn.onclick = () => navigate(item.id);
            desktopMenu.appendChild(dBtn);

            // === MOBILE: Regular button ===
            const mBtn = document.createElement('button');
            mBtn.className = 'nav-link-mobile block w-full text-left px-4 py-3 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-emerald-50 dark:hover:bg-gray-700 transition-colors';
            mBtn.textContent = item.label;
            mBtn.onclick = () => { navigate(item.id); mobileMenu.classList.add('hidden'); };
            mobileMenuContainer.appendChild(mBtn);
        }
    });

    mobileMenuBtn.onclick = () => mobileMenu.classList.toggle('hidden');

    // Sidebar
    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    if (toggleBtn) toggleBtn.onclick = openSidebar;
    const closeBtn = document.getElementById('close-sidebar-btn');
    if (closeBtn) closeBtn.onclick = closeSidebar;
    const backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) backdrop.onclick = closeSidebar;
}

function navigate(viewId) {
    document.querySelectorAll('.view-section').forEach(el => el.classList.add('hidden'));
    const target = document.getElementById(`view-${viewId}`);
    if (target) target.classList.remove('hidden');

    // Update active state
    document.querySelectorAll('.nav-link').forEach(el => {
        el.classList.remove('text-primary', 'font-bold', 'bg-emerald-50', 'dark:bg-gray-700');
        el.style.color = '';
    });
    const activeBtn = document.getElementById(`nav-${viewId}`);
    if (activeBtn) activeBtn.classList.add('text-primary');

    // Map init
    if (viewId === 'map') {
        if (!map) {
            setTimeout(initMap, 100);
        } else {
            map.invalidateSize();
        }
    }

    // Contact map init
    if (viewId === 'contact' && !contactMapInitialized) {
        setTimeout(initContactMap, 200);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ==========================================
// HOME PAGE
// ==========================================
function initHome() {
    // Dashboard stats
    const statsContainer = document.getElementById('dashboard-stats');
    if (statsContainer) {
        dashboardStats.forEach(stat => {
            statsContainer.innerHTML += `
                <div style="background:#fff; border-radius:16px; padding:24px 16px; text-align:center; box-shadow:0 2px 12px rgba(0,0,0,0.06); transition:transform 0.2s;" class="dark:bg-gray-800" onmouseover="this.style.transform='translateY(-4px)'" onmouseout="this.style.transform='translateY(0)'">
                    <div style="width:52px; height:52px; border-radius:14px; background:${stat.bg}; display:flex; align-items:center; justify-content:center; margin:0 auto 12px;">
                        <i class="fa-solid ${stat.icon}" style="font-size:22px; color:${stat.color};"></i>
                    </div>
                    <h3 style="font-size:1.7rem; font-weight:800; color:#1E293B; margin:0 0 4px;" class="dark:text-white">${stat.value}</h3>
                    <p style="font-size:12px; color:#64748B; font-weight:500; margin:0;">${stat.label}</p>
                </div>
            `;
        });
    }

    // Quick Access
    const qaContainer = document.getElementById('quick-access-container');
    if (qaContainer) {
        quickAccess.forEach(item => {
            qaContainer.innerHTML += `
                <div onclick="navigate('${item.id}')" style="background:rgba(255,255,255,0.1); border-radius:16px; padding:24px; text-align:center; cursor:pointer; border:1.5px solid rgba(255,255,255,0.15); transition:all 0.2s; backdrop-filter:blur(10px);" onmouseover="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='translateY(-4px)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'; this.style.transform='translateY(0)'">
                    <div style="width:56px; height:56px; border-radius:16px; background:${item.bg}; display:flex; align-items:center; justify-content:center; margin:0 auto 12px; border:1.5px solid rgba(255,255,255,0.2);">
                        <i class="fa-solid ${item.icon}" style="font-size:22px; color:#fff;"></i>
                    </div>
                    <h3 style="font-weight:700; color:#fff; margin:0 0 4px; font-size:14px;">${item.label}</h3>
                    <p style="font-size:12px; color:rgba(255,255,255,0.65); margin:0;">${item.desc}</p>
                </div>
            `;
        });
    }

    // Potensi Highlight — Load from JSON
    fetch('data/potensi.json')
        .then(res => res.json())
        .then(data => {
            allPotensi = data.potensi;
            renderPotensiHighlight(data.potensi.slice(0, 3));
            initPotensiPage(data);
        })
        .catch(() => {
            const c = document.getElementById('potensi-highlight');
            if (c) c.innerHTML = '<p style="color:#fff;text-align:center;grid-column:1/-1;">Data tidak tersedia.</p>';
        });
}

function renderPotensiHighlight(items) {
    const container = document.getElementById('potensi-highlight');
    if (!container) return;
    container.innerHTML = '';
    items.forEach(item => {
        container.innerHTML += `
            <div style="background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.1); transition:transform 0.2s;" class="dark:bg-gray-800" onmouseover="this.style.transform='translateY(-6px)'" onmouseout="this.style.transform='translateY(0)'">
                <div style="position:relative; height:200px;">
                    <img src="${item.img}" alt="${item.nama}" style="width:100%; height:100%; object-fit:cover; display:block;">
                    <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%);"></div>
                    <span style="position:absolute; top:12px; left:12px; background:${item.color}; color:#fff; font-size:10px; font-weight:700; padding:3px 10px; border-radius:999px; text-transform:uppercase; letter-spacing:0.05em;">${item.kategori}</span>
                </div>
                <div style="padding:20px;">
                    <h3 style="font-size:16px; font-weight:700; color:#1E293B; margin:0 0 8px;" class="dark:text-white">${item.nama}</h3>
                    <p style="font-size:13px; color:#64748B; margin:0 0 16px; line-height:1.6; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;" class="dark:text-gray-300">${item.deskripsi}</p>
                    <button onclick="navigate('potensi')" style="display:inline-flex; align-items:center; gap:6px; color:${item.color}; font-weight:600; font-size:13px; background:none; border:none; cursor:pointer; font-family:'Poppins',sans-serif; padding:0;">
                        Selengkapnya <i class="fa-solid fa-arrow-right" style="font-size:11px;"></i>
                    </button>
                </div>
            </div>
        `;
    });
}

// ==========================================
// PROFILE PAGE
// ==========================================
function initProfile() {
    // Stats Row
    const statsRow = document.getElementById('profile-stats-row');
    if (statsRow) {
        profileStatsRow.forEach(s => {
            statsRow.innerHTML += `
                <div style="background:#fff; border-radius:16px; padding:20px; text-align:center; box-shadow:0 2px 12px rgba(0,0,0,0.06);" class="dark:bg-gray-800">
                    <i class="fa-solid ${s.icon}" style="font-size:24px; color:${s.color}; margin-bottom:8px; display:block;"></i>
                    <h4 style="font-size:1.1rem; font-weight:800; color:#1E293B; margin:0 0 4px;" class="dark:text-white">${s.value}</h4>
                    <p style="font-size:11px; color:#64748B; margin:0; font-weight:500;">${s.label}</p>
                </div>
            `;
        });
    }

    // Data Wilayah
    const wilayah = document.getElementById('profile-data-wilayah');
    if (wilayah) {
        dataWilayah.forEach(d => {
            wilayah.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:#F8FAFC; border-radius:10px;" class="dark:bg-gray-700">
                    <span style="font-size:13px; color:#64748B; font-weight:500;" class="dark:text-gray-300">${d.label}</span>
                    <span style="font-size:13px; color:#1E293B; font-weight:700; text-align:right;" class="dark:text-white">${d.value}</span>
                </div>
            `;
        });
    }

    // Struktur
    const struktur = document.getElementById('profile-struktur');
    if (struktur) {
        strukturPemerintahan.forEach(s => {
            struktur.innerHTML += `
                <div style="background:#F8FAFC; border-radius:14px; padding:20px; text-align:center; border:1.5px solid #E2E8F0;" class="dark:bg-gray-700 dark:border-gray-600">
                    <div style="width:48px; height:48px; background:#ECFDF5; border-radius:12px; display:flex; align-items:center; justify-content:center; margin:0 auto 12px;">
                        <i class="fa-solid ${s.icon}" style="font-size:20px; color:#047857;"></i>
                    </div>
                    <p style="font-size:11px; color:#64748B; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin:0 0 6px;" class="dark:text-gray-400">${s.jabatan}</p>
                    <h4 style="font-size:14px; font-weight:700; color:#1E293B; margin:0;" class="dark:text-white">${s.nama}</h4>
                </div>
            `;
        });
    }
}

// ==========================================
// POTENSI PAGE
// ==========================================
function initPotensiPage(data) {
    const categories = ['Semua', ...new Set(data.potensi.map(p => p.kategori))];

    // Filter Tabs
    const tabs = document.getElementById('potensi-filter-tabs');
    if (tabs) {
        const catColors = { 'UMKM': '#047857', 'Pertanian': '#047857', 'Wisata': '#047857', 'Peternakan': '#047857' };
        categories.forEach(cat => {
            const btn = document.createElement('button');
            const isActive = cat === 'Semua';
            const color = catColors[cat] || '#047857';
            btn.innerHTML = cat;
            btn.style.cssText = `padding:8px 20px; border-radius:999px; border:2px solid; font-size:13px; font-weight:600; font-family:'Poppins',sans-serif; cursor:pointer; transition:all 0.2s; ${isActive ? `background:${color}; color:#fff; border-color:${color};` : `background:#fff; color:${color}; border-color:${color};`}`;
            btn.onclick = () => {
                document.querySelectorAll('#potensi-filter-tabs button').forEach(b => {
                    const c = catColors[b.innerHTML] || '#047857';
                    b.style.background = '#fff'; b.style.color = c; b.style.borderColor = c;
                });
                btn.style.background = color; btn.style.color = '#fff'; btn.style.borderColor = color;
                renderPotensiCards(cat === 'Semua' ? data.potensi : data.potensi.filter(p => p.kategori === cat));
            };
            tabs.appendChild(btn);
        });
    }

    renderPotensiCards(data.potensi);
    renderUMKMTable(data.umkm);
}

function renderPotensiCards(items) {
    const container = document.getElementById('potensi-cards');
    if (!container) return;
    container.innerHTML = '';
    const catColors = { 'UMKM': '#047857', 'Pertanian': '#047857', 'Wisata': '#047857', 'Peternakan': '#047857' };

    items.forEach(item => {
        const color = catColors[item.kategori] || '#047857';
        container.innerHTML += `
            <div style="background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 4px 20px rgba(0,0,0,0.08); transition:transform 0.2s; display:flex; flex-direction:column;" class="dark:bg-gray-800" onmouseover="this.style.transform='translateY(-6px)'" onmouseout="this.style.transform='translateY(0)'">
                <div style="position:relative; height:200px; flex-shrink:0;">
                    <img src="${item.img}" alt="${item.nama}" style="width:100%; height:100%; object-fit:cover; display:block;">
                    <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%);"></div>
                    <span style="position:absolute; top:12px; left:12px; background:${color}; color:#fff; font-size:10px; font-weight:700; padding:4px 12px; border-radius:999px; text-transform:uppercase;">${item.kategori}</span>
                </div>
                <div style="padding:20px; flex:1; display:flex; flex-direction:column;">
                    <h3 style="font-size:15px; font-weight:700; color:#1E293B; margin:0 0 8px;" class="dark:text-white">${item.nama}</h3>
                    <p style="font-size:13px; color:#64748B; margin:0 0 12px; line-height:1.6; flex:1;" class="dark:text-gray-300">${item.deskripsi}</p>
                    <div style="display:flex; align-items:center; gap:6px; font-size:12px; color:#94A3B8;">
                        <i class="fa-solid fa-location-dot" style="color:${color};"></i> ${item.alamat}
                    </div>
                    ${item.kontak ? `<a href="https://wa.me/${item.kontak.replace(/\D/g, '')}" target="_blank" style="margin-top:14px; display:inline-flex; align-items:center; justify-content:center; gap:6px; background:${color}; color:#fff; padding:10px 16px; border-radius:10px; font-weight:700; font-size:12px; text-decoration:none; transition:all 0.2s; box-shadow:0 4px 12px ${color}40;" onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'"><i class="fa-brands fa-whatsapp" style="font-size:14px;"></i> ${item.kategori === 'Wisata' ? 'Reservasi' : 'Hubungi'}</a>` : ''}
                </div>
            </div>
        `;
    });
}

function renderUMKMTable(umkm) {
    const tbody = document.getElementById('umkm-tbody');
    if (!tbody) return;
    umkm.forEach((u, i) => {
        tbody.innerHTML += `
            <tr style="${i % 2 === 0 ? 'background:#FAFAFA;' : 'background:#fff;'}" class="dark:bg-gray-800">
                <td style="padding:14px 16px; font-size:13px; font-weight:600; color:#1E293B;" class="dark:text-white">${u.nama}</td>
                <td style="padding:14px 16px; font-size:12px;" class="hidden md:table-cell dark:text-gray-300"><span style="background:#ECFDF5; color:#047857; padding:3px 10px; border-radius:999px; font-weight:600;">${u.kategori}</span></td>
                <td style="padding:14px 16px; font-size:13px; color:#64748B;" class="hidden md:table-cell dark:text-gray-400">${u.alamat}</td>
                <td style="padding:14px 16px;">
                    ${u.kontak ? `<a href="https://wa.me/${u.kontak.replace(/\D/g, '')}" target="_blank" style="display:inline-flex;align-items:center;gap:5px;background:#25D366;color:#fff;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;"><i class="fa-brands fa-whatsapp"></i> WA</a>` : '<span style="color:#CBD5E1;font-size:12px;">—</span>'}
                </td>
            </tr>
        `;
    });
}

// ==========================================
// CONTACT PAGE
// ==========================================
function initContact() {
    // Contact info cards
    const infoContainer = document.getElementById('contact-info-cards');
    if (infoContainer) {
        contactInfo.forEach(c => {
            infoContainer.innerHTML += `
                <div style="background:#fff; border-radius:16px; padding:16px 20px; box-shadow:0 2px 10px rgba(0,0,0,0.06); display:flex; align-items:flex-start; gap:14px; margin-bottom:12px;" class="dark:bg-gray-800">
                    <div style="width:42px; height:42px; background:${c.color}18; border-radius:12px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                        <i class="fa-solid ${c.icon}" style="color:${c.color}; font-size:18px;"></i>
                    </div>
                    <div>
                        <p style="font-size:11px; color:#94A3B8; font-weight:600; margin:0 0 3px; text-transform:uppercase; letter-spacing:0.05em;">${c.label}</p>
                        <p style="font-size:13px; color:#1E293B; font-weight:600; margin:0; line-height:1.5;" class="dark:text-white">${c.value}</p>
                    </div>
                </div>
            `;
        });
    }

    // Jam Pelayanan
    const jamContainer = document.getElementById('jam-pelayanan');
    if (jamContainer) {
        jamPelayanan.forEach(j => {
            jamContainer.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #F1F5F9;">
                    <span style="font-size:13px; color:#374151; font-weight:500;" class="dark:text-gray-300">${j.hari}</span>
                    <span style="font-size:12px; font-weight:600; padding:3px 10px; border-radius:999px; ${j.buka ? 'color:#059669; background:#ECFDF5;' : 'color:#DC2626; background:#FEF2F2;'}">${j.jam}</span>
                </div>
            `;
        });
    }

    // Social Media
    const socialContainer = document.getElementById('social-media-links');
    if (socialContainer) {
        socialMedia.forEach(s => {
            socialContainer.innerHTML += `
                <a href="${s.url}" target="_blank" title="${s.label}" style="width:44px; height:44px; border-radius:12px; background:${s.color}18; display:flex; align-items:center; justify-content:center; transition:all 0.2s; text-decoration:none;" onmouseover="this.style.background='${s.color}'; this.querySelector('i').style.color='#fff';" onmouseout="this.style.background='${s.color}18'; this.querySelector('i').style.color='${s.color}';">
                    <i class="fa-brands ${s.icon}" style="font-size:20px; color:${s.color};"></i>
                </a>
            `;
        });
    }
}

function initContactMap() {
    if (contactMapInitialized) return;
    contactMapInitialized = true;

    contactMap = L.map('contact-map', { zoomControl: true, scrollWheelZoom: false });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(contactMap);

    const desaLatLng = [-7.1077, 113.5953];
    contactMap.setView(desaLatLng, 16);

    const markerIcon = L.divIcon({
        html: `<div style="background:#047857; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid #fff; box-shadow:0 4px 12px rgba(4,120,87,0.5);"><i class="fa-solid fa-building" style="color:#fff; font-size:16px;"></i></div>`,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -20]
    });

    L.marker(desaLatLng, { icon: markerIcon })
        .addTo(contactMap)
        .bindPopup(`<div style="font-family:'Poppins',sans-serif; padding:4px 0;"><strong style="font-size:14px;color:#1E293B;">Kantor Desa Gagah</strong><br><span style="font-size:12px;color:#64748B;">Jl. Raya Gagah No. 1, Kadur, Pamekasan</span></div>`, { maxWidth: 220 })
        .openPopup();
}

function handleContactForm(e) {
    e.preventDefault();
    const form = e.target;

    const nama = form.querySelector('input[type="text"]').value;
    const hp = form.querySelector('input[type="tel"]').value;
    const perihal = form.querySelector('select').value;
    const pesan = form.querySelector('textarea').value;

    const waNumber = '6287850458442';
    const text = `Halo Admin Desa Gagah,%0A%0A*Nama:* ${nama}%0A*No HP:* ${hp || '-'}%0A*Perihal:* ${perihal}%0A*Pesan:*%0A${pesan}`;

    window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Mengalihkan ke WhatsApp...';
    btn.style.background = '#059669';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '#2563EB';
        btn.disabled = false;
        form.reset();
    }, 3000);
}

// ==========================================
// SIDEBAR GLOBAL FUNCTIONS
// ==========================================
function openSidebar() {
    const sidebar = document.getElementById('map-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    if (sidebar) sidebar.classList.remove('-translate-x-full');
    if (backdrop) backdrop.classList.remove('hidden');
    if (toggleBtn) toggleBtn.style.display = 'none';
}

function closeSidebar() {
    const sidebar = document.getElementById('map-sidebar');
    const backdrop = document.getElementById('sidebar-backdrop');
    const toggleBtn = document.getElementById('toggle-sidebar-btn');
    if (sidebar) sidebar.classList.add('-translate-x-full');
    if (backdrop) backdrop.classList.add('hidden');
    if (toggleBtn) toggleBtn.style.removeProperty('display');
}

// ==========================================
// MAP PAGE
// ==========================================
function initMap() {
    map = L.map('map', {
        center: [-7.115, 113.565],
        zoom: 15,
        zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.control.scale({ position: 'bottomleft', metric: true, imperial: false }).addTo(map);

    if (L.control.fullscreen) L.control.fullscreen({ position: 'topright' }).addTo(map);
    if (L.control.locate) L.control.locate({ position: 'topright', strings: { title: "Lokasi saya" } }).addTo(map);
    if (L.control.measure) L.control.measure({ position: 'topright', primaryLengthUnit: 'meters', secondaryLengthUnit: 'kilometers', primaryAreaUnit: 'sqmeters', secondaryAreaUnit: 'hectares' }).addTo(map);

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(map);
    const googleHybrid = L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '© Google Maps' });
    const googleSatellite = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '© Google Maps' });
    const googleStreets = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 20, subdomains: ['mt0', 'mt1', 'mt2', 'mt3'], attribution: '© Google Maps' });
    const esriSatellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, attribution: 'Tiles © Esri' });
    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '© OpenTopoMap' });

    const baseMaps = {
        "OpenStreetMap": osm,
        "Google Satellite (+Label Jalan)": googleHybrid,
        "Google Satellite (Murni)": googleSatellite,
        "Google Maps (Jalan)": googleStreets,
        "Esri Satellite": esriSatellite,
        "Peta Topografi": topo
    };

    const layerControl = L.control.layers(baseMaps, {}, { position: 'topright' }).addTo(map);

    if (L.Control.MiniMap) {
        new L.Control.MiniMap(L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'), { position: 'bottomright', toggleDisplay: true }).addTo(map);
    }

    map.on('mousemove', e => {
        const el = document.getElementById('coordinate-display');
        if (el) el.innerHTML = `Lat: ${e.latlng.lat.toFixed(5)}, Lng: ${e.latlng.lng.toFixed(5)}`;
    });

    // Reset button
    const resetControl = L.control({ position: 'topright' });
    resetControl.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        div.innerHTML = `<a href="#" title="Kembali ke Desa" style="font-size:16px; text-align:center; line-height:30px;"><i class="fa-solid fa-home"></i></a>`;
        div.style.backgroundColor = 'white';
        div.onclick = e => { e.preventDefault(); if (desaBounds && desaBounds.isValid()) { map.fitBounds(desaBounds); } else { map.setView([-7.115, 113.565], 15); } };
        return div;
    };
    resetControl.addTo(map);

    markerCluster = L.markerClusterGroup();
    loadGeoJSON(layerControl);

    document.getElementById('search-input').addEventListener('input', e => renderSidebarList(e.target.value.toLowerCase(), currentFilter));
}

function loadGeoJSON(layerControl) {
    // Batas Desa
    fetch('data/batas_desa.geojson')
        .then(r => r.json())
        .then(data => {
            const desaLayer = L.geoJSON(data, { style: { color: '#047857', weight: 3, opacity: 1, fillOpacity: 0.1 } }).addTo(map);
            desaBounds = desaLayer.getBounds();
            if (desaBounds.isValid()) map.fitBounds(desaBounds);
            layerControl.addOverlay(desaLayer, "Batas Desa");
        }).catch(err => console.log('Error batas_desa:', err));

    // Batas Dusun
    fetch('data/batas_dusun.geojson')
        .then(r => r.json())
        .then(data => {
            const dusunLayer = L.geoJSON(data, {
                style: { color: '#047857', weight: 2, dashArray: '5,5', fillOpacity: 0 },
                onEachFeature: (f, l) => l.bindTooltip(f.properties.nama, { permanent: true, direction: "center", className: "bg-transparent border-none text-green-700 font-bold shadow-none" })
            });
            layerControl.addOverlay(dusunLayer, "Batas Dusun");
        }).catch(err => console.log('Error batas_dusun:', err));

    // Fasilitas
    fetch('data/fasilitas.geojson')
        .then(r => r.json())
        .then(data => {
            allFeatures = data.features;
            const fasLayer = L.geoJSON(data, {
                pointToLayer: (feature, latlng) => {
                    const icon = L.divIcon({
                        html: `<div class="custom-marker w-8 h-8"><i class="fa-solid ${feature.properties.icon || 'fa-map-pin'}"></i></div>`,
                        className: '', iconSize: [32, 32], iconAnchor: [16, 16], popupAnchor: [0, -16]
                    });
                    return L.marker(latlng, { icon });
                },
                onEachFeature: (feature, layer) => {
                    const p = feature.properties;
                    const coords = feature.geometry.coordinates;
                    const popupContent = `
                        <div style="width:256px; border-radius:12px; overflow:hidden; font-family:'Poppins',sans-serif; background:#fff;">
                            <div style="position:relative;">
                                <img src="${p.foto}" style="width:100%; height:140px; object-fit:cover; display:block;">
                                <div style="position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.45) 50%, transparent 100%);"></div>
                                <div style="position:absolute; bottom:12px; left:12px; right:12px;">
                                    <span style="display:inline-block; padding:3px 10px; background:#047857; color:#fff; font-size:10px; font-weight:700; text-transform:uppercase; border-radius:999px; margin-bottom:4px;">${p.kategori}</span>
                                    <h3 style="margin:0; font-size:16px; font-weight:800; color:#ffffff; line-height:1.3;">${p.nama}</h3>
                                </div>
                            </div>
                            <div style="padding:14px;">
                                <div style="display:flex; align-items:flex-start; gap:8px; margin-bottom:8px;">
                                    <i class="fa-solid fa-location-dot" style="color:#047857; margin-top:2px; flex-shrink:0;"></i>
                                    <span style="font-size:13px; color:#4B5563; line-height:1.4;">${p.alamat}</span>
                                </div>
                                <p style="font-size:12px; color:#6B7280; margin:0 0 14px; line-height:1.5; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${p.deskripsi}</p>
                                <div style="display:flex; gap:8px;">
                                    <a href="https://www.google.com/maps/search/?api=1&query=${coords[1]},${coords[0]}" target="_blank" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; background:#047857; color:#ffffff !important; text-decoration:none; font-size:13px; font-weight:600; padding:9px 0; border-radius:8px;">
                                        <i class="fa-solid fa-map" style="color:#fff;"></i> Rute
                                    </a>
                                    <button onclick="this.closest('.leaflet-popup').querySelector('.leaflet-popup-close-button').click()" style="flex:1; display:flex; align-items:center; justify-content:center; gap:6px; background:#F3F4F6; color:#1F2937; font-size:13px; font-weight:600; padding:9px 0; border-radius:8px; border:none; cursor:pointer;">
                                        <i class="fa-solid fa-xmark"></i> Tutup
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;
                    layer.bindPopup(popupContent, { className: 'custom-popup', closeButton: true, maxWidth: 270 });
                    feature.layer = layer;
                }
            });

            markerCluster.addLayer(fasLayer);
            map.addLayer(markerCluster);
            layerControl.addOverlay(markerCluster, "Fasilitas & UMKM");
            buildFilters();
            renderSidebarList('', 'All');
        }).catch(err => console.log('Error fasilitas:', err));
}

function buildFilters() {
    const categories = ['All', ...new Set(allFeatures.map(f => f.properties.kategori))];
    const container = document.getElementById('filter-container');
    container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.style.cssText = `position:relative; width:100%;`;

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-filter';
    icon.style.cssText = `position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#64748B; font-size:13px; pointer-events:none;`;

    const select = document.createElement('select');
    select.id = 'category-dropdown';
    select.style.cssText = `width:100%; box-sizing:border-box; padding:9px 34px 9px 34px; border:1.5px solid #E2E8F0; border-radius:10px; background-color:#F8FAFC; color:#1E293B; font-size:13px; font-weight:600; font-family:'Poppins',sans-serif; cursor:pointer; outline:none; appearance:none; transition:all 0.2s;`;

    const arrow = document.createElement('i');
    arrow.className = 'fa-solid fa-chevron-down';
    arrow.style.cssText = `position:absolute; right:12px; top:50%; transform:translateY(-50%); color:#64748B; font-size:12px; pointer-events:none;`;

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat === 'All' ? 'Semua Kategori (All)' : cat;
        if (cat === currentFilter) option.selected = true;
        select.appendChild(option);
    });

    select.onchange = (e) => {
        currentFilter = e.target.value;
        const searchInput = document.getElementById('search-input');
        renderSidebarList(searchInput ? searchInput.value.toLowerCase() : '', currentFilter);
    };

    select.onfocus = () => { select.style.borderColor = '#047857'; select.style.backgroundColor = '#ffffff'; };
    select.onblur = () => { select.style.borderColor = '#E2E8F0'; select.style.backgroundColor = '#F8FAFC'; };

    wrapper.appendChild(icon);
    wrapper.appendChild(select);
    wrapper.appendChild(arrow);
    container.appendChild(wrapper);
}

function renderSidebarList(searchQuery, filterCat) {
    const container = document.getElementById('location-list');
    container.innerHTML = '';
    const filtered = allFeatures.filter(f => {
        const matchSearch = f.properties.nama.toLowerCase().includes(searchQuery) || f.properties.deskripsi.toLowerCase().includes(searchQuery);
        const matchFilter = filterCat === 'All' || f.properties.kategori === filterCat;
        return matchSearch && matchFilter;
    });

    const statsEl = document.getElementById('sidebar-stats');
    if (statsEl) statsEl.innerHTML = `<i class="fa-solid fa-circle-dot" style="color:#047857;margin-right:5px;"></i> Menampilkan <strong style="color:#1E293B;">${filtered.length}</strong> dari ${allFeatures.length} lokasi`;

    if (filtered.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:40px 20px;font-family:'Poppins',sans-serif;"><div style="width:60px;height:60px;background:#F1F5F9;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;"><i class="fa-solid fa-map-pin" style="font-size:24px;color:#CBD5E1;"></i></div><p style="font-size:13px;color:#94A3B8;margin:0;">Tidak ada lokasi ditemukan.</p></div>`;
        return;
    }

    const catColors = { 'Kantor Desa': '#047857', 'Masjid': '#047857', 'Sekolah': '#047857', 'UMKM': '#047857', 'Tempat Wisata': '#047857', 'Kesehatan': '#047857' };
    const catIcons = { 'Kantor Desa': 'fa-building', 'Masjid': 'fa-mosque', 'Sekolah': 'fa-school', 'UMKM': 'fa-store', 'Tempat Wisata': 'fa-tree', 'Kesehatan': 'fa-notes-medical' };

    filtered.forEach(f => {
        const p = f.properties;
        const coords = f.geometry.coordinates;
        const color = catColors[p.kategori] || '#047857';
        const icon = catIcons[p.kategori] || p.icon || 'fa-map-pin';

        const item = document.createElement('div');
        item.style.cssText = `display:flex;align-items:center;gap:12px;padding:12px 14px;cursor:pointer;border-bottom:1px solid #F1F5F9;transition:background 0.15s;font-family:'Poppins',sans-serif;`;
        item.innerHTML = `
            <div style="width:42px;height:42px;border-radius:12px;background:${color}18;display:flex;align-items:center;justify-content:center;flex-shrink:0;border:1.5px solid ${color}30;">
                <i class="fa-solid ${icon}" style="font-size:16px;color:${color};"></i>
            </div>
            <div style="flex:1;min-width:0;">
                <h4 style="margin:0 0 3px;font-size:13px;font-weight:700;color:#1E293B;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.nama}</h4>
                <div style="display:flex;align-items:center;gap:6px;">
                    <span style="display:inline-block;padding:2px 8px;background:${color}18;color:${color};font-size:10px;font-weight:600;border-radius:999px;">${p.kategori}</span>
                </div>
                <p style="margin:4px 0 0;font-size:11px;color:#94A3B8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    <i class="fa-solid fa-location-dot" style="margin-right:3px;"></i>${p.alamat}
                </p>
            </div>
            <i class="fa-solid fa-chevron-right" style="font-size:11px;color:#CBD5E1;flex-shrink:0;"></i>
        `;
        item.onmouseenter = () => item.style.background = '#F8FAFC';
        item.onmouseleave = () => item.style.background = 'transparent';
        item.onclick = () => {
            if (window.innerWidth < 768) {
                closeSidebar();
            }
            map.flyTo([coords[1], coords[0]], 18, { duration: 1.5 });
            setTimeout(() => {
                markerCluster.zoomToShowLayer(f.layer, () => f.layer.openPopup());
            }, 1600);
        };
        container.appendChild(item);
    });
}

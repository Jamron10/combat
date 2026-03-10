// ВАЖНО: Укажите здесь Telegram ID администраторов! 
// Если вашего ID здесь нет, админка не откроется.
const ADMIN_IDS = [5730406030]; 

// --- Game Configuration ---
const StorageHelper = {
  async getItem(key) {
    if (window.location.hostname.includes('miniapps.ai') && window.miniappsAI && window.miniappsAI.storage) {
      try { return await window.miniappsAI.storage.getItem(key); } catch(e) {}
    }
    return localStorage.getItem(key);
  },
  async setItem(key, value) {
    if (window.location.hostname.includes('miniapps.ai') && window.miniappsAI && window.miniappsAI.storage) {
      try { await window.miniappsAI.storage.setItem(key, value); return; } catch(e) {}
    }
    localStorage.setItem(key, value);
  }
};

const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname.includes('render.com'))
  ? '/api' 
  : 'https://combat.onrender.com/api';

const CONFIG = {
  maxOfflineHours: 3, 
  energyRechargeRate: 1, 
  saveIntervalMs: 5000, 
  baseMaxEnergy: 500 
};

// Динамические категории и карточки
let CATEGORY_NAMES = { markets: 'Рынки', pr: 'PR & Команда', legal: 'Право', web3: 'Web3' };
let TASK_CATEGORIES = { social: 'Соцсети', partners: 'Партнеры', ref: 'Рефералы' };

let TASKS_DB = [
  { id: 'tg_channel', title: 'Подписаться на ТГ Канал', category: 'social', link: 'https://t.me/telegram', reward: 5.0, icon: 'fa-telegram', iconColor: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'tg_chat', title: 'Вступить в ТГ Чат', category: 'social', link: 'https://t.me/telegram', reward: 2.5, icon: 'fa-telegram', iconColor: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'yt_sub', title: 'Подписаться на YouTube', category: 'social', reward: 10.0, icon: 'fa-youtube', iconColor: 'text-red-500', bg: 'bg-red-500/10' },
  { id: 'x_follow', title: 'Читать в X (Twitter)', category: 'social', reward: 7.5, icon: 'fa-x-twitter', iconColor: 'text-white', bg: 'bg-gray-500/10' },
  { id: 'invite_3', title: 'Пригласить 3 друзей', category: 'ref', reward: 50.0, icon: 'fa-user-group', iconColor: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'blum', title: 'Играть в Blum', category: 'partners', reward: 25.0, icon: 'fa-gamepad', iconColor: 'text-pink-400', bg: 'bg-pink-500/10' },
  { id: 'bybit', title: 'Регистрация на Bybit', category: 'partners', reward: 100.0, icon: 'fa-bitcoin', iconColor: 'text-yellow-500', bg: 'bg-yellow-500/10' },
];

let UPGRADES_DB = [
  { id: 'card1', name: 'DeFi Staking', category: 'markets', baseCost: 0.01, basePPH: 0.005, icon: '🏦' },
  { id: 'card2', name: 'Liquidity Pool', category: 'markets', baseCost: 0.05, basePPH: 0.025, icon: '💧' },
  { id: 'card3', name: 'Trading Bot', category: 'web3', baseCost: 0.20, basePPH: 0.100, icon: '🤖' },
  { id: 'card4', name: 'Whale Signal', category: 'pr', baseCost: 1.00, basePPH: 0.450, icon: '🐋' },
  { id: 'card5', name: 'Smart Contract', category: 'legal', baseCost: 5.00, basePPH: 2.000, icon: '📜' },
  { id: 'card6', name: 'Own Exchange', category: 'markets', baseCost: 15.00, basePPH: 5.000, icon: '📈' },
];

const LEVELS = [
  {
    name: 'Basic', emoji: '🌱', threshold: 0,
    rimClass: 'from-[#4ade80] via-[#22c55e] to-[#14532d] border-[#14532d]',
    innerClass: 'bg-[radial-gradient(circle_at_35%_35%,#4ade80,#166534_60%,#052e16)]',
    symbolHtml: '<span class="text-[4.5rem] font-black text-white/90 drop-shadow-sm">₮</span>',
    glow1: 'bg-green-400/10', glow2: 'bg-transparent'
  },
  {
    name: 'Bronze', emoji: '🥉', threshold: 0.05,
    rimClass: 'from-[#fb923c] via-[#ea580c] to-[#7c2d12] border-[#7c2d12]',
    innerClass: 'bg-[radial-gradient(circle_at_35%_35%,#fdba74,#9a3412_60%,#431407)]',
    symbolHtml: '<span class="text-[4.5rem] font-black text-orange-100 drop-shadow-md">₮</span>',
    glow1: 'bg-orange-400/20', glow2: 'bg-orange-500/10'
  },
  {
    name: 'Silver', emoji: '🥈', threshold: 0.50,
    rimClass: 'from-[#cbd5e1] via-[#94a3b8] to-[#334155] border-[#334155]',
    innerClass: 'bg-[radial-gradient(circle_at_35%_35%,#f1f5f9,#475569_60%,#0f172a)]',
    symbolHtml: '<span class="text-[4.5rem] font-black text-white drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)]">₮</span>',
    glow1: 'bg-slate-300/30', glow2: 'bg-slate-400/10'
  },
  {
    name: 'Gold', emoji: '🥇', threshold: 5.0,
    rimClass: 'from-[#fde047] via-[#eab308] to-[#713f12] border-[#713f12]',
    innerClass: 'bg-[radial-gradient(circle_at_35%_35%,#fef08a,#a16207_60%,#422006)]',
    symbolHtml: '<span class="text-[5rem] font-black text-yellow-100 drop-shadow-[0_10px_15px_rgba(0,0,0,0.6)]">₮</span>',
    glow1: 'bg-yellow-400/40', glow2: 'bg-amber-500/20'
  },
  {
    name: 'Diamond', emoji: '💎', threshold: 25.0,
    rimClass: 'from-[#67e8f9] via-[#06b6d4] to-[#164e63] border-[#164e63]',
    innerClass: 'bg-[radial-gradient(circle_at_35%_35%,#cffafe,#0e7490_60%,#083344)]',
    symbolHtml: '<span class="text-[5rem] font-black text-cyan-50 drop-shadow-[0_0_20px_rgba(103,232,249,0.8)]">₮</span>',
    glow1: 'bg-cyan-400/50', glow2: 'bg-blue-400/30'
  },
  {
    name: 'Neon', emoji: '⚡', threshold: 100.0,
    rimClass: 'from-[#f0abfc] via-[#d946ef] to-[#701a75] border-[#701a75]',
    innerClass: 'bg-[radial-gradient(circle_at_35%_35%,#fdf4ff,#a21caf_60%,#4a044e)]',
    symbolHtml: '<span class="text-[5.5rem] font-black text-fuchsia-100 drop-shadow-[0_0_25px_rgba(217,70,239,1)]">₮</span>',
    glow1: 'bg-fuchsia-500/50', glow2: 'bg-purple-500/30'
  },
  {
    name: 'Cosmic', emoji: '🌌', threshold: 500.0,
    rimClass: 'from-[#818cf8] via-[#4f46e5] to-[#1e1b4b] border-[#1e1b4b]',
    innerClass: 'bg-[radial-gradient(circle_at_35%_35%,#c7d2fe,#3730a3_60%,#111827)]',
    symbolHtml: '<span class="text-[5.5rem] font-black text-indigo-100 drop-shadow-[0_0_30px_rgba(99,102,241,1)]">₮</span>',
    glow1: 'bg-indigo-500/50', glow2: 'bg-blue-600/30'
  },
  {
    name: 'Whale', emoji: '🐋', threshold: 2500.0,
    rimClass: 'from-[#10b981] via-[#047857] to-[#022c22] border-[#022c22]',
    innerClass: 'bg-[radial-gradient(circle_at_35%_35%,#34d399,#065f46_60%,#022c22)]',
    symbolHtml: '<span class="text-[6rem] font-black text-white drop-shadow-[0_0_40px_rgba(52,211,153,1)]">₮</span>',
    glow1: 'bg-emerald-400/60', glow2: 'bg-yellow-400/40'
  }
];

// --- Game State ---
let state = {
  userId: 123456789,
  balance: 0,
  totalEarned: 0,
  profitPerHour: 0,
  tapValue: 0.0001,
  energy: CONFIG.baseMaxEnergy,
  maxEnergy: CONFIG.baseMaxEnergy,
  lastSync: Date.now(),
  upgrades: {},
  extraTap: 0,
  extraMaxEnergy: 0,
  promoUsed: false,
  currentLevelIdx: 0,
  boostCount: 0,
  tapUpgradeCount: 0,
  energyUpgradeCount: 0,
  referredBy: null,
  upgradesDB: null,
  categoryNames: null,
  currentMineCategory: 'markets',
  tasksDB: null,
  taskCategories: null,
  currentTaskCategory: 'social',
  completedTasks: [],
  lastDaily: null,
  transactions: []
};

function getBoostCost() {
  return Number((0.50 * Math.pow(1.25, state.boostCount || 0)).toFixed(2));
}

function getEnergyUpgradeCost() {
  return Number((2.00 * Math.pow(1.5, state.energyUpgradeCount || 0)).toFixed(2));
}

function getTapUpgradeCost() {
  return Number((5.00 * Math.pow(1.5, state.tapUpgradeCount || 0)).toFixed(2));
}

// --- DOM Elements ---
const els = {
  balanceContainer: document.getElementById('balanceContainer'),
  balance: document.getElementById('balanceDisplay'),
  pph: document.getElementById('pphDisplay'),
  tapValue: document.getElementById('tapValueDisplay'),
  energy: document.getElementById('energyDisplay'),
  maxEnergy: document.getElementById('maxEnergyDisplay'),
  energyBar: document.getElementById('energyBar'),
  levelProgress: document.getElementById('levelProgress'),
  clickArea: document.getElementById('clickArea'),
  upgradesContainer: document.getElementById('upgradesContainer'),
  mineCategoriesTabs: document.getElementById('mineCategoriesTabs'),
  offlineModal: document.getElementById('offlineModal'),
  offlineProfitDisplay: document.getElementById('offlineProfitDisplay'),
  collectOfflineBtn: document.getElementById('collectOfflineBtn'),
  bgAnimations: document.getElementById('bg-animations'),
  boostBtn: document.getElementById('boostBtn'),
  boostCostDisplay: document.getElementById('boostCostDisplay'),
  
  // Upgrades Modal
  openUpgradesBtn: document.getElementById('openUpgradesBtn'),
  closeUpgradesBtn: document.getElementById('closeUpgradesBtn'),
  upgradesModal: document.getElementById('upgradesModal'),
  upgradesModalContent: document.getElementById('upgradesModalContent'),
  energyUpgradeCostDisplay: document.getElementById('energyUpgradeCostDisplay'),
  tapUpgradeCostDisplay: document.getElementById('tapUpgradeCostDisplay'),
  
  // Profile Elements
  profileAvatar: document.getElementById('profileAvatar'),
  profileUsername: document.getElementById('profileUsername'),
  profileIdContainer: document.getElementById('profileIdContainer'),
  profileId: document.getElementById('profileId'),
  copyTooltip: document.getElementById('copyTooltip'),
  profileRegDate: document.getElementById('profileRegDate'),
  profileRank: document.getElementById('profileRank'),
  profileBalanceDisplay: document.getElementById('profileBalanceDisplay'),
  profileStatPPH: document.getElementById('profileStatPPH'),
  profileStatEarned: document.getElementById('profileStatEarned'),
  profileStatTap: document.getElementById('profileStatTap'),
  profileStatEnergy: document.getElementById('profileStatEnergy'),
  headerAvatar: document.getElementById('headerAvatar'),
  playerName: document.getElementById('playerName'),
  playerRank: document.getElementById('playerRank'),
  
  btnWithdraw: document.getElementById('btnWithdraw'),
  btnTxHistory: document.getElementById('btnTxHistory'),
  txHistoryModal: document.getElementById('txHistoryModal'),
  txHistoryModalContent: document.getElementById('txHistoryModalContent'),
  closeTxHistoryBtn: document.getElementById('closeTxHistoryBtn'),
  txHistoryList: document.getElementById('txHistoryList'),

  openFaqModalBtn: document.getElementById('openFaqModalBtn'),
  faqModal: document.getElementById('faqModal'),
  faqModalContent: document.getElementById('faqModalContent'),
  closeFaqBtn: document.getElementById('closeFaqBtn'),
  openAdminPanelBtn: document.getElementById('openAdminPanelBtn'),
  withdrawModal: document.getElementById('withdrawModal'),
  withdrawModalContent: document.getElementById('withdrawModalContent'),
  closeWithdrawBtn: document.getElementById('closeWithdrawBtn'),
  withdrawAvailableDisplay: document.getElementById('withdrawAvailableDisplay'),
  withdrawNetworks: document.querySelectorAll('.network-btn'),
  withdrawAddress: document.getElementById('withdrawAddress'),
  withdrawAmount: document.getElementById('withdrawAmount'),
  withdrawMaxBtn: document.getElementById('withdrawMaxBtn'),
  btnSubmitWithdraw: document.getElementById('btnSubmitWithdraw'),
  
  // Promo Modal
  openPromoModalBtn: document.getElementById('openPromoModalBtn'),
  promoModal: document.getElementById('promoModal'),
  promoModalContent: document.getElementById('promoModalContent'),
  closePromoBtn: document.getElementById('closePromoBtn'),
  promoInput: document.getElementById('promoInput'),
  btnPromoSubmit: document.getElementById('btnPromoSubmit'),
  
  // Friends Modal
  btnShowFriends: document.getElementById('btnShowFriends'),
  friendsModal: document.getElementById('friendsModal'),
  friendsModalContent: document.getElementById('friendsModalContent'),
  closeFriendsBtn: document.getElementById('closeFriendsBtn'),
  
  btnBuyEnergy: document.getElementById('btnBuyEnergy'),
  btnBuyTap: document.getElementById('btnBuyTap'),
  
  // Level Up
  levelUpNotification: document.getElementById('levelUpNotification'),
  levelUpName: document.getElementById('levelUpName')
};

// --- Telegram Mock / Init ---
function initTelegramData() {
  const tg = window.Telegram?.WebApp;
  let user = tg?.initDataUnsafe?.user;
  
  if (!user) {
    user = {
      id: 123456789,
      first_name: "Tether",
      last_name: "Whale",
      username: "tether_whale",
      photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Whale"
    };
  }

  state.userId = user.id;

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(' ') || user.username || "User";
  const displayUsername = user.username ? `@${user.username}` : fullName;
  const avatarUrl = user.photo_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`;

  if (els.profileUsername) els.profileUsername.innerText = displayUsername;
  if (els.playerName) els.playerName.innerText = displayUsername;
  if (els.profileId) els.profileId.innerText = user.id;
  if (els.headerAvatar) els.headerAvatar.src = avatarUrl;
  if (els.profileAvatar) els.profileAvatar.src = avatarUrl;
  
  if (els.openAdminPanelBtn) {
    if (ADMIN_IDS.includes(state.userId)) {
      els.openAdminPanelBtn.classList.remove('hidden');
      els.openAdminPanelBtn.classList.add('flex');
    } else {
      els.openAdminPanelBtn.classList.add('hidden');
      els.openAdminPanelBtn.classList.remove('flex');
    }
  }
  
  const d = new Date();
  d.setDate(d.getDate() - (user.id % 100) - 10); 
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  if (els.profileRegDate) els.profileRegDate.innerText = `В игре с ${d.toLocaleDateString('ru-RU', options)}`;
  
  if (tg) tg.expand();
}

// --- Background Animations ---
function initBackgroundAnimations() {
  // 1. Старые 2D частицы (фон)
  if (els.bgAnimations) {
    const symbols = ['₮', '💎', '🚀', '✨', '🪙', '📈'];
    setInterval(() => {
      if (document.hidden) return;
      const p = document.createElement('div');
      p.className = 'bg-particle';
      p.innerText = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.left = Math.random() * 100 + 'vw';
      const duration = Math.random() * 6 + 4; 
      p.style.animationDuration = duration + 's';
      const size = Math.random() * 1.5 + 1;
      p.style.fontSize = size + 'rem';
      p.style.setProperty('--max-opacity', Math.random() * 0.15 + 0.05);
      els.bgAnimations.appendChild(p);
      setTimeout(() => p.remove(), duration * 1000);
    }, 400);
  }

  // 2. Новые сочные 3D монеты на фоне (Three.js)
  const container = document.getElementById('three-bg');
  if (!container || !window.THREE) return;

  if (container.hasChildNodes()) container.innerHTML = '';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  const dirLight1 = new THREE.DirectionalLight(0x34d399, 2.5); // Изумрудный свет
  dirLight1.position.set(5, 5, 5);
  scene.add(dirLight1);

  const dirLight2 = new THREE.DirectionalLight(0xfbbf24, 2); // Золотой свет
  dirLight2.position.set(-5, 0, 5);
  scene.add(dirLight2);

  const dirLight3 = new THREE.DirectionalLight(0x8b5cf6, 1.5); // Фиолетовый
  dirLight3.position.set(0, -5, 2);
  scene.add(dirLight3);

  const coins = [];
  const geometry = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 32);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0xfbbf24, 
    metalness: 0.85, 
    roughness: 0.15 
  });

  for (let i = 0; i < 20; i++) {
    const coin = new THREE.Mesh(geometry, material);
    coin.position.x = (Math.random() - 0.5) * 20;
    coin.position.y = (Math.random() - 0.5) * 30;
    coin.position.z = (Math.random() - 0.5) * 15 - 5;
    
    coin.rotation.x = Math.random() * Math.PI;
    coin.rotation.y = Math.random() * Math.PI;
    
    coin.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.04,
      rotSpeedY: (Math.random() - 0.5) * 0.04,
      floatSpeed: Math.random() * 0.02 + 0.01
    };
    
    scene.add(coin);
    coins.push(coin);
  }

  camera.position.z = 12;

  function animate() {
    requestAnimationFrame(animate);
    coins.forEach(coin => {
      coin.rotation.x += coin.userData.rotSpeedX;
      coin.rotation.y += coin.userData.rotSpeedY;
      coin.position.y += coin.userData.floatSpeed;
      
      if (coin.position.y > 15) {
        coin.position.y = -15;
        coin.position.x = (Math.random() - 0.5) * 20;
      }
    });
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// --- Logic ---
// --- Custom Toast Notifications (Replaces alert) ---
window.showToast = function(message, type) {
  if (!type) {
    const msgLow = String(message).toLowerCase();
    if (String(message).includes('❌') || msgLow.includes('ошибка') || msgLow.includes('недостаточно') || msgLow.includes('отказано') || msgLow.includes('введите') || msgLow.includes('исчерпан')) {
      type = 'error';
    } else if (String(message).includes('✅') || String(message).includes('🎉') || msgLow.includes('успешно') || msgLow.includes('активирован')) {
      type = 'success';
    } else {
      type = 'warning';
    }
  }

  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] flex flex-col gap-2 pointer-events-none w-[90%] max-w-sm';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  
  let bgClass, iconHtml;
  if (type === 'error') {
    bgClass = 'bg-red-500/20 border-red-500/40 text-red-50 shadow-[0_10px_30px_rgba(239,68,68,0.3)]';
    iconHtml = '<i class="fa-solid fa-circle-exclamation text-red-400 text-xl"></i>';
  } else if (type === 'success') {
    bgClass = 'bg-emerald-500/20 border-emerald-500/40 text-emerald-50 shadow-[0_10px_30px_rgba(16,185,129,0.3)]';
    iconHtml = '<i class="fa-solid fa-circle-check text-emerald-400 text-xl"></i>';
  } else {
    bgClass = 'bg-yellow-500/20 border-yellow-500/40 text-yellow-50 shadow-[0_10px_30px_rgba(234,179,8,0.3)]';
    iconHtml = '<i class="fa-solid fa-triangle-exclamation text-yellow-400 text-xl"></i>';
  }

  const formattedMessage = String(message).split(String.fromCharCode(10)).join('<br>');

  toast.className = `backdrop-blur-2xl border p-3.5 rounded-[1.25rem] flex items-center gap-3 transform -translate-y-10 scale-95 opacity-0 transition-all duration-500 ${bgClass}`;
  toast.style.transitionTimingFunction = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  
  toast.innerHTML = `
    <div class="shrink-0 drop-shadow-md bg-black/20 w-10 h-10 rounded-xl flex items-center justify-center border border-white/10">
       ${iconHtml}
    </div>
    <div class="text-[11px] font-bold leading-snug drop-shadow-sm flex-1">
       ${formattedMessage}
    </div>
  `;

  container.appendChild(toast);

  if (type === 'error' && navigator.vibrate) navigator.vibrate([20, 50, 20]);
  if (type === 'success' && navigator.vibrate) navigator.vibrate([50, 100, 50]);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0) scale(1)';
      toast.style.opacity = '1';
    });
  });

  setTimeout(() => {
    toast.style.transform = 'translateY(-20px) scale(0.9)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 500);
  }, 3500);
};

window.alert = window.showToast;

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(3) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(3) + 'K';
  return num.toFixed(4); 
}

function getUpgradeCost(id) {
  const u = UPGRADES_DB.find(x => x.id === id);
  if (!u) return 0;
  const base = u.baseCost;
  const level = state.upgrades[id] || 0;
  return Number((base * Math.pow(1.5, level)).toFixed(4));
}

// Прогрессивный рост прибыли
function getUpgradePPH(id) {
  const u = UPGRADES_DB.find(x => x.id === id);
  if (!u) return 0;
  const base = u.basePPH;
  const level = state.upgrades[id] || 0;
  let total = 0;
  for (let i = 0; i < level; i++) {
    total += base * Math.pow(1.15, i); 
  }
  return Number(total.toFixed(4));
}

function getUpgradePPHIncrease(id) {
  const currentPPH = state.upgrades[id] ? getUpgradePPH(id) : 0;
  const lvl = state.upgrades[id] || 0;
  state.upgrades[id] = lvl + 1;
  const nextPPH = getUpgradePPH(id);
  state.upgrades[id] = lvl; 
  return Number((nextPPH - currentPPH).toFixed(4));
}

function calculateTotalPPH() {
  let total = 0;
  for (const [id, level] of Object.entries(state.upgrades)) {
    if (level > 0) total += getUpgradePPH(id);
  }
  state.profitPerHour = Number(total.toFixed(4));
}

function createConfetti() {
  const colors = ['#fde047', '#34d399', '#60a5fa', '#f87171', '#c084fc'];
  for(let i=0; i<40; i++) {
    const p = document.createElement('div');
    p.style.position = 'fixed';
    p.style.left = '50%';
    p.style.top = '15%';
    p.style.width = '10px';
    p.style.height = '10px';
    p.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    p.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    p.style.zIndex = '1000';
    p.style.pointerEvents = 'none';
    p.style.transition = 'transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 1s';
    
    const tx = (Math.random() - 0.5) * 400;
    const ty = (Math.random() - 0.5) * 400;
    const rot = Math.random() * 360;
    
    document.body.appendChild(p);
    void p.offsetWidth; 
    p.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${Math.random() + 0.5})`;
    p.style.opacity = '0';
    
    setTimeout(() => p.remove(), 1000);
  }
}

function renderCoinDesign(idx) {
   const level = LEVELS[idx];
   if (!level) return;
   
   const rim = document.getElementById('coinRim');
   const inner = document.getElementById('coinInner');
   const symbol = document.getElementById('coinSymbol');
   const outerRim = document.getElementById('coinOuterRim');
   const outerGlow = document.getElementById('coinOuterGlow');

   if (rim && inner && symbol) {
     rim.className = `w-48 h-48 rounded-full bg-gradient-to-br p-[5px] shadow-[0_30px_60px_rgba(0,0,0,0.8),inset_0_8px_20px_rgba(255,255,255,0.6)] relative border-b-[8px] border-r-[4px] transition-colors duration-1000 ${level.rimClass}`;
     inner.className = `w-full h-full rounded-full flex items-center justify-center shadow-[inset_0_-15px_30px_rgba(0,0,0,0.8),inset_0_15px_25px_rgba(255,255,255,0.4)] relative overflow-hidden transition-colors duration-1000 ${level.innerClass}`;
     symbol.innerHTML = level.symbolHtml;
   }

   if (outerRim && outerGlow) {
     outerRim.className = `absolute inset-2 rounded-full blur-[50px] pulse-glow pointer-events-none transition-colors duration-1000 ${level.glow1}`;
     outerGlow.className = `absolute inset-4 rounded-full blur-[30px] pulse-glow pointer-events-none transition-colors duration-1000 ${level.glow2}`;
   }
}

function showLevelUpNotification(levelInfo) {
  if(!els.levelUpNotification || !els.levelUpName) return;
  els.levelUpName.innerText = `${levelInfo.name} ${levelInfo.emoji}`;
  
  els.levelUpNotification.classList.remove('opacity-0', '-translate-y-10', 'scale-90', 'pointer-events-none');
  els.levelUpNotification.classList.add('opacity-100', 'translate-y-0', 'scale-100');
  
  if(navigator.vibrate) navigator.vibrate([50, 100, 50, 100, 50]);
  createConfetti();

  setTimeout(() => {
    els.levelUpNotification.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
    els.levelUpNotification.classList.add('opacity-0', '-translate-y-10', 'scale-90', 'pointer-events-none');
  }, 3500);
}

function updateLevelStatus() {
  let newLevelIdx = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (state.totalEarned >= LEVELS[i].threshold) newLevelIdx = i;
    else break;
  }
  
  if (state.currentLevelIdx !== newLevelIdx && state.totalEarned > 0) {
    if (newLevelIdx > state.currentLevelIdx) {
       showLevelUpNotification(LEVELS[newLevelIdx]);
    }
    state.currentLevelIdx = newLevelIdx;
    renderCoinDesign(newLevelIdx);
  }
  
  const baseTap = Number(((newLevelIdx + 1) * 0.0001).toFixed(4));
  state.tapValue = Number((baseTap + (state.extraTap || 0)).toFixed(4));
  state.maxEnergy = CONFIG.baseMaxEnergy + (state.extraMaxEnergy || 0);
  
  const currentLevelInfo = LEVELS[newLevelIdx];
  const nextLevelInfo = LEVELS[newLevelIdx + 1];
  
  if (els.playerRank) els.playerRank.innerText = `${currentLevelInfo.name} ${currentLevelInfo.emoji}`;
  if (els.profileRank) els.profileRank.innerText = `${currentLevelInfo.name} ${currentLevelInfo.emoji}`;
  
  if (nextLevelInfo) {
    const progress = (state.totalEarned - currentLevelInfo.threshold) / (nextLevelInfo.threshold - currentLevelInfo.threshold) * 100;
    if (els.levelProgress) els.levelProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  } else {
    if (els.levelProgress) els.levelProgress.style.width = '100%';
  }
}

function updateUI() {
  els.balance.innerText = formatNumber(state.balance);
    if (els.profileBalanceDisplay) els.profileBalanceDisplay.innerText = formatNumber(state.balance);
  els.pph.innerText = formatNumber(state.profitPerHour);
  els.tapValue.innerText = `+${formatNumber(state.tapValue)}`;
  if (els.profileStatPPH) els.profileStatPPH.innerText = formatNumber(state.profitPerHour);
  if (els.profileStatEarned) els.profileStatEarned.innerText = formatNumber(state.totalEarned);
  if (els.profileStatTap) els.profileStatTap.innerText = formatNumber(state.tapValue);
  if (els.profileStatEnergy) els.profileStatEnergy.innerText = state.maxEnergy;
  
  els.energy.innerText = Math.floor(state.energy);
  els.maxEnergy.innerText = state.maxEnergy;
  els.energyBar.style.width = `${(state.energy / state.maxEnergy) * 100}%`;
  
  if (els.boostCostDisplay) els.boostCostDisplay.innerText = `${getBoostCost().toFixed(2)} ₮`;
  if (els.energyUpgradeCostDisplay) els.energyUpgradeCostDisplay.innerText = `${getEnergyUpgradeCost().toFixed(2)} ₮`;
  if (els.tapUpgradeCostDisplay) els.tapUpgradeCostDisplay.innerText = `${getTapUpgradeCost().toFixed(2)} ₮`;
  
  updateLevelStatus();
  renderUpgrades();
}

function handleTap(e, clientX, clientY) {
  if (state.energy >= 1) {
    state.balance = Number((state.balance + state.tapValue).toFixed(6));
    state.totalEarned = Number((state.totalEarned + state.tapValue).toFixed(6));
    state.energy -= 1;
    
    if (navigator.vibrate) navigator.vibrate(10);
    
    let x = clientX; let y = clientY;
    if (x === undefined || y === undefined) {
      const rect = els.clickArea.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    showFloatingNumberAndParticles(x, y);
    
    if (els.balanceContainer) {
      els.balanceContainer.style.transform = 'scale(1.1)';
      els.balanceContainer.style.color = '#6ee7b7';
      setTimeout(() => {
        els.balanceContainer.style.transform = 'scale(1)';
        els.balanceContainer.style.color = '';
      }, 150);
    }

    els.balance.innerText = formatNumber(state.balance);
    if (els.profileBalanceDisplay) els.profileBalanceDisplay.innerText = formatNumber(state.balance);
    els.energy.innerText = Math.floor(state.energy);
    els.energyBar.style.width = `${(state.energy / state.maxEnergy) * 100}%`;
  } else {
    els.energyBar.parentElement.style.borderColor = '#ef4444';
    setTimeout(() => els.energyBar.parentElement.style.borderColor = '', 200);
  }
}

function showFloatingNumberAndParticles(x, y) {
  const num = document.createElement('div');
  num.className = 'floating-number !text-emerald-300'; 
  num.innerText = `+${formatNumber(state.tapValue)}`;
  const offsetX = (Math.random() - 0.5) * 40;
  num.style.left = `${x + offsetX}px`;
  num.style.top = `${y - 40}px`;
  document.body.appendChild(num);
  setTimeout(() => num.remove(), 1000);

  // Сочные 3D-монетки при клике (Фонтан)
  for (let i = 0; i < 5; i++) {
    const p = document.createElement('div');
    p.className = 'tap-coin-particle flex items-center justify-center font-black';
    
    // Разные виды монеток/искр для разнообразия
    const isCoin = Math.random() > 0.3;
    if (isCoin) {
      p.innerHTML = '<div class="w-7 h-7 bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 rounded-full border-[1.5px] border-yellow-200 shadow-[0_5px_15px_rgba(251,191,36,0.8),inset_0_2px_5px_rgba(255,255,255,0.8)] flex items-center justify-center text-[11px] text-yellow-900 drop-shadow-sm">₮</div>';
    } else {
      p.innerText = '✨';
      p.style.fontSize = '1.3rem';
      p.style.textShadow = '0 0 15px rgba(52,211,153, 0.9)';
    }
    
    p.style.left = `${x - 14}px`;
    p.style.top = `${y - 14}px`;
    
    // Случайные векторы для фонтана
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 80 + 50;
    const tx = Math.cos(angle) * velocity;
    const tyPeak = -Math.random() * 120 - 60; // Подпрыгивание вверх
    const tyEnd = tyPeak + Math.random() * 180 + 80; // Падение вниз
    
    p.style.setProperty('--tx', `${tx}px`);
    p.style.setProperty('--ty-peak', `${tyPeak}px`);
    p.style.setProperty('--ty-end', `${tyEnd}px`);
    
    // Случайное вращение в 3D пространстве
    p.style.setProperty('--rotX', `${Math.random() * 720}deg`);
    p.style.setProperty('--rotY', `${Math.random() * 720}deg`);
    p.style.setProperty('--rotZ', `${Math.random() * 360}deg`);
    
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 1000);
  }
}

function handleCoinTilt(clientX, clientY) {
  const rect = els.clickArea.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const tiltX = (clientY - centerY) / (rect.height / 2);
  const tiltY = (clientX - centerX) / (rect.width / 2);
  
  const maxTilt = 28; // Увеличили угол для 3D глубины
  const innerCoin = els.clickArea.querySelector('#coinRim');
  const glare = els.clickArea.querySelector('#coinGlare');
  
  if (innerCoin) {
    innerCoin.style.transition = 'none'; 
    innerCoin.style.transform = `perspective(1000px) rotateX(${-tiltX * maxTilt}deg) rotateY(${tiltY * maxTilt}deg) scale3d(0.95, 0.95, 0.95)`;
  }
  
  if (glare) {
    const glareX = 50 + (tiltY * 50);
    const glareY = 50 + (tiltX * 50);
    glare.style.opacity = '1';
    glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.7) 0%, transparent 60%)`;
  }
}

function resetCoinTilt() {
  const innerCoin = els.clickArea.querySelector('#coinRim');
  const glare = els.clickArea.querySelector('#coinGlare');
  if (innerCoin) {
    innerCoin.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'; 
    innerCoin.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  }
  if (glare) {
    glare.style.opacity = '0';
  }
}

// Рендер вкладок категорий (Прокачка)
window.renderMineTabs = function() {
  const container = els.mineCategoriesTabs;
  if (!container) return;
  
  const keys = Object.keys(CATEGORY_NAMES);
  if (keys.length > 0 && !keys.includes(state.currentMineCategory)) {
     state.currentMineCategory = keys[0];
  }
  
  container.innerHTML = keys.map(k => {
    const isActive = state.currentMineCategory === k;
    const activeClasses = isActive ? 'bg-white/10 text-white border-white/20' : 'bg-black/40 text-gray-500 border-white/5';
    return `<button class="mine-tab-btn px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-xl border transition-all whitespace-nowrap ${activeClasses}" data-category="${k}">${CATEGORY_NAMES[k]}</button>`;
  }).join('');
  
  container.querySelectorAll('.mine-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
       state.currentMineCategory = e.currentTarget.dataset.category;
       renderMineTabs(); 
       if(els.upgradesContainer) els.upgradesContainer.dataset.renderedCat = '';
       renderUpgrades();
    });
  });
};

function renderUpgrades() {
  const currentCat = state.currentMineCategory;
  if (!currentCat) return; 
  
  const filteredUpgrades = UPGRADES_DB.filter(u => u.category === currentCat);

  if (els.upgradesContainer.dataset.renderedCat !== currentCat) {
    els.upgradesContainer.dataset.renderedCat = currentCat;
    if (filteredUpgrades.length === 0) {
      els.upgradesContainer.innerHTML = '<div class="col-span-2 text-center text-gray-500 text-xs py-8">В этой категории пока нет карточек</div>';
    } else {
      els.upgradesContainer.innerHTML = filteredUpgrades.map(u => `
        <div class="bg-gradient-to-br from-white/10 to-white/5 rounded-[1.25rem] p-2.5 border border-white/10 flex flex-col justify-between transition-transform elastic-btn backdrop-blur-md shadow-sm" id="card-${u.id}">
          <div class="flex gap-2 items-start mb-2">
            <div class="w-8 h-8 bg-black/40 rounded-[0.8rem] flex items-center justify-center text-[15px] shrink-0 border border-white/10 shadow-inner">
              ${u.icon}
            </div>
            <div>
              <div class="text-[7px] text-emerald-400/80 font-bold uppercase tracking-wider">${CATEGORY_NAMES[u.category] || u.category || 'Новое'}</div>
              <div class="font-extrabold text-[10px] leading-tight text-white mt-0.5 drop-shadow-sm">${u.name}</div>
            </div>
          </div>
          
          <div class="mb-2.5 text-[9px] flex justify-between items-center bg-black/30 p-1.5 rounded-lg border border-white/5">
            <span class="text-gray-400 font-medium text-[8px] uppercase tracking-wider">В час</span>
            <span class="text-emerald-400 font-bold flex items-center gap-1 text-[9px]">
              <span class="text-emerald-400 font-bold text-[8px]">₮</span> +<span class="upgrade-inc-val" data-id="${u.id}">0</span>
            </span>
          </div>
          
          <div class="flex justify-between items-center pt-1.5 border-t border-white/10">
            <div class="text-[9px] font-bold text-gray-500 uppercase tracking-wider">lvl <span class="upgrade-lvl text-gray-300" data-id="${u.id}">0</span></div>
            <button class="upgrade-btn flex items-center gap-1 bg-gradient-to-r from-emerald-500 to-teal-500 px-2.5 py-1 rounded-full text-[9px] font-bold shadow-[0_2px_10px_rgba(52,211,153,0.3)] disabled:opacity-50 disabled:from-gray-700 disabled:to-gray-800 disabled:text-gray-500 disabled:shadow-none text-black" data-id="${u.id}">
              <span class="font-bold text-[8px]">₮</span>
              <span class="upgrade-cost-val" data-id="${u.id}">0</span>
            </button>
          </div>
        </div>
      `).join('');
      
      document.querySelectorAll('.upgrade-btn').forEach(btn => {
        btn.addEventListener('click', () => buyUpgrade(btn.dataset.id));
      });
    }
  }
  
  filteredUpgrades.forEach(u => {
    const cost = getUpgradeCost(u.id);
    const inc = getUpgradePPHIncrease(u.id);
    const lvl = state.upgrades[u.id] || 0;
    
    const lvlEl = document.querySelector(`.upgrade-lvl[data-id="${u.id}"]`);
    if(lvlEl) lvlEl.innerText = lvl;
    
    const incEl = document.querySelector(`.upgrade-inc-val[data-id="${u.id}"]`);
    if(incEl) incEl.innerText = formatNumber(inc);
    
    const costEl = document.querySelector(`.upgrade-cost-val[data-id="${u.id}"]`);
    if(costEl) costEl.innerText = formatNumber(cost);
    
    const btn = document.querySelector(`.upgrade-btn[data-id="${u.id}"]`);
    if(btn) btn.disabled = state.balance < cost;
  });
}

function buyUpgrade(id) {
  const cost = getUpgradeCost(id);
  if (state.balance >= cost) {
    state.balance = Number((state.balance - cost).toFixed(6));
    state.upgrades[id] = (state.upgrades[id] || 0) + 1;
    calculateTotalPPH();
    updateUI();
    saveState();
    
    const card = document.getElementById(`card-${id}`);
    if (card) {
      card.classList.remove('purchase-anim');
      void card.offsetWidth; 
      card.classList.add('purchase-anim');
      if (navigator.vibrate) navigator.vibrate([15, 30, 15]);
    }
  }
}

function calculateOfflineProfit() {
  const now = Date.now();
  const diffMs = now - state.lastSync;
  const diffHours = diffMs / (1000 * 60 * 60);
  
  if (state.profitPerHour > 0 && diffHours > 0.05) { 
    const effectiveHours = Math.min(diffHours, CONFIG.maxOfflineHours);
    const earned = Number((state.profitPerHour * effectiveHours).toFixed(6));
    
    if (earned > 0) {
      state.balance = Number((state.balance + earned).toFixed(6));
      state.totalEarned = Number((state.totalEarned + earned).toFixed(6));
      
      els.offlineProfitDisplay.innerText = formatNumber(earned);
      els.offlineModal.classList.remove('hidden');
      els.offlineModal.classList.add('flex');
      
      setTimeout(() => {
        document.getElementById('offlineModalContent').classList.remove('scale-95');
        document.getElementById('offlineModalContent').classList.add('scale-100');
      }, 10);
    }
  }
  state.lastSync = now;
}

// --- User Tasks Logic ---
window.renderTaskTabs = function() {
  const container = document.getElementById('tasksCategoriesTabs');
  if (!container) return;

  const keys = Object.keys(TASK_CATEGORIES);
  if (keys.length > 0 && !keys.includes(state.currentTaskCategory)) {
     state.currentTaskCategory = keys[0];
  }

  container.innerHTML = keys.map(k => {
    const isActive = state.currentTaskCategory === k;
    const activeClasses = isActive ? 'bg-white/10 text-white border-white/20' : 'bg-black/40 text-gray-500 border-white/5';
    return `<button class="task-tab-btn px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-xl border transition-all whitespace-nowrap ${activeClasses}" data-category="${k}">${TASK_CATEGORIES[k]}</button>`;
  }).join('');

  container.querySelectorAll('.task-tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
       state.currentTaskCategory = e.currentTarget.dataset.category;
       renderTaskTabs();
       renderUserTasks();
    });
  });
};

window.renderUserTasks = function() {
  const container = document.getElementById('userTasksContainer');
  if(!container) return;

  const filteredTasks = TASKS_DB.filter(t => t.category === state.currentTaskCategory);

  if (filteredTasks.length === 0) {
    container.innerHTML = '<div class="text-center text-gray-500 text-xs py-8">В этой категории пока нет заданий</div>';
    return;
  }

  container.innerHTML = filteredTasks.map(t => {
    const isCompleted = state.completedTasks?.includes(t.id);
    const isExhausted = !isCompleted && t.maxCompletions > 0 && (t.completionsCount || 0) >= t.maxCompletions;
    const borderClass = isCompleted ? 'border-emerald-500/30 bg-emerald-500/5' : (isExhausted ? 'border-red-500/30 bg-red-500/5 opacity-60' : 'border-white/10');
    const titleClass = (isCompleted || isExhausted) ? 'line-through text-gray-500' : '';
    const rewardClass = isCompleted || isExhausted ? 'text-gray-500' : '';
    
    let actionHtml = '';
    if (isCompleted) {
      actionHtml = `<div class="w-8 h-8 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-[10px]"><i class="fa-solid fa-check"></i></div>`;
    } else if (isExhausted) {
      actionHtml = `<div class="text-[9px] text-red-400 font-bold uppercase tracking-wider bg-red-500/10 px-2 py-1 rounded-lg">Лимит</div>`;
    } else {
      const isPending = state.pendingTasks && state.pendingTasks[t.id];
      if (isPending) {
        actionHtml = `<button class="task-go-btn bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-3 py-1.5 rounded-xl text-[9px] font-bold shadow-sm border border-blue-500/30 transition-colors elastic-btn" data-id="${t.id}">Проверить</button>`;
      } else {
        actionHtml = `<button class="task-go-btn bg-white/10 hover:bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-xl text-[9px] font-bold shadow-sm border border-emerald-500/30 transition-colors elastic-btn" data-id="${t.id}">Go</button>`;
      }
    }

    return `
      <div class="bg-gradient-to-br from-white/10 to-white/5 p-2.5 rounded-[1.25rem] flex items-center justify-between border ${borderClass} shadow-md backdrop-blur-md transition-all">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-[0.8rem] ${t.bg || 'bg-white/5'} border border-white/5 flex items-center justify-center text-[15px] shadow-inner shrink-0 ${isExhausted ? 'grayscale opacity-50' : ''}">
            <i class="fa-brands ${t.icon} ${t.iconColor || 'text-white'} drop-shadow-md"></i>
          </div>
          <div>
            <div class="font-bold text-[10px] text-white leading-tight ${titleClass}">${t.title}</div>
            <div class="text-emerald-400 text-[9px] font-black mt-0.5 flex items-center gap-1">
              <span class="${rewardClass}">+${formatNumber(t.reward)} ₮</span>
            </div>
          </div>
        </div>
        ${actionHtml}
      </div>
    `;
  }).join('');

  document.querySelectorAll('.task-go-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      completeTask(e.currentTarget.dataset.id);
    });
  });
};

function completeTask(id) {
  if(!state.completedTasks) state.completedTasks = [];
  if(state.completedTasks.includes(id)) return;

  const task = TASKS_DB.find(t => t.id === id);
  if(task) {
    if (task.maxCompletions > 0 && (task.completionsCount || 0) >= task.maxCompletions) {
       alert('Лимит активаций для этого задания исчерпан!');
       renderUserTasks();
       return;
    }

    // Шаг 1: Если задание еще не в режиме "Проверки", переводим его в этот режим
    if (!state.pendingTasks || !state.pendingTasks[id]) {
      if(!state.pendingTasks) state.pendingTasks = {};
      
      // Открываем ссылку, если она есть
      if (task.link) {
        const tg = window.Telegram?.WebApp;
        if (task.link.includes('t.me') && tg?.openTelegramLink) {
          tg.openTelegramLink(task.link);
        } else {
          window.open(task.link, '_blank');
        }
      }
      
      state.pendingTasks[id] = Date.now();
      saveState();
      renderUserTasks();
      return;
    }

    // Шаг 2: Пользователь нажал "Проверить"
    const btn = document.querySelector(`.task-go-btn[data-id="${id}"]`);
    if(btn) {
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      btn.disabled = true;
      
      // Для заданий с Telegram (t.me) симулируем более долгую проверку подписки сервером
      const isTgTask = task.link && task.link.includes('t.me');
      const checkDelay = isTgTask ? 2500 : 1000;
      
      setTimeout(() => {
        state.balance = Number((state.balance + task.reward).toFixed(6));
        state.totalEarned = Number((state.totalEarned + task.reward).toFixed(6));
        state.completedTasks.push(id);
        if (state.pendingTasks) delete state.pendingTasks[id];
        task.completionsCount = (task.completionsCount || 0) + 1;
        
        saveState();
        updateUI();
        renderUserTasks();
        if(AdminPanel.renderTasks) AdminPanel.renderTasks();
        if(navigator.vibrate) navigator.vibrate([20, 50, 20]);
        
        const rect = btn.getBoundingClientRect();
        showFloatingNumberAndParticles(rect.left, rect.top);
      }, checkDelay);
    }
  }
}

function updateDailyRewardUI() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const desc = document.getElementById('dailyRewardDesc');
  const btn = document.getElementById('dailyRewardBtn');
  if (!desc || !btn) return;
  
  if (state.lastDaily === today) {
    desc.innerText = 'Награда получена! Ждем завтра 🌙';
    desc.classList.remove('text-yellow-400');
    desc.classList.add('text-gray-500');
    btn.classList.add('opacity-50', 'grayscale');
  } else {
    desc.innerText = 'Забирай монеты каждый день!';
    desc.classList.add('text-yellow-400');
    desc.classList.remove('text-gray-500');
    btn.classList.remove('opacity-50', 'grayscale');
  }
}

document.getElementById('dailyRewardBtn')?.addEventListener('click', (e) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  if (state.lastDaily === today) {
    return; 
  }
  
  const btn = e.currentTarget;
  btn.classList.add('purchase-anim');
  setTimeout(() => btn.classList.remove('purchase-anim'), 500);
  
  state.lastDaily = today;
  const reward = Number((5.0 * (state.currentLevelIdx + 1)).toFixed(6)); 
  state.balance = Number((state.balance + reward).toFixed(6));
  state.totalEarned = Number((state.totalEarned + reward).toFixed(6));
  
  saveState();
  updateUI();
  updateDailyRewardUI();
  
  if(navigator.vibrate) navigator.vibrate([50, 100, 50]);
  
  const rect = btn.getBoundingClientRect();
  showFloatingNumberAndParticles(rect.left + rect.width / 2, rect.top + rect.height / 2);
});

// ==========================================
// Admin Dashboard Logic (Neo-Glassmorphism)
// ==========================================

const AdminPanel = {
  els: {
    dashboard: document.getElementById('adminDashboard'),
    closeBtn: document.getElementById('closeAdminDashboardBtn'),
    navTabs: document.querySelectorAll('.admin-tab-btn'),
    views: document.querySelectorAll('.admin-view'),
    
    // Stats
    statTotalUsers: document.getElementById('stat-total-users'),
    statActiveUsers: document.getElementById('stat-active-users'),
    statTotalBalance: document.getElementById('stat-total-balance'),
    statTotalPaid: document.getElementById('stat-total-paid'),
    recentActivity: document.getElementById('admin-recent-activity'),
    
    // Users
    usersList: document.getElementById('admin-users-list'),
    searchInput: document.getElementById('adminSearchUser'),
    
    // Tasks & Promos & Cards
    tasksList: document.getElementById('admin-tasks-list'),
    promosList: document.getElementById('admin-promocodes-list'),
    cardsList: document.getElementById('admin-cards-list'),
    categoriesList: document.getElementById('admin-categories-list'),
    btnAddCard: document.getElementById('adminBtnAddCard'),
    btnAddCategory: document.getElementById('adminBtnAddCategory'),
    btnAddPromo: document.getElementById('adminBtnAddPromo'),
    
    // Finance
    financeList: document.getElementById('admin-finance-list'),

    
    // Broadcast
    bcImage: document.getElementById('bcImage'),
    bcText: document.getElementById('bcText'),
    bcBtnText: document.getElementById('bcBtnText'),
    bcBtnUrl: document.getElementById('bcBtnUrl'),
    btnSendBroadcast: document.getElementById('adminBtnSendBroadcast')
  },
  
  mockData: {
    users: [
      { id: 123456789, name: 'Tether Whale', balance: 1500000.5, status: 'active', registered: '01.03.2024', profitPerHour: 12500, tapValue: 0.05, totalEarned: 2500000, referrals: 12, cardsCount: 24, tasksCount: 10 },
      { id: 987654321, name: 'Crypto King', balance: 500.12, status: 'active', registered: '10.03.2024', profitPerHour: 150, tapValue: 0.001, totalEarned: 600, referrals: 2, cardsCount: 3, tasksCount: 1 },
      { id: 555666777, name: 'Scammer123', balance: 0, status: 'banned', registered: '05.03.2024', profitPerHour: 0, tapValue: 0.0001, totalEarned: 10, referrals: 0, cardsCount: 0, tasksCount: 0 }
    ],
    promos: [
      { code: 'WHALE', reward: 50, current: 120, max: 500 }
    ],
    finance: [
      { id: 101, type: 'withdraw', user: 'Crypto King', userId: 987654321, amount: 15000, wallet: 'EQAwH...yowA', network: 'TON', status: 'pending' },
      { id: 102, type: 'withdraw', user: 'Tether Whale', userId: 123456789, amount: 5000, wallet: '0x123...abc', network: 'ERC20', status: 'approved' },
      { id: 103, type: 'withdraw', user: 'Scammer123', userId: 555666777, amount: 100000, wallet: 'Txxxx...zzzz', network: 'TRC20', status: 'rejected' }
    ],
    activity: [
      { text: '@Crypto_King подал заявку на вывод 15,000 ₮', time: '5 мин назад', icon: 'fa-arrow-right-arrow-left', color: 'text-orange-400' }
    ]
  },
  financeMode: 'withdraw',
  financeTab: 'pending',

  init() {
    if (!this.els.dashboard) return;
    
    this.els.closeBtn.addEventListener('click', () => {
      this.els.dashboard.classList.add('closing');
      setTimeout(() => {
        this.els.dashboard.classList.add('hidden');
        this.els.dashboard.classList.remove('flex', 'closing');
      }, 400);
    });

    this.els.navTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        this.els.navTabs.forEach(b => {
           b.classList.remove('active', 'bg-white/10', 'text-white', 'border-white/20');
           b.classList.add('text-gray-500', 'border-transparent');
        });
        this.els.views.forEach(v => { v.classList.remove('active'); v.classList.add('hidden'); });
        
        btn.classList.add('active', 'bg-white/10', 'text-white', 'border-white/20');
        btn.classList.remove('text-gray-500', 'border-transparent');
        const target = document.getElementById(btn.dataset.target);
        if (target) {
          target.classList.remove('hidden');
          target.classList.add('active');
          const items = target.querySelectorAll('.admin-stagger-item');
          items.forEach(item => {
             item.style.animation = 'none';
             void item.offsetWidth;
             item.style.animation = null;
          });
        }
      });
    });

    document.querySelectorAll('.admin-finance-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.admin-finance-tab-btn').forEach(b => {
          b.classList.remove('active', 'text-white', 'bg-white/10', 'shadow-sm');
          b.classList.add('text-gray-500');
        });
        const target = e.currentTarget;
        target.classList.remove('text-gray-500');
        target.classList.add('active', 'text-white', 'bg-white/10', 'shadow-sm');
        this.financeTab = target.dataset.tab;
        this.renderFinance();
      });
    });

    if (this.els.btnAddCategory) {
      this.els.btnAddCategory.addEventListener('click', () => {
        openAdminModal('adminCategoryModal', 'adminCategoryModalContent');
      });
    }

    if (this.els.btnAddPromo) {
      this.els.btnAddPromo.addEventListener('click', () => {
        openAdminModal('adminPromoModal', 'adminPromoModalContent');
      });
    }

    if (this.els.btnAddCard) {
      this.els.btnAddCard.addEventListener('click', () => {
        const select = document.getElementById('adminCardCategory');
        if(select) {
          select.innerHTML = Object.keys(CATEGORY_NAMES).map(k => `<option value="${k}" class="text-black">${CATEGORY_NAMES[k]}</option>`).join('');
        }
        openAdminModal('adminCardModal', 'adminCardModalContent');
      });
    }
    
    const btnAddTask = document.getElementById('adminBtnAddTask');
    if (btnAddTask) {
      btnAddTask.addEventListener('click', () => {
        const select = document.getElementById('adminTaskCategory');
        if(select) {
          select.innerHTML = Object.keys(TASK_CATEGORIES).map(k => `<option value="${k}" class="text-black">${TASK_CATEGORIES[k]}</option>`).join('');
        }
        openAdminModal('adminTaskModal', 'adminTaskModalContent');
      });
    }

    this.els.btnSendBroadcast.addEventListener('click', () => {
      if(!this.els.bcText.value) return alert('Введите текст сообщения!');
      alert('Рассылка запущена! (Демо)');
      this.els.bcText.value = '';
    });

    this.els.searchInput.addEventListener('input', (e) => this.renderUsers(e.target.value));

    this.renderStats();
    this.renderUsers();
    this.renderTasks();
    this.renderFinance();
    this.renderPromos();
    this.renderCategories();
    this.renderCards();
    
    // Инициализация первой вкладки
    const firstTab = this.els.navTabs[0];
    if (firstTab) {
       firstTab.classList.add('bg-white/10', 'text-white', 'border-white/20');
       firstTab.classList.remove('text-gray-500', 'border-transparent');
    }
  },

  open() {
    this.els.dashboard.classList.remove('hidden');
    this.els.dashboard.classList.add('flex');
    const activeView = this.els.dashboard.querySelector('.admin-view.active');
    if (activeView) {
       const items = activeView.querySelectorAll('.admin-stagger-item');
       items.forEach(item => {
          item.style.animation = 'none';
          void item.offsetWidth;
          item.style.animation = null;
       });
    }
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
  },

  animateValue(el, endVal) {
    if (!el) return;
    el.style.opacity = 0;
    el.style.transform = 'translateY(10px)';
    setTimeout(() => {
       el.innerText = endVal;
       el.style.transition = 'all 0.4s var(--spring)';
       el.style.opacity = 1;
       el.style.transform = 'translateY(0)';
    }, 50);
  },

  renderStats() {
    this.animateValue(this.els.statTotalUsers, '12,450');
    this.animateValue(this.els.statActiveUsers, '3,102');
    this.animateValue(this.els.statTotalBalance, '15.4M');
    this.animateValue(this.els.statTotalPaid, '1,240');
    
    this.els.recentActivity.innerHTML = this.mockData.activity.map((a, i) => `
      <div class="admin-stagger-item p-4 flex items-center gap-3" style="--delay: ${i * 0.08}s">
        <div class="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
          <i class="fa-solid ${a.icon} ${a.color} text-sm"></i>
        </div>
        <div>
          <div class="text-[10px] text-white font-bold leading-tight">${a.text}</div>
          <div class="text-[8px] text-gray-500 mt-0.5 uppercase tracking-widest font-bold">${a.time}</div>
        </div>
      </div>
    `).join('');
  },

  renderUsers(filter = '') {
    const f = filter.toLowerCase();
    const filtered = this.mockData.users.filter(u => u.name.toLowerCase().includes(f) || String(u.id).includes(f));
    this.els.usersList.innerHTML = filtered.map((u, i) => `
      <div class="admin-stagger-item bg-gradient-to-br from-white/10 to-white/5 p-3.5 rounded-[1.25rem] border ${u.status === 'banned' ? 'border-red-500/50 bg-red-500/5' : 'border-white/10'} flex justify-between items-center backdrop-blur-md shadow-sm" style="--delay: ${i * 0.05}s">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 bg-black/40 rounded-full flex items-center justify-center border border-white/10 text-gray-400 text-xs">
            <i class="fa-solid fa-user"></i>
          </div>
          <div>
            <div class="font-bold text-[11px] text-white flex items-center gap-1.5">
              ${u.name} ${u.status === 'banned' ? '<span class="bg-red-500 text-white text-[7px] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">Бан</span>' : ''}
            </div>
            <div class="text-[8px] text-emerald-400 font-bold mt-0.5 flex items-center gap-1">
              <span>ID: ${u.id}</span>
              <span class="text-gray-600">|</span>
              <span class="text-gray-400">Баланс: ${formatNumber(u.balance)} ₮</span>
            </div>
          </div>
        </div>
        <button class="w-7 h-7 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-gray-400 hover:text-white active:scale-90 transition-transform" onclick="adminEditUser(${u.id})"><i class="fa-solid fa-ellipsis-v text-xs"></i></button>
      </div>
    `).join('');
  },

  renderTasks() {
    const tasksList = document.getElementById('admin-tasks-list');
    if(!tasksList) return;
    tasksList.innerHTML = TASKS_DB.map((t, i) => `
      <div class="admin-stagger-item bg-gradient-to-br from-white/10 to-white/5 p-3.5 rounded-[1.25rem] border border-white/10 flex flex-col gap-2 backdrop-blur-md shadow-sm" style="--delay: ${i * 0.05}s">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-xl ${t.bg || 'bg-white/5'} border border-white/5 flex items-center justify-center text-sm shadow-inner shrink-0">
              <i class="fa-brands ${t.icon} ${t.iconColor || 'text-white'}"></i>
            </div>
            <div>
              <div class="font-bold text-[11px] text-white leading-tight">${t.title}</div>
              <div class="text-[9px] text-emerald-400 font-bold mt-0.5">+${t.reward} ₮ <span class="text-gray-500 ml-1 font-normal uppercase tracking-wider text-[8px]">${TASK_CATEGORIES[t.category] || t.category}</span></div>
              <div class="text-[8px] text-gray-400 mt-1 uppercase tracking-wider font-bold">Активаций: <span class="text-white">${t.maxCompletions > 0 ? (t.completionsCount || 0) + ' / ' + t.maxCompletions : (t.completionsCount || 0) + ' / ∞'}</span></div>
            </div>
          </div>
          <button class="bg-red-500/20 text-red-400 border border-red-500/30 w-7 h-7 rounded-lg text-[10px] active:scale-90 transition-transform flex items-center justify-center shadow-inner" onclick="deleteAdminTask(${i})"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `).join('');
  },

  renderFinance() {
    const tab = this.financeTab || 'pending';
    const list = this.mockData.finance.filter(f => {
      if (f.type !== 'withdraw') return false;
      if (tab === 'pending') return f.status === 'pending';
      return f.status === 'approved' || f.status === 'rejected';
    });
    if(list.length === 0) {
      this.els.financeList.innerHTML = '<div class="text-center text-gray-500 text-xs py-8 uppercase tracking-widest font-bold opacity-50">Нет транзакций</div>';
      return;
    }
    this.els.financeList.innerHTML = list.map((f, i) => {
       const bgClass = f.status === 'approved' ? 'from-emerald-500/10 to-teal-500/5 border-emerald-500/20' :
                       f.status === 'rejected' ? 'from-red-500/10 to-pink-500/5 border-red-500/20' :
                       'from-orange-500/10 to-red-500/5 border-orange-500/20';
       const iconClass = f.status === 'approved' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' :
                         f.status === 'rejected' ? 'bg-red-500/20 border-red-500/30 text-red-400' :
                         'bg-orange-500/20 border-orange-500/30 text-orange-400';
       const textClass = f.status === 'approved' ? 'text-emerald-400' :
                         f.status === 'rejected' ? 'text-red-400' :
                         'text-orange-400';

       return `
          <div class="admin-stagger-item bg-gradient-to-br ${bgClass} border p-3.5 rounded-[1.25rem] mb-2 flex justify-between items-center backdrop-blur-md shadow-sm" style="--delay: ${i * 0.05}s">
             <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl ${iconClass} flex items-center justify-center text-xs">
                  <i class="fa-solid fa-arrow-up-right-from-square"></i>
                </div>
                <div>
                  <div class="font-bold text-[11px] ${textClass} flex items-center gap-1.5">Вывод ${formatNumber(f.amount)} ₮</div>
                  <div class="text-[8px] text-gray-400 mt-0.5 font-mono uppercase tracking-wider">ID: ${f.id} | Сеть: ${f.network || 'TON'} | Кошелек: ${f.wallet.length > 15 ? f.wallet.slice(0,8) + '...' + f.wallet.slice(-4) : f.wallet}</div>
                </div>
             </div>
             ${f.status === 'approved' ? '<div class="px-3 py-1.5 text-[9px] font-bold text-emerald-400"><i class="fa-solid fa-check"></i> Одобрено</div>' : f.status === 'rejected' ? '<div class="px-3 py-1.5 text-[9px] font-bold text-red-400"><i class="fa-solid fa-times"></i> Отклонено</div>' : `<button class="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[9px] font-bold text-white hover:bg-white/10 active:scale-95 transition-colors" onclick="adminCheckFinance('${f.id}')">Чек</button>`}
          </div>
        `;
    }).join('');
  },

  renderPromos() {
    this.els.promosList.innerHTML = this.mockData.promos.map((p, i) => `
      <div class="admin-stagger-item flex justify-between items-center bg-black/40 p-3.5 rounded-[1.25rem] border border-white/5 backdrop-blur-md" style="--delay: ${i * 0.05}s">
        <div class="flex items-center gap-3">
           <div class="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center text-xs">
              <i class="fa-solid fa-gift"></i>
           </div>
           <div>
            <div class="text-[11px] font-black text-white tracking-widest uppercase">${p.code}</div>
            <div class="text-[8px] text-gray-400 mt-0.5 uppercase tracking-wider font-bold">${p.current} / ${p.max || '∞'} <span class="text-purple-400 ml-1">+${p.reward} ₮</span></div>
          </div>
        </div>
        <button class="bg-red-500/20 text-red-400 border border-red-500/30 w-7 h-7 rounded-lg text-[10px] active:scale-90 transition-transform flex items-center justify-center"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join('');
  },

  renderCategories() {
    if (!this.els.categoriesList) return;
    const keys = Object.keys(CATEGORY_NAMES);
    this.els.categoriesList.innerHTML = keys.map((k, i) => `
      <div class="admin-stagger-item bg-gradient-to-r from-white/10 to-white/5 px-3 py-2 rounded-xl border border-white/10 text-[9px] font-bold text-white flex items-center gap-2 shadow-sm" style="--delay: ${i * 0.05}s">
        <span>${CATEGORY_NAMES[k]}</span>
        ${keys.length > 1 ? `<button class="text-red-400 hover:text-red-300 ml-1.5 active:scale-90" onclick="deleteAdminCategory('${k}')"><i class="fa-solid fa-times"></i></button>` : ''}
      </div>
    `).join('');
  },

  renderCards() {
    if (!this.els.cardsList) return;
    this.els.cardsList.innerHTML = UPGRADES_DB.map((u, i) => `
      <div class="admin-stagger-item bg-gradient-to-br from-white/10 to-white/5 p-3.5 rounded-[1.25rem] border border-white/10 flex flex-col gap-2 backdrop-blur-md shadow-sm" style="--delay: ${i * 0.05}s">
        <div class="flex justify-between items-start">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 bg-black/40 rounded-xl flex items-center justify-center text-sm border border-white/10 shadow-inner">${u.icon}</div>
            <div>
              <div class="font-bold text-[11px] text-white">${u.name} <span class="text-[8px] text-gray-500 ml-1 uppercase tracking-wider font-normal">${CATEGORY_NAMES[u.category] || u.category || 'Новое'}</span></div>
              <div class="text-[9px] text-emerald-400 font-bold mt-0.5">База: ${u.baseCost} ₮ <span class="text-gray-600 mx-1">|</span> Прибыль: +${u.basePPH} ₮/ч</div>
            </div>
          </div>
          <button class="bg-red-500/20 text-red-400 border border-red-500/30 w-7 h-7 rounded-lg text-[10px] active:scale-90 transition-transform flex items-center justify-center shadow-inner" onclick="deleteAdminCard(${i})"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `).join('');
  }
};

AdminPanel.init();

let currentAdminUserId = null;
window.adminEditUser = function(id) {
  const user = AdminPanel.mockData.users.find(u => u.id == id);
  if (!user) return;
  currentAdminUserId = id;

  document.getElementById('adminUserModalName').innerText = user.name;
  document.getElementById('adminUserModalId').innerText = user.id;
  
  const statusEl = document.getElementById('adminUserModalStatus');
  if (user.status === 'banned') {
    statusEl.innerHTML = '<i class="fa-solid fa-lock text-[8px] mr-1"></i> Заблокирован';
    statusEl.className = 'bg-red-500/20 text-red-400 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
  } else {
    statusEl.innerHTML = '<i class="fa-solid fa-circle-check text-[8px] mr-1"></i> Активен';
    statusEl.className = 'bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
  }

  document.getElementById('adminUserModalRegDate').innerText = user.registered || 'Неизвестно';
  document.getElementById('adminUserModalPPH').innerText = `${formatNumber(user.profitPerHour || 0)} ₮`;
  document.getElementById('adminUserModalEarned').innerText = `${formatNumber(user.totalEarned || 0)} ₮`;
  document.getElementById('adminUserModalTap').innerText = `${user.tapValue || 0.0001} ₮`;
  document.getElementById('adminUserModalRefs').innerText = user.referrals || 0;
  document.getElementById('adminUserModalCards').innerText = user.cardsCount || 0;
  document.getElementById('adminUserModalTasks').innerText = user.tasksCount || 0;

  document.getElementById('adminUserBalanceInput').value = user.balance;

  const banBtn = document.getElementById('btnAdminUserToggleBan');
  if (user.status === 'banned') {
    banBtn.innerHTML = '<i class="fa-solid fa-unlock"></i> <span>Разбанить</span>';
    banBtn.className = 'w-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 py-3.5 rounded-2xl font-bold text-xs active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg';
  } else {
    banBtn.innerHTML = '<i class="fa-solid fa-ban"></i> <span>Забанить</span>';
    banBtn.className = 'w-full bg-red-500/20 text-red-400 border border-red-500/50 py-3.5 rounded-2xl font-bold text-xs active:scale-95 transition-transform flex items-center justify-center gap-2 shadow-lg';
  }

  openAdminModal('adminUserModal', 'adminUserModalContent');
};

let currentAdminFinanceId = null;
window.adminCheckFinance = function(id) {
  const tx = AdminPanel.mockData.finance.find(f => f.id == id);
  if (!tx || tx.status !== 'pending') return;
  currentAdminFinanceId = id;

  document.getElementById('adminFinanceModalAmount').innerText = `${formatNumber(tx.amount)} ₮`;
  document.getElementById('adminFinanceModalUser').innerText = `${tx.user} (ID: ${tx.userId})`;
  document.getElementById('adminFinanceModalNetwork').innerText = tx.network || 'TON';
  document.getElementById('adminFinanceModalWallet').innerText = tx.wallet;

  openAdminModal('adminFinanceModal', 'adminFinanceModalContent');
};

window.deleteAdminTask = function(index) {
  if (confirm('Точно удалить это задание?')) {
    TASKS_DB.splice(index, 1);
    state.tasksDB = TASKS_DB;
    saveState();
    AdminPanel.renderTasks();
    renderUserTasks();
  }
};

window.deleteAdminCategory = function(catId) {
  if (confirm('Внимание! Удалить категорию? Все карточки в ней тоже будут удалены навсегда!')) {
    delete CATEGORY_NAMES[catId];
    state.categoryNames = CATEGORY_NAMES;
    
    // Удаляем карточки, принадлежащие категории
    UPGRADES_DB = UPGRADES_DB.filter(u => u.category !== catId);
    state.upgradesDB = UPGRADES_DB;
    
    // Сброс текущей вкладки если она была удалена
    if (state.currentMineCategory === catId) {
      state.currentMineCategory = Object.keys(CATEGORY_NAMES)[0] || '';
    }
    
    saveState();
    AdminPanel.renderCategories();
    AdminPanel.renderCards();
    renderMineTabs();
    if(els.upgradesContainer) els.upgradesContainer.dataset.renderedCat = '';
    renderUpgrades();
    calculateTotalPPH();
    updateUI();
  }
};

window.deleteAdminPromo = function(index) {
  if (confirm('Точно удалить этот промокод?')) {
    state.promocodes.splice(index, 1);
    saveState();
    AdminPanel.renderPromos();
  }
};

const btnSubmitPromo = document.getElementById('btnSubmitAdminPromo');
if (btnSubmitPromo) {
  btnSubmitPromo.addEventListener('click', () => {
    const code = document.getElementById('adminPromoCode').value.trim().toUpperCase();
    const reward = parseFloat(document.getElementById('adminPromoReward').value);
    const limit = parseInt(document.getElementById('adminPromoLimit').value) || 0;

    if (!code) return alert('Введите код!');
    if (isNaN(reward) || reward <= 0) return alert('Введите корректную награду!');

    if (!state.promocodes) state.promocodes = [];
    if (state.promocodes.find(p => p.code === code)) return alert('Такой промокод уже существует!');

    state.promocodes.push({ code, reward, current: 0, max: limit });
    saveState();
    if(AdminPanel.renderPromos) AdminPanel.renderPromos();
    closeAdminModal('adminPromoModal', 'adminPromoModalContent');

    document.getElementById('adminPromoCode').value = '';
    document.getElementById('adminPromoReward').value = '50';
    document.getElementById('adminPromoLimit').value = '0';
  });
}

window.deleteAdminCard = function(index) {
  if (confirm('Точно удалить эту карточку?')) {
    UPGRADES_DB.splice(index, 1);
    state.upgradesDB = UPGRADES_DB;
    saveState();
    AdminPanel.renderCards();
    els.upgradesContainer.dataset.renderedCat = '';
    renderUpgrades();
    calculateTotalPPH();
    updateUI();
  }
};

if (els.openAdminPanelBtn) {
  els.openAdminPanelBtn.addEventListener('click', () => {
    if (ADMIN_IDS.includes(state.userId)) {
      AdminPanel.open();
    } else {
      alert(`❌ Отказано в доступе.\n\nВаш Telegram ID:\n${state.userId}`);
    }
  });
}

// Secret Admin Access (5 taps on avatar)
let avatarTapCount = 0;
let avatarTapTimer;
if (els.profileAvatar) {
  els.profileAvatar.addEventListener('click', () => {
    avatarTapCount++;
    clearTimeout(avatarTapTimer);
    avatarTapTimer = setTimeout(() => avatarTapCount = 0, 1000);
    if (avatarTapCount >= 5) {
      avatarTapCount = 0;
      if (ADMIN_IDS.includes(state.userId)) {
        AdminPanel.open();
      } else {
        alert(`❌ Отказано в доступе.\n\nВаш Telegram ID:\n${state.userId}\n\nДобавьте его в массив ADMIN_IDS в коде, чтобы получить доступ к God Mode.`);
      }
    }
  });
}

if (els.btnBuyEnergy) {
  els.btnBuyEnergy.addEventListener('click', () => {
    const cost = getEnergyUpgradeCost();
    if (state.balance >= cost) {
      state.balance = Number((state.balance - cost).toFixed(6));
      state.extraMaxEnergy = (state.extraMaxEnergy || 0) + 500;
      state.energyUpgradeCount = (state.energyUpgradeCount || 0) + 1;
      updateLevelStatus();
      updateUI();
      saveState();
      
      els.btnBuyEnergy.parentElement.classList.add('purchase-anim');
      setTimeout(() => els.btnBuyEnergy.parentElement.classList.remove('purchase-anim'), 500);
      if(navigator.vibrate) navigator.vibrate([15, 30, 15]);
    } else {
      alert(`Недостаточно ₮! Нужно ${cost.toFixed(2)} ₮`);
    }
  });
}

if (els.btnBuyTap) {
  els.btnBuyTap.addEventListener('click', () => {
    const cost = getTapUpgradeCost();
    if (state.balance >= cost) {
      state.balance = Number((state.balance - cost).toFixed(6));
      state.extraTap = (state.extraTap || 0) + 0.001;
      state.tapUpgradeCount = (state.tapUpgradeCount || 0) + 1;
      updateLevelStatus();
      updateUI();
      saveState();
      
      els.btnBuyTap.parentElement.classList.add('purchase-anim');
      setTimeout(() => els.btnBuyTap.parentElement.classList.remove('purchase-anim'), 500);
      if(navigator.vibrate) navigator.vibrate([15, 30, 15]);
    } else {
      alert(`Недостаточно ₮! Нужно ${cost.toFixed(2)} ₮`);
    }
  });
}

// ==========================================
// Modals Logic
// ==========================================

// 1. Withdraw Modal
let currentWithdrawNetwork = 'TRC20';

function closeWithdrawModal() {
  if(els.withdrawModalContent) els.withdrawModalContent.classList.add('scale-95');
  setTimeout(() => {
    if(els.withdrawModal) {
      els.withdrawModal.classList.add('hidden');
      els.withdrawModal.classList.remove('flex');
    }
  }, 300);
}

if (els.btnWithdraw) {
  els.btnWithdraw.addEventListener('click', () => {
    if(els.withdrawAvailableDisplay) els.withdrawAvailableDisplay.innerText = formatNumber(state.balance);
    if(els.withdrawModal) {
      els.withdrawModal.classList.remove('hidden');
      els.withdrawModal.classList.add('flex');
      setTimeout(() => {
        if(els.withdrawModalContent) els.withdrawModalContent.classList.remove('scale-95');
      }, 10);
    }
  });
}

if (els.closeWithdrawBtn) els.closeWithdrawBtn.addEventListener('click', closeWithdrawModal);
if (els.withdrawModal) {
  els.withdrawModal.addEventListener('click', (e) => {
    if (e.target === els.withdrawModal) closeWithdrawModal();
  });
}

if (els.withdrawNetworks) {
  els.withdrawNetworks.forEach(btn => {
    btn.addEventListener('click', (e) => {
      els.withdrawNetworks.forEach(b => {
        b.classList.remove('active', 'bg-emerald-500/20', 'border-emerald-500/50', 'text-emerald-400');
        b.classList.add('bg-black/40', 'border-white/10', 'text-gray-400');
      });
      const target = e.currentTarget;
      target.classList.add('active', 'bg-emerald-500/20', 'border-emerald-500/50', 'text-emerald-400');
      target.classList.remove('bg-black/40', 'border-white/10', 'text-gray-400');
      currentWithdrawNetwork = target.dataset.network;
    });
  });
}

if (els.withdrawMaxBtn) {
  els.withdrawMaxBtn.addEventListener('click', () => {
    if(els.withdrawAmount) els.withdrawAmount.value = Math.floor(state.balance * 10000) / 10000;
  });
}

if (els.btnSubmitWithdraw) {
  els.btnSubmitWithdraw.addEventListener('click', () => {
    const address = els.withdrawAddress?.value?.trim();
    const amount = parseFloat(els.withdrawAmount?.value);

    if (!address) return alert('Введите адрес кошелька!');
    if (isNaN(amount) || amount <= 0) return alert('Введите корректную сумму!');
    if (amount > state.balance) return alert('Недостаточно средств!');
    if (amount < 1) return alert('Минимальная сумма вывода 1 ₮');

    state.balance = Number((state.balance - amount).toFixed(6));
    
    const txId = Date.now().toString().slice(-6);
    
    AdminPanel.mockData.finance.unshift({
      id: txId,
      type: 'withdraw',
      user: state.userId,
      userId: state.userId,
      amount: amount,
      wallet: address,
      network: currentWithdrawNetwork,
      status: 'pending'
    });

    if(!state.transactions) state.transactions = [];
    state.transactions.unshift({
      id: txId,
      amount: amount,
      wallet: address,
      network: currentWithdrawNetwork,
      status: 'pending',
      date: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    });

    saveState();
    updateUI();
    
    els.btnSubmitWithdraw.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    setTimeout(() => {
      els.btnSubmitWithdraw.innerHTML = 'Создать заявку';
      alert(`✅ Заявка на вывод ${amount} ₮ успешно создана!\nСеть: ${currentWithdrawNetwork}\nАдрес: ${address}\nОжидайте зачисления.`);
      
      closeWithdrawModal();
      
      if(els.withdrawAddress) els.withdrawAddress.value = '';
      if(els.withdrawAmount) els.withdrawAmount.value = '';
      
      if(AdminPanel.renderFinance) AdminPanel.renderFinance();
    }, 1000);
  });
}

// 2. Upgrades Modal
function closeUpgradesModal() {
  if(els.upgradesModalContent) els.upgradesModalContent.classList.add('translate-y-full');
  setTimeout(() => {
    if(els.upgradesModal) {
      els.upgradesModal.classList.add('hidden');
      els.upgradesModal.classList.remove('flex');
    }
  }, 300);
}

if (els.openUpgradesBtn) {
  els.openUpgradesBtn.addEventListener('click', () => {
    if(els.upgradesModal) {
      els.upgradesModal.classList.remove('hidden');
      els.upgradesModal.classList.add('flex');
      setTimeout(() => {
        if(els.upgradesModalContent) els.upgradesModalContent.classList.remove('translate-y-full');
      }, 10);
    }
  });
}

if (els.closeUpgradesBtn) els.closeUpgradesBtn.addEventListener('click', closeUpgradesModal);
if (els.upgradesModal) {
  els.upgradesModal.addEventListener('click', (e) => {
    if (e.target === els.upgradesModal) closeUpgradesModal();
  });
}

// 4. Friends Modal
function closeFriendsModal() {
  if(els.friendsModalContent) els.friendsModalContent.classList.add('scale-95');
  setTimeout(() => {
    if(els.friendsModal) {
      els.friendsModal.classList.add('hidden');
      els.friendsModal.classList.remove('flex');
    }
  }, 300);
}

if (els.btnShowFriends) {
  els.btnShowFriends.addEventListener('click', () => {
    if(els.friendsModal) {
      els.friendsModal.classList.remove('hidden');
      els.friendsModal.classList.add('flex');
      setTimeout(() => {
        if(els.friendsModalContent) els.friendsModalContent.classList.remove('scale-95');
      }, 10);
    }
  });
}

if (els.closeFriendsBtn) els.closeFriendsBtn.addEventListener('click', closeFriendsModal);
if (els.friendsModal) {
  els.friendsModal.addEventListener('click', (e) => {
    if (e.target === els.friendsModal) closeFriendsModal();
  });
}

// 3. Promo Modal
function closePromoModal() {
  if(els.promoModalContent) els.promoModalContent.classList.add('scale-95');
  setTimeout(() => {
    if(els.promoModal) {
      els.promoModal.classList.add('hidden');
      els.promoModal.classList.remove('flex');
    }
  }, 300);
}

if (els.openPromoModalBtn) {
  els.openPromoModalBtn.addEventListener('click', () => {
    if(els.promoModal) {
      els.promoModal.classList.remove('hidden');
      els.promoModal.classList.add('flex');
      setTimeout(() => {
        if(els.promoModalContent) els.promoModalContent.classList.remove('scale-95');
      }, 10);
    }
  });
}

if (els.closePromoBtn) els.closePromoBtn.addEventListener('click', closePromoModal);
if (els.promoModal) {
  els.promoModal.addEventListener('click', (e) => {
    if (e.target === els.promoModal) closePromoModal();
  });
}

// 5. Transaction History Modal
function closeTxHistoryModal() {
  if(els.txHistoryModalContent) els.txHistoryModalContent.classList.add('scale-95');
  setTimeout(() => {
    if(els.txHistoryModal) {
      els.txHistoryModal.classList.add('hidden');
      els.txHistoryModal.classList.remove('flex');
    }
  }, 300);
}

function renderTxHistory() {
  const container = els.txHistoryList;
  if (!container) return;
  if (!state.transactions || state.transactions.length === 0) {
    container.innerHTML = '<div class="text-center text-gray-500 text-xs py-8 font-bold uppercase tracking-widest opacity-50 flex flex-col items-center gap-2"><i class="fa-solid fa-ghost text-2xl mb-1"></i> История пуста</div>';
    return;
  }
  container.innerHTML = state.transactions.map(tx => {
    const statusColors = {
      'pending': 'text-orange-400 bg-orange-500/10 border-orange-500/30',
      'approved': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
      'rejected': 'text-red-400 bg-red-500/10 border-red-500/30'
    };
    const statusNames = {
      'pending': 'В обработке',
      'approved': 'Выполнено',
      'rejected': 'Отклонено'
    };
    const sColor = statusColors[tx.status] || 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    return `
      <div class="bg-gradient-to-br from-white/10 to-white/5 p-3.5 rounded-[1.25rem] border border-white/10 shadow-sm backdrop-blur-sm mb-2 transition-transform">
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center gap-2">
             <div class="w-7 h-7 bg-black/40 rounded-lg flex items-center justify-center border border-white/5 shadow-inner">
               <i class="fa-solid fa-arrow-up-right-from-square text-gray-400 text-[10px]"></i>
             </div>
             <div class="text-[12px] font-black text-white leading-none">Вывод ${formatNumber(tx.amount)} ₮</div>
          </div>
          <div class="text-[9px] font-bold px-2 py-1 rounded-md border ${sColor}">${statusNames[tx.status] || tx.status}</div>
        </div>
        <div class="bg-black/30 p-2 rounded-lg border border-white/5 flex justify-between items-center text-[9px] text-gray-400 font-mono mt-1">
          <span class="flex items-center gap-1"><i class="fa-solid fa-calendar text-[10px]"></i> ${tx.date}</span>
          <span class="flex items-center gap-1"><i class="fa-solid fa-network-wired text-[10px]"></i> ${tx.network}</span>
        </div>
      </div>
    `;
  }).join('');
}

if (els.btnTxHistory) {
  els.btnTxHistory.addEventListener('click', () => {
    renderTxHistory();
    if(els.txHistoryModal) {
      els.txHistoryModal.classList.remove('hidden');
      els.txHistoryModal.classList.add('flex');
      setTimeout(() => {
        if(els.txHistoryModalContent) els.txHistoryModalContent.classList.remove('scale-95');
      }, 10);
    }
  });
}

if (els.closeTxHistoryBtn) els.closeTxHistoryBtn.addEventListener('click', closeTxHistoryModal);
if (els.txHistoryModal) {
  els.txHistoryModal.addEventListener('click', (e) => {
    if (e.target === els.txHistoryModal) closeTxHistoryModal();
  });
}

// 6. FAQ Modal
function closeFaqModal() {
  if(els.faqModalContent) els.faqModalContent.classList.add('scale-95');
  setTimeout(() => {
    if(els.faqModal) {
      els.faqModal.classList.add('hidden');
      els.faqModal.classList.remove('flex');
    }
  }, 300);
}

if (els.openFaqModalBtn) {
  els.openFaqModalBtn.addEventListener('click', () => {
    if(els.faqModal) {
      els.faqModal.classList.remove('hidden');
      els.faqModal.classList.add('flex');
      setTimeout(() => {
        if(els.faqModalContent) els.faqModalContent.classList.remove('scale-95');
      }, 10);
    }
  });
}

if (els.closeFaqBtn) els.closeFaqBtn.addEventListener('click', closeFaqModal);
if (els.faqModal) {
  els.faqModal.addEventListener('click', (e) => {
    if (e.target === els.faqModal) closeFaqModal();
  });
}

// FAQ Accordion Logic
document.querySelectorAll('.faq-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const content = btn.nextElementSibling;
    const icon = btn.querySelector('i');
    if (content.classList.contains('hidden')) {
      // Close others
      document.querySelectorAll('.faq-content').forEach(c => c.classList.add('hidden'));
      document.querySelectorAll('.faq-header i').forEach(i => i.classList.remove('rotate-180'));
      // Open this
      content.classList.remove('hidden');
      icon.classList.add('rotate-180');
    } else {
      content.classList.add('hidden');
      icon.classList.remove('rotate-180');
    }
  });
});

if (els.btnPromoSubmit) {
  els.btnPromoSubmit.addEventListener('click', () => {
    const code = els.promoInput?.value?.trim().toUpperCase();
    if (!code) return alert('Введите промокод!');

    els.btnPromoSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
    setTimeout(() => {
      els.btnPromoSubmit.innerHTML = 'Активировать';

      const promo = (state.promocodes || []).find(p => p.code === code);
      if (promo) {
        if (!state.usedPromos) state.usedPromos = [];
        if (state.usedPromos.includes(code)) {
          alert('Вы уже использовали этот промокод!');
        } else if (promo.max > 0 && promo.current >= promo.max) {
          alert('❌ Лимит активаций этого промокода исчерпан!');
        } else {
          state.usedPromos.push(code);
          promo.current = (promo.current || 0) + 1;
          state.balance = Number((state.balance + promo.reward).toFixed(6));
          state.totalEarned = Number((state.totalEarned + promo.reward).toFixed(6));
          saveState();
          updateUI();
          alert(`✅ Промокод активирован! Вы получили ${promo.reward} ₮`);
          closePromoModal();
          if (els.promoInput) els.promoInput.value = '';
          if (AdminPanel.renderPromos) AdminPanel.renderPromos();
        }
      } else {
        alert('❌ Промокод не найден или недействителен!');
      }
    }, 800);
  });
}

// Passive loop
setInterval(() => {
  if (state.profitPerHour > 0) {
    const pps = state.profitPerHour / 36000;
    state.balance = Number((state.balance + pps).toFixed(6));
    state.totalEarned = Number((state.totalEarned + pps).toFixed(6));
    els.balance.innerText = formatNumber(state.balance);
    if (els.profileBalanceDisplay) els.profileBalanceDisplay.innerText = formatNumber(state.balance);
  }
  if (state.energy < state.maxEnergy) {
    state.energy = Math.min(state.maxEnergy, state.energy + (CONFIG.energyRechargeRate / 10));
    els.energy.innerText = Math.floor(state.energy);
    els.energyBar.style.width = `${(state.energy / state.maxEnergy) * 100}%`;
  }
}, 100);

setInterval(() => {
  const now = Date.now();
  state.lastSync = now;
  updateLevelStatus();
  
  UPGRADES_DB.forEach(u => {
    const btn = document.querySelector(`.upgrade-btn[data-id="${u.id}"]`);
    if(btn) {
       const cost = getUpgradeCost(u.id);
       btn.disabled = state.balance < cost;
    }
  });

  if (els.btnBuyEnergy) els.btnBuyEnergy.disabled = state.balance < getEnergyUpgradeCost();
  if (els.btnBuyTap) els.btnBuyTap.disabled = state.balance < getTapUpgradeCost();
  
}, 1000);

async function loadState() {
  try {
    const saved = await StorageHelper.getItem('gameStateV7');
    if (saved) {
      const parsed = JSON.parse(saved);
      state = { ...state, ...parsed };
      if (!state.upgrades) state.upgrades = {};
      if (!state.extraTap) state.extraTap = 0;
      if (!state.extraMaxEnergy) state.extraMaxEnergy = 0;
      if (!state.boostCount) state.boostCount = 0;
      if (!state.tapUpgradeCount) state.tapUpgradeCount = 0;
      if (!state.energyUpgradeCount) state.energyUpgradeCount = 0;
      if (!state.completedTasks) state.completedTasks = [];
      if (!state.pendingTasks) state.pendingTasks = {};
      if (!state.lastDaily) state.lastDaily = null;
      if (!state.transactions) state.transactions = [];
      
      if (state.categoryNames) {
         CATEGORY_NAMES = state.categoryNames;
      } else {
         state.categoryNames = CATEGORY_NAMES;
      }
      
      if (state.tasksDB) {
        TASKS_DB = state.tasksDB;
      } else {
        state.tasksDB = TASKS_DB;
      }
      
      if (state.taskCategories) {
        TASK_CATEGORIES = state.taskCategories;
      } else {
        state.taskCategories = TASK_CATEGORIES;
      }
      
      if (!state.currentTaskCategory) state.currentTaskCategory = 'social';

      // Загружаем карточки из памяти
      if (state.upgradesDB) {
        state.upgradesDB.forEach(u => {
          if (!u.category && u.desc) {
             if (['Finance', 'Yield', 'Market', 'Platform'].includes(u.desc)) u.category = 'markets';
             else if (['Automation', 'Web3'].includes(u.desc)) u.category = 'web3';
             else u.category = 'markets';
          }
        });
        UPGRADES_DB = state.upgradesDB;
      }
      
      calculateTotalPPH();
      calculateOfflineProfit();
      
      let loadedIdx = 0;
      for (let i = 0; i < LEVELS.length; i++) {
        if (state.totalEarned >= LEVELS[i].threshold) loadedIdx = i;
        else break;
      }
      state.currentLevelIdx = loadedIdx;
    }
  } catch (e) { console.error("Load fail", e); }
  
  renderCoinDesign(state.currentLevelIdx);
  renderMineTabs(); 
  renderTaskTabs();
  renderUserTasks(); 
  updateDailyRewardUI(); 
  updateUI();
  
  // Обновляем списки в админке
  if(AdminPanel.renderCategories) AdminPanel.renderCategories();
  if(AdminPanel.renderCards) AdminPanel.renderCards();
  if(AdminPanel.renderTasks) AdminPanel.renderTasks();

  const tg = window.Telegram?.WebApp;
  const startParam = tg?.initDataUnsafe?.start_param;
  const userId = tg?.initDataUnsafe?.user?.id || 123456789;

  if (startParam && !state.referredBy && startParam !== String(userId)) {
    state.referredBy = startParam;
    state.balance = Number((state.balance + 1000).toFixed(6));
    state.totalEarned = Number((state.totalEarned + 1000).toFixed(6));
    setTimeout(() => {
      alert(`🎉 Вы приглашены пользователем ${startParam}!\nВам начислен бонус +1,000 ₮!`);
    }, 500);
    saveState();
    updateUI();
    updateLevelStatus();
  }
  initReferralUI();

  // Асинхронно стягиваем данные с бэкенда (чтобы НЕ останавливать загрузку UI, пока сервер Render "просыпается")
  if (state.userId) {
    fetch(`${API_BASE}/user/${state.userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          const u = data.user;
          // Обновляем прогресс, только если на сервере он выше или равен локальному (не затираем локальный)
          if (u.totalEarned > 0 && u.totalEarned >= state.totalEarned) {
            state.balance = u.balance || state.balance;
            state.totalEarned = u.totalEarned || state.totalEarned;
            state.profitPerHour = u.profitPerHour || state.profitPerHour;
            state.tapValue = u.tapValue || state.tapValue;
            state.energy = u.energy || state.energy;
            state.maxEnergy = u.maxEnergy || state.maxEnergy;
            if (u.upgrades && Object.keys(u.upgrades).length > 0) state.upgrades = u.upgrades;
            if (u.completedTasks && u.completedTasks.length > 0) state.completedTasks = u.completedTasks;
            
            // Мгновенно обновляем интерфейс после загрузки данных
            calculateTotalPPH();
            updateLevelStatus();
            updateUI();
            if(els.upgradesContainer) els.upgradesContainer.dataset.renderedCat = '';
            renderUpgrades();
            renderUserTasks();
          }
        }
      })
      .catch(err => console.warn('API sync failed or server sleeping:', err));
  }
}

function renderFriends() {
  const friendsList = document.getElementById('modalFriendsList');
  if (!friendsList) return;
  
  const dummyFriends = [
    { name: 'Alex Crypto', profit: 12500, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
    { name: 'Whale #99', profit: 5400, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Whale99' },
    { name: 'DogeLover', profit: 150, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Doge' }
  ];

  friendsList.innerHTML = dummyFriends.map((f, i) => `
    <div class="bg-gradient-to-br from-white/10 to-white/5 p-3.5 rounded-[1.25rem] flex justify-between items-center border border-white/10 shadow-md backdrop-blur-md transition-all active:scale-95 mb-1.5">
       <div class="flex items-center gap-3">
         <div class="w-11 h-11 rounded-full p-[2px] bg-gradient-to-br from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] shrink-0">
           <img src="${f.avatar}" class="w-full h-full rounded-full bg-black object-cover">
         </div>
         <div>
           <div class="text-[12px] font-bold text-white leading-tight mb-0.5">${f.name}</div>
           <div class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Ранг: <span class="text-purple-300">Tether</span></div>
         </div>
       </div>
       <div class="text-right">
         <div class="text-[9px] text-emerald-400/80 font-bold uppercase tracking-widest mb-1">Принес вам</div>
         <div class="text-[13px] font-black text-emerald-400 drop-shadow-sm">+${formatNumber(f.profit)} ₮</div>
       </div>
    </div>
  `).join('');
}

function initReferralUI() {
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user || { id: 123456789 };
  const botUsername = 'CryptoEvoClickerBot';
  const refLink = `https://t.me/${botUsername}/app?startapp=${user.id}`;
  
  const refLinkDisplay = document.getElementById('refLinkDisplay');
  const copyRefBtn = document.getElementById('copyRefBtn');
  const shareRefBtn = document.getElementById('shareRefBtn');
  
  if(refLinkDisplay) refLinkDisplay.innerText = refLink;
  
  if(copyRefBtn) {
    copyRefBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(refLink).then(() => {
        const icon = copyRefBtn.querySelector('i');
        icon.className = 'fa-solid fa-check text-emerald-400';
        if(navigator.vibrate) navigator.vibrate(50);
        setTimeout(() => icon.className = 'fa-regular fa-copy', 2000);
      });
    });
  }
  
  if(shareRefBtn) {
    shareRefBtn.addEventListener('click', () => {
      const text = 'Заходи в Crypto Evolution Clicker и получи 1000 ₮ бонусом!';
      const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(refLink)}&text=${encodeURIComponent(text)}`;
      window.open(shareUrl, '_blank');
    });
  }

  renderFriends();
}

async function saveState() {
  try {
    state.lastSync = Date.now();
    state.categoryNames = CATEGORY_NAMES;
    state.tasksDB = TASKS_DB;
    state.taskCategories = TASK_CATEGORIES;
    await StorageHelper.setItem('gameStateV7', JSON.stringify(state));
    
    // Sync to backend
    if (state.userId) {
      try {
        fetch(`${API_BASE}/user/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId: state.userId, state: state })
        });
      } catch (e) {}
    }
  } catch (e) { console.error("Save fail", e); }
}

setInterval(saveState, CONFIG.saveIntervalMs);

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    if (!targetId) return;
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    document.querySelectorAll('.view-section').forEach(v => {
      v.classList.remove('active');
      v.classList.add('hidden');
    });
    
    const targetView = document.getElementById(targetId);
    targetView.classList.remove('hidden');
    targetView.classList.add('active');

    if (targetId === 'view-exchange') {
      document.body.classList.remove('compact-mode', 'profile-mode');
      targetView.style.animation = 'none';
      void targetView.offsetWidth; 
      targetView.style.animation = 'springInBottom 0.6s var(--spring) forwards';
    } else if (targetId === 'view-mine') {
      document.body.classList.remove('profile-mode');
      document.body.classList.add('compact-mode');
      targetView.style.animation = 'none';
      void targetView.offsetWidth; 
      targetView.style.animation = 'springInRight 0.6s var(--spring) forwards';
    } else if (targetId === 'view-tasks') {
      document.body.classList.remove('profile-mode');
      document.body.classList.add('compact-mode');
      targetView.style.animation = 'none';
      void targetView.offsetWidth; 
      targetView.style.animation = 'springInScale 0.6s var(--spring) forwards';
    } else if (targetId === 'view-frens') {
      document.body.classList.add('compact-mode', 'profile-mode');
      targetView.style.animation = 'none';
      void targetView.offsetWidth; 
      targetView.style.animation = 'springInScale 0.6s var(--spring) forwards';
    } else if (targetId === 'view-profile') {
      document.body.classList.add('compact-mode', 'profile-mode');
      targetView.style.animation = 'none';
      void targetView.offsetWidth; 
      targetView.style.animation = 'springInFade 0.6s var(--spring) forwards';
    }
  });
});

if(els.boostBtn) {
  els.boostBtn.addEventListener('click', () => {
    const cost = getBoostCost();
    if (state.balance >= cost) {
      if (state.energy >= state.maxEnergy) {
        alert('Энергия уже на максимуме!');
        return;
      }
      state.balance = Number((state.balance - cost).toFixed(6));
      state.energy = state.maxEnergy;
      state.boostCount = (state.boostCount || 0) + 1;
      updateUI();
      saveState();
      
      els.boostBtn.classList.add('purchase-anim');
      setTimeout(() => els.boostBtn.classList.remove('purchase-anim'), 500);
      
      els.energyBar.style.boxShadow = '0 0 20px #fff';
      setTimeout(() => els.energyBar.style.boxShadow = '', 300);
      
      if(navigator.vibrate) navigator.vibrate([20, 50, 20]);
    } else {
      els.boostBtn.style.transform = 'translateX(-4px)';
      setTimeout(() => els.boostBtn.style.transform = 'translateX(4px)', 50);
      setTimeout(() => els.boostBtn.style.transform = 'translateX(0)', 100);
      alert(`Недостаточно ₮ для покупки буста! (Нужно ${cost.toFixed(2)} ₮)`);
    }
  });
}

els.clickArea.addEventListener('touchstart', (e) => {
  Array.from(e.changedTouches).forEach(touch => {
    handleTap(e, touch.clientX, touch.clientY);
    handleCoinTilt(touch.clientX, touch.clientY);
  });
}, {passive: true});

els.clickArea.addEventListener('touchmove', (e) => {
  if(e.touches.length > 0) handleCoinTilt(e.touches[0].clientX, e.touches[0].clientY);
}, {passive: true});

els.clickArea.addEventListener('touchend', resetCoinTilt);
els.clickArea.addEventListener('touchcancel', resetCoinTilt);

els.clickArea.addEventListener('mousedown', (e) => {
  handleTap(e, e.clientX, e.clientY);
  handleCoinTilt(e.clientX, e.clientY);
});
els.clickArea.addEventListener('mousemove', (e) => {
  if (e.buttons > 0) handleCoinTilt(e.clientX, e.clientY);
});
els.clickArea.addEventListener('mouseup', resetCoinTilt);
els.clickArea.addEventListener('mouseleave', resetCoinTilt);

els.collectOfflineBtn.addEventListener('click', () => {
  document.getElementById('offlineModalContent').classList.remove('scale-100');
  document.getElementById('offlineModalContent').classList.add('scale-95');
  setTimeout(() => {
    els.offlineModal.classList.add('hidden');
    els.offlineModal.classList.remove('flex');
  }, 500);
});

// Копирование ID из профиля
if (els.profileIdContainer) {
  els.profileIdContainer.addEventListener('click', () => {
    if (!state.userId) return;
    navigator.clipboard.writeText(state.userId).then(() => {
      const icon = els.profileIdContainer.querySelector('i.fa-copy');
      if (icon) {
        icon.className = 'fa-solid fa-check text-emerald-400 text-[10px] ml-1';
        setTimeout(() => icon.className = 'fa-regular fa-copy text-gray-500 text-[10px] ml-1', 2000);
      }
      if (els.copyTooltip) {
        els.copyTooltip.classList.remove('opacity-0');
        els.copyTooltip.classList.add('opacity-100');
        if (navigator.vibrate) navigator.vibrate(50);
        setTimeout(() => {
          els.copyTooltip.classList.remove('opacity-100');
          els.copyTooltip.classList.add('opacity-0');
        }, 2000);
      }
    });
  });
}

window.addEventListener('beforeunload', saveState);

document.addEventListener('DOMContentLoaded', () => {
  initTelegramData();
  initBackgroundAnimations();
  calculateTotalPPH();
  loadState();
});

// ==========================================
// Admin Modals Logic
// ==========================================

// Native Telegram BackButton Integration
const tgBack = window.Telegram?.WebApp;
if (tgBack && tgBack.BackButton) {
  const checkBackButton = () => {
    let shouldShow = false;
    const activeView = document.querySelector('.view-section.active');
    if (activeView && activeView.id !== 'view-exchange') shouldShow = true;
    const modals = document.querySelectorAll('#withdrawModal, #upgradesModal, #promoModal, #offlineModal, #adminDashboard, #adminCategoryModal, #adminCardModal, #adminTaskModal, #txHistoryModal, #faqModal');
    modals.forEach(m => {
      if (m.classList.contains('flex') && !m.classList.contains('hidden')) shouldShow = true;
    });
    if (shouldShow) tgBack.BackButton.show();
    else tgBack.BackButton.hide();
  };
  const observer = new MutationObserver(checkBackButton);
  observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['class'] });
  checkBackButton();
  tgBack.BackButton.onClick(() => {
    const modals = [
      { id: 'adminCategoryModal', close: () => closeAdminModal('adminCategoryModal', 'adminCategoryModalContent') },
      { id: 'adminCardModal', close: () => closeAdminModal('adminCardModal', 'adminCardModalContent') },
      { id: 'adminTaskModal', close: () => closeAdminModal('adminTaskModal', 'adminTaskModalContent') },
      { id: 'adminUserModal', close: () => closeAdminModal('adminUserModal', 'adminUserModalContent') },
      { id: 'adminFinanceModal', close: () => closeAdminModal('adminFinanceModal', 'adminFinanceModalContent') },
      { id: 'adminPromoModal', close: () => closeAdminModal('adminPromoModal', 'adminPromoModalContent') },
      { id: 'adminDashboard', close: () => { const d = document.getElementById('adminDashboard'); d.classList.add('closing'); setTimeout(() => { d.classList.add('hidden'); d.classList.remove('flex', 'closing'); }, 400); } },
      { id: 'withdrawModal', close: closeWithdrawModal },
      { id: 'upgradesModal', close: closeUpgradesModal },
      { id: 'promoModal', close: closePromoModal },
      { id: 'friendsModal', close: closeFriendsModal },
      { id: 'txHistoryModal', close: closeTxHistoryModal },
      { id: 'faqModal', close: closeFaqModal }
    ];
    for (const m of modals) {
      const el = document.getElementById(m.id);
      if (el && el.classList.contains('flex') && !el.classList.contains('hidden')) {
        m.close();
        return;
      }
    }
    const activeView = document.querySelector('.view-section.active');
    if (activeView && activeView.id !== 'view-exchange') {
      const mainTabBtn = document.querySelector('.nav-btn[data-target="view-exchange"]');
      if (mainTabBtn) mainTabBtn.click();
    }
  });
}
function openAdminModal(modalId, contentId) {
  const modal = document.getElementById(modalId);
  const content = document.getElementById(contentId);
  if (modal && content) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    setTimeout(() => content.classList.remove('scale-95'), 10);
  }
}

function closeAdminModal(modalId, contentId) {
  const modal = document.getElementById(modalId);
  const content = document.getElementById(contentId);
  if (modal && content) {
    content.classList.add('scale-95');
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 300);
  }
}

['adminCategoryModal', 'adminCardModal', 'adminTaskModal', 'adminUserModal', 'adminFinanceModal', 'adminPromoModal'].forEach(id => {
  const modal = document.getElementById(id);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAdminModal(id, id + 'Content');
    });
    const closeBtn = document.getElementById('close' + id.charAt(0).toUpperCase() + id.slice(1) + 'Btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => closeAdminModal(id, id + 'Content'));
    }
  }
});

const btnSubmitCategory = document.getElementById('btnSubmitAdminCategory');
if (btnSubmitCategory) {
  btnSubmitCategory.addEventListener('click', () => {
    const input = document.getElementById('adminCategoryName');
    const catName = input.value.trim();
    if (catName) {
       const catId = 'cat_' + Date.now();
       CATEGORY_NAMES[catId] = catName;
       state.categoryNames = CATEGORY_NAMES;
       saveState();
       renderMineTabs();
       if(AdminPanel.renderCategories) AdminPanel.renderCategories();
       closeAdminModal('adminCategoryModal', 'adminCategoryModalContent');
       input.value = '';
    }
  });
}

const btnSubmitCard = document.getElementById('btnSubmitAdminCard');
if (btnSubmitCard) {
  btnSubmitCard.addEventListener('click', () => {
    const name = document.getElementById('adminCardName').value.trim();
    const category = document.getElementById('adminCardCategory').value;
    const icon = document.getElementById('adminCardIcon').value.trim();
    const baseCost = parseFloat(document.getElementById('adminCardCost').value);
    const basePPH = parseFloat(document.getElementById('adminCardPPH').value);
    
    if (!name) return alert('Введите название!');
    if (isNaN(baseCost) || isNaN(basePPH)) return alert('Ошибка! Цена и прибыль должны быть числами.');

    UPGRADES_DB.push({
      id: 'card_' + Date.now(),
      name, category, icon: icon || '✨',
      baseCost, basePPH
    });
    state.upgradesDB = UPGRADES_DB;
    saveState();
    if(AdminPanel.renderCards) AdminPanel.renderCards();
    
    if (els.upgradesContainer) els.upgradesContainer.dataset.renderedCat = '';
    renderUpgrades();
    closeAdminModal('adminCardModal', 'adminCardModalContent');

    document.getElementById('adminCardName').value = '';
    document.getElementById('adminCardCost').value = '10';
    document.getElementById('adminCardPPH').value = '2';
  });
}

const btnSubmitTask = document.getElementById('btnSubmitAdminTask');
if (btnSubmitTask) {
  btnSubmitTask.addEventListener('click', () => {
    const title = document.getElementById('adminTaskTitle').value.trim();
    const category = document.getElementById('adminTaskCategory').value;
    const reward = parseFloat(document.getElementById('adminTaskReward').value);
    const maxCompletions = parseInt(document.getElementById('adminTaskLimit').value) || 0;
    const icon = document.getElementById('adminTaskIcon').value.trim();
    const link = document.getElementById('adminTaskLink')?.value.trim() || '';

    if (!title) return alert('Введите название задания!');
    if (isNaN(reward)) return alert('Ошибка! Награда должна быть числом.');

    TASKS_DB.push({
      id: 'task_' + Date.now(),
      title, category, reward,
      maxCompletions, link,
      completionsCount: 0,
      icon: icon || 'fa-globe',
      iconColor: 'text-white',
      bg: 'bg-white/10'
    });

    state.tasksDB = TASKS_DB;
    saveState();
    if(AdminPanel.renderTasks) AdminPanel.renderTasks();
    renderTaskTabs();
    renderUserTasks();
    closeAdminModal('adminTaskModal', 'adminTaskModalContent');

    document.getElementById('adminTaskTitle').value = '';
    document.getElementById('adminTaskReward').value = '10';
    document.getElementById('adminTaskLimit').value = '0';
    if(document.getElementById('adminTaskLink')) document.getElementById('adminTaskLink').value = '';
  });
}

document.getElementById('btnAdminUserToggleBan')?.addEventListener('click', () => {
  if (!currentAdminUserId) return;
  const user = AdminPanel.mockData.users.find(u => u.id == currentAdminUserId);
  if (user) {
    user.status = user.status === 'banned' ? 'active' : 'banned';
    AdminPanel.renderUsers(document.getElementById('adminSearchUser')?.value || '');
    closeAdminModal('adminUserModal', 'adminUserModalContent');
  }
});

document.getElementById('btnAdminUserSaveBalance')?.addEventListener('click', () => {
  if (!currentAdminUserId) return;
  const user = AdminPanel.mockData.users.find(u => u.id == currentAdminUserId);
  const input = document.getElementById('adminUserBalanceInput');
  if (user && input) {
    const newBal = parseFloat(input.value);
    if (!isNaN(newBal)) {
      user.balance = newBal;
      AdminPanel.renderUsers(document.getElementById('adminSearchUser')?.value || '');
      closeAdminModal('adminUserModal', 'adminUserModalContent');
    }
  }
});

document.getElementById('btnAdminFinanceApprove')?.addEventListener('click', () => {
  if (!currentAdminFinanceId) return;
  const tx = AdminPanel.mockData.finance.find(f => f.id == currentAdminFinanceId);
  if (tx) {
    tx.status = 'approved';
    AdminPanel.renderFinance();
    closeAdminModal('adminFinanceModal', 'adminFinanceModalContent');
  }
});

document.getElementById('btnAdminFinanceReject')?.addEventListener('click', () => {
  if (!currentAdminFinanceId) return;
  const tx = AdminPanel.mockData.finance.find(f => f.id == currentAdminFinanceId);
  if (tx) {
    tx.status = 'rejected';
    AdminPanel.renderFinance();
    closeAdminModal('adminFinanceModal', 'adminFinanceModalContent');
  }
});

// Copy Admin User ID
document.getElementById('btnCopyAdminUserId')?.addEventListener('click', (e) => {
  const btn = document.getElementById('btnCopyAdminUserId');
  const id = document.getElementById('adminUserModalId')?.innerText;
  if (!id) return;
  navigator.clipboard.writeText(id).then(() => {
    const icon = btn ? btn.querySelector('i') : null;
    if (icon) {
      icon.className = 'fa-solid fa-check text-emerald-400 text-[10px]';
      if(navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => icon.className = 'fa-regular fa-copy text-[10px]', 2000);
    }
  });
});

// Copy Admin Finance Wallet
document.getElementById('btnCopyAdminWallet')?.addEventListener('click', (e) => {
  const btn = document.getElementById('btnCopyAdminWallet');
  const wallet = document.getElementById('adminFinanceModalWallet')?.innerText;
  if (!wallet) return;
  navigator.clipboard.writeText(wallet).then(() => {
    const icon = btn ? btn.querySelector('i') : null;
    if (icon) {
      icon.className = 'fa-solid fa-check text-emerald-400 text-[11px]';
      if(navigator.vibrate) navigator.vibrate(50);
      setTimeout(() => icon.className = 'fa-regular fa-copy text-[11px]', 2000);
    }
  });
});

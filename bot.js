require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');

// ==========================================
// 1. Инициализация Express (API Сервер)
// ==========================================
const app = express();
app.use(cors());
app.use(express.json());

const path = require('path');
app.use(express.static(__dirname));

const PORT = process.env.PORT || 3000;

// ==========================================
// 2. Схемы и модели Mongoose (MongoDB)
// ==========================================
const UserSchema = new mongoose.Schema({
  telegramId: { type: Number, required: true, unique: true },
  username: String,
  firstName: String,
  referredBy: Number,
  balance: { type: Number, default: 0 },
  totalEarned: { type: Number, default: 0 },
  profitPerHour: { type: Number, default: 0 },
  tapValue: { type: Number, default: 0.0001 },
  energy: { type: Number, default: 500 },
  maxEnergy: { type: Number, default: 500 },
  upgrades: { type: Object, default: {} },
  completedTasks: { type: [String], default: [] },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isBanned: { type: Boolean, default: false },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  link: String,
  reward: Number,
  maxCompletions: { type: Number, default: 0 }, // 0 = unlimited
  completionsCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const TransactionSchema = new mongoose.Schema({
  telegramId: Number,
  type: { type: String, enum: ['deposit', 'withdrawal'] },
  amount: Number, // В токенах ₮
  network: String, // TON, TRC20, etc.
  walletAddress: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

const PromoCodeSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  reward: Number,
  maxActivations: Number,
  activationsCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
});

const User = mongoose.model('User', UserSchema);
const Task = mongoose.model('Task', TaskSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);
const PromoCode = mongoose.model('PromoCode', PromoCodeSchema);

// ==========================================
// 3. Подключение к MongoDB
// ==========================================
mongoose.connect('mongodb+srv://narekmxeyan2025_db_user:3IiwklihBaGtR5c7@cluster0.ucx8kac.mongodb.net/?appName=Cluster0', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('✅ MongoDB успешно подключена'))
  .catch(err => console.error('❌ Ошибка MongoDB:', err));

// ==========================================
// 4. API Маршруты для Mini App (Фронтенда)
// ==========================================

// Получить данные пользователя или создать нового
app.get('/api/user/:telegramId', async (req, res) => {
  try {
    const { telegramId } = req.params;
    let user = await User.findOne({ telegramId });
    if (!user) {
      user = new User({ telegramId });
      await user.save();
    }
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Синхронизация прогресса (сохранение баланса, энергии, карточек)
app.post('/api/user/sync', async (req, res) => {
  try {
    const { telegramId, state } = req.body;
    let user = await User.findOne({ telegramId });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.balance = state.balance;
    user.totalEarned = state.totalEarned;
    user.profitPerHour = state.profitPerHour;
    user.tapValue = state.tapValue;
    user.energy = state.energy;
    user.maxEnergy = state.maxEnergy;
    user.upgrades = state.upgrades;
    user.completedTasks = state.completedTasks;
    user.lastActive = new Date();
    
    await user.save();
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Создать заявку на вывод
app.post('/api/finance/withdraw', async (req, res) => {
  try {
    const { telegramId, amount, walletAddress, network } = req.body;
    const user = await User.findOne({ telegramId });
    
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.balance < amount) return res.status(400).json({ success: false, message: 'Insufficient balance' });

    // Списываем баланс
    user.balance -= amount;
    await user.save();

    // Создаем транзакцию
    const tx = new Transaction({
      telegramId,
      type: 'withdrawal',
      amount,
      walletAddress,
      network,
      status: 'pending'
    });
    await tx.save();

    res.json({ success: true, transaction: tx });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- API для Админ Панели ---
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ lastActive: { $gte: new Date(Date.now() - 24*60*60*1000) } });
    
    // Агрегация для подсчета общего баланса
    const balanceAggr = await User.aggregate([{ $group: { _id: null, total: { $sum: "$balance" } } }]);
    const totalBalance = balanceAggr[0] ? balanceAggr[0].total : 0;

    res.json({ success: true, stats: { totalUsers, activeUsers, totalBalance } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/admin/finance/pending', async (req, res) => {
  try {
    const transactions = await Transaction.find({ type: 'withdrawal', status: 'pending' }).sort({ createdAt: -1 });
    res.json({ success: true, transactions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Запуск Express Сервера
app.listen(PORT, () => {
  console.log(`🌐 Express API сервер запущен на порту ${PORT}`);
});


// ==========================================
// 5. Инициализация Telegram Бота (Telegraf)
// ==========================================
const bot = new Telegraf('8318713550:AAHx6Itvy587qVLgTz9vC1c2dEF5ELMs6Ko');
const WEB_APP_URL = 'https://combat.onrender.com'; 

// Обработка команды /start
bot.start(async (ctx) => {
  const telegramId = ctx.from.id;
  const username = ctx.from.username || '';
  const firstName = ctx.from.first_name || 'Игрок';
  const startPayload = ctx.payload; 

  try {
    let user = await User.findOne({ telegramId });
    if (!user) {
      let referredBy = null;
      if (startPayload && !isNaN(startPayload) && Number(startPayload) !== telegramId) {
        referredBy = Number(startPayload);
        // Можно сразу начислить бонус рефереру здесь
      }
      user = new User({ telegramId, username, firstName, referredBy });
      await user.save();
    } else {
      user.lastActive = new Date();
      await user.save();
    }

    if (user.isBanned) {
      return ctx.reply('❌ Ваш аккаунт заблокирован.');
    }

    const welcomeText = `Привет, ${firstName}! 👋\n\nДобро пожаловать в Crypto Evolution Clicker! 🚀`;
    await ctx.reply(welcomeText, Markup.inlineKeyboard([
      [Markup.button.webApp('🎮 Играть', WEB_APP_URL)]
    ]));
  } catch (error) {
    console.error('Ошибка /start:', error);
  }
});

bot.launch().then(() => console.log('🤖 Telegram Бот успешно запущен...'));
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

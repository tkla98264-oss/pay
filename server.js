<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PayRewards App - 100% Auto Add</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        
        body { 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            background-color: #f8fafc; 
            margin: 0;
            overflow-x: hidden;
        }
        
        .app-screen {
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            display: none;
            flex-direction: column;
            background-color: #f8fafc;
            min-height: 100vh;
            z-index: 10;
        }
        
        .app-screen.active {
            display: flex;
            animation: fadeIn 0.4s ease-in-out forwards;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        /* Scratch Card */
        .scratch-container {
            position: relative;
            width: 280px;
            height: 280px;
            margin: 0 auto;
            border-radius: 1.5rem;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            cursor: pointer;
            border: 4px solid #fff;
        }
        
        .scratch-cover {
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: white;
            z-index: 10;
            transition: opacity 0.8s ease, transform 0.8s ease;
        }

        .scratch-cover.scratched {
            opacity: 0;
            transform: scale(1.1);
            pointer-events: none;
        }

        .scratch-content {
            position: absolute;
            inset: 0;
            background: radial-gradient(circle, #ffffff 0%, #f0fdf4 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 5;
        }

        .pop-animation {
            animation: pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        @keyframes pop {
            0% { transform: scale(0.8); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }

        input[type=number]::-webkit-inner-spin-button, 
        input[type=number]::-webkit-outer-spin-button { 
            -webkit-appearance: none; 
            margin: 0; 
        }

        /* Radar Animation for waiting screen */
        .radar-spinner {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 4px solid rgba(99, 102, 241, 0.2);
            border-top-color: #6366f1;
            animation: spin 1s infinite linear;
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
    </style>
</head>
<body class="w-full min-h-screen">

    <div id="dbStatus" class="fixed top-2 left-2 z-[300] bg-orange-500 text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-lg flex items-center gap-1">
        <i class="fas fa-database"></i> Connecting...
    </div>

    <!-- ==================== LOGIN SCREEN ==================== -->
    <div id="loginScreen" class="app-screen active">
        <div class="flex-1 bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 flex flex-col items-center justify-center p-6 min-h-screen w-full">
            <div class="w-full max-w-md">
                <div class="flex flex-col justify-center items-center text-center mb-10">
                    <div class="w-24 h-24 bg-white/10 rounded-3xl backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl mb-6 pop-animation">
                        <i class="fas fa-bolt text-5xl text-yellow-400"></i>
                    </div>
                    <h1 class="text-4xl font-extrabold text-white tracking-tight mb-2 pop-animation" style="animation-delay: 0.1s;">PayRewards</h1>
                    <p class="text-indigo-200 text-sm font-medium pop-animation" style="animation-delay: 0.2s;">100% Auto-Add via Render API</p>
                </div>

                <div class="bg-white rounded-[2rem] p-8 shadow-2xl w-full pop-animation" style="animation-delay: 0.3s;">
                    <div class="space-y-5">
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mobile Number</label>
                            <div class="relative flex items-center bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-indigo-500 transition-all overflow-hidden">
                                <div class="pl-4 pr-3 py-4 flex items-center justify-center text-gray-400 border-r border-gray-200 font-bold text-gray-600">+91</div>
                                <input type="tel" id="loginPhone" placeholder="Enter 10 digit number" class="w-full pl-3 pr-4 py-4 bg-transparent outline-none text-gray-800 font-semibold" maxlength="10">
                            </div>
                        </div>
                        <div>
                            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Secure PIN</label>
                            <div class="relative flex items-center bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-indigo-500 transition-all overflow-hidden">
                                <div class="pl-4 pr-3 py-4 flex items-center justify-center text-gray-400 border-r border-gray-200"><i class="fas fa-lock"></i></div>
                                <input type="password" id="loginPin" placeholder="Enter 4 digit PIN" class="w-full pl-3 pr-4 py-4 bg-transparent outline-none text-gray-800 font-bold tracking-[0.2em]" maxlength="4">
                            </div>
                        </div>
                        
                        <button id="loginBtn" onclick="window.handleLogin()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-[0.98] mt-6 flex items-center justify-center gap-2">
                            Secure Login <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ==================== DASHBOARD SCREEN ==================== -->
    <div id="dashboardScreen" class="app-screen bg-gray-50">
        <div class="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 shadow-lg">
            <div class="max-w-4xl mx-auto px-6 py-8">
                <div class="flex justify-between items-center mb-8">
                    <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-full bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-sm">
                            <i class="fas fa-user text-white text-2xl"></i>
                        </div>
                        <div>
                            <p class="text-indigo-200 text-sm font-medium">Namaste,</p>
                            <p class="text-white font-bold text-2xl" id="userNameDisplay">User</p>
                        </div>
                    </div>
                    <button onclick="window.logout()" class="px-5 py-2.5 rounded-full bg-white/10 text-white font-semibold backdrop-blur-sm border border-white/10 hover:bg-red-500/80 transition flex items-center gap-2">
                        <i class="fas fa-sign-out-alt"></i> Logout
                    </button>
                </div>
                
                <div class="bg-white/10 p-6 rounded-3xl backdrop-blur-md border border-white/20 inline-block w-full sm:w-auto min-w-[300px]">
                    <p class="text-indigo-100 text-sm font-medium mb-2 uppercase tracking-wide">Total Main Balance</p>
                    <h2 class="text-5xl font-extrabold text-white">₹<span id="uiMainBalance">0</span></h2>
                </div>
            </div>
        </div>

        <div class="flex-1 w-full max-w-4xl mx-auto px-6 py-10 pb-32">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="bg-gradient-to-r from-amber-400 to-pink-500 rounded-[2rem] p-8 shadow-xl text-white flex justify-between items-center relative overflow-hidden">
                    <div class="relative z-10">
                        <p class="text-white/90 font-medium text-sm mb-2 uppercase">Cashback Wallet</p>
                        <p class="text-4xl font-extrabold">₹<span id="uiCashbackBalance">0</span></p>
                    </div>
                    <div class="relative z-10 w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <i class="fas fa-gift text-3xl text-white"></i>
                    </div>
                </div>

                <div class="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 flex flex-col justify-center">
                    <div class="flex justify-between items-end mb-4">
                        <div>
                            <h3 class="text-gray-800 font-bold text-lg">Withdrawal Rule</h3>
                            <p class="text-sm text-gray-500">Add money 10 times to unlock</p>
                        </div>
                        <div class="text-right">
                            <span class="text-3xl font-extrabold text-indigo-600" id="uiPaymentCount">0</span>
                            <span class="text-lg text-gray-400 font-bold">/ 10</span>
                        </div>
                    </div>
                    <div class="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-4">
                        <div id="progressBar" class="bg-indigo-500 h-full w-0 transition-all duration-500"></div>
                    </div>
                    <div class="flex items-center text-sm font-bold" id="withdrawalLockText">
                        <i class="fas fa-lock text-red-500 mr-2"></i> <span class="text-gray-600">Main Wallet Locked</span>
                    </div>
                </div>
            </div>

            <h3 class="font-bold text-gray-800 text-xl mb-6 px-2">Services</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <button onclick="window.navigate('qrPayScreen')" class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:border-indigo-200 transition-all flex flex-col items-center justify-center text-center gap-4 group">
                    <div class="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <i class="fas fa-plus-circle"></i>
                    </div>
                    <div>
                        <span class="font-extrabold text-gray-800 text-lg block">Add Money</span>
                        <span class="text-sm text-gray-500 font-medium mt-1 block">100% Auto-Update via API</span>
                    </div>
                </button>
                
                <button onclick="window.navigate('withdrawScreen')" class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-lg hover:border-pink-200 transition-all flex flex-col items-center justify-center text-center gap-4 group">
                    <div class="w-20 h-20 bg-pink-50 text-pink-600 rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 group-hover:bg-pink-600 group-hover:text-white transition-all">
                        <i class="fas fa-paper-plane"></i>
                    </div>
                    <div>
                        <span class="font-extrabold text-gray-800 text-lg block">Withdraw</span>
                        <span class="text-sm text-gray-500 font-medium mt-1 block">Transfer to Bank</span>
                    </div>
                </button>
            </div>
        </div>
    </div>

    <!-- ==================== NEW ADD MONEY SCREEN (UPIGateway) ==================== -->
    <div id="qrPayScreen" class="app-screen bg-white">
        <div class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-20">
            <div class="max-w-4xl mx-auto pt-8 pb-4 px-6 flex items-center">
                <button onclick="window.navigate('dashboardScreen')" class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition text-lg">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2 class="font-bold text-2xl text-gray-800 ml-6">Add Money to Wallet</h2>
            </div>
        </div>
        
        <div class="flex-1 w-full max-w-2xl mx-auto p-6 py-10 flex flex-col items-center">
            
            <div id="setupBox" class="bg-gray-50 p-8 rounded-[2rem] w-full border border-gray-100 shadow-sm text-center mb-8">
                <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                    <i class="fas fa-indian-rupee-sign"></i>
                </div>
                <h3 class="font-bold text-xl text-gray-800 mb-2">Enter Amount</h3>
                <p class="text-gray-500 text-sm mb-6">Minimum ₹99. Powered by UPIGateway Secure API.</p>
                
                <div class="flex justify-center items-center text-5xl font-extrabold text-gray-800 mb-8 bg-white p-4 rounded-2xl border border-gray-200 shadow-inner w-max mx-auto px-8">
                    <span class="text-gray-400 mr-2">₹</span>
                    <input type="number" id="qrAmountInput" class="w-40 outline-none bg-transparent text-center" placeholder="99" min="99">
                </div>

                <!-- Call to Render Server Button -->
                <button id="payNowBtn" onclick="window.generateDynamicQR()" class="bg-indigo-600 text-white font-bold py-4 px-10 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 text-lg w-full sm:w-auto flex justify-center items-center gap-3">
                    <i class="fas fa-bolt"></i> Generate Payment Link
                </button>
            </div>

            <!-- Waiting / Listening Area -->
            <div id="qrDisplayArea" class="hidden flex-col items-center justify-center w-full max-w-sm bg-white p-10 rounded-[2rem] border-2 border-indigo-100 shadow-xl pop-animation relative text-center">
                
                <div class="radar-spinner mb-6 mx-auto"></div>
                <h3 class="font-bold text-gray-800 text-xl mb-2">Awaiting Payment...</h3>
                <p class="text-sm text-gray-500 mb-4">A secure payment page has been opened in a new tab.</p>
                
                <div class="bg-yellow-50 text-yellow-800 p-4 rounded-xl text-xs font-bold border border-yellow-200 mb-4">
                    <i class="fas fa-exclamation-triangle mr-1"></i> Please DO NOT close this page!
                </div>
                <p class="text-[11px] text-gray-400">Jaise hi aap payment complete karenge, ye app automatically detect kar lega aur balance add ho jayega.</p>
                
                <button onclick="window.navigate('dashboardScreen')" class="mt-6 text-indigo-500 font-bold text-sm hover:underline">Cancel / Go Back</button>
            </div>

        </div>
    </div>

    <!-- Withdraw Screen (Same as before) -->
    <div id="withdrawScreen" class="app-screen bg-gray-50">
        <!-- Header -->
        <div class="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-20">
            <div class="max-w-4xl mx-auto pt-8 pb-4 px-6 flex items-center">
                <button onclick="window.navigate('dashboardScreen')" class="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200 transition text-lg">
                    <i class="fas fa-arrow-left"></i>
                </button>
                <h2 class="font-bold text-2xl text-gray-800 ml-6">Transfer to Bank</h2>
            </div>
        </div>
        
        <div class="flex-1 w-full max-w-2xl mx-auto p-6 py-10">
            <h3 class="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider">Select Source Wallet</h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <label class="block relative p-6 bg-white border-2 rounded-[2rem] cursor-pointer hover:border-pink-300 transition-all has-[:checked]:border-pink-500 has-[:checked]:bg-pink-50 shadow-sm">
                    <div class="flex flex-col gap-4">
                        <div class="flex justify-between items-start">
                            <div class="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500"><i class="fas fa-gift text-2xl"></i></div>
                            <input type="radio" name="withdrawSource" value="cashback" class="w-6 h-6 accent-pink-500" checked>
                        </div>
                        <div>
                            <p class="font-bold text-gray-800 text-lg">Cashback Wallet</p>
                            <p class="text-md font-bold text-pink-500 mt-1">Available: ₹<span id="wdCashbackBal">0</span></p>
                        </div>
                    </div>
                </label>

                <label class="block relative p-6 bg-white border-2 rounded-[2rem] cursor-pointer transition-all has-[:checked]:border-indigo-500 has-[:checked]:bg-indigo-50 shadow-sm overflow-hidden" id="mainRadioLabel">
                    <div class="flex flex-col gap-4 relative z-10">
                        <div class="flex justify-between items-start">
                            <div class="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-500"><i class="fas fa-wallet text-2xl"></i></div>
                            <input type="radio" name="withdrawSource" value="main" class="w-6 h-6 accent-indigo-500" id="mainRadio">
                        </div>
                        <div>
                            <p class="font-bold text-gray-800 text-lg">Main Wallet</p>
                            <p class="text-md font-bold text-indigo-500 mt-1">Available: ₹<span id="wdMainBal">0</span></p>
                        </div>
                    </div>
                    <div id="mainWalletLock" class="absolute inset-0 bg-white/80 backdrop-blur-[2px] z-20 flex items-center justify-center pointer-events-none">
                        <div class="bg-red-50 px-4 py-2 rounded-full border border-red-100 shadow-sm flex items-center gap-2">
                            <i class="fas fa-lock text-red-500"></i><span class="text-sm font-bold text-red-600">Wallet Locked</span>
                        </div>
                    </div>
                </label>
            </div>

            <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 mb-8">
                <div class="mb-6">
                    <label class="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Recipient UPI ID</label>
                    <div class="relative flex items-center bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-indigo-500 transition-colors">
                        <input type="text" id="withdrawUpi" placeholder="example@okhdfc" class="w-full px-5 py-4 bg-transparent outline-none text-gray-800 font-bold text-lg">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Withdrawal Amount</label>
                    <div class="relative flex items-center bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-indigo-500 transition-colors">
                        <span class="pl-5 font-bold text-gray-500 text-xl">₹</span>
                        <input type="number" id="withdrawAmount" placeholder="0" class="w-full px-3 py-4 bg-transparent outline-none text-gray-800 font-bold text-2xl">
                    </div>
                </div>
            </div>

            <button onclick="window.handleWithdraw()" class="w-full bg-indigo-600 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95 text-lg">
                Transfer Money to Bank Now
            </button>
        </div>
    </div>

    <!-- Scratch Card Modal -->
    <div id="scratchModal" class="fixed inset-0 bg-slate-900/95 z-[100] flex items-center justify-center flex-col hidden backdrop-blur-md">
        <div class="text-center mb-10 pop-animation w-full max-w-lg">
            <h2 class="text-white text-4xl md:text-5xl font-extrabold mb-4">Payment Success! 🎉</h2>
            <p class="text-indigo-200 text-lg font-medium">Auto-captured successfully. Tap to reveal your 10% bonus</p>
        </div>
        
        <div class="scratch-container pop-animation" onclick="window.revealScratchCard()" style="animation-delay: 0.2s;">
            <div class="scratch-content text-center p-6">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-4 shadow-inner">
                    <i class="fas fa-check text-3xl"></i>
                </div>
                <p class="text-gray-500 text-lg font-bold mb-1">Cashback Won</p>
                <p class="text-6xl font-extrabold text-green-500 mb-2 drop-shadow-sm">₹<span id="wonAmount">0</span></p>
            </div>
            <div id="scratchCover" class="scratch-cover">
                <i class="fas fa-magic text-5xl mb-4 opacity-90 drop-shadow-md"></i>
                <span class="text-xl tracking-wider">Tap to Scratch</span>
            </div>
        </div>

        <button id="closeScratchBtn" onclick="window.closeScratchModal()" class="mt-14 bg-white text-gray-900 font-extrabold py-4 px-12 rounded-full hidden pop-animation hover:bg-gray-100 transition-transform active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.4)] text-lg">
            Collect in Wallet
        </button>
    </div>

    <!-- Notification Toast -->
    <div id="toast" class="fixed top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl opacity-0 transition-all duration-300 pointer-events-none z-[200] flex items-center gap-3 font-bold text-md w-max max-w-[90%]">
        <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0"><i class="fas fa-info text-sm"></i></div>
        <span id="toastMsg" class="truncate">Message</span>
    </div>

    <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, setDoc, getDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        // Your Firebase Config
        const firebaseConfig = {
            apiKey: "AIzaSyCfVZFkOR64AhzinoBmoCsAF35yBhDNADw",
            authDomain: "payy-a9819.firebaseapp.com",
            projectId: "payy-a9819",
            storageBucket: "payy-a9819.firebasestorage.app",
            messagingSenderId: "807167228969",
            appId: "1:807167228969:web:f119a50646343b95993038"
        };
        
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const db = getFirestore(app);
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        
        let walletDocRef = null;
        let unsubscribeSnapshot = null;

        let appState = {
            mainBalance: 0,
            cashbackBalance: 0,
            paymentCount: 0,
            pendingCashbackAmount: 0,
            userPhone: "" // Storing user phone for Render API
        };

        let isInitialLoad = true;

        function setDbStatus(message, colorClass) {
            const statusDiv = document.getElementById('dbStatus');
            statusDiv.innerHTML = message;
            statusDiv.className = `fixed top-2 left-2 z-[300] text-white text-[10px] px-2 py-1 rounded-full font-bold shadow-lg flex items-center gap-1 ${colorClass}`;
        }

        async function initAuth() {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await import("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js").then(m => m.signInWithCustomToken(auth, __initial_auth_token));
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Auth error:", error);
            }
        }

        initAuth();

        onAuthStateChanged(auth, (user) => {
            if (user) setDbStatus('<i class="fas fa-check-circle"></i> Connected', 'bg-green-500');
        });

        // ==========================================================
        // Firebase Listener: This will Auto-trigger Scratch Card!
        // ==========================================================
        function listenToFirebaseDB() {
            if(unsubscribeSnapshot) unsubscribeSnapshot();

            unsubscribeSnapshot = onSnapshot(walletDocRef, (docSnap) => {
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    
                    const balanceDiff = data.mainBalance - appState.mainBalance;
                    const countDiff = data.paymentCount - appState.paymentCount;

                    // AUTO ADD DETECTED FROM RENDER WEBHOOK!
                    if (!isInitialLoad && balanceDiff > 0 && countDiff > 0) {
                        appState.pendingCashbackAmount = parseFloat((balanceDiff * 0.10).toFixed(2));
                        
                        // Close any open screens and pop up scratch card automatically
                        setTimeout(() => {
                            window.showScratchModal(appState.pendingCashbackAmount);
                        }, 500);
                    }

                    appState.mainBalance = data.mainBalance || 0;
                    appState.cashbackBalance = data.cashbackBalance || 0;
                    appState.paymentCount = data.paymentCount || 0;

                    updateUI();
                    isInitialLoad = false;
                } else {
                    isInitialLoad = false;
                }
            }, (error) => {
                console.error("Firestore Listen Error:", error);
            });
        }

        window.navigate = function(screenId) {
            document.querySelectorAll('.app-screen').forEach(el => el.classList.remove('active'));
            setTimeout(() => document.getElementById(screenId).classList.add('active'), 10);
            updateUI();

            if(screenId === 'qrPayScreen') {
                document.getElementById('setupBox').classList.remove('hidden');
                document.getElementById('qrDisplayArea').classList.add('hidden');
                document.getElementById('qrAmountInput').value = '';
            }
        }

        window.showToast = function(message) {
            const toast = document.getElementById('toast');
            document.getElementById('toastMsg').innerText = message;
            toast.style.opacity = '1';
            toast.style.transform = 'translate(-50%, 20px)';
            setTimeout(() => { 
                toast.style.opacity = '0'; 
                toast.style.transform = 'translate(-50%, 0)';
            }, 3000);
        }

        window.handleLogin = async function() {
            const phone = document.getElementById('loginPhone').value;
            const pin = document.getElementById('loginPin').value;
            const loginBtn = document.getElementById('loginBtn');
            
            if(phone.length !== 10 || pin.length !== 4) {
                window.showToast("Sahi 10-digit Mobile aur 4-digit PIN dalein");
                return;
            }

            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
            loginBtn.disabled = true;

            try {
                const accountRef = doc(db, 'artifacts', appId, 'public', 'data', 'accounts', phone);
                const docSnap = await getDoc(accountRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.pin !== pin) {
                        window.showToast("Galat PIN! Kripya sahi PIN dalein.");
                        loginBtn.innerHTML = 'Secure Login <i class="fas fa-arrow-right"></i>';
                        loginBtn.disabled = false;
                        return;
                    }
                    window.showToast("Welcome Back!");
                } else {
                    await setDoc(accountRef, { pin: pin, mainBalance: 0, cashbackBalance: 0, paymentCount: 0 });
                    window.showToast("New Account Created & Saved!");
                }

                appState.userPhone = phone;
                walletDocRef = accountRef;
                isInitialLoad = true;
                listenToFirebaseDB();

                loginBtn.innerHTML = 'Secure Login <i class="fas fa-arrow-right"></i>';
                loginBtn.disabled = false;
                document.getElementById('userNameDisplay').innerText = phone.substring(0, 4) + 'xxx';
                window.navigate('dashboardScreen');

            } catch (error) {
                window.showToast("Network Error! Firebase connect nahi hua.");
                loginBtn.innerHTML = 'Secure Login <i class="fas fa-arrow-right"></i>';
                loginBtn.disabled = false;
            }
        }

        window.logout = function() {
            if (unsubscribeSnapshot) { unsubscribeSnapshot(); unsubscribeSnapshot = null; }
            walletDocRef = null;
            appState = { mainBalance: 0, cashbackBalance: 0, paymentCount: 0, pendingCashbackAmount: 0, userPhone: "" };
            updateUI();
            document.getElementById('loginPhone').value = '';
            document.getElementById('loginPin').value = '';
            window.navigate('loginScreen');
        }

        // ==========================================================
        // CALL RENDER.COM SERVER TO GENERATE REAL PAYMENT LINK
        // ==========================================================
        window.generateDynamicQR = async function() {
            const amountInput = document.getElementById('qrAmountInput');
            const amount = parseFloat(amountInput.value);

            if (isNaN(amount) || amount < 99) {
                window.showToast("Kam se kam ₹99 enter karein QR generate karne ke liye!");
                return;
            }

            const btn = document.getElementById('payNowBtn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting to Server...';
            btn.disabled = true;

            try {
                // YOUR RENDER SERVER API
                const response = await fetch('https://pay-4lgt.onrender.com/api/create-payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        amount: amount,
                        phone: appState.userPhone // Sent to backend to know whose wallet to update
                    })
                });

                const data = await response.json();

                if (data.success && data.payment_url) {
                    window.showToast("Opening Secure Payment Page...");
                    
                    // Show "Waiting" screen
                    document.getElementById('setupBox').classList.add('hidden');
                    document.getElementById('qrDisplayArea').classList.remove('hidden');

                    // Open UPIGateway Payment Link in a NEW TAB
                    window.open(data.payment_url, '_blank');
                } else {
                    window.showToast("Error: " + (data.message || "Could not generate link"));
                }
            } catch (error) {
                console.error("API Error:", error);
                window.showToast("Server Error! Render API se connect nahi hua.");
            } finally {
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        }

        window.showScratchModal = function(amount) {
            document.getElementById('wonAmount').innerText = amount;
            document.getElementById('scratchCover').classList.remove('scratched');
            document.getElementById('closeScratchBtn').classList.add('hidden');
            document.getElementById('scratchModal').classList.remove('hidden');
        }

        window.revealScratchCard = function() {
            const cover = document.getElementById('scratchCover');
            if(!cover.classList.contains('scratched') && walletDocRef) {
                cover.classList.add('scratched');
                setTimeout(async () => {
                    await setDoc(walletDocRef, {
                        cashbackBalance: appState.cashbackBalance + appState.pendingCashbackAmount
                    }, { merge: true });
                    document.getElementById('closeScratchBtn').classList.remove('hidden');
                }, 800);
            }
        }

        window.closeScratchModal = function() {
            document.getElementById('scratchModal').classList.add('hidden');
            window.navigate('dashboardScreen');
        }

        window.handleWithdraw = async function() {
            if(!walletDocRef) return;
            const amount = parseFloat(document.getElementById('withdrawAmount').value);
            const upi = document.getElementById('withdrawUpi').value;
            const source = document.querySelector('input[name="withdrawSource"]:checked').value;

            if(!upi.includes('@')) { window.showToast("Sahi UPI ID dalein!"); return; }
            if(isNaN(amount) || amount <= 0) { window.showToast("Sahi amount enter karein!"); return; }

            let updates = {};
            if(source === 'main') {
                if(appState.paymentCount < 10) { window.showToast("Main Wallet locked."); return; }
                if(amount > appState.mainBalance) { window.showToast("Balance kam hai!"); return; }
                updates.mainBalance = appState.mainBalance - amount;
            } else if(source === 'cashback') {
                if(amount > appState.cashbackBalance) { window.showToast("Balance kam hai!"); return; }
                updates.cashbackBalance = appState.cashbackBalance - amount;
            }

            await setDoc(walletDocRef, updates, { merge: true });
            document.getElementById('withdrawAmount').value = '';
            window.showToast(`₹${amount} withdraw processing!`);
            setTimeout(() => window.navigate('dashboardScreen'), 1500);
        }

        function updateUI() {
            document.getElementById('uiMainBalance').innerText = appState.mainBalance.toFixed(2);
            document.getElementById('uiCashbackBalance').innerText = appState.cashbackBalance.toFixed(2);
            document.getElementById('uiPaymentCount').innerText = appState.paymentCount;
            
            const progressPercent = Math.min((appState.paymentCount / 10) * 100, 100);
            document.getElementById('progressBar').style.width = `${progressPercent}%`;

            const lockText = document.getElementById('withdrawalLockText');
            if(appState.paymentCount >= 10) {
                lockText.innerHTML = '<i class="fas fa-check-circle text-green-500 mr-2"></i> <span class="text-green-600 font-bold">Unlocked!</span>';
                document.getElementById('progressBar').classList.add('bg-green-500');
                document.getElementById('progressBar').classList.remove('bg-indigo-500');
            } else {
                lockText.innerHTML = '<i class="fas fa-lock text-red-500 mr-2"></i> <span class="text-gray-600">Locked</span>';
            }

            document.getElementById('wdCashbackBal').innerText = appState.cashbackBalance.toFixed(2);
            document.getElementById('wdMainBal').innerText = appState.mainBalance.toFixed(2);
            
            const mainRadio = document.getElementById('mainRadio');
            const mainLock = document.getElementById('mainWalletLock');
            const mainRadioLabel = document.getElementById('mainRadioLabel');
            
            if(appState.paymentCount >= 10) {
                if(mainRadio) mainRadio.disabled = false;
                if(mainLock) mainLock.classList.add('hidden');
                if(mainRadioLabel) mainRadioLabel.classList.remove('opacity-70', 'cursor-not-allowed');
            } else {
                if(mainRadio) { mainRadio.disabled = true; mainRadio.checked = false; }
                const cbRadio = document.querySelector('input[value="cashback"]');
                if(cbRadio) cbRadio.checked = true;
                if(mainLock) mainLock.classList.remove('hidden');
                if(mainRadioLabel) mainRadioLabel.classList.add('opacity-70', 'cursor-not-allowed');
            }
        }

        window.onload = () => window.navigate('loginScreen');
    </script>
</body>
</html>

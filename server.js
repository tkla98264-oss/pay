// ==========================================================================
// PayRewards - Backend Server (Node.js) for UPIGateway & Firebase Auto-Add
// Host this file on Render.com
// ==========================================================================

const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');
const cors = require('cors');

// 1. FIREBASE ADMIN SETUP
// (Render.com par 'Environment Variables' me apna serviceAccount json dalna hoga)
// Demo ke liye yahan structure banaya gaya hai:
try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON); 
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Connected!");
} catch (error) {
    console.warn("Warning: Firebase Admin not configured properly yet.");
}

const db = admin.firestore();
const app = express();

// Middleware
app.use(express.json()); // Webhook data parse karne ke liye
app.use(cors()); // App (Frontend) se request allow karne ke liye

// Aapki UPIGateway API Key
const UPI_GATEWAY_KEY = process.env.UPI_KEY || "d3bbe951-6080-4660-a7cf-3687e0801654"; 

// ==========================================================================
// API 1: CREATE PAYMENT ORDER (Frontend App yahan request bhejega)
// ==========================================================================
app.post('/api/create-payment', async (req, res) => {
    try {
        const { amount, phone } = req.body; // Frontend se User ka Number aur Amount aayega
        
        // Ek unique Transaction ID banayein
        const clientTxnId = "PAY_" + Date.now() + Math.floor(Math.random() * 1000);

        // UPIGateway ko request bhejein
        const response = await axios.post('https://upigateway.com/api/create_order', {
            key: UPI_GATEWAY_KEY,
            client_txn_id: clientTxnId,
            amount: amount.toString(),
            p_info: "PayRewards Wallet Recharge",
            customer_name: "PayRewards User",
            customer_email: "user@payrewards.com",
            customer_mobile: phone,
            redirect_url: "https://your-website.com/payment-success", // Optional
            udf1: phone, // MOST IMPORTANT: Yahan hum user ka number save kar rahe hain taaki baad me pata chale kisne pay kiya
            udf2: "WalletAdd",
            udf3: "App"
        });

        if (response.data.status === true) {
            // Success! UPIGateway ne payment link de diya hai
            res.json({ 
                success: true, 
                payment_url: response.data.data.payment_url // Yeh link hum App me kholenge
            });
        } else {
            res.json({ success: false, message: response.data.msg });
        }

    } catch (error) {
        console.error("Order Creation Error:", error.message);
        res.status(500).json({ success: false, message: "Gateway Server Error" });
    }
});

// ==========================================================================
// API 2: THE WEBHOOK (UPIGateway yahan auto-message bhejega payment ke baad)
// ==========================================================================
app.post('/api/webhook', async (req, res) => {
    const data = req.body;
    console.log("Webhook Received from UPIGateway:", data);

    // UPIGateway status 'success' bhejta hai jab payment poora ho jata hai
    if (data.status === 'success' || data.status === 'SUCCESS') {
        
        const phone = data.udf1; // Create Order me jo number bheja tha, wo wapas aayega
        const amountReceived = parseFloat(data.amount);
        const upiRefId = data.upi_txn_id; // Bank UTR No. (Record ke liye)

        // ---------------------------------------------------------
        // AUTO-ADD MAGIC: Firebase Database me paise add karein
        // ---------------------------------------------------------
        try {
            // Note: Canvas app me humne 'phone' ko hi document ID banaya tha
            const appId = 'default-app-id';
            const accountRef = db.doc(`artifacts/${appId}/public/data/accounts/${phone}`);

            // Transaction run karein taaki balance bilkul sahi add ho
            await db.runTransaction(async (transaction) => {
                const docSnap = await transaction.get(accountRef);
                
                if (docSnap.exists) {
                    const currentBalance = docSnap.data().mainBalance || 0;
                    const currentCount = docSnap.data().paymentCount || 0;

                    transaction.update(accountRef, {
                        mainBalance: currentBalance + amountReceived,
                        paymentCount: currentCount + 1,
                        lastUtr: upiRefId // Record ke liye bank UTR bhi save kar liya
                    });
                }
            });

            console.log(`✅ Success: ₹${amountReceived} added automatically to ${phone}`);
            
            // UPIGateway ko batana zaroori hai ki humne update kar liya (HTTP 200 OK)
            res.status(200).send("OK"); 

        } catch (dbError) {
            console.error("Firebase Update Failed:", dbError);
            res.status(500).send("Database Error");
        }
    } else {
        // Payment failed ya pending
        console.log("Payment not successful yet:", data.status);
        res.status(200).send("Ignored");
    }
});

// Server Start karein (Render auto port detect karega)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 PayRewards Backend running on port ${PORT}`);
});

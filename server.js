// ==========================================================================
// PayRewards - Backend Server (Node.js) for UPIGateway & Firebase Auto-Add
// Host this file on Render.com
// ==========================================================================

const express = require('express');
const axios = require('axios');
const admin = require('firebase-admin');
const cors = require('cors');

// 1. FIREBASE ADMIN SETUP
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
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); // Gateway Webhook ke liye zaroori
app.use(cors()); 

// Aapki Gateway API Key (Render ke Environment variables se aayegi)
const UPI_GATEWAY_KEY = process.env.UPI_KEY || "d3bbe951-6080-4660-a7cf-3687e0801654"; 

// ==========================================================================
// API 1: CREATE PAYMENT ORDER
// ==========================================================================
app.post('/api/create-payment', async (req, res) => {
    try {
        const { amount, phone } = req.body; 
        
        const clientTxnId = "PAY_" + Date.now() + Math.floor(Math.random() * 1000);

        // URL CORRECTED: Removed '/upi/' from the path.
        const apiUrl = 'https://datazz.store/api/create_order';

        console.log(`Sending request to: ${apiUrl}`);

        const response = await axios.post(apiUrl, {
            key: UPI_GATEWAY_KEY,
            client_txn_id: clientTxnId,
            amount: amount.toString(),
            p_info: "PayRewards Wallet Recharge",
            customer_name: "PayRewards User",
            customer_email: "user@payrewards.com",
            customer_mobile: phone,
            redirect_url: "https://pay-4lgt.onrender.com", 
            udf1: phone, 
            udf2: "WalletAdd",
            udf3: "App"
        });

        if (response.data && response.data.status === true) {
            res.json({ 
                success: true, 
                payment_url: response.data.data.payment_url 
            });
        } else {
            console.error("Gateway Error Response:", response.data);
            res.json({ success: false, message: response.data?.msg || "Gateway rejected the request" });
        }

    } catch (error) {
        // Advanced Error Logging to find out the exact issue
        console.error("Order Creation Error Message:", error.message);
        if (error.response) {
            console.error("Error Status Code:", error.response.status);
            console.error("Error Response Data:", error.response.data);
        }
        res.status(500).json({ success: false, message: "Gateway Server Not Found (404/500) - Check Render Logs" });
    }
});

// ==========================================================================
// API 2: THE WEBHOOK (Payment Success hone par)
// ==========================================================================
app.post('/api/webhook', async (req, res) => {
    const data = req.body;
    console.log("Webhook Received:", data);

    if (data.status === 'success' || data.status === 'SUCCESS') {
        
        const phone = data.udf1; 
        const amountReceived = parseFloat(data.amount);
        const upiRefId = data.upi_txn_id; 

        try {
            const appId = 'default-app-id';
            const accountRef = db.doc(`artifacts/${appId}/public/data/accounts/${phone}`);

            await db.runTransaction(async (transaction) => {
                const docSnap = await transaction.get(accountRef);
                
                if (docSnap.exists) {
                    const currentBalance = docSnap.data().mainBalance || 0;
                    const currentCount = docSnap.data().paymentCount || 0;

                    transaction.update(accountRef, {
                        mainBalance: currentBalance + amountReceived,
                        paymentCount: currentCount + 1,
                        lastUtr: upiRefId 
                    });
                }
            });

            console.log(`✅ Success: ₹${amountReceived} added automatically to ${phone}`);
            res.status(200).send("OK"); 

        } catch (dbError) {
            console.error("Firebase Update Failed:", dbError);
            res.status(500).send("Database Error");
        }
    } else {
        console.log("Payment not successful yet:", data.status);
        res.status(200).send("Ignored");
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 PayRewards Backend running on port ${PORT}`);
});

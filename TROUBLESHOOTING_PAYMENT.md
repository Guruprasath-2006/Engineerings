# 🔧 Payment Error Troubleshooting Guide

## Error: "Failed to initiate payment"

### **Quick Fixes (Try in Order):**

---

## **Fix 1: Test with Cash on Delivery First** ✅

This confirms your basic order system works:

1. Go to checkout
2. Select **"Cash on Delivery"**
3. Click "Place Order"

**Expected:** Order should be created successfully without payment modal.

**If this works:** Problem is only with online payment setup, not your order system.

---

## **Fix 2: Check Backend is Running** 🚀

Make sure backend server is running:

```powershell
# Navigate to backend
cd e:\ACEDEMIC\aroma-luxe\backend

# Start server
npm start
```

**Expected output:**
```
Server running on port 5000
MongoDB connected
```

**If you see errors:** Fix MongoDB connection first.

---

## **Fix 3: Check Browser Console** 🔍

Open browser console (F12 → Console tab) and look for errors:

### **Common Errors & Solutions:**

#### **Error: "Cannot read property 'Razorpay' of undefined"**
**Solution:** Razorpay script didn't load.
```javascript
// Check if script loaded
console.log(window.Razorpay); // Should not be undefined
```

#### **Error: "Network Error" or "ERR_CONNECTION_REFUSED"**
**Solution:** Backend not running or wrong URL.
- Check backend is on port 5000
- Check frontend proxy in package.json

#### **Error: "401 Unauthorized"**
**Solution:** Not logged in or token expired.
- Log out and log in again
- Check if token exists: `localStorage.getItem('token')`

#### **Error: "404 Not Found /api/orders/create-razorpay-order"**
**Solution:** Route not registered.
- Check `backend/routes/orderRoutes.js` has the route
- Restart backend server

---

## **Fix 4: Temporarily Disable Razorpay (Testing Mode)** 🧪

For now, use COD while setting up Razorpay:

**Edit Checkout.js:**

```javascript
// Temporarily force all payments to COD
const onlinePaymentMethods = []; // Empty array = all go to COD

// Now all payment methods will work like COD
```

This lets you test the order system without payment gateway setup.

---

## **Fix 5: Check Razorpay Package Installed** 📦

```powershell
cd e:\ACEDEMIC\aroma-luxe\backend
npm list razorpay
```

**Expected:**
```
razorpay@2.x.x
```

**If not found:**
```powershell
npm install razorpay
```

---

## **Fix 6: Add Console Logs to Debug** 🐛

I've already added console logs. Check browser console for:

```
Starting payment process...
Creating order on backend...
Order created: { success: true, ... }
Opening Razorpay modal...
```

**Where it stops = where the problem is**

---

## **Fix 7: Check Environment Variables** 🔐

**Backend `.env` file:**
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
```

**If you don't have Razorpay keys yet:**
1. Go to https://razorpay.com
2. Sign up (free)
3. Go to Settings → API Keys
4. Generate Test Keys
5. Copy to .env file

**IMPORTANT:** Restart backend after changing .env!

---

## **Fix 8: Check CORS Settings** 🌐

**Backend `server.js` should have:**
```javascript
const cors = require('cors');
app.use(cors()); // ✅ Already there
```

**If CORS error in console:**
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## **Fix 9: Frontend Proxy Check** 🔗

**Frontend `package.json` should have:**
```json
{
  "proxy": "http://localhost:5000"
}
```

**If missing, add it then restart frontend:**
```powershell
cd e:\ACEDEMIC\aroma-luxe\frontend
npm start
```

---

## **Fix 10: Use Demo Mode (No Real Payment)** 🎭

**Create a "Demo Payment" option:**

In `Checkout.js`, add a demo handler:

```javascript
const handleDemoPayment = async (orderData) => {
  // Simulate payment without Razorpay
  console.log('Demo payment - creating order directly');
  
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const response = await axios.post('/api/orders', {
    ...orderData,
    paymentStatus: 'paid', // Mark as paid for demo
    paymentId: 'demo_' + Date.now()
  }, config);

  if (response.data.success) {
    toast.success('Demo payment successful! Order placed.');
    clearCart();
    navigate('/orders');
  }
};
```

---

## **Testing Steps:**

### **Step 1: Test Basic Order (COD)**
```
1. Add product to cart
2. Go to checkout
3. Fill all fields
4. Select "Cash on Delivery"
5. Click "Place Order"

✅ Should work without any payment modal
```

### **Step 2: Check Logs**
```
Open browser console (F12)
Try online payment
Read the logs to see where it fails
```

### **Step 3: Test Backend Endpoint Directly**

Open browser console and run:
```javascript
fetch('http://localhost:5000/api/orders/create-razorpay-order', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  },
  body: JSON.stringify({ amount: 5000 })
})
.then(r => r.json())
.then(d => console.log('Backend Response:', d))
.catch(e => console.error('Error:', e));
```

**Expected response:**
```javascript
{
  success: true,
  razorpayOrderId: "order_xxxxx",
  amount: 500000,
  currency: "INR"
}
```

---

## **Common Issues:**

### **Issue: "Cannot connect to MongoDB"**
**Solution:**
```powershell
# Start MongoDB service
net start MongoDB
```

### **Issue: "Port 5000 already in use"**
**Solution:**
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

### **Issue: "Token not found"**
**Solution:** Log out and log in again
```javascript
// Clear old token
localStorage.clear();
// Then log in again
```

---

## **Current Status Check:**

Run this in your terminal:

```powershell
# Backend running?
curl http://localhost:5000

# Frontend running?
# Open http://localhost:3000 in browser

# MongoDB running?
# Check MongoDB Compass or:
mongo --eval "db.stats()"
```

---

## **Quick Test Script:**

Save this as `test-payment.html` and open in browser:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Payment Test</title>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
<body>
  <h1>Razorpay Test</h1>
  <button onclick="testPayment()">Test Payment</button>
  
  <script>
    function testPayment() {
      if (!window.Razorpay) {
        alert('Razorpay not loaded!');
        return;
      }
      
      alert('Razorpay loaded successfully!');
      
      var options = {
        key: 'rzp_test_YOUR_KEY_HERE',
        amount: 50000,
        currency: 'INR',
        name: 'Test',
        description: 'Test Payment',
        handler: function (response) {
          alert('Payment Success: ' + response.razorpay_payment_id);
        }
      };
      
      var rzp = new Razorpay(options);
      rzp.open();
    }
  </script>
</body>
</html>
```

If this works = Razorpay is fine, issue is in your app integration.

---

## **Recommended Approach:**

**For now, use this workaround:**

1. **Use COD for testing orders** ✅
2. **Set up Razorpay keys later**
3. **Test Razorpay separately**

**This way:**
- Your app works immediately
- Orders can be placed
- You can add payment later

---

## **Contact for Help:**

If still not working, share:
1. Browser console screenshot
2. Backend terminal output
3. Which step fails (from console logs)

---

## **Summary:**

✅ **Immediate fix:** Use "Cash on Delivery" for now
✅ **Backend logs:** Check what error backend shows
✅ **Console logs:** Check browser console for detailed error
✅ **Test endpoint:** Use the fetch test above
✅ **Razorpay keys:** Get from razorpay.com if doing online payments

The error is likely one of:
- Backend not running
- Razorpay package not installed
- Missing environment variables
- CORS or network issue
- Token expired

Try fixes in order above! 🚀

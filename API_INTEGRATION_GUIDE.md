# API Integration Quick Guide

Hướng dẫn nhanh cách tích hợp API services vào các components.

## ✅ Example: WarningScreen (Đã update)

Xem file [WarningScreen.tsx](file:///d:/Github-Repo/ceh-contract-management/contract-management-fe/src/features/warnings/WarningScreen.tsx) để tham khảo pattern hoàn chỉnh.

**Key Changes:**

1. **Import service**:
   ```typescript
   import { warningService } from '@/services';
   ```

2. **Add state management**:
   ```typescript
   const [warnings, setWarnings] = useState<WarningItem[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   ```

3. **Fetch data with useEffect**:
   ```typescript
   useEffect(() => {
     const fetchWarnings = async () => {
       try {
         setLoading(true);
         const data = await warningService.getAll(filters);
         setWarnings(data);
       } catch (err) {
         setError(err.message);
       } finally {
         setLoading(false);
       }
     };
     fetchWarnings();
   }, [dependencies]);
   ```

4. **Handle loading & error states**
5. **Update operations via API**

---

## 📋 Next Components to Update

### 1. Dashboard Screen
```typescript
import { dashboardService } from '@/services';

// Fetch KPIs
const kpis = await dashboardService.getKPIs();
const topCustomers = await dashboardService.getTopCustomers();
```

### 2. Master Data Screens (Customers, Suppliers, etc.)
```typescript
import { masterDataService } from '@/services';

// Fetch customers
const customers = await masterDataService.getCustomers();

// Create new customer
const newCustomer = await masterDataService.create('customers', formData);
```

### 3. Contract Management
```typescript
import { contractService } from '@/services';

// Fetch all contracts
const contracts = await contractService.getAll();

// Get contract detail with all relations
const contract = await contractService.getById(id);

// Add payment term
await contractService.addPaymentTerm(contractId, paymentData);
```

---

## 🔧 Pattern to Follow

**Standard React Component with API:**

```typescript
import { useState, useEffect } from 'react';
import { someService } from '@/services';

export const MyComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await someService.getAll();
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <YourUI data={data} />;
};
```

---

## ⚠️ Important Notes

1. **Authorization**: Backend APIs require auth token. Make sure user is logged in first.
   - Token được tự động thêm vào headers bởi axios interceptor
   - Lưu token sau khi login: `localStorage.setItem('token', token)`

2. **Error Handling**: Always wrap API calls in try-catch

3. **Loading States**: Show loading indicators while fetching

4. **CORS**: Đã được config trong backend (cors enabled)

5. **API Base URL**: Configured in `.env` file
   - Development: `http://localhost:5000/api`
   - Production: Update sau khi deploy

---

## 🚀 Test APIs

Có thể test APIs trước khi integrate vào UI:

**1. Với Thunder Client / Postman:**
- Import collection hoặc manual test
- Base URL: `http://localhost:5000/api`

**2. Với Browser Console:**
```javascript
// Test trong Dev Tools Console
const response = await fetch('http://localhost:5000/api/master-data/customers');
const data = await response.json();
console.log(data);
```

**3. Seed Data First** (Recommended):
Nếu backend chưa có data, seed sample data trước:
```bash
cd contract-management-be
npx sequelize-cli db:seed --seed 20251211045033-seed-master-data.js
```

---

## 📝 Checklist

- [x] WarningScreen - Using API ✅
- [ ] Dashboard - Update to use dashboardService
- [ ] Master Data Screens - Update all CRUD operations
- [ ] Contract Screen - Full integration
- [ ] Reports Screen - Connect to backend data

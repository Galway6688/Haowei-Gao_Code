# React Frontend for Tactile-Text-Vision Multimodal Reasoning System

This is the React frontend for the Multimodal Reasoning System, providing a modern and interactive user interface for tactile, visual, and textual data analysis.

## 🚀 Quick Start

### Prerequisites
- Node.js 16.0 or higher
- npm or yarn package manager
- Backend server running on http://localhost:8000

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
frontend/
├── public/                 # Static files
│   ├── index.html         # HTML template
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/        # React components
│   │   ├── common/        # Reusable UI components
│   │   │   ├── Button.js
│   │   │   ├── InputField.js
│   │   │   ├── FileUpload.js
│   │   │   ├── ModeSelector.js
│   │   │   └── ResultsDisplay.js
│   │   ├── Header.js      # App header
│   │   ├── Navigation.js  # Navigation tabs
│   │   ├── LoadingOverlay.js
│   │   ├── MultimodalAnalysis.js
│   │   ├── QuestionAnswering.js
│   │   ├── FewShotLearning.js
│   │   └── PromptTemplates.js
│   ├── services/          # API services
│   │   └── api.js         # Backend API integration
│   ├── App.js             # Main app component
│   ├── index.js           # React entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
└── README.md              # This file
```

## 🌟 Features

### Core Components

#### 1. **Multimodal Analysis** (`MultimodalAnalysis.js`)
- **Tactile + Text**: Analyze tactile sensor data with textual descriptions
- **Vision + Text**: Process images with accompanying text using GPT-4 Vision
- **Complete Multimodal**: Integrate all three modalities (tactile + vision + text)
- Custom prompt support with real-time validation

#### 2. **Question Answering** (`QuestionAnswering.js`)
- **Single Modality QA**: Questions based on one input type
- **Dual Modality QA**: Questions using combinations of modalities
- **Multimodal QA**: Complete analysis using all three modalities
- Sample questions library with interactive loading

#### 3. **Few-Shot Learning** (`FewShotLearning.js`)
- Dynamic example management with add/remove functionality
- Demo examples loader for quick testing
- Support for image uploads in learning process
- Pattern recognition from training examples

#### 4. **Prompt Templates** (`PromptTemplates.js`)
- Available templates browser
- Custom template creation with validation
- Model information display
- JSON-based template configuration

### Reusable Components

#### **Common UI Components** (`components/common/`)
- **Button**: Styled button with variants (primary, secondary, success, danger)
- **InputField**: Versatile input component supporting text, textarea, and select
- **FileUpload**: Drag & drop file upload with progress indicators
- **ModeSelector**: Mode switching component with icon support
- **ResultsDisplay**: Comprehensive results presentation with metadata

### API Integration (`services/api.js`)
- **Axios-based HTTP client** with interceptors
- **Environment-aware base URLs** (development/production)
- **Comprehensive error handling** and response processing
- **File upload support** with progress tracking
- **Request/response logging** for debugging

## 🎨 Styling

### Styled Components
- **CSS-in-JS** approach using `styled-components`
- **Theme consistency** with centralized color palette
- **Responsive design** with mobile-first approach
- **Modern UI elements** with gradients and animations

### Color Scheme
```css
Primary: #9b59b6 (Purple)
Secondary: #3498db (Blue)
Success: #27ae60 (Green)
Danger: #e74c3c (Red)
Text: #2c3e50 (Dark Gray)
Background: Linear gradient from #667eea to #764ba2
```

### Key Features
- **Smooth animations** and transitions
- **Hover effects** and interactive feedback
- **Loading states** with spinner animations
- **Toast notifications** for user feedback
- **Responsive grid layouts** for optimal viewing

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Desktop**: Full feature set with optimal layout
- **Tablet**: Adapted grid layouts and touch-friendly interfaces
- **Mobile**: Stacked layouts with simplified navigation

## 🔧 Development

### Available Scripts

- `npm start`: Start development server with hot reload
- `npm build`: Create production build
- `npm test`: Run test suite
- `npm eject`: Eject from Create React App (not recommended)

### Environment Variables

The frontend automatically detects the environment:
- **Development**: API calls to `http://localhost:8000`
- **Production**: API calls to the same domain under `/api`

### Proxy Configuration

The development server includes a proxy configuration in `package.json`:
```json
"proxy": "http://localhost:8000"
```

This allows seamless API calls during development without CORS issues.

## 🚀 Deployment

### Production Build

1. **Create production build**
   ```bash
   npm run build
   ```

2. **Serve static files**
   The build folder contains optimized static files that can be served by any web server.

### Integration with Backend

The React frontend is designed to work seamlessly with the FastAPI backend:
- API calls are automatically routed to the correct backend endpoints
- File uploads are handled with proper multipart/form-data encoding
- Error responses are gracefully handled with user-friendly messages

## 🧪 Testing

### Manual Testing Checklist

- [ ] All navigation tabs work correctly
- [ ] File uploads accept images and show progress
- [ ] Form validation prevents invalid submissions
- [ ] API errors are displayed to users
- [ ] Loading states appear during requests
- [ ] Results are displayed correctly
- [ ] Responsive design works on mobile

### Sample Test Data

**Tactile Data Examples:**
- "Smooth, metallic surface with low friction"
- "Rough, grainy texture with high friction"
- "Soft, flexible material with medium grip"

**Task Instructions:**
- "Identify the material and predict use cases"
- "Analyze texture characteristics and properties"
- "Compare with similar materials"

## 🔧 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Ensure backend server is running on port 8000
   - Check proxy configuration in package.json
   - Verify CORS settings on backend

2. **File Upload Issues**
   - Check file size limits (10MB default)
   - Ensure file is a valid image format
   - Verify backend upload endpoint is working

3. **Build Errors**
   - Clear node_modules and reinstall dependencies
   - Check for version conflicts in package.json
   - Ensure Node.js version is 16.0 or higher

### Debug Mode

Enable detailed logging by opening browser developer tools:
- **Network tab**: Monitor API requests and responses
- **Console tab**: View JavaScript errors and API logs
- **Application tab**: Check local storage and session data

## 🤝 Contributing

1. Follow the existing code structure and naming conventions
2. Use styled-components for all styling
3. Implement proper error handling for all API calls
4. Add loading states for all async operations
5. Test responsive design on multiple screen sizes
6. Update this README when adding new features

## 📄 License

This project is part of the Tactile-Text-Vision Multimodal Reasoning System and follows the same license as the main project. 
# BizAssist - AI-Powered Business Assistant

BizAssist is a React Native mobile application that provides an intelligent business assistant powered by Google's Gemini AI. The app enables users to chat with an AI assistant, upload and analyze PDF documents, and export conversations as PDF files.

## 🚀 Features

### Core Functionality
- **AI Chat Interface**: Interactive chat with Gemini AI for business advice and general questions
- **PDF Document Analysis**: Upload PDF documents and ask questions about their content
- **User Authentication**: Simple email/password authentication with persistent sessions
- **Chat Export**: Export entire conversations as professionally formatted PDF files
- **Session Management**: Clear chat sessions and manage document uploads
- **Responsive UI**: Modern, gradient-based design with smooth animations

### Key Capabilities
- **Document Processing**: Upload PDFs up to 10MB for AI analysis
- **Context-Aware Responses**: Personalized responses using user information
- **Markdown Support**: Rich text formatting in chat messages
- **Cross-Platform**: Works on both iOS and Android devices
- **Offline Storage**: Local storage for user sessions and chat history

## 🛠️ Technology Stack

### Frontend
- **React Native** (0.81.5) - Cross-platform mobile development
- **Expo** (~54.0.18) - Development platform and tools
- **Expo Router** (~6.0.13) - File-based navigation
- **TypeScript** (~5.9.2) - Type-safe development

### UI Components
- **React Native Gifted Chat** (^2.8.1) - Advanced chat interface
- **React Native Markdown Display** (^7.0.2) - Markdown rendering
- **Expo Linear Gradient** (^15.0.7) - Gradient backgrounds
- **Expo Vector Icons** (^15.0.3) - Icon library

### AI Integration
- **Google GenAI** (^1.26.0) - Gemini AI SDK
- **Gemini 2.5 Flash** - Primary AI model for text generation

### Storage & File Management
- **AsyncStorage** (^1.24.0) - Local data persistence
- **Expo Document Picker** (~14.0.7) - File selection
- **Expo File System** (~19.0.17) - File operations
- **Expo Print** (~15.0.7) - PDF generation
- **Expo Sharing** (~14.0.7) - File sharing

## 📱 App Structure

```
app/
├── auth/                    # Authentication system
│   ├── context/
│   │   ├── AuthContext.tsx  # Auth state management
│   │   └── types.ts         # Auth type definitions
│   ├── login.tsx           # Login screen
│   ├── signup.tsx          # Registration screen
│   └── styles.ts           # Auth styling
├── home/                   # Main chat interface
│   ├── components/
│   │   ├── ChatUI.tsx      # Chat interface component
│   │   ├── Header.tsx      # App header with actions
│   │   └── LoadingOverlay.tsx # Loading states
│   ├── hooks/
│   │   ├── useChatLogic.ts # Chat functionality logic
│   │   └── useUserContext.ts # User context management
│   ├── home.tsx            # Main home screen
│   └── styles.ts           # Home screen styling
├── models/
│   └── TipsModal.tsx       # Help/tips modal component
├── services/               # Core business logic
│   ├── chatStorageService.ts # Chat persistence
│   ├── documentService.ts  # Document handling
│   ├── geminiPdfService.ts # AI integration
│   ├── userContext.ts      # User context management
│   └── types.ts           # Service type definitions
├── _layout.tsx            # Root layout and navigation
├── index.tsx              # App entry point
└── modal.tsx              # Modal screen
```

## 🔧 Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Expo Go app on your mobile device (for testing)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Environment Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BizAssist
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the Expo development server**
   ```bash
   npx expo start
   ```
   or
   ```bash
   npm start
   ```

### Development Options

#### Option 1: Expo Go (Recommended for Testing)
1. Install Expo Go app on your mobile device
2. Run `npx expo start`
3. Scan the QR code with Expo Go (Android) or Camera app (iOS)
4. Your app will load on your device

#### Option 2: Development Build (iOS Simulator)
```bash
npx expo run:ios
```

#### Option 3: Development Build (Android Emulator)
```bash
npx expo run:android
```

#### Option 4: Web Development
```bash
npx expo start --web
```

### Expo-Specific Commands

#### Start Development Server
```bash
npx expo start
```

#### Clear Cache
```bash
npx expo start --clear
```

#### Install Expo CLI Globally
```bash
npm install -g @expo/cli
```

#### Check Expo Installation
```bash
npx expo --version
```

## 🔑 API Configuration

### Gemini AI Setup
1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Add the key to your `.env` file as `EXPO_PUBLIC_GEMINI_API_KEY`

### Required Permissions
The app requires the following permissions:
- **File Access**: For document upload and PDF export
- **Storage**: For local data persistence
- **Network**: For AI API calls

## 📖 Usage Guide

### Getting Started
1. **Sign Up/Login**: Create an account or sign in with existing credentials
2. **Chat Interface**: Start chatting with BizAssist for general business questions
3. **Upload Documents**: Tap the attach icon (📎) to upload PDF documents
4. **Ask Questions**: Once a document is uploaded, ask specific questions about its content
5. **Export Conversations**: Use the document icon in the header to export chats as PDF

### Key Features Usage

#### Document Analysis
- Upload PDF documents (up to 10MB)
- Wait for processing confirmation
- Ask specific questions about document content
- Get AI-powered insights and summaries

#### Chat Export
- Export entire conversations as professionally formatted PDFs
- Includes document context and metadata
- Share via device's native sharing options

#### Session Management
- Clear chat sessions to start fresh
- Delete uploaded documents
- Maintain user context across sessions

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#0b66c3` - Main brand color
- **Secondary Cyan**: `#06b6d4` - Accent color
- **Background**: `#f6f9fb` - Light background
- **Text Dark**: `#0b2632` - Primary text
- **Text Light**: `#64748b` - Secondary text

### Typography
- **Headers**: Bold, 17-20px
- **Body**: Regular, 13-15px
- **Captions**: Light, 10-12px

### Components
- **Gradient Headers**: Linear gradients for visual appeal
- **Rounded Cards**: 14px border radius for modern look
- **Smooth Animations**: 300ms transitions for interactions

## 🔒 Security & Privacy

### Data Handling
- **Local Storage**: User sessions stored locally using AsyncStorage
- **No Server**: All data processing happens client-side
- **API Keys**: Secured through environment variables
- **Document Processing**: Files processed by Google Gemini API

### User Privacy
- No personal data transmitted to external servers
- Chat history stored locally on device
- Document uploads processed by Google's secure API
- User can clear all data at any time

## 🚀 Deployment

### Expo Application Services (EAS)

#### Install EAS CLI
```bash
npm install -g eas-cli
```

#### Login to EAS
```bash
eas login
```

#### Configure EAS Build
```bash
eas build:configure
```

### Building for Production

#### Android APK/AAB
```bash
eas build --platform android
```

#### iOS App Store
```bash
eas build --platform ios
```

#### Both Platforms
```bash
eas build --platform all
```

### Publishing Updates

#### Publish OTA Update
```bash
eas update
```

#### Publish with Specific Channel
```bash
eas update --channel production
```

### App Store Preparation
1. Update version numbers in `app.json`
2. Configure app icons and splash screens in `app.json`
3. Set up EAS project configuration
4. Test on physical devices using Expo Go or development builds
5. Submit for review through EAS Submit

#### Submit to App Stores
```bash
eas submit --platform android
eas submit --platform ios
```

## 🐛 Troubleshooting

### Common Issues

#### API Key Errors
- Ensure `EXPO_PUBLIC_GEMINI_API_KEY` is set correctly
- Verify API key has proper permissions
- Check for typos in environment variable name
- Restart Expo development server after adding environment variables

#### Document Upload Failures
- Verify PDF file size is under 10MB
- Check file format is valid PDF
- Ensure stable internet connection
- Check device permissions for file access


#### Device Connection Issues
- Ensure device and computer are on same network
- Try using tunnel mode: `npx expo start --tunnel`
- Check firewall settings
- Restart Expo Go app on device

## 🔮 Future Enhancements

### Planned Features
- **Multi-language Support**: Internationalization
- **Voice Input**: Speech-to-text integration
- **Advanced Analytics**: Usage insights and reporting
- **Team Collaboration**: Shared workspaces
- **Integration APIs**: Connect with business tools

### Technical Improvements
- **Offline Mode**: Local AI processing
- **Performance Optimization**: Faster document processing
- **Enhanced Security**: End-to-end encryption
- **Accessibility**: Improved screen reader support

---

**BizAssist** - Your intelligent business companion, powered by AI. 🚀
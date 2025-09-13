# 🚨 SurgeAid

**Rapid volunteer mobilization for disasters and emergencies**

SurgeAid is a community-powered emergency response platform that instantly mobilizes local volunteers through smart SMS alerts. When disaster strikes, every second counts - our platform creates rapid response networks in communities to ensure help arrives quickly.

## 🌟 Features

### 🚨 **Emergency Reporting**
- **Instant reporting**: Report emergencies with precise location data and resource needs
- **Real-time alerts**: Emergency reports trigger immediate SMS notifications to nearby volunteers
- **Live incident feed**: View all active incidents in real-time with status updates

### **Volunteer Network**
- **Simple signup**: Join the volunteer network with basic contact information and skills
- **SMS-based alerts**: No app required - receive emergency notifications via SMS
- **Background verification**: Trusted volunteer network for community safety
- **Skills-based matching**: Volunteers can specify their skills and areas of expertise

### 🗺️ **Live Response Map**
- **Real-time visualization**: Interactive map showing active incidents and volunteer responses
- **Dual data sources**: Displays both USGS earthquake data and community-reported incidents
- **Response tracking**: Monitor volunteer response times and activity

### ⚡ **Rapid Deployment**
- **Sub-60 second response**: From incident report to volunteer alert in under a minute
- **Location-based targeting**: Alerts sent to volunteers in the affected area
- **One-tap response**: Simple SMS interface with response links

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API routes, Firebase Firestore
- **Maps**: Leaflet with React-Leaflet integration
- **SMS Integration**: Twilio API for emergency notifications
- **Real-time Data**: USGS earthquake API integration
- **Icons**: Lucide React for consistent iconography

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Firebase project with Firestore enabled
- Twilio account for SMS functionality

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/surgeaid.git
   cd surgeaid
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a Firebase project at [https://console.firebase.google.com](https://console.firebase.google.com)
   - Enable Firestore Database
   - Update `lib/firebase.js` with your Firebase configuration

4. **Configure Twilio (Optional for SMS alerts)**
   - Sign up at [https://www.twilio.com](https://www.twilio.com)
   - Get your Account SID, Auth Token, and phone number
   - Update `app/api/trigger-alert/route.js` with your Twilio credentials

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
surgeaid/
├── app/
│   ├── api/
│   │   ├── disasters/        # USGS earthquake data API
│   │   └── trigger-alert/    # SMS alert system
│   ├── components/
│   │   ├── NavBar.jsx       # Navigation component
│   │   └── MapDisasters.jsx # Interactive map component
│   ├── map/                 # Live response map page
│   ├── report/              # Emergency reporting page
│   ├── volunteer/           # Volunteer signup page
│   ├── layout.js           # Root layout
│   └── page.js             # Home page
├── lib/
│   └── firebase.js         # Firebase configuration
└── package.json
```

## 🎯 Core Workflows

### 1. **Volunteer Registration**
```
Volunteer visits /volunteer → Fills out form → Data stored in Firestore → SMS alerts enabled
```

### 2. **Emergency Reporting**
```
Incident occurs → Report submitted at /report → Stored in Firestore → SMS sent to volunteers → Map updated
```

### 3. **Real-time Monitoring**
```
Users visit /map → Live incidents displayed → USGS + community data → Response metrics shown
```

## 📊 Database Schema

### Volunteers Collection
```javascript
{
  name: "John Doe",
  phone: "+1234567890",
  skills: "Medical training, CPR certified",
  subscribed: true,
  createdAt: Timestamp
}
```

### Disasters Collection
```javascript
{
  title: "House fire on Main Street",
  description: "Structure fire, need medical support",
  lat: 40.7128,
  lng: -74.0060,
  createdAt: Timestamp
}
```

## 🔧 API Endpoints

### `GET /api/disasters`
Fetches real-time earthquake data from USGS API
- Returns: GeoJSON format earthquake data for the past 24 hours

### `POST /api/trigger-alert`
Sends SMS alerts to subscribed volunteers
- Body: `{ title, description, lat, lng }`
- Returns: Confirmation of SMS delivery status

## 🎨 Design System

SurgeAid uses a carefully crafted color palette optimized for emergency response:

- **Primary Red** (`#c1121f`): Emergency alerts and critical actions
- **Deep Navy** (`#003049`): Volunteer actions and trust elements
- **Warning Amber** (`#fbbf24`): Status indicators and highlights
- **Ocean Blue** (`#669bbc`): Maps and informational elements
- **Warm Cream** (`#fefbf3`): Background for reduced eye strain

## 🚨 Production Deployment

### Environment Variables (Required)
```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

### Build and Deploy
```bash
npm run build
npm run start
```

## 📱 Mobile Optimization

SurgeAid is designed mobile-first with:
- Responsive design for all screen sizes
- Touch-optimized interface elements
- SMS-based alerts (no app installation required)
- Optimized map interactions for mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🎯 Roadmap

- [ ] **Advanced Analytics**: Response time analytics and volunteer performance metrics
- [ ] **Multi-language Support**: Localization for diverse communities
- [ ] **Weather Integration**: Automatic weather-related emergency detection
- [ ] **Training Modules**: Built-in volunteer training and certification system
- [ ] **Resource Tracking**: Inventory management for emergency supplies
- [ ] **Incident Command Integration**: Professional emergency response coordination

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For questions, issues, or support:
- **Documentation**: Check this README and inline code comments
- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Community**: Join our community discussions for help and ideas

---

**🚨 SurgeAid - When disaster strikes, communities rise together.**

*Built with ❤️ for safer, more connected communities*

# Grocery List App

A modern web application that helps users manage their grocery shopping by creating and organizing shopping lists based on their favorite recipes.

## 🚀 Features

- **Authentication**
  - Secure user accounts with email/password login
  - Personal data storage and management

- **Recipe Management**
  - Import recipes from URLs
  - Scan recipes from images using OCR
  - Manual recipe entry
  - Store ingredients, amounts, and preparation steps
  - Search recipes by ingredients

- **Grocery List Creation**
  - Create lists from selected recipes
  - Add/remove individual items
  - Customize quantities and units
  - Mark items as purchased
  - Real-time updates across devices

- **Unit Customization**
  - Configurable measurement units for recipes
  - Flexible unit conversion for grocery lists

## 🛠️ Tech Stack

- **Frontend**
  - React
  - Redux for state management
  - Tailwind CSS for styling
  - React Router for navigation

- **Backend**
  - Firebase Authentication
  - Firebase Firestore
  - Firebase Hosting
  - Firebase Functions
  - Firebase ML Kit for OCR

## 🏗️ Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/grocery-list-app.git
   cd grocery-list-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration:
   ```
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

## 🚀 Deployment

The app automatically deploys to Firebase Hosting through GitHub Actions when changes are pushed to the main branch.

Manual deployment:
```bash
npm run build
firebase deploy
```


## 📱 Usage

1. Create an account or log in
2. Add your favorite recipes:
   - Import from URLs
   - Scan recipe images
   - Enter manually
3. Create grocery lists:
   - Select recipes to include
   - Adjust quantities as needed
   - Add additional items
4. Use your list while shopping:
   - Check off items as you go
   - Add last-minute items
   - Share lists with family members

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 👥 Authors

- Your Name - *Initial work* - [YourGitHub](https://github.com/yourusername)

## 🙏 Acknowledgments

- Firebase team for the excellent backend services
- React community for the amazing frontend framework
- All contributors who help improve this project
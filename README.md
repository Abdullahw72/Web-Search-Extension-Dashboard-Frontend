# MyShell Profile Page Clone

A React application that replicates the MyShell profile page UI using Tailwind CSS.

## Features

- **Modern Profile Layout**: Clean, professional profile page design
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Interactive Components**: 
  - Tabbed navigation for different sections
  - Statistics dashboard with key metrics
  - AI Agents grid with cards showing agent details
  - Social links and profile information
- **Tailwind CSS**: Modern utility-first CSS framework for styling
- **React Components**: Modular, reusable component architecture

## Components

- `Header`: Navigation bar with logo and user menu
- `ProfileHeader`: User profile information with avatar and social links
- `StatsSection`: Key metrics and statistics display
- `TabsSection`: Tabbed interface for different content sections
- `AgentsGrid`: Grid layout for displaying AI agents

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- JavaScript (ES6+)

## Project Structure

```
src/
├── components/
│   ├── Header.jsx
│   ├── ProfileHeader.jsx
│   ├── StatsSection.jsx
│   ├── TabsSection.jsx
│   ├── AgentsGrid.jsx
│   └── ProfilePage.jsx
├── App.jsx
├── index.css
└── main.jsx
```

## Customization

The application is built with Tailwind CSS, making it easy to customize colors, spacing, and other design elements. You can modify the design by updating the Tailwind classes in the component files or by extending the Tailwind configuration in `tailwind.config.js`.
# laravel-big-data
laravel and BigData Analytic demo

Tech Stack for This Application
Frontend (What You're Seeing)
    • React 18+ - JavaScript UI library for building the interface
    • Recharts - Charting library for data visualizations (bar charts, line graphs)
    • Lucide React - Icon library for UI icons
    • Tailwind CSS - Utility-first CSS framework for styling
    • JavaScript ES6+ - Modern JavaScript features (async/await, arrow functions, etc.)
Runtime Environment
    • Browser - Runs entirely client-side (Chrome, Firefox, Safari, etc.)
    • No backend server - Pure frontend application
Data Source
    • Open-Meteo Archive API - REST API for historical weather data
        ◦ Endpoint: https://archive-api.open-meteo.com/v1/archive
        ◦ Format: JSON
        ◦ No authentication required
Build System (Claude Artifacts)
    • Artifacts use a pre-configured React environment with:
        ◦ Babel transpiler (for JSX)
        ◦ Webpack bundler (for module bundling)
        ◦ Pre-installed libraries

If This Were a Real Laravel App:
Backend Stack Would Include:
Frontend	Backend	Database	WebServer	Server
Blade/ReactVue	Laravel 11 (PHP 8.2+)	MySQL 8.0 / PostgreSQL 15+
Redis (caching/queues)	Nginx / Apache
PHP-FPM	Ubuntu 22.04/Amazon Linux

Additional Laravel Tools:
    • Composer - PHP dependency manager
    • NPM/Yarn - JavaScript package manager
    • Laravel Mix/Vite - Asset compilation
    • Artisan - Laravel command-line tool
    • PHPUnit - Testing framework
Deployment Options:
    • Laravel Forge - Server management
    • Laravel Vapor - Serverless deployment on AWS
    • Docker - Containerization
    • Kubernetes - Container orchestration

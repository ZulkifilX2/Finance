# Sentinel Finance Engine

**The "Runway" Predictor for Your Finances.**

Sentinel is a full-stack financial analytics tool that goes beyond simple tracking. It uses **Linear Regression** to predict your financial runway, telling you exactly how long your money will last based on your current spending habits.

![Sentinel Dashboard](https://via.placeholder.com/800x400?text=Sentinel+Dashboard+Mockup)

## 🚀 Key Features

*   **Intelligent Forecasting**: Uses `scikit-learn` linear regression to predict your balance 12 months out.
*   **Dirty Data Engine**: Automatically cleans and standardizes messy CSV exports from various banks.
*   **Runway Calculation**: Calculates your exact "burn rate" and days until zero balance.
*   **Interactive Dashboard**: Built with React, Tailwind CSS, and Recharts for beautiful, responsive visualizations.
*   **Scenario Planning**: "Ignore" large one-off expenses to see how your runway changes instantly.

## 🛠️ Tech Stack

### Backend (The Brain)
*   **FastAPI**: High-performance Python web framework.
*   **Pandas**: For robust data manipulation and cleaning.
*   **Scikit-Learn**: For the linear regression predictive model.
*   **Pydantic**: For data validation and serialization.

### Frontend (The Face)
*   **React 18**: For a dynamic, component-based UI.
*   **Tailwind CSS**: For modern, utility-first styling.
*   **Recharts**: For the interactive financial charts.
*   **Axios**: For seamless API communication.

## 🏃‍♂️ How to Run

### Prerequisites
*   Python 3.9+
*   Node.js 16+

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/sentinel-finance.git
cd sentinel-finance
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
The API will be running at `http://localhost:8000`.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The app will open at `http://localhost:3000`.

### 4. Try it out!
Use the included `test_transactions.csv` file in the root directory to test the upload and forecast features immediately.

## 📂 Project Structure

```
sentinel-finance/
├── backend/
│   ├── app/
│   │   ├── main.py          # Application entry point
│   │   ├── models.py        # Pydantic data models
│   │   ├── routers/         # API endpoints
│   │   └── services/        # Business logic (Parser, Analytics)
│   └── requirements.txt
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/      # React components (Charts, KPI Cards)
│       └── App.js           # Main application logic
└── test_transactions.csv    # Demo data
```

## 🔮 Future Roadmap
*   User Authentication (Auth0/JWT)
*   Database Persistence (PostgreSQL)
*   Category-based Budgeting
*   Mobile App (React Native)

---
*Built with ❤️ by [Your Name]*

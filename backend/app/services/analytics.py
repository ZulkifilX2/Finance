import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

class AnalyticsEngine:
    @staticmethod
    def calculate_runway(transactions_df):
        if transactions_df.empty:
            return 0, 0, "No data available."

        # Ensure date is datetime
        transactions_df['date'] = pd.to_datetime(transactions_df['date'])

        # Calculate daily cumulative balance
        transactions_df = transactions_df.sort_values('date')

        # We need a starting balance. For this MVP, we assume the user starts from 0 or just track the flow.
        transactions_df['balance'] = transactions_df['amount'].cumsum()

        # Prepare for Regression
        # X = Days from start
        start_date = transactions_df['date'].min()
        transactions_df['days_since_start'] = (transactions_df['date'] - start_date).dt.days

        X = transactions_df[['days_since_start']].values.reshape(-1, 1)
        y = transactions_df['balance'].values

        if len(X) < 2:
            current_balance = transactions_df['balance'].iloc[-1] if not transactions_df.empty else 0
            return 999, float(current_balance), "Not enough data"

        model = LinearRegression()
        model.fit(X, y)

        slope = model.coef_[0] # Daily change
        intercept = model.intercept_

        current_balance = transactions_df['balance'].iloc[-1]
        last_day = transactions_df['days_since_start'].max()

        # Forecast 1 year out
        future_days = 365
        projected_balance_1yr = model.predict([[last_day + future_days]])[0]

        # Savings Growth / Runway
        if slope >= 0:
            months_until_zero = 999 # Infinite
            runway_message = "Sustainable Growth (Infinite Runway)"
        else:
            # Avoid division by zero
            slope = float(slope)
            if slope == 0:
                 days_remaining = 0
            else:
                 days_remaining = -current_balance / slope

            # Ensure days remaining is positive (if balance is already negative, 0)
            if days_remaining < 0: days_remaining = 0

            months_until_zero = int(days_remaining / 30)
            runway_message = f"{months_until_zero} Months Runway"

        return months_until_zero, projected_balance_1yr, runway_message

    @staticmethod
    def get_monthly_summary(transactions_df):
        if transactions_df.empty:
            return []

        transactions_df['date'] = pd.to_datetime(transactions_df['date'])
        transactions_df['month_dt'] = transactions_df['date'].dt.to_period('M')

        # Group by month
        summary = transactions_df.groupby('month_dt')['amount'].agg([
            ('net_flow', 'sum'),
            ('income', lambda x: x[x>0].sum()),
            ('expenses', lambda x: x[x<0].sum())
        ]).reset_index()

        summary['month'] = summary['month_dt'].astype(str)

        return summary[['month', 'income', 'expenses', 'net_flow']].to_dict(orient='records')

    @staticmethod
    def get_spending_by_category(transactions_df):
        if transactions_df.empty:
            return []

        # Only expenses (negative amounts)
        expenses = transactions_df[transactions_df['amount'] < 0].copy()
        if expenses.empty:
            return []

        # Make positive
        expenses['amount'] = expenses['amount'].abs()

        by_category = expenses.groupby('category')['amount'].sum().reset_index()
        by_category = by_category.sort_values('amount', ascending=False)

        return by_category.to_dict(orient='records')

    @staticmethod
    def get_balance_history(transactions_df):
        if transactions_df.empty:
            return []

        transactions_df['date'] = pd.to_datetime(transactions_df['date'])
        transactions_df = transactions_df.sort_values('date')
        transactions_df['balance'] = transactions_df['amount'].cumsum()

        # Daily closing balance
        daily_balance = transactions_df.groupby('date')['balance'].last().reset_index()
        daily_balance['date'] = daily_balance['date'].dt.strftime('%Y-%m-%d')

        return daily_balance.to_dict(orient='records')

    @staticmethod
    def process_transactions(transactions_data):
        df = pd.DataFrame(transactions_data)

        # Ensure date format
        if not df.empty and 'date' in df.columns:
             df['date'] = pd.to_datetime(df['date'])

        # Check if empty or no amounts
        if df.empty or 'amount' not in df.columns:
             return {
                "current_balance": 0.0,
                "avg_monthly_burn": 0.0,
                "forecast": {
                    "months_until_zero": 0,
                    "projected_savings_1yr": 0.0,
                    "runway_message": "No data"
                },
                "monthly_summary": [],
                "balance_history": [],
                "spending_by_category": []
             }

        # Calculate monthly summary
        monthly_summary = AnalyticsEngine.get_monthly_summary(df)

        # Calculate Forecast
        months_until_zero, projected_savings_1yr, runway_message = AnalyticsEngine.calculate_runway(df)

        # Calculate Balance History
        balance_history = AnalyticsEngine.get_balance_history(df)

        # Calculate Spending by Category
        spending_by_category = AnalyticsEngine.get_spending_by_category(df)

        # Calculate simple metrics
        total_balance = df['amount'].sum()

        # Burn Rate (Average monthly expenses)
        expenses = df[df['amount'] < 0]
        if not expenses.empty:
             monthly_expenses = expenses.groupby(expenses['date'].dt.to_period('M'))['amount'].sum()
             avg_burn_rate = abs(monthly_expenses.mean())
        else:
             avg_burn_rate = 0

        return {
            "current_balance": round(float(total_balance), 2),
            "avg_monthly_burn": round(float(avg_burn_rate), 2),
            "forecast": {
                "months_until_zero": int(months_until_zero),
                "projected_savings_1yr": round(float(projected_savings_1yr), 2),
                "runway_message": runway_message
            },
            "monthly_summary": monthly_summary,
            "balance_history": balance_history,
            "spending_by_category": spending_by_category
        }

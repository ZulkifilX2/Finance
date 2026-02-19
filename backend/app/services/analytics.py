import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

class AnalyticsEngine:
    @staticmethod
    def calculate_runway(transactions_df):
        if transactions_df.empty:
            return 0, 0, "No data available."

        # Ensure date is datetime
        transactions_df['date'] = pd.to_datetime(transactions_df['date'])

        # Calculate daily cumulative balance
        # Sort by date
        transactions_df = transactions_df.sort_values('date')

        transactions_df['balance'] = transactions_df['amount'].cumsum()

        # Prepare for Regression
        # X = Days from start
        start_date = transactions_df['date'].min()
        transactions_df['days_since_start'] = (transactions_df['date'] - start_date).dt.days

        X = transactions_df[['days_since_start']].values.reshape(-1, 1)
        y = transactions_df['balance'].values

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
            runway_message = "Wealth Accumulation (Infinite Runway)"
        else:
            days_remaining = -current_balance / slope
            months_until_zero = int(days_remaining / 30)
            runway_message = f"{months_until_zero} Months Runway"

        return months_until_zero, projected_balance_1yr, runway_message

    @staticmethod
    def get_monthly_summary(transactions_df):
        if transactions_df.empty:
            return []

        transactions_df['date'] = pd.to_datetime(transactions_df['date'])
        transactions_df['month_dt'] = transactions_df['date'].dt.to_period('M')

        summary = transactions_df.groupby('month_dt')['amount'].agg(['sum', lambda x: x[x>0].sum(), lambda x: x[x<0].sum()])
        summary.columns = ['net_flow', 'income', 'expenses']
        summary = summary.reset_index()
        summary['month'] = summary['month_dt'].astype(str)

        return summary[['month', 'income', 'expenses', 'net_flow']].to_dict(orient='records')

    @staticmethod
    def process_transactions(transactions_data):
        df = pd.DataFrame(transactions_data)

        # Ensure date format
        if not df.empty and 'date' in df.columns:
             df['date'] = pd.to_datetime(df['date'])

        # Calculate monthly summary
        monthly_summary = AnalyticsEngine.get_monthly_summary(df)

        # Calculate Forecast
        months_until_zero, projected_savings_1yr, runway_message = AnalyticsEngine.calculate_runway(df)

        # Calculate simple metrics
        total_balance = df['amount'].sum() if not df.empty else 0

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
            "monthly_summary": monthly_summary
        }

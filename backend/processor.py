import pandas as pd

def process_expenses(file_path):
    df = pd.read_csv(file_path)
    
    # Standardize data
    df['Date'] = pd.to_datetime(df['Date'])
    df['Amount'] = pd.to_numeric(df['Amount'])
    
    # Calculate Monthly Summary
    monthly = df.groupby(df['Date'].dt.to_period('M'))['Amount'].sum()
    
    # Calculate "Burn Rate" (Average of last 3 months of expenses)
    # Assuming expenses are negative values
    expenses_only = df[df['Amount'] < 0]
    avg_monthly_burn = expenses_only.groupby(expenses_only['Date'].dt.to_period('M'))['Amount'].sum().mean()
    
    return {
        "total_spent": float(df[df['Amount'] < 0]['Amount'].sum()),
        "avg_burn_rate": round(float(avg_monthly_burn), 2),
        "transactions": df.to_dict(orient='records')
    }

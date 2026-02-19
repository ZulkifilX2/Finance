from pydantic import BaseModel
from typing import List, Optional, Dict

class Transaction(BaseModel):
    id: str
    date: str
    description: str
    amount: float
    category: Optional[str] = "Uncategorized"

class Forecast(BaseModel):
    months_until_zero: int
    projected_savings_1yr: float
    runway_message: str

class MonthlySummary(BaseModel):
    month: str
    income: float
    expenses: float
    net_flow: float

class BalanceHistory(BaseModel):
    date: str
    balance: float

class SpendingByCategory(BaseModel):
    category: str
    amount: float

class DashboardResponse(BaseModel):
    current_balance: float
    avg_monthly_burn: float
    forecast: Forecast
    transactions: List[Transaction]
    monthly_summary: List[MonthlySummary]
    balance_history: List[BalanceHistory]
    spending_by_category: List[SpendingByCategory]

class TransactionList(BaseModel):
    transactions: List[Transaction]

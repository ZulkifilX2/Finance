import pandas as pd
from io import BytesIO
from datetime import datetime
import chardet

class DataParser:
    @staticmethod
    def normalize_columns(df):
        # Map for common headers
        column_map = {
            'Amount': 'amount',
            'Cost': 'amount',
            'Value': 'amount',
            'Transaction Amount': 'amount',
            'Debit': 'amount',
            'Date': 'date',
            'Transaction Date': 'date',
            'Posted Date': 'date',
            'Description': 'description',
            'Memo': 'description',
            'Name': 'description',
            'Category': 'category'
        }

        # Lower case map for robust matching
        normalized_map = {}
        for k, v in column_map.items():
            normalized_map[k] = v
            normalized_map[k.lower()] = v
            normalized_map[k.upper()] = v
            normalized_map[k.title()] = v

        df = df.rename(columns=lambda x: normalized_map.get(x, x))

        # Ensure we have required columns
        required = ['date', 'amount']
        missing = [col for col in required if col not in df.columns]
        if missing:
            raise ValueError(f"Missing required columns: {missing}")

        return df

    @staticmethod
    def auto_categorize(description):
        if not isinstance(description, str):
            return 'Uncategorized'

        description = description.lower()
        if any(x in description for x in ['salary', 'deposit', 'transfer', 'payroll']):
            return 'Income'
        if any(x in description for x in ['uber', 'lyft', 'taxi', 'gas', 'shell', 'bp', 'chevron']):
            return 'Transport'
        if any(x in description for x in ['grocery', 'whole foods', 'trader joes', 'safeway', 'kroger', 'walmart']):
            return 'Groceries'
        if any(x in description for x in ['restaurant', 'cafe', 'starbucks', 'mcdonalds', 'burger', 'pizza', 'sushi', 'doordash', 'ubereats']):
            return 'Dining'
        if any(x in description for x in ['netflix', 'hulu', 'spotify', 'movie', 'cinema', 'game', 'steam', 'playstation']):
            return 'Entertainment'
        if any(x in description for x in ['rent', 'mortgage', 'utility', 'electric', 'water', 'internet', 'comcast', 'verizon']):
            return 'Housing/Utilities'
        return 'Uncategorized'

    @staticmethod
    def clean_data(df):
        # Clean Date
        try:
            df['date'] = pd.to_datetime(df['date'], errors='coerce')
        except Exception:
            pass # Try best effort

        df = df.dropna(subset=['date']) # Drop rows with invalid dates

        # Clean Amount
        # Remove '$', ',', etc if present
        if df['amount'].dtype == 'object':
            df['amount'] = df['amount'].replace(r'[\$,]', '', regex=True)

        df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
        df = df.dropna(subset=['amount'])

        # Sort by date
        df = df.sort_values('date')

        # Add ID for frontend key
        df['id'] = df.index.astype(str)

        # Ensure description exists
        if 'description' not in df.columns:
            df['description'] = 'No Description'

        df['description'] = df['description'].fillna('No Description')

        # Auto Categorize logic
        if 'category' not in df.columns:
             df['category'] = df['description'].apply(DataParser.auto_categorize)
        else:
             df['category'] = df['category'].fillna('Uncategorized')
             # If category is 'Uncategorized', try to auto-categorize
             mask = df['category'] == 'Uncategorized'
             if mask.any():
                 df.loc[mask, 'category'] = df.loc[mask, 'description'].apply(DataParser.auto_categorize)

        return df

    @classmethod
    def parse_csv(cls, file_content: bytes):
        try:
            # Detect encoding
            result = chardet.detect(file_content)
            encoding = result['encoding'] or 'utf-8'

            df = pd.read_csv(BytesIO(file_content), encoding=encoding)
            df = cls.normalize_columns(df)
            df = cls.clean_data(df)

            # Convert to list of dicts for Pydantic
            # Convert date to string for JSON serialization
            df['date'] = df['date'].dt.strftime('%Y-%m-%d')

            return df.to_dict(orient='records')
        except Exception as e:
            raise ValueError(f"Error processing CSV: {str(e)}")

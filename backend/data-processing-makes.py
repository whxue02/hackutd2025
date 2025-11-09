import pandas as pd

# read the CSV file
df = pd.read_csv('toyota_trims_2020_onwards.csv')
df['year'] = df['year'] + 5
def update_hack_id(hack_id):
    year_str = hack_id[:4]
    year = int(year_str)
    new_year = year + 5
    return str(new_year) + hack_id[4:]

df['hack-id'] = df['hack-id'].apply(update_hack_id)

# calculate estimated current cost (2025) and expected value in 2027
# depreciation curve: residual values by year
value = [1, 0.84, 0.72, 0.61, 0.52, 0.45, 0.4275, 0.41]

def calculate_current_cost(row):
    year_diff = 2025 - row['year']
    if year_diff < 0 or year_diff >= len(value):
        return None
    return value[year_diff] * row['msrp']

def calculate_expected_value_2027(row):
    year_diff = 2027 - row['year']
    if year_diff < 0 or year_diff >= len(value):
        return None
    return value[year_diff] * row['msrp']

df['estimated_current_cost'] = df.apply(calculate_current_cost, axis=1)
df['expected_value_2027'] = df.apply(calculate_expected_value_2027, axis=1)

# add empty column for img_path
df['img_path'] = ''

# save the processed CSV
df.to_csv('car_data_processed.csv', index=False)

print("Processing complete! File saved as 'car_data_processed.csv'")
print(f"\nProcessed {len(df)} rows")
print("\nFirst few rows of processed data:")
print(df[['hack-id', 'year', 'msrp', 'estimated_current_cost', 'expected_value_2027', 'img_path']].head())
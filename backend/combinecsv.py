import pandas as pd

# Combine CSV files xxx1.csv to xxx12.csv
name = 'toyota_trims_2020_onwards'
combined = pd.concat(
    [pd.read_csv(f'{name}{i}.csv') for i in range(1, 3)],
    ignore_index=True
)

# Save combined file
combined.to_csv(f'{name}.csv', index=False)

print(f'✅ Combined CSV saved as {name}.csv')